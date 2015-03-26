//var ap_sidemenu = (function() {
define([
    'jquery'
], function( $ ){

    var o = {}, page_elem, defaulOptions, $menu;

    //Default Options
    var defaultOptions = {
        json      : 'json/ap_sidemenu_policiesAtaGlance.json',
        ul_pri    : 'sidemenu_items',
        lang      : 'EN'
    };

    function init( baseOptions ){
        // alert("ap_sidemenu init ");
        //Merge options
        $.extend(o, defaultOptions);
        $.extend(o, baseOptions);
    }

    function render( baseOptions ){

        $.extend(o, baseOptions);
        //Define lang to render
        //  lang = defaultOptions.lang;
        //alert("ap_sidemenu lang "+lang);
        controller  = o.controller;
        if(!o.container) alert('ap_sidemenu.js error: please define a container!');
        $menu       = $(o.container).find('.part2');

        $.getJSON(o.json, function( result ){
            //cache result
            page_elem = result;
            $menu.empty();
            $menu.append('<div class="fx-sidebar"><ul id="'+o.ul_pri+'" class="nav fx-sidenav"></ul></div>');

            $.each(result, function(i, field){
                var c = createSidemenuItem(field, itemSelected);
                $('#'+o.ul_pri).append(c);
                if ((field.children != null )&&(field.children.length !== 0 )){
                    $(c).append('<ul id="view_submenu_'+i+'"class="nav"></ul>');
                    $.each(field.children, function(j, child){
                        $('#view_submenu_'+i).append(createSidemenuItem(child, subitemSelected));
                        $('#view_submenu_'+i+' li').click(function(e) { e.stopPropagation(); })
                    });
                }
            });

            if ($('#'+o.ul_pri).children().length === result.length){
                //Prevent the encondind of the #
                $menu.find("a").click(function(event){ event.preventDefault(); });
                raiseCustomEvent(document.body, "loadcompleted.widget.fenix", {id: 'ap_sidemenu'});
            }
        }).error(function() { showErrorMsg(errorMsg, alertcont); });

    }

    function createSidemenuItem( json, func ){
        //  alert("createSidemenuItem json "+json);
        var item = document.createElement("li");
        item.setAttribute('data-tab', json.datatab);
        var anchor = document.createElement("a");
        anchor.href = '#'+json.link;
        //alert("createSidemenuItem anchor.href "+anchor.href);
        // alert("createSidemenuItem lang "+lang);
        anchor.innerHTML = json.label[o.lang];
        item.onclick = func;
        //alert("createSidemenuItem anchor.innerHTML "+anchor.innerHTML);
        /*
         var icon = document.createElement("i");
         icon.setAttribute('class', json.icon+' pull-right');
         anchor.appendChild(icon);
         */

        item.appendChild(anchor);
        return item;

    }

    function itemSelected(){
        raiseCustomEvent(this, "itemselected.sidemenu.view", {tab: $(this).data('tab')});
        highlightSelectedItem(this);
    }

    function subitemSelected(){
        $(this).parent().find('li').removeClass('active')
        $(this).addClass('active');
        raiseCustomEvent(this, "subitemselected.sidemenu.view", {elem: $(this).find('a').attr('href')});
    }

    function highlightSelectedItem( item ){
        $menu.removeClass('active');
        $menu.find('li').removeClass('active');
        $(item).addClass('active');
    }

    function selectItem(id, f){
        var $s = $('#'+o.ul_pri+' li[data-tab="'+id+'"]');
        $s.click()
        $s.addClass('active');
    }

    function selectSubitem( id ){
        var $s = $('li[data-tab="'+id+'"]');
        $s.parent().find('li').removeClass('active')
        $s.addClass('active');
        raiseCustomEvent(document.body, "subitemselected.sidemenu.view", {elem: $s.find('a').attr('href')});
    }

    return {  init : init,
        render : render,
        selectItem : selectItem,
        selectSubitem : selectSubitem }

});