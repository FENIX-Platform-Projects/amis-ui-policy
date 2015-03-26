define([
    'backbone',
    'qd_controller',
    'text!json/conf.json',
    'text!json/dataEntry_conf.json',
    'host_utility',
    'host_domainParser',
    'host_buttonActions',
    'host_policyDataObject',
    'host_preview',
    'nprogress',
//    'fenix-map',
//    'router',
    'jquery',
    'jQAllRangeSliders',
    'xDomainRequest'

//], function(Backbone, Qd, conf , data_entry_conf, HostUtility, HostDomainParser, HostButtonActions, HostPolicyDataObject, HostPreview, NProgress, Router){
], function(Backbone, Qd, conf , data_entry_conf, HostUtility, HostDomainParser, HostButtonActions, HostPolicyDataObject, HostPreview, NProgress){

    var optionsDefault = {

        host_utility_instance : '',
        //Ajax Calls and Parsing
        host_domain_parser : '',
        //Data Object
        host_policy_data_object : '',
        //Host Button Actions
        host_button_actions : '',

        //The array containing the grid event that are listened by the host
        generic_component_structure_event : [],

        domain_type : '',
        language : '',
        url_commodity : '',

        //Selector id
        fx_selector_1 : 'fx_selector_1',
        fx_selector_2 : 'fx_selector_2',
        fx_selector_3 : 'fx_selector_3',
        fx_selector_4 : 'fx_selector_4',
        fx_selector_5 : 'fx_selector_5',
        fx_selector_6 : 'fx_selector_6',
        fx_selector_7 : 'fx_selector_7',
        fx_selector_8_1 : 'fx_selector_8_1',
        fx_selector_8_2 : 'fx_selector_8_2',

        //To WDS
//        base_ip_address    :  '168.202.28.26',
//        base_ip_port    :  '8090',
        base_ip_address    :  'statistics.amis-outlook.org',
        base_ip_port    :  '80',
        datasource      :   'POLICY',
//        policyTypes_url   :   '/wds/rest/policyservice/policyTypes',
//        startAndEndDate_url   :   '/wds/rest/policyservice/startEndDate',
//        //For Preview Action
//        downloadPreview_url     :   '/wds/rest/policyservice/downloadPreview',
//        masterFromCplId_url     :   '/wds/rest/policyservice/masterFromCplId',
//        policyTable_url     :   '/wds/rest/policyservice/downloadPreviewPolicyTable',
//        shareGroupCommodities_url     :   '/wds/rest/policyservice/shareGroupInfo',
        policyTypes_url   :   '/wdspolicy/rest/policyservice/policyTypes',
        startAndEndDate_url   :   '/wdspolicy/rest/policyservice/startEndDate',
        //For Preview Action
        downloadPreview_url     :   '/wdspolicy/rest/policyservice/downloadPreview',
        masterFromCplId_url     :   '/wdspolicy/rest/policyservice/masterFromCplId',
        masterFromCplIdAndSubnational     :   '/wdspolicy/rest/policyservice/masterFromCplIdAndSubnational',
        policyTable_url     :   '/wdspolicy/rest/policyservice/downloadPreviewPolicyTable',
        shareGroupCommodities_url     :   '/wdspolicy/rest/policyservice/shareGroupInfo',
        mapData     :   '/wdspolicy/rest/policyservice/mapData',
//        gaulsubnationalLevel_url    :   'GAUL/1.0?level=2',
        //gaulsubnationalLevel_url    :   'GAUL/1.0?level=2',

        //To D3S for GAUL
//        codelist_url_2    :   'http://faostat3.fao.org:7777/msd/cl/code/',
        codelist_url_2    :   'http://faostat3.fao.org/d3s2/v2/msd/codes/filter',
        //To D3S
        codelist_url    :   'http://faostat3.fao.org/d3sp/service/msd/cl/system',
//        codelist_url    :   'http://faostat3.fao.org:7788/msd/cl/system',
       // codelist_url    :   'http://hqlprfenixapp2.hq.un.fao.org:7788/msd/cl/system',
        codelist_url_CommodityAgricultural  :  'OECD_CommodityClass1',
        codelist_url_CommodityBiofuels  :  'OECD_CommodityClass2',
        codelist_url_CommodityBoth  :   'OECD_CommodityClass',
        codelist_url_Country  : 'OECD_Country',
        codelist_url_PolicyType :   'OECD_PolicyType',

        //Utility Options
        //For Year Slider
        slider_start_date : '',
        slider_end_date : '',
        slider_start_date_dd : '',
        slider_start_date_mm : '',
        slider_start_date_yy : '',
        slider_end_date_dd : '',
        slider_end_date_mm : '',
        slider_end_date_yy : '',

        //Commodity Domain Code
        commodity_domain_both : '1,2',
        commodity_domain_agricultural : '1',
        commodity_domain_biofuels : '2',

        //Policy Domain Code
        policy_domain_both : '1,2',
        policy_domain_trade : '1',
        policy_domain_domestic : '2',

        //This variable is used to know the number of calls
        //to load the policy measures associated with the policy types
        policy_measure_calls : 0,
        policy_measure_actual_calls : 0,

        //Year Actual Tab Types
        slider : 'slider',
        classic : 'classic',

        //1=Wheat 2=Rice 3=Maize 4=Soybeans
        commodity_parent_codes : ['1','2','3','4'],
        //8=Wheat+Maize 9=Maize+Rice 10=Maize+Soybean 11=Wheat+Maize+Rice 12=Wheat+Rice
        commodity_children_codes : [['8','11','12'],['9','11','12'],['8','9','10','11'],['10']],

        country_agricultural_domestic_codes : ['17','37','46','53','999000','116','126','202','132','162','204','249','254','259','227'],

        //"preview" is Query and Download page, "search" is Input Data page
        button_preview_action_type : "preview",
//        button_preview_action_type : "search",

        //This is used in the Search action
//        default_start_date : '1983-01-01',
        default_start_date : '1995-01-01',
        default_end_date : '2025-01-01'
    }

    //text= Loads dependencies as plain text files.
    function Host(o){

        if (this.options === undefined) {
            this.options = {};
        }
        $.extend(true, this.options, optionsDefault, o);

        var self = this;
        if(this.options.button_preview_action_type == "search") {
            require(['router'], function(Router) {
                self.initRouter(Router, self);
            });
        }
    }

//    Host.prototype.init = function(){
//      this.initQDComponent();
//    }

    Host.prototype.map_event_creation = function(){
        this.options.generic_component_structure_event["selected_fx_selector_1_changed"] = "selected_fx_selector_1_changed";
        this.options.generic_component_structure_event["selected_fx_selector_2_changed"] = "selected_fx_selector_2_changed";
        this.options.generic_component_structure_event["selected_fx_selector_3_changed"] = "selected_fx_selector_3_changed";
        this.options.generic_component_structure_event["selected_fx_selector_4_changed"] = "selected_fx_selector_4_changed";
        this.options.generic_component_structure_event["selected_fx_selector_5_changed"] = "selected_fx_selector_5_changed";
        this.options.generic_component_structure_event["selected_fx_selector_6_changed"] = "selected_fx_selector_6_changed";
        this.options.generic_component_structure_event["selected_fx_selector_7_changed"] = "selected_fx_selector_7_changed";
        this.options.generic_component_structure_event["selected_fx_selector_8_1_changed"] = "selected_fx_selector_8_1_changed";
        this.options.generic_component_structure_event["selected_fx_selector_8_2_changed"] = "selected_fx_selector_8_2_changed";
        this.options.generic_component_structure_event["selected_fx_selector_8_2_menu_item1_changed"] = "selected_fx_selector_8_2_menu_item1_changed";
        this.options.generic_component_structure_event["selected_fx_selector_8_2_menu_item2_changed"] = "selected_fx_selector_8_2_menu_item2_changed";
    };

    //The Host has to know:
    //1- The query component controller
    //2- The events associated with each selector
    //3- The events associated with the controller

    Host.prototype.initQDComponent = function(){

        this.options.host_utility_instance = new HostUtility();
        this.options.host_domain_parser = new HostDomainParser();
        this.options.host_policy_data_object = new HostPolicyDataObject();
        this.options.host_button_actions = new HostButtonActions();
        this.options.host_button_actions.options.host_preview = new HostPreview();

        //this.options.host_button_actions.options.host_preview.createMap("map2");
        var self = this;
        this.map_event_creation();

        //-> Generic Component
        //The object will be used to set properties, that could be useful for other use cases
        var obj ='';

        var qd_instance = '';

        if(this.options.button_preview_action_type == "search"){
            //Data Entry
            qd_instance = new Qd({
                container :  document.querySelector('#qd_component')
            }).initialize(JSON.parse(data_entry_conf), obj);
            this.initInputFunctionalities();
        }
        else{
            //By default is Query and Download
            qd_instance = new Qd({
                container :  document.querySelector('#qd_component')
            }).initialize(JSON.parse(conf), obj);
        }

        //It's possible to put this listener here because the "selectors_added" event is called just once
        //The variable of the model for this selector is changed
        //The body is used because the #fx_selector_4 is not yet in the html

        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_1_changed"], function(){

            var selecteditem = qd_instance.getSelectedItems(self.options.fx_selector_2);
            var selectItemsArray = [];
            selectItemsArray.push(selecteditem);
            //Reload the selection for Policy Domain to force the 'selected_fx_selector_2_changed' event
            //Select
            qd_instance.update_selector_selection(self.options.fx_selector_2, selectItemsArray, true);
//            var prop = {};
//            prop.tab_type = 1;
//            prop.values =[0,1,2,3];
////            prop.values[0]= new Date(2003, 5, 7);
////            prop.values[1]= new Date(2012, 0, 31);
//            qd_instance.update_selector_selection(self.options.fx_selector_7,prop);
        });

        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_2_changed"], function(){

            //The Loading Window
            NProgress.start();
            var selecteditem = qd_instance.getSelectedItems(self.options.fx_selector_1);
            if((selecteditem!=null)&&(typeof selecteditem!='undefined'))
            {
                var commodity_domain = ''+selecteditem.code;
                if(commodity_domain== '-1')
                {
                    //Both
                    commodity_domain = self.options.commodity_domain_both;
                }
                var selecteditem2 = qd_instance.getSelectedItems(self.options.fx_selector_2);
                if((selecteditem2!=null)&&(typeof selecteditem2!='undefined'))
                {
                    var policy_domain = ''+selecteditem2.code;

                    if(policy_domain == '-1')
                    {
                        //Both
                        policy_domain = self.options.policy_domain_both;
                    }
                    //Reload Commodity Class
                    selector_id = self.options.fx_selector_5;
                    if(commodity_domain == self.options.commodity_domain_agricultural)
                    {
                        //Agricultural
                        rest_url = {'rest_url_type':self.options.codelist_url_CommodityAgricultural};
                    }
                    else if(commodity_domain == self.options.commodity_domain_biofuels)
                    {
                        //Biofuels
                        rest_url = {'rest_url_type':self.options.codelist_url_CommodityBiofuels};
                    }
                    else
                    {
                        //Both
                        rest_url = {'rest_url_type':self.options.codelist_url_CommodityBoth};
                    }

                    //Reload commodity
                    self.options.host_domain_parser.getDomain(qd_instance, selector_id, rest_url, self);

                    //Enable Disable Country
                    self.options.host_domain_parser.listbox_country_element_enable_and_disable(qd_instance, self.options.fx_selector_1, self.options.fx_selector_2, self.options.fx_selector_6, self);

                    //Reload Policy Types
                    var selector_id = self.options.fx_selector_3;
                    var rest_url = {'rest_url_type':self.options.policyTypes_url, 'rest_url_datasource' : self.options.datasource};
                    self.options.host_domain_parser.getDomainPolicyType(qd_instance, selector_id, rest_url, policy_domain, commodity_domain, self);
                }
            }
        });

        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_3_changed"], function(){

            self.options.host_domain_parser.listbox_element_enable_and_disable(qd_instance, self.options.fx_selector_3, self.options.fx_selector_4);
//            var selecteditems = qd_instance.getSelectedItems('fx_selector_3');
//            //console.log(selecteditems);
//            //For each policy type reload the policy measure list
//            var policy_type_codes = '';
//            for(var i=0; i<selecteditems.length;i++)
//            {
//                //Each items has this format: //{value: type + "_" + i + "_" + json[i][0], label: '' + json[i][1]};
//                var value = selecteditems[i].value;
//                var index= value.lastIndexOf("_");
//                var code = value.substring(index+1);
//                policy_type_codes += code;
//                if(i<(selecteditems.length-1))
//                {
//                    policy_type_codes += ', ';
//                }
//            }
            //console.log("policy_type_codes "+policy_type_codes);
        });

        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_4_changed"], function(){
        });

        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_5_changed"], function(event, properties){

            //properties.changed_item
            //console.log("Properties... ");
//            console.log(event);
            //console.log(properties);
            //Full domain
//            var source_domain = qd_instance.getSelector_domain(self.options.fx_selector_5, true);
//            console.log("Source domain ");
//            console.log(source_domain);
            var selecteditem = qd_instance.getSelectedItems(self.options.fx_selector_5);
            //console.log(selecteditem);
            var item = properties.changed_item;
//            //1=Wheat 2=Rice 3=Maize 4=Soybeans
//            commodity_parent_codes : [1,2,3,4],
//            //8=Wheat+Maize 9=Maize+Rice 10=Maize+Soybean 11=Wheat+Maize+Rice 12=Wheat+Rice
//            commodity_children_codes : [[8,11,12],[9,11,12],[8,9,10,11],[10]]

            //console.log("Item... ");
            //console.log(item);
            //value="Commodity_8"
            if((item!=null)&&(typeof item!='undefined')) {
                //console.log("1111 ");
                if ((item.value != null) && (typeof item.value != 'undefined') && (item.value.length > 0)) {
                    //console.log("22222 ");
                    var code = item.value.substring(item.value.indexOf('_') + 1);
                    var parent_index = $.inArray(code, self.options.commodity_parent_codes);
                    if (parent_index != -1) {
                        //Case: Maize, Rice, Soybean, Wheat
                        //console.log("item.selected =  "+item.selected);
                        if (item.event_type == 'select') {
                            //The item has been selected
                            var items_to_select = self.options.commodity_children_codes[parent_index];
                            //console.log("items_to_select ");
                            var source_domain = qd_instance.getSelector_domain(self.options.fx_selector_5, true);
                            //console.log("Source domain ");
                           // console.log(source_domain);
                            //console.log(source_domain[0].value);
                            //From the codes to select to the indexes
                            if ((source_domain != null) && (typeof source_domain != 'undefined') && (items_to_select != null) && (typeof items_to_select != 'undefined')) {
                                var properties_index = [];
                                for (var j = 0; j < items_to_select.length; j++) {
                                    for (var i = 0; i < source_domain.length; i++) {
                                        //Commodity_code
                                        if (source_domain[i].value.indexOf(items_to_select[j]) != -1) {
                                            //Index of the element to select
                                            properties_index.push(i);
                                        }
                                    }
                                }
                                properties_index = self.options.host_utility_instance.unique(properties_index);
                                if ((properties_index != null) && (typeof properties_index != 'undefined') && (properties_index.length > 0)) {
                                    qd_instance.update_selector_selection(self.options.fx_selector_5, properties_index, true);
                                }
                            }
                        }
                    }
                }
            }


            //To select
//            var items_to_select = [];
//            if((selecteditem!=null)&&(typeof selecteditem!= 'undefined')&&(selecteditem.length>0))
//            {
//                for(var i=0; i<selecteditem.length;i++)
//                {
//                    if((selecteditem[i].originalItem!=null)&&(typeof selecteditem[i].originalItem!= 'undefined')&&(selecteditem[i].originalItem.code!=null)&&(typeof selecteditem[i].originalItem.code!= 'undefined'))
//                    {
//                        //Case: Maize, Rice, Soybean, Wheat, Biodisel, Biofuel, Ethanol
//                        //Only the elements that are not linked to the checkbox action have the code
////                        console.log("Before parent_index selecteditem[i].originalItem.code "+selecteditem[i].originalItem.code+" self.options.commodity_parent_codes ");
////                        console.log(self.options.commodity_parent_codes);
//                        var parent_index = $.inArray(selecteditem[i].originalItem.code, self.options.commodity_parent_codes);
//                        //console.log("After parent_index parent_index "+parent_index);
//                        if((parent_index!=null)&&(typeof parent_index!= 'undefined')&&(parent_index!=-1))
//                        {
//                            //Case: Maize, Rice, Soybean, Wheat
//
//                            //This code belongs to the four parent commodities
//                            //Select all the children
////                            console.log("Before items_to_select ");
////                            console.log(items_to_select);
//                            // Merge object2 into object1
////                            $.extend( items_to_select, self.options.commodity_children_codes[parent_index] );
//                            items_to_select =items_to_select.concat(self.options.commodity_children_codes[parent_index]);
////                            console.log("After concat ");
////                            console.log(items_to_select);
////                            for(var iChild=0; iChild<self.options.commodity_children_codes[parent_index].length;iChild++)
////                            {
////                                items_to_select.push(self.options.commodity_children_codes[parent_index][iChild]);
////                            }
////                            items_to_select=$.unique(items_to_select);
////                            console.log("After unique ");
////                            console.log(items_to_select);
////                            console.log(items_to_select.unique());
//                        }
//                        else{
//                            //Case: Biodisel, Biofuel, Ethanol
//                            //items_to_select.push(selecteditem[i].originalItem.code);
//                        }
//                    }
//                    else{
//                        //Case: Wheat+Maize Maize+Rice Maize+Soybean Wheat+Maize+Rice Wheat+Rice
//                        //items_to_select.push(selecteditem[i].originalItem.code);
//                    }
//                }
//                //Contains the codes of all the children
//                items_to_select = self.options.host_utility_instance.unique(items_to_select);
//            }
//            console.log("End ");
//            console.log(items_to_select);
//
//            var source_domain = qd_instance.getSelector_domain(self.options.fx_selector_5, true);
//            console.log("Source domain ");
//            console.log(source_domain);
//            console.log(source_domain[0].value);
//            //From the codes to select to the indexes
//            if((source_domain !=null)&&(typeof source_domain!='undefined')&&(items_to_select !=null)&&(typeof items_to_select!='undefined'))
//            {
//                var properties_index = [];
//                for(var j=0; j<items_to_select.length; j++) {
//                    for (var i = 0; i < source_domain.length; i++) {
//                        //Commodity_code
//                        if (source_domain[i].value.indexOf(items_to_select[j])!=-1) {
//                            //Index of the element to select
//                            properties_index.push(i);
//                        }
//                    }
//                }
//                properties_index = self.options.host_utility_instance.unique(properties_index);
//                console.log("properties_index ");
//                console.log(properties_index);
//                if((properties_index !=null)&&(typeof properties_index!='undefined')&&(properties_index.length>0))
//                {
//                    qd_instance.update_selector_selection(self.options.fx_selector_5, properties_index, true);
//                }
//            }
        });

        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_6_changed"], function(){
            //console.log('Host selected_fx_selector_6_changed ');
        });

        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_8_2_changed"], function(){
            var export_type = 'AllData';
            self.options.host_button_actions.download_action(qd_instance, self, export_type);
        });
//        Old Download with the menu containing: Policy Data and Shared Group Data START
//        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_8_2_menu_item1_changed"], function(){
//            //console.log('Host selected_fx_selector_8_2_menu_item1_changed ');
//            var export_type = 'AllData';
//            self.options.host_button_actions.download_action(qd_instance, self, export_type);
//        });
//
//        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_8_2_menu_item2_changed"], function(){
//            //console.log('Host selected_fx_selector_8_2_menu_item2_changed ');
//            var export_type = 'ShareGroupData';
//            self.options.host_button_actions.download_action(qd_instance, self, export_type);
//        });
//        Old Download with the menu containing: Policy Data and Shared Group Data END
        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_8_1_changed"], function(){
            // console.log('Host selected_fx_selector_8_1_changed ');
            self.options.host_button_actions.preview_action(qd_instance, self);
        });

        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_7_changed"], function(){
//            console.log('Host selected_fx_selector_7_changed ');
        });

        //This callback is called when all the selectors have been added
        $(qd_instance.options.qd_component_main_div).on(qd_instance.options.generic_component_structure_event["selectors_added"], function(){
            //-> Generic Component
            //Initialization of the model
            //qd_instance.model_initialize(); --> It's called by the controller

            //Format "elements" : [{"value":true,"id":"fx_selector_1_rb1", "label":"Agricultural", "code": 1}, {"value":false,"id":"fx_selector_1_rb2", "label":"Biofuels", "code":2}, {"value":false,"id":"fx_selector_1_rb3", "label":"Both", "code":-1}],
            //Commodity Domain
            var selector_id ='';
            var selector_id = self.options.fx_selector_1;
            qd_instance.update_selector_domain(selector_id, '', '');

            //Policy Domain
            selector_id = self.options.fx_selector_2;
            qd_instance.update_selector_domain(selector_id, '', '');
            //Policy Measure is called by the Policy Types action
            //Commodity Class
            selector_id = self.options.fx_selector_5;
            rest_url = {'rest_url_type':self.options.codelist_url_CommodityAgricultural};
            self.options.host_domain_parser.getDomain(qd_instance, selector_id, rest_url, self);
            //Country
            selector_id = self.options.fx_selector_6;
            rest_url = self.options.codelist_url_Country;
            rest_url = {'rest_url_type':self.options.codelist_url_Country};
            self.options.host_domain_parser.getDomain(qd_instance, selector_id, rest_url, self);
            selector_id = self.options.fx_selector_7;
            rest_url = {'rest_url_type':self.options.startAndEndDate_url, 'rest_url_datasource' : self.options.datasource};
            self.options.host_domain_parser.getDomainYear(qd_instance, selector_id, rest_url, self);
        });
    };

    Host.prototype.initInputFunctionalities = function () {
        this.initExpertSearch();
        this.bindEventListeners();
    };

    Host.prototype.bindEventListeners = function () {
        $('body').on("EditSearchButton", $.proxy(this.onEditAction, this));
        $('body').on("DeleteSearchButton", $.proxy(this.onDeleteAction, this));
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            $('#standard_preview_jqxgrid').jqxGrid('clear');
        })
    };

    Host.prototype.onEditAction = function (e, payload) {
        console.log(payload)
        window.currentRecord = payload;
        console.log(payload)
        //window.open("http://example.com/", '_self');
        //Backbone.history.navigate('/record/edit/', {trigger:true, replace: false})
    };

    Host.prototype.onDeleteAction = function (e, payload) {
        var $modal = $('#deleteModal'),
            $submit = $modal.find("#delMod_submit"),
            $cplid = $modal.find("#delMod_cplid"),
            $commid = $modal.find("#delMod_commid"),
            $polid = $modal.find("#delMod_polid"),
            $locid = $modal.find("#delMod_loc"),
            $text = $modal.find("#delMod_text");
        $submit.attr("disabled", "disabled");
        $cplid.html(payload.CplId);
        $commid.html(payload.Policy_id);
        $polid.html(payload.CommodityId);
        $locid.html(payload.location_condition);
        //TODO remove previous handler
        $text.on('change paste keyup', function () {
            if ($text.val() !== ''){
                $submit.removeAttr('disabled')
            } else {
                $submit.attr("disabled","disabled");
            }
        });
        $modal.modal('show');
        $submit.on('click', function () {
            $modal.modal('hide');
        } )
    };

    Host.prototype.initExpertSearch = function () {
        $('#expert_search_submit').on('click', $.proxy(this.onExpertSearchSubmit, this));
    };
    Host.prototype.onExpertSearchSubmit = function () {
        var value = $('#expert_search_input').val();
        if (this.validateExpertSearch(value)) {
            var p = {
                "datasource": "POLICY",
                "policy_domain_code": "",
                "commodity_domain_code": "",
                "commodity_class_code": "",
                "policy_type_code": [
                ],
                "policy_measure_code": [
                ],
                "country_code": "",
                "yearTab": "",
                "year_list": "",
                "start_date": "",
                "end_date": "",
                "cpl_id": "'" + value + "'",
                "commodity_id": ""
            };
            this.options.host_button_actions.options.host_preview.getPolicyFromCpls(this, JSON.stringify(p));
        } else {
            this.showExpertError('Invalid CPL id');
        }
    };
    Host.prototype.showExpertError = function (e) {
        var alert = '<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Warning!</strong> ' + e + ' </div>';
        $('.expert_search_alert_container').html(alert);
    };
    Host.prototype.validateExpertSearch = function (payload) {
        var valid = true;
        if (typeof payload !== 'string') {
            valid = false;
        }
        return valid;
    };
    Host.prototype.initRouter = function (Router, self) {
        // Pass in our Router module and call it's initialize function
        var router = new Router({ host : self });
    };

    return Host;

});
