var ap_fullScreen = (function() {

    function fullscreen(idButton, idFullscreen) {

        var fsElement = document.getElementById(idFullscreen);

        if (window.fullScreenApi.supportsFullScreen) {
            $('#' + idButton).on('click', function () {
                alert('on click browser')
                window.fullScreenApi.requestFullScreen(fsElement);
            });
        } else {
            alert('is not supported the full screen on your browser')
        }
    }

    function loadingPanel(id, height) {
        var h = '25px';
        if ( height ) h = height;
        document.getElementById(id).innerHTML = "<div class='fm-loadingPanel' style='height:"+ h +"'><img src='"+ FMCONFIG.BASEURL +'/images/loading.gif' +"'></div>";
    }
    return {
        fullscreen  :   fullscreen
    };

})();

//$.fn.swapWith = function(to) {
//    return this.each(function() {
//        var copy_to = $(to).clone();
//        var copy_from = $(this).clone();
//        $(to).replaceWith(copy_from);
//        $(this).replaceWith(copy_to);
//    });
//};


