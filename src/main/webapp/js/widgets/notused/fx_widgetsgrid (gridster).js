var fx_widgetsgrid = (function() {

  var html_base = 'html/widgets/fx_widgetsgrid_fragments.html',
      s_grid = '#fx_widgetsgrid_grid',
      s_btns = '#fx_widgetsgrid_btns',
      s_grid_container = '#fx_widgetsgrid_container',
      widget_name = 'fx_widgetsgrid',
      btn_clearall = '#fx_widgetsgrid_clearall',
      btn_additem = '#fx_widgetsgrid_additem';

  //Multilanguage
  var file_labels = 'fx_widgetsgrid',
      path_labels = 'labels/widgets/fx_widgetsgrid/';

  var controller, lang, gridster;

  var $container, $d, $btn_clearall, $btn_additem, $grid, $list, $btns_container, $btns, $fragments;

  function init(c, h, hbtn){
      controller = c;

      $container = $(h);
      $container.empty();

      $btns_container = $(hbtn);
  }

  function render( l ){
      
      //Init listeners for widget removing, storing and minimizing
      initEventListeners();

      //Set language and correct labels
      l ? lang = l : lang = controller.lang();

      switch (lang) {
        case 'IT' : I18NLang = 'it_IT'; break;
        case 'FR' : I18NLang = 'fr_FR'; break;
        case 'ES' : I18NLang = 'es_ES'; break;
        default: I18NLang = 'en_US'; break;
      }

      //Callback loads grid HTML base and initialize the elements
      $.i18n.properties({
          name: file_labels, 
          path: path_labels, 
          mode:'both',
          language: I18NLang, 
          callback: loadstructure
      });
  }

  function loadstructure(){
    
    $.get(html_base, function( d ) {

      $fragments = $(d);
      
      $d = $fragments.find(s_grid_container);
      $btns = $fragments.find(s_btns);
      $btn_clearall = $btns.find(btn_clearall);
      $btn_additem = $btns.find(btn_additem);
      $grid =  $d.find(s_grid);
      $list = $grid.find('ul');

      //Set callback and Label to clearall btns
      $btn_clearall.click(remove_all_widgets)
      $btn_clearall.html($.i18n.prop('_btn_clearall'))

      //Set callback and Label to addelem btns
      $btn_additem.click(add_widget)
      $btn_additem.html($.i18n.prop('_btn_additem'))

      $container.html($d);
      $btns_container.html($btns);

      //Init Gridster grid
      //The initialization should be done before the html()
      initGridster();

      raiseCustomEvent(document.body, "loadcompleted.widget.fenix", {id: widget_name});
      
      }, 'html');
  }

  function initGridster(){
    var max_cols = 2;
    var container_width = $container.width();
    var dim = parseInt((container_width - (10 * max_cols * 2)) / max_cols);

    var obj = { widget_margins: [10, 10],
                widget_base_dimensions: [dim, dim],
                max_cols: max_cols };

    gridster = $list.gridster( obj ).data('gridster');
  }

  function removeItem( e ){
    
    gridster.remove_widget( e );
  }

  function addItem( e ){

    gridster.add_widget(e, 1, 1, 1, 1);
  }

  function add_widget(){

    var d = document.createElement('div');
    addItem(d);

    var w = new fx_viewwidget();
    w.render(d , lang, null);       
  }

  function remove_all_widgets(){

    console.log(gridster)
    gridster.remove_all_widgets();
  }

  function initEventListeners(){

    document.body.addEventListener("remove.viewwidget.widget.fenix", function(event){
      gridster.remove_widget( $(event.detail.widget) );
    }, false);

    document.body.addEventListener("resize.viewwidget.widget.fenix", function(event){

      //createModal(event.detail.widget)
      //console.log(gridster)

      //$(event.detail.widget).data('row', 1)
      //$(event.detail.widget).data('col', 1)
      //gridster.update_widget_position( $(event.detail.widget), 1, 1 )

      event.detail.flag_enlarged ? gridster.resize_widget( $(event.detail.widget), 1, 1 ) : gridster.resize_widget( $(event.detail.widget), 2, 1 );
      gridster.recalculate_faux_grid()
    
    }, false);

    document.body.addEventListener("minimize.viewwidget.widget.fenix", function(event){
      gridster.remove_widget( $(event.detail.widget) );
      raiseCustomEvent(document.body, "store.gridster.widget.fenix", {json: event.detail.json});
    }, false);
  }

  function createModal( w ){

    var m = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
            '<div class="modal-dialog">' +
             ' <div class="modal-content">' +
                '<div class="modal-header">' +
                  '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                  '<h4 class="modal-title">Widget</h4>' +
                '</div>' +
                '<div id="modal-body">' +
                '</div>' +
                '<div class="modal-footer">' +
                  '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                  '<button type="button" class="btn btn-primary">Save changes</button>' +
                '</div>' +
              '</div><!-- /.modal-content -->' +
            '</div><!-- /.modal-dialog -->' +
          '</div><!-- /.modal -->';

    $('#modal').html(m)
    $('#modal-body').html(w)
    $('#myModal').modal('toggle')

  }

  return {  init : init,
            render : render,
            removeItem : removeItem,
            addItem : addItem,
            add_widget : add_widget }

})();