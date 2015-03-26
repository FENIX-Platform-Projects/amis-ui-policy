define([
    'jquery',
    'nprogress',
    'jQAllRangeSliders',
    'xDomainRequest'
], function($, NProgress) {

    var optionsDefault = {

    }

    //text= Loads dependencies as plain text files.
    function HostDomainParser(o) {
        if (this.options === undefined) {
            this.options = {};
        }
        $.extend(true, this.options, optionsDefault, o);
    }

    HostDomainParser.prototype.getDomain = function(qd_controller_instance, selector_id, url_type_var, self) {
        var domain_parser_instance = this;
        /* Retrive UI structure from DB. */
        var url_type = url_type_var.rest_url_type;
        if((url_type_var.rest_url_specific_code != null)&&(typeof url_type_var.rest_url_specific_code != 'undefined'))
        {
            url_type += url_type_var.rest_url_specific_code;
        }

        $.ajax({
            type: 'GET',
            //url: "http://faostat3.fao.org/d3sp/service/msd/cl/system/OECD_CommodityClass1/1.0",
            url: self.options.codelist_url +"/"+ url_type +"/1.0",
            dataType: 'json',

            success: function (response) {
                /* Convert the response in an object, if needed. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
                //To order the json elements based on the title(label)
                var jsonCodes = json.rootCodes;
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
                if(json.system.indexOf('CommodityClass')!=-1)
                {
                    toRemove = true;
                }

                var data = new Array();

                //-> Generic Component..can be Commodity or Country
                var type = qd_controller_instance.getSelector_domainType(selector_id);
                var language = qd_controller_instance.getSelector_language(selector_id);

                var codes_to_remove = ['8','9','10','11','12'];
                var parent = {'8':[1,3],'9':[2,3],'10':[3,4],'11':[1,2,3],'12':[1,2]};
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
                if(json.system.indexOf('CommodityClass')!=-1)
               // if(json.system.contains('CommodityClass'))
                {
                    properties = {'removeFromList': to_remove, 'parent':parent};
                }
                else
                {
                    properties = {'removeFromList': to_remove};
                }

                //if(json.system.contains(self.options.codelist_url_PolicyType))
                if(json.system.indexOf(self.options.codelist_url_PolicyType)!=-1)
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
                        domain_parser_instance.listbox_element_disable(qd_controller_instance, self.options.fx_selector_3, self.options.fx_selector_4);
//                        var fx_selector_3_selected_item =qd_controller_instance.getSelectedItems('fx_selector_3');
//
//                        console.log("fx_selector_3_selected_items .....");
//                        console.log(fx_selector_3_selected_item);
//                        console.log("Code "+fx_selector_3_selected_item[0].originalItem.code);
//
//                        if((fx_selector_3_selected_item!=null)&&(typeof fx_selector_3_selected_item!='undefined')&&(fx_selector_3_selected_item.length>0))
//                        {
//                            //Disable the Policy Measures that don't belong to the Selected Policy Type
//                            var fx_selector_4_domain = qd_controller_instance.getSelector_domain('fx_selector_4');
//                            if((fx_selector_4_domain!=null)&&(typeof fx_selector_4_domain!='undefined')&&(fx_selector_4_domain.length>0)) {
//                                //Loop on the domain to select the Policy Measures that have as father the Selected Policy Type
//                                console.log("fx_selector_4_domain .....");
//                                console.log(fx_selector_4_domain);
//                                //Array with the index of the elements to disable
//                                var properties_fx_selector_4_domain = [];
//                                var count=0;
//                                for (var iMeasure = 0; iMeasure < fx_selector_4_domain.length; iMeasure++)
//                                {
//                                    var item_parent_code = fx_selector_4_domain[iMeasure].parent_code;
//                                    if((item_parent_code!=null)&&(typeof item_parent_code!= 'undefined')&&(item_parent_code!=fx_selector_3_selected_item[0].originalItem.code))
//                                    {
//                                        properties_fx_selector_4_domain[count] = iMeasure;
//                                        count++;
//                                    }
//                                }
//                                //Disable the items
//                                qd_controller_instance.disableItems('fx_selector_4',properties_fx_selector_4_domain);
//                            }
//                        }
                        //The Loading Window
                        NProgress.done();
                    }
                }
                else{
                    qd_controller_instance.update_selector_domain(selector_id, data, properties);
                }
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
                    self.options.host_domain_parser.getDomain(qd_controller_instance, policy_measure_selector_id, rest_url, self);
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
    HostDomainParser.prototype.listbox_element_disable = function(qd_controller_instance, selected_items_selector_id, domain_selector_id) {
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
                for (var iMeasure = 0; iMeasure < fx_selector_4_domain.length; iMeasure++) {
                    var item_parent_code = fx_selector_4_domain[iMeasure].parent_code;
                    if ((item_parent_code != null) && (typeof item_parent_code != 'undefined') && (item_parent_code != fx_selector_3_selected_item[0].originalItem.code)) {
                        properties_fx_selector_4_domain[count] = iMeasure;
                        count++;
                    }
                }
                //Disable the items
                qd_controller_instance.disableItems(domain_selector_id, properties_fx_selector_4_domain);
            }
        }
    }

    //Enable and Disable the elements
    HostDomainParser.prototype.listbox_element_enable_and_disable = function(qd_controller_instance, selected_items_selector_id, domain_selector_id) {
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
                for (var iMeasure = 0; iMeasure < fx_selector_4_domain.length; iMeasure++) {
                    var item_parent_code = fx_selector_4_domain[iMeasure].parent_code;
                    if ((item_parent_code != null) && (typeof item_parent_code != 'undefined') && ($.inArray(item_parent_code, item_codes )!=-1)) {
                        properties_to_enable.push(iMeasure);
                    }
                    else{
                        properties_to_disable.push(iMeasure);
                    }
                }
            }

            //Disable the items
            qd_controller_instance.disableItems(domain_selector_id, properties_to_disable);

            //Enable the items
            qd_controller_instance.enableItems(domain_selector_id, properties_to_enable);

            //Unselect the items
            qd_controller_instance.update_selector_selection(domain_selector_id, properties_to_disable, false);
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

//    HostDomainParser.prototype.listbox_country_element_enable_and_disable= function(qd_controller_instance, selected_items_selector_id, domain_selector_id) {
    HostDomainParser.prototype.listbox_country_element_enable_and_disable= function(qd_controller_instance, selected_commodity_domain_selector_id, selected_policy_domain_selector_id, selected_country_selector_id, host) {
        //Ask for the items selected in the Commodity Domain Radio Button
//        var fx_selector_3_selected_item = qd_controller_instance.getSelectedItems(selected_items_selector_id);
        var fx_selector_1_selected_item = qd_controller_instance.getSelectedItems(selected_commodity_domain_selector_id);

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
        }
    }

    return HostDomainParser;

});