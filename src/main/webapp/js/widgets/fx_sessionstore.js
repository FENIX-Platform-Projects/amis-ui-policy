var fx_sessionstore = (function() {

	var widget_name = 'fx_sessionstore',
		html_base 	= 'html/widgets/fx_sessionstore_fragments.html',
		s_base 		= '#fx-sessionstore-base',
		s_list 		= '#fx-sessionstore-list',
		s_item 		= '.fx-sessionstore-item',
		s_counter 	= '#fx-sessionstore-counter',
		s_counter_val = '#fx-sessionstore-counter-value',
		s_ul_container = '#fx-sessionstore-ul-container',
		e_base 		= '.'+widget_name+'.widget.fenix';

	//Multilanguage
	var file_labels = 'fx_sessionstore',
      	path_labels = 'labels/widgets/fx_sessionstore/';
	var s_title 	= '#fx-sessionstore-title',
		l_title 	= 'sessionstore_title',
		s_btn_close = '#fx-sessionstore-btn-close',
		l_btn_close = 'sessionstore_btn_close';

	var ctrl, $fragments, $panel, $counter, $item, $ul_cont;

	function init(c, htmlPanel, htmlCounter){

    	ctrl 		= c;
    	panel 		= htmlPanel;
    	$panel 		= $(htmlPanel);
    	$counter 	= $(htmlCounter);
    	
    	$panel.empty();
    	$counter.empty();
  	
  	};

	function render( l ) {

		//Set language and correct labels
		l ? lang = l : lang = ctrl.lang();

		switch (lang.toUpperCase()) {
		case 'IT' : I18NLang = 'it'; break;
		case 'FR' : I18NLang = 'fr'; break;
		case 'ES' : I18NLang = 'es'; break;
		default: I18NLang = 'en'; break;
		}

		//Callback loads grid HTML base and initialize the elements
		$.i18n.properties({
			name: file_labels, 
			path: path_labels, 
			mode:'both',
			language: I18NLang, 
			callback: loadstructure
		});
	
	};

	function loadstructure(){

	    $.get(html_base, function( d ) {

	    	//cache the loaded file to use it to create list's item
	    	$fragments = $(d);

			initEventListeners();
		    initPanel();
		    initCounter();

		    raiseCustomEvent(panel, "loadcompleted"+e_base, {id: widget_name});
	     
	    }, 'html').error(function(){alert('Impossible to load Session Store Widget')});
	
	};

	function initPanel(){


		//Render the empty panel
		$panel.html($fragments.find(s_base));

		//init panel movements
		$panel.buildMbExtruder({
		    position:"right",
            width:280,
            positionFixed:false,
            top:0
            //extruderOpacity:.5,
            //autoCloseTime:0,
            //autoOpenTime:1000,
            //hidePanelsOnClose:false,
            //flapDim: 9999, not working
            //onExtOpen:function(){},
            //onExtContentLoad:function(){},
            //onExtClose:function(){}
        });
        
        $ul_cont = $(s_ul_container);
        var h = $(".ext_wrapper .content").height() - 82;
		$ul_cont.height(500)

        //init close btn
		$(s_btn_close).html($.i18n.prop(l_btn_close));
		$(s_btn_close).on("click", closePanel );

		//init title
		$(s_title).html($.i18n.prop(l_title));
	
	};

	function initCounter(){

		$counter.html($fragments.find(s_counter));
		//Init counter with 'Zero' widgets in session
		$(s_counter_val).html(0);

		$counter.on('click', window[widget_name].openPanel);

	};

	function initEventListeners(){

		panel.addEventListener("additem"+e_base, function(event){ addItemToUl( event.detail.json); }, false);

      	panel.addEventListener("removeitem"+e_base, function(event){ removeItemFromUl(event.detail.item); }, false);

      	panel.addEventListener("movetodesk"+e_base, function(event){ removeItemFromUl(event.detail.item); }, false);

	};

	function addItem( json ){ raiseCustomEvent(panel, "additem"+e_base, { json: json }); };

	function addItemToUl( json ){

		$item = $fragments.find(s_item).clone();
		initItem($item, json);
	
		//Init 'removeme' btn
		$item.find('.fx-sessionstore-item-removeme').on('click', function() {
      		raiseCustomEvent(panel, "removeitem"+e_base, {json: 'myfakejson', item : $(this).closest('li')});
   		});

		//Init 'movemetodesk' btn
   		$item.find('.fx-sessionstore-item-movemetodesk').on('click', function() {
      		raiseCustomEvent(panel, "movetodesk"+e_base, {json: 'myfakejson', item:$(this).closest('li') });
   		});

		$(s_list).append($item);
		increaseCounter();

		function initItem($item, json ){
			//TODO
			return $item; 
		};

	};

	function removeItemFromUl($item){ 
		
		$item.fadeOut( "slow", function(){ 
			$(this).remove();
			decreaseCounter()
		}); 

	};

	function increaseCounter(){  

		$(s_counter_val).html( parseInt($(s_counter_val).html(), 10) + 1); 
		//$(s_counter).effect("bounce", { times: 3 }, 300);
		$(s_counter_val).effect("bounce", { times: 3 }, 300);
	
	};

	function decreaseCounter(){ $(s_counter_val).html(parseInt($(s_counter_val).html(), 10) - 1); };

	function openPanel( bool ){  var b; bool ? b = bool : b = true; $panel.openMbExtruder(true); };

	function closePanel(){ $panel.closeMbExtruder(); };

	return {init 		: init,
			render 		: render,
			addItem 	: addItem,
			openPanel 	: openPanel,
			closePanel 	: closePanel
			};
			
})();