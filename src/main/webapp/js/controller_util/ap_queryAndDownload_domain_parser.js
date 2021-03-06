define([
    'jquery',
    'ap_policyDataObject',
    'ap_util_variables',
    'ap_util_functions',
    'nprogress',
    'jQAllRangeSliders',
    'xDomainRequest',
    'jqwidget'
], function($, ap_policyDataObject, ap_util_variables, ap_util_functions, NProgress) {

    var optionsDefault = {
        singleCommodityPopup : true
    }

    //text= Loads dependencies as plain text files.
    function HostDomainParser(o) {
        if (this.options === undefined) {
            this.options = {};
        }
        $.extend(true, this.options, optionsDefault, o);
    }

    HostDomainParser.prototype.getDomain = function(qd_controller_instance, selector_id, url_type_var, self) {

        //qd_instance, self.options.fx_selector_5_b, url, self
        var domain_parser_instance = this;
        var urlApp = '';
        /* Retrive UI structure from DB. */
        if((url_type_var!=null)&&(url_type_var.rest_url_type!=null)&&(url_type_var.rest_url_type!="undefined"))
        {
            var url_type = url_type_var.rest_url_type;
            if((url_type_var.rest_url_specific_code != null)&&(typeof url_type_var.rest_url_specific_code != 'undefined'))
            {
                url_type += url_type_var.rest_url_specific_code;
            }
            urlApp = self.options.codelist_url +"/"+ url_type +"/1.0";
        }
        else{
            //The url is a string
            urlApp = url_type_var;
        }

        $.ajax({
            type: 'GET',
            //url: "http://faostat3.fao.org/d3sp/service/msd/cl/system/OECD_CommodityClass1/1.0",
            url:  urlApp,
            dataType: 'json',

            success: function (response) {
                /* Convert the response in an object, if needed. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
                //To order the json elements based on the title(label)
                var jsonCodes = json.rootCodes;
                var data = new Array();
                var none_index=-1;
                //console.log("In success")
                //console.log(response);
                //console.log(jsonCodes);
                var type = qd_controller_instance.getSelector_domainType(selector_id);
                if((jsonCodes!=null)&&(typeof jsonCodes!="undefined")&&(jsonCodes.length>0))
                {
                    jsonCodes.sort(function (a, b) {
                        if (a.title.EN < b.title.EN)
                            return -1;
                        if (a.title.EN > b.title.EN)
                            return 1;
                        return 0;
                    });

                    var toRemove = false;
//                if(json.system.contains('CommodityClass'))
//                {
//                    toRemove = true;
//                }

//                if(sys.contains('CommodityClass'))
//                {
//                    toRemove = true;
//                }

                    //if((json.system.indexOf('CommodityClass')!=-1)&&(self.options.button_preview_action_type != "searchCreatePolicy"))
                    if(json.system.indexOf('CommodityClass')!=-1)
                    {
                        toRemove = true;
                    }

                    //-> Generic Component..can be Commodity or Country
                    //var type = qd_controller_instance.getSelector_domainType(selector_id);

                    var language = qd_controller_instance.getSelector_language(selector_id);

                    //var codes_to_remove = ['8','9','10','11','12'];
                    //var parent = {'8':[1,3],'9':[2,3],'10':[3,4],'11':[1,2,3],'12':[1,2]};
                    var codes_to_remove = self.options.commodity_codes_to_remove;
                    var parent = self.options.commodity_parent;
                    var to_remove = [];
                    var remove_count =0;
                    var insert_count =0;
                    for (var i = 0; i < json.rootCodes.length; i++) {
//                        var c = json.rootCodes[i].code;
//                        var l = json.rootCodes[i].title['EN'];
                        var c = jsonCodes[i].code;
                        var l = jsonCodes[i].title[language];
                        var obj = {"value": type + "_" + c, "label": '' + l, "code" : c, "type": type};
//                    var obj = {"value": type + "_" + i + "_" + c, "label": '' + l, "code" : c, "type": type};

                        var inToRemove = false;
                        if(toRemove)
                        {
                            var found = $.inArray(obj.code, codes_to_remove);
                            if(found != -1)
                            {
                                //The element has to be checked through the checkbox
                                to_remove[remove_count]= obj;
                                inToRemove = true;
                                remove_count++;
                            }
                        }
                        if(!inToRemove)
                        {
                            data[insert_count] = obj;
                            insert_count++;
                        }
                    }

                    //For commodity and country tab there is one source element in this array
                    var sources = new Array();
                    sources[0] = data;

                    //This obj 'properties' is specific for the update of each selector type
                    //In this case is used to show or hide the elements that belong to the "Mixed"
//                var properties = {'removeFromList': [{'label': 'Id1', 'value': 'ValueId1'}, {'label': 'Id2', 'value': 'ValueId2'}]};
                    var properties ='';
                    //if((json.system.indexOf('CommodityClass')!=-1)&&(self.options.button_preview_action_type != "searchCreatePolicy"))
                     //if(json.system.contains('CommodityClass'))
                    if(json.system.indexOf('CommodityClass')!=-1)
                    {
                        properties = {'removeFromList': to_remove, 'parent':parent};
                    }
                    else
                    {
                        properties = {'removeFromList': to_remove};
                    }
                }
                else{
                    //var type = qd_controller_instance.getSelector_domainType(selector_id);
                    if((type==self.options.condition_selector_type)||(type==self.options.individualPolicy_selector_type)){
                        var dataI = 0;
                        var noneObj = {};

                        if((json!=null)&&(typeof json!='undefined')&&(json.length>0)){
                            for (var i = 0; i < json.length; i++) {
                                // console.log(json[i][1])
                                if((json[i][1]=='none')||(json[i][1]=='n.a.')){
                                    noneObj = {"value": type + "_" + json[i][0], "label": '' + json[i][1], "code" : json[i][0], "type": type};
                                    //data[dataI] = obj;
                                    none_index=i;
                                    //dataI++;
                                    break;
                                }
                            }

                            data.push(noneObj);
                            dataI++;
                            for (var i = 0; i < json.length; i++) {
                                if(i!=none_index){
                                    var obj = {"value": type + "_" + json[i][0], "label": '' + json[i][1], "code" : json[i][0], "type": type};
                                    data[dataI] = obj;
                                    dataI++;
                                }
                            }
                            //var none_code = '';
                            //if(type==self.options.condition_selector_type){
                            //    none_code = '105';
                            //}
                            //else if(type==self.options.individualPolicy_selector_type){
                            //    none_code = '999';
                            //}

                            //Condition or Individual Policy
                            //Put 'n.a.' in the first position
                            //var dataApp = [];
                            //for(var i=0; i<data.length; i++){
                            //    if((data[i]!=null)&&(typeof data[i]!="undefined")){
                            //        //105 is the code(in condition) for 'n.a.'
                            //        if(data[i].code=='105'){
                            //            dataApp.push(data[i]);
                            //            data.splice(i,1);
                            //        }
                            //    }
                            //}
                            //dataApp.push(noneObj);
                            //for(var i=0; i<data.length; i++){
                            //    dataApp.push(data[i]);
                            //}
                            //data = dataApp;
                        }
                        else{
                            //The list is empty
                            var none_code = '';
                            var none_label = 'n.a.';
                            if(type==self.options.condition_selector_type){
                                none_code = '105';
                            }
                            else if(type==self.options.individualPolicy_selector_type){
                                none_code = '999';
                            }
                            var dataI = 0;
                            var noneObj = {};
                            noneObj = {"value": type + "_" + none_code, "label": '' + none_label, "code" : none_code, "type": type};
                            data.push(noneObj);
                            none_index = 0;
                            console.log(type)
                            console.log(data)
                        }
                    }
                    else if(type==self.options.commodityDetail_selector_type){
                        for (var i = 0; i < json.length; i++) {

                            var commodityId = '';
                            var hsCode = '';
                            var hsVersion = '';
                            var hsSuffix = '';
                            var shortDescription = '';
                            var longDescription = '';
                            var app = '';
                            //commodity_id, country_name, hs_code, hs_suffix, hs_version, target_code, description, short_description, commodityclass_code, commodityclass_name, shared_group_code

                            //commodity_id, country_name, hs_code, hs_suffix, hs_version, description, commodityclass_code, commodityclass_name, short_description, shared_group_code, country_code FROM commlistwithid
                            if((json[i][0]!=null)&&(typeof json[i][0]!= "undefined")&&(json[i][0].length>0)){
                                commodityId = json[i][0];
                                if(commodityId==self.options.none){
                                    commodityId = self.options.na;
                                }
                            }

                            if((json[i][2]!=null)&&(typeof json[i][2]!= "undefined")&&(json[i][2].length>0)){
                                hsCode = json[i][2];

                                var space = "";
                                if(hsCode.length<8)
                                {
                                    var diff = 8-(hsCode.length);
                                    if(diff==2)
                                        space = "  ";
                                    if(diff==4)
                                        space = "    ";
                                }
                                app += hsCode+space;
                            }

                            if((json[i][3]!=null)&&(typeof json[i][3]!= "undefined")&&(json[i][3].length>0)){
                                hsSuffix = json[i][3];
                            }

                            if((json[i][4]!=null)&&(typeof json[i][4]!= "undefined")&&(json[i][4].length>0)){
                                hsVersion = json[i][4];
                                if(hsVersion==self.options.none){
                                    hsVersion = self.options.na;
                                }
                                app += "["+hsVersion+"]";
                            }

                            if((json[i][5]!=null)&&(typeof json[i][5]!= "undefined")&&(json[i][5].length>0)){
                                longDescription = json[i][5];
                            }

                            if((json[i][6]!=null)&&(typeof json[i][6]!= "undefined")&&(json[i][6].length>0)){
                                shortDescription = json[i][6];
                                app += shortDescription;
                            }
                            var value = ""+type + "_COMMODITYID:"+commodityId+"_HSCODE:"+hsCode+"_HSSUFFIX:"+hsSuffix+"_HSVERSION:"+hsVersion+"_DESCRIPTION:"+longDescription+"_SHORTDESCRIP:"+shortDescription;
                            //var obj = {"value": value, "label": app, "code" : hsCode, "type": type};
                            var obj = {"hsVersion":hsVersion, "shortDescription": shortDescription, "value": value, "label": app, "code" : hsCode, "type": type, "labelToVisualize": "<img width='16' height='16' style='float: left; margin-top: 2px; margin-right: 5px;' src='../../img/btn-notes.png'/><span>"+app+"</span>"};
                            data[i] = obj;
                            //console.log("COMMODITY CLASS START!!!!")
                            //console.log(data)
                            //console.log("COMMODITY CLASS END!!!!")
                        }
                    }
                }

                if((json.system!=null)&&(typeof json.system!="undefined")&&(json.system.indexOf(self.options.codelist_url_PolicyType)!=-1))
                {
                    var index_policy_meas_name_start = json.title.EN.indexOf("OECD") + 5;
                    var policy_meas_name = json.title.EN.substr(index_policy_meas_name_start);
                    var index_policy_meas_code_start = json.system.indexOf(self.options.codelist_url_PolicyType) + 15;
                    var policy_meas_code = json.system.substring(index_policy_meas_code_start);
                    for(var iData = 0; iData< data.length; iData++)
                    {
                        data[iData].parent_code = policy_meas_code;
                        data[iData].parent_name = policy_meas_name;
                    }
                    self.options.policy_measure_actual_calls++;
                    //Concat the two array saving the partial data
                    self.options.policy_measure_actual_data = self.options.policy_measure_actual_data.concat(data).sort(function (a, b) {
                        if (a.label < b.label)
                            return -1;
                        if (a.label > b.label)
                            return 1;
                        return 0;
                    });

                    //Storing only the unique values
                    self.options.policy_measure_actual_data = self.options.policy_measure_actual_data.filter(function (item, index) {
                        return self.options.policy_measure_actual_data.indexOf(item) === index;
                    });

                    if(self.options.policy_measure_actual_calls == self.options.policy_measure_calls)
                    {
                        var equal_labels = [];

                        //Adding the label for the Policy Measure
                        for(var iPolMeas=0; iPolMeas< self.options.policy_measure_actual_data.length; iPolMeas++)
                        {
                            for(var iPolMeas2=0; iPolMeas2< self.options.policy_measure_actual_data.length; iPolMeas2++)
                            {
                                if((self.options.policy_measure_actual_data[iPolMeas].label == self.options.policy_measure_actual_data[iPolMeas2].label)&&(iPolMeas!=iPolMeas2))
                                {
                                    if($.inArray(self.options.policy_measure_actual_data[iPolMeas].label, equal_labels)==-1)
                                    {
                                        equal_labels.push(self.options.policy_measure_actual_data[iPolMeas].label);
                                        break;
                                    }
                                }
                            }
                        }

                        //Writing the Policy Type Name in the Policy Measure Labels
                        for(var iEl=0; iEl<equal_labels.length; iEl++)
                        {
                            for(var iPolMeas=0; iPolMeas< self.options.policy_measure_actual_data.length; iPolMeas++)
                            {
                                if(self.options.policy_measure_actual_data[iPolMeas].label == equal_labels[iEl])
                                {
                                    self.options.policy_measure_actual_data[iPolMeas].label+= "["+self.options.policy_measure_actual_data[iPolMeas].parent_name+"]";
                                }
                            }
                        }
                        qd_controller_instance.update_selector_domain(self.options.fx_selector_4, self.options.policy_measure_actual_data, properties);
                        self.options.policy_measure_actual_calls= 0;
                        self.options.policy_measure_actual_data =[];

                        //The first Policy Measures that don't belong to the Selected Policy Type have to be disabled
                        domain_parser_instance.listbox_element_disable(qd_controller_instance, self.options.fx_selector_3, self.options.fx_selector_4, true);
                        //The Loading Window
                        NProgress.done();
                    }
                }
                else {
                    if((json!=null)&&(typeof json!="undefined")&&(json.system!=null)&&(typeof json.system!="undefined")&&(json.system.indexOf('CommodityClass')!= -1)&&(self.options.button_preview_action_type == "searchCreatePolicy")){
                        var selected_commodity_domain = qd_controller_instance.getSelectedItems(self.options.fx_selector_1);
                        var code_order='';
                        if((typeof selected_commodity_domain.code !="undefined")&&(selected_commodity_domain.code !=2)){
                            if(selected_commodity_domain.code == self.options.commodity_domain_agricultural){
                                //Agricultural
                                //code_order=[3,2,4,1,9,11,10,8,12];
                                code_order= self.options.agricultural_policy_domain_code_order;
                            }
                            if(selected_commodity_domain.code == self.options.commodity_domain_both_code){
                                //Both
                                //code_order=[6,7,5,3,2,4,1,9,11,10,8,12];
                                code_order= self.options.both_policy_domain_code_order;
                            }
                            var commodity_data = [];
                            var commodity_data_count=0;
                            var code_order_count=0;
                            for(var j=0; j< code_order.length; j++){
                                for(var i=0; i< data.length; i++){
                                    var obj= data[i];
                                    if((obj.code!=null)&&(typeof obj.code!="undefined")){
                                        if(obj.code==code_order[j]){
                                            commodity_data.push(obj);
                                            commodity_data_count++;
                                            break;
                                        }
                                    }
                                }
                            }
                            data = commodity_data;
                        }
                        qd_controller_instance.update_selector_domain(selector_id, data, properties);
                    }
                    else if((json!=null)&&(typeof json!="undefined")&&(json.system!=null)&&(typeof json.system!="undefined")&&(json.system.indexOf('Country')!= -1)){
                        if(self.options.button_preview_action_type == "searchCreatePolicy")
                        {
                            //Create
                            if((self.options.logged_user_code!= self.options.logged_user_default_code)&&(data!=null)&&(typeof data != "undefined")){
                                //The user is logged like a specific country
                                var data_for_country = [];
                                for(var i=0; i< data.length; i++){
                                    if(data[i].code == self.options.logged_user_code)
                                    {
                                        //The list has to contain only the specific country
                                        data_for_country[0] = data[i];
                                        break;
                                    }
                                }
                                qd_controller_instance.update_selector_domain(selector_id, data_for_country, properties);
                            }
                            else{
                                //Oecd User
                                qd_controller_instance.update_selector_domain(selector_id, data, properties);
                            }
                        }
                        else if(self.options.button_preview_action_type == "searchEditPolicy")
                        {
                            //Edit
                            if((self.options.logged_user_code!= self.options.logged_user_default_code)&&(data!=null)&&(typeof data != "undefined")){
                                //The user is logged like a specific country
                                var data_for_country = [];
                                for(var i=0; i< data.length; i++){
                                    if(data[i].code == self.options.logged_user_code)
                                    {
                                        //The list has to contain only the specific country
                                        data_for_country[0] = data[i];
                                        break;
                                    }
                                }
                                qd_controller_instance.update_selector_domain(selector_id, data_for_country, properties);
                            }
                            else{
                                //Oecd User
                                qd_controller_instance.update_selector_domain(selector_id, data, properties);
                                //Country ... case not Add policy
                                //Enable Disable Country
                                self.options.host_domain_parser.listbox_country_element_enable_and_disable(qd_controller_instance, self.options.fx_selector_1, self.options.fx_selector_2, self.options.fx_selector_6, self, true);
                            }
                        }
                        else{
                            //Q&D
                            qd_controller_instance.update_selector_domain(selector_id, data, properties);
                            //Country ... case not Add policy
                            //Enable Disable Country
                            self.options.host_domain_parser.listbox_country_element_enable_and_disable(qd_controller_instance, self.options.fx_selector_1, self.options.fx_selector_2, self.options.fx_selector_6, self, true);
                        }
                    }
                    else if((((qd_controller_instance.getSelector_domainType(selector_id))==self.options.condition_selector_type)||((qd_controller_instance.getSelector_domainType(selector_id))==self.options.individualPolicy_selector_type))&&(none_index!=-1)){
                        qd_controller_instance.update_selector_domain(selector_id, data, properties);
                        var properties_to_select = [];
                        //If "none" has been found it's in the first position
                        properties_to_select.push(0);
                        qd_controller_instance.update_selector_selection(selector_id, properties_to_select, true);
                    }
                    else{
                        //"hsVersion":hsVersion, "shortDescription": shortDescription, "value": value, "label": app, "code" : hsCode,
                        if(type== "CommodityDetail"){
                            //console.log("COMMODITY DETAIL!!")
                            //console.log(data)
                            //var data = new Array();
                            //for(var iSource= 0; iSource<10; iSource++){
                            //    var obj = {};
                            //    obj['code'] = data[iSource].code;
                            //    obj['commodity'] = "LabelCommodity"+iSource;
                            //    obj['originalHsCode'] = "LabelOriginalHsCode"+iSource;
                            //    obj['originalHsVersion'] = "LabelOriginalHsVersion"+iSource;
                            //    obj['originalHsSuffix'] = "LabelOriginalHsSuffix"+iSource;
                            //    data.push(obj);
                            //}

                            var gridSource =
                            {
                                localdata: data,
                                datatype: "array",
                                datafields:
                                    [
                                        { name: 'code', type: 'string' },
                                        { name: 'hsVersion', type: 'string' },
                                        { name: 'shortDescription', type: 'string' },
                                        { name: 'value', type: 'string' }
                                    ],
                                selectedrowindex: 0

                            };
                            //for(var iSource= 0; iSource<10; iSource++){
                            //    var obj = {};
                            //    obj['selected'] = false;
                            //    obj['commodity'] = "LabelCommodity"+iSource;
                            //    obj['originalHsCode'] = "LabelOriginalHsCode"+iSource;
                            //    obj['originalHsVersion'] = "LabelOriginalHsVersion"+iSource;
                            //    obj['originalHsSuffix'] = "LabelOriginalHsSuffix"+iSource;
                            //    data.push(obj);
                            //}
                            //
                            //var gridSource =
                            //{
                            //    localdata: data,
                            //    datatype: "array",
                            //    datafields:
                            //        [
                            //            { name: 'selected', type: 'bool' },
                            //            { name: 'commodity', type: 'string' },
                            //            { name: 'originalHsCode', type: 'string' },
                            //            { name: 'originalHsVersion', type: 'string' },
                            //            { name: 'originalHsSuffix', type: 'string' }
                            //        ]
                            //};

                            //data = gridSource;
                            qd_controller_instance.update_selector_domain(selector_id, gridSource, properties);
                        }
                        else{
                            qd_controller_instance.update_selector_domain(selector_id, data, properties);
                        }

                    }
                }
            },

            error: function (err, b, c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    }

    HostDomainParser.prototype.getDomainPolicyMeasure = function(qd_controller_instance, selector_id, url_type_var, self) {

        var domain_parser_instance = this;
        var urlApp = '';
        /* Retrive UI structure from DB. */
        if((url_type_var!=null)&&(url_type_var.rest_url_type!=null)&&(url_type_var.rest_url_type!="undefined"))
        {
            var url_type = url_type_var.rest_url_type;
            if((url_type_var.rest_url_specific_code != null)&&(typeof url_type_var.rest_url_specific_code != 'undefined'))
            {
                url_type += url_type_var.rest_url_specific_code;
            }
            urlApp = self.options.codelist_url +"/"+ url_type +"/1.0";
        }
        else{
            //The url is a string
            urlApp = url_type_var;
        }
        var commodity_domain = '';
        var policy_domain = '';
        var policy_type = '';
        var selecteditem = qd_controller_instance.getSelectedItems(self.options.fx_selector_1);
        if((selecteditem!=null)&&(typeof selecteditem!="undefined")&&(typeof selecteditem.code != 'undefined')){
            commodity_domain = selecteditem.code;
            selecteditem = qd_controller_instance.getSelectedItems(self.options.fx_selector_2);
            if((selecteditem!=null)&&(typeof selecteditem!="undefined")&&(typeof selecteditem.code != 'undefined')){
                policy_domain = selecteditem.code;
                selecteditem = qd_controller_instance.getSelectedItems(self.options.fx_selector_3);
                if((selecteditem!=null)&&(typeof selecteditem!="undefined")&&(typeof selecteditem[0]!="undefined")&&(typeof selecteditem[0].originalItem != 'undefined')&&(typeof selecteditem[0].originalItem.code != 'undefined')){
                    //policy_type = selecteditem[0].originalItem.code;
                    if (commodity_domain == self.options.commodity_domain_both_code) {
                        //Both
                        commodity_domain = self.options.commodity_domain_bothForPolicyMeasure;
                    }
                    if (policy_domain == self.options.policy_domain_both_code) {
                        //Both
                        policy_domain = self.options.policy_domain_bothForPolicyMeasure;
                    }
                    policy_type= url_type_var.rest_url_specific_code;

                    $.ajax({
                        type: 'GET',
                        //url: "http://fenixservices.fao.org/d3s/msd/resources/OECD_PolicyType0_0_8/1.0",
                        url: "http://fenixservices.fao.org/d3s/msd/resources/OECD_PolicyType"+commodity_domain+"_"+policy_domain+"_"+policy_type+"/1.0",

                        success: function (response) {
                            /* Convert the response in an object, if needed. */
                            var json = response;
                            if (typeof(response) == 'string')
                                json = $.parseJSON(response);
                            //To order the json elements based on the title(label)
                            //var jsonCodes = json.rootCodes;
                            if((json!=null)&&(typeof json!="undefined")){
                                var jsonCodes = json.data;
                                var data = new Array();
                                if((jsonCodes!=null)&&(typeof jsonCodes!="undefined")&&(jsonCodes.length>0))
                                {
                                    jsonCodes.sort(function (a, b) {
                                        if (a.title.EN < b.title.EN)
                                            return -1;
                                        if (a.title.EN > b.title.EN)
                                            return 1;
                                        return 0;
                                    });

                                    var toRemove = false;

                                    //-> Generic Component..can be Commodity or Country
                                    var type = qd_controller_instance.getSelector_domainType(selector_id);
                                    var language = qd_controller_instance.getSelector_language(selector_id);

                                    //var codes_to_remove = ['8','9','10','11','12'];
                                    //var parent = {'8':[1,3],'9':[2,3],'10':[3,4],'11':[1,2,3],'12':[1,2]};
                                    var codes_to_remove = self.options.commodity_codes_to_remove;
                                    var parent = self.options.commodity_parent;
                                    var to_remove = [];
                                    var remove_count =0;
                                    var insert_count =0;
                                    for (var i = 0; i < json.data.length; i++) {
                                        var c = jsonCodes[i].code;
                                        var l = jsonCodes[i].title[language];
                                        var obj = {"value": type + "_" + c, "label": '' + l, "code" : c, "type": type};
//                    var obj = {"value": type + "_" + i + "_" + c, "label": '' + l, "code" : c, "type": type};

                                        data[insert_count] = obj;
                                        insert_count++;
                                    }

                                    //For commodity and country tab there is one source element in this array
                                    var sources = new Array();
                                    sources[0] = data;

                                    //This obj 'properties' is specific for the update of each selector type
                                    //In this case is used to show or hide the elements that belong to the "Mixed"
//                var properties = {'removeFromList': [{'label': 'Id1', 'value': 'ValueId1'}, {'label': 'Id2', 'value': 'ValueId2'}]};
                                    var properties ='';
                                    properties = {'removeFromList': to_remove};
                                }

                                //if((json.system!=null)&&(typeof json.system!="undefined")&&(json.system.indexOf(self.options.codelist_url_PolicyType)!=-1))
                                if((json.metadata.uid!=null)&&(typeof json.metadata.uid!="undefined")&&(json.metadata.uid.indexOf(self.options.codelist_url_PolicyType)!=-1))
                                {
                                    var index_policy_meas_name_start = json.metadata.title.EN.indexOf("OECD") + 5;
                                    var policy_meas_name = json.metadata.title.EN.substr(index_policy_meas_name_start);
                                    var index_policy_meas_code_start = json.metadata.uid.indexOf(self.options.codelist_url_PolicyType) + 19;
                                    var policy_meas_code = json.metadata.uid.substring(index_policy_meas_code_start);
                                    for(var iData = 0; iData< data.length; iData++)
                                    {
                                        data[iData].parent_code = policy_meas_code;
                                        data[iData].parent_name = policy_meas_name;
                                    }
                                    self.options.policy_measure_actual_calls++;
                                    //Concat the two array saving the partial data
                                    self.options.policy_measure_actual_data = self.options.policy_measure_actual_data.concat(data).sort(function (a, b) {
                                        if (a.label < b.label)
                                            return -1;
                                        if (a.label > b.label)
                                            return 1;
                                        return 0;
                                    });

                                    //Storing only the unique values
                                    self.options.policy_measure_actual_data = self.options.policy_measure_actual_data.filter(function (item, index) {
                                        return self.options.policy_measure_actual_data.indexOf(item) === index;
                                    });

                                    if(self.options.policy_measure_actual_calls == self.options.policy_measure_calls)
                                    {
                                        var equal_labels = [];

                                        //Adding the label for the Policy Measure
                                        for(var iPolMeas=0; iPolMeas< self.options.policy_measure_actual_data.length; iPolMeas++)
                                        {
                                            for(var iPolMeas2=0; iPolMeas2< self.options.policy_measure_actual_data.length; iPolMeas2++)
                                            {
                                                if((self.options.policy_measure_actual_data[iPolMeas].label == self.options.policy_measure_actual_data[iPolMeas2].label)&&(iPolMeas!=iPolMeas2))
                                                {
                                                    if($.inArray(self.options.policy_measure_actual_data[iPolMeas].label, equal_labels)==-1)
                                                    {
                                                        equal_labels.push(self.options.policy_measure_actual_data[iPolMeas].label);
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        //Writing the Policy Type Name in the Policy Measure Labels
                                        for(var iEl=0; iEl<equal_labels.length; iEl++)
                                        {
                                            for(var iPolMeas=0; iPolMeas< self.options.policy_measure_actual_data.length; iPolMeas++)
                                            {
                                                if(self.options.policy_measure_actual_data[iPolMeas].label == equal_labels[iEl])
                                                {
                                                    self.options.policy_measure_actual_data[iPolMeas].label+= "["+self.options.policy_measure_actual_data[iPolMeas].parent_name+"]";
                                                }
                                            }
                                        }

                                        var newArray = [];
                                        //REMOVE THIS CODE TO MANAGE WTO DATA START
                                        //if((self.options.policy_measure_actual_data!=null)&&(typeof self.options.policy_measure_actual_data!="undefined")){
                                        //    var indexArray = [];
                                        //    var j =0;
                                        //    for(var i=0; i<self.options.policy_measure_actual_data.length; i++){
                                        //        if(($.inArray(self.options.policy_measure_actual_data[i].code, ap_util_variables.CONFIG.WTOImportCodes))!=-1){
                                        //            indexArray[j] = i;
                                        //            j++;
                                        //        }
                                        //    }
                                        //
                                        //    if(indexArray.length>0){
                                        //        for(j=(indexArray.length-1); j>=0; j--){
                                        //            self.options.policy_measure_actual_data.splice(indexArray[j],1);
                                        //        }
                                        //    }
                                        //}
                                        //REMOVE THIS CODE TO MANAGE WTO DATA END
                                        qd_controller_instance.update_selector_domain(self.options.fx_selector_4, self.options.policy_measure_actual_data, properties);
                                        self.options.policy_measure_actual_calls= 0;
                                        self.options.policy_measure_actual_data =[];

                                        //The first Policy Measures that don't belong to the Selected Policy Type have to be disabled
                                        domain_parser_instance.listbox_element_disable(qd_controller_instance, self.options.fx_selector_3, self.options.fx_selector_4, true);
                                        //The Loading Window
                                        NProgress.done();
                                    }
                                }
                            }
                            else{
                                NProgress.done();
                            }
                        },
                        error: function (err, b, c) {
                            alert(err.status + ", " + b + ", " + c);
                        }
                    });
                }
            }
        }
    }

    HostDomainParser.prototype.subnationalInfo = function(qd_controller_instance, host, item)
    {
        var self = this;
        var item_country_code = item.originalItem.code;
        var country_code_string = ''+ item_country_code;
        var domainParser= this;

            /* Convert the response in an object, i fneeded. */
            //var json = response;
            //if (typeof(response) == 'string')
            //    json = $.parseJSON(response);
            //alert("Subnational info on success!!!")
            //console.log(json)
            //
            //var cpl_id_list_String = '';
            //if(json.length>1){
            //    for (var i = 1; i < json.length; i++) {
            //        cpl_id_list_String += ''+ json[i][0];
            //        if(i<json.length-1){
            //            cpl_id_list_String+=',';
            //        }
            //    }
            //    console.log("cpl_id_list_String = "+cpl_id_list_String);
            //}
            //
            ////var cpl_id_list_String = "136";
            ////var cpl_id_list_String = "374";
            ////var cpl_id_list_String = "262,263,264,265,266,267,268,269,270,271,272,273,276,277,278,279,280,281,282,285,286,287,288,289,290,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,362,371,372,373,374,3124";
            var forGetMasterData = host.options.host_policy_data_object.voObjectConstruction();

//                    var body =
//                    {
//                        "uid": "GAUL",
//                        "version": "2014",
//                        "levels" : 2
//                    }
            //Country
//                    var selecteditems = host.options.qd_instance.getSelectedItems(self.options.fx_selector_6);
//                    var country = self.options.host_utility_instance.selected_items_parser(1, selecteditems);
            //console.log(data.country_code)
            //var country_code =['12'];
            //var country_code =['37'];
            var country_code = new Array();
            country_code[0]= country_code_string;
            //var country_code =[json[0]];

            //console.log("Country code = "+ country_code);
            var body = {};
            body.uid = "GAUL";
            body.version = "2014";
            body.codes = country_code;
            // body.levels = 2;

            var body2 = JSON.stringify(body);
            //Getting GAUL code
            //console.log("subnationalInfo start")
            $.ajax({
                type: 'POST',
                url: ''+host.options.codelist_url_2,
                data : body2,
                contentType: 'application/json',
                dataType:'json',
//                            url: ''+host.options.codelist_url_2+host.options.gaulsubnationalLevel_url,
                success : function(response) {
                    //console.log(response)
                    var json = response;
                    if (typeof(response) == 'string')
                        json = $.parseJSON(response);
                    var i=0;
                    //console.log("subnationalInfo 1")
                    //Subnational level 2
                    forGetMasterData.subnational = {};
                    //Subnational level 2
                    forGetMasterData.subnational_for_coutry = {};
                    //Subnational level 2
                    forGetMasterData.subnational_lev_3 = {};
                    //Subnational level 2
                    forGetMasterData.subnational_for_coutry_lev_3 = {};

                    //Country
                    forGetMasterData.country = {};

                    if((json!=null)&&(typeof json != "undefined")&&(json.length>0)){
                        for(i=0; i<json.length;i++){
                            var country = json[i].code;
                            var country_title = json[i].title["EN"];
                            forGetMasterData.country[country]=country_title;
                            var children = json[i].children;
                            //Subnational level 2
                            for(var ichild = 0; ichild<children.length; ichild++){
                                var child = children[ichild];
                                var child_code = child.code;
                                var child_name = child.title['EN'];
                                forGetMasterData.subnational[child_code]=child_name;
                                //console.log("country = "+country);
                                if((forGetMasterData.subnational_for_coutry[country]!=null)&&(typeof forGetMasterData.subnational_for_coutry[country]!='undefined')){
                                    //forGetMasterData.subnational_for_coutry[country] = {};
                                    forGetMasterData.subnational_for_coutry[country][child_code]=child_name;
                                }
                                else{
                                    forGetMasterData.subnational_for_coutry[country] = {};
                                    forGetMasterData.subnational_for_coutry[country][child_code]=child_name;
                                }

                                //Check if there are children of the third level
                                var children_lev_3 = json[i].children[ichild].children;
                                //console.log(json[i].children[ichild])
                                if((children_lev_3!=null)&&(typeof children_lev_3 !="undefined")){
                                    for(var ichild_lev_3 = 0; ichild_lev_3<children_lev_3.length; ichild_lev_3++){
                                        var child_lev_3 = children_lev_3[ichild_lev_3];
                                        var child_code_lev_3 = child_lev_3.code;
                                        var child_name_lev_3 = child_lev_3.title['EN'];
                                        forGetMasterData.subnational_lev_3[child_code_lev_3]=child_name_lev_3;
                                        //console.log("country = "+country);
                                        if((forGetMasterData.subnational_for_coutry_lev_3[country]!=null)&&(typeof forGetMasterData.subnational_for_coutry_lev_3[country]!='undefined')){
                                            //forGetMasterData.subnational_for_coutry[country] = {};
                                            forGetMasterData.subnational_for_coutry_lev_3[country][child_code_lev_3]=child_name_lev_3;
                                        }
                                        else{
                                            forGetMasterData.subnational_for_coutry_lev_3[country] = {};
                                            forGetMasterData.subnational_for_coutry_lev_3[country][child_code_lev_3]=child_name_lev_3;
                                        }
                                    }
                                }
                            }
                        }

                        forGetMasterData.datasource = host.options.datasource;

                        //console.log("MAP START!!!!")
                        //console.log(forGetMasterData)
                        //console.log(forGetMasterData.subnational);
                        //console.log(forGetMasterData.subnational_for_coutry);
                        //console.log(forGetMasterData.subnational_lev_3);
                        //console.log(forGetMasterData.subnational_for_coutry_lev_3);
                        //console.log("MAP END!!!!")

                        var mastertable_data = [];

                        var properties = {};
                        //console.log("Before update selectorDomain")
                        //console.log(mastertable_data)
                        // qd_controller_instance.update_selector_domain(host.options.fx_selector_6_b, mastertable_data, properties);

                        var payloadrestMasterData = JSON.stringify(forGetMasterData);
                        var payloadMap = JSON.stringify(forGetMasterData.subnational);
                        var payloadMap2 = JSON.stringify(forGetMasterData.subnational_for_coutry);
                        var payloadMap3 = JSON.stringify(forGetMasterData.subnational_lev_3);
                        var payloadMap4 = JSON.stringify(forGetMasterData.subnational_for_coutry_lev_3);

                        var type = host.options.subnational_selector_type;
                        //var subnationalKeys = forGetMasterData.subnational.keys();
                        //console.log(subnationalKeys)
                        //var subnationalLev3Keys = forGetMasterData.subnational_lev_3.keys();
                        //console.log(subnationalLev3Keys)

                        var count=0;
                        for(var code in forGetMasterData.subnational) {
                            var label = forGetMasterData.subnational[code];
                            var obj = {"value": type + "_" + code + "_Level2", "label": '' + label, "code" : code, "type": type};
                            mastertable_data[count] = obj;
                            count++;
                        }

                        //TO REMOVE GAUL 2 START
                        //for(var code in forGetMasterData.subnational_lev_3) {
                        //    var label = forGetMasterData.subnational_lev_3[code];
                        //    var obj = {"value": type + "_" + code + "_Level3", "label": '' + label, "code" : code, "type": type};
                        //    mastertable_data[count] = obj;
                        //    count++;
                        //}
                        //TO REMOVE GAUL 2 END

                        mastertable_data.sort(function (a, b) {
                            if (a.label < b.label)
                                return -1;
                            if (a.label > b.label)
                                return 1;
                            return 0;
                        });

                        //alert("no negative")
                        self.subnationalNegativeInfo(qd_controller_instance, host, item, mastertable_data);

                        var properties = {};
                        qd_controller_instance.update_selector_domain(host.options.fx_selector_6_b, mastertable_data, properties);
//                            }
//                            console.log("To get Subnational info START");
//                            console.log(mastertable_data)
//                            console.log("To get Subnational info END");
//
//                            //self.master_grid_creation(mastertable_data, self, host);
//                        },
//                        error : function(err,b,c) {
//                            alert(err.status + ", " + b + ", " + c);
//                        }
//                    });
                    }
                    else{
                        //No info in GAUL for the selected country
                        var mastertable_data = [];
                        var properties = {};
                       // alert("22")
                        qd_controller_instance.update_selector_domain(host.options.fx_selector_6_b, mastertable_data, properties);
                    }
                },
                error : function(err,b,c) {
                    alert(err.status + ", " + b + ", " + c);
                }});
    }

    HostDomainParser.prototype.subnationalNegativeInfo = function(qd_controller_instance, host, item, mastertable_data)
    {
        var item_country_code = item.originalItem.code;
        var country_code = ''+ item_country_code;
        var domainParser= this;
        $.ajax({
            type: 'GET',
            url: 'http://' + host.options.base_ip_address + ':' + host.options.base_ip_port + host.options.cplIdForCountry_url+"/"+host.options.datasource+"/"+country_code,
            dataType: 'json',

            success: function (response) {

                /* Convert the response in an object, i fneeded. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
                //alert("Subnational info on success!!!")
                //console.log(json)

                var cpl_id_list_String = '';
                if(json.length>1){
                    for (var i = 1; i < json.length; i++) {
                        cpl_id_list_String += ''+ json[i][0];
                        if(i<json.length-1){
                            cpl_id_list_String+=',';
                        }
                    }
                    //console.log("cpl_id_list_String = "+cpl_id_list_String);
                }

                //var cpl_id_list_String = "136";
                //var cpl_id_list_String = "374";
                //var cpl_id_list_String = "262,263,264,265,266,267,268,269,270,271,272,273,276,277,278,279,280,281,282,285,286,287,288,289,290,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,362,371,372,373,374,3124";
                var forGetMasterData = host.options.host_policy_data_object.voObjectConstruction();

                //var cpl_id_list_String="1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,143,144,145,146,147,148,3082,3083,3084,3085";
                //var cpl_id_list_String="2,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,5859,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,143,144,145,146,147,148,3082,3083,3084,3085";
                forGetMasterData.datasource = host.options.datasource;
                //console.log("cpl_id_list_String="+cpl_id_list_String)
                forGetMasterData.cpl_id = cpl_id_list_String;
                var payloadrestMasterData = JSON.stringify(forGetMasterData);

//                    var body =
//                    {
//                        "uid": "GAUL",
//                        "version": "2014",
//                        "levels" : 2
//                    }
                //Country
//                    var selecteditems = host.options.qd_instance.getSelectedItems(self.options.fx_selector_6);
//                    var country = self.options.host_utility_instance.selected_items_parser(1, selecteditems);
                //console.log(data.country_code)
                //var country_code =['12'];
                //var country_code =['37'];

                //Case Search
                //Case Query and Download

                $.ajax({
                    type: 'POST',
//                            url: ap_queryAndDownload.CONFIG.masterFromCplId_url,
                    url: 'http://'+host.options.base_ip_address+':'+host.options.base_ip_port+host.options.masterFromCplIdAndNegativeSubnational,
                    data : {"pdObj": payloadrestMasterData},

                    success : function(response) {
                        /* Convert the response in an object, i needed. */
                        var json = response;
                        if (typeof(response) == 'string')
                            json = $.parseJSON(response);
                        //console.log("subnationalInfo 3")
                        //var mastertable_data = new Array();
                        var subnationalCount = 0;

                        var type = host.options.subnational_selector_type;

                        var subnationalLabelArray = new Array();
                        var subnationalCodeArray = new Array();

                        for (var i = 0 ; i < json.length ; i++) {
                            var row = {};
                            for (var j = 0 ; j < json[i].length ; j++) {
                                if((json[i][j] == null)||(typeof json[i][j] == 'undefined')) {
                                    json[i][j]="";
                                }
                            }

                            var subnationalLabel = '';
                            var subnationalCode = '';

                            var index=0;
                            var count = 0;

                            //if((json[i][6]!= "n.a")&&(json[i][6].indexOf(",")>0)){
                            //
                            //    console.log(json[i][6]);
                            //    while(json[i][6].substring(index).indexOf(",")>0){
                            //        var commaIndex = json[i][6].substring(index).indexOf(",");
                            //        var sub_name = json[i][6].substring(index, commaIndex);
                            //        //console.log("if IN FOR sub_name = "+sub_name)
                            //        subnationalLabelArray.push(sub_name);
                            //        index = commaIndex+1;
                            //    }
                            //    subnationalLabelArray.push(json[i][6].substring(index));
                            //    subnationalCodeArray = json[i][5].split(",");
                            //}
                            //else{
                            //    subnationalLabel = json[i][6];
                            //    subnationalLabelArray.push(subnationalLabel);
                            //    subnationalCode = json[i][5];
                            //    subnationalCodeArray.push(subnationalCode);
                            //}

                            if((json[i][5]!= "n.a")&&(json[i][5].indexOf(",")>0)){

                                console.log(json[i][5]);
                                while(json[i][5].substring(index).indexOf(",")>0){
                                    var commaIndex = json[i][5].substring(index).indexOf(",");
                                    var sub_name = json[i][5].substring(index, commaIndex);
                                    //console.log("if IN FOR sub_name = "+sub_name)
                                    subnationalLabelArray.push(sub_name);
                                    index = commaIndex+1;
                                }
                                subnationalLabelArray.push(json[i][5].substring(index));
                                subnationalCodeArray = json[i][4].split(",");
                            }
                            else{
                                subnationalLabel = json[i][5];
                                subnationalLabelArray.push(subnationalLabel);
                                subnationalCode = json[i][4];
                                subnationalCodeArray.push(subnationalCode);
                            }

                            for(var z=0; z< subnationalLabelArray.length; z++){
                                var found=false;
                                if(subnationalCodeArray[z]!="NotFound"){
                                    var obj = {"value": type + "_" + subnationalCodeArray[z], "label": '' + subnationalLabelArray[z], "code" : subnationalCodeArray[z], "type": type};

                                    for(var iMasterdata=0; iMasterdata<mastertable_data.length; iMasterdata++)
                                    {
                                        var app = mastertable_data[iMasterdata];
                                        if(app.code == obj.code){
                                            found=true;
                                            break;
                                        }
                                    }
                                    if(found==false){
                                        //The subnational has to be inserted only if it's not in the list
                                        console.log("subnationalCount = "+subnationalCount + " ")
                                        console.log(obj)
                                        //mastertable_data[subnationalCount] = obj;
                                        mastertable_data.push(obj);
                                        subnationalCount++;
                                    }

                                    //mastertable_data[subnationalCount] = obj;
                                    //subnationalCount++;
                                }
                            }

                            mastertable_data.sort(function (a, b) {
                                if (a.label < b.label)
                                    return -1;
                                if (a.label > b.label)
                                    return 1;
                                return 0;
                            });
                        }

                        var properties = {};
                        qd_controller_instance.update_selector_domain(host.options.fx_selector_6_b, mastertable_data, properties);

                        //self.master_grid_creation(mastertable_data, self, host);
                    },
                    error : function(err,b,c) {
                        alert(err.status + ", " + b + ", " + c);
                    }
                });
            },

            error: function (err, b, c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    }

    HostDomainParser.prototype.subnationalInfo2 = function(qd_controller_instance, host, item)
    {
        var item_country_code = item.originalItem.code;
        var country_code = ''+ item_country_code;
        var domainParser= this;
        $.ajax({
            type: 'GET',
            url: 'http://' + host.options.base_ip_address + ':' + host.options.base_ip_port + host.options.cplIdForCountry_url+"/"+host.options.datasource+"/"+country_code,
            dataType: 'json',

            success: function (response) {

                /* Convert the response in an object, i fneeded. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
                //alert("Subnational info on success!!!")
                //console.log(json)

                var cpl_id_list_String = '';
                if(json.length>1){
                    for (var i = 1; i < json.length; i++) {
                        cpl_id_list_String += ''+ json[i][0];
                        if(i<json.length-1){
                            cpl_id_list_String+=',';
                        }
                    }
                    //console.log("cpl_id_list_String = "+cpl_id_list_String);
                }

                //var cpl_id_list_String = "136";
                //var cpl_id_list_String = "374";
                //var cpl_id_list_String = "262,263,264,265,266,267,268,269,270,271,272,273,276,277,278,279,280,281,282,285,286,287,288,289,290,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,362,371,372,373,374,3124";
                var forGetMasterData = host.options.host_policy_data_object.voObjectConstruction();

//                    var body =
//                    {
//                        "uid": "GAUL",
//                        "version": "2014",
//                        "levels" : 2
//                    }
                //Country
//                    var selecteditems = host.options.qd_instance.getSelectedItems(self.options.fx_selector_6);
//                    var country = self.options.host_utility_instance.selected_items_parser(1, selecteditems);
                //console.log(data.country_code)
                //var country_code =['12'];
                //var country_code =['37'];
                var country_code =[json[0]];

                //console.log("Country code = "+ country_code);
                var body = {};
                body.uid = "GAUL";
                body.version = "2014";
                body.codes = country_code;
                // body.levels = 2;

                var body2 = JSON.stringify(body);
                //Getting GAUL code
                //console.log("subnationalInfo start")
                $.ajax({
                    type: 'POST',
                    url: ''+host.options.codelist_url_2,
                    data : body2,
                    contentType: 'application/json',
                    dataType:'json',
//                            url: ''+host.options.codelist_url_2+host.options.gaulsubnationalLevel_url,
                    success : function(response) {
                        //console.log(response)
                        var json = response;
                        if (typeof(response) == 'string')
                            json = $.parseJSON(response);
                        var i=0;
                        //console.log("subnationalInfo 1")
                        //Subnational level 2
                        forGetMasterData.subnational = {};
                        //Subnational level 2
                        forGetMasterData.subnational_for_coutry = {};
                        //Subnational level 2
                        forGetMasterData.subnational_lev_3 = {};
                        //Subnational level 2
                        forGetMasterData.subnational_for_coutry_lev_3 = {};

                        //Country
                        forGetMasterData.country = {};

                        for(i=0; i<json.length;i++){
                            var country = json[i].code;
                            var country_title = json[i].title["EN"];
                            forGetMasterData.country[country]=country_title;
                            var children = json[i].children;
                            //Subnational level 2
                            for(var ichild = 0; ichild<children.length; ichild++){
                                var child = children[ichild];
                                var child_code = child.code;
                                var child_name = child.title['EN'];
                                forGetMasterData.subnational[child_code]=child_name;
                                //console.log("country = "+country);
                                if((forGetMasterData.subnational_for_coutry[country]!=null)&&(typeof forGetMasterData.subnational_for_coutry[country]!='undefined')){
                                    //forGetMasterData.subnational_for_coutry[country] = {};
                                    forGetMasterData.subnational_for_coutry[country][child_code]=child_name;
                                }
                                else{
                                    forGetMasterData.subnational_for_coutry[country] = {};
                                    forGetMasterData.subnational_for_coutry[country][child_code]=child_name;
                                }

                                //Check if there are children of the third level
                                var children_lev_3 = json[i].children[ichild].children;
                                //console.log(json[i].children[ichild])
                                if((children_lev_3!=null)&&(typeof children_lev_3 !="undefined")){
                                    for(var ichild_lev_3 = 0; ichild_lev_3<children_lev_3.length; ichild_lev_3++){
                                        var child_lev_3 = children_lev_3[ichild_lev_3];
                                        var child_code_lev_3 = child_lev_3.code;
                                        var child_name_lev_3 = child_lev_3.title['EN'];
                                        forGetMasterData.subnational_lev_3[child_code_lev_3]=child_name_lev_3;
                                        //console.log("country = "+country);
                                        if((forGetMasterData.subnational_for_coutry_lev_3[country]!=null)&&(typeof forGetMasterData.subnational_for_coutry_lev_3[country]!='undefined')){
                                            //forGetMasterData.subnational_for_coutry[country] = {};
                                            forGetMasterData.subnational_for_coutry_lev_3[country][child_code_lev_3]=child_name_lev_3;
                                        }
                                        else{
                                            forGetMasterData.subnational_for_coutry_lev_3[country] = {};
                                            forGetMasterData.subnational_for_coutry_lev_3[country][child_code_lev_3]=child_name_lev_3;
                                        }
                                    }
                                }
                            }
                        }

                        forGetMasterData.datasource = host.options.datasource;
                        //console.log("cpl_id_list_String="+cpl_id_list_String)
                        forGetMasterData.cpl_id = cpl_id_list_String;
                        var payloadrestMasterData = JSON.stringify(forGetMasterData);
                        var payloadMap = JSON.stringify(forGetMasterData.subnational);
                        var payloadMap2 = JSON.stringify(forGetMasterData.subnational_for_coutry);
                        var payloadMap3 = JSON.stringify(forGetMasterData.subnational_lev_3);
                        var payloadMap4 = JSON.stringify(forGetMasterData.subnational_for_coutry_lev_3);

                        //Case Search
                        //Case Query and Download
                        //console.log("url "+ap_queryAndDownload.CONFIG.masterFromCplId_url+ '/' + ap_queryAndDownload.CONFIG.datasource+ '/'+ ap_queryAndDownload.CONFIG.cpl_id_list[0]);
                        $.ajax({
                            type: 'POST',
//                            url: ap_queryAndDownload.CONFIG.masterFromCplId_url,
                            url: 'http://'+host.options.base_ip_address+':'+host.options.base_ip_port+host.options.masterFromCplIdAndSubnational,
                            data : {"pdObj": payloadrestMasterData, "map":payloadMap, "map2":payloadMap2, "map3":payloadMap3, "map4":payloadMap4},

                            success : function(response) {
                                /* Convert the response in an object, i needed. */
                                var json = response;
                                if (typeof(response) == 'string')
                                    json = $.parseJSON(response);

                                //console.log(json);

                                //console.log("subnationalInfo 3")
                                var mastertable_data = new Array();
                                var subnationalCount = 0;

                                var type = host.options.subnational_selector_type;

                                var subnationalLabelArray = new Array();
                                var subnationalCodeArray = new Array();

                                for (var i = 0 ; i < json.length ; i++) {
                                    var row = {};
                                    for (var j = 0 ; j < json[i].length ; j++) {
                                        if((json[i][j] == null)||(typeof json[i][j] == 'undefined')) {
                                            json[i][j]="";
                                        }
                                        switch(j)
                                        {
                                            case 0:
                                                //cpl_id[i] = json[i][j];
                                                row["CplId"] = json[i][j];
                                                break;
                                            //case 1:
                                            //    //cpl_code[i] = json[i][j];
                                            //    break;
                                            case 1:
                                                //commodity_id[i] = json[i][j];
                                                row["CommodityId"] = json[i][j];
                                                break;
                                            case 2:
                                                //country_code[i] = json[i][j];
                                                row["CountryCode"] = json[i][j];
                                                break;
                                            case 3:
//                                            country_name[i] = json[i][j];
                                                row["CountryName"] = json[i][j];
                                                break;
                                            case 4:
                                                //subnational_code[i] = json[i][j];
                                                row["SubnationalCode"] = json[i][j];
                                                break;
                                            case 5:
//                                            subnational_name[i] = json[i][j];
                                                row["SubnationalName"] = json[i][j];
                                                break;
                                            case 6:
                                                //commoditydomain_code[i] = json[i][j];
                                                row["CommodityDomainCode"] = json[i][j];
                                                break;
                                            case 7:
                                                //commoditydomain_name[i] = json[i][j];
                                                row["CommodityDomainName"] = json[i][j];
                                                break;
                                            case 8:
                                                //commodityclass_code[i] = json[i][j];
                                                row["CommodityClassCode"] = json[i][j];
                                                break;
                                            case 9:
                                                //commodityclass_name[i] = json[i][j];
                                                row["CommodityClassName"] = json[i][j];
                                                break;
                                            case 10:
                                                //policydomain_code[i] = json[i][j];
                                                row["PolicyDomainCode"] = json[i][j];
                                                break;
                                            case 11:
//                                            policydomain_name[i] = json[i][j];
                                                row["PolicyDomainName"] = json[i][j];
                                                break;
                                            case 12:
                                                //policytype_code[i] = json[i][j];
                                                row["PolicyTypeCode"] = json[i][j];
                                                break;
                                            case 13:
//                                            policytype_name[i] = json[i][j];
                                                row["PolicyTypeName"] = json[i][j];
                                                break;
                                            case 14:
                                                //policymeasure_code[i] = json[i][j];
                                                row["PolicyMeasureCode"] = json[i][j];
                                                break;
                                            case 15:
//                                            policymeasure_name[i] = json[i][j];
                                                row["PolicyMeasureName"] = json[i][j];
                                                break;
                                            case 16:
                                                //condition_code[i] = json[i][j];
                                                row["PolicyConditionCode"] = json[i][j];
                                                break;
                                            case 17:
//                                            condition[i] = json[i][j];
                                                row["PolicyCondition"] = json[i][j];
                                                break;
                                            case 18:
                                                //individualpolicy_code[i] = json[i][j];
                                                row["IndividualPolicyCode"] = json[i][j];
                                                break;
                                            case 19:
//                                            individualpolicy_name[i] = json[i][j];
                                                row["IndividualPolicyName"] = json[i][j];
                                                break;
                                        }
                                    }

                                    var subnationalLabel = '';
                                    var subnationalCode = '';

                                    var index=0;
                                    var count = 0;
                                    if((json[i][6]!= "n.a")&&(json[i][6].indexOf(",")>0)){

                                        while(json[i][6].substring(index).indexOf(",")>0){
                                            var commaIndex = json[i][6].substring(index).indexOf(",");
                                            var sub_name = json[i][6].substring(index, commaIndex);
                                            //console.log("if IN FOR sub_name = "+sub_name)
                                            subnationalLabelArray.push(sub_name);
                                            index = commaIndex+1;
                                        }
                                        //console.log("if OUT FOR json[i][6].substring(index) = "+json[i][6].substring(index))
                                        subnationalLabelArray.push(json[i][6].substring(index));
                                        subnationalCodeArray = json[i][5].split(",");
                                    }
                                    else{
                                        subnationalLabel = json[i][6];
                                        subnationalLabelArray.push(subnationalLabel);
                                        subnationalCode = json[i][5];
                                        subnationalCodeArray.push(subnationalCode);
                                        //console.log("else subnationalLabel "+subnationalLabel)
                                        //console.log("else subnationalCode "+subnationalCode)
                                    }

                                    for(var z=0; z< subnationalLabelArray.length; z++){
                                        var found=false;
                                        var obj = {"value": type + "_" + subnationalCodeArray[z], "label": '' + subnationalLabelArray[z], "code" : subnationalCodeArray[z], "type": type};

                                        for(var iMasterdata=0; iMasterdata<mastertable_data.length; iMasterdata++)
                                        {
                                            var app = mastertable_data[iMasterdata];
                                            if(app.code == obj.code){
                                                found=true;
                                                break;
                                            }
                                        }
                                        if(found==false){
                                            //The subnational has to be inserted only if it's not in the list
                                            mastertable_data[subnationalCount] = obj;
                                            subnationalCount++;
                                        }

                                        //mastertable_data[subnationalCount] = obj;
                                        //subnationalCount++;
                                    }

                                    mastertable_data.sort(function (a, b) {
                                        if (a.label < b.label)
                                            return -1;
                                        if (a.label > b.label)
                                            return 1;
                                        return 0;
                                    });

                                    var properties = {};

                                    qd_controller_instance.update_selector_domain(host.options.fx_selector_6_b, mastertable_data, properties);
                                }
                            },
                            error : function(err,b,c) {
                                alert(err.status + ", " + b + ", " + c);
                            }
                        });
                    },
                    error : function(err,b,c) {
                        alert(err.status + ", " + b + ", " + c);
                    }});
            },

            error: function (err, b, c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    }

    //Policy Type
    HostDomainParser.prototype.getDomainPolicyType = function(qd_controller_instance, selector_id, url_type_var, policy_domain_code, commodity_domain_code, host) {

        var domainParser= this;
        var self = host;
        var url_type = url_type_var.rest_url_type;
        var url_datasource = url_type_var.rest_url_datasource;
        $.ajax({
            type: 'GET',
            //url: 'http://localhost:8090/wds/rest/policyservice/commodityPolicyDomain/POLICY',
            url: 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + url_type + '/' + url_datasource + '/' + policy_domain_code + '/' + commodity_domain_code,
            dataType: 'json',

            success: function (response) {

                /* Convert the response in an object, i fneeded. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);

                var data = new Array();
                //-> Generic Component..PolicyType
                var type = qd_controller_instance.getSelector_domainType(selector_id);
                for (var i = 0; i < json.length; i++) {
                    var obj = {"value": type + "_" + json[i][0], "label": '' + json[i][1], "code" : json[i][0], "type": type};
                    data[i] = obj;
                }

                //For commodity and country tab there is one source element in this array
                var sources = new Array();
                sources[0] = data;
                qd_controller_instance.update_selector_domain(selector_id, data);

                //Get Policy Measure List for each Policy Type
                self.options.policy_measure_calls = data.length;
                self.options.policy_measure_actual_calls= 0;
                self.options.policy_measure_actual_data =[];
                var policy_measure_selector_id = self.options.fx_selector_4;
                for (var i = 0; i < data.length; i++) {
                    var obj_code = data[i].code;
                    rest_url = {'rest_url_type':self.options.codelist_url_PolicyType, 'rest_url_specific_code': obj_code};
                    self.options.host_domain_parser.getDomainPolicyMeasure(qd_controller_instance, policy_measure_selector_id, rest_url, self);
                    //self.options.host_domain_parser.getDomain(qd_controller_instance, policy_measure_selector_id, rest_url, self);
                }
            },

            error: function (err, b, c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    }

    HostDomainParser.prototype.getDomainYear = function(qd_controller_instance, selector_id, url_type_var, self) {

        var url_type = url_type_var.rest_url_type;
        var url_datasource = url_type_var.rest_url_datasource;

        $.ajax({
            type: 'GET',
            url: 'http://'+self.options.base_ip_address +':'+self.options.base_ip_port + url_type + '/' + url_datasource,
            dataType: 'json',

            success: function (response) {

                /* Convert the response in an object, if needed. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
                //if it's true there is at least one value in the end_date column that is null
                var end_date_null = json[0][0];

                var start_date_dd = json[1][1];
                var start_date_mm = json[1][2];
                var start_date_yy = json[1][3];
                var final_start_date = start_date_dd+"/"+start_date_mm+"/"+start_date_yy;
                var start_date_dd_int = parseInt(start_date_dd);
                var start_date_mm_int = parseInt(start_date_mm)-1;
                var start_date_yy_int = parseInt(start_date_yy);
                //End date
                var end_date = json[1][0];
                var end_date_dd = json[1][4];
                var end_date_mm = json[1][5];
                var end_date_yy = json[1][6];
                var end_date_dd_today = "";
                var end_date_mm_today = "";
                var end_date_yy_today = "";
                var end_date_dd_int = '';
                var end_date_mm_int = '';
                var end_date_yy_int = '';

                var final_end_date = "";
                if(end_date_null == 'true')
                {
                    //Means that there is also the date = null -> actual date
                    //Compare actual date with the max date to see wich is the best date
                    var today = new Date();
                    end_date_dd_today = today.getDate();
                    end_date_mm_today = today.getMonth()+1; //January is 0!
                    end_date_yy_today = today.getFullYear();
                    if((end_date != null)&&(typeof end_date != 'undefined'))
                    {
                        //Comparing Max end_date with today date
                        //Which is the last?
                        var best_date = self.options.host_utility_instance.data_compare(end_date_dd, end_date_mm, end_date_yy, end_date_dd_today, end_date_mm_today, end_date_yy_today);
                        if(best_date=='first')
                        {
                            final_end_date = end_date_dd+"/"+end_date_mm+"/"+end_date_yy;
                            self.options.slider_end_date_dd = end_date_dd;
                            self.options.slider_end_date_mm = end_date_mm;
                            self.options.slider_end_date_yy = end_date_yy;
                            end_date_dd_int = parseInt(end_date_dd);
                            end_date_mm_int = parseInt(end_date_mm)-1;
                            end_date_yy_int = parseInt(end_date_yy);
                        }
                        else if(best_date=='second')
                        {
                            final_end_date = end_date_dd_today+"/"+end_date_mm_today+"/"+end_date_yy_today;
                            self.options.slider_end_date_dd = end_date_dd_today;
                            self.options.slider_end_date_mm = end_date_mm_today;
                            self.options.slider_end_date_yy = end_date_yy_today;
                            end_date_dd_int = parseInt(end_date_dd_today);
                            end_date_mm_int = parseInt(end_date_mm_today)-1;
                            end_date_yy_int = parseInt(end_date_yy_today);
                        }
                    }
                    else{
                        final_end_date = end_date_dd_today+"/"+end_date_mm_today+"/"+end_date_yy_today;
                        self.options.slider_end_date_dd = end_date_dd_today;
                        self.options.slider_end_date_mm = end_date_mm_today;
                        self.options.slider_end_date_yy = end_date_yy_today;
                        end_date_dd_int = parseInt(end_date_dd_today);
                        end_date_mm_int = parseInt(end_date_mm_today)-1;
                        end_date_yy_int = parseInt(end_date_yy_today);
                    }
                }
                else
                {
                    //End_date column contains only not null values
                    //end_date = Max end_date
                    final_end_date = end_date_dd+"/"+end_date_mm+"/"+end_date_yy;
                    self.options.slider_end_date_dd = end_date_dd;
                    self.options.slider_end_date_mm = end_date_mm;
                    self.options.slider_end_date_yy = end_date_yy;
                    end_date_dd_int = parseInt(end_date_dd);
                    end_date_mm_int = parseInt(end_date_mm)-1;
                    end_date_yy_int = parseInt(end_date_yy);
                }

                self.options.slider_start_date = final_start_date;
                self.options.slider_start_date_dd = start_date_dd;
                self.options.slider_start_date_mm = start_date_mm;
                self.options.slider_start_date_yy = start_date_yy;
                self.options.slider_end_date = final_end_date;

                if((self.options.button_preview_action_type=="preview")||(self.options.button_preview_action_type=="searchEditPolicy")){
                    //This has been added to force the start date to a specific year
                    //Removing this line the value is taken from the db
                    //This happen for the Query and Download page
                    start_date_yy = self.options.slider_start_yy_default;
                    self.options.slider_start_date_yy = start_date_yy;
                }

                //Setting Information For the Years Slider
                var properties = {"bounds" : {min: new Date(start_date_yy, ''+start_date_mm_int, start_date_dd), max: new Date(end_date_yy, ''+end_date_mm_int, end_date_dd)}, "formatter" :function(val){
                    var date2 = new Date(val);
                    var days = date2.getDate(),
                        month = date2.getMonth() + 1,
                        year = date2.getFullYear();
                   // return days + "/" + month + "/" + year;
                    return ""+month + "/" + year;
                }, "left_label_title": start_date_yy, "right_label_title": end_date_yy};

                //Classic Years
                var start_date_yy_int = parseInt(start_date_yy);
                var end_date_yy_int = parseInt(end_date_yy);

                //data = [{value:tabNameCode[0]+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[0]+")"}];
                var count = 0;
                var data =[];
                //-> Generic Component..Year
                var type = qd_controller_instance.getSelector_domainType(selector_id);
                for(var i=start_date_yy_int; i<=end_date_yy_int; i++)
                {
//                    data[count]={value:tabNameCode[0]+"_"+count, label: ''+i};
                    var obj = {"value": type , "label": '' + i};
                    data[count] = obj;
                    count++;
                }

                //For year tab there is one source element in this array
                var sources = new Array();
                sources[0] = data;
                qd_controller_instance.update_selector_domain(selector_id, data, properties);
            },

            error: function (err, b, c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    }

    //Disable the elements
    //This function is called when the user selects a Policy Type
    HostDomainParser.prototype.listbox_element_disable = function(qd_controller_instance, selected_items_selector_id, domain_selector_id, select_first_element) {
        //The first Policy Type has to be selected
        var fx_selector_3_selected_item = qd_controller_instance.getSelectedItems(selected_items_selector_id);

        if ((fx_selector_3_selected_item != null) && (typeof fx_selector_3_selected_item != 'undefined') && (fx_selector_3_selected_item.length > 0)) {
            //Disable the Policy Measures that don't belong to the Selected Policy Type
            var fx_selector_4_domain = qd_controller_instance.getSelector_domain(domain_selector_id);
            if ((fx_selector_4_domain != null) && (typeof fx_selector_4_domain != 'undefined') && (fx_selector_4_domain.length > 0)) {
                //Loop on the domain to select the Policy Measures that have as father the Selected Policy Type
                //Array with the index of the elements to disable
                var properties_fx_selector_4_domain = [];
                var count = 0;
                var first_elem_index = 0;
                var first_elem_index_found = false;
                for (var iMeasure = 0; iMeasure < fx_selector_4_domain.length; iMeasure++) {
                    var item_parent_code = fx_selector_4_domain[iMeasure].parent_code;
                    if ((item_parent_code != null) && (typeof item_parent_code != 'undefined') && (item_parent_code != fx_selector_3_selected_item[0].originalItem.code)) {
                        properties_fx_selector_4_domain[count] = iMeasure;
                        count++;
                    }
                    else{
                        if(!first_elem_index_found){
                            first_elem_index = iMeasure;
                            first_elem_index_found = true;
                        }
                    }
                }
                //Disable the items
                qd_controller_instance.disableItems(domain_selector_id, properties_fx_selector_4_domain);
                //Select first element of the enabled policy measure
                if((select_first_element)&&(first_elem_index_found)){
                    var properties_to_select = [];
                    properties_to_select.push(first_elem_index);
                    qd_controller_instance.update_selector_selection(domain_selector_id, properties_to_select, true);
                }
            }
        }
    }

    //Enable and Disable the elements
    //This function is called after the getDomain for the Policy Measure selector
    HostDomainParser.prototype.listbox_element_enable_and_disable = function(qd_controller_instance, selected_items_selector_id, domain_selector_id, select_first_element, fx_selector_4_selected_item) {
        //Ask for the items selected in the Policy Type list box
        var fx_selector_3_selected_item = qd_controller_instance.getSelectedItems(selected_items_selector_id);
        var item_codes = [];
        if ((fx_selector_3_selected_item != null) && (typeof fx_selector_3_selected_item != 'undefined') && (fx_selector_3_selected_item.length > 0)) {
            //Creation of the Policy Types code Array
            for (var iType = 0; iType < fx_selector_3_selected_item.length; iType++) {
                var code = fx_selector_3_selected_item[iType].originalItem.code;
                item_codes.push(code);
            }
            var fx_selector_4_domain = qd_controller_instance.getSelector_domain(domain_selector_id);
            if ((fx_selector_4_domain != null) && (typeof fx_selector_4_domain != 'undefined') && (fx_selector_4_domain.length > 0)) {
                //Array with the index of the elements to disable
                var properties_to_disable = [];
                var properties_to_enable = [];
                var first_elem_index = 0;
                var first_elem_index_found = false;
                for (var iMeasure = 0; iMeasure < fx_selector_4_domain.length; iMeasure++) {
                    var item_parent_code = fx_selector_4_domain[iMeasure].parent_code;
                    //alert(item_parent_code)
                    if ((item_parent_code != null) && (typeof item_parent_code != 'undefined') && ($.inArray(item_parent_code, item_codes )!=-1)) {
                       // alert(first_elem_index_found)
                        if(!first_elem_index_found){
                            first_elem_index = iMeasure;
                            first_elem_index_found = true;
                           // alert("IN")
                        }
                        properties_to_enable.push(iMeasure);
                    }
                    else{
                        properties_to_disable.push(iMeasure);
                    }
                }
            }

            //Disable the items
            //alert("properties_to_disable")
           // console.log(properties_to_disable)
            qd_controller_instance.disableItems(domain_selector_id, properties_to_disable);

            //Enable the items
            qd_controller_instance.enableItems(domain_selector_id, properties_to_enable);

            //Unselect the items
            qd_controller_instance.update_selector_selection(domain_selector_id, properties_to_disable, false);
            //console.log("select_first_element= "+select_first_element)
            //console.log("first_elem_index_found= "+first_elem_index_found)
            if((select_first_element)&&(first_elem_index_found)){
                var fx_selector_4_new_selection = qd_controller_instance.getSelectedItems(domain_selector_id);
                //if((fx_selector_4_selected_item!=null)&&(typeof fx_selector_4_selected_item!= "undefined")&&(fx_selector_4_selected_item.length>0)){
                if((fx_selector_4_new_selection!=null)&&(typeof fx_selector_4_new_selection!= "undefined")&&(fx_selector_4_new_selection.length>0)){
                    //One Policy Measure in the list has been already clicked....
                }
                else{
                    //Select the first Policy Measure
                    var properties_to_select = [];
                    properties_to_select.push(first_elem_index);
                    qd_controller_instance.update_selector_selection(domain_selector_id, properties_to_select, true);
                }
            }
        }
        else{
            //If there are not Selected Policy Type...disable everything
            var fx_selector_4_domain = qd_controller_instance.getSelector_domain(domain_selector_id);
            if ((fx_selector_4_domain != null) && (typeof fx_selector_4_domain != 'undefined') && (fx_selector_4_domain.length > 0)) {
                //Array with the index of the elements to disable
                var properties_to_disable = [];
                for (var iMeasure = 0; iMeasure < fx_selector_4_domain.length; iMeasure++) {
                    var item_parent_code = fx_selector_4_domain[iMeasure].parent_code;
                    if ((item_parent_code != null) && (typeof item_parent_code != 'undefined')) {
                        properties_to_disable.push(iMeasure);
                    }
                }
                //Disable the items
                qd_controller_instance.disableItems(domain_selector_id, properties_to_disable);
                //Unselect the items
                qd_controller_instance.update_selector_selection(domain_selector_id, properties_to_disable, false);
            }
        }
    }

    //Unselect the elements
    //This is used when the "Clear All" button is clicked
    HostDomainParser.prototype.listbox_element_unselect = function(qd_controller_instance, tounselect_items_selector_id) {

        //All the items are unselected
        var fx_selector_selected_item = qd_controller_instance.getSelectedItems(tounselect_items_selector_id);
        var index_array= [];
        for(var i=0; i< fx_selector_selected_item.length; i++){
            index_array[i] = fx_selector_selected_item[i].index;
        }
        //console.log("Before clear all ")
        //console.log(fx_selector_selected_item)
        qd_controller_instance.update_selector_selection(tounselect_items_selector_id, index_array, false);

    }

//    HostDomainParser.prototype.listbox_country_element_enable_and_disable= function(qd_controller_instance, selected_items_selector_id, domain_selector_id) {
    HostDomainParser.prototype.listbox_country_element_enable_and_disable= function(qd_controller_instance, selected_commodity_domain_selector_id, selected_policy_domain_selector_id, selected_country_selector_id, host, select_first_element) {
        //Ask for the items selected in the Commodity Domain Radio Button
//        var fx_selector_3_selected_item = qd_controller_instance.getSelectedItems(selected_items_selector_id);
        var fx_selector_1_selected_item = qd_controller_instance.getSelectedItems(selected_commodity_domain_selector_id);

        var first_elem_index_found = false;
        var combination_found = false;
        if((fx_selector_1_selected_item!=null)&&(typeof fx_selector_1_selected_item!="undefined")&&(fx_selector_1_selected_item.code !=null)&&(typeof fx_selector_1_selected_item.code != "undefined")&&(fx_selector_1_selected_item.code == host.options.commodity_domain_agricultural))
        {
            //Ask for the items selected in the Policy Domain Radio Button
            var fx_selector_2_selected_item = qd_controller_instance.getSelectedItems(selected_policy_domain_selector_id);

            if((fx_selector_2_selected_item!=null)&&(typeof fx_selector_2_selected_item!="undefined")&&(fx_selector_2_selected_item.code !=null)&&(typeof fx_selector_2_selected_item.code != "undefined")&&(fx_selector_2_selected_item.code == host.options.policy_domain_domestic))
            {
               //Commodity is Agricultural and Policy is Domestic
                combination_found = true;

                var properties_to_disable = [];
                var properties_to_enable = [];

                //Get the countries domain
                var fx_selector_6_domain = qd_controller_instance.getSelector_domain(selected_country_selector_id);
                if((fx_selector_6_domain!=null)&&(typeof fx_selector_6_domain!='undefined'))
                {
                    for (var iCountry = 0; iCountry < fx_selector_6_domain.length; iCountry++) {
                        var item_code = fx_selector_6_domain[iCountry].code;
                        if ((item_code != null) && (typeof item_code != 'undefined') && ($.inArray(item_code, host.options.country_agricultural_domestic_codes)!=-1)) {
                            properties_to_enable.push(iCountry);
                            first_elem_index_found = true;
                        }
                        else{
                            properties_to_disable.push(iCountry);
                        }
                    }
                }
                //Disable some countries
                qd_controller_instance.disableItems(selected_country_selector_id, properties_to_disable);

                //Enable some countries
                qd_controller_instance.enableItems(selected_country_selector_id, properties_to_enable);

                //Unselect the items
                qd_controller_instance.update_selector_selection(selected_country_selector_id, properties_to_disable, false);

                if((select_first_element)&&(first_elem_index_found)){
                    var properties_to_select = [];
                    properties_to_select.push(properties_to_enable[0]);
                    qd_controller_instance.update_selector_selection(selected_country_selector_id, properties_to_select, true);
                }
            }
        }

        if(!combination_found)
        {
            //Commodity is NOT Agricultural and Policy is NOT Domestic
            //All the countries have to be enabled
            //Get the countries domain
            var properties_to_enable = [];
            var fx_selector_6_domain = qd_controller_instance.getSelector_domain(selected_country_selector_id);
            if((fx_selector_6_domain!=null)&&(typeof fx_selector_6_domain!='undefined'))
            {
                for (var iCountry = 0; iCountry < fx_selector_6_domain.length; iCountry++) {
                    properties_to_enable.push(iCountry);
                }
            }
            qd_controller_instance.enableItems(selected_country_selector_id, properties_to_enable);

            //Unselect the items
            qd_controller_instance.update_selector_selection(selected_country_selector_id, properties_to_enable, false);
            var properties_to_select = [];
            properties_to_select.push(0);
            qd_controller_instance.update_selector_selection(selected_country_selector_id, properties_to_select, true);
        }
    }

    HostDomainParser.prototype.createCommodityInfoWindow = function(qd_instance, selectorId){
        $('#window').jqxWindow({showCollapseButton: true, maxHeight: 400, maxWidth: 700, minHeight: 200, minWidth: 200, height: 300, width: 500,
            initContent: function () {
                $('#window').jqxWindow('focus');

            }
        });
        $('#window').jqxWindow('open');
        console.log("createCommodityInfoPopup")
        console.log(selectorId);
    }

    HostDomainParser.prototype.createCommodityInfoPopup = function(qd_instance, selectorItem, host){
        console.log(selectorItem)
        //var value = selectorItem[0].originalItem.value;
        var value = selectorItem.changed_item.value;
        var commodityId = value.substring(value.indexOf("CommodityDetail_COMMODITYID:")+28, value.indexOf("_HSCODE"));
        var data = ap_policyDataObject.init();
        data.datasource = host.options.datasource;
        //data.commodity_id = "1951";
        data.commodity_id = commodityId;

        //var grid = qd_instance.getSelector(self.options.fx_selector_5_b);
        //console.log(grid.getSelectedRows())

        var payloadrest = JSON.stringify(data);
        //alert("Before Post!!!")
        $.ajax({

            type: 'POST',
            url: 'http://'+host.options.base_ip_address +':'+host.options.base_ip_port + host.options.sharedGroupInfo_url,
            data: {"pdObj": payloadrest},

            success: function (response) {

                console.log(response)

                var sharedGroupTable ="";
                if((response!=null)&&(typeof response!="undefined")&&(response.length)>0){
                    var sharedGroupTable = '<div>Shared Group Information</div><table cellpadding=”3″ style="width:100%">';
                    sharedGroupTable += '<tr><td>Commodity Id</td><td>Shared Group Code</td><td>HS Code</td><td>HS Version</td><td>HS Suffix</td><td>Short Description</td><td>Description</td></tr>';
                    var length = response.length;
                    for(var i=0; i< length; i++){
                        sharedGroupTable += '<tr><td align="center">'+response[i][0]+'</td><td align="center">'+response[i][1]+'</td><td align="center">'+response[i][2]+'</td><td align="center">'+response[i][4]+'</td><td align="center">'+response[i][3]+'</td><td align="center">'+response[i][5]+'</td><td align="center">'+response[i][6]+'</td></tr>';
                    }
                    sharedGroupTable += '</table>';
                }
                console.log(sharedGroupTable)


                //CommodityDetail_COMMODITYID:9_HSCODE:100590_HSSUFFIX:_HSVERSION:HS2007_DESCRIPTION:Maize (corn). - Other._SHORTDESCRIP:Maize (corn)

                var hsCode = value.substring(value.indexOf("_HSCODE:")+8, value.indexOf("_HSSUFFIX"));
                var hsSuffix = value.substring(value.indexOf("_HSSUFFIX:")+10, value.indexOf("_HSVERSION:"));
                var hsVersion = value.substring(value.indexOf("_HSVERSION:")+11, value.indexOf("_DESCRIPTION:"));
                var description = value.substring(value.indexOf("_DESCRIPTION:")+13, value.indexOf("_SHORTDESCRIP:"));
                var shortDescription = value.substring(value.indexOf("_SHORTDESCRIP:")+14);
                //console.log("Before Value")
                //console.log(value)
                var htmlTable = '<table style="width:100%">';
                htmlTable += '<tr><td>Commodity Id</td><td>'+commodityId+'</td></tr>';
                htmlTable += '<tr><td>HS Code</td><td>'+hsCode+'</td></tr>';
                htmlTable += '<tr><td>HS Version</td><td>'+hsVersion+'</td></tr>';
                htmlTable += '<tr><td>HS Suffix</td><td>'+hsSuffix+'</td></tr>';
                htmlTable += '<tr><td>Short Description</td><td>'+shortDescription+'</td></tr>';
                htmlTable += '<tr><td>Description</td><td>'+description+'</td></tr>';
                htmlTable += '</table>';

                if((sharedGroupTable!=null)&&(typeof sharedGroupTable!="undefined")&&(sharedGroupTable.length)>0){
                    //Add this information to the main html table
                    htmlTable += '<br>'+sharedGroupTable;
                    console.log("in !sharedGroupTable")
                }
                $('#commodityInfo').on('shown.bs.modal', function () {
                    $('#commodityInfoTitle').html("Commodity Details");
                    $('#commodityInfoContent').html(htmlTable);
                console.log(htmlTable)
                })

                //$('#windowContent').html(htmlTable);
                //$('#myModal').on('show.bs.modal', function () {
                //    alert("on show event")
                //})

                //$('#window').jqxWindow({showCollapseButton: true, maxHeight: 400, maxWidth: 700, minHeight: 200, minWidth: 200, height: 300, width: 500, isModal: true,
                //    initContent: function () {
                //        // var commodity_info = "<div id='info_button_content2'>"+value+"<div>";
                //        // $('#info_button_content').html(commodity_info);
                //        $('#windowHeaderTitle').html('Commodity Information');
                //        $('#windowContent').html(htmlTable);
                //        $('#window').jqxWindow('focus');
                //        qd_instance.options.window_info_done = true;
                //    }
                //});
                //
                //if(qd_instance.options.window_info_done){
                //    // var commodity_info = "<div id='info_button_content2'>"+value+"<div>";
                //    // $('#info_button_content').html(commodity_info);
                //    $('#windowContent').html(htmlTable);
                //    $('#window').jqxWindow('focus');
                //}
                //$('#window').jqxWindow('open');
            },
            error : function(err,b,c) {
            alert(err.status + ", " + b + ", " + c);
        }
    });
    }

    HostDomainParser.prototype.createCommodityAddPopup_buttonEvents = function(qd_instance, countrySelector, policyDomainSelector, commodityClassSelector, policyMeasureSelector, q_a_d_instance){
        var self = this;
        $('#CommodityCancel').click(function(e){
            self.clearElementsInCommodityPopup();
        });

        $('#CommoditySave').click(function(e){
            //var newCondition = document.getElementById("new_condition").value;
            console.log("Value in newCommodity")
            if(self.options.singleCommodityPopup){
                var result = {};
                result.hsCode= false;
                result.description= false;
                result.shortDescription= false;
                console.log("singleCommodityPopup start ")
                var hsCode = document.getElementById("hsCode_input").value;
                console.log("hsCode = "+hsCode)
                var index = $("#hsVersion_input").jqxComboBox('getSelectedIndex');
                var hsVersion = $("#hsVersion_input").jqxComboBox('getItem', index);
                if((hsVersion!=null)&&(typeof hsVersion!='undefined')){
                    hsVersion = hsVersion.label;
                    console.log(hsVersion)
                }
                else{
                    console.log(hsVersion)
                }
                console.log("hsVersion = "+hsVersion)
                var description = document.getElementById("description_input").value;
                console.log("description = "+description)
                var shortDescription = document.getElementById("shortDescription_input").value;
                console.log("shortDescription = "+shortDescription)
                index = $("#commodityClass_input").jqxComboBox('getSelectedIndex');
                var commodityClass = $("#commodityClass_input").jqxComboBox('getItem', index);
                console.log(commodityClass);
                //console.log("commodityClass = "+commodityClass)
                var commodityClassObj = {};
                if((commodityClass!=null)&&(typeof commodityClass!='undefined')){
                    commodityClassObj = {code:commodityClass.value, label:commodityClass.label};
                }
                console.log(commodityClassObj)

                var selecteditem_country = qd_instance.getSelectedItems(countrySelector);
                console.log("SELECTED COUNTRY 1!")
                console.log(selecteditem_country)
                var country = {};
                if((selecteditem_country!=null)&&(typeof selecteditem_country!='undefined')&&(selecteditem_country.length)){
                    var value = selecteditem_country[0].value;
                    if((value!=null)&&(typeof value!='undefined')&&(value.length)){
                        var index = value.indexOf('_')+1;
                        value = value.substring(index);
                        country.code = value;
                        country.label = selecteditem_country[0].label;
                    }
                }
                console.log("SELECTED COUNTRY!")
                console.log(country)

                var selecteditem_policyDomain = qd_instance.getSelectedItems(policyDomainSelector);
                console.log(selecteditem_policyDomain)
                //Hs code is mandatory for Policy Domain TRADE(1) while is OPTIONAL for Policy Domain DOMESTIC(2)
                var errorMsg = false;
                if(selecteditem_policyDomain.code!=2){
                    if((hsCode!=null)&&(typeof hsCode!='undefined')&&(hsCode.length>0)){
                        result.hsCode= true;
                    }
                }
                else{
                    result.hsCode= true;
                }
                if((description!=null)&&(typeof description!= 'undefined')&&(description.length>0)){
                    result.description = true;
                }
                if((shortDescription!=null)&&(typeof shortDescription!= 'undefined')&&(description.length>0)){
                    result.shortDescription = true;
                }

                if((result.hsCode)&&(result.description)&&(result.shortDescription)){
                    //No error ... the commodity can be saved
                    var data = ap_policyDataObject.init();
                    data.datasource = ap_util_variables.CONFIG.datasource;
                    data.commodity_class_code = ''+commodityClassObj.code;
                    data.commodity_class_name = commodityClassObj.label;
                    data.country_code = ''+country.code;
                    data.country_name = country.label;
                    data.hs_code = ''+hsCode;
                    data.hs_version = hsVersion;
                    data.description = description;
                    data.short_description = shortDescription;
                    data.shared_group_code = 'NULL';
                    if(sessionStorage.getItem("superUser")=="OECD"){
                        data.loggedUser = "OECD";
                    }
                    else{
                        data.loggedUser = q_a_d_instance.options.logged_user_code;
                    }
                    data.saveAction = "ADD";
                    //objToSave.policyN = options.policyN;
                    //objToSave.policyN_1 = options.policyN_1;
                    console.log(data)

                    var payloadrest = JSON.stringify(data);

                    $.ajax({
                        type: 'POST',
                        url : 'http://'+ap_util_variables.CONFIG.base_ip_address+':'+ap_util_variables.CONFIG.base_ip_port+ap_util_variables.CONFIG.createNewSingleCommodity,
                        data: {"pdObj": payloadrest},

                        success : function(response) {
                            self.clearElementsInCommodityPopup();
                            //Reload the list in the Commodity Selector
                            q_a_d_instance.reloadCommodityList(q_a_d_instance, qd_instance);
                            $('#commodityAdd').modal('hide');
                        },
                        error : function(response) {
                            console.log(response)
                        }});
                }
                else{
                    $("#singleCommodityErrorMsg").text("Please fill the fields: HS Code, Description and Short Description.");
                }
            }
            else{
                console.log("sharedGroupPopup start ")
                var descriptionSharedGroup = document.getElementById("sharedGroupDescription_input").value;
                console.log("descriptionSharedGroup = "+descriptionSharedGroup)
                var shortDescriptionSharedGroup = document.getElementById("sharedGroupShortDescription_input").value;
                console.log("shortDescriptionSharedGroup = "+shortDescriptionSharedGroup)

                var selectedrowindexes = $('#sharedGroupCommodityList_grid').jqxGrid('selectedrowindexes');
                var sharedGroupGridData = {};
                var commodityClassCode_allCommodities = [];
                var commodityClassName_allCommodities = [];
                var commodityClassName_allCommoditiesArray = [];
                if((selectedrowindexes!=null)&&(selectedrowindexes!='undefined')&&(selectedrowindexes.length>0)){
                    console.log(selectedrowindexes)
                    for(var i=0; i<selectedrowindexes.length; i++){
                        var data = $('#sharedGroupCommodityList_grid').jqxGrid('getrowdata', selectedrowindexes[i]);
                        //console.log(data)
                        var obj = {hsCode: data.code, hsVersion:data.hsVersion, shortDescription:data.shortDescription, originalHsCode:data.originalHsCode, originalHsVersion:data.originalHsVersion, originalHsSuffix: data.originalHsSuffix, commodityId: data.commodityId, commodityClassCode: data.commodityclassCode, commodityClassName: data.commodityclassName };
                        commodityClassCode_allCommodities.push(data.commodityclassCode);
                        commodityClassName_allCommodities.push(data.commodityclassName);
                        sharedGroupGridData[i]= obj;
                    }
                    console.log(commodityClassCode_allCommodities)
                    console.log(commodityClassName_allCommodities)

                    var iComm =0;
                    var sgCommodityClassName = '';
                    var sgCommodityClassCode = '';
                    sgCommodityClassName = commodityClassName_allCommodities[0];
                    //commodityClassName_allCommoditiesArray[0] = sgCommodityClassName.trim().split("+");
                    var firstElement= [];
                    firstElement = sgCommodityClassName.trim().split("+");
                    var app= [];
                    for(iComm= 1; iComm<commodityClassName_allCommodities.length; iComm++){
                        app = commodityClassName_allCommodities[iComm].trim().split("+");
                        for(var iApp=0; iApp<app.length; iApp++){
                            var appCommodity = app[iApp];
                            var found = false;
                            for(var iFirst=0; iFirst<firstElement.length; iFirst++){
                                var firstEl = firstElement[iFirst];
                                if(firstEl.trim()==appCommodity.trim()){
                                    found = true;
                                    break;
                                }
                            }
                            if(!found){
                                firstElement.push(appCommodity.trim());
                            }
                        }
                    }
                    firstElement.sort();
                }

                var i= 0, j=0;
                // Get the keys
                console.log(ap_util_variables.CONFIG.commodityClassInArray)
                var keys = Object.keys(ap_util_variables.CONFIG.commodityClassInArray);
                console.log(keys);
                //var keys = Object.keys(ap_util_variables.CONFIG.commodityClassInArray)[0];
                for(i = 0; i<keys.length; i++){
                    console.log(keys[i])
                    var commodityClass = ap_util_variables.CONFIG.commodityClassInArray[keys[i]];
                    //console.log("commodityClass")
                    //console.log(commodityClass)
                    //console.log("firstElement")
                    //console.log(firstElement)
                    if(commodityClass.length==firstElement.length){
                        for(j = 0; j<firstElement.length; j++){
                            var firstElementI = firstElement[j];
                            //console.log("commodityClass[j]= "+commodityClass[j]+" firstElementI= "+firstElementI)
                            if(commodityClass[j]!=firstElementI){
                                break;
                            }
                        }
                    }

                    if(j<firstElement.length){
                        console.log("Not found")
                        //Not found
                    }
                    else{
                        //Found
                        console.log("Found")
                        break;
                    }
                }
                if(i<keys.length){
                    sgCommodityClassName = ap_util_variables.CONFIG.commodityClassInArray_originalName[keys[i]];
                    sgCommodityClassCode = keys[i];
                }
                console.log("sharedGroupGridData");
                console.log(sharedGroupGridData);

                if((descriptionSharedGroup!=null)&&(typeof descriptionSharedGroup!='undefined')&&(descriptionSharedGroup.length>0)&&(shortDescriptionSharedGroup!=null)&&(typeof shortDescriptionSharedGroup!='undefined')&&(shortDescriptionSharedGroup.length>0)&&(sharedGroupGridData!=null)&&(typeof sharedGroupGridData!='undefined')){
                    var data = ap_policyDataObject.init();
                    data.datasource = ap_util_variables.CONFIG.datasource;
                    data.commodity_class_code = ''+sgCommodityClassCode;
                    data.commodity_class_name = ''+sgCommodityClassName;

                    var selecteditem_country = qd_instance.getSelectedItems(countrySelector);
                    var country = {};
                    if((selecteditem_country!=null)&&(typeof selecteditem_country!='undefined')&&(selecteditem_country.length)){
                        var value = selecteditem_country[0].value;
                        if((value!=null)&&(typeof value!='undefined')&&(value.length)){
                            var index = value.indexOf('_')+1;
                            value = value.substring(index);
                            country.code = value;
                            country.label = selecteditem_country[0].label;
                        }
                    }

                    data.country_code = ''+country.code;
                    data.country_name = country.label;
                    data.description = descriptionSharedGroup;
                    data.short_description = shortDescriptionSharedGroup;
                    //Shared Group Code Creation
                    var countryIsoCode = ap_util_functions.countryToISO3conversion({code: parseInt(data.country_code)});

                    var selecteditem_policyMeasure = qd_instance.getSelectedItems(policyMeasureSelector);

                    var letterForSharedGroup = ap_util_functions.sharedGroupCode_letter(selecteditem_policyMeasure[0].originalItem.code);
                    data.shared_group_code = ''+countryIsoCode + letterForSharedGroup;
                    data.commodity_list = sharedGroupGridData;

                    if(sessionStorage.getItem("superUser")=="OECD"){
                        data.loggedUser = "OECD";
                    }
                    else{
                        data.loggedUser = q_a_d_instance.options.logged_user_code;
                    }
                    data.saveAction = "ADD";

                    console.log(data)

                    var payloadrest = JSON.stringify(data);

                    $.ajax({
                        type: 'POST',
                        url : 'http://'+ap_util_variables.CONFIG.base_ip_address+':'+ap_util_variables.CONFIG.base_ip_port+ap_util_variables.CONFIG.createNewSharedGroup,
                        data: {"pdObj": payloadrest},

                        success : function(response) {
                            //Reload the list in the Commodity Selector
                            self.clearElementsInCommodityPopup();
                            //Reload the list in the Commodity Selector
                            q_a_d_instance.reloadCommodityList(q_a_d_instance, qd_instance);
                            $('#commodityAdd').modal('hide');
                        },
                        error : function(response) {
                            console.log(response)
                        }});
                }
                else{
                    $("#sharedGroupErrorMsg").text("Please fill the fields: Description and Short Description.");
                }
            }
        });
    }

        HostDomainParser.prototype.createCommodityAddPopup = function(qd_instance, selecteditem_country, selecteditem_commodityClass, selectorItem, host){

            var htmlTable = '<table style="width:100%">';
            htmlTable += '<tr><td>Commodity Id</td><td>1</td></tr>';
            htmlTable += '<tr><td>HS Code</td><td>2</td></tr>';
            htmlTable += '<tr><td>HS Version</td><td>3</td></tr>';
            htmlTable += '<tr><td>HS Suffix</td><td>4</td></tr>';
            htmlTable += '<tr><td>Short Description</td><td>5</td></tr>';
            htmlTable += '<tr><td>Description</td><td>6</td></tr>';
            htmlTable += '</table>';

            var self = this;
            $('#commodityAdd').on('shown.bs.modal', function () {
                $('#commodityAddTitle').html("Commodity Add");
                $("#jqxRadioButton_singleCommodity").jqxRadioButton({ width: 250, height: 25, checked: true});
                $("#jqxRadioButton_sharedGroup").jqxRadioButton({ width: 250, height: 25});
                self.createSingleCommodityPopup(selecteditem_country, selecteditem_commodityClass);
                //$('#commodityAddContentSecondPart').html(htmlTable);
                $("#jqxRadioButton_singleCommodity").on('change', function (event) {
                    var checked = event.args.checked;
                    if (checked) {
                        self.options.singleCommodityPopup = true;
                        self.createSingleCommodityPopup(selecteditem_country, selecteditem_commodityClass);
                    }
                });

                $("#jqxRadioButton_sharedGroup").on('change', function (event) {
                    var checked = event.args.checked;
                    if (checked) {
                        self.options.singleCommodityPopup = false;
                        self.createSharedGroupPopup(qd_instance, host, selecteditem_country, selecteditem_commodityClass);
                    }
                });
            })
    }

    HostDomainParser.prototype.clearElementsInCommodityPopup = function(){

        //Single Commodity
        $("#hsCode_input").val('');
        $("#description_input").val('');
        $("#shortDescription_input").val('');

        //Shared Group
        $("#sharedGroupDescription_input").val('');
        $("#sharedGroupShortDescription_input").val('');
        $("#sharedGroupCommodityList_grid").jqxGrid('clearselection');

        $("#singleCommodityErrorMsg").text("");
    }

    HostDomainParser.prototype.createConditionAddPopup = function(qd_instance, selectorItem, host){
        var self = this;
        //$('#conditionAdd').on('shown.bs.modal', function () {
            $('#conditionAddTitle').html("Condition Add");
        //})
        $('#conditionSave').click(function(e){
            var newCondition = document.getElementById("new_condition").value;
            console.log("Value in newCondition")
            console.log(newCondition)
            $.ajax({
                type: 'GET',
                url: 'http://' + host.options.base_ip_address + ':' + host.options.base_ip_port + ap_util_variables.CONFIG.conditionMaxCode + '/' + host.options.datasource,
                dataType: 'json',

                success: function (response) {

                    /* Convert the response in an object, i fneeded. */
                    var json = response;
                    if (typeof(response) == 'string')
                        json = $.parseJSON(response);

                    var conditionCode = json[0][0];
                    var app = (parseInt(conditionCode,10))+1;

                    host.options.conditionCode = ''+app;
                    console.log("host.options.conditionCode "+host.options.conditionCode)
                    console.log("host.options.conditionName "+host.options.conditionName)

                    var properties = {};
                    var type = host.options.condition_selector_type;
                    var source_domain = qd_instance.getSelector_domain(host.options.fx_selector_7, true);
                    console.log(source_domain)
                    var obj = {"value": type + "_" + host.options.conditionCode + "_LevelX", "label": '' + host.options.conditionName, "code" : host.options.conditionCode, "type": type};
                    source_domain.push(obj);
                    console.log("After push")
                    console.log(source_domain)
                    source_domain.sort(function (a, b) {
                        if (a.label < b.label)
                            return -1;
                        if (a.label > b.label)
                            return 1;
                        return 0;
                    });
                    console.log("After sort")
                    console.log(source_domain)

                    qd_instance.update_selector_domain(host.options.fx_selector_7, source_domain, properties);
                    document.getElementById("new_condition").value ='';
                    //$("#subnationalAdd").hide();
                    $('#conditionAdd').modal('hide');
                }
            });

            host.options.conditionName = newCondition;
        });
    }

    HostDomainParser.prototype.createSubnationalAddPopup = function(qd_instance, selectorItem, selecteditem_country, host){

        var selecteditem_country_found = false;
        if((selecteditem_country!=null)&&(typeof selecteditem_country!="undefined")&&(selecteditem_country.length>0)){
            if((selecteditem_country[0].originalItem!=null)&&(typeof selecteditem_country[0].originalItem!="undefined")){

                if((selecteditem_country[0].originalItem.code!=null)&&(typeof selecteditem_country[0].originalItem.code!="undefined")){
                    selecteditem_country_found = true;
                    $('#subnationalAddLabelContent').html("Specify the new subnational for "+selecteditem_country[0].originalItem.label);
                }
            }
        }

        if(selecteditem_country_found==false){
            $('#subnationalAddLabelContent').html("Specify the new subnational");
        }
        $('#subnationalAddTitle').html("Subnational Add");
        $('#SubnationalSave').click(function(e){
            var newSubnationalName = document.getElementById("new_subnational").value;
            if((newSubnationalName!=null)&&(typeof newSubnationalName!='undefined')){
                $.ajax({
                    type: 'GET',
                    url: 'http://' + host.options.base_ip_address + ':' + host.options.base_ip_port + ap_util_variables.CONFIG.subnationalMaxCodeNotGaul + '/' + host.options.datasource,
                    dataType: 'json',

                    success: function (response) {

                        /* Convert the response in an object, i fneeded. */
                        var json = response;
                        if (typeof(response) == 'string')
                            json = $.parseJSON(response);

                        var subnationalCode = json[0][0];
                        var app = (parseInt(subnationalCode,10))-1;
                        host.options.subnationalCode = ''+app;
                        console.log("host.options.subnationalCode "+host.options.subnationalCode)
                        console.log("host.options.subnationalName "+host.options.subnationalName)
                        var properties = {};
                        var type = host.options.subnational_selector_type;
                        var source_domain = qd_instance.getSelector_domain(host.options.fx_selector_6_b, true);
                        console.log(source_domain)
                        var obj = {"value": type + "_" + host.options.subnationalCode + "_Level2", "label": '' + host.options.subnationalName, "code" : host.options.subnationalCode, "type": type};
                        source_domain.push(obj);
                        console.log("After push")
                        console.log(source_domain)
                        source_domain.sort(function (a, b) {
                            if (a.label < b.label)
                                return -1;
                            if (a.label > b.label)
                                return 1;
                            return 0;
                        });
                        console.log("After sort")
                        console.log(source_domain)

                        qd_instance.update_selector_domain(host.options.fx_selector_6_b, source_domain, properties);
                        document.getElementById("new_subnational").value ='';
                        //$("#subnationalAdd").hide();
                        $('#subnationalAdd').modal('hide');
                    }
                });
                host.options.subnationalName = newSubnationalName;
            }
        });
        //http://stackoverflow.com/questions/29471368/how-to-open-close-react-bootstrap-modal-programmatically
    }

    HostDomainParser.prototype.createSingleCommodityPopup = function(selecteditem_country, selecteditem_commodityClass){

        var selecteditem_country_found = false;
        var selecteditem_commodityClass_found = false;
        var selecteditem_country_label = '';
        var selecteditem_commodityClass_label = '';
        var selecteditem_commodityClass_code = '';
        if((selecteditem_country!=null)&&(typeof selecteditem_country!="undefined")&&(selecteditem_country.length>0)){
            if((selecteditem_country[0].originalItem!=null)&&(typeof selecteditem_country[0].originalItem!="undefined")){

                if((selecteditem_country[0].originalItem.code!=null)&&(typeof selecteditem_country[0].originalItem.code!="undefined")){
                    selecteditem_country_found = true;
                    selecteditem_country_label = selecteditem_country[0].originalItem.label;
                }
            }
        }

        if((selecteditem_commodityClass!=null)&&(typeof selecteditem_commodityClass!="undefined")&&(selecteditem_commodityClass.length>0)){
            if((selecteditem_commodityClass[0].originalItem!=null)&&(typeof selecteditem_commodityClass[0].originalItem!="undefined")){

                if((selecteditem_commodityClass[0].originalItem.code!=null)&&(typeof selecteditem_commodityClass[0].originalItem.code!="undefined")){
                    selecteditem_commodityClass_found = true;
                    selecteditem_commodityClass_label = selecteditem_commodityClass[0].originalItem.label;
                    selecteditem_commodityClass_code = selecteditem_commodityClass[0].originalItem.code;
                }
            }
        }

        if(selecteditem_country_found&&selecteditem_commodityClass_found){

            var commodityClassListContent = ap_util_variables.CONFIG.commodityClassChildren[selecteditem_commodityClass_code];
            if((commodityClassListContent!= null)&&(typeof commodityClassListContent!="undefined")){
                var commodityClassParentLabel = '';
                var commodityClassParentObj = {};
                for(var iParent=0; iParent<ap_util_variables.CONFIG.commodityClassParent.length; iParent++){
                    var obj = ap_util_variables.CONFIG.commodityClassParent[iParent];
                    var keyObj = Object.keys(obj)[0];
                    if(keyObj==selecteditem_commodityClass_code){
                        commodityClassParentObj = obj;
                    }
                }
                for(var j=0; j<ap_util_variables.CONFIG.commodityClassParent.length; j++){
                    var commodityClassCode = ap_util_variables.CONFIG.commodityClassParent[j][selecteditem_commodityClass_code];
                    if((commodityClassCode!=null)&&(typeof commodityClassCode!= "undefined"))
                    {
                        commodityClassParentLabel = commodityClassCode;
                        break;
                    }
                }
                var data = new Array();
                var key = Object.keys(commodityClassParentObj)[0];
                //data[0] = commodityClassParentLabel;
                data[0] = {code: key, label:commodityClassParentObj[key]};
                var j=1;
                for(var i=0; i< commodityClassListContent.length; i++){
                    data[j] = commodityClassListContent[i];
                    j++;
                }
                var source = {
                    localdata: data,
                    datatype: "array"
                }
                var dataAdapter = new $.jqx.dataAdapter(source);
                $('#commodityClass_input').jqxComboBox({source: dataAdapter, displayMember: "label", valueMember: "code"});
                $("#commodityClass_input").jqxComboBox('selectIndex',0);

                var hsVersionData = new Array();
                hsVersionData[0] = '';
                hsVersionData[1] = 'HS2012';
                hsVersionData[2] = 'HS2007';
                var sourceHsVersion = {
                    localdata: hsVersionData,
                    datatype: "array"
                }
                var dataAdapterHsVersion = new $.jqx.dataAdapter(sourceHsVersion);
                $('#hsVersion_input').jqxComboBox({source: dataAdapterHsVersion});

                $("#commodityClass_row").show();
            }
            else{
                $("#commodityClass_row").hide();
            }
            $("#commodityAddLabelContent").html("Add a commodity/shared group for "+ selecteditem_country_label + "-"+ selecteditem_commodityClass_label);
        }
        else{
            $("#commodityAddLabelContent").html("Add a commodity/shared group");
        }

        $("#sharedGroupContent").hide();
        $("#singleCommodityContent").show();

      //  $("#singleCommodityContent").html('Checked Single');
    }

    HostDomainParser.prototype.createSharedGroupPopup = function(qd_instance, self, selecteditem_country, selecteditem_commodityClass){
        $("#singleCommodityContent").hide();
        $("#sharedGroupContent").show();

        var selecteditem_commodityClass_found = false;
        var selecteditem_commodityClass_label = '';
        var selecteditem_commodityClass_code = '';

        if((selecteditem_commodityClass!=null)&&(typeof selecteditem_commodityClass!="undefined")&&(selecteditem_commodityClass.length>0)){
            if((selecteditem_commodityClass[0].originalItem!=null)&&(typeof selecteditem_commodityClass[0].originalItem!="undefined")){

                if((selecteditem_commodityClass[0].originalItem.code!=null)&&(typeof selecteditem_commodityClass[0].originalItem.code!="undefined")){
                    selecteditem_commodityClass_found = true;
                    selecteditem_commodityClass_label = selecteditem_commodityClass[0].originalItem.label;
                    selecteditem_commodityClass_code = selecteditem_commodityClass[0].originalItem.code;
                }
            }
        }

        var commodityClassListContent = ap_util_variables.CONFIG.commodityClassChildren[selecteditem_commodityClass_code];
        if((commodityClassListContent!= null)&&(typeof commodityClassListContent!="undefined")){
            var commodityClassParentLabel = '';
            for(var j=0; j<ap_util_variables.CONFIG.commodityClassParent.length; j++){
                var commodityClassCode = ap_util_variables.CONFIG.commodityClassParent[j][selecteditem_commodityClass_code];
                if((commodityClassCode!=null)&&(typeof commodityClassCode!= "undefined"))
                {
                    commodityClassParentLabel = commodityClassCode;
                    break;
                }
            }
            //var data = new Array();
            //data[0] = commodityClassParentLabel;
            //var j=1;
            //for(var i=0; i< commodityClassListContent.length; i++){
            //    data[j] = commodityClassListContent[i];
            //    j++;
            //}
            //var source = {
            //    localdata: data,
            //    datatype: "array"
            //}
            //var dataAdapter = new $.jqx.dataAdapter(source);

            //$("#sharedGroupCommodityClass_input").jqxComboBox({source: dataAdapter, displayMember: "label", valueMember: "code"});
            //$("#sharedGroupCommodityClass_input").jqxComboBox('selectIndex',0);
            $("#sharedGroupCommodityClass_row").show();
        }
        else{
            $("#sharedGroupCommodityClass_row").hide();
        }

        var source = [];

        //ap_util_variables.CONFIG.domestic_policyDomain_code

        //Commodity Class
        var selecteditem_commodityClass = qd_instance.getSelectedItems(self.options.fx_selector_5);
        var selecteditem_commodityDomain = qd_instance.getSelectedItems(self.options.fx_selector_1);
        var selecteditem_policyDomain = qd_instance.getSelectedItems(self.options.fx_selector_2);

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
        //var obj_code = selecteditem_commodityClass[0].originalItem.code;
        var commodityClassCode = selecteditem_commodityClass[0].originalItem.code;
        var selecteditem_country = qd_instance.getSelectedItems(self.options.fx_selector_6);
        var obj_code_country = selecteditem_country[0].originalItem.code;
        //var rest_url = {'rest_url_type':self.options.commodityByClass_url, 'rest_url_datasource' : self.options.datasource};
        //var rest_url = {'rest_url_type':self.options.commodity_url, 'rest_url_datasource' : self.options.datasource};
        var rest_url = {'rest_url_type':self.options.commodityIgnoringAssociatedPolicy_url, 'rest_url_datasource' : self.options.datasource}
        var parentIndex = self.options.commodity_parent_codes.indexOf(''+commodityClassCode);
        if(parentIndex!= -1){
            var childrenArray = (self.options.commodity_children_codes[parentIndex]).toString();
            if((childrenArray!=null)&&(childrenArray.length>0))
            {
                commodityClassCode = commodityClassCode+','+childrenArray;
            }
        }

        var withSharedGroups = false;
        //var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/' + obj_code_country+ '/' + obj_code;
        var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/' + commodityClassCode+ '/' +obj_code_country+ '/'+withSharedGroups;
        $.ajax({
            type: 'GET',
            url:  url,
            dataType: 'json',

            success: function (response) {
                /* Convert the response in an object, if needed. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
                //To order the json elements based on the title(label)
                if((json!=null)&&(typeof json!="undefined")&&(json.length>0))
                {
                    for (var i = 0; i < json.length; i++) {

                        var commodityId = '';
                        var hsCode = '';
                        var hsVersion = '';
                        var hsSuffix = '';
                        var shortDescription = '';
                        var longDescription = '';
                        var commodityClassCode = '';
                        var commodityClassName = '';
                        var app = '';
                        //commodity_id, country_name, hs_code, hs_suffix, hs_version, target_code, description, short_description, commodityclass_code, commodityclass_name, shared_group_code

                        if((json[i][0]!=null)&&(typeof json[i][0]!= "undefined")&&(json[i][0].length>0)){
                            commodityId = json[i][0];
                            if(commodityId==self.options.none){
                                commodityId = self.options.na;
                            }
                        }

                        if((json[i][2]!=null)&&(typeof json[i][2]!= "undefined")&&(json[i][2].length>0)){
                            hsCode = json[i][2];

                            var space = "";
                            if(hsCode.length<8)
                            {
                                var diff = 8-(hsCode.length);
                                if(diff==2)
                                    space = "  ";
                                if(diff==4)
                                    space = "    ";
                            }
                            app += hsCode+space;
                        }

                        if((json[i][3]!=null)&&(typeof json[i][3]!= "undefined")&&(json[i][3].length>0)){
                            hsSuffix = json[i][3];
                        }

                        if((json[i][4]!=null)&&(typeof json[i][4]!= "undefined")&&(json[i][4].length>0)){
                            hsVersion = json[i][4];
                            if(hsVersion==self.options.none){
                                hsVersion = self.options.na;
                            }
                            app += "["+hsVersion+"]";
                        }

                        if((json[i][5]!=null)&&(typeof json[i][5]!= "undefined")&&(json[i][5].length>0)){
                            longDescription = json[i][5];
                        }

                        if((json[i][6]!=null)&&(typeof json[i][6]!= "undefined")&&(json[i][6].length>0)){
                            shortDescription = json[i][6];
                            app += shortDescription;
                        }

                        if((json[i][7]!=null)&&(typeof json[i][7]!= "undefined")&&(json[i][7].length>0)){
                            commodityClassCode = json[i][7];
                        }

                        if((json[i][8]!=null)&&(typeof json[i][8]!= "undefined")&&(json[i][8].length>0)){
                            commodityClassName = json[i][8];
                        }
                        var type = 'addCommodityPopup';
                        var value = ""+type + "_COMMODITYID:"+commodityId+"_HSCODE:"+hsCode+"_HSSUFFIX:"+hsSuffix+"_HSVERSION:"+hsVersion+"_DESCRIPTION:"+longDescription+"_SHORTDESCRIP:"+shortDescription;
                        //var obj = {"value": value, "label": app, "code" : hsCode, "type": type};
                        //var obj = {"value": value, "label": app, "code" : hsCode, "type": 'addCommodityPopup'};
                        var obj = {"hsVersion":hsVersion, "shortDescription": shortDescription, "value": value, "label": app, "code" : hsCode, "commodityId": commodityId, "type": 'addCommodityPopup', "commodityClassCode": commodityClassCode, "commodityClassName": commodityClassName, "labelToVisualize": "<img width='16' height='16' style='float: left; margin-top: 2px; margin-right: 5px;' src='../../img/btn-notes.png'/><span>"+app+"</span>"};
                        source[i] = obj;
                    }
                }
                //$("#sharedGroupCommodityList_listbox").jqxListBox({source: source, checkboxes: true, height: 150, width: 500});

                //This list is used to retrive all the info related to each commodity listed in the commodity grid
                self.options.add_commodity_popup_commodityList_sharedGroup = source;
                var data = [];
                if((source!=null)&&(typeof source!="undefined")){
                    for(var iSource= 0; iSource<source.length; iSource++){
                        var obj = {};
                        //obj['commodity'] = source[iSource].label;
                        obj['code'] = source[iSource].code;
                        obj['hsVersion'] = source[iSource].hsVersion;
                        obj['shortDescription'] = source[iSource].shortDescription;
                        obj['originalHsCode'] = '';
                        obj['originalHsVersion'] = '';
                        obj['originalHsSuffix'] = '';
                        obj['commodityId'] = source[iSource].commodityId;
                        obj['commodityclassCode'] = source[iSource].commodityClassCode;
                        obj['commodityclassName'] = source[iSource].commodityClassName;
                        data.push(obj);
                    }
                    //data.push({'selected': true, 'commodity': source[0].label, 'originalHsCode': 'origHScode1', 'originalHsVersion': 'origHSVersion1', 'originalHsSuffix': 'origHSsuffix1'},
                    //    {'selected': false, 'commodity': 'comm2', 'originalHsCode': 'origHScode2', 'originalHsVersion': 'origHSVersion2', 'originalHsSuffix': 'origHSsuffix2'},
                    //    {'selected': false, 'commodity': 'comm3', 'originalHsCode': 'origHScode3', 'originalHsVersion': 'origHSVersion3', 'originalHsSuffix': 'origHSsuffix3'});
                    var gridSource =
                    {
                        localdata: data,
                        datatype: "array",
                        datafields:
                            [
                                { name: 'code', type: 'string' },
                                { name: 'hsVersion', type: 'string' },
                                { name: 'shortDescription', type: 'string' },
                                { name: 'originalHsCode', type: 'string' },
                                { name: 'originalHsVersion', type: 'string' },
                                { name: 'originalHsSuffix', type: 'string' },
                                { name: 'commodityId', type: 'string' },
                                { name: 'commodityclassCode', type: 'string' },
                                { name: 'commodityclassName', type: 'string' }
                            ]
                    };

                    var dataAdapter = new $.jqx.dataAdapter(gridSource);
                    // initialize jqxGrid
                    $("#sharedGroupCommodityList_grid").jqxGrid(
                        {
                            height: 200,
                            width: '100%',
                            source: dataAdapter,
                            editable: true,
                            enabletooltips: true,
                            selectionmode: 'multiplecellsadvanced',
                            showfilterrow: true,
                            filterable: true,
                            columns: [
                                { text: 'HS Code', datafield: 'code', columntype: 'textbox', width: '10%' , editable: false},
                                { text: 'HS Version', datafield: 'hsVersion', columntype: 'textbox', width: '10%' , editable: false},
                                { text: 'Short Description', datafield: 'shortDescription', columntype: 'textbox', width: '25%' , editable: false},
                                { text: 'Original Hs Code', datafield: 'originalHsCode', columntype: 'textbox', width: '15%' },
                                { text: 'Original Hs Version', datafield: 'originalHsVersion', columntype: 'textbox', width: '20%' },
                                { text: 'Original Hs Suffix', datafield: 'originalHsSuffix', columntype: 'textbox', width: '15%' }
                            ],
                            selectionmode: 'checkbox'
                        });
                }
            },

            error: function (err, b, c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    }

    return HostDomainParser;

});