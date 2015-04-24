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

                    if((json.system.indexOf('CommodityClass')!=-1)&&(self.options.button_preview_action_type != "searchCreatePolicy"))
                    {
                        toRemove = true;
                    }

                    //-> Generic Component..can be Commodity or Country
                    var type = qd_controller_instance.getSelector_domainType(selector_id);
                    //alert("type= "+type)
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
                    if((json.system.indexOf('CommodityClass')!=-1)&&(self.options.button_preview_action_type != "searchCreatePolicy"))
                    // if(json.system.contains('CommodityClass'))
                    {
                        properties = {'removeFromList': to_remove, 'parent':parent};
                    }
                    else
                    {
                        properties = {'removeFromList': to_remove};
                    }
                }
                else{

                    var type = qd_controller_instance.getSelector_domainType(selector_id);

                    if((type==self.options.condition_selector_type)||(type==self.options.individualPolicy_selector_type)){
                        for (var i = 0; i < json.length; i++) {
                            var obj = {"value": type + "_" + json[i][0], "label": '' + json[i][1], "code" : json[i][0], "type": type};
                            data[i] = obj;
                        }
                    }
                    else if(type==self.options.commodityDetail_selector_type){
                        for (var i = 0; i < json.length; i++) {
                            var hs_suffix = '';
                            var hs_version = '';
                            var short_description = '';
                            var app ='';
                            if((json[i][1]!=null)&&(typeof json[i][1]!= "undefined")&&(json[i][1].length>0)){
                                hs_suffix = json[i][1];
                                if((typeof app!= "undefined")&&(app.length>0)){
                                    app += " - ";
                                }
                                else{
                                    app += " [";
                                }
                                app += hs_suffix;
                            }
                            if((json[i][2]!=null)&&(typeof json[i][2]!= "undefined")&&(json[i][2].length>0)){
                                hs_version = json[i][2];
                                if((typeof app!= "undefined")&&(app.length>0)){
                                    app += " - ";
                                }
                                else{
                                    app += " [";
                                }
                                app += hs_version;
                            }
                            if((json[i][3]!=null)&&(typeof json[i][3]!= "undefined")&&(json[i][3].length>0)){
                                short_description = json[i][3];
                                if((typeof app!= "undefined")&&(app.length>0)){
                                    app += " - ";
                                }
                                else{
                                    app += " [";
                                }
                                app += short_description;
                            }
                            if((typeof app!= "undefined")&&(app.length>0)){
                                app += "]";
                            }
                            var obj = {"value": type + "_" + json[i][0], "label": '' + json[i][0] + app, "code" : json[i][0], "type": type};
                            data[i] = obj;
                        }
                    }
                }

                //if(json.system.contains(self.options.codelist_url_PolicyType))
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
                    //if((json.system.indexOf('CommodityClass')!=-1)&&(self.options.button_preview_action_type == "searchCreatePolicy")){
                    //    //Load the Commodity linked to the selected commodity class
                    //    alert("221")
                    //    console.log(data);
                    //
                    //    if((data!=null)&&(data.length>0)){
                    //        var commodity_code = data[0].code;
                    //        var commodity_name = data[0].label;
                    //    }
                    //
                    //    qd_controller_instance.update_selector_domain(self.options.fx_selector_6, data, properties);
                    //
                    //    //The first Policy Measures that don't belong to the Selected Policy Type have to be disabled
                    //    domain_parser_instance.listbox_element_disable(qd_controller_instance, self.options.fx_selector_3, self.options.fx_selector_4);
                    //    //The Loading Window
                    //    NProgress.done();
                    //
                    //}
                    //else{
                    //    qd_controller_instance.update_selector_domain(selector_id, data, properties);
                    //}
                }
            },

            error: function (err, b, c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    }

    HostDomainParser.prototype.subnationalInfo = function(qd_controller_instance, host)
    {
        var country_code = '37';
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

                //var cpl_id_list_String = '';
                //for (var i = 0; i < json.length; i++) {
                //    cpl_id_list_String += ''+ json[i][0];
                //    if(i<json.length-1){
                //        cpl_id_list_String+=',';
                //    }
                //}
                //console.log("cpl_id_list_String = "+cpl_id_list_String)

                //var cpl_id_list_String = "136";
                //var cpl_id_list_String = "374";
                var cpl_id_list_String = "262,263,264,265,266,267,268,269,270,271,272,273,276,277,278,279,280,281,282,285,286,287,288,289,290,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,362,371,372,373,374,3124";
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
                var country_code =['37'];

                var body = {};
                body.uid = "GAUL";
                body.version = "2014";
                body.codes = country_code;
                // body.levels = 2;

                var body2 = JSON.stringify(body);
                //Getting GAUL code
                console.log("subnationalInfo start")
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
                        console.log("subnationalInfo 1")
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
                        console.log("cpl_id_list_String="+cpl_id_list_String)
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

                                console.log("subnationalInfo 3")
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
                                            case 1:
                                                //cpl_code[i] = json[i][j];
                                                break;
                                            case 2:
                                                //commodity_id[i] = json[i][j];
                                                row["CommodityId"] = json[i][j];
                                                break;
                                            case 3:
                                                //country_code[i] = json[i][j];
                                                row["CountryCode"] = json[i][j];
                                                break;
                                            case 4:
//                                            country_name[i] = json[i][j];
                                                row["CountryName"] = json[i][j];
                                                break;
                                            case 5:
                                                //subnational_code[i] = json[i][j];
                                                row["SubnationalCode"] = json[i][j];
                                                break;
                                            case 6:
//                                            subnational_name[i] = json[i][j];
                                                row["SubnationalName"] = json[i][j];
                                                break;
                                            case 7:
                                                //commoditydomain_code[i] = json[i][j];
                                                row["CommodityDomainCode"] = json[i][j];
                                                break;
                                            case 8:
                                                //commoditydomain_name[i] = json[i][j];
                                                row["CommodityDomainName"] = json[i][j];
                                                break;
                                            case 9:
                                                //commodityclass_code[i] = json[i][j];
                                                row["CommodityClassCode"] = json[i][j];
                                                break;
                                            case 10:
                                                //commodityclass_name[i] = json[i][j];
                                                row["CommodityClassName"] = json[i][j];
                                                break;
                                            case 11:
                                                //policydomain_code[i] = json[i][j];
                                                row["PolicyDomainCode"] = json[i][j];
                                                break;
                                            case 12:
//                                            policydomain_name[i] = json[i][j];
                                                row["PolicyDomainName"] = json[i][j];
                                                break;
                                            case 13:
                                                //policytype_code[i] = json[i][j];
                                                row["PolicyTypeCode"] = json[i][j];
                                                break;
                                            case 14:
//                                            policytype_name[i] = json[i][j];
                                                row["PolicyTypeName"] = json[i][j];
                                                break;
                                            case 15:
                                                //policymeasure_code[i] = json[i][j];
                                                row["PolicyMeasureCode"] = json[i][j];
                                                break;
                                            case 16:
//                                            policymeasure_name[i] = json[i][j];
                                                row["PolicyMeasureName"] = json[i][j];
                                                break;
                                            case 17:
                                                //condition_code[i] = json[i][j];
                                                row["PolicyConditionCode"] = json[i][j];
                                                break;
                                            case 18:
//                                            condition[i] = json[i][j];
                                                row["PolicyCondition"] = json[i][j];
                                                break;
                                            case 19:
                                                //individualpolicy_code[i] = json[i][j];
                                                row["IndividualPolicyCode"] = json[i][j];
                                                break;
                                            case 20:
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

                                    var properties = {};
                                    qd_controller_instance.update_selector_domain(host.options.fx_selector_6_b, mastertable_data, properties);
                                }
                                console.log("To get Subnational info START");
                                console.log(mastertable_data)
                                console.log("To get Subnational info END");

                                //self.master_grid_creation(mastertable_data, self, host);
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