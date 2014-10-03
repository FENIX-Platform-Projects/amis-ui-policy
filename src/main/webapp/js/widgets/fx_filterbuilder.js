var fx_filterbuilder = (function() {

  //Default Options
  var defaultOptions = {
      widget_name   : 'fx_filterbuilder',
      html_base     : 'html/widgets/fx_filterbuilder_fragments.html',
      json_conf     : 'json/fx_filterbuilder.json', 
      s_base        : '.fx-viewwidget',
      s_panel       : '#fx_filterquery_panel',
      s_c_widget    : '#fx_filterquery_panelcontent',
      s_closepanelbtn : '#fx_closeform_btn',
      alertcont     : 'alert-container',
      e_langchange  : "langchage.topmenu.fenix",
      errorMsg      : "Error on rendering process. Please contact the assistence",
      e_base        : '.fx_filterbuilder.widget.fenix'
    };

  var o = {}, currentSearch = null, hiddenpanel, json_pageelem, lang, ctrl, fb;
  var $container, $fragments, $d, $panel;

  function init(baseOptions){

    //Merge options
    $.extend(true, o, defaultOptions);
    $.extend(true, o, baseOptions);
    
    //Init event listeners
    initEventListeners();
  
  }

  function render( baseOptions ) {

    $.extend(true, o, baseOptions);
    ctrl  = o.controller;

    if(!o.container) alert('fx_filterbuilder.js error: please define a container!');
    fb = o.container;
    $container = $(fb);
    $container.empty();

    //Set language and correct labels
    o.l ? lang = o.l : lang = ctrl.lang();

    $.get(o.html_base, function( d ) {

      $d      = $(d);
      $panel  = $d.find(o.s_panel);
      $close_btn = $d.find(o.s_closepanelbtn);

    $.getJSON(o.json_conf, function( result ){
        
        json_pageelem = result;

        //Initialize the whole set of Btns, including the close panel btn
        initBtns($d);   

        $container.html($d);
        $close_btn.hide();

        $panel.hide(); 

        raiseCustomEvent(fb, "loadcompleted.widget.fenix", {id: o.widget_name});
    }).error('Impossible to load JSON for fx_filterbuilder.js'); 

    }, 'html').error('Impossible to load HTML for fx_filterbuilder.js'); 

  }

  function initEventListeners(){

      document.body.addEventListener("loadcompleted.searchwidget"+o.e_base, function(event){
        $panel.slideDown('slow');
        $close_btn.fadeIn();
        hiddenpanel = false;
      }, false);

      document.body.addEventListener("submit.searchwidget"+o.e_base, function(event){
        
        closePanel()
        if (event.detail.widget === 'fx_selectlayer'){ raiseCustomEvent(fb, "addlayers"+o.e_base, {layers: event.detail.layers}); } 
        else { raiseCustomEvent(fb, "filterready"+o.e_base, {filter: event.detail.filter}); }

      }, false);

      document.body.addEventListener("edit.searchwidget"+o.e_base, function(event){
        
        closePanel()

        switch (event.detail.type){
          case 'data'     : raiseCustomEvent(fb, "editready"+o.e_base, {type: event.detail.type}); break;   
          case 'metadata' : raiseCustomEvent(fb, "editready"+o.e_base, {type: event.detail.type}); break;
        }

      }, false);
  
  }

  function closePanel(){
    $close_btn.fadeOut();
    $panel.slideUp('slow', function(){
      hiddenpanel = true;
      currentSearch = null;
      $('span.fx-fb-btn-selected').removeClass('fx-fb-btn-selected');
    });
  
  };

  function openPanelSelectlayer(){

    fx_selectlayer ? fx_selectlayer.render(lang, o.s_c_widget) : alert('Obj fx_selectlayer not found.');
    
  }

  function initBtns( d ){

    //initialize the btn that close the panel
    $close_btn.on('click', closePanel);
    
    //Initialize btns kind of selection
    var arrayBtns = Object.keys( json_pageelem );

    for (var i = 0; i<arrayBtns.length; i++){

      var w = arrayBtns[i];
      
      d.find('span[data-kind="'+w+'"]').html(json_pageelem[w].title[lang])
        .click({obj : json_pageelem[w].widget}, function(e){

        if (currentSearch !== e.data.obj || hiddenpanel === true) {

          //Apply CSS
          $('span.fx-fb-btn-selected').removeClass('fx-fb-btn-selected')
          $(this).addClass('fx-fb-btn-selected');
          
          $panel.slideUp('slow', function(){
            currentSearch = e.data.obj;
            hiddenpanel = true
            $close_btn.fadeOut();
            window[e.data.obj] ? window[e.data.obj].render({lang : lang, container : o.s_c_widget} ) : alert('Obj '+e.data.obj+' not found.');
            //Panel will be slided Down when the loadcomplete event will be raised. It is coded within the initEventListeners()
          });
        }

      });
    }
  
  }

  return {  init      : init,
            openPanelSelectlayer : openPanelSelectlayer,
            render    : render };

})();

var fx_selectdataset = (function() {

  var defaultOptions = {
      html_base   : 'html/widgets/fx_selectdataset_fragments.html',
      json_conf   : 'json/fx_selectdataset.json', 
      s_submitbtn : '#fx_seldataset_submit_btn',
      s_domains   : "#fx_seldataset_domains",
      s_datasets  : "#fx_seldataset_datasets",
      widget_name : "fx_selectdataset",
      e_base      : '.fx_filterbuilder.widget.fenix',
      //Multilang
      file_labels : 'fx_selectdataset',
      path_labels : 'labels/widgets/fx_selectdataset/'
    };

  var o = {}, lang, json_pageelem;
  var $container, $d, $submit_btn, $domains, $datasets, theme = '';

  function render( baseOptions ) {

    $.extend(true, o, defaultOptions);
    $.extend(true, o, baseOptions);
    
    if (!o.container) alert('Impossible to display data. Please selet a container for Selectdataset in fx_filterbuilder.js');
    $container = $(o.container);

    //Set language and correct labels
    lang = o.lang;

    switch (lang) {
    case 'IT' : I18NLang = 'it'; break;
    case 'FR' : I18NLang = 'fr'; break;
    case 'ES' : I18NLang = 'es'; break;
    default   : I18NLang = 'en'; break;
    }

    //Callback loads grid HTML base and initialize the elements
    $.i18n.properties({
      name: o.file_labels, 
      path: o.path_labels, 
      mode:'both',
      language: I18NLang, 
      callback: loadstructure
    });
  }

  function loadstructure(){

    $.get(o.html_base, function( d ) {

      $d          = $(d);
      $domains    = $d.find(o.s_domains);
      $datasets   = $d.find(o.s_datasets);
      $submit_btn = $d.find(o.s_submitbtn);

      //Init event listeners here cause $domain, $datasets definitions
      initEventListeners();

      $.getJSON(o.json_conf, function( result ){
          
          json_pageelem = result;
          renderDomains();

          //Init submit btn
          $submit_btn.html(json_pageelem.buttons.submit.title[lang]);
          $submit_btn.click(submitForm);
          
          $container.html($d);
          raiseCustomEvent(document.body, "loadcompleted.searchwidget"+o.e_base, {widget : o.widget_name });
          
      }).error('Impossible to load JSon for fx_selectdataset');

    }, 'html').error('Impossible to load HTML for fx_selectdataset'); 
  }

  function renderDomains(){

    var data = json_pageelem.domains;
    // prepare the data
    var source =
      {
          datatype: "json",
          datafields: [
              { name: 'id' },
              { name: 'parentid' },
              { name: 'text' }
          ],
          id: 'id',
          localdata: data
      };
    // create data adapter.
    var dataAdapter = new $.jqx.dataAdapter(source);
    // perform Data Binding.
    dataAdapter.dataBind();
    // get the tree items. The first parameter is the item's id. The second parameter is the parent item's id. The 'items' parameter represents 
    // the sub items collection name. Each jqxTree item has a 'label' property, but in the JSON data, we have a 'text' field. The last parameter 
    // specifies the mapping between the 'text' and 'label' fields.  
    var records = dataAdapter.getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label'}]);
    
    $domains.jqxTree({ 
      source: records,
      allowDrag: false, 
      allowDrop: false,
      theme : theme,
      width: '100%', 
      height: '250px'
      });

    //for rendering reasons
    //$domains.removeClass('jqx-tree')
  
  }

  function renderDatasets( domain ){

    var data = json_pageelem.datasets;

    // prepare the data
    var source =
    {
        datatype: "json",
        datafields: [
            { name: 'title' },
            { name: 'order' },
            { name: 'date' },
            { name: 'datasetid'}
        ],
        localdata: data
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    // Create jqxListBox
    $datasets.jqxListBox({
        theme : theme,
        source: dataAdapter, 
        displayMember: "title", 
        valueMember: "order",
        width: '100%', 
        height: '250px',
        renderer: function (index, label, value) {

          var datarecord = data[index];
          var title = '<div class="fx_sd_dataset_title">' + datarecord.title +'</div>'
          var order = '<div class="fx_sd_dataset_order">' + datarecord.order +'</div>'
          var date = '<div class="fx_sd_dataset_date"><i>' + datarecord.date +'</i></div>'
          var table = '<div class="fx_sd_dataset_wrapper">'+title+ order + date +'</div>';

          return table;
        }
    });
  }

  function submitForm(){

    var f = createFilterQuery();
    raiseCustomEvent(document.body, "submit.searchwidget"+o.e_base, {filter: f});
  }

  function createFilterQuery(){

    /*
    Filter has to be like this. The uid is the id of the Dataset
      
      { "fields" : { 
          "uid" : ["myid"] } 
      }
    */

    var a = [];
    //a.push(selecteddataset)

    var b = {"uid" : a };
    var c = {"fields" : b };

    return c;
  }

  function initEventListeners(){

    $domains.on('select',function (event){
      var args  = event.args;
      var item  = $domains.jqxTree('getItem', args.element);
      var label = item.label; 
      //console.log(label)

      renderDatasets( label );

    });

    $datasets.on('select', function (event) {
        var args = event.args;
        if (args) {
            var index   = args.index;
            var item    = args.item;
            var originalEvent = args.originalEvent;
            // get item's label and value.
            var label   = item.label;
            var value   = item.value;

            selecteddataset = item.originalItem.datasetid;

            $(o.s_submitbtn).removeAttr( 'disabled' );
        }
    });
  }

  return { render : render };

})();

var fx_simplesearch = (function() {

  var defaultOptions = {
    html_base     : 'html/widgets/fx_simplesearch_fragments.html',
    json_conf     : 'json/fx_simplesearch.json', 
    s_submitbtn   : '#fx_simplesearch_submit_btn',
    s_querystring : '#fx_simplesearch_querystring',
    widget_name   : 'fx_simplesearch',
    e_base        : '.fx_filterbuilder.widget.fenix',
    //Multilanguage
    file_labels   : 'fx_simplesearch',
    path_labels   : 'labels/widgets/fx_simplesearch/'
  }

  var o = {}, $container, lang;

  function render( baseOptions ) {

    $.extend(true, o, defaultOptions);
    $.extend(true, o, baseOptions);
    
    if (!o.container) alert('Impossible to display data. Please selet a container for fx_simplesearch in fx_filterbuilder.js');
    $container = $(o.container);

    //Set language and correct labels
    lang = o.lang;

    switch (lang) {
    case 'IT' : I18NLang = 'it'; break;
    case 'FR' : I18NLang = 'fr'; break;
    case 'ES' : I18NLang = 'es'; break;
    default   : I18NLang = 'en'; break;
    }

    //Callback loads grid HTML base and initialize the elements
    $.i18n.properties({
      name: o.file_labels, 
      path: o.path_labels, 
      mode:'both',
      language: I18NLang, 
      callback: loadstructure
    });
  };

  function loadstructure(){

    $.get(o.html_base, function( d ) {

      $fragments = $(d)
      $d = $fragments;

      $.getJSON(o.json_conf, function( result ){
          
          json_pageelem = result;

          $container.html($d);

          $(o.s_submitbtn).html($.i18n.prop('_btn_submit'));
          $(o.s_submitbtn).click(submitForm);

          raiseCustomEvent(document.body, "loadcompleted.searchwidget"+o.e_base, {widget : o.widget_name });

      }).error('Impossible to load JSON for fx_simplesearch');

    }, 'html').error('Impossible to load HTML for fx_simplesearch'); 
  
  };

  function submitForm(){
    
    var f = createFilterQuery();
    raiseCustomEvent(document.body, "submit.searchwidget"+o.e_base, {filter: f});
 
  };

  function createFilterQuery(){ return $(o.s_querystring).val(); };

  return { render : render };

})();

var fx_selectlayer = (function() {

  var defaultOptions = {
     html_base    : 'html/widgets/fx_selectlayer_fragments.html',
    json_conf     : 'json/fx_selectlayer.json', 
    s_submitbtn   : '#fx_selectlayer_submit_btn',
    s_querystring : '#fx_selectlayer_querystring',
    widget_name   : 'fx_selectlayer',
    e_base        : '.fx_filterbuilder.widget.fenix',
      //Multilanguage
    file_labels   : 'fx_selectlayer',
    path_labels   : 'labels/widgets/fx_selectlayer/'
  }

  var o = {}, $container, lang, data, payload_event ;

  function render(baseOptions) {

    payload_event = [];

    $.extend(true, o, defaultOptions);
    $.extend(true, o, baseOptions);
    
    if (!o.container) alert('Impossible to display data. Please selet a container for fx_simplesearch in fx_filterbuilder.js');
    $container = $(o.container);

    //Set language and correct labels
    lang = o.lang;

    switch (lang) {
    case 'IT' : I18NLang = 'it'; break;
    case 'FR' : I18NLang = 'fr'; break;
    case 'ES' : I18NLang = 'es'; break;
    default   : I18NLang = 'en'; break;
    }

    //Callback loads grid HTML base and initialize the elements
    $.i18n.properties({
      name    : o.file_labels, 
      path    : o.path_labels, 
      mode    :'both',
      language: I18NLang, 
      callback: loadstructure
    });
  };

  function loadstructure(){

    $.get(o.html_base, function( d ) {

      $fragments = $(d)
      $d = $fragments;

      $.getJSON(o.json_conf, function( result ){
          
          json_pageelem = result;
          data  = json_pageelem['layers'];
          
          $container.html($d);
          initLayerList();  

          $(o.s_submitbtn).html($.i18n.prop('_btn_submit'));
          $(o.s_submitbtn).click(submitForm);

          raiseCustomEvent(document.body, "loadcompleted.searchwidget"+o.e_base, {widget : o.widget_name });

      }).error('Impossible to load JSON for fx_selectlayer');

    }, 'html').error('Impossible to load HTML for fx_selectlayer'); 
  
  };

  function initLayerList(){

    //var theme = getDemoTheme();
    var theme = '';
    // prepare the data
    var source =
    {
        datatype: "json",
        datafields: [
            { name: 'layertitle' },
            { name: 'ContactName' }
        ],
        id: 'id',
        localdata: data
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    
    // Create a jqxListBox
    $("#fx_selectlayer_layers").jqxListBox({
        theme : theme,
        source: dataAdapter, 
        displayMember: "layertitle", 
        valueMember: "CompanyName", 
        width: '100%', 
        height: '250px',
        multiple: true,
        renderer: function (index, label, value) {

          var datarecord = data[index];
          var title = '<div class="fx_sd_dataset_title">' + datarecord.layertitle +'</div>'
          var order = '<div class="fx_sd_dataset_order">' + datarecord.layername +'</div>'
          var date = '<div class="fx_sd_dataset_date"><i>' + datarecord.layertype +'</i></div>'
          var table = '<div class="fx_sd_dataset_wrapper">'+title+ order + date +'</div>';

          return table;
        }
    }).on('select', function (event){
      if (event.args) {
        var item = event.args.item;
        if (item) { 
          payload_event.push(data[item.index]);
          }
      }
    }).on('unselect', function (event){
      if (event.args) {
        var item = event.args.item;
        if (item) { 
          var index = payload_event.indexOf(data[item.index]);
          if (index > -1) {  payload_event.splice(index, 1); }
        }
      }
    }); 

  }

  function submitForm(){
    
    raiseCustomEvent(document.body, "submit.searchwidget"+o.e_base, {layers: payload_event, widget : o.widget_name});
 
 };

  return { render : render };

})();


/*TO OPTIMIZE*/
var fx_selectdataset_man = (function() {

  var defaultOptions = {
      html_base   : 'html/widgets/fx_selectdataset_management_fragments.html',
      json_conf   : 'json/fx_selectdataset_man.json', 
      s_editdatabtn : '#fx_seldataset_editdata_btn',
      s_editmetadatabtn : '#fx_seldataset_editmetadata_btn',
      s_domains   : "#fx_seldataset_domains",
      s_datasets  : "#fx_seldataset_datasets",
      widget_name : "fx_selectdataset",
      e_base      : '.fx_filterbuilder.widget.fenix',
      //Multilang
      file_labels : 'fx_selectdataset',
      path_labels : 'labels/widgets/fx_selectdataset/'
    };

  var o = {}, lang, json_pageelem;
  var $container, $d, $editdata_btn, $editmetadata_btn, $domains, $datasets, theme = '';

  function render( baseOptions ) {

    $.extend(true, o, defaultOptions);
    $.extend(true, o, baseOptions);
    
    if (!o.container) alert('Impossible to display data. Please selet a container for Selectdataset in fx_filterbuilder.js');
    $container = $(o.container);

    //Set language and correct labels
    lang = o.lang;

    switch (lang) {
    case 'IT' : I18NLang = 'it'; break;
    case 'FR' : I18NLang = 'fr'; break;
    case 'ES' : I18NLang = 'es'; break;
    default   : I18NLang = 'en'; break;
    }

    //Callback loads grid HTML base and initialize the elements
    $.i18n.properties({
      name: o.file_labels, 
      path: o.path_labels, 
      mode:'both',
      language: I18NLang, 
      callback: loadstructure
    });
  }

  function loadstructure(){

    $.get(o.html_base, function( d ) {

      $d          = $(d);
      $domains    = $d.find(o.s_domains);
      $datasets   = $d.find(o.s_datasets);
      $editdata_btn = $d.find(o.s_editdatabtn);
      $editmetadata_btn = $d.find(o.s_editmetadatabtn);

      //Init event listeners here cause $domain, $datasets definitions
      initEventListeners();

      $.getJSON(o.json_conf, function( result ){
          
          json_pageelem = result;
          renderDomains();

          //Init submit btn
          $editdata_btn.html(json_pageelem.buttons.editdata.title[lang]).click(editData);
          $editmetadata_btn.html(json_pageelem.buttons.editmetadata.title[lang]).click(editMetadata);;
          
          $container.html($d);
          raiseCustomEvent(document.body, "loadcompleted.searchwidget"+o.e_base, {widget : o.widget_name });
          
      }).error('Impossible to load JSon for fx_selectdataset');

    }, 'html').error('Impossible to load HTML for fx_selectdataset'); 
  }

  function editData(){ raiseCustomEvent(document.body, "edit.searchwidget"+o.e_base, {type: 'data'}); }

  function editMetadata(){ raiseCustomEvent(document.body, "edit.searchwidget"+o.e_base, {type: 'metadata'}); }

  function renderDomains(){

    var data = json_pageelem.domains;
    // prepare the data
    var source =
      {
          datatype: "json",
          datafields: [
              { name: 'id' },
              { name: 'parentid' },
              { name: 'text' }
          ],
          id: 'id',
          localdata: data
      };
    // create data adapter.
    var dataAdapter = new $.jqx.dataAdapter(source);
    // perform Data Binding.
    dataAdapter.dataBind();
    // get the tree items. The first parameter is the item's id. The second parameter is the parent item's id. The 'items' parameter represents 
    // the sub items collection name. Each jqxTree item has a 'label' property, but in the JSON data, we have a 'text' field. The last parameter 
    // specifies the mapping between the 'text' and 'label' fields.  
    var records = dataAdapter.getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label'}]);
    
    $domains.jqxTree({
      allowDrag: false, 
      allowDrop: false, 
      source: records,
      theme : theme,
      width: '100%', 
      height: '250px'
      });
    //for rendering reasons
    $domains.removeClass('jqx-tree')
  }

  function renderDatasets( domain ){

    var data = json_pageelem.datasets;

    // prepare the data
    var source =
    {
        datatype: "json",
        datafields: [
            { name: 'title' },
            { name: 'order' },
            { name: 'date' },
            { name: 'datasetid'}
        ],
        localdata: data
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    // Create jqxListBox
    $datasets.jqxListBox({
        theme : theme,
        source: dataAdapter, 
        displayMember: "title", 
        valueMember: "order",
        width: '100%', 
        height: '250px',
        renderer: function (index, label, value) {

          var datarecord = data[index];
          var title = '<div class="fx_sd_dataset_title">' + datarecord.title +'</div>'
          var order = '<div class="fx_sd_dataset_order">' + datarecord.order +'</div>'
          var date = '<div class="fx_sd_dataset_date"><i>' + datarecord.date +'</i></div>'
          var table = '<div class="fx_sd_dataset_wrapper">'+title+ order + date +'</div>';

          return table;
        }
    });
  }

  function submitForm(){

    var f = createFilterQuery();
    raiseCustomEvent(document.body, "submit.searchwidget"+o.e_base, {filter: f});
  }

  function createFilterQuery(){

    /*
    Filter has to be like this. The uid is the id of the Dataset
      
      { "fields" : { 
          "uid" : ["myid"] } 
      }
    */

    var a = [];
    a.push(selecteddataset)

    var b = {"uid" : a };
    var c = {"fields" : b };

    return c;
  }

  function initEventListeners(){

    $domains.on('select',function (event){
      var args  = event.args;
      var item  = $domains.jqxTree('getItem', args.element);
      var label = item.label; 

      renderDatasets( label );

    });

    $datasets.on('select', function (event) {
        var args = event.args;
        if (args) {
            var index   = args.index;
            var item    = args.item;
            var originalEvent = args.originalEvent;
            // get item's label and value.
            var label   = item.label;
            var value   = item.value;

            selecteddataset = item.originalItem.datasetid;

            $(o.s_submitbtn).removeAttr( 'disabled' );
        }
    });
  }

  return { render : render };

})();

var fx_simplesearch_man = (function() {

  var defaultOptions = {
    html_base     : 'html/widgets/fx_simplesearch_management_fragments.html',
    json_conf     : 'json/fx_simplesearch.json', 
    s_editdatabtn : '#fx_seldataset_editdata_btn',
    s_editmetadatabtn : '#fx_seldataset_editmetadata_btn',
    s_querystring : '#fx_simplesearch_querystring',
    widget_name   : 'fx_simplesearch',
    e_base        : '.fx_filterbuilder.widget.fenix',
    //Multilanguage
    file_labels   : 'fx_simplesearch',
    path_labels   : 'labels/widgets/fx_simplesearch/'
  }

  var o = {}, $container, lang;

  function render( baseOptions ) {

    $.extend(true, o, defaultOptions);
    $.extend(true, o, baseOptions);
    
    if (!o.container) alert('Impossible to display data. Please selet a container for fx_simplesearch in fx_filterbuilder.js');
    $container = $(o.container);

    //Set language and correct labels
    lang = o.lang;

    switch (lang) {
    case 'IT' : I18NLang = 'it'; break;
    case 'FR' : I18NLang = 'fr'; break;
    case 'ES' : I18NLang = 'es'; break;
    default   : I18NLang = 'en'; break;
    }

    //Callback loads grid HTML base and initialize the elements
    $.i18n.properties({
      name: o.file_labels, 
      path: o.path_labels, 
      mode:'both',
      language: I18NLang, 
      callback: loadstructure
    });
  };

  function loadstructure(){

    $.get(o.html_base, function( d ) {

      $fragments = $(d)
      $d = $fragments;

      $.getJSON(o.json_conf, function( result ){
          
          json_pageelem = result;

          $container.html($d);

          $(o.s_editdatabtn).html($.i18n.prop('_btn_editdata')).click(editData);
          $(o.s_editmetadatabtn).html($.i18n.prop('_btn_editmetadata')).click(editMetadata);

          raiseCustomEvent(document.body, "loadcompleted.searchwidget"+o.e_base, {widget : o.widget_name });

      }).error('Impossible to load JSON for fx_simplesearch');

    }, 'html').error('Impossible to load HTML for fx_simplesearch'); 
  
  };

  function editData(){ raiseCustomEvent(document.body, "edit.searchwidget"+o.e_base, {type: 'data'}); }

  function editMetadata(){ raiseCustomEvent(document.body, "edit.searchwidget"+o.e_base, {type: 'metadata'}); }

  function createFilterQuery(){ return $(o.s_querystring).val(); };

  return { render : render };

})();

var fx_tools_man = (function() {

  var defaultOptions = {
      html_base   : 'html/widgets/fx_tools_management_fragments.html',
      json_conf   : 'json/fx_tools_man.json', 
      s_submitbtn : '#fx_tools_submit_btn',
      s_list      : "#fx_tools_list",
      widget_name : "fx_tools_man",
      e_base      : '.fx_filterbuilder.widget.fenix',
      //Multilang
      file_labels : 'fx_tools_man',
      path_labels : 'labels/widgets/fx_tools_man/'
    };

  var o = {}, lang, json_pageelem;
  var $container, $d, $submit_btn, $list, theme = '';

  function render( baseOptions ) {

    $.extend(true, o, defaultOptions);
    $.extend(true, o, baseOptions);
    
    if (!o.container) alert('Impossible to display data. Please selet a container for Selectdataset in fx_filterbuilder.js');
    $container = $(o.container);

    //Set language and correct labels
    lang = o.lang;

    switch (lang) {
    case 'IT' : I18NLang = 'it'; break;
    case 'FR' : I18NLang = 'fr'; break;
    case 'ES' : I18NLang = 'es'; break;
    default   : I18NLang = 'en'; break;
    }

    loadstructure()
    //Callback loads grid HTML base and initialize the elements
    /*    
    $.i18n.properties({
      name: o.file_labels, 
      path: o.path_labels, 
      mode:'both',
      language: I18NLang, 
      callback: loadstructure
    });*/
  }

  function loadstructure(){

    $.get(o.html_base, function( d ) {

      $d          = $(d);
      $list       = $d.find(o.s_list);
      $submit_btn = $d.find(o.s_submitbtn);

      //Init event listeners here cause $domain, $datasets definitions
      initEventListeners();

      $.getJSON(o.json_conf, function( result ){
          
          json_pageelem = result;
          renderList();

          //Init submit btn
          $submit_btn.html(json_pageelem.buttons.submit.title[lang]).click(submitForm);
          
          $container.html($d);
          raiseCustomEvent(document.body, "loadcompleted.searchwidget"+o.e_base, {widget : o.widget_name });
          
      }).error('Impossible to load JSon for fx_selectdataset');

    }, 'html').error('Impossible to load HTML for fx_selectdataset'); 
  }

  function renderList( ){

    var data = json_pageelem.tools;

    // prepare the data
    var source =
    {
        datatype: "json",
        datafields: [
            { name: 'title' },
            { name: 'order' },
            { name: 'date' },
            { name: 'datasetid'}
        ],
        localdata: data
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    // Create jqxListBox
    $list.jqxListBox({
        theme : theme,
        source: dataAdapter, 
        displayMember: "title", 
        valueMember: "order",
        width: '100%', 
        height: '250px',
        renderer: function (index, label, value) {

          var datarecord = data[index];
          var title = '<div class="fx_sd_dataset_title">' + datarecord.title +'</div>'
          var order = '<div class="fx_sd_dataset_order">' + datarecord.order +'</div>'
          var date = '<div class="fx_sd_dataset_date"><i>' + datarecord.date +'</i></div>'
          var table = '<div class="fx_sd_dataset_wrapper">'+title+ order + date +'</div>';

          return table;
        }
    });
  }

  function submitForm(){

    var f = createFilterQuery();
    raiseCustomEvent(document.body, "submit.searchwidget"+o.e_base, {filter: f});
  }

  function createFilterQuery(){

    /*
    Filter has to be like this. The uid is the id of the Dataset
      
      { "fields" : { 
          "uid" : ["myid"] } 
      }
    */

    var a = [];
    a.push(selecteddataset)

    var b = {"uid" : a };
    var c = {"fields" : b };

    return c;
  }

  function initEventListeners(){

    $list.on('select', function (event) {
        var args = event.args;
        if (args) {
            var index   = args.index;
            var item    = args.item;
            var originalEvent = args.originalEvent;
            // get item's label and value.
            var label   = item.label;
            var value   = item.value;

            selecteddataset = item.originalItem.datasetid;

            $(o.s_submitbtn).removeAttr( 'disabled' );
        }
    });
  }

  return { render : render };

})();