requirejs.config({

    baseUrl: 'js/libs',

    paths : {
        jquery : '//code.jquery.com/jquery-1.11.0.min',
        bootstrap: 'bootstrap.min',
        jqueryui : 'jquery-ui.min',
        jqueryuicustom : '//fenixrepo.fao.org/cdn/js/jquery-ui/1.9.2/jquery-ui.custom.min',
        jqwidget : 'jqwidgets-ver3.4.0/jqwidgets/jqx-all',
        jQAllRangeSliders: 'jQAllRangeSliders-min',
        highstock: '//fenixrepo.fao.org/cdn/js/highstock/2.0.1/highstock',
        highcharts: '//fenixrepo.fao.org/cdn/js/highstock/2.0.1/highstock',
        highstock_exporting: '//code.highcharts.com/stock/modules/exporting',
        highcharts_exporting: '//code.highcharts.com/stock/modules/exporting',
        xDomainRequest: '//fenixrepo.fao.org/cdn/js/jQuery.XDomainRequest/jQuery.XDomainRequest',
        sticky_plugin: '//fenixrepo.fao.org/cdn/js/stickyjs/1.0/jquery.sticky',
//        Le HTML5 shim, for IE6-8 support of HTML5 elements
        html_5:'//html5shim.googlecode.com/svn/trunk/html5',
        ap_policyDataObject : '../common/policyDataObject',
        ap_util_variables : '../controller_util/ap_util_variables',
        ap_util_functions : '../controller_util/ap_util_functions',
        commons : '../commons',
        ap_sidemenu : '../widgets/ap_sidemenu',
        ap_policiesAtaGlance_biofuelPolicyTypes_util: '../controller_util/ap_policiesAtaGlance_biofuelPolicyTypes_util',
        ap_policiesAtaGlance_biofuelPolicyMeasures_util: '../controller_util/ap_policiesAtaGlance_biofuelPolicyMeasures_util',
        ap_policiesAtaGlance_exportRestrictions_util: '../controller_util/ap_policiesAtaGlance_exportRestrictions_util',
        ap_policiesAtaGlance_exportSubsidies_util: '../controller_util/ap_policiesAtaGlance_exportSubsidies_util',
        ap_policiesAtaGlance_importTariffsQuotas_util: '../controller_util/ap_policiesAtaGlance_importTariffsQuotas_util',
        ap_policiesAtaGlance_policyByCommodities_util: '../controller_util/ap_policiesAtaGlance_policyByCommodities_util',
        ap_policiesAtaGlance: '../controllers/ap_policiesAtaGlance',
        history: '../jquery.history',
        structure : '../controller_util/structure',
        smoothScroll : 'smoothScroll',
        modernizr: 'modernizr',
        json: '../../json',
        configjson: '../../config/json'
    },

    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        jqueryui: {
            deps: ['jquery']
        },
        jqueryuicustom: {
            deps: ['jqueryui']
        },
        highcharts_exporting: {
            deps: ['highcharts']
        },
        highcharts: {
            deps: ['jquery']
        },
        highstock_exporting: {
            deps: ['highstock']
        },
        highstock: {
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
require(['ap_policiesAtaGlance', 'jquery', 'ap_util_functions', 'text!configjson/auth_users.json', 'domReady!'], function( Ap_policiesAtaGlance, $, UtilityFunctions, authUsersFile ) {

    Ap_policiesAtaGlance.init();
    UtilityFunctions.authentication(authUsersFile);
});