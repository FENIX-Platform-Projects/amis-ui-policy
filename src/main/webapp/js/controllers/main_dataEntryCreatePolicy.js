require([
    '../../submodules/fenix-ui-common/js/Compiler',
    //'../../submodules/fenix-ui-metadata-editor/js/paths',
    '../../submodules/amis-ui-policy-data-entry/js/paths',
    '../../submodules/fenix-ui-common/js/paths',
    '../../submodules/fenix-ui-metadata-editor/js/paths',
    '../../submodules/fenix-ui-datamanagement-commons/js/paths',
    '../../submodules/fenix-ui-data-management/src/js/paths',
    '../../submodules/fenix-ui-metadata-viewer/src/js/paths'
//], function (Compiler, MetadataEditor, AmisPolicyDataEntry, FenixUiCommon) {
], function (Compiler, AmisPolicyDataEntry, FenixUiCommon, MetadataEditor, DataManagementCommon, DataManagement, MetadataViewer) {

    //var metadataEditorConfig = MetadataEditor;
    //metadataEditorConfig['baseUrl'] = '../../submodules/fenix-ui-metadata-editor/js/';
    var amisPolicyDataEntry = AmisPolicyDataEntry;
    amisPolicyDataEntry['baseUrl'] = '../../submodules/amis-ui-policy-data-entry/js/';
    var menuConfig = AmisPolicyDataEntry;
    menuConfig['baseUrl'] = '../../submodules/amis-ui-policy-data-entry/js/';
    var fenixUiCommon = FenixUiCommon;
    fenixUiCommon['baseUrl'] = '../../submodules/fenix-ui-common/js/';
    var metadataEditor = MetadataEditor;
    metadataEditor['baseUrl'] = '../../submodules/fenix-ui-metadata-editor/js/';
    var dataManagementCommon = DataManagementCommon;
    dataManagementCommon['baseUrl'] = '../../submodules/fenix-ui-datamanagement-commons/js/';
    var dataManagement = DataManagement;
    dataManagement['baseUrl'] = '../../submodules/fenix-ui-data-management/src/js/';
    var metadataViewer = MetadataViewer;
    metadataViewer['baseUrl'] = '../../submodules/fenix-ui-metadata-viewer/src/js/';

    Compiler.resolve([fenixUiCommon, amisPolicyDataEntry, metadataEditor,dataManagementCommon, dataManagement, metadataViewer],
        {
            //placeholders:  {"FENIX_CDN": "//fenixapps.fao.org/repository"},
            placeholders:  {"FENIX_CDN": "//fenixrepo.fao.org/cdn"},
            config: {
                baseUrl: 'js/libs',

                paths : {
                    underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
                    backbone: "{FENIX_CDN}/js/backbone/1.1.2/backbone.min",
                    handlebars: "{FENIX_CDN}/js/handlebars/4.0.5/handlebars.min",
                    chaplin: "{FENIX_CDN}/js/chaplin/1.0.1/chaplin.min",
                    amplify : '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',

                    jquery : '//code.jquery.com/jquery-1.11.0.min',
                    host : '../controllers/ap_queryAndDownload',
                    host_utility : '../controller_util/ap_queryAndDownload_utility',
                    host_domainParser : '../controller_util/ap_queryAndDownload_domain_parser',
                    host_policyDataObject : '../controller_util/ap_queryAndDownload_policy_data_object',
                    host_buttonActions : '../controller_util/ap_queryAndDownload_button_actions',
                    host_preview : '../controller_util/ap_queryAndDownload_preview',
                    ap_util_functions : '../controller_util/ap_util_functions',
                    json : "../../config/json",
                    jqueryui : 'jquery-ui.min',
                    jqueryuicustom : '//fenixrepo.fao.org/cdn/js/jquery-ui/1.9.2/jquery-ui.custom.min',
                    xDomainRequest: '//fenixrepo.fao.org/cdn/js/jQuery.XDomainRequest/jQuery.XDomainRequest',
                    jqwidget : 'jqwidgets-ver3.4.0/jqwidgets/jqx-all',
                    bootstrap: 'bootstrap.min',
                    jQAllRangeSliders: 'jQAllRangeSliders-min',
                    qd_utils:  '../qd/qd_utils',
                    qd_board:  '../qd/qd_board',
                    qd_controller : '../qd/qd_controller',
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
                    router: '../router',
                    models: '../models',
                    views: '../views',
                    collections: '../collections',
                    createdatasetPolicy: '../../scripts/mains/createdatasetPolicy3',
                    moment : '{FENIX_CDN}/js/moment/2.12.0/min/moment.min',
                    ap_policyDataObject : '../common/policyDataObject',
                    'fx-d-m/config/config' : "../../config/submodules/fx-data-mng/Config",
                    'fx-submodules/config/baseConfig' : '../../config/submodules/config_base'
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
                    },
                    handlebars: {
                        exports: 'Handlebars'
                    },
                    amplify: {
                        deps: ['jquery'],
                        exports: 'amplifyjs'
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
            }
        });

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
            require(["host", 'ap_util_functions', 'text!json/auth_users.json'], function ( Host, UtilityFunctions, authUsersFile ) {

            var host = new Host({button_preview_action_type : "searchCreatePolicy"});
            host.initQDComponent();
            UtilityFunctions.authentication(authUsersFile, host);

            });
    });
});