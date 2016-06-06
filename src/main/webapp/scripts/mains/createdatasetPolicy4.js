/*global require*/
// relative or absolute path of Components' main.js
require([
    '../../submodules/fenix-ui-common/js/Compiler',
    //'../../submodules/fenix-ui-metadata-editor/js/paths'
//], function (Compiler, MetadataEditor, Menu) {
], function (Compiler, Menu) {

    //var metadataEditorConfig = MetadataEditor;
    //metadataEditorConfig['baseUrl'] = '../../submodules/fenix-ui-metadata-editor/js/';


    //Compiler.resolve([metadataEditorConfig],
    Compiler.resolve([],
        {
            placeholders:  {"FENIX_CDN": "//fenixapps.fao.org/repository"},
            config: {

                locale: 'en',

                // The path where your JavaScripts are located
                baseUrl: './scripts/datamng',

                // Specify the paths of vendor libraries
                paths: {
                    underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
                    backbone: "{FENIX_CDN}/js/backbone/1.1.2/backbone.min",
                    handlebars: "{FENIX_CDN}/js/handlebars/2.0.0/handlebars",
                    chaplin: "{FENIX_CDN}/js/chaplin/1.0.1/chaplin.min",
                    amplify : '{FENIX_CDN}/js/amplify/1.1.2/amplify.min'
                },

                // Underscore and Backbone are not AMD-capable per default,
                // so we need to use the AMD wrapping of RequireJS
                shim: {
                    underscore: {
                        exports: '_'
                    },
                    backbone: {
                        deps: ['underscore', 'jquery'],
                        exports: 'Backbone'
                    },
                    handlebars: {
                        exports: 'Handlebars'
                    },
                    amplify: {
                        deps: ['jquery'],
                        exports: 'amplifyjs'
                    }
                }
                // For easier development, disable browser caching
                // Of course, this should be removed in a production environment
                //, urlArgs: 'bust=' +  (new Date()).getTime()
            }
        });

    // Bootstrap the application
    require([
        'fx-editor/start',
        'domReady!'
    ], function (Editor) {

        dataEntryaddEventListener();

    });

    function dataEntryaddEventListener(){
        $('body').on("DeleteSearchButton", $.proxy(this.onDeleteAction, this));
    }

    function onDeleteAction(e, payload){
        //Host.prototype.onEditAction = function (e, payload) {
        //    console.log(payload)
        //    window.currentRecord = payload;
        //    console.log(payload)
        //    //window.open("http://example.com/", '_self');
        //    //Backbone.history.navigate('/record/edit/', {trigger:true, replace: false})
        //};

        var sourceValues = null, resourceTypeValue = "dataset", readOnlyValue = false;

        if (getURLParameter("uid") != null && getURLParameter("version") == null) {
            sourceValues = {
                // "urlTest": "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/metadata/uid/" + getURLParameter("uid") + "?full=true",
                "url": "http://faostat3.fao.org/d3s2/v2/msd/resources/metadata/uid/" + getURLParameter("uid") + "?full=true",
                "type": "get"
            };
        }

        if (getURLParameter("version") != null && getURLParameter("uid") != null) {
            sourceValues = {
                // "urlTest": "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/metadata/" + getURLParameter("uid") + "/" + getURLParameter("version") + "?full=true",
                "url": "http://faostat3.fao.org/d3s2/v2/msd/resources/metadata/" + getURLParameter("uid") + "/" + getURLParameter("version") + "?full=true",
                "type": "get"
            };
        }

        if (getURLParameter("resourceType") != null) {
            resourceTypeValue = getURLParameter("resourceType");
        }

        if (isURLParameter("readonly")) {
            readOnlyValue = true;
        }

        console.log("sourceValues")
        console.log(sourceValues)
        //Set require JS Metadata Editor configuration
        var leftSideMenu = false;
        var guiJsonFile = '';
        var validationFile = '';
        var jsonMappingFile = '';
        var ajaxEventCallsFile = '';
        if(leftSideMenu){
            //guiJsonFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-gui-config.json";
            //validationFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-validation-config.json";
            //jsonMappingFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-mapping-config.json";
            //ajaxEventCallsFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-ajax-config.json";

            guiJsonFile = "./submodules/amis-ui-policy-data-entry/config/metadataEditorSubmodule/fx-editor-gui-config.json";
            validationFile = "./submodules/amis-ui-policy-data-entry/config/metadataEditorSubmodule/fx-editor-validation-config.json";
            jsonMappingFile = "./submodules/amis-ui-policy-data-entry/config/metadataEditorSubmodule/fx-editor-mapping-config.json";
            ajaxEventCallsFile =  "./submodules/amis-ui-policy-data-entry/config/metadataEditorSubmodule/fx-editor-ajax-config.json";

        }
        else{
            //guiJsonFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-gui-config-noMenu.json";
            //validationFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-validation-config-noMenu.json";
            //jsonMappingFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-mapping-config-noMenu.json";
            //ajaxEventCallsFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-ajax-config-noMenu.json";

            guiJsonFile = "./submodules/amis-ui-policy-data-entry/config/metadataEditorSubmodule/fx-editor-gui-config-noMenu.json";
            validationFile = "./submodules/amis-ui-policy-data-entry/config/metadataEditorSubmodule/fx-editor-validation-config-noMenu.json";
            jsonMappingFile = "./submodules/amis-ui-policy-data-entry/config/metadataEditorSubmodule/fx-editor-mapping-config-noMenu.json";
            ajaxEventCallsFile =  "./submodules/amis-ui-policy-data-entry/config/metadataEditorSubmodule/fx-editor-ajax-config-noMenu.json";
        }

        var guiJson = $.getJSON(guiJsonFile);
        $.when($.getJSON(guiJsonFile))
            .done(function( guiJson) {
//                console.log(guiJson.panels[0]);
//                var guiObj = guiJson.panels[0];
//                console.log(guiJson)
//                console.log(guiJson.panels[0].properties.summary.properties.country.value.default);

                summaryDefaultValueSetting(guiJson);
                console.log(guiJson.panels[0].properties.summary.properties);
                var userConfig = {
                    container: "div#metadataEditorContainer",
//            source: sourceValues,
                    source: null,
                    resourceType: 'dataset', //dataset, geographic, codelist
                    readOnly: readOnlyValue,
                    widget: {
                        lang: 'EN'
                    },
                    config: {
                        guiIsObj: true,
                        //gui: guiJsonFile,
                        gui: guiJson,
                        validation: validationFile,
                        jsonMapping: jsonMappingFile,
                        ajaxEventCalls: ajaxEventCallsFile,
                        //dates: "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-dates-config.json"
                        dates: "./submodules/amis-ui-policy-data-entry/config/metadataEditorSubmodule/fx-editor-dates-config.json"
                    },
                    leftSideMenu:leftSideMenu,
                    submit_default_action:"overwrite"
                };
                this.editor = new Editor().init(userConfig);
            });
    }

    function summaryDefaultValueSetting(guiJson){

        if((guiJson!=null)&&(typeof guiJson!='undefined')){
            if((guiJson.panels[0].properties.summary.properties.country)&&(typeof guiJson.panels[0].properties.summary.properties.country)){
                guiJson.panels[0].properties.summary.properties.country.value = {};
                guiJson.panels[0].properties.summary.properties.country.value.default = "Argentina";
            }

            if((guiJson.panels[0].properties.summary.properties.subnational!=null)&&(typeof guiJson.panels[0].properties.summary.properties.subnational!='undefined')){
                guiJson.panels[0].properties.summary.properties.subnational.value = {};
                guiJson.panels[0].properties.summary.properties.subnational.value.default = "n.a";
            }

            if((guiJson.panels[0].properties.summary.properties.commodityClass!=null)&&(typeof guiJson.panels[0].properties.summary.properties.commodityClass!='undefined')){
                guiJson.panels[0].properties.summary.properties.commodityClass.value = {};
                guiJson.panels[0].properties.summary.properties.commodityClass.value.default = "Wheat";
            }

            if((guiJson.panels[0].properties.summary.properties.commodityId!=null)&&(typeof guiJson.panels[0].properties.summary.properties.commodityId!='undefined')){
                guiJson.panels[0].properties.summary.properties.commodityId.value = {};
                guiJson.panels[0].properties.summary.properties.commodityId.value.default = "108";
            }

            if((guiJson.panels[0].properties.summary.properties.policyDomain!=null)&&(typeof guiJson.panels[0].properties.summary.properties.policyDomain!='undefined')){
                guiJson.panels[0].properties.summary.properties.policyDomain.value = {};
                guiJson.panels[0].properties.summary.properties.policyDomain.value.default = "Trade";
            }

            if((guiJson.panels[0].properties.summary.properties.policyType!=null)&&(typeof guiJson.panels[0].properties.summary.properties.policyType!='undefined')){
                guiJson.panels[0].properties.summary.properties.policyType.value = {};
                guiJson.panels[0].properties.summary.properties.policyType.value.default = "Export measures";
            }

            if((guiJson.panels[0].properties.summary.properties.policyMeasure!=null)&&(typeof guiJson.panels[0].properties.summary.properties.policyMeasure!='undefined')){
                guiJson.panels[0].properties.summary.properties.policyMeasure.value = {};
                guiJson.panels[0].properties.summary.properties.policyMeasure.value.default = "Licensing requirement";
            }

            if((guiJson.panels[0].properties.summary.properties.policyCondition!=null)&&(typeof guiJson.panels[0].properties.summary.properties.policyCondition!='undefined')){
                guiJson.panels[0].properties.summary.properties.policyCondition.value = {};
                guiJson.panels[0].properties.summary.properties.policyCondition.value.default = "none";
            }

            //Gui to policy element query
            if((guiJson.panels[0].properties.policyElement.source.url!=null)&&(typeof guiJson.panels[0].properties.policyElement.source.url!='undefined')){
                var policyMeasureCode = 3;
                guiJson.panels[0].properties.policyElement.source.url+= "/"+policyMeasureCode;
            }
        }
    }

    function getURLParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    }

    function isURLParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return true;
            }
        }
    }

});