var fx_widgetsgrid = (function() {

  var html_base     = 'html/widgets/fx_widgetsgrid_fragments.html',
      s_grid        = '#fx_widgetsgrid_grid',
      s_btns        = '#fx_widgetsgrid_btns',
      s_grid_container = '#fx_widgetsgrid_container',
      widget_name   = 'fx_widgetsgrid',
      btn_clearall  = '#fx_widgetsgrid_clearall',
      btn_additem   = '#fx_widgetsgrid_additem';

  //Multilanguage
  var file_labels = 'fx_widgetsgrid',
      path_labels = 'labels/widgets/fx_widgetsgrid/';

  var controller, lang, pckry;

  var $container, $d, $btn_clearall, $btn_additem, $grid, $btns_container, $btns, $fragments;

  function init(c, h, hbtn){
      
      controller = c;

      $container = $(h);
      $container.empty();

      $btns_container = $(hbtn);
  
  };

  function render( l ){
      
      //Set language and correct labels
      l ? lang = l : lang = controller.lang();

      switch (lang) {
        case 'IT' : I18NLang = 'it'; break;
        case 'FR' : I18NLang = 'fr'; break;
        case 'ES' : I18NLang = 'es'; break;
        default: I18NLang = 'en'; break;
      }

      loadstructure();

      //Uncomment to load external lables
      //Callback loads grid HTML base and initialize the elements
      /*
      $.i18n.properties({
          name: file_labels, 
          path: path_labels, 
          mode:'both',
          language: I18NLang, 
          callback: loadstructure
      });
      */
  
  };

  function loadstructure(){
    
    $.get(html_base, function( d ) {

      $fragments = $(d);
      
      $d = $fragments.find(s_grid_container);
      $btns = $fragments.find(s_btns);
      $btn_clearall = $btns.find(btn_clearall);
      $btn_additem = $btns.find(btn_additem);
      $grid =  $d.find(s_grid);

      //Init controller btns 
      initBtns();

      $container.html($d);
      $btns_container.html($btns);

      //Init pckry grid
      //The initialization should be done before the html()
      initpckry();

      raiseCustomEvent(document.body, "loadcompleted.widget.fenix", {id: widget_name});
      
      }, 'html');
 
  };

  function initBtns(){

     //Set callback and Label to clearall btns
      $btn_clearall.click(remove_all_widgets)
      //$btn_clearall.html($.i18n.prop('_btn_clearall'))
  
  };

  function initpckry(){

    $grid.packery({ columnWidth : '.item',
                    itemSelector: '.item',
                    columnWidth : '.item',
                  });

    pckry = $grid.data('packery');

  /* 
  Uncomment here if elements are already present in the Desk

    //Make each exsiting item draggable
    var itemElems = pckry.getItemElements();
    for ( var i=0, len = itemElems.length; i < len; i++ ) {
      var elem = itemElems[i];
      // make element draggable with Draggabilly
      var draggie = new Draggabilly( elem, {
        handle: '.fx-handle'
      });
      // bind Draggabilly events to Packery
      pckry.bindDraggabillyEvents( draggie );
    }

    //Make each item fittable to container 
    eventie.bind( document.querySelector(s_grid), 'click', function(event) {
      // don't proceed if item was not clicked on
      var target = event.target;
      console.log(target)
      if ( !classie.has( target, 'item' ) ) { return; }

      var isGigante = classie.has( target, 'gigante' );
      classie.toggleClass( target, 'gigante' );

      if ( isGigante ) {
        // if shrinking, just layout
        pckry.layout();
      } else {
        // if expanding, fit it
        pckry.fit( target );
      }
    });
  */
  
  };

  function removeItem( e ){
    
    pckry.remove( e.parent() );
    pckry.layout();
  
  };

  function addItem(e, json, gigante){
    
    var d = getItemElement();
    // append elements to container
    $grid.append( d );

    //Render widget
    var w = e();
    w.render({
      container : d.querySelector('.fx-content'),
      json      : json
    });  
    
    // add and lay out newly appended elements
    pckry.prepended( d );

    // create random item element
    function getItemElement() {
     
      var elem = document.createElement('div');
      elem.className = 'item';
      if (gigante === true)  elem.className = 'item gigante';
      
      var handle = document.createElement('div');
      handle.className = 'fx-handle';
      elem.appendChild(handle);
     
      var content = document.createElement('div');
      content.className = 'fx-content';
      elem.appendChild(content);

      var draggie = new Draggabilly( elem, {
        containment: s_grid,
        handle: '.fx-handle'
      });

      pckry.bindDraggabillyEvents( draggie );

      return elem;
    }     
  
  };

  function remove_all_widgets(){
    
    pckry.remove( pckry.getItemElements() )
    // layout remaining item elements
    pckry.layout();

  };

  function minimizeItem( e ){

    pckry.remove( e.parent() );
    pckry.layout();
  
  };

  function resizeItem( target ){

    var t = target.parentNode;
    if ( !classie.has( t, 'item' ) ) {
      return;
    }

    var isGigante = classie.has( t, 'gigante' );
    classie.toggleClass( t, 'gigante' );

    if ( isGigante ) {
      // if shrinking, just layout
      pckry.layout();
    } else {
      // if expanding, fit it
      pckry.fit( t );
    }

  };

  return  { init        : init,
            render      : render,
            removeItem  : removeItem,
            addItem     : addItem,
            minimizeItem : minimizeItem,
            resizeItem  : resizeItem
          }

})();