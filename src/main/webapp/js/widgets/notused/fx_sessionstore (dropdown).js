var fx_sessionstore = (function() {

	var $container,
		$ul,
		widget_name = 'fx_sessionstore',
		html_base = 'html/widgets/fx_sessionstore_fragments.html',
		s_base = '#fx_sessioncart_base',
		s_list = '#fx_sessioncart_ul',
		s_item = '.fx-sessioncart-item',
		s_title = '#fx_sessioncart_title';

	var controller, $ul, $d, $item, $fragments;

	//Multilanguage
  	var file_labels = 'fx_sessionstore',
      	path_labels = 'labels/widgets/fx_sessionstore/';

	function init(ctrl, html){
    	controller = ctrl;

    	$container = $(html);
    	$container.empty();
  	}

	function render( l ) {

		//Set language and correct labels
		l ? lang = l : lang = controller.lang();

		switch (lang) {
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
	}

	function loadstructure(){


	    $.get(html_base, function( d ) {

	    	//cache the loaded file to use it to create list's item
	    	$fragments = $(d);
		    $d = $fragments.find(s_base);
		    $ul = $fragments.find(s_list);

		    $d.find(s_title).html($.i18n.prop('_title'))
		    
		    $container.html($d);
		    raiseCustomEvent(document.body, "loadcompleted.widget.fenix", {id: widget_name});
	     
	    }, 'html');
	}

	function addItem( json ){
		console.log('Sessioncart: addItem')

		var li = document.createElement('li');

		$item = $fragments.find(s_item).clone();
		
		//Init 'removeme' btn
		$item.find('button.fx-sessioncart-removeme').on('click', function() {
      		$(this).closest('li').remove();
   		});

		//Init 'movemetodesk' btn
   		$item.find('button.fx-sessioncart-movemetodesk').on('click', function() {
      		$(this).closest('li').remove();
      		raiseCustomEvent(document.body, "movetodesk.sessioncart.widget.fenix", {json: 'myfakejson'});
   		});

   		$(li).append($item);
		$ul.append(li);
	}

	function createItem( json ){
		//TODO
	}

	return {
			init : init,
			render : render,
			addItem : addItem
			};
			
})();