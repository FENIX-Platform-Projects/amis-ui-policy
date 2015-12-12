requirejs.config({

    baseUrl: 'js/libs',

    paths : {
        jquery : '//code.jquery.com/jquery-1.11.0.min',
        ap_util_functions : '../controller_util/ap_util_functions',
        json : "../../config/json",
        jqueryui : 'jquery-ui.min',
        jqueryuicustom : '//fenixrepo.fao.org/cdn/js/jquery-ui/1.9.2/jquery-ui.custom.min',
        jqwidget : 'jqwidgets-ver3.4.0/jqwidgets/jqx-all',
        bootstrap: 'bootstrap.min',
        pnotify: 'pnotify.custom.min',
        nprogress: 'nprogress',
        webix: 'webix',
        host: '../controllers/ap_queryAndDownload'
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
        },
        jqueryui:{
            deps: ['jquery']
        },
        jqueryuicustom:{
            deps: ['jqueryui']
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
require(['ap_util_functions', 'text!json/auth_users.json', 'domReady!'], function(UtilityFunctions, authUsersFile ) {

    UtilityFunctions.authentication(authUsersFile);
});
