function fx_editdatawidget( baseOptions ) {

	//Inner options of fx_editdatawidget
	var o = {};
	var $container, $fragments, $d, I18NLang;
	
	//Default options for the Widget Configuration
	var defaultOptions = {
		widgtet_name 			: 'fx_editdatawidget',
		html_base 				: 'html/widgets/fx_editdatawidget_fragments.html',
        s_base                  : '.fx-widget',
		s_content 				: '#fx-editdatawidget-content-',
        e_base                  : '.widget.fenix',
		//Multilanguage
		default_lang 			: 'EN',
		file_labels 			: 'fx_editdatawidget',
      	path_labels 			: 'labels/widgets/fx_editdatawidget/'
	};

	$.extend(o, defaultOptions);
	$.extend(o, baseOptions);

	function render( options ) {

		$.extend(o, options);

		if (!o.container) alert('Impossible to display data. Please selet a container for fx_editdatawidget.js');
		if (!o.json) alert('Impossible to display data. Please specify a JSON source for fx_editdatawidget.js');
		
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
	    
	    }, 'html').error('Impossible to load HTML for fx_editdatawidget');
	
	};

	function initContent(){
	
        var theme   = '';
        var data    = '[{"year":"1995","crops":"Beans, dry","value":"2,338,145.00"},{"year":"1995","crops":"Cassava","value":"13,831,390.00"},{"year":"1995","crops":"Cotton Lint","value":"480,410.00"},{"year":"1995","crops":"Groundnut","value":"3,092,350.00"},{"year":"1995","crops":"Maize","value":"5,120,700.00"},{"year":"1995","crops":"Melon","value":"287,250.00"},{"year":"1995","crops":"Millet","value":"7,271,230.00"},{"year":"1995","crops":"Rice","value":"1,994,017.00"},{"year":"1995","crops":"Sorghum","value":"6,329,910.00"},{"year":"1995","crops":"Taro (Cococyam)","value":"1,560,450.00"},{"year":"1995","crops":"Yam","value":"23,395,754.00"},{"year":"1996","crops":"Beans, dry","value":"2,338,145.00"},{"year":"1996","crops":"Cassava","value":"13,831,390.00"},{"year":"1996","crops":"Cotton Lint","value":"480,410.00"},{"year":"1996","crops":"Groundnut","value":"3,092,350.00"},{"year":"1996","crops":"Maize","value":"5,120,700.00"},{"year":"1996","crops":"Melon","value":"287,250.00"},{"year":"1996","crops":"Millet","value":"7,271,230.00"},{"year":"1996","crops":"Rice","value":"1,994,017.00"},{"year":"1996","crops":"Sorghum","value":"6,329,910.00"},{"year":"1996","crops":"Taro (Cococyam)","value":"1,560,450.00"},{"year":"1996","crops":"Yam","value":"23,395,754.00"},{"year":"1997","crops":"Beans, dry","value":"2,338,145.00"},{"year":"1997","crops":"Cassava","value":"13,831,390.00"},{"year":"1997","crops":"Cotton Lint","value":"480,410.00"},{"year":"1997","crops":"Groundnut","value":"3,092,350.00"},{"year":"1997","crops":"Maize","value":"5,120,700.00"},{"year":"1997","crops":"Melon","value":"287,250.00"},{"year":"1997","crops":"Millet","value":"7,271,230.00"},{"year":"1997","crops":"Rice","value":"1,994,017.00"},{"year":"1997","crops":"Sorghum","value":"6,329,910.00"},{"year":"1997","crops":"Taro (Cococyam)","value":"1,560,450.00"},{"year":"1997","crops":"Yam","value":"23,395,754.00"}]';
        // prepare the data
        var source = {
            datatype: "json",
            datafields: [
                { name: 'year', type: 'string'},
                { name: 'crops', type: 'string'},
                { name: 'value', type: 'string'}
            ],
            localdata: data
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
        $(o.s_content + window.fx_dynamic_id_counter).jqxGrid({
            width: '100%',
            height: 350,
            source: dataAdapter,
            showfilterrow: true,
            filterable: true,
            source: dataAdapter,
            theme: theme,
            columnsresize: true,
            columns: [
                { text: 'Year', datafield: 'year', width: '33%'},
                { text: 'Crops', datafield: 'crops', width: '33%'},
                { text: 'Value', datafield: 'value', width: '34%'}
            ]
        });

        document.body.addEventListener("resize.widget.fenix", function(event){
            $(o.s_content + window.fx_dynamic_id_counter).jqxGrid('refresh');
        }, false);
        	
	};

	function initTabControlBtns( e ){

		$('#fx-editdatawidget-btn-show-' + window.fx_dynamic_id_counter).click(function(){
			raiseCustomEvent(this, "show"+o.e_base, {type : 'meta'});
		});

	}; 
	
	function initWidgetControlBtns( e ){

		$('#fx-editdatawidget-btn-remove-' + window.fx_dynamic_id_counter).click(function(){
			raiseCustomEvent(this, "remove"+o.e_base, {widget: $container, json: o.json});
		});

		$('#fx-editdatawidget-btn-resize-'+ window.fx_dynamic_id_counter).click(function(){
			raiseCustomEvent(this, "resize"+o.e_base, {widget: o.container, json: o.json});
		});
	
	};

	return { render : render };

};