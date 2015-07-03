/*global require*/
// relative or absolute path of Components' main.js
require([
    '../../submodules/fenix-ui-common/js/Compiler',
    '../../submodules/fenix-ui-metadata-editor/js/paths'
], function (Compiler, MetadataEditor, Menu) {

    var metadataEditorConfig = MetadataEditor;
    metadataEditorConfig['baseUrl'] = '../../submodules/fenix-ui-metadata-editor/js/';

    //alert("Before compiler")

    Compiler.resolve([metadataEditorConfig],
        {
            placeholders:  {"FENIX_CDN": "//fenixapps.fao.org/repository"},
            config: {

                baseUrl: 'js/libs',

                paths: {
                    jquery: '//code.jquery.com/jquery-1.11.0.min',
                    host: '../controllers/ap_queryAndDownload',
                    host_utility: '../controller_util/ap_queryAndDownload_utility',
                    host_domainParser: '../controller_util/ap_queryAndDownload_domain_parser',
                    host_policyDataObject: '../controller_util/ap_queryAndDownload_policy_data_object',
                    host_buttonActions: '../controller_util/ap_queryAndDownload_button_actions',
                    host_preview: '../controller_util/ap_queryAndDownload_preview',
                    ap_policyDataObject : '../common/policyDataObject',
                    json: "../../config/json",
//        jqueryui : '//code.jquery.com/ui/1.10.3/jquery-ui.min',
                    jqueryui: 'jquery-ui.min',
                    jqueryuicustom: '//fenixapps.fao.org/repository/js/jquery-ui/1.9.2/jquery-ui.custom.min',
                    xDomainRequest: '//fenixapps.fao.org/repository/fenix/scripts/lib/jQuery.XDomainRequest',
                    jqwidget: 'jqwidgets-ver3.4.0/jqwidgets/jqx-all',
                    bootstrap: 'bootstrap.min',
//        bootstrap: '//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min',
                    jQAllRangeSliders: 'jQAllRangeSliders-min',
                    qd_utils: '../qd/qd_utils',
                    qd_board: '../qd/qd_board',
                    qd_controller: '../qd/qd_controller',
                    qd_selector: '../qd/qd_selector',
                    qd_model: '../qd/qd_model',
                    qd_catalog_selector: '../qd/qd_catalog_selector',
                    ap_util_variables : '../controller_util/ap_util_variables',
                    template: '../../templates',
                    board_catalog: '../qd/board_catalog',
                    selector_catalog: '../qd/selector_catalog',
                    model_catalog: '../qd/model_catalog',
                    qd_catalog_model: '../qd/qd_catalog_model',
                    pnotify: 'pnotify.custom.min',
                    nprogress: 'nprogress',
                    webix: 'webix',
                    fullscreen: 'jquery.fullscreen-min',
                    //fenix-map-js
//        'fenix-map' :'http://fenixapps.fao.org/repository/js/fenix-map-js/1.0/fenix-map-min',
//        'fenix-map-config' :'http://fenixapps.fao.org/repository/js/fenix-map-js/1.0/fenix-map-config',
                    'chosen': '//fenixapps.fao.org/repository/js/chosen/1.0.0/chosen.jquery.min',
                    'leaflet': '//fenixapps.fao.org/repository/js/leaflet/0.7.3/leaflet',
                    'import-dependencies': '//fenixapps.fao.org/repository/js/FENIX/utils/import-dependencies-1.0',
                    'jquery.power.tip': '//fenixapps.fao.org/repository/js/jquery.power.tip/1.1.0/jquery.powertip.min',
                    'jquery-ui': '//fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
                    'jquery.i18n.properties': '//fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min',
                    'jquery.hoverIntent': '//fenixapps.fao.org/repository/js/jquery.hoverIntent/1.0/jquery.hoverIntent'
                },

                shim: {
                    bootstrap: {
                        deps: ['jquery']
                    },
                    "jquery.history": {
                        deps: ['jquery']
                    },
                    underscore: {
                        exports: '_'
                    },
                    "jquery.i18n.properties": {
                        deps: ['jquery']
                    },
                    jqwidget: {
                        export: "$",
                        deps: ['jquery']
                    },
                    jQAllRangeSliders: {
                        deps: ['jquery', 'jqueryui', 'jqueryuicustom']
                        // deps: ['jquery', 'jqueryuicustom']
                    },
                    pnotify: {
                        deps: ['bootstrap']
                    },
                    xDomainRequest: {
                        deps: ['jquery']
                    }
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
require(['host', 'jquery', 'domReady!'], function( Host, $ ) {

//require(['jquery','domReady!'], function( $ ) {
    var host = new Host({button_preview_action_type : "preview"});
    host.initQDComponent();

    //Fake login
    //$(".protected").hide();
    //$('#sign-in-btn').on('click', function(){
    //    $('#signInModal').modal('hide');
    //    $(".protected").show();
    //});

    //$(".protected").addClass("disabled");
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
});