/* global define */
/*global define*/
define(['jquery', 'fx-submodules/config/baseConfig'],
    function ($, config_base) {

        'use strict';

        //Use the following example to override properties:
        //services.SERVICE_BASE_ADDRESS = "http://fenix.fao.org/d3s_dev2/msd";

        /*var services = {

         TOP_MENU: {
         url: 'json/fenix-ui-topmenu_config.json',
         active: "createdataset"
         },
         SERVICE_BASE_ADDRESS: "http://fenix.fao.org/d3s_dev/msd"
         };*/

        var cfg = {};
        $.extend(cfg, config_base);

        // configuration data management
        cfg.DSD_EDITOR_CODELISTS = "config/submodules/DSDEditor/CodelistsUneca.json";
        //cfg.DSD_EDITOR_CONTEXT_SYSTEM = "UNECA";
        cfg.DSD_EDITOR_CONTEXT_SYSTEM = "uneca";
        cfg.DSD_EDITOR_LABEL = "UNECA"

        cfg.METADATA_PATH = {
            schemaPath: '../../config/PolicyMetadata/schemas/'
        };

        cfg.METADATA_SEC= [
            //{
            //    id: "identification", text: "Identification",
            //    state: {
            //        selected: true
            //    }
            //},
            {id: "contacts", text: "Contacts"},
            {
                id: "content", text: "Content", state: {opened: true}, children: [
                {id: 'content_ReferencePopulation', text: "Reference Population"},
                {id: 'content_Coverage', text: "Coverage"}
            ]
            },
            {id: "institutionalMandate", text: "Institutional Mandate"},
            {
                id: "statisticalProcessing",
                text: "Statistical Processing",
                state: {disabled: true, opened: true},
                children: [
                    //{id: 'statisticalProcessing_primaryDataCollection', text: "Primary Data Collection"},
                    {id: 'statisticalProcessing_secondaryDataCollection', text: "Secondary Data Collection"},
                    {id: 'statisticalProcessing_dataCompilation', text: "Data Compilation"}
                ]
            },
            {
                id: "dataQuality", text: "Data Quality", state: {disabled: true, opened: true},
                children: [
                {id: "dataQuality_compatibilityCoherence", text: "Compatibility Coherence"}
            ]
            },
            {
                id: "accessibility", text: "Accessibility", state: {disabled: true, opened: true}, children: [
                {
                    id: "accessibility_dataDissemination",
                    text: "Data Dissemination",
                    state: {disabled: true, opened: true},
                    children: [
                        {id: "accessibility_dataDissemination_distribution", text: "Distribution"},
                        {id: "accessibility_dataDissemination_releasePolicy", text: "Release Policy"}
                    ],

                },
                {id: "accessibility_confidentiality", text: "Confidentiality"}
            ]
            },
            {
                id: "maintenance", text: "Maintenance", state: {opened: true}, children: [
                {id: "maintenance_update", text: "Update"},
                {id: "maintenance_metadataMaintenance", text: "Metadata Maintenance"}
            ]
            }
            //,{ id: "documents", text: "Documents" }
        ]

        //cfg.METADATA_EDITOR_AJAX_EVENT_CALL = "config/submodules/metadataEditor/fx-editor-ajax-config_DEMO.json";
        cfg.METADATA_EDITOR_AJAX_EVENT_CALL = "config/submodules/metadataEditor/fx-editor-ajax-config_PROD.json";



        cfg.TOP_MENU= {
            container : '#top-menu-container',
            url: 'config/submodules/fx-menu/top_menu_data_mng.json',
            //    template: 'fx-menu/templates/blank-fluid.html',
            active: "datamgmt"
        };

        cfg.FAKE_AUTHENTICATION = false;

        return cfg;

    });

