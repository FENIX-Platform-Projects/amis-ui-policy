requirejs.config({

    baseUrl: 'js/libs',

    paths : {
        jquery : '//code.jquery.com/jquery-1.11.0.min',
        host : '../controllers/ap_queryAndDownload',
        host_utility : '../controller_util/ap_queryAndDownload_utility',
        host_domainParser : '../controller_util/ap_queryAndDownload_domain_parser',
        host_policyDataObject : '../controller_util/ap_queryAndDownload_policy_data_object',
        host_buttonActions : '../controller_util/ap_queryAndDownload_button_actions',
        host_preview : '../controller_util/ap_queryAndDownload_preview',
        json : "../../config/json",
//        jqueryui : '//code.jquery.com/ui/1.10.3/jquery-ui.min',
        jqueryui : 'jquery-ui.min',
        jqueryuicustom : '//fenixapps.fao.org/repository/js/jquery-ui/1.9.2/jquery-ui.custom.min',
        xDomainRequest: '//fenixapps.fao.org/repository/fenix/scripts/lib/jQuery.XDomainRequest',
        jqwidget : 'jqwidgets-ver3.4.0/jqwidgets/jqx-all',
        bootstrap: 'bootstrap.min',
//        bootstrap: '//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min',
        jQAllRangeSliders: 'jQAllRangeSliders-min',
        qd_utils:  '../qd/qd_utils',
        qd_board:  '../qd/qd_board',
        qd_controller : '../qd/qd_controller',
        qd_selector: '../qd/qd_selector',
        qd_model: '../qd/qd_model',
        qd_catalog_selector: '../qd/qd_catalog_selector',
        template: '../../templates',
        board_catalog: '../qd/board_catalog',
        selector_catalog: '../qd/selector_catalog',
        model_catalog: '../qd/model_catalog',
        qd_catalog_model: '../qd/qd_catalog_model',
        pnotify: 'pnotify.custom.min',
        nprogress: 'nprogress',
        webix: 'webix',
        fullscreen: 'jquery.fullscreen-min',
        underscore: 'underscore',
        router: '../router',
        models: '../models',
        views: '../views',
        collections: '../collections'
    },

    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        "jquery.history": {
            deps: ['jquery']
        },
        underscore: {
            exports: '_'
        },
        jqwidget:{
            export: "$",
            deps: ['jquery']
        },
        jQAllRangeSliders:{
            deps: ['jquery', 'jqueryui', 'jqueryuicustom']
            // deps: ['jquery', 'jqueryuicustom']
        },
        pnotify: {
            deps: ['bootstrap']
        },
        xDomainRequest:{
            deps: ['jquery']
        }
    }

    // Add this map config in addition to any baseUrl or
    // paths config you may already have in the project.
    /*    map: {
     // '*' means all modules will get 'jquery-private'
     // for their 'jquery' dependency.
     '*': { 'jquery': 'jquery-private' },

     // 'jquery-private' wants the real jQuery module
     // though. If this line was not here, there would
     // be an unresolvable cyclic dependency.
     'jquery-private': { 'jquery': 'jquery' }
     }*/
});

//This function is called when js/host.js is loaded.
//If host.js calls define(), then this function is not fired until
//host's dependencies have loaded, and the Host argument will hold
//the module value for "js/host".

//RequireJS supports loader plugins.
// This is a way to support dependencies that are not plain JS files,
// but are still important for a script to have loaded before it can do its work.
// This is the case of domReady => will not be called until DOM is ready
//require(['host', 'jquery','domReady!'], function( Host, $ ) {
//
//    var host = new Host({button_preview_action_type : "search"});
//    host.initQDComponent();
//
//    //Fake login
//    $(".protected").hide();
//    $('#sign-in-btn').on('click', function(){
//        $('#signInModal').modal('hide');
//        $(".protected").show();
//    });
//});

require([
    "backbone.layoutmanager",
    "domReady!",
    "bootstrap"
], function (Layout) {
    'use strict';
// Backbone Layout Manager: Configure globally.
    Layout.configure({
        manage: true
    });
    require(["host" ], function ( Host ) {
//DataEntry.initialize();
        var host = new Host({button_preview_action_type : "search"});
        console.log(host);
        host.initQDComponent();
    });
});