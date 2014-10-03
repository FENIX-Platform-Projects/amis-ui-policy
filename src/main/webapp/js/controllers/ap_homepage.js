var ap_homepage = (function() {

    var lang        = 'EN';

    function init(){
        
        //Init event listeners 
        initEventListeners();

        //Init Page components
        renderPage();

    };

    function renderPage(){ };
 
    function initEventListeners(){ };


  return {  init : init,
            lang : function(){ return lang; }
          }

})();

window.addEventListener('load', ap_homepage.init, false);