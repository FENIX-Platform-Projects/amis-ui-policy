var ap_analysis = (function() {
//Title
    var State       = {},
        lang        = 'EN',
    //json_config = 'json/view.json',
        json_config = 'json/policiesAtaGlance.json',
        s_content   = '#content',
        s_header    = '#header',
        s_footer    = '#footer',
        s_newsslider = '#newsslider',
    // s_topmenu   = '#top_menu',
        s_sidemenu  = '#sidemenu',
        objs        = [],
        objs_rendered = [],
        initSec     = 'initialized',
        alertcont   = 'alert-container';

    var $content, $header, $footer, $slider, tab, sec, lang, magic;

    function init(){

    };



    return {  init : init,
        lang : function(){ return lang; } }

})();

window.addEventListener('load', ap_analysis.init, false);
