function fx_editmetawidget( baseOptions ) {

	//Inner options of fx_editmetawidget
	var o = {};
	var $container, $fragments, $d, I18NLang;
	
	//Default options for the Widget Configuration
	var defaultOptions = {
		widgtet_name 			: 'fx_editmetawidget',
		html_base 				: 'html/widgets/fx_editmetawidget_fragments.html',
        s_base                  : '.fx-widget',
		s_content 				: '#fx-editmetawidget-content-',
        e_base                  : '.widget.fenix',
		//Multilanguage
		default_lang 			: 'EN',
		file_labels 			: 'fx_editmetawidget',
      	path_labels 			: 'labels/widgets/fx_editmetawidget/'
	};

	$.extend(o, defaultOptions);
	$.extend(o, baseOptions);

	function render( options ) {

		$.extend(o, options);

		if (!o.container) alert('Impossible to display data. Please selet a container for fx_editmetawidget.js');
		if (!o.json) alert('Impossible to display data. Please specify a JSON source for fx_editmetawidget.js');
		
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
		
		//Uncomment to load external labels
		//Callback loads grid HTML base and initialize the elements
		/*		
		$.i18n.properties({
			name 	: o.file_labels, 
			path 	: o.path_labels, 
			mode 	:'both',
			language: I18NLang, 
			callback: loadstructure
		});
		*/
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
	    
	    }, 'html').error('Impossible to load HTML for fx_editmetawidget');
	
	};

	function initContent(){

		$(o.s_content + window.fx_dynamic_id_counter).html('<iframe src="metadatamanager.html" style="border:0px; width:100%; height:350px;"></iframe>')		

	};

		
	function initTabControlBtns( e ){

		$('#fx-editmetawidget-btn-show-' + window.fx_dynamic_id_counter).click(function(){
			raiseCustomEvent(this, "show"+o.e_base, {type : 'data'});
		});

	};
	

	function initWidgetControlBtns( e ){
		

		$(e).find('#fx-editmetawidget-btn-remove-' + window.fx_dynamic_id_counter).click(function(){
			raiseCustomEvent(this, "remove"+o.e_base, {widget: $container, json: o.json});
		});

		$(e).find('#fx-editmetawidget-btn-resize-'+ window.fx_dynamic_id_counter).click(function(){
			raiseCustomEvent(this, "resize"+o.e_base, {widget: o.container, json: o.json});
		});
	
	};

	return { render : render };

};