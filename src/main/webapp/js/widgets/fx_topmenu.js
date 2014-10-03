/*
 - 1 initialize element: passing the Obj controller that optionally can define some inner parameters, and the container where
 to place the menu
 - 2 explicitly call the render function: you can optionally pass the language
*/

/*
  Questo non e' l'ultimo approccio per l'inizializzazione di un obj. Ho cambiato passando un oggetto di configurazione come in 
  fx_sidemenu. Con il passaggio di un obj di configurazione, viene mantenuto un obj interno alla funzione in cui salvare tutte le
  configurazione. $.extend fa il merging di due JS obj.
*/

/*
fx_topmenu is the object name. It is always visible and you can access to it simply from its name (or window.fx_topmenu)
*/
var fx_topmenu = (function() {

  var widget_name   = 'fx_topmenu',
      html_base     = 'html/widgets/fx_topmenu_fragments.html',
      json_conf     = 'json/fx_topmenu.json', 
      s_menuul      = '#menu_list',
      s_langpicker  = '#lang_picker',
      e_langchange  = "langchage."+widget_name+".fenix";

  var ctrl, menu, $d, $menu;

  function init(c, html){
    ctrl = c;
    menu = html;
    $menu = $(menu);
    //Empty the menu HTML container
    $menu.empty();
  }

  function render(l){

    //Define lang to render
    l ? lang = l : lang = ctrl.lang();

    //Get the HTML base of the menu
    $.get(html_base, function( d ) {
   
      //cache the base html
      $d = $(d);
      
      //Get the Config JSON file
      $.getJSON(json_conf, function(result, status){

        /*
        Whenever the $.find() function is called means you are not performing operation 
        within the DOM but in RAM
        */
        $d.find(s_menuul).empty();
        $.each(result, function(i, field){

          $d.find(s_menuul).append(createMenuItem(field));
          
          /* In case the Topmenu item has dropdown item
          if (field.children.length !== 0){
            for(var i=0; i<field.children.length; i++){
              $('#'+field.id).append(createMenuItem(field.children[i]));
            }
          }
          */
        
        });

        //Init language btns
        $d.find(s_langpicker).children().click(function(){
          /*
          Language btns do not perform any kind of operation but they just raise Event. The controller would listen to 
          it and it is up to it what to do according to the language change
          */
          raiseCustomEvent(this, e_langchange, {lang: $(this).data('lang')});
        });
      });

      raiseCustomEvent(menu, "loadcompleted.widget.fenix", {id: 'fx_topmenu'});
      
      $menu.html($d);
    }, 'html');
  
  }

  /*
  Create a HTML element according to the Config JSon param
  */
  function createMenuItem( json ){
    var item = document.createElement("li");
    var anchor = document.createElement("a");
    anchor.innerHTML = json.label[lang];  
    item.appendChild(anchor);

    if (json.children.length === 0){
        anchor.href = json.target+'?lang='+lang;
    } else {
      item.className = 'dropdown';
      anchor.href = '#';
      anchor.className = 'dropdown-toggle';
      anchor.setAttribute('data-toggle','dropdown');

      var icon = document.createElement("b");
      icon.className = 'caret';
      anchor.appendChild(icon);
      var dropdownlist = document.createElement("ul");
      dropdownlist.id = json.id;
      dropdownlist.className = 'dropdown-menu';

      item.appendChild(dropdownlist);
    }

    return item;
  
  }

  /*
  The public methods of are the keys of the map returned
  */
  return {  init    : init,
            render  : render }
})();