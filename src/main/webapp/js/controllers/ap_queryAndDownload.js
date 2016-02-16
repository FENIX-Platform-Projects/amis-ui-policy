define([
    'jquery',
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
    //'fx-editor/start',
    'ap-dataEntry/start',
    'ap_util_variables',
//    'fenix-map',
//    'router',
    'jQAllRangeSliders',
    'xDomainRequest',
    'amplify'

//], function(Backbone, Qd, conf , data_entry_conf, HostUtility, HostDomainParser, HostButtonActions, HostPolicyDataObject, HostPreview, NProgress, Router){
], function($, Backbone, Qd, conf , data_entry_edit_policy_conf, data_entry_create_policy_conf, HostUtility, HostDomainParser, HostButtonActions, HostPolicyDataObject, HostPreview, NProgress, AmisPolicyDataEntry, ap_util_variables){
//], function(Backbone, Qd, conf , data_entry_edit_policy_conf, data_entry_create_policy_conf, HostUtility, HostDomainParser, HostButtonActions, HostPolicyDataObject, HostPreview, NProgress, DataEntryEditor, AmisPolicyDataEntry, ap_util_variables){

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
        none: "none",
        na: "n.a.",

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
        fx_selector_5_b_infoButton : 'fx_selector_5_b_button_info',
        fx_selector_5_b_selectButton : 'fx_selector_5_b_button_select',
        fx_selector_6_b_selectButton : 'fx_selector_6_b_button_select',
        fx_selector_7_selectButton : 'fx_selector_7_button_select',

        //Button Action id
        fx_selector_6_button_clear : 'fx_selector_6_button_clear',
        fx_selector_5_button_clear : 'fx_selector_5_button_clear',

        //To WDS
        base_ip_address    :  '168.202.28.26',
        base_ip_port    :  '10400',
        //base_ip_address    :  'statistics.amis-outlook.org',
        //base_ip_port    :  '80',
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
        commodityByClass_url :   '/wdspolicy/rest/policyservice/commodityByClass',
        commodityIgnoringAssociatedPolicy_url : '/wdspolicy/rest/policyservice/commodityIgnoringAssociatedPolicy',
        condition_url   :   '/wdspolicy/rest/policyservice/condition',
        cplIdForCountry_url : '/wdspolicy/rest/policyservice/cplIdForCountry',
        individualPolicy_url    : '/wdspolicy/rest/policyservice/individualPolicy',
        startAndEndDate_url   :   '/wdspolicy/rest/policyservice/startEndDate',
        //For Preview Action
        downloadPreview_url     :   '/wdspolicy/rest/policyservice/downloadPreview',
        masterFromCplId_url     :   '/wdspolicy/rest/policyservice/masterFromCplId',
        masterFromCplIdAndSubnational     :   '/wdspolicy/rest/policyservice/masterFromCplIdAndSubnational',
        masterFromCplIdAndNegativeSubnational     :   '/wdspolicy/rest/policyservice/masterFromCplIdAndNegativeSubnational',
        policyTable_url     :   '/wdspolicy/rest/policyservice/downloadPreviewPolicyTable',
        shareGroupCommodities_url     :   '/wdspolicy/rest/policyservice/shareGroupInfo',
        mapData     :   '/wdspolicy/rest/policyservice/mapData',
        sharedGroupInfo_url   :    '/wdspolicy/rest/policyservice/sharedGroupInfo',
//        gaulsubnationalLevel_url    :   'GAUL/1.0?level=2',

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
        slider_start_yy_default : '1995',

        //Commodity Domain Code
        commodity_domain_both : '1,2',
        commodity_domain_agricultural : '1',
        commodity_domain_biofuels : '2',
        commodity_domain_both_code : '-1',
        commodity_domain_bothForPolicyMeasure : '0',
        policy_domain_bothForPolicyMeasure : '0',

        //Policy Domain Code
        policy_domain_both : '1,2',
        policy_domain_trade : '1',
        policy_domain_domestic : '2',
        policy_domain_both_code : '-1',

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
        //commodity_children_codes : [['8','11','12'],['9','11','12'],['8','9','10','11'],['10']],
        commodity_children_codes : [['8','18','11','14','16','12','17'],['9','13','18','11','15','16','12'],['8','9','13','10','18','11','14'],['13','10','18','14','15','16','17']],

        country_agricultural_domestic_codes : ['17','37','46','53','999000','116','126','202','132','162','204','249','254','259','227'],

        //"preview" is Query and Download page, "search" is Input Data page
        button_preview_action_type : "preview",
//        button_preview_action_type : "search",

        //This is used in the Search action
//        default_start_date : '1983-01-01',
        default_start_date : '1995-01-01',
        default_end_date : '2025-01-01',

        CANCEL: "fx.editor.cancel.host",
        onEditActionObj: '',
        editor: '',
        //This is the list of codes for the commodity used in the commodity list selector
        //commodity_codes_to_remove : ['8','9','10','11','12'],
        //commodity_parent : {'8':[1,3],'9':[2,3],'10':[3,4],'11':[1,2,3],'12':[1,2]},
        commodity_codes_to_remove : ['8','9','10','11','12','13','14','15','16','17','18'],
        commodity_parent : {'8':[1,3],'9':[2,3],'10':[3,4],'11':[1,2,3],'12':[1,2],'13':[2,3,4],'14':[1,3,4],'15':[2,4],'16':[1,2,4],'17':[1,4],'18':[1,2,3,4]},

        agricultural_policy_domain_code_order: [3,2,4,1,9,11,10,8,12],
        both_policy_domain_code_order: [6,7,5,3,2,4,1,9,11,10,8,12],
        //logged_user_code : 12,
        logged_user_code : -1,
        logged_user_default_code : -1,
        //This is the list of the Commodity that belong to a Shared Group
        //This list is recreated everytime the user click on Add Commodity button
        //in the Add Policy Section
        add_commodity_popup_commodityList_sharedGroup : []
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
                self.dataEntryaddEventListener(self);
                self.initRouter(Router, self);
            });
        }
    }

    Host.prototype.map_event_creation = function(){
        this.options.generic_component_structure_event["selected_fx_selector_1_changed"] = "selected_fx_selector_1_changed";
        this.options.generic_component_structure_event["selected_fx_selector_2_changed"] = "selected_fx_selector_2_changed";
        this.options.generic_component_structure_event["selected_fx_selector_3_changed"] = "selected_fx_selector_3_changed";
        this.options.generic_component_structure_event["selected_fx_selector_4_changed"] = "selected_fx_selector_4_changed";
        this.options.generic_component_structure_event["selected_fx_selector_5_changed"] = "selected_fx_selector_5_changed";
        this.options.generic_component_structure_event["selected_fx_selector_5_b_changed"] = "selected_fx_selector_5_b_changed";
        this.options.generic_component_structure_event["selected_fx_selector_5_button_clear"] = "selected_fx_selector_5_button_clear";
        this.options.generic_component_structure_event["selected_fx_selector_5_button_info"] = "selected_fx_selector_5_button_info";
        this.options.generic_component_structure_event["selected_fx_selector_6_changed"] = "selected_fx_selector_6_changed";
        this.options.generic_component_structure_event["selected_fx_selector_6_b_changed"] = "selected_fx_selector_6_b_changed";
        this.options.generic_component_structure_event["selected_fx_selector_6_button_clear"] = "selected_fx_selector_6_button_clear";
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

        //COMMODITY DOMAIN
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

        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_2_changed"], function(event, properties){

            //The Loading Window
            NProgress.start();
            if((properties!=null)&&(typeof properties!= "undefined"))
            {
                var selecteditem2 = properties.changed_item;
                if((selecteditem2!=null)&&(typeof selecteditem2!='undefined')) {
                    var selecteditem = qd_instance.getSelectedItems(self.options.fx_selector_1);
                    if((selecteditem!=null)&&(typeof selecteditem!='undefined'))
                    {
                        var commodity_domain = ''+selecteditem.code;
                        if(commodity_domain== self.options.commodity_domain_both_code)
                        {
                            //Both
                            commodity_domain = self.options.commodity_domain_both;
                        }

                        var policy_domain = ''+selecteditem2.code;

                        if(policy_domain == self.options.policy_domain_both_code)
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

                        //Reload commodity class
                        self.options.host_domain_parser.getDomain(qd_instance, selector_id, rest_url, self);

                        //Enable Disable Country
                        //self.options.host_domain_parser.listbox_country_element_enable_and_disable(qd_instance, self.options.fx_selector_1, self.options.fx_selector_2, self.options.fx_selector_6, self, true);

                        if(self.options.button_preview_action_type == "searchCreatePolicy") {
                            //Reload Commodity Id
                            //Get Commodity for the selected Commodity Class
                            //var policy_measure_selector_id = self.options.fx_selector_4;
                            var event_type = '';
                            if ((event_type = selecteditem2.event_type)== 'select') {
                                var selecteditem_commodityDomain = selecteditem;
                                var selecteditem_policyDomain = selecteditem2;

                                var commodityDomaincCode = selecteditem_commodityDomain.code;
                                var policyDomaincCode = selecteditem_policyDomain.code;
                                if (selecteditem_commodityDomain.code == self.options.commodity_domain_both_code) {
                                    //Both
                                    commodityDomaincCode = self.options.commodity_domain_both;
                                }
                                if (selecteditem_policyDomain.code == self.options.policy_domain_both_code) {
                                    //Both
                                    policyDomaincCode = self.options.policy_domain_both;
                                }

                                var selecteditem_country_found = false;
                                var selecteditem_country = '';
                                var selecteditem_country = qd_instance.getSelectedItems(self.options.fx_selector_6);
                                //console.log(selecteditem_country)
                                if((selecteditem_country!=null)&&(typeof selecteditem_country!="undefined")&&(selecteditem_country.length>0)){
                                    if((selecteditem_country[0].originalItem!=null)&&(typeof selecteditem_country[0].originalItem!="undefined")){

                                        if((selecteditem_country[0].originalItem.code!=null)&&(typeof selecteditem_country[0].originalItem.code!="undefined")){
                                            selecteditem_country_found = true;
                                            selecteditem_country = selecteditem_country[0].originalItem.code;
                                        }
                                    }
                                }

                                var commodityClassCode = item.originalItem.code;
                                var rest_url = {
                                    //'rest_url_type': self.options.commodity_url,
                                    'rest_url_type': self.options.commodityIgnoringAssociatedPolicy_url,
                                    'rest_url_datasource': self.options.datasource
                                };

                                if(selecteditem_country_found==true){
                                    //var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/' + commodityDomaincCode + '/' + policyDomaincCode + '/' + commodityClassCode+ '/' +selecteditem_country;
                                    var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/' + commodityClassCode+ '/' +selecteditem_country;
                                    self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_5_b, url, self);
                                }else{
                                    var mastertable_data = [];
                                    var properties = {};
                                    qd_instance.update_selector_domain(self.options.fx_selector_5_b, mastertable_data, properties);
                                }

                                //var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/' + commodityDomaincCode + '/' + policyDomaincCode + '/' + commodityClassCode;
                                //self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_5_b, url, self);
                            }
                        }

                        //Reload Policy Types
                        var selector_id = self.options.fx_selector_3;
                        var rest_url = {'rest_url_type':self.options.policyTypes_url, 'rest_url_datasource' : self.options.datasource};
                        self.options.host_domain_parser.getDomainPolicyType(qd_instance, selector_id, rest_url, policy_domain, commodity_domain, self);
                    }
                    else{
                        if(self.options.button_preview_action_type == "searchCreatePolicy") {
                            var mastertable_data = [];
                            var properties = {};
                            qd_instance.update_selector_domain(self.options.fx_selector_5_b, mastertable_data, properties);
                        }
                    }
                }
            }
        });

        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_3_changed"], function(event, properties){

            //This varable is used to select the first element that has been selected
            var select_first_enabled_elem = true;
            //Enable and disable Policy Measure
            var fx_selector_4_selected_item = qd_instance.getSelectedItems(self.options.fx_selector_4);
            self.options.host_domain_parser.listbox_element_enable_and_disable(qd_instance, self.options.fx_selector_3, self.options.fx_selector_4, true, fx_selector_4_selected_item);
        });

        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_4_changed"], function(event, properties){

            if(self.options.button_preview_action_type == "searchCreatePolicy"){
                var selecteditem_commodityDomain = qd_instance.getSelectedItems(self.options.fx_selector_1);
                var selecteditem_policyDomain = qd_instance.getSelectedItems(self.options.fx_selector_2);
                var selecteditem_policyType = qd_instance.getSelectedItems(self.options.fx_selector_3);
                var selecteditem_policyMeasure = qd_instance.getSelectedItems(self.options.fx_selector_4);
                var selecteditem_country = qd_instance.getSelectedItems(self.options.fx_selector_6);
                var selecteditem_commodityClass = qd_instance.getSelectedItems(self.options.fx_selector_5);
                var selecteditem_commodityDomain_found = false;
                var selecteditem_policyDomain_found = false;
                var selecteditem_policyType_found = false;
                var selecteditem_policyMeasure_found = false;
                var selecteditem_country_found = false;
                var selecteditem_commodityClass_found = false;
                if((selecteditem_commodityDomain!=null)&&(typeof selecteditem_commodityDomain!="undefined")){
                    if((selecteditem_commodityDomain.code!=null)&&(typeof selecteditem_commodityDomain.code!="undefined")){
                        selecteditem_commodityDomain_found = true;
                    }
                }
                if((selecteditem_policyDomain!=null)&&(typeof selecteditem_policyDomain!="undefined")){
                    if((selecteditem_policyDomain.code!=null)&&(typeof selecteditem_policyDomain.code!="undefined")){
                        selecteditem_policyDomain_found = true;
                    }
                }

                if((selecteditem_policyType!=null)&&(typeof selecteditem_policyType!="undefined")&&(selecteditem_policyType.length>0)){
                    if((selecteditem_policyType[0].originalItem!=null)&&(typeof selecteditem_policyType[0].originalItem!="undefined")){

                        if((selecteditem_policyType[0].originalItem.code!=null)&&(typeof selecteditem_policyType[0].originalItem.code!="undefined")){
                            selecteditem_policyType_found = true;
                        }
                    }
                }
                if((selecteditem_policyMeasure!=null)&&(typeof selecteditem_policyMeasure!="undefined")&&(selecteditem_policyMeasure.length>0)){
                    if((selecteditem_policyMeasure[0].originalItem!=null)&&(typeof selecteditem_policyMeasure[0].originalItem!="undefined")){

                        if((selecteditem_policyMeasure[0].originalItem.code!=null)&&(typeof selecteditem_policyMeasure[0].originalItem.code!="undefined")){
                            selecteditem_policyMeasure_found = true;
                        }
                    }
                }
                if((selecteditem_country!=null)&&(typeof selecteditem_country!="undefined")&&(selecteditem_country.length>0)){
                    if((selecteditem_country[0].originalItem!=null)&&(typeof selecteditem_country[0].originalItem!="undefined")){

                        if((selecteditem_country[0].originalItem.code!=null)&&(typeof selecteditem_country[0].originalItem.code!="undefined")){
                            selecteditem_country_found = true;
                        }
                    }
                }
                if((selecteditem_commodityClass!=null)&&(typeof selecteditem_commodityClass!="undefined")&&(selecteditem_commodityClass.length>0)){
                    if((selecteditem_commodityClass[0].originalItem!=null)&&(typeof selecteditem_commodityClass[0].originalItem!="undefined")){

                        if((selecteditem_commodityClass[0].originalItem.code!=null)&&(typeof selecteditem_commodityClass[0].originalItem.code!="undefined")){
                            selecteditem_commodityClass_found = true;
                        }
                    }
                }
                if(selecteditem_commodityDomain_found&&selecteditem_policyDomain_found&&selecteditem_policyType_found&&selecteditem_policyMeasure_found&&selecteditem_country_found&&selecteditem_commodityClass_found&&selecteditem_policyMeasure[0].event_type == "select"){

                    //Condition
                    var commodityDomaincCode = selecteditem_commodityDomain.code;
                    var policyDomainCode = selecteditem_policyDomain.code;
                    if(selecteditem_commodityDomain.code== self.options.commodity_domain_both_code)
                    {
                        //Both
                        commodityDomaincCode = self.options.commodity_domain_both;
                    }
                    if (selecteditem_policyDomain.code == self.options.policy_domain_both_code) {
                        //Both
                        policyDomainCode = self.options.policy_domain_both;
                    }

                    //{countryCode}/{commodityClassCode}
                    var rest_url = {'rest_url_type':self.options.condition_url, 'rest_url_datasource' : self.options.datasource, 'rest_url_policyDomainCode' : policyDomainCode, 'rest_url_policyTypeCode' : selecteditem_policyType[0].originalItem.code, 'rest_url_commodityDomainCode' : commodityDomaincCode,  'rest_url_countryCode' : selecteditem_country[0].originalItem.code,  'rest_url_commodityClassCode' : selecteditem_commodityClass[0].originalItem.code };
                    var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/'+ rest_url.rest_url_policyDomainCode +'/'+ rest_url.rest_url_policyTypeCode +'/'+rest_url.rest_url_commodityDomainCode +'/'+rest_url.rest_url_countryCode +'/'+rest_url.rest_url_commodityClassCode;
                    self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_7, url, self);

                    //Individual Policy
                    //if(((selecteditem_policyDomain.code==ap_util_variables.CONFIG.domestic_policyDomain_code)||(selecteditem_policyDomain.code==self.options.policy_domain_both_code))&&(selecteditem_policyType[0].originalItem.code==ap_util_variables.CONFIG.tax_concession_policyType_code)&&((selecteditem_commodityDomain.code==ap_util_variables.CONFIG.biofuel_commodity_domain_code)||(selecteditem_commodityDomain.code==self.options.commodity_domain_both_code))){
                    //    var rest_url = {'rest_url_type':self.options.individualPolicy_url, 'rest_url_datasource' : self.options.datasource, 'rest_url_policyDomainCode' : policyDomainCode, 'rest_url_policyTypeCode' : selecteditem_policyType[0].originalItem.code, 'rest_url_commodityDomainCode' : commodityDomaincCode};
                    //    var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/'+ rest_url.rest_url_policyDomainCode +'/'+ rest_url.rest_url_policyTypeCode +'/'+rest_url.rest_url_commodityDomainCode;
                    //    self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_7_b, url, self);
                    //}
                    //else{
                    //    var data = [];
                    //    var properties = [];
                    //    qd_instance.update_selector_domain(self.options.fx_selector_7_b, data, properties);
                    //}
                    var rest_url = {'rest_url_type':self.options.individualPolicy_url, 'rest_url_datasource' : self.options.datasource, 'rest_url_policyDomainCode' : policyDomainCode, 'rest_url_policyTypeCode' : selecteditem_policyType[0].originalItem.code, 'rest_url_commodityDomainCode' : commodityDomaincCode};
                    var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/'+ rest_url.rest_url_policyDomainCode +'/'+ rest_url.rest_url_policyTypeCode +'/'+rest_url.rest_url_commodityDomainCode;
                    self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_7_b, url, self);
                }
                else{
                    var data = [];
                    var properties = [];
                    //The list is empty
                    var none_code = '105';
                    var none_label = 'n.a.';
                    var dataI = 0;
                    var noneObj = {};
                    noneObj = {"value": self.options.condition_selector_type + "_" + none_code, "label": '' + none_label, "code" : none_code, "type": self.options.condition_selector_type};
                    data.push(noneObj);
                    //Condition
                    qd_instance.update_selector_domain(self.options.fx_selector_7, data, properties);
                    var properties_to_select = [];
                    //"none" is in the first position
                    properties_to_select.push(0);
                    qd_instance.update_selector_selection(self.options.fx_selector_7, properties_to_select, true);
                    //Individual Policy
                    noneObj = {};
                    none_code = '999';
                    noneObj = {"value": self.options.individualPolicy_selector_type + "_" + none_code, "label": '' + none_label, "code" : none_code, "type": self.options.individualPolicy_selector_type};
                    data.push(noneObj);
                    qd_instance.update_selector_domain(self.options.fx_selector_7_b, data, properties);
                    var properties_to_select = [];
                    //"none" is in the first position
                    properties_to_select.push(0);
                    qd_instance.update_selector_selection(self.options.fx_selector_7_b, properties_to_select, true);
                }
            }
            else{
                //Country
                var selector_id = self.options.fx_selector_6;
                var rest_url = {'rest_url_type':self.options.codelist_url_Country};
                self.options.host_domain_parser.getDomain(qd_instance, selector_id, rest_url, self);
                //Enable Disable Country
                //self.options.host_domain_parser.listbox_country_element_enable_and_disable(qd_instance, self.options.fx_selector_1, self.options.fx_selector_2, self.options.fx_selector_6, self, true);
            }
        });

        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_5_changed"], function(event, properties){
            //The commodity class selector doesn't lunch events if the use case is: "Create a policy"
            if(self.options.button_preview_action_type != "searchCreatePolicy"){
                var selecteditem = qd_instance.getSelectedItems(self.options.fx_selector_5);
                var item = properties.changed_item;
//            //1=Wheat 2=Rice 3=Maize 4=Soybeans
//            commodity_parent_codes : [1,2,3,4],
//            //8=Wheat+Maize 9=Maize+Rice 10=Maize+Soybean 11=Wheat+Maize+Rice 12=Wheat+Rice
//            commodity_children_codes : [[8,11,12],[9,11,12],[8,9,10,11],[10]]
                if((item!=null)&&(typeof item!='undefined')) {
                    if ((item.value != null) && (typeof item.value != 'undefined') && (item.value.length > 0)) {
                        var code = item.value.substring(item.value.indexOf('_') + 1);
                        var parent_index = $.inArray(code, self.options.commodity_parent_codes);
                        if (parent_index != -1) {
                            //Case: Maize, Rice, Soybean, Wheat
                            if (item.event_type == 'select') {
                                //The item has been selected
                                var items_to_select = self.options.commodity_children_codes[parent_index];
                                var source_domain = qd_instance.getSelector_domain(self.options.fx_selector_5, true);
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
                //Update Country list-> NO!!!
            }
            else{
                //Get Commodity for the selected Commodity Class
                //var policy_measure_selector_id = self.options.fx_selector_4;
                var item = properties.changed_item;
                var event_type = '';

                if((item!=null)&&(typeof item!= "undefined")&&((event_type = item.event_type) == 'select')){
                    var selecteditem_country = qd_instance.getSelectedItems(self.options.fx_selector_6);
                    if((selecteditem_country!=null)&&(typeof selecteditem_country!="undefined")&&(selecteditem_country.length>0)){
                        if((selecteditem_country[0].originalItem!=null)&&(typeof selecteditem_country[0].originalItem!="undefined")){
                            if((selecteditem_country[0].originalItem.code!=null)&&(typeof selecteditem_country[0].originalItem.code!="undefined")){
                                //This button has to be shown only if the user has selected a country and a commodity class
                                $("#"+self.options.fx_selector_5_b_selectButton).show();
                            }
                        }
                    }

                    var selecteditem_commodityDomain = qd_instance.getSelectedItems(self.options.fx_selector_1);
                    var selecteditem_policyDomain = qd_instance.getSelectedItems(self.options.fx_selector_2);
                    var selecteditem_commodityDomain_found = false;
                    var selecteditem_policyDomain_found = false;
                    if((selecteditem_commodityDomain!=null)&&(typeof selecteditem_commodityDomain!="undefined")){
                        if((selecteditem_commodityDomain.code!=null)&&(typeof selecteditem_commodityDomain.code!="undefined")){
                            selecteditem_commodityDomain_found = true;
                        }
                    }
                    if((selecteditem_policyDomain!=null)&&(typeof selecteditem_policyDomain!="undefined")){
                        if((selecteditem_policyDomain.code!=null)&&(typeof selecteditem_policyDomain.code!="undefined")){
                            selecteditem_policyDomain_found = true;
                        }
                    }

                    var selecteditem_country_found = false;
                    var selecteditem_country = '';
                    var selecteditem_country = qd_instance.getSelectedItems(self.options.fx_selector_6);
                    //console.log(selecteditem_country)
                    if((selecteditem_country!=null)&&(typeof selecteditem_country!="undefined")&&(selecteditem_country.length>0)){
                        if((selecteditem_country[0].originalItem!=null)&&(typeof selecteditem_country[0].originalItem!="undefined")){

                            if((selecteditem_country[0].originalItem.code!=null)&&(typeof selecteditem_country[0].originalItem.code!="undefined")){
                                selecteditem_country_found = true;
                                selecteditem_country = selecteditem_country[0].originalItem.code;
                            }
                        }
                    }

                    if((selecteditem_commodityDomain_found)&&(selecteditem_policyDomain_found)&&(selecteditem_country_found)){
                        var commodityDomaincCode = selecteditem_commodityDomain.code;
                        var policyDomaincCode = selecteditem_policyDomain.code;
                        if(selecteditem_commodityDomain.code== self.options.commodity_domain_both_code)
                        {
                            //Both
                            commodityDomaincCode = self.options.commodity_domain_both;
                        }

                        if (selecteditem_policyDomain.code == self.options.policy_domain_both_code) {
                            //Both
                            policyDomaincCode = self.options.policy_domain_both;
                        }

                        var commodityClassCode = item.originalItem.code;
                        var parentIndex = self.options.commodity_parent_codes.indexOf(''+commodityClassCode);
                        if(parentIndex!= -1){
                            var childrenArray = (self.options.commodity_children_codes[parentIndex]).toString();
                            if((childrenArray!=null)&&(childrenArray.length>0))
                            {
                                commodityClassCode = commodityClassCode+','+childrenArray;
                            }
                        }
                        var withSharedGroups = true;
                        //var rest_url = {'rest_url_type':self.options.commodity_url, 'rest_url_datasource' : self.options.datasource};
                        var rest_url = {'rest_url_type':self.options.commodityIgnoringAssociatedPolicy_url, 'rest_url_datasource' : self.options.datasource};

                        //var rest_url = {'rest_url_type':self.options.commodityByClass_url, 'rest_url_datasource' : self.options.datasource};
                        //var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/' + commodityDomaincCode+ '/' + policyDomaincCode+ '/'+commodityClassCode+ '/' +selecteditem_country+ '/'+withSharedGroups;
                        var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/'+commodityClassCode+ '/' +selecteditem_country+ '/'+withSharedGroups;
                        //var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_poIrt + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/' + obj_code_country+ '/' + obj_code;
                        self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_5_b, url, self);
                    }
                    else{
                        var mastertable_data = [];
                        var properties = {};
                        qd_instance.update_selector_domain(self.options.fx_selector_5_b, mastertable_data, properties);
                    }

                    var selecteditem_commodityDomain = qd_instance.getSelectedItems(self.options.fx_selector_1);
                    var selecteditem_policyDomain = qd_instance.getSelectedItems(self.options.fx_selector_2);
                    var selecteditem_policyType = qd_instance.getSelectedItems(self.options.fx_selector_3);
                    var selecteditem_policyMeasure = qd_instance.getSelectedItems(self.options.fx_selector_4);
                    var selecteditem_country = qd_instance.getSelectedItems(self.options.fx_selector_6);
                    var selecteditem_commodityClass = qd_instance.getSelectedItems(self.options.fx_selector_5);
                    var selecteditem_commodityDomain_found = false;
                    var selecteditem_policyDomain_found = false;
                    var selecteditem_policyType_found = false;
                    var selecteditem_policyMeasure_found = false;
                    var selecteditem_country_found = false;
                    var selecteditem_commodityClass_found = false;
                    if((selecteditem_commodityDomain!=null)&&(typeof selecteditem_commodityDomain!="undefined")){
                        if((selecteditem_commodityDomain.code!=null)&&(typeof selecteditem_commodityDomain.code!="undefined")){
                            selecteditem_commodityDomain_found = true;
                        }
                    }
                    if((selecteditem_policyDomain!=null)&&(typeof selecteditem_policyDomain!="undefined")){
                        if((selecteditem_policyDomain.code!=null)&&(typeof selecteditem_policyDomain.code!="undefined")){
                            selecteditem_policyDomain_found = true;
                        }
                    }

                    if((selecteditem_policyType!=null)&&(typeof selecteditem_policyType!="undefined")&&(selecteditem_policyType.length>0)){
                        if((selecteditem_policyType[0].originalItem!=null)&&(typeof selecteditem_policyType[0].originalItem!="undefined")){

                            if((selecteditem_policyType[0].originalItem.code!=null)&&(typeof selecteditem_policyType[0].originalItem.code!="undefined")){
                                selecteditem_policyType_found = true;
                            }
                        }
                    }
                    if((selecteditem_policyMeasure!=null)&&(typeof selecteditem_policyMeasure!="undefined")&&(selecteditem_policyMeasure.length>0)){
                        if((selecteditem_policyMeasure[0].originalItem!=null)&&(typeof selecteditem_policyMeasure[0].originalItem!="undefined")){

                            if((selecteditem_policyMeasure[0].originalItem.code!=null)&&(typeof selecteditem_policyMeasure[0].originalItem.code!="undefined")){
                                selecteditem_policyMeasure_found = true;
                            }
                        }
                    }
                    if((selecteditem_country!=null)&&(typeof selecteditem_country!="undefined")&&(selecteditem_country.length>0)){
                        if((selecteditem_country[0].originalItem!=null)&&(typeof selecteditem_country[0].originalItem!="undefined")){

                            if((selecteditem_country[0].originalItem.code!=null)&&(typeof selecteditem_country[0].originalItem.code!="undefined")){
                                selecteditem_country_found = true;
                            }
                        }
                    }
                    if((selecteditem_commodityClass!=null)&&(typeof selecteditem_commodityClass!="undefined")&&(selecteditem_commodityClass.length>0)){
                        if((selecteditem_commodityClass[0].originalItem!=null)&&(typeof selecteditem_commodityClass[0].originalItem!="undefined")){

                            if((selecteditem_commodityClass[0].originalItem.code!=null)&&(typeof selecteditem_commodityClass[0].originalItem.code!="undefined")){
                                selecteditem_commodityClass_found = true;
                            }
                        }
                    }
                    if(selecteditem_commodityDomain_found&&selecteditem_policyDomain_found&&selecteditem_policyType_found&&selecteditem_policyMeasure_found&&selecteditem_country_found&&selecteditem_commodityClass_found&&selecteditem_policyMeasure[0].event_type == "select"){

                        //Condition
                        var commodityDomaincCode = selecteditem_commodityDomain.code;
                        var policyDomainCode = selecteditem_policyDomain.code;
                        if(selecteditem_commodityDomain.code== self.options.commodity_domain_both_code)
                        {
                            //Both
                            commodityDomaincCode = self.options.commodity_domain_both;
                        }
                        if (selecteditem_policyDomain.code == self.options.policy_domain_both_code) {
                            //Both
                            policyDomainCode = self.options.policy_domain_both;
                        }

                        //{countryCode}/{commodityClassCode}
                        var rest_url = {'rest_url_type':self.options.condition_url, 'rest_url_datasource' : self.options.datasource, 'rest_url_policyDomainCode' : policyDomainCode, 'rest_url_policyTypeCode' : selecteditem_policyType[0].originalItem.code, 'rest_url_commodityDomainCode' : commodityDomaincCode,  'rest_url_countryCode' : selecteditem_country[0].originalItem.code,  'rest_url_commodityClassCode' : selecteditem_commodityClass[0].originalItem.code };
                        var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/'+ rest_url.rest_url_policyDomainCode +'/'+ rest_url.rest_url_policyTypeCode +'/'+rest_url.rest_url_commodityDomainCode +'/'+rest_url.rest_url_countryCode +'/'+rest_url.rest_url_commodityClassCode;

                        //var rest_url = {'rest_url_type':self.options.condition_url, 'rest_url_datasource' : self.options.datasource, 'rest_url_policyDomainCode' : policyDomainCode, 'rest_url_policyTypeCode' : selecteditem_policyType[0].originalItem.code, 'rest_url_commodityDomainCode' : commodityDomaincCode};
                        //var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/'+ rest_url.rest_url_policyDomainCode +'/'+ rest_url.rest_url_policyTypeCode +'/'+rest_url.rest_url_commodityDomainCode;
                        self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_7, url, self);

                        //Individual Policy
                        //if(((selecteditem_policyDomain.code==ap_util_variables.CONFIG.domestic_policyDomain_code)||(selecteditem_policyDomain.code==self.options.policy_domain_both_code))&&(selecteditem_policyType[0].originalItem.code==ap_util_variables.CONFIG.tax_concession_policyType_code)&&((selecteditem_commodityDomain.code==ap_util_variables.CONFIG.biofuel_commodity_domain_code)||(selecteditem_commodityDomain.code==self.options.commodity_domain_both_code))){
                        //    var rest_url = {'rest_url_type':self.options.individualPolicy_url, 'rest_url_datasource' : self.options.datasource, 'rest_url_policyDomainCode' : policyDomainCode, 'rest_url_policyTypeCode' : selecteditem_policyType[0].originalItem.code, 'rest_url_commodityDomainCode' : commodityDomaincCode};
                        //    var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/'+ rest_url.rest_url_policyDomainCode +'/'+ rest_url.rest_url_policyTypeCode +'/'+rest_url.rest_url_commodityDomainCode;
                        //    self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_7_b, url, self);
                        //}
                        //else{
                        //    var data = [];
                        //    var properties = [];
                        //    qd_instance.update_selector_domain(self.options.fx_selector_7_b, data, properties);
                        //}
                        var rest_url = {'rest_url_type':self.options.individualPolicy_url, 'rest_url_datasource' : self.options.datasource, 'rest_url_policyDomainCode' : policyDomainCode, 'rest_url_policyTypeCode' : selecteditem_policyType[0].originalItem.code, 'rest_url_commodityDomainCode' : commodityDomaincCode};
                        var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/'+ rest_url.rest_url_policyDomainCode +'/'+ rest_url.rest_url_policyTypeCode +'/'+rest_url.rest_url_commodityDomainCode;
                        self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_7_b, url, self);
                    }
                    else{
                        //var data = [];
                        //var properties = [];
                        ////Condition
                        //qd_instance.update_selector_domain(self.options.fx_selector_7, data, properties);
                        ////Individual Policy
                        //qd_instance.update_selector_domain(self.options.fx_selector_7_b, data, properties);

                        var data = [];
                        var properties = [];
                        //The list is empty
                        var none_code = '105';
                        var none_label = 'n.a.';
                        var dataI = 0;
                        var noneObj = {};
                        noneObj = {"value": self.options.condition_selector_type + "_" + none_code, "label": '' + none_label, "code" : none_code, "type": self.options.condition_selector_type};
                        data.push(noneObj);
                        //Condition
                        qd_instance.update_selector_domain(self.options.fx_selector_7, data, properties);
                        var properties_to_select = [];
                        //"none" is in the first position
                        properties_to_select.push(0);
                        qd_instance.update_selector_selection(self.options.fx_selector_7, properties_to_select, true);
                        //Individual Policy
                        noneObj = {};
                        none_code = '999';
                        noneObj = {"value": self.options.individualPolicy_selector_type + "_" + none_code, "label": '' + none_label, "code" : none_code, "type": self.options.individualPolicy_selector_type};
                        data.push(noneObj);
                        qd_instance.update_selector_domain(self.options.fx_selector_7_b, data, properties);
                        var properties_to_select = [];
                        //"none" is in the first position
                        properties_to_select.push(0);
                        qd_instance.update_selector_selection(self.options.fx_selector_7_b, properties_to_select, true);
                    }
                }
            }
        });

        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_5_b_changed"], function(event, properties){
            var fx_selector_selected_item = qd_instance.getSelectedItems(self.options.fx_selector_5_b);
            if(self.options.button_preview_action_type == "searchCreatePolicy") {
                //console.log("selected_fx_selector_5_b_changed")
                //console.log(fx_selector_selected_item)
                //self.options.host_utility_instance.buttonShowHide(self.options.fx_selector_5_b_infoButton, true)
                if ((fx_selector_selected_item != null) && (typeof fx_selector_selected_item != "undefined") && ((event_type = fx_selector_selected_item.event_type) == 'select')) {
                    //console.log("Button show")
                    self.options.host_utility_instance.buttonShowHide(self.options.fx_selector_5_b_infoButton, true)
                }
                else{
                    //console.log(fx_selector_selected_item)
                    if(((fx_selector_selected_item!=null)&&(fx_selector_selected_item.length==0))||(fx_selector_selected_item.rowindex!=-1)&&(fx_selector_selected_item.rowindex!=fx_selector_selected_item.selectedRowIndex)){
                        //console.log("Button hide")
                        self.options.host_utility_instance.buttonShowHide(self.options.fx_selector_5_b_infoButton, false)
                    }
                }
            }
        });

        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_5_button_clear"], function(event, properties){

            if(self.options.button_preview_action_type == "searchCreatePolicy"){
                self.options.host_domain_parser.listbox_element_unselect(qd_instance, self.options.fx_selector_5_b);

                $("#"+self.options.fx_selector_5_b_selectButton).hide();
                //No commodity associated
                var mastertable_data = [];
                var properties = {};
                qd_instance.update_selector_domain(self.options.fx_selector_5_b, mastertable_data, properties);
            }
        });

        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_6_changed"], function(event, properties){

            if(self.options.button_preview_action_type == "searchCreatePolicy"){

                //Get Subnational for the selected Country
                var event_type = '';
                var item = properties.changed_item;
                if ((item != null) && (typeof item != "undefined") && ((event_type = item.event_type) == 'select')) {
                    $("#"+self.options.fx_selector_6_b_selectButton).show();
                    self.options.host_domain_parser.subnationalInfo(qd_instance, self, item);

                    var selecteditem_commodityClass = qd_instance.getSelectedItems(self.options.fx_selector_5);
                    if((selecteditem_commodityClass!=null)&&(typeof selecteditem_commodityClass!="undefined")&&(selecteditem_commodityClass.length>0)){
                        if((selecteditem_commodityClass[0].originalItem!=null)&&(typeof selecteditem_commodityClass[0].originalItem!="undefined")){

                            if((selecteditem_commodityClass[0].originalItem.code!=null)&&(typeof selecteditem_commodityClass[0].originalItem.code!="undefined")){
                                //This button has to be shown only if the user has selected a country and a commodity class
                                $("#"+self.options.fx_selector_5_b_selectButton).show();
                            }
                        }
                    }
                }

                var selecteditem_commodityDomain = qd_instance.getSelectedItems(self.options.fx_selector_1);
                var selecteditem_policyDomain = qd_instance.getSelectedItems(self.options.fx_selector_2);
                var selecteditem_policyType = qd_instance.getSelectedItems(self.options.fx_selector_3);
                var selecteditem_policyMeasure = qd_instance.getSelectedItems(self.options.fx_selector_4);
                var selecteditem_country = qd_instance.getSelectedItems(self.options.fx_selector_6);
                var selecteditem_commodityClass = qd_instance.getSelectedItems(self.options.fx_selector_5);
                var selecteditem_commodityDomain_found = false;
                var selecteditem_policyDomain_found = false;
                var selecteditem_policyType_found = false;
                var selecteditem_policyMeasure_found = false;
                var selecteditem_country_found = false;
                var selecteditem_commodityClass_found = false;
                if((selecteditem_commodityDomain!=null)&&(typeof selecteditem_commodityDomain!="undefined")){
                    if((selecteditem_commodityDomain.code!=null)&&(typeof selecteditem_commodityDomain.code!="undefined")){
                        selecteditem_commodityDomain_found = true;
                    }
                }
                if((selecteditem_policyDomain!=null)&&(typeof selecteditem_policyDomain!="undefined")){
                    if((selecteditem_policyDomain.code!=null)&&(typeof selecteditem_policyDomain.code!="undefined")){
                        selecteditem_policyDomain_found = true;
                    }
                }

                if((selecteditem_policyType!=null)&&(typeof selecteditem_policyType!="undefined")&&(selecteditem_policyType.length>0)){
                    if((selecteditem_policyType[0].originalItem!=null)&&(typeof selecteditem_policyType[0].originalItem!="undefined")){

                        if((selecteditem_policyType[0].originalItem.code!=null)&&(typeof selecteditem_policyType[0].originalItem.code!="undefined")){
                            selecteditem_policyType_found = true;
                        }
                    }
                }
                if((selecteditem_policyMeasure!=null)&&(typeof selecteditem_policyMeasure!="undefined")&&(selecteditem_policyMeasure.length>0)){
                    if((selecteditem_policyMeasure[0].originalItem!=null)&&(typeof selecteditem_policyMeasure[0].originalItem!="undefined")){

                        if((selecteditem_policyMeasure[0].originalItem.code!=null)&&(typeof selecteditem_policyMeasure[0].originalItem.code!="undefined")){
                            selecteditem_policyMeasure_found = true;
                        }
                    }
                }
                if((selecteditem_country!=null)&&(typeof selecteditem_country!="undefined")&&(selecteditem_country.length>0)){
                    if((selecteditem_country[0].originalItem!=null)&&(typeof selecteditem_country[0].originalItem!="undefined")){

                        if((selecteditem_country[0].originalItem.code!=null)&&(typeof selecteditem_country[0].originalItem.code!="undefined")){
                            selecteditem_country_found = true;
                        }
                    }
                }

                if((selecteditem_commodityClass!=null)&&(typeof selecteditem_commodityClass!="undefined")&&(selecteditem_commodityClass.length>0)){
                    if((selecteditem_commodityClass[0].originalItem!=null)&&(typeof selecteditem_commodityClass[0].originalItem!="undefined")){

                        if((selecteditem_commodityClass[0].originalItem.code!=null)&&(typeof selecteditem_commodityClass[0].originalItem.code!="undefined")){
                            selecteditem_commodityClass_found = true;
                        }
                    }
                }

                if(selecteditem_commodityDomain_found&&selecteditem_policyDomain_found&&selecteditem_commodityClass_found&&selecteditem_country_found){
                    //Commodity Selector Reload
                    var commodityDomaincCode = selecteditem_commodityDomain.code;
                    var policyDomaincCode = selecteditem_policyDomain.code;
                    if(selecteditem_commodityDomain.code== self.options.commodity_domain_both_code)
                    {
                        //Both
                        commodityDomaincCode = self.options.commodity_domain_both;
                    }
                    if (selecteditem_policyDomain.code == self.options.policy_domain_both_code) {
                        //Both
                        policyDomaincCode = self.options.policy_domain_both;
                    }

                    var commodityClassCode = selecteditem_commodityClass[0].originalItem.code;
                    var selecteditemCountryCode = selecteditem_country[0].originalItem.code;
                    var withSharedGroups = true;

                    var rest_url = {
                        //'rest_url_type': self.options.commodity_url,
                        'rest_url_type': self.options.commodityIgnoringAssociatedPolicy_url,
                        'rest_url_datasource': self.options.datasource
                    };

                    var parentIndex = self.options.commodity_parent_codes.indexOf(''+commodityClassCode);
                    if(parentIndex!= -1){
                        var childrenArray = (self.options.commodity_children_codes[parentIndex]).toString();
                        //console.log(childrenArray)
                        if((childrenArray!=null)&&(childrenArray.length>0))
                        {
                            commodityClassCode = commodityClassCode+','+childrenArray;
                        }
                    }

                    //var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/' + commodityDomaincCode + '/' + policyDomaincCode + '/' + commodityClassCode+ '/' +selecteditemCountryCode+ '/'+withSharedGroups;
                    var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/' + commodityClassCode+ '/' +selecteditemCountryCode+ '/'+withSharedGroups;
                    self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_5_b, url, self);
                }
                else{
                    var mastertable_data = [];
                    var properties = {};
                    qd_instance.update_selector_domain(self.options.fx_selector_5_b, mastertable_data, properties);
                }

                if(selecteditem_commodityDomain_found&&selecteditem_policyDomain_found&&selecteditem_policyType_found&&selecteditem_policyMeasure_found&&selecteditem_country_found&&selecteditem_commodityClass_found&&selecteditem_policyMeasure[0].event_type == "select"){

                    //Condition
                    var commodityDomaincCode = selecteditem_commodityDomain.code;
                    var policyDomainCode = selecteditem_policyDomain.code;
                    if(selecteditem_commodityDomain.code== self.options.commodity_domain_both_code)
                    {
                        //Both
                        commodityDomaincCode = self.options.commodity_domain_both;
                    }
                    if (selecteditem_policyDomain.code == self.options.policy_domain_both_code) {
                        //Both
                        policyDomainCode = self.options.policy_domain_both;
                    }

                    //{countryCode}/{commodityClassCode}
                    var rest_url = {'rest_url_type':self.options.condition_url, 'rest_url_datasource' : self.options.datasource, 'rest_url_policyDomainCode' : policyDomainCode, 'rest_url_policyTypeCode' : selecteditem_policyType[0].originalItem.code, 'rest_url_commodityDomainCode' : commodityDomaincCode,  'rest_url_countryCode' : selecteditem_country[0].originalItem.code,  'rest_url_commodityClassCode' : selecteditem_commodityClass[0].originalItem.code };
                    var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/'+ rest_url.rest_url_policyDomainCode +'/'+ rest_url.rest_url_policyTypeCode +'/'+rest_url.rest_url_commodityDomainCode +'/'+rest_url.rest_url_countryCode +'/'+rest_url.rest_url_commodityClassCode;

                    //var rest_url = {'rest_url_type':self.options.condition_url, 'rest_url_datasource' : self.options.datasource, 'rest_url_policyDomainCode' : policyDomainCode, 'rest_url_policyTypeCode' : selecteditem_policyType[0].originalItem.code, 'rest_url_commodityDomainCode' : commodityDomaincCode};
                    //var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/'+ rest_url.rest_url_policyDomainCode +'/'+ rest_url.rest_url_policyTypeCode +'/'+rest_url.rest_url_commodityDomainCode;
                    self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_7, url, self);

                    //Individual Policy
                    //if(((selecteditem_policyDomain.code==ap_util_variables.CONFIG.domestic_policyDomain_code)||(selecteditem_policyDomain.code==self.options.policy_domain_both_code))&&(selecteditem_policyType[0].originalItem.code==ap_util_variables.CONFIG.tax_concession_policyType_code)&&((selecteditem_commodityDomain.code==ap_util_variables.CONFIG.biofuel_commodity_domain_code)||(selecteditem_commodityDomain.code==self.options.commodity_domain_both_code))){
                    //    var rest_url = {'rest_url_type':self.options.individualPolicy_url, 'rest_url_datasource' : self.options.datasource, 'rest_url_policyDomainCode' : policyDomainCode, 'rest_url_policyTypeCode' : selecteditem_policyType[0].originalItem.code, 'rest_url_commodityDomainCode' : commodityDomaincCode};
                    //    var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/'+ rest_url.rest_url_policyDomainCode +'/'+ rest_url.rest_url_policyTypeCode +'/'+rest_url.rest_url_commodityDomainCode;
                    //    self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_7_b, url, self);
                    //}
                    //else{
                    //    var data = [];
                    //    var properties = [];
                    //    qd_instance.update_selector_domain(self.options.fx_selector_7_b, data, properties);
                    //}
                    var rest_url = {'rest_url_type':self.options.individualPolicy_url, 'rest_url_datasource' : self.options.datasource, 'rest_url_policyDomainCode' : policyDomainCode, 'rest_url_policyTypeCode' : selecteditem_policyType[0].originalItem.code, 'rest_url_commodityDomainCode' : commodityDomaincCode};
                    var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/'+ rest_url.rest_url_policyDomainCode +'/'+ rest_url.rest_url_policyTypeCode +'/'+rest_url.rest_url_commodityDomainCode;
                    self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_7_b, url, self);
                }
                else{
                    //var data = [];
                    //var properties = [];
                    ////Condition
                    //qd_instance.update_selector_domain(self.options.fx_selector_7, data, properties);
                    ////Individual Policy
                    //qd_instance.update_selector_domain(self.options.fx_selector_7_b, data, properties);

                    var data = [];
                    var properties = [];
                    //The list is empty
                    var none_code = '105';
                    var none_label = 'n.a.';
                    var dataI = 0;
                    var noneObj = {};
                    noneObj = {"value": self.options.condition_selector_type + "_" + none_code, "label": '' + none_label, "code" : none_code, "type": self.options.condition_selector_type};
                    data.push(noneObj);
                    //Condition
                    qd_instance.update_selector_domain(self.options.fx_selector_7, data, properties);
                    var properties_to_select = [];
                    //"none" is in the first position
                    properties_to_select.push(0);
                    qd_instance.update_selector_selection(self.options.fx_selector_7, properties_to_select, true);
                    //Individual Policy
                    noneObj = {};
                    none_code = '999';
                    noneObj = {"value": self.options.individualPolicy_selector_type + "_" + none_code, "label": '' + none_label, "code" : none_code, "type": self.options.individualPolicy_selector_type};
                    data.push(noneObj);
                    qd_instance.update_selector_domain(self.options.fx_selector_7_b, data, properties);
                    var properties_to_select = [];
                    //"none" is in the first position
                    properties_to_select.push(0);
                    qd_instance.update_selector_selection(self.options.fx_selector_7_b, properties_to_select, true);
                }
            }
        });

        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_6_b_changed"], function(event, properties){
            //alert("selected_fx_selector_6_b_changed")
            //var fx_selector_selected_item = qd_instance.getSelectedItems(self.options.fx_selector_6_b);
            //console.log("Selected")
            //console.log(fx_selector_selected_item);
        });

        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_6_button_clear"], function(event, properties){

            ///fx_selector_6_button_clear
            if(self.options.button_preview_action_type == "searchCreatePolicy"){
                $("#"+self.options.fx_selector_6_b_selectButton).hide();
                $("#"+self.options.fx_selector_5_b_selectButton).hide();
                self.options.host_domain_parser.listbox_element_unselect(qd_instance, self.options.fx_selector_6_b);

                //No info in GAUL for the selected country
                var mastertable_data = [];
                var properties = {};
                qd_instance.update_selector_domain(self.options.fx_selector_6_b, mastertable_data, properties);
            }
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
                var payload= {};
                self.options.onEditActionObj = {master_data:'', policy_data:''};
                $.proxy(self.master_data_fields_creation(qd_instance, self), self);
            }
            else{
                //Edit a Policy or Preview
                self.options.host_button_actions.preview_action(qd_instance, self);
            }
        });

        $('body').on(self.options.generic_component_structure_event["selected_fx_selector_7_changed"], function(){
        });

        //This callback is called when all the selectors have been added
        $(qd_instance.options.qd_component_main_div).on(qd_instance.options.generic_component_structure_event["selectors_added"], function(){

            if(self.options.button_preview_action_type == "searchCreatePolicy") {

                $('#' + self.options.fx_selector_5_b_infoButton).click(function(e){
                    var grid = qd_instance.getSelector(self.options.fx_selector_5_b);
                    //console.log(grid.getSelectedRows())
                    //console.log(qd_instance.getBoard());
                    //console.log(qd_instance.getBoard().keep_track_get_item(self.options.fx_selector_5_b));
                    //this.options.board.keep_track_get_item(grid);
                    //var row = $("#fx_selector_5_b").jqxGrid('getselectedrowindex');
                    //console.log($("#fx_selector_5_b"))
                    var row = $("#fx_selector_5_b").jqxGrid('hidecolumn', 'code');
                    //console.log(row)
                    var fx_selector_selected_item = qd_instance.getSelectedItems(self.options.fx_selector_5_b);
                    //console.log(fx_selector_selected_item)
                    self.options.host_domain_parser.createCommodityInfoPopup(qd_instance, fx_selector_selected_item, self);
                });

                self.options.host_domain_parser.createCommodityAddPopup_buttonEvents(qd_instance, self.options.fx_selector_6, self.options.fx_selector_2, self.options.fx_selector_5, self.options.fx_selector_4, self);

                $('#' + self.options.fx_selector_5_b_selectButton).click(function(e){
                    var selecteditem_country = qd_instance.getSelectedItems(self.options.fx_selector_6);
                    var selecteditem_commodityClass = qd_instance.getSelectedItems(self.options.fx_selector_5);
                    var fx_selector_selected_item = qd_instance.getSelectedItems(self.options.fx_selector_5_b);
                    self.options.host_domain_parser.createCommodityAddPopup(qd_instance, selecteditem_country, selecteditem_commodityClass, fx_selector_selected_item, self);
                });

                //Condition
                $('#' + self.options.fx_selector_7_selectButton).click(function(e){
                    var fx_selector_selected_item = qd_instance.getSelectedItems(self.options.fx_selector_7);
                    //console.log(fx_selector_selected_item);
                    self.options.host_domain_parser.createConditionAddPopup(qd_instance, fx_selector_selected_item, self);
                });

                //Subnational
                $('#' + self.options.fx_selector_6_b_selectButton).click(function(e){
                    var fx_selector_selected_item = qd_instance.getSelectedItems(self.options.fx_selector_6_b);
                    var selecteditem_country = qd_instance.getSelectedItems(self.options.fx_selector_6);
                    self.options.host_domain_parser.createSubnationalAddPopup(qd_instance, fx_selector_selected_item, selecteditem_country, self);
                });
            }
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

    Host.prototype.master_data_fields_creation = function(qd_instance, self){

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

        if((selecteditem_selector1==null)||(typeof selecteditem_selector1=='undefined')||(selecteditem_selector1.length==0)||(selecteditem_selector2==null)||(typeof selecteditem_selector2=='undefined')||(selecteditem_selector2.length==0)||(selecteditem_selector3==null)||(typeof selecteditem_selector3=='undefined')||(selecteditem_selector3.length==0)||(selecteditem_selector4==null)||(typeof selecteditem_selector4=='undefined')||(selecteditem_selector4.length==0)||(selecteditem_selector5==null)||(typeof selecteditem_selector5=='undefined')||(selecteditem_selector5.length==0)||(selecteditem_selector6==null)||(typeof selecteditem_selector6=='undefined')||(selecteditem_selector6.length==0))
        {
            new PNotify({
                title: 'Error',
                text: 'Please select at least one Policy Type, Policy Measure, Commodity Class, Country.',
                //hide: false,
                type: 'error',
                delay: 5000,
                buttons: {
                    closer: true,
                    closer_hover: false,
                    sticker_hover: false
                }
            });
        }
        else{
            this.options.onEditActionObj.master_data = {};
            this.options.onEditActionObj.master_data.CommodityClassCode = selecteditem_selector5[0].originalItem.code;
            this.options.onEditActionObj.master_data.CommodityClassName = selecteditem_selector5[0].originalItem.label;
            this.options.onEditActionObj.master_data.CommodityDomainCode = selecteditem_selector1.code;
            this.options.onEditActionObj.master_data.CommodityDomainName = selecteditem_selector1.label;

            var value = 'n.a.';
            var commodityId = 'n.a.';
            var hsCode = 'n.a.';
            var hsSuffix = 'n.a.';
            var hsVersion = 'n.a.';
            var description = 'n.a.';
            var shortDescription = 'n.a.';
            //if((selecteditem_selector5b[0]!=null)&&(typeof selecteditem_selector5b[0]!= "undefined")&&(selecteditem_selector5b[0].originalItem!=null)&&(typeof selecteditem_selector5b[0].originalItem!= "undefined")){
            //    value = selecteditem_selector5b[0].originalItem.value;
            //    commodityId = value.substring(value.indexOf("CommodityDetail_COMMODITYID:")+28, value.indexOf("_HSCODE"));
            //    hsCode = value.substring(value.indexOf("_HSCODE:")+8, value.indexOf("_HSSUFFIX"));
            //    hsSuffix = value.substring(value.indexOf("_HSSUFFIX:")+10, value.indexOf("_HSVERSION:"));
            //    hsVersion = value.substring(value.indexOf("_HSVERSION:")+11, value.indexOf("_DESCRIPTION:"));
            //    description = value.substring(value.indexOf("_DESCRIPTION:")+13, value.indexOf("_SHORTDESCRIP:"));
            //    shortDescription = value.substring(value.indexOf("_SHORTDESCRIP:")+14);
            //}

            if((selecteditem_selector5b!=null)&&(typeof selecteditem_selector5b!= "undefined")&&(selecteditem_selector5b.changed_item!=null)&&(typeof selecteditem_selector5b.changed_item!= "undefined")){
                value = selecteditem_selector5b.changed_item.value;
                commodityId = value.substring(value.indexOf("CommodityDetail_COMMODITYID:")+28, value.indexOf("_HSCODE"));
                hsCode = value.substring(value.indexOf("_HSCODE:")+8, value.indexOf("_HSSUFFIX"));
                hsSuffix = value.substring(value.indexOf("_HSSUFFIX:")+10, value.indexOf("_HSVERSION:"));
                hsVersion = value.substring(value.indexOf("_HSVERSION:")+11, value.indexOf("_DESCRIPTION:"));
                description = value.substring(value.indexOf("_DESCRIPTION:")+13, value.indexOf("_SHORTDESCRIP:"));
                shortDescription = value.substring(value.indexOf("_SHORTDESCRIP:")+14);
            }

            this.options.onEditActionObj.master_data.CommodityId = commodityId;
            this.options.onEditActionObj.master_data.hsCode = hsCode;
            this.options.onEditActionObj.master_data.hsVersion = hsVersion;
            this.options.onEditActionObj.master_data.hsSuffix = hsSuffix;
            this.options.onEditActionObj.master_data.shortDescription = shortDescription;
            this.options.onEditActionObj.master_data.description = description;
            this.options.onEditActionObj.master_data.CountryCode = selecteditem_selector6[0].originalItem.code;
            this.options.onEditActionObj.master_data.CountryName = selecteditem_selector6[0].originalItem.label;
            this.options.onEditActionObj.master_data.CplId = '';
            if((selecteditem_selector7b[0]!=null)&&(typeof selecteditem_selector7b[0]!= "undefined")){
                this.options.onEditActionObj.master_data.IndividualPolicyCode = selecteditem_selector7b[0].originalItem.code;
                this.options.onEditActionObj.master_data.IndividualPolicyName = selecteditem_selector7b[0].originalItem.label;
                //console.log(this.options.onEditActionObj.master_data);
            }
            else{
                this.options.onEditActionObj.master_data.IndividualPolicyCode = 'n.a.';
                this.options.onEditActionObj.master_data.IndividualPolicyName = 'n.a.';
            }
            if((selecteditem_selector7[0]!=null)&&(typeof selecteditem_selector7[0]!= "undefined")){
                this.options.onEditActionObj.master_data.PolicyConditionCode = selecteditem_selector7[0].originalItem.code;
                this.options.onEditActionObj.master_data.PolicyCondition = selecteditem_selector7[0].originalItem.label;
            }
            else{
                this.options.onEditActionObj.master_data.PolicyConditionCode = 'n.a.';
                this.options.onEditActionObj.master_data.PolicyCondition = 'n.a.';
            }
            this.options.onEditActionObj.master_data.PolicyDomainCode = selecteditem_selector2.code;
            this.options.onEditActionObj.master_data.PolicyDomainName = selecteditem_selector2.label;
            this.options.onEditActionObj.master_data.PolicyMeasureCode = selecteditem_selector4[0].originalItem.code;
            this.options.onEditActionObj.master_data.PolicyMeasureName = selecteditem_selector4[0].originalItem.label;
            this.options.onEditActionObj.master_data.PolicyTypeCode = selecteditem_selector3[0].originalItem.code;
            this.options.onEditActionObj.master_data.PolicyTypeName = selecteditem_selector3[0].originalItem.label;
            if((selecteditem_selector6b[0]!=null)&&(typeof selecteditem_selector6b[0]!= "undefined")){
                this.options.onEditActionObj.master_data.SubnationalCode = selecteditem_selector6b[0].originalItem.code;
                this.options.onEditActionObj.master_data.SubnationalName = selecteditem_selector6b[0].originalItem.label;
            }
            else{
                this.options.onEditActionObj.master_data.SubnationalCode = 'n.a.';
                this.options.onEditActionObj.master_data.SubnationalName = 'n.a.';
            }
            $.proxy(self.onEditAction(''), self);
        }
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

    Host.prototype.dataEntryaddEventListener = function(self){
        $('body').on("EditSearchButton", $.proxy(this.onEditAction, this));
        //document.body.addEventListener(this.options.CANCEL, function (e) {
        //    console.log(self)
        //    self.options.editor.destroy();
        //    $("#metadataEditorContainer").hide();
        //    $(".previous_content").show();
        //});
    };

    Host.prototype.actionToHideDataEditor = function(obj){
        obj.destroy();
        //console.log(obj.selfObj.options.editor)
        $("#metadataEditorContainer").hide();
        $(".previous_content").show();
    }

    Host.prototype.onEditAction = function(e, payload){
        //$(".previous_content").hide();
        //$("#metadataEditorContainer").show();
        var self = this;
        //amplify.unsubscribe(self.options.CANCEL, self.actionToHideDataEditor);

        console.log(payload)
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
            if(this.options.button_preview_action_type=="searchEditPolicy") {
                guiJsonFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-gui-config-noMenu_Original.json";
            }
            else{
                guiJsonFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-gui-config-noMenu.json";
            }
            validationFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-validation-config-noMenu.json";
            jsonMappingFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-mapping-config-noMenu.json";
            ajaxEventCallsFile = "./submodules/fenix-ui-metadata-editor/conf/json/fx-editor-ajax-config-noMenu.json";
        }

        var guiJson = $.getJSON(guiJsonFile);
        $.when($.getJSON(guiJsonFile))
            .done(function( guiJson) {
//                console.log(guiJson.panels[0]);
//                var guiObj = guiJson.panels[0];
//                console.log(guiJson)
//                console.log(guiJson.panels[0].properties.summary.properties.country.value.default);
               // alert("ap_q&d Before properties before ")
               // console.log(guiJson.panels[0].properties.summary.properties)
                //console.log(self.options.onEditActionObj)
                //console.log(guiJson)
                if((self.options.onEditActionObj!=null)&&(typeof self.options.onEditActionObj!='undefined')&&(self.options.onEditActionObj.master_data!=null)&&(typeof self.options.onEditActionObj.master_data!='undefined')){
                   if((self.options.onEditActionObj.master_data.PolicyMeasureName!=null)&&(typeof self.options.onEditActionObj.master_data.PolicyMeasureName!='undefined')){
                       var squareBrkindex = self.options.onEditActionObj.master_data.PolicyMeasureName.indexOf('[');
                       if(squareBrkindex>0){
                           self.options.onEditActionObj.master_data.PolicyMeasureName = self.options.onEditActionObj.master_data.PolicyMeasureName.substring(0, squareBrkindex);
                       }
                   }
                    //Case Subnational
                    if((self.options.onEditActionObj.master_data.SubnationalCode!=null)&&(typeof self.options.onEditActionObj.master_data.SubnationalCode!='undefined')){
                        //"-4_LevelNeg"
                        var squareBrkindex = self.options.onEditActionObj.master_data.SubnationalCode.indexOf('_');
                        if(squareBrkindex>0){
                            self.options.onEditActionObj.master_data.SubnationalCode = self.options.onEditActionObj.master_data.SubnationalCode.substring(0, squareBrkindex);
                        }
                    }
                    //Case Master Commodity id ... coping in Policy Commodity id
                    if((self.options.onEditActionObj.master_data.CommodityId!=null)&&(typeof self.options.onEditActionObj.master_data.CommodityId!='undefined')){
                        self.options.onEditActionObj.policy_data.CommodityId = self.options.onEditActionObj.master_data.CommodityId;
                    }
                }

                self.summaryDefaultValueSetting(guiJson, self.options.onEditActionObj, self);
              //  alert("ap_q&d Before properties after ")
              //  console.log(guiJson.panels[0].properties.summary.properties);
              //  console.log("guiJson start")
              //  console.log(guiJson)
              //  console.log("guiJson end")
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
                if(((self.options.button_preview_action_type == "searchEditPolicy")||(self.options.button_preview_action_type == "searchCreatePolicy"))) {

                    //amplify.subscribe('fx.editor.form.cancel', function() {
                    //    alert( "nodataexample topic published 4!" );
                    //});
                    //amplify.subscribe(self.options.CANCEL, self, alert("in subscribe"));
                    //alert("Before subscribe")
                    //console.log(self.actionToHideDataEditor)
                    //amplify.subscribe(self.options.CANCEL, {'obj':'obj'}, self.actionToHideDataEditor);
                    amplify.subscribe(self.options.CANCEL, function p(obj){
                        //alert("In actionToHideDataEditor")
                        obj.destroy();
                        $("#metadataEditorContainer").hide();
                        $(".previous_content").show();

                        amplify.unsubscribe(self.options.CANCEL, p);
                    });
                    //document.body.addEventListener(self.options.CANCEL, function (e) {
                    //    self.actionToHideDataEditor();
                    //    //alert("in cancel")
                    //    //console.log(self)
                    //    //self.options.editor.destroy();
                    //    //$("#metadataEditorContainer").hide();
                    //    //$(".previous_content").show();
                    //});
                }

                //self.options.editor = new DataEntryEditor();
                //self.options.editor.init(userConfig);
                var options = {'properties': guiJson.panels[0].properties};
                self.options.editor = new AmisPolicyDataEntry();
                if(self.options.button_preview_action_type=="searchEditPolicy") {
                    options.fileName = "searchEditPolicy";
                }
                else{
                    options.fileName = "searchAddPolicy";
                }

                options.base_ip_address = ap_util_variables.CONFIG.base_ip_address;
                options.base_ip_port = ap_util_variables.CONFIG.base_ip_port;
                options.datasource = ap_util_variables.CONFIG.datasource;
                //alert("Before call editor")
                //alert("credential")
                //console.log(self.options.logged_user_code);
                //console.log(self.options.logged_user_default_code);
                //console.log("Before call editor")
                //console.log(options)
                if(sessionStorage.getItem("superUser")=="OECD"){
                    self.options.onEditActionObj.LOGGED_USER = "OECD";
                }
                else{
                    self.options.onEditActionObj.LOGGED_USER = self.options.logged_user_code;
                }

                console.log(options)
                console.log(self.options.onEditActionObj)
                self.options.editor.init(options, self.options.onEditActionObj);
                $(".previous_content").hide();
                $("#buttonBack").show();
                $("#metadataEditorContainer").show();
            });
    };


    Host.prototype.reloadCommodityList = function(self, qd_instance){

        //Get Commodity for the selected Commodity Class
        //var policy_measure_selector_id = self.options.fx_selector_4;
        //var item = properties.changed_item;
        //var event_type = '';

        var itemSelector = qd_instance.getSelectedItems(self.options.fx_selector_5);

        //if((item!=null)&&(typeof item!= "undefined")&&((event_type = item.event_type) == 'select')){
        if((itemSelector!=null)&&(typeof itemSelector!= "undefined")){

            var item = itemSelector[0];
            //console.log(item)

            var selecteditem_country = qd_instance.getSelectedItems(self.options.fx_selector_6);
            if((selecteditem_country!=null)&&(typeof selecteditem_country!="undefined")&&(selecteditem_country.length>0)){
                if((selecteditem_country[0].originalItem!=null)&&(typeof selecteditem_country[0].originalItem!="undefined")){
                    if((selecteditem_country[0].originalItem.code!=null)&&(typeof selecteditem_country[0].originalItem.code!="undefined")){
                        //This button has to be shown only if the user has selected a country and a commodity class
                        $("#"+self.options.fx_selector_5_b_selectButton).show();
                    }
                }
            }

            var selecteditem_commodityDomain = qd_instance.getSelectedItems(self.options.fx_selector_1);
            var selecteditem_policyDomain = qd_instance.getSelectedItems(self.options.fx_selector_2);
            var selecteditem_commodityDomain_found = false;
            var selecteditem_policyDomain_found = false;
            if((selecteditem_commodityDomain!=null)&&(typeof selecteditem_commodityDomain!="undefined")){
                if((selecteditem_commodityDomain.code!=null)&&(typeof selecteditem_commodityDomain.code!="undefined")){
                    selecteditem_commodityDomain_found = true;
                }
            }
            if((selecteditem_policyDomain!=null)&&(typeof selecteditem_policyDomain!="undefined")){
                if((selecteditem_policyDomain.code!=null)&&(typeof selecteditem_policyDomain.code!="undefined")){
                    selecteditem_policyDomain_found = true;
                }
            }

            var selecteditem_country_found = false;
            var selecteditem_country = '';
            var selecteditem_country = qd_instance.getSelectedItems(self.options.fx_selector_6);
            //console.log(selecteditem_country)
            if((selecteditem_country!=null)&&(typeof selecteditem_country!="undefined")&&(selecteditem_country.length>0)){
                if((selecteditem_country[0].originalItem!=null)&&(typeof selecteditem_country[0].originalItem!="undefined")){

                    if((selecteditem_country[0].originalItem.code!=null)&&(typeof selecteditem_country[0].originalItem.code!="undefined")){
                        selecteditem_country_found = true;
                        selecteditem_country = selecteditem_country[0].originalItem.code;
                    }
                }
            }

            if((selecteditem_commodityDomain_found)&&(selecteditem_policyDomain_found)&&(selecteditem_country_found)){
                var commodityDomaincCode = selecteditem_commodityDomain.code;
                var policyDomaincCode = selecteditem_policyDomain.code;
                if(selecteditem_commodityDomain.code== self.options.commodity_domain_both_code)
                {
                    //Both
                    commodityDomaincCode = self.options.commodity_domain_both;
                }

                if (selecteditem_policyDomain.code == self.options.policy_domain_both_code) {
                    //Both
                    policyDomaincCode = self.options.policy_domain_both;
                }

                //TEST
                var commodityClassCode = item.originalItem.code;
                var parentIndex = self.options.commodity_parent_codes.indexOf(''+commodityClassCode);
                if(parentIndex!= -1){
                    var childrenArray = (self.options.commodity_children_codes[parentIndex]).toString();
                    if((childrenArray!=null)&&(childrenArray.length>0))
                    {
                        commodityClassCode = commodityClassCode+','+childrenArray;
                    }
                }
                var withSharedGroups = true;
                //var rest_url = {'rest_url_type':self.options.commodity_url, 'rest_url_datasource' : self.options.datasource};
                //commodityIgnoringAssociatedPolicy_url
                var rest_url = {'rest_url_type':self.options.commodityIgnoringAssociatedPolicy_url, 'rest_url_datasource' : self.options.datasource};
                //var rest_url = {'rest_url_type':self.options.commodityByClass_url, 'rest_url_datasource' : self.options.datasource};
                //var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/' + commodityDomaincCode+ '/' + policyDomaincCode+ '/'+commodityClassCode+ '/' +selecteditem_country+ '/'+withSharedGroups;
                var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/'+commodityClassCode+ '/' +selecteditem_country+ '/'+withSharedGroups;
                //var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_poIrt + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/' + obj_code_country+ '/' + obj_code;
                self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_5_b, url, self);
            }
            else{
                var mastertable_data = [];
                var properties = {};
                qd_instance.update_selector_domain(self.options.fx_selector_5_b, mastertable_data, properties);
            }

            var selecteditem_commodityDomain = qd_instance.getSelectedItems(self.options.fx_selector_1);
            var selecteditem_policyDomain = qd_instance.getSelectedItems(self.options.fx_selector_2);
            var selecteditem_policyType = qd_instance.getSelectedItems(self.options.fx_selector_3);
            var selecteditem_policyMeasure = qd_instance.getSelectedItems(self.options.fx_selector_4);
            var selecteditem_country = qd_instance.getSelectedItems(self.options.fx_selector_6);
            var selecteditem_commodityClass = qd_instance.getSelectedItems(self.options.fx_selector_5);
            var selecteditem_commodityDomain_found = false;
            var selecteditem_policyDomain_found = false;
            var selecteditem_policyType_found = false;
            var selecteditem_policyMeasure_found = false;
            var selecteditem_country_found = false;
            var selecteditem_commodityClass_found = false;
            if((selecteditem_commodityDomain!=null)&&(typeof selecteditem_commodityDomain!="undefined")){
                if((selecteditem_commodityDomain.code!=null)&&(typeof selecteditem_commodityDomain.code!="undefined")){
                    selecteditem_commodityDomain_found = true;
                }
            }
            if((selecteditem_policyDomain!=null)&&(typeof selecteditem_policyDomain!="undefined")){
                if((selecteditem_policyDomain.code!=null)&&(typeof selecteditem_policyDomain.code!="undefined")){
                    selecteditem_policyDomain_found = true;
                }
            }

            if((selecteditem_policyType!=null)&&(typeof selecteditem_policyType!="undefined")&&(selecteditem_policyType.length>0)){
                if((selecteditem_policyType[0].originalItem!=null)&&(typeof selecteditem_policyType[0].originalItem!="undefined")){

                    if((selecteditem_policyType[0].originalItem.code!=null)&&(typeof selecteditem_policyType[0].originalItem.code!="undefined")){
                        selecteditem_policyType_found = true;
                    }
                }
            }
            if((selecteditem_policyMeasure!=null)&&(typeof selecteditem_policyMeasure!="undefined")&&(selecteditem_policyMeasure.length>0)){
                if((selecteditem_policyMeasure[0].originalItem!=null)&&(typeof selecteditem_policyMeasure[0].originalItem!="undefined")){

                    if((selecteditem_policyMeasure[0].originalItem.code!=null)&&(typeof selecteditem_policyMeasure[0].originalItem.code!="undefined")){
                        selecteditem_policyMeasure_found = true;
                    }
                }
            }
            if((selecteditem_country!=null)&&(typeof selecteditem_country!="undefined")&&(selecteditem_country.length>0)){
                if((selecteditem_country[0].originalItem!=null)&&(typeof selecteditem_country[0].originalItem!="undefined")){

                    if((selecteditem_country[0].originalItem.code!=null)&&(typeof selecteditem_country[0].originalItem.code!="undefined")){
                        selecteditem_country_found = true;
                    }
                }
            }
            if((selecteditem_commodityClass!=null)&&(typeof selecteditem_commodityClass!="undefined")&&(selecteditem_commodityClass.length>0)){
                if((selecteditem_commodityClass[0].originalItem!=null)&&(typeof selecteditem_commodityClass[0].originalItem!="undefined")){

                    if((selecteditem_commodityClass[0].originalItem.code!=null)&&(typeof selecteditem_commodityClass[0].originalItem.code!="undefined")){
                        selecteditem_commodityClass_found = true;
                    }
                }
            }
            if(selecteditem_commodityDomain_found&&selecteditem_policyDomain_found&&selecteditem_policyType_found&&selecteditem_policyMeasure_found&&selecteditem_country_found&&selecteditem_commodityClass_found&&selecteditem_policyMeasure[0].event_type == "select"){

                //Condition
                var commodityDomaincCode = selecteditem_commodityDomain.code;
                var policyDomainCode = selecteditem_policyDomain.code;
                if(selecteditem_commodityDomain.code== self.options.commodity_domain_both_code)
                {
                    //Both
                    commodityDomaincCode = self.options.commodity_domain_both;
                }
                if (selecteditem_policyDomain.code == self.options.policy_domain_both_code) {
                    //Both
                    policyDomainCode = self.options.policy_domain_both;
                }

                //{countryCode}/{commodityClassCode}
                var rest_url = {'rest_url_type':self.options.condition_url, 'rest_url_datasource' : self.options.datasource, 'rest_url_policyDomainCode' : policyDomainCode, 'rest_url_policyTypeCode' : selecteditem_policyType[0].originalItem.code, 'rest_url_commodityDomainCode' : commodityDomaincCode,  'rest_url_countryCode' : selecteditem_country[0].originalItem.code,  'rest_url_commodityClassCode' : selecteditem_commodityClass[0].originalItem.code };
                var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/'+ rest_url.rest_url_policyDomainCode +'/'+ rest_url.rest_url_policyTypeCode +'/'+rest_url.rest_url_commodityDomainCode +'/'+rest_url.rest_url_countryCode +'/'+rest_url.rest_url_commodityClassCode;

                //var rest_url = {'rest_url_type':self.options.condition_url, 'rest_url_datasource' : self.options.datasource, 'rest_url_policyDomainCode' : policyDomainCode, 'rest_url_policyTypeCode' : selecteditem_policyType[0].originalItem.code, 'rest_url_commodityDomainCode' : commodityDomaincCode};
                //var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/'+ rest_url.rest_url_policyDomainCode +'/'+ rest_url.rest_url_policyTypeCode +'/'+rest_url.rest_url_commodityDomainCode;
                self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_7, url, self);

                //Individual Policy
                //if(((selecteditem_policyDomain.code==ap_util_variables.CONFIG.domestic_policyDomain_code)||(selecteditem_policyDomain.code==self.options.policy_domain_both_code))&&(selecteditem_policyType[0].originalItem.code==ap_util_variables.CONFIG.tax_concession_policyType_code)&&((selecteditem_commodityDomain.code==ap_util_variables.CONFIG.biofuel_commodity_domain_code)||(selecteditem_commodityDomain.code==self.options.commodity_domain_both_code))){
                //    var rest_url = {'rest_url_type':self.options.individualPolicy_url, 'rest_url_datasource' : self.options.datasource, 'rest_url_policyDomainCode' : policyDomainCode, 'rest_url_policyTypeCode' : selecteditem_policyType[0].originalItem.code, 'rest_url_commodityDomainCode' : commodityDomaincCode};
                //    var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/'+ rest_url.rest_url_policyDomainCode +'/'+ rest_url.rest_url_policyTypeCode +'/'+rest_url.rest_url_commodityDomainCode;
                //    self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_7_b, url, self);
                //}
                //else{
                //    var data = [];
                //    var properties = [];
                //    qd_instance.update_selector_domain(self.options.fx_selector_7_b, data, properties);
                //}
                var rest_url = {'rest_url_type':self.options.individualPolicy_url, 'rest_url_datasource' : self.options.datasource, 'rest_url_policyDomainCode' : policyDomainCode, 'rest_url_policyTypeCode' : selecteditem_policyType[0].originalItem.code, 'rest_url_commodityDomainCode' : commodityDomaincCode};
                var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/'+ rest_url.rest_url_policyDomainCode +'/'+ rest_url.rest_url_policyTypeCode +'/'+rest_url.rest_url_commodityDomainCode;
                self.options.host_domain_parser.getDomain(qd_instance, self.options.fx_selector_7_b, url, self);
            }
            else{
                //var data = [];
                //var properties = [];
                ////Condition
                //qd_instance.update_selector_domain(self.options.fx_selector_7, data, properties);
                ////Individual Policy
                //qd_instance.update_selector_domain(self.options.fx_selector_7_b, data, properties);

                var data = [];
                var properties = [];
                //The list is empty
                var none_code = '105';
                var none_label = 'n.a.';
                var dataI = 0;
                var noneObj = {};
                noneObj = {"value": self.options.condition_selector_type + "_" + none_code, "label": '' + none_label, "code" : none_code, "type": self.options.condition_selector_type};
                data.push(noneObj);
                //Condition
                qd_instance.update_selector_domain(self.options.fx_selector_7, data, properties);
                var properties_to_select = [];
                //"none" is in the first position
                properties_to_select.push(0);
                qd_instance.update_selector_selection(self.options.fx_selector_7, properties_to_select, true);
                //Individual Policy
                noneObj = {};
                none_code = '999';
                noneObj = {"value": self.options.individualPolicy_selector_type + "_" + none_code, "label": '' + none_label, "code" : none_code, "type": self.options.individualPolicy_selector_type};
                data.push(noneObj);
                qd_instance.update_selector_domain(self.options.fx_selector_7_b, data, properties);
                var properties_to_select = [];
                //"none" is in the first position
                properties_to_select.push(0);
                qd_instance.update_selector_selection(self.options.fx_selector_7_b, properties_to_select, true);
            }
        }
    }

    Host.prototype.summaryDefaultValueSetting = function(guiJson, payload, self){
        var masterdata = payload.master_data;
        var policydata = payload.policy_data;
        console.log(masterdata)
        console.log(policydata)

        if((guiJson!=null)&&(typeof guiJson!='undefined')){
            if((guiJson.panels[0].properties.summary.properties.country)&&(typeof guiJson.panels[0].properties.summary.properties.country)){
                guiJson.panels[0].properties.summary.properties.country.value = {};
                //guiJson.panels[0].properties.summary.properties.country.value.default = "Argentina";
                guiJson.panels[0].properties.summary.properties.country.value.default = masterdata.CountryName;
                guiJson.panels[0].properties.summary.properties.country.value.code = masterdata.CountryCode;
            }

            if((guiJson.panels[0].properties.summary.properties.subnational!=null)&&(typeof guiJson.panels[0].properties.summary.properties.subnational!='undefined')){
                guiJson.panels[0].properties.summary.properties.subnational.value = {};
                //guiJson.panels[0].properties.summary.properties.subnational.value.default = "n.a";
                guiJson.panels[0].properties.summary.properties.subnational.value.default = masterdata.SubnationalName;
                guiJson.panels[0].properties.summary.properties.subnational.value.code = masterdata.SubnationalCode;
            }

            if((guiJson.panels[0].properties.summary.properties.commodityDomain!=null)&&(typeof guiJson.panels[0].properties.summary.properties.commodityDomain!='undefined')){
                guiJson.panels[0].properties.summary.properties.commodityDomain.value = {};
                //guiJson.panels[0].properties.summary.properties.commodityClass.value.default = "Wheat";
                guiJson.panels[0].properties.summary.properties.commodityDomain.value.default = masterdata.CommodityDomainName;
                guiJson.panels[0].properties.summary.properties.commodityDomain.value.code = masterdata.CommodityDomainCode;
            }

            if((guiJson.panels[0].properties.summary.properties.commodityClass!=null)&&(typeof guiJson.panels[0].properties.summary.properties.commodityClass!='undefined')){
                guiJson.panels[0].properties.summary.properties.commodityClass.value = {};
                //guiJson.panels[0].properties.summary.properties.commodityClass.value.default = "Wheat";
                guiJson.panels[0].properties.summary.properties.commodityClass.value.default = masterdata.CommodityClassName;
                guiJson.panels[0].properties.summary.properties.commodityClass.value.code = masterdata.CommodityClassCode;
            }

            if((guiJson.panels[0].properties.summary.properties.commodityId!=null)&&(typeof guiJson.panels[0].properties.summary.properties.commodityId!='undefined')){
                guiJson.panels[0].properties.summary.properties.commodityId.value = {};
                //guiJson.panels[0].properties.summary.properties.commodityId.value.default = "108";
                guiJson.panels[0].properties.summary.properties.commodityId.value.default = masterdata.CommodityId;
            }

            if((guiJson.panels[0].properties.summary.properties.hsCode!=null)&&(typeof guiJson.panels[0].properties.summary.properties.hsCode!='undefined')){
                guiJson.panels[0].properties.summary.properties.hsCode.value = {};
                //guiJson.panels[0].properties.summary.properties.hsCode.value.default = "109";
                guiJson.panels[0].properties.summary.properties.hsCode.value.default = masterdata.hsCode;
            }

            if((guiJson.panels[0].properties.summary.properties.hsVersion!=null)&&(typeof guiJson.panels[0].properties.summary.properties.hsVersion!='undefined')){
                guiJson.panels[0].properties.summary.properties.hsVersion.value = {};
                //guiJson.panels[0].properties.summary.properties.hsVersion.value.default = "119";
                guiJson.panels[0].properties.summary.properties.hsVersion.value.default = masterdata.hsVersion;
            }

            if((guiJson.panels[0].properties.summary.properties.suffix!=null)&&(typeof guiJson.panels[0].properties.summary.properties.suffix!='undefined')){
                guiJson.panels[0].properties.summary.properties.suffix.value = {};
                //guiJson.panels[0].properties.summary.properties.suffix.value.default = "129";
                guiJson.panels[0].properties.summary.properties.suffix.value.default = masterdata.hsSuffix;
            }

            if((guiJson.panels[0].properties.summary.properties.shortDescription!=null)&&(typeof guiJson.panels[0].properties.summary.properties.shortDescription!='undefined')){
                guiJson.panels[0].properties.summary.properties.shortDescription.value = {};
                //guiJson.panels[0].properties.summary.properties.shortDescription.value.default = "149";
                guiJson.panels[0].properties.summary.properties.shortDescription.value.default = masterdata.shortDescription;
            }

            if((guiJson.panels[0].properties.summary.properties.description!=null)&&(typeof guiJson.panels[0].properties.summary.properties.description!='undefined')){
                guiJson.panels[0].properties.summary.properties.description.value = {};
                //guiJson.panels[0].properties.summary.properties.description.value.default = "139";
                guiJson.panels[0].properties.summary.properties.description.value.default = masterdata.description;
            }

            if((guiJson.panels[0].properties.summary.properties.policyDomain!=null)&&(typeof guiJson.panels[0].properties.summary.properties.policyDomain!='undefined')){
                guiJson.panels[0].properties.summary.properties.policyDomain.value = {};
                //guiJson.panels[0].properties.summary.properties.policyDomain.value.default = "Trade";
                guiJson.panels[0].properties.summary.properties.policyDomain.value.default = masterdata.PolicyDomainName;
                guiJson.panels[0].properties.summary.properties.policyDomain.value.code = masterdata.PolicyDomainCode;
            }

            if((guiJson.panels[0].properties.summary.properties.policyType!=null)&&(typeof guiJson.panels[0].properties.summary.properties.policyType!='undefined')){
                guiJson.panels[0].properties.summary.properties.policyType.value = {};
                //guiJson.panels[0].properties.summary.properties.policyType.value.default = "Export measures";
                guiJson.panels[0].properties.summary.properties.policyType.value.default = masterdata.PolicyTypeName;
                guiJson.panels[0].properties.summary.properties.policyType.value.code = masterdata.PolicyTypeCode;
            }

            if((guiJson.panels[0].properties.summary.properties.policyMeasure!=null)&&(typeof guiJson.panels[0].properties.summary.properties.policyMeasure!='undefined')){
                guiJson.panels[0].properties.summary.properties.policyMeasure.value = {};
                //guiJson.panels[0].properties.summary.properties.policyMeasure.value.default = "Licensing requirement";
                guiJson.panels[0].properties.summary.properties.policyMeasure.value.default = masterdata.PolicyMeasureName;
                //Added
                guiJson.panels[0].properties.summary.properties.policyMeasure.value.code = masterdata.PolicyMeasureCode;
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
                //var cplId = '118';
                //guiJson.panels[0].properties.source.source.url+= "/"+countryCode+"/"+cplId;
                guiJson.panels[0].properties.source.source.url+= "/"+countryCode;
            }

            self.options.host_utility_instance.checkFieldsByPolicySelection(guiJson, payload);


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
                var newFormat = '';
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.linkPdf;
                defaultValue = policydata.LinkPdf;
                self.setDefaultValue_TextField(field, defaultValue);

                //Add check for value and value text
                field = guiJson.panels[0].properties.valueText;
                defaultValue = policydata.ValueText;
                self.setDefaultValue_TextField(field, defaultValue);

                field = guiJson.panels[0].properties.value;
                defaultValue = policydata.Value;
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
                //field = guiJson.panels[0].properties.startDate;
                //defaultValue = policydata.StartDate;
                //newFormat = self.dateFormatConverter_ddMMyyyy_mmDDyy(defaultValue);
                //if((newFormat!=null)&&(typeof newFormat!= "undefined")&&(newFormat.length>0)){
                //    self.setDefaultValue_Calendar(field, self.dateFormatConverter_ddMMyyyy_mmDDyy(defaultValue));
                //}
                //
                //field = guiJson.panels[0].properties.endDate;
                //defaultValue = policydata.EndDate;
                //newFormat = self.dateFormatConverter_ddMMyyyy_mmDDyy(defaultValue);
                //if((newFormat!=null)&&(typeof newFormat!= "undefined")&&(newFormat.length>0)){
                //    self.setDefaultValue_Calendar(field, self.dateFormatConverter_ddMMyyyy_mmDDyy(defaultValue));
                //}
                //
                //field = guiJson.panels[0].properties.dateOfPublication;
                //defaultValue = policydata.DateOfPublication;
                //newFormat = self.dateFormatConverter_ddMMyyyy_mmDDyy(defaultValue);
                //if((newFormat!=null)&&(typeof newFormat!= "undefined")&&(newFormat.length>0)){
                //    self.setDefaultValue_Calendar(field, self.dateFormatConverter_ddMMyyyy_mmDDyy(defaultValue));
                //}
                //
                //field = guiJson.panels[0].properties.startDateTax;
                //defaultValue = policydata.StartDateTax;
                //newFormat = self.dateFormatConverter_ddMMyyyy_mmDDyy(defaultValue);
                //if((newFormat!=null)&&(typeof newFormat!= "undefined")&&(newFormat.length>0)){
                //    self.setDefaultValue_Calendar(field, self.dateFormatConverter_ddMMyyyy_mmDDyy(defaultValue));
                //}

                field = guiJson.panels[0].properties.startDate;
                defaultValue = policydata.StartDate;
                newFormat = self.dateFormatConverter_milliseconds(defaultValue);
                if((newFormat!=null)&&(typeof newFormat!= "undefined")&&(newFormat.length>0)){
                    //self.setDefaultValue_Calendar(field, self.dateFormatConverter_milliseconds(defaultValue));
                    self.setDefaultValue_Calendar(field, self.dateFormatConverter_ddMMyyyy_ddMMyyyy(defaultValue));
                }

                field = guiJson.panels[0].properties.endDate;
                defaultValue = policydata.EndDate;
                newFormat = self.dateFormatConverter_milliseconds(defaultValue);
                if((newFormat!=null)&&(typeof newFormat!= "undefined")&&(newFormat.length>0)){
                    //self.setDefaultValue_Calendar(field, self.dateFormatConverter_milliseconds(defaultValue));
                    self.setDefaultValue_Calendar(field, self.dateFormatConverter_ddMMyyyy_ddMMyyyy(defaultValue));
                }

                field = guiJson.panels[0].properties.dateOfPublication;
                defaultValue = policydata.DateOfPublication;
                newFormat = self.dateFormatConverter_milliseconds(defaultValue);
                if((newFormat!=null)&&(typeof newFormat!= "undefined")&&(newFormat.length>0)){
                    //self.setDefaultValue_Calendar(field, self.dateFormatConverter_milliseconds(defaultValue));
                    self.setDefaultValue_Calendar(field, self.dateFormatConverter_ddMMyyyy_ddMMyyyy(defaultValue));
                }

                field = guiJson.panels[0].properties.startDateTax;
                defaultValue = policydata.StartDateTax;
                newFormat = self.dateFormatConverter_milliseconds(defaultValue);
                if((newFormat!=null)&&(typeof newFormat!= "undefined")&&(newFormat.length>0)){
                    //self.setDefaultValue_Calendar(field, self.dateFormatConverter_milliseconds(defaultValue));
                    self.setDefaultValue_Calendar(field, self.dateFormatConverter_ddMMyyyy_ddMMyyyy(defaultValue));
                }
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
        if((value!=null)&&(typeof value!= "undefined")&&(value.length>0)){
            var d = new Date(value);

            var month = parseInt(d.getMonth(), 10)+1;
            var stringNewFormat = d.getDate() + "/" + month + "/"+ d.getFullYear();
        }
        return stringNewFormat;
    };

    Host.prototype.dateFormatConverter_milliseconds = function(value){

        //This is the original format "DD/MM/YYYY"
        var original_string ='';
        var stringNewFormat = '';
        if((value!=null)&&(typeof value!= "undefined")&&(value.length>0)){

            original_string = value.split("/");
            var day = original_string[0];
            var month = original_string[1];
            var year = original_string[2];
            if(day.length==1){
                day = "0"+day;
            }
            if(month.length==1){
                month = "0"+month;
            }
            //the original format "MM/DD/YYYY"
            var d = new Date(month+"/"+day+"/"+year);
            var milliseconds = d.getTime();
            var stringNewFormat = ""+milliseconds;
        }
        return stringNewFormat;
    };

    Host.prototype.dateFormatConverter_ddMMyyyy_ddMMyyyy = function(value){

        //This is the original format "DD/MM/YYYY"
        var original_string ='';
        var stringNewFormat = '';
        if((value!=null)&&(typeof value!= "undefined")&&(value.length>0)){

            original_string = value.split("/");
            var day = original_string[0];
            var month = original_string[1];
            var year = original_string[2];
            if(day.length==1){
                day = "0"+day;
            }
            if(month.length==1){
                month = "0"+month;
            }
            //the original format "MM/DD/YYYY"
            stringNewFormat = day + "-"+ month + "-"+year;
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
