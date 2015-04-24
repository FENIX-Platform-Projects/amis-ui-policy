define([
    'backbone',
    'qd_controller',
    'text!json/conf.json',
    'text!json/editPolicy_conf.json',
    'text!json/createPolicy_conf.json',
    'host_utility',
    'host_domainParser',
    'host_buttonActions',
    'host_policyDataObject',
    'host_preview',
    'nprogress',
    'fx-editor/start',
//    'fenix-map',
//    'router',
    'jquery',
    'jQAllRangeSliders',
    'xDomainRequest'

//], function(Backbone, Qd, conf , data_entry_conf, HostUtility, HostDomainParser, HostButtonActions, HostPolicyDataObject, HostPreview, NProgress, Router){
], function(Backbone, Qd, conf , data_entry_edit_policy_conf, data_entry_create_policy_conf, HostUtility, HostDomainParser, HostButtonActions, HostPolicyDataObject, HostPreview, NProgress, DataEntryEditor){
//], function(Backbone, Qd, HostUtility, HostDomainParser, HostButtonActions, HostPolicyDataObject, HostPreview, NProgress, DataEntryEditor){

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

        //Selector type
        condition_selector_type: 'Condition',
        subnational_selector_type: 'Subnational',
        commodityDetail_selector_type: 'CommodityDetail',
        individualPolicy_selector_type: 'IndividualPolicy',

        //Selector id
        fx_selector_1 : 'fx_selector_1',
        fx_selector_2 : 'fx_selector_2',
        fx_selector_3 : 'fx_selector_3',
        fx_selector_4 : 'fx_selector_4',
        fx_selector_5 : 'fx_selector_5',
        fx_selector_5_b : 'fx_selector_5_b',
        fx_selector_6 : 'fx_selector_6',
        fx_selector_6_b : 'fx_selector_6_b',
        fx_selector_7 : 'fx_selector_7',
        fx_selector_7_b : 'fx_selector_7_b',
        fx_selector_8_1 : 'fx_selector_8_1',
        fx_selector_8_2 : 'fx_selector_8_2',

        //To WDS
        base_ip_address    :  '168.202.28.26',
        base_ip_port    :  '10400',
//        base_ip_address    :  'statistics.amis-outlook.org',
//        base_ip_port    :  '80',
        datasource      :   'POLICY',
//        policyTypes_url   :   '/wds/rest/policyservice/policyTypes',
//        startAndEndDate_url   :   '/wds/rest/policyservice/startEndDate',
//        //For Preview Action
//        downloadPreview_url     :   '/wds/rest/policyservice/downloadPreview',
//        masterFromCplId_url     :   '/wds/rest/policyservice/masterFromCplId',
//        policyTable_url     :   '/wds/rest/policyservice/downloadPreviewPolicyTable',
//        shareGroupCommodities_url     :   '/wds/rest/policyservice/shareGroupInfo',
        policyTypes_url   :   '/wdspolicy/rest/policyservice/policyTypes',
        commodity_url   :   '/wdspolicy/rest/policyservice/commodity',
        condition_url   :   '/wdspolicy/rest/policyservice/condition',
        cplIdForCountry_url : '/wdspolicy/rest/policyservice/cplIdForCountry',
        individualPolicy_url    : '/wdspolicy/rest/policyservice/individualPolicy',
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
        default_end_date : '2025-01-01',

        CANCEL: "fx.editor.cancel.host",
        onEditActionObj: ''
    }

    //text= Loads dependencies as plain text files.
    function Host(o){

        if (this.options === undefined) {
            this.options = {};
        }
        $.extend(true, this.options, optionsDefault, o);

        var self = this;
        if(((this.options.button_preview_action_type == "searchEditPolicy")||(this.options.button_preview_action_type == "searchCreatePolicy"))) {
            require(['router'], function(Router) {
                self.dataEntryaddEventListener();
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

        if(this.options.button_preview_action_type == "searchEditPolicy"){
            //Data Entry
            qd_instance = new Qd({
                container :  document.querySelector('#qd_component')
            }).initialize(JSON.parse(data_entry_edit_policy_conf), obj);
            //qd_instance = new Qd({
            //    container :  document.querySelector('#qd_component')
            //}).initialize(JSON.parse(json_conf), obj);
            this.initInputFunctionalities();
        }
        else if(this.options.button_preview_action_type == "searchCreatePolicy"){
            //Data Entry
            qd_instance = new Qd({
                container :  document.querySelector('#qd_component')
            }).initialize(JSON.parse(data_entry_create_policy_conf), obj);
            //qd_instance = new Qd({
            //    container :  document.querySelector('#qd_component')
            //}).initialize(JSON.parse(json_conf), obj);
            this.initInputFunctionalities();
        }
        else{
            //By default is Query and Download
            qd_instance = new Qd({
                container :  document.querySelector('#qd_component')
            }).initialize(JSON.parse(conf), obj);
            //qd_instance = new Qd({
            //    container :  document.querySelector('#qd_component')
            //}).initialize(JSON.parse(json_conf), obj);
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
            //The commodity class selector doesn't lunch events if the use case is: "Create a policy"
            if(self.options.button_preview_action_type != "searchCreatePolicy"){
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
            }
            else{
                //Get Commodity for the selected Commodity Class
                //var policy_measure_selector_id = self.options.fx_selector_4;

                var item = properties.changed_item;
                var event_type = '';

                if((item!=null)&&(typeof item!= "undefined")&&((event_type = item.event_type) == 'select')){
                    //alert("Change Item");
                    //console.log(item)
                    var obj_code = item.originalItem.code;
                    var rest_url = {'rest_url_type':self.options.commodity_url, 'rest_url_datasource' : self.options.datasource};
                    //var url_type = url_type_var.rest_url_type;
                    //var url_datasource = url_type_var.rest_url_datasource;
                    var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/' + obj_code;
                    //var rest_url = {'rest_url_type':self.options.commodity_url, 'rest_url_datasource' : self.options.datasource, 'rest_url_specific_code': obj_code};
                    //var rest_url = {'rest_url_type':self.options.commodity_url};
                    self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_5_b, url, self);
                }

                //for (var i = 0; i < data.length; i++) {
                //    var obj_code = data[i].code;
                //    rest_url = {'rest_url_type':self.options.codelist_url_PolicyType, 'rest_url_specific_code': obj_code};
                //    self.options.host_domain_parser.getDomain(qd_controller_instance, policy_measure_selector_id, rest_url, self);
                //}
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

            if(self.options.button_preview_action_type=="searchCreatePolicy"){
                //alert("8.1 changed searchCreatePolicy")
                //Create a new Policy
                document.body.addEventListener(self.options.CANCEL, function (e) {
                    $("#metadataEditorContainer").hide();
                    $(".previous_content").show();
                });

                var payload= {};
                self.options.onEditActionObj = {master_data:'', policy_data:''};
                $.proxy(self.master_data_fields_creation(qd_instance), self);
                $.proxy(self.onEditAction(''), self);
            }
            else{
                //Edit a Policy or Preview
                self.options.host_button_actions.preview_action(qd_instance, self);
            }
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
            if(self.options.button_preview_action_type=="searchCreatePolicy"){
                //Condition
                var rest_url = {'rest_url_type':self.options.condition_url, 'rest_url_datasource' : self.options.datasource};
                //var url_type = url_type_var.rest_url_type;
                //var url_datasource = url_type_var.rest_url_datasource;
                var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource;
                //var rest_url = {'rest_url_type':self.options.commodity_url, 'rest_url_datasource' : self.options.datasource, 'rest_url_specific_code': obj_code};
                //var rest_url = {'rest_url_type':self.options.commodity_url};
                self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_7, url, self);

                //Individual Policy
                var rest_url = {'rest_url_type':self.options.individualPolicy_url, 'rest_url_datasource' : self.options.datasource};
                var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource;
                self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_7_b, url, self);

                console.log(self.options.host_domain_parser)
                self.options.host_domain_parser.subnationalInfo(qd_instance, self);
            }
            else{
                selector_id = self.options.fx_selector_7;
                rest_url = {'rest_url_type':self.options.startAndEndDate_url, 'rest_url_datasource' : self.options.datasource};
                self.options.host_domain_parser.getDomainYear(qd_instance, selector_id, rest_url, self);
            }
        });
    };

    Host.prototype.initInputFunctionalities = function () {
        this.initExpertSearch();
        this.bindEventListeners();
    };

    Host.prototype.bindEventListeners = function () {
        //$('body').on("EditSearchButton", $.proxy(this.onEditAction, this));
        $('body').on("DeleteSearchButton", $.proxy(this.onDeleteAction, this));
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            $('#standard_preview_jqxgrid').jqxGrid('clear');
        })
    };

    //Host.prototype.onEditAction = function (e, payload) {
    //    console.log(payload)
    //    window.currentRecord = payload;
    //    console.log(payload)
    //    //window.open("http://example.com/", '_self');
    //    //Backbone.history.navigate('/record/edit/', {trigger:true, replace: false})
    //};

    Host.prototype.master_data_fields_creation = function(qd_instance){

        var selecteditem_selector1 = qd_instance.getSelectedItems(this.options.fx_selector_1);
        console.log("self.options.fx_selector_1 ");
        console.log(selecteditem_selector1);
        var selecteditem_selector2 = qd_instance.getSelectedItems(this.options.fx_selector_2);
        console.log("self.options.fx_selector_2 ");
        console.log(selecteditem_selector2);
        var selecteditem_selector3 = qd_instance.getSelectedItems(this.options.fx_selector_3);
        console.log("self.options.fx_selector_3 ");
        console.log(selecteditem_selector3);
        var selecteditem_selector4 = qd_instance.getSelectedItems(this.options.fx_selector_4);
        console.log("self.options.fx_selector_4 ");
        console.log(selecteditem_selector4);
        var selecteditem_selector5 = qd_instance.getSelectedItems(this.options.fx_selector_5);
        console.log("self.options.fx_selector_5 ");
        console.log(selecteditem_selector5);
        var selecteditem_selector5b = qd_instance.getSelectedItems(this.options.fx_selector_5_b);
        console.log("self.options.fx_selector_5_b ");
        console.log(selecteditem_selector5b);
        var selecteditem_selector6 = qd_instance.getSelectedItems(this.options.fx_selector_6);
        console.log("self.options.fx_selector_6 ");
        console.log(selecteditem_selector6);
        var selecteditem_selector6b = qd_instance.getSelectedItems(this.options.fx_selector_6_b);
        console.log("self.options.fx_selector_6_b ");
        console.log(selecteditem_selector6b);
        var selecteditem_selector7 = qd_instance.getSelectedItems(this.options.fx_selector_7);
        console.log("self.options.fx_selector_7 ");
        console.log(selecteditem_selector7);
        var selecteditem_selector7b = qd_instance.getSelectedItems(this.options.fx_selector_7_b);
        console.log("self.options.fx_selector_7_b ");
        console.log(selecteditem_selector7b);

        this.options.onEditActionObj.master_data = {};
        this.options.onEditActionObj.master_data.CommodityClassCode = selecteditem_selector5[0].originalItem.code;
        this.options.onEditActionObj.master_data.CommodityClassName = selecteditem_selector5[0].originalItem.label;
        this.options.onEditActionObj.master_data.CommodityDomainCode = selecteditem_selector1.code;
        this.options.onEditActionObj.master_data.CommodityDomainName = selecteditem_selector1.label;
        this.options.onEditActionObj.master_data.CommodityId = '';
        this.options.onEditActionObj.master_data.CountryCode = selecteditem_selector6[0].originalItem.code;
        this.options.onEditActionObj.master_data.CountryName = selecteditem_selector6[0].originalItem.label;
        this.options.onEditActionObj.master_data.CplId = '';
        this.options.onEditActionObj.master_data.IndividualPolicyCode = selecteditem_selector7b[0].originalItem.code;
        this.options.onEditActionObj.master_data.IndividualPolicyName = selecteditem_selector7b[0].originalItem.label;
        this.options.onEditActionObj.master_data.PolicyCondition = selecteditem_selector7[0].originalItem.label;
        this.options.onEditActionObj.master_data.PolicyConditionCode = selecteditem_selector7[0].originalItem.code;
        this.options.onEditActionObj.master_data.PolicyDomainCode = selecteditem_selector2.code;
        this.options.onEditActionObj.master_data.PolicyDomainName = selecteditem_selector2.label;
        this.options.onEditActionObj.master_data.PolicyMeasureCode = selecteditem_selector4[0].originalItem.code;
        this.options.onEditActionObj.master_data.PolicyMeasureName = selecteditem_selector4[0].originalItem.label;
        this.options.onEditActionObj.master_data.PolicyTypeCode = selecteditem_selector3[0].originalItem.code;
        this.options.onEditActionObj.master_data.PolicyTypeName = selecteditem_selector3[0].originalItem.label;
        this.options.onEditActionObj.master_data.SubnationalCode = selecteditem_selector6b[0].originalItem.code;
        this.options.onEditActionObj.master_data.SubnationalName = selecteditem_selector6b[0].originalItem.label;
        console.log("IN 1 master_data_fields_creation")
        console.log(this.options.onEditActionObj)
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

    Host.prototype.dataEntryaddEventListener = function(){
        $('body').on("EditSearchButton", $.proxy(this.onEditAction, this));

        document.body.addEventListener(this.options.CANCEL, function (e) {
            $("#metadataEditorContainer").hide();
            $(".previous_content").show();
        });
    };

    Host.prototype.onEditAction = function(e, payload){
        $(".previous_content").hide();
        $("#metadataEditorContainer").show();

        console.log("onEditAction START!!!")
        console.log(this)
        console.log(this.options.onEditActionObj);
        console.log(payload);
        if((payload!=null)&&(typeof payload!="undefined")){
            this.options.onEditActionObj = {};
            this.options.onEditActionObj = payload;
        }
        //payload contains policy_data and master_data

        //Host.prototype.onEditAction = function (e, payload) {
        //    console.log(payload)
        //    window.currentRecord = payload;
        //    console.log(payload)
        //    //window.open("http://example.com/", '_self');
        //    //Backbone.history.navigate('/record/edit/', {trigger:true, replace: false})
        //};

        var sourceValues = null, resourceTypeValue = "dataset", readOnlyValue = false;

        if (this.getURLParameter("uid") != null && this.getURLParameter("version") == null) {
            sourceValues = {
                // "urlTest": "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/metadata/uid/" + getURLParameter("uid") + "?full=true",
                "url": "http://faostat3.fao.org/d3s2/v2/msd/resources/metadata/uid/" + this.getURLParameter("uid") + "?full=true",
                "type": "get"
            };
        }

        if (this.getURLParameter("version") != null && this.getURLParameter("uid") != null) {
            sourceValues = {
                // "urlTest": "http://exldvsdmxreg1.ext.fao.org:7788/v2/msd/resources/metadata/" + getURLParameter("uid") + "/" + getURLParameter("version") + "?full=true",
                "url": "http://faostat3.fao.org/d3s2/v2/msd/resources/metadata/" + this.getURLParameter("uid") + "/" + this.getURLParameter("version") + "?full=true",
                "type": "get"
            };
        }

        if (this.getURLParameter("resourceType") != null) {
            resourceTypeValue = this.getURLParameter("resourceType");
        }

        if (this.isURLParameter("readonly")) {
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
            guiJsonFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-gui-config.json";
            validationFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-validation-config.json";
            jsonMappingFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-mapping-config.json";
            ajaxEventCallsFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-ajax-config.json";
        }
        else{
            guiJsonFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-gui-config-noMenu.json";
            validationFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-validation-config-noMenu.json";
            jsonMappingFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-mapping-config-noMenu.json";
            ajaxEventCallsFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-ajax-config-noMenu.json";
        }

        var self = this;
        var guiJson = $.getJSON(guiJsonFile);
        $.when($.getJSON(guiJsonFile))
            .done(function( guiJson) {
//                console.log(guiJson.panels[0]);
//                var guiObj = guiJson.panels[0];
//                console.log(guiJson)
//                console.log(guiJson.panels[0].properties.summary.properties.country.value.default);

                self.summaryDefaultValueSetting(guiJson, self.options.onEditActionObj, self);
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
                        dates: "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-dates-config.json"
                    },
                    leftSideMenu:leftSideMenu,
                    submit_default_action:"overwrite"
                };
                //alert("Before calling DataEntryEditor")
                this.editor = new DataEntryEditor().init(userConfig);
            });
    };

    Host.prototype.summaryDefaultValueSetting = function(guiJson, payload, self){

        var masterdata = payload.master_data;
        var policydata = payload.policy_data;
        console.log("Before PAYLOAD")
        console.log(payload)
        if((guiJson!=null)&&(typeof guiJson!='undefined')){
            if((guiJson.panels[0].properties.summary.properties.country)&&(typeof guiJson.panels[0].properties.summary.properties.country)){
                guiJson.panels[0].properties.summary.properties.country.value = {};
                //guiJson.panels[0].properties.summary.properties.country.value.default = "Argentina";
                guiJson.panels[0].properties.summary.properties.country.value.default = masterdata.CountryName;
            }

            if((guiJson.panels[0].properties.summary.properties.subnational!=null)&&(typeof guiJson.panels[0].properties.summary.properties.subnational!='undefined')){
                guiJson.panels[0].properties.summary.properties.subnational.value = {};
                //guiJson.panels[0].properties.summary.properties.subnational.value.default = "n.a";
                guiJson.panels[0].properties.summary.properties.subnational.value.default = masterdata.SubnationalName;
            }

            if((guiJson.panels[0].properties.summary.properties.commodityDomain!=null)&&(typeof guiJson.panels[0].properties.summary.properties.commodityDomain!='undefined')){
                guiJson.panels[0].properties.summary.properties.commodityDomain.value = {};
                //guiJson.panels[0].properties.summary.properties.commodityClass.value.default = "Wheat";
                guiJson.panels[0].properties.summary.properties.commodityDomain.value.default = masterdata.CommodityDomainName;
            }

            if((guiJson.panels[0].properties.summary.properties.commodityClass!=null)&&(typeof guiJson.panels[0].properties.summary.properties.commodityClass!='undefined')){
                guiJson.panels[0].properties.summary.properties.commodityClass.value = {};
                //guiJson.panels[0].properties.summary.properties.commodityClass.value.default = "Wheat";
                guiJson.panels[0].properties.summary.properties.commodityClass.value.default = masterdata.CommodityClassName;
            }

            if((guiJson.panels[0].properties.summary.properties.commodityId!=null)&&(typeof guiJson.panels[0].properties.summary.properties.commodityId!='undefined')){
                guiJson.panels[0].properties.summary.properties.commodityId.value = {};
                //guiJson.panels[0].properties.summary.properties.commodityId.value.default = "108";
                guiJson.panels[0].properties.summary.properties.commodityId.value.default = masterdata.CommodityId;
            }

            if((guiJson.panels[0].properties.summary.properties.policyDomain!=null)&&(typeof guiJson.panels[0].properties.summary.properties.policyDomain!='undefined')){
                guiJson.panels[0].properties.summary.properties.policyDomain.value = {};
                //guiJson.panels[0].properties.summary.properties.policyDomain.value.default = "Trade";
                guiJson.panels[0].properties.summary.properties.policyDomain.value.default = masterdata.PolicyDomainName;
            }

            if((guiJson.panels[0].properties.summary.properties.policyType!=null)&&(typeof guiJson.panels[0].properties.summary.properties.policyType!='undefined')){
                guiJson.panels[0].properties.summary.properties.policyType.value = {};
                //guiJson.panels[0].properties.summary.properties.policyType.value.default = "Export measures";
                guiJson.panels[0].properties.summary.properties.policyType.value.default = masterdata.PolicyTypeName;
            }

            if((guiJson.panels[0].properties.summary.properties.policyMeasure!=null)&&(typeof guiJson.panels[0].properties.summary.properties.policyMeasure!='undefined')){
                guiJson.panels[0].properties.summary.properties.policyMeasure.value = {};
                //guiJson.panels[0].properties.summary.properties.policyMeasure.value.default = "Licensing requirement";
                guiJson.panels[0].properties.summary.properties.policyMeasure.value.default = masterdata.PolicyMeasureName;
            }

            if((guiJson.panels[0].properties.summary.properties.policyCondition!=null)&&(typeof guiJson.panels[0].properties.summary.properties.policyCondition!='undefined')){
                guiJson.panels[0].properties.summary.properties.policyCondition.value = {};
                //guiJson.panels[0].properties.summary.properties.policyCondition.value.default = "none";
                guiJson.panels[0].properties.summary.properties.policyCondition.value.default = masterdata.PolicyCondition;
            }

            if((guiJson.panels[0].properties.summary.properties.individualPolicy!=null)&&(typeof guiJson.panels[0].properties.summary.properties.individualPolicy!='undefined')){
                guiJson.panels[0].properties.summary.properties.individualPolicy.value = {};
                //guiJson.panels[0].properties.summary.properties.policyCondition.value.default = "none";
                guiJson.panels[0].properties.summary.properties.individualPolicy.value.default = masterdata.IndividualPolicyName;
            }

            //Gui to policy element query
            if((guiJson.panels[0].properties.policyElement.source.url!=null)&&(typeof guiJson.panels[0].properties.policyElement.source.url!='undefined')){
                var policyMeasureCode = masterdata.PolicyMeasureCode;
                guiJson.panels[0].properties.policyElement.source.url+= "/"+policyMeasureCode;
            }

            if((guiJson.panels[0].properties.source.source.url!=null)&&(typeof guiJson.panels[0].properties.source.source.url!='undefined')){
                var countryCode = masterdata.CountryCode;
                //var cplId = masterdata.CplId;
                var cplId = '118';
                guiJson.panels[0].properties.source.source.url+= "/"+countryCode+"/"+cplId;
            }

            //Setting default value
            //Link

            //"value": {
            //    "multilingual": true,
            //        "default": "FENIX"
            //},
            if(self.options.button_preview_action_type=="searchEditPolicy"){

                //Text field
                var field = guiJson.panels[0].properties.link;
                var defaultValue = policydata.Link;
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.linkPdf;
                defaultValue = policydata.LinkPdf;
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.linkPdf;
                defaultValue = policydata.LinkPdf;
                self.setDefaultValue_TextField(field, defaultValue);

                //Add check for value and value text
                field = guiJson.panels[0].properties.valueText;
                defaultValue = policydata.ValueText;
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.exemptions;
                defaultValue = policydata.Exemptions;
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.taxRateBenchmark;
                defaultValue = policydata.TaxRateBenchmark;
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.benchmarkLink;
                defaultValue = policydata.BenchmarkLink;
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.benchmarkLinkPdf;
                defaultValue = policydata.BenchmarkLinkPdf;
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.notes;
                defaultValue = policydata.Notes;
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.titleOfNotice;
                defaultValue = policydata.TitleOfNotice;
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.legalBasisName;
                defaultValue = policydata.LegalBasisName;
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.benchmarkTax;
                defaultValue = policydata.BenchmarkTax;
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.benchmarkProduct;
                defaultValue = policydata.BenchmarkProduct;
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.taxRateBiofuel;
                defaultValue = policydata.TaxRateBiofuel;
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.measureDescription;
                defaultValue = policydata.MeasureDescription;
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.productOriginalHs;
                defaultValue = policydata.ProductOriginalHs;
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.productOriginalName;
                defaultValue = policydata.ProductOriginalName;
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.typeOfChangeName;
                defaultValue = policydata.TypeOfChangeName;
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.valueType;
                defaultValue = policydata.ValueType;
                self.setDefaultValue_TextField(field, defaultValue);

                //List
                field = guiJson.panels[0].properties.policyElement;
                defaultValue = policydata.PolicyElement;
                self.setDefaultValue_List(field, defaultValue);

                field = guiJson.panels[0].properties.unit;
                defaultValue = policydata.Unit;
                self.setDefaultValue_List(field, defaultValue);

                field = guiJson.panels[0].properties.source;
                defaultValue = policydata.Source;
                self.setDefaultValue_List(field, defaultValue);

                field = guiJson.panels[0].properties.secondGenerationSpecific;
                defaultValue = policydata.SecondGenerationSpecific;
                self.setDefaultValue_List(field, defaultValue);

                field = guiJson.panels[0].properties.localCondition;
                defaultValue = policydata.LocalCondition;
                self.setDefaultValue_List(field, defaultValue);

                field = guiJson.panels[0].properties.imposedEndDate;
                defaultValue = policydata.ImposedEndDate;
                self.setDefaultValue_List(field, defaultValue);

                //Calendar
                field = guiJson.panels[0].properties.startDate;
                defaultValue = policydata.StartDate;
                self.setDefaultValue_Calendar(field, self.dateFormatConverter_ddMMyyyy_mmDDyy(defaultValue));

                field = guiJson.panels[0].properties.endDate;
                defaultValue = policydata.EndDate;
                self.setDefaultValue_Calendar(field, self.dateFormatConverter_ddMMyyyy_mmDDyy(defaultValue));

                field = guiJson.panels[0].properties.dateOfPublication;
                defaultValue = policydata.DateOfPublication;
                self.setDefaultValue_Calendar(field, self.dateFormatConverter_ddMMyyyy_mmDDyy(defaultValue));

                field = guiJson.panels[0].properties.startDateTax;
                defaultValue = policydata.StartDateTax;
                self.setDefaultValue_Calendar(field, self.dateFormatConverter_ddMMyyyy_mmDDyy(defaultValue));
            }
        }
    };

    Host.prototype.setDefaultValue_TextField = function(field, value){
        if((field!=null)&&(typeof field!='undefined')){
            if((field.value!=null)&&(typeof field.value!='undefined')){
                field.value.default= value;
            }
            else{
                field.value = {};
                field.value.default = value;
            }
        }
    };

    Host.prototype.setDefaultValue_List = function(field, value){
        if((field!=null)&&(typeof field!='undefined')){
            if((field.source!=null)&&(typeof field.source!='undefined')&&(field.source.datafields!=null)&&(typeof field.source.datafields!='undefined')){
                field.source.datafields.defaultCode= value;
            }
            else{
                field.source = {};
                field.source.datafields = {};
                field.source.datafields.defaultCode = value;
            }
        }
    };

    Host.prototype.setDefaultValue_Calendar = function(field, value){
        if((field!=null)&&(typeof field!='undefined')){
            if((field.value!=null)&&(typeof field.value!='undefined')){
                field.value.defaultValue= value;
            }
            else{
                field.value = {};
                field.value.defaultValue = value;
            }
        }
    };

    Host.prototype.dateFormatConverter_ddMMyyyy_mmDDyy = function(value){

        var stringNewFormat = '';
        if((value!=null)&&(typeof value!= "undefined")){
            var d = new Date(value);

            var month = parseInt(d.getMonth(), 10)+1;
            var stringNewFormat = d.getDate() + "/" + month + "/"+ d.getFullYear();
        }

        return stringNewFormat;
    };

    Host.prototype.getURLParameter = function(sParam){
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    };

    Host.prototype.isURLParameter = function(sParam){
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return true;
            }
        }
    };

    return Host;

});
