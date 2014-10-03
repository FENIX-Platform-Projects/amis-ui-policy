function fx_mapbuilderwidget( baseOptions ) {

	//Inner options of fx_mapbuilderwidget
	var o = {};
	var $container, $fragments, $d, I18NLang;
	
	//Default options for the Widget Configuration
	var defaultOptions = {
		widgtet_name 			: 'fx_mapbuilderwidget',
		html_base 				: 'html/widgets/fx_mapbuilderwidget_fragments.html',
        s_base                  : '.fx-widget',
		s_content 				: '#mapbuilderwidget-content',
        e_base                  : '.widget.fenix',
		//Multilanguage
		default_lang 			: 'EN',
		file_labels 			: 'fx_mapbuilderwidget',
      	path_labels 			: 'labels/widgets/fx_mapbuilderwidget/'
	};

	$.extend(o, defaultOptions);
	$.extend(o, baseOptions);

	function render( options ) {

		$.extend(o, options);

		if (!o.container) alert('Impossible to display data. Please selet a container for fx_mapbuilderwidget.js');
		if (!o.json) alert('Impossible to display data. Please specify a JSON source for fx_mapbuilderwidget.js');
		
		$container 	= $(o.container);
    	$container.empty();

    	o.lang ? o.lang = o.lang.toUpperCase() : o.default_lang.toUpperCase();
		
		switch (o.lang ) {
		case 'IT' 	: I18NLang = 'it'; break;
		case 'FR' 	: I18NLang = 'fr'; break;
		case 'ES' 	: I18NLang = 'es'; break;
		default		: I18NLang = 'en'; break;
		}

		loadstructure();

		/*
		//Callback loads grid HTML base and initialize the elements
		$.i18n.properties({
			name 	: o.file_labels, 
			path 	: o.path_labels, 
			mode 	:'both',
			language: I18NLang, 
			callback: loadstructure
		});*/
	
	};

	function loadstructure() {

		$.get(o.html_base, function( d ) {

	    	/*cache the loaded file to use it to create list's item*/
	    	$fragments = $(d);

		    $d = $fragments.find(o.s_base).clone();
		    generateDynamicId($d);
		    $container.html($d);
				    
			initWidgetControlBtns($d);
			initTabControlBtns($d)
		   	initContent();
		   	
		    //raiseCustomEvent(document.body, "loadcompleted.widget.fenix", {id: widget_name});	     
	    
	    }, 'html').error('Impossible to load HTML for fx_mapbuilderwidget');
	
	};

	function initContent(){

		var layers = eval('(' + o.json + ')');
	  	o.map = App.mapBuildier('fx-mapbuilderwidget-content-' + window.fx_dynamic_id_counter);

        for (var i =0; i<layers.length; i++){
          var l = new FM.layer(layers[i]);
          o.map.addLayer(l);
        }

		/*        
		Resize for bootstrap tabs
		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            //TODO Optimize
            o.map.invalidateSize()
        })
		*/
	
	};

	function initTabControlBtns(){

		$('#fx-mapbuilderwidget-btn-add-' + window.fx_dynamic_id_counter).on('click', function(){
			raiseCustomEvent(document.body, "addlayer"+o.e_base, {map : o.map});
		});

	};

	function initWidgetControlBtns(){

		$('#fx-mapbuilderwidget-btn-remove-' + window.fx_dynamic_id_counter).click(function(){
			raiseCustomEvent(this, "remove"+o.e_base, {widget: $container, json: o.json});
		});

		$('#fx-mapbuilderwidget-btn-resize-'+ window.fx_dynamic_id_counter).click(function(){
			raiseCustomEvent(this, "resize"+o.e_base, {widget: o.container, json: o.json});
		});
	
	};

	return { render : render };

};