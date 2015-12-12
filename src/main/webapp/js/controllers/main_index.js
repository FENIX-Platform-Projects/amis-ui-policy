requirejs.config({

    baseUrl: 'js/libs',

    paths : {
        jquery : '//code.jquery.com/jquery-1.11.0.min',
        ap_util_functions : '../controller_util/ap_util_functions',
        json : "../../config/json",
        jqueryui : 'jquery-ui.min',
        highcharts : '//fenixrepo.fao.org/cdn/js/highcharts/4.0.4/js/highcharts',
        'swiper' : 'idangerous.swiper.min',
        jqueryuicustom : '//fenixrepo.fao.org/cdn/js/jquery-ui/1.9.2/jquery-ui.custom.min',
        xDomainRequest: '//fenixrepo.fao.org/cdn/js/jQuery.XDomainRequest/jQuery.XDomainRequest',
        jqwidget : 'jqwidgets-ver3.4.0/jqwidgets/jqx-all',
        bootstrap: 'bootstrap.min',
        pnotify: 'pnotify.custom.min',
        nprogress: 'nprogress',
        webix: 'webix',
        fullscreen: 'jquery.fullscreen-min',
        host: '../controllers/ap_queryAndDownload',

        amisChart: '../amis_charts',
        controllerHome: '../controller_home'
    },

    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        jqwidget:{
            export: "$",
            deps: ['jquery']
        },
        pnotify: {
            deps: ['bootstrap']
        },
        xDomainRequest:{
            deps: ['jquery']
        }
    }
});

//This function is called when js/host.js is loaded.
//If host.js calls define(), then this function is not fired until
//host's dependencies have loaded, and the Host argument will hold
//the module value for "js/host".

//RequireJS supports loader plugins.
// This is a way to support dependencies that are not plain JS files,
// but are still important for a script to have loaded before it can do its work.
// This is the case of domReady => will not be called until DOM is ready
//require(['host', 'jquery', 'text!json/conf.json', 'domReady!'], function( Host, $, conf )
    require(['ap_util_functions', 'text!json/auth_users.json', 'amisChart', 'controllerHome', 'domReady!'], function(UtilityFunctions, authUsersFile, AmisChart, ControllerHome ) {

        ControllerHome.init();
        UtilityFunctions.authentication(authUsersFile);

    });
