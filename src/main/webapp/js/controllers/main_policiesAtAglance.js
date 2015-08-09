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
        //xDomainRequest: '//fenixapps.fao.org/repository/fenix/scripts/lib/jQuery.XDomainRequest',
        //sticky_plugin: '//fenixapps.fao.org/repository/js/stickyjs/1.0/jquery.sticky',
        xDomainRequest: '//fenixrepo.fao.org/cdn/js/jQuery.XDomainRequest/jQuery.XDomainRequest',
        sticky_plugin: '//fenixrepo.fao.org/cdn/js/stickyjs/1.0/jquery.sticky',

//        Le HTML5 shim, for IE6-8 support of HTML5 elements
        html_5:'//html5shim.googlecode.com/svn/trunk/html5',

//      <script type="text/javascript" src="js/common/policyDataObject.js"></script>
//      <script type="text/javascript" src="js/controller_util/ap_util_variables.js"></script>
//    <script type="text/javascript" src="js/controller_util/ap_util_functions.js"></script>
        ap_policyDataObject : '../common/policyDataObject',
        ap_util_variables : '../controller_util/ap_util_variables',
        ap_util_functions : '../controller_util/ap_util_functions',

//      <script type="text/javascript" src="js/commons.js"></script>
//      <script type="text/javascript" src="js/widgets/ap_sidemenu.js"></script>
//    <script type="text/javascript" src="js/controller_util/ap_policiesAtaGlance_biofuelPolicyTypes_util.js"></script>
//    <script type="text/javascript" src="js/controller_util/ap_policiesAtaGlance_biofuelPolicyMeasures_util.js"></script>
//    <script type="text/javascript" src="js/controller_util/ap_policiesAtaGlance_exportRestrictions_util.js"></script>
//    <script type="text/javascript" src="js/controller_util/ap_policiesAtaGlance_exportSubsidies_util.js"></script>
//    <script type="text/javascript" src="js/controller_util/ap_policiesAtaGlance_importTariffsQuotas_util.js"></script>
//    <script type="text/javascript" src="js/controller_util/ap_policiesAtaGlance_policyByCommodities_util.js"></script>
//    <script type="text/javascript" src="js/controllers/ap_policiesAtaGlance.js"></script>
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
        json: '../../json'
    },

    shim: {
        bootstrap: {
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
require(['ap_policiesAtaGlance', 'jquery', 'domReady!'], function( Ap_policiesAtaGlance, $ ) {

   // console.log("main policies at a glance js ");
//    var ap_policiesAtaGlance = new Ap_policiesAtaGlance();
//    ap_policiesAtaGlance.init();
    Ap_policiesAtaGlance.init();

    //Fake login
    //$(".protected").hide();
    //$('#sign-in-btn').on('click', function(){
    //    $('#signInModal').modal('hide');
    //    $(".protected").show();
    //});

   // $(".protected").addClass("disabled");
    var sessionStorageValueAttr = sessionStorage.getItem("value")
    if((sessionStorageValueAttr!=null)&&(typeof sessionStorageValueAttr!="undefined")&&(sessionStorageValueAttr=='login')){
    }else{
        $(".protected").addClass("disabled");
        $("#dataentry_editPolicy").hide();
        $("#dataentry_addPolicy").hide();
    }
    $('#sign-in-btn').on('click', function(){
        $('#signInModal').modal('hide');
        $(".protected").removeClass("disabled");
        $("#dataentry_editPolicy").show();
        $("#dataentry_addPolicy").show();
        if (typeof(Storage) != "undefined") {
            // Store
            sessionStorage.setItem("value", "login");
        }
    });
});