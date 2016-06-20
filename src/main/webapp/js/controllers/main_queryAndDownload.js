/*global require*/
// relative or absolute path of Components' main.js
require([
    '../../submodules/fenix-ui-common/js/Compiler',
    //'../../submodules/fenix-ui-metadata-editor/js/paths',
    '../../submodules/amis-ui-policy-data-entry/js/paths',
    '../../submodules/fenix-ui-common/js/paths',
    '../../submodules/fenix-ui-metadata-editor/js/paths',
    '../../submodules/fenix-ui-datamanagement-commons/js/paths',
    '../../submodules/fenix-ui-data-management/src/js/paths',
    '../../submodules/fenix-ui-metadata-viewer/src/js/paths'
], function (Compiler, AmisPolicyDataEntry, FenixUiCommon, MetadataEditor, DataManagementCommon, DataManagement, MetadataViewer) {
//], function (Compiler, MetadataEditor, AmisPolicyDataEntry, FenixUiCommon) {

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
            placeholders:  {"FENIX_CDN": "//fenixrepo.fao.org/cdn"},
            config: {

                baseUrl: 'js/libs',

                paths: {
                    jquery: '//code.jquery.com/jquery-1.11.0.min',
                    host: '../controllers/ap_queryAndDownload',
                    handlebars: "{FENIX_CDN}/js/handlebars/4.0.5/handlebars.min",
                    host_utility: '../controller_util/ap_queryAndDownload_utility',
                    host_domainParser: '../controller_util/ap_queryAndDownload_domain_parser',
                    host_policyDataObject: '../controller_util/ap_queryAndDownload_policy_data_object',
                    host_buttonActions: '../controller_util/ap_queryAndDownload_button_actions',
                    host_preview: '../controller_util/ap_queryAndDownload_preview',
                    ap_util_functions : '../controller_util/ap_util_functions',
                    ap_policyDataObject : '../common/policyDataObject',
                    json: "../../config/json",
                    jqueryui: 'jquery-ui.min',
                    jqueryuicustom: '//fenixrepo.fao.org/cdn/js/jquery-ui/1.9.2/jquery-ui.custom.min',
                    xDomainRequest: '//fenixrepo.fao.org/cdn/js/jQuery.XDomainRequest/jQuery.XDomainRequest',
                    jqwidget: 'jqwidgets-ver3.4.0/jqwidgets/jqx-all',
                    bootstrap: 'bootstrap.min',
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
                    'chosen': '//fenixrepo.fao.org/cdn/js/chosen/1.0.0/chosen.jquery.min',
                    'leaflet': '//fenixrepo.fao.org/cdn/js/leaflet/0.7.3/leaflet',
                    'import-dependencies': '//fenixrepo.fao.org/cdn/js/FENIX/utils/import-dependencies-1.0',
                    'jquery.power.tip': '//fenixrepo.fao.org/cdn/js/jquery.power.tip/1.1.0/jquery.powertip.min',
                    'jquery-ui': '//fenixrepo.fao.org/cdn/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
                    'jquery.i18n.properties': '//fenixrepo.fao.org/cdn/js/jquery/1.0.9/jquery.i18n.properties-min',
                    'jquery.hoverIntent': '//fenixrepo.fao.org/cdn/js/jquery.hoverIntent/1.0/jquery.hoverIntent'
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
                    },
                    pnotify: {
                        deps: ['bootstrap']
                    },
                    xDomainRequest: {
                        deps: ['jquery']
                    },
                    jqueryui:{
                        deps: ['jquery']
                    },
                    jqueryuicustom:{
                        deps: ['jqueryui']
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
require(['host', 'ap_util_functions', 'jquery', 'text!json/auth_users.json', 'domReady!'], function( Host, UtilityFunctions, $, authUsersFile ) {

    var host = new Host({button_preview_action_type : "preview"});
    host.initQDComponent();

    UtilityFunctions.authentication(authUsersFile, host);
});
});