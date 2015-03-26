define([
    'jquery',
    'nprogress',
    'host_utility',
    'fullscreen',
    'jQAllRangeSliders',
    'xDomainRequest'
], function($, NProgress, HostUtility) {

    var optionsDefault = {
        //Instance of the Host
        host_instance : '',
        host_utility_instance : '',
        standard_preview_tab_id : 'standard_preview',
        pivot_preview_tab_id : 'pivot_preview',
        standard_preview_jqxgrid : 'standard_preview_jqxgrid',
        //List of the cplid from the preview action
        cpl_id_list : '',

        //Variables for the time
        year_tab : '',
        year_list : '',
        start_date : '',
        end_date : '',

        shared_group_window_once_open :false,
        shared_group_window :"shared_group_window",
        shared_group_grid :"shared_group_grid",

        additional_info_policy_window_once_open :false,
        additional_info_policy_window :"additional_info_window",
        additional_info_policy_container :"additional_info_container",

        "cached_map" : {
            "l" : null,
            "map" : null
        }
    }

    //text= Loads dependencies as plain text files.
    function HostPreview(o) {
        if (this.options === undefined) {
            this.options = {};
        }
        $.extend(true, this.options, optionsDefault, o);
    }

    HostPreview.prototype.settingEvents = function(qd_instance)
    {
        var self = this;

        $('#pane1').click(function (e) {
            $('#'+self.options.standard_preview_jqxgrid).show();
        });

        $('#pane2').click(function (e) {
            $('#'+self.options.standard_preview_jqxgrid).hide();
        });

    };

    HostPreview.prototype.getPolicyFromCpls = function (host, payload ) {
        this.options.host_instance = host;
        this.options.host_utility_instance = new HostUtility();
        var self = this;
        $.ajax({
            type: 'POST',
// url: ap_queryAndDownload.CONFIG.masterFromCplId_url,
            url: 'http://' + host.options.base_ip_address + ':' + host.options.base_ip_port + host.options.masterFromCplId_url,
            data: {"pdObj": payload},
            success: function (response) {
                /* Convert the response in an object, i needed. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
                var mastertable_data = new Array();
                for (var i = 0; i < json.length; i++) {
                    var row = {};
                    for (var j = 0; j < json[i].length; j++) {
                        if ((json[i][j] == null) || (typeof json[i][j] == 'undefined')) {
                            json[i][j] = "";
                        }
                        switch (j) {
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
// country_name[i] = json[i][j];
                                row["CountryName"] = json[i][j];
                                break;
                            case 5:
//subnational_code[i] = json[i][j];
                                row["SubnationalCode"] = json[i][j];
                                break;
                            case 6:
// subnational_name[i] = json[i][j];
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
// policydomain_name[i] = json[i][j];
                                row["PolicyDomainName"] = json[i][j];
                                break;
                            case 13:
//policytype_code[i] = json[i][j];
                                row["PolicyTypeCode"] = json[i][j];
                                break;
                            case 14:
// policytype_name[i] = json[i][j];
                                row["PolicyTypeName"] = json[i][j];
                                break;
                            case 15:
//policymeasure_code[i] = json[i][j];
                                row["PolicyMeasureCode"] = json[i][j];
                                break;
                            case 16:
// policymeasure_name[i] = json[i][j];
                                row["PolicyMeasureName"] = json[i][j];
                                break;
                            case 17:
//condition_code[i] = json[i][j];
                                row["PolicyConditionCode"] = json[i][j];
                                break;
                            case 18:
// condition[i] = json[i][j];
                                row["PolicyCondition"] = json[i][j];
                                break;
                            case 19:
//individualpolicy_code[i] = json[i][j];
                                row["IndividualPolicyCode"] = json[i][j];
                                break;
                            case 20:
// individualpolicy_name[i] = json[i][j];
                                row["IndividualPolicyName"] = json[i][j];
                                break;
                        }
                    }
                    mastertable_data[i] = row;
                }
                self.master_grid_creation(mastertable_data, self, host);
            },
            error: function (err, b, c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    };

    HostPreview.prototype.preview_action = function(data, host)
    {
        //Loading Bar
        NProgress.start();

        //Setting the properties for the time
        if((data != null)&&(data!="undefined"))
        {
            this.options.year_tab = data.yearTab;
            this.options.year_list = data.year_list;
            this.options.start_date = data.start_date;
            this.options.end_date = data.end_date;
        }
        var self= this;
        var payloadrest = JSON.stringify(data);
        /* Retrive UI structure from DB. */
        $.ajax({

            type: 'POST',
//            url: 'http://'+ap_queryAndDownload.CONFIG.base_ip_address+':'+ap_queryAndDownload.CONFIG.base_ip_port+ap_queryAndDownload.CONFIG.downloadPreview_url,
            url: 'http://'+host.options.base_ip_address+':'+host.options.base_ip_port+host.options.downloadPreview_url,
            data : {"pdObj": payloadrest},

            success : function(response) {

                /* Convert the response in an object, i needed. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
//                for (var i = 0 ; i < json.length ; i++) {
//                    console.log(" "+json[i]);
//                }
                self.options.cpl_id_list=[];
                var cpl_id_list_String = '';
                if(json.length==0)
                {
                    //Case No cpl_id for this selection
                    var s = "<h1 class='fx_header_title'>No data available for the current selection...</h1>";
                    $('#standard_preview').children().remove();
                    $('#standard_preview').append(s);
                    NProgress.done();
                }
                else
                {   //masterFromCplId_url
                    var s = '<div id='+self.options.standard_preview_jqxgrid+'></div>';
                    $('#standard_preview').children().remove();
                    $('#standard_preview').append(s);
                    var cpl_id_list_String ="";
                    for (var i = 0 ; i < json.length ; i++) {
                        self.options.cpl_id_list[i] = json[i];
                        if(cpl_id_list_String.length>0)
                        {
                            cpl_id_list_String += ', ';
                        }
                        cpl_id_list_String += "'"+self.options.cpl_id_list[i]+"'";
                    }

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
                    var country_code =[];

                    if((data.country_code!=null)&&(typeof data.country_code!="undefined"))
                    {
                        var data_country_code_array = data.country_code.split(",");
                        for(var icode = 0; icode<data_country_code_array.length; icode++){
                            country_code[icode] = ''+data_country_code_array[icode];
                        }
                    }
//                    console.log("Before data.country_code!!!!")
//                    console.log(country_code)
                    var body = {};
                    body.uid = "GAUL";
                    body.version = "2014";
                    body.codes = country_code;
                   // body.levels = 2;

                    var body2 = JSON.stringify(body);
                    //Getting GAUL code
                    $.ajax({
                            type: 'POST',
                            url: ''+host.options.codelist_url_2,
                            data : body2,
//                            data : {"body": body2},
                            //body : body,
                            contentType: 'application/json',
                            dataType:'json',
//                            url: ''+host.options.codelist_url_2+host.options.gaulsubnationalLevel_url,
                            success : function(response) {
                                //console.log(response)
                                var json = response;
                                if (typeof(response) == 'string')
                                    json = $.parseJSON(response);
                                var i=0;
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
//                                        var child_obj = {};
//                                        child_obj.code = child_code;
//                                        child_obj.name = child_name;

//                                        forGetMasterData.subnational_for_coutry[country][child_code]=child_name;
                                    }
//                                    var code = json[i].code;
//                                    var title = json[i].title['EN'];
                                }
//                                console.log(forGetMasterData.subnational)
//                                console.log(forGetMasterData.subnational_for_coutry)

                                forGetMasterData.datasource = host.options.datasource;
                                forGetMasterData.cpl_id = cpl_id_list_String;
                                var payloadrestMasterData = JSON.stringify(forGetMasterData);
                                var payloadMap = JSON.stringify(forGetMasterData.subnational);
                                var payloadMap2 = JSON.stringify(forGetMasterData.subnational_for_coutry);
                                var payloadMap3 = JSON.stringify(forGetMasterData.subnational_lev_3);
                                var payloadMap4 = JSON.stringify(forGetMasterData.subnational_for_coutry_lev_3);

                                //Case Search
                                if(self.options.host_instance.options.button_preview_action_type == 'search'){
                                    self.getPolicyFromCpls(host, payloadrestMasterData);
                                }
                                else{
                                    alert("Updated!!")
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

                                            var mastertable_data = new Array();

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
                                                mastertable_data[i] = row;
                                            }
                                            self.master_grid_creation(mastertable_data, self, host);
                                            //self.map_creation(mastertable_data, self, host, forGetMasterData);
                                        },
                                        error : function(err,b,c) {
                                            alert(err.status + ", " + b + ", " + c);
                                        }
                                    });
                                }
                            },
                        error : function(err,b,c) {
                            alert(err.status + ", " + b + ", " + c);
                        }});
                }
            },

            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    }

//    HostPreview.prototype.map_creation = function(data, host_preview, host, forGetMasterData) {
//
//        var map_data = host.options.host_policy_data_object.voObjectConstruction();
//
//        map_data.datasource = forGetMasterData.datasource;
//        map_data.cpl_id = forGetMasterData.cpl_id;
//        map_data.yearTab = host_preview.options.year_tab;
//        map_data.year_list = host_preview.options.year_list;
//        map_data.start_date = host_preview.options.start_date || host.options.default_start_date;
//        map_data.end_date = host_preview.options.end_date || host.options.default_end_date;
//        var payloadrestMapCreation = JSON.stringify(map_data);
//
//        //console.log("map_creation start 1... ");
//        $.ajax({
//            type: 'POST',
//            url: 'http://'+host.options.base_ip_address+':'+host.options.base_ip_port+host.options.mapData,
//            data : {"pdObj": payloadrestMapCreation},
//
//            success : function(response) {
//                /* Convert the response in an object, i needed. */
//                var json = response;
//                if (typeof(response) == 'string')
//                    json = $.parseJSON(response);
////                console.log("In map success");
////                console.log(json);
////                console.log("In map success country_map");
////                console.log(json.country_map);
////                console.log("In map success subnationalMap");
////                console.log(json.subnational_map);
////                console.log("After Master subnational");
//
//                //forGetMasterData.subnational = level 2
//                //forGetMasterData.subnational_lev_3
//                //Create the array of subnational level 2 and subnational level 3
//                var subnational_level_2 = [];
//                var subnational_level_3 = [];
//                var country = [];
//                //console.log(forGetMasterData.subnational);
//                //console.log(forGetMasterData.subnational_lev_3);
//
//                var gaul_country = Object.keys(forGetMasterData.country);
//                var gaul_subnational_level_2 = Object.keys(forGetMasterData.subnational);
//                var gaul_subnational_level_3 = Object.keys(forGetMasterData.subnational_lev_3);
//
//                if((json.country_map!=null)&&(typeof json.country_map!="undefined")) {
//                    var country_from_db = Object.keys(json.country_map);
//                    for(var i=0; i<country_from_db.length;i++)
//                    {
//                        var country_obj ={};
//                        country_obj[country_from_db[i]]= json.country_map[country_from_db[i]];
//                        if((gaul_country!=null)&&(typeof gaul_country!="undefined")){
//                            for(var j=0; j<gaul_country.length; j++)
//                            {
//                                if(country_from_db[i]==gaul_country[j]){
//                                    country.push(country_obj);
//                                    break;
//                                }
//                            }
//                        }
//                    }
//                }
//
//                if((json.subnational_map!=null)&&(typeof json.subnational_map!="undefined")){
//
//                    var keys_ar =Object.keys(json.subnational_map);
//                    //json.subnationalMap.keys_ar[0]
////                    for(var key in keys_ar){
//                    var subnational_found = false;
//                    for(var i=0; i<keys_ar.length;i++)
//                    {
//                        //console.log(keys_ar[i] +"  ----  "+json.subnational_map[keys_ar[i]])
//                        var subnational_obj ={};
//                        subnational_obj[keys_ar[i]]= json.subnational_map[keys_ar[i]];
//                        if((gaul_subnational_level_2!=null)&&(typeof gaul_subnational_level_2!="undefined")){
//                            for(var j=0; j<gaul_subnational_level_2.length; j++)
//                            {
//                                if(keys_ar[i]==gaul_subnational_level_2[j]){
//                                    subnational_level_2.push(subnational_obj);
//                                    subnational_found = true;
//                                    break;
//                                }
//                            }
//                        }
//
//                        if((gaul_subnational_level_3!=null)&&(typeof gaul_subnational_level_3!="undefined")){
//                            for(var k=0; k<gaul_subnational_level_3.length; k++)
//                            {
//                                if(keys_ar[i]==gaul_subnational_level_3[k]){
//                                    subnational_level_3.push(subnational_obj);
//                                    subnational_found = true;
//                                    break;
//                                }
//                            }
//                        }
//                    }
//                }
//                console.log("Start subnational_level_2");
//                console.log(subnational_level_2);
//                console.log("End subnational_level_2");
//                console.log("Start subnational_level_3");
//                console.log(subnational_level_3);
//                console.log("End subnational_level_3");
//                console.log("Start country");
//                console.log(country);
//                console.log("End country!!!!!");
//                $("#gaul_0_button").removeClass('policy-button-show');
//                $("#gaul_0_button").addClass('policy-button');
//                $("#gaul_1_button").removeClass('policy-button-show');
//                $("#gaul_1_button").addClass('policy-button');
//                $("#gaul_2_button").removeClass('policy-button-show');
//                $("#gaul_2_button").addClass('policy-button');
//               // $('#'+this.options.id).text(this.options.title);
//                if((country!=null)&&(typeof country!= "undefined")&&(country.length>0)){
//                    $("#gaul_0_button").addClass('policy-button-show');
//                    $("#gaul_0_button").addClass('btn btn-xs btn-primary');
//
//                    $("#gaul_0_button").click(function(e){
//                        host_preview.create_join_layer(host_preview.options.cached_map.fmMap.map, country, "0", "Blues", host_preview);
//                    });
//                }
//
//                if((subnational_level_2!=null)&&(typeof subnational_level_2!= "undefined")&&(subnational_level_2.length>0)){
//                    //Green
//                    $("#gaul_1_button").addClass('policy-button-show');
//                    $("#gaul_1_button").click(function(e){
//                        host_preview.create_join_layer(host_preview.options.cached_map.fmMap.map, subnational_level_2, "1", "Greens", host_preview);
//                    });
//                    $("#gaul_1_button").addClass('btn btn-xs btn-success');
//                }
//
//                if((subnational_level_3!=null)&&(typeof subnational_level_3!= "undefined")&&(subnational_level_3.length>0)) {
//                    //Red
//                    $("#gaul_2_button").addClass('policy-button-show');
//                    $("#gaul_2_button").click(function (e) {
//                        host_preview.create_join_layer(host_preview.options.cached_map.fmMap.map, subnational_level_3, "2", "Reds", host_preview);
//                    });
//                    $("#gaul_2_button").addClass('btn btn-xs btn-danger');
//                }
//
//                host_preview.createMap("map", country, host_preview);
//                //$("#map").append("Prova");
//            },
//            error : function(err,b,c) {
//                alert(err.status + ", " + b + ", " + c);
//            }
//        });
//    };

//    HostPreview.prototype.map_creation = function(data, host_preview, host, forGetMasterData) {
//
//        var map_data = host.options.host_policy_data_object.voObjectConstruction();
//
//        map_data.datasource = forGetMasterData.datasource;
//        map_data.cpl_id = forGetMasterData.cpl_id;
//        map_data.yearTab = host_preview.options.year_tab;
//        map_data.year_list = host_preview.options.year_list;
//        map_data.start_date = host_preview.options.start_date || host.options.default_start_date;
//        map_data.end_date = host_preview.options.end_date || host.options.default_end_date;
//        var payloadrestMapCreation = JSON.stringify(map_data);
//
//        //console.log("map_creation start 1... ");
//        $.ajax({
//            type: 'POST',
//            url: 'http://'+host.options.base_ip_address+':'+host.options.base_ip_port+host.options.mapData,
//            data : {"pdObj": payloadrestMapCreation},
//
//            success : function(response) {
//                /* Convert the response in an object, i needed. */
//                var json = response;
//                if (typeof(response) == 'string')
//                    json = $.parseJSON(response);
////                console.log("In map success");
////                console.log(json);
////                console.log("In map success country_map");
////                console.log(json.country_map);
////                console.log("In map success subnationalMap");
////                console.log(json.subnational_map);
////                console.log("After Master subnational");
//
//                //forGetMasterData.subnational = level 2
//                //forGetMasterData.subnational_lev_3
//                //Create the array of subnational level 2 and subnational level 3
//                var subnational_level_2 = [];
//                var subnational_level_3 = [];
//                var country = [];
//                //console.log(forGetMasterData.subnational);
//                //console.log(forGetMasterData.subnational_lev_3);
//
//                var gaul_country = Object.keys(forGetMasterData.country);
//                var gaul_subnational_level_2 = Object.keys(forGetMasterData.subnational);
//                var gaul_subnational_level_3 = Object.keys(forGetMasterData.subnational_lev_3);
//
//                if((json.country_map!=null)&&(typeof json.country_map!="undefined")) {
//                    var country_from_db = Object.keys(json.country_map);
//                    for(var i=0; i<country_from_db.length;i++)
//                    {
//                        var country_obj ={};
//                        country_obj[country_from_db[i]]= json.country_map[country_from_db[i]];
//                        if((gaul_country!=null)&&(typeof gaul_country!="undefined")){
//                            for(var j=0; j<gaul_country.length; j++)
//                            {
//                                if(country_from_db[i]==gaul_country[j]){
//                                    country.push(country_obj);
//                                    break;
//                                }
//                            }
//                        }
//                    }
//                }
//
//                if((json.subnational_map!=null)&&(typeof json.subnational_map!="undefined")){
//
//                    var keys_ar =Object.keys(json.subnational_map);
//                    //json.subnationalMap.keys_ar[0]
////                    for(var key in keys_ar){
//                    var subnational_found = false;
//                    for(var i=0; i<keys_ar.length;i++)
//                    {
//                        //console.log(keys_ar[i] +"  ----  "+json.subnational_map[keys_ar[i]])
//                        var subnational_obj ={};
//                        subnational_obj[keys_ar[i]]= json.subnational_map[keys_ar[i]];
//                        if((gaul_subnational_level_2!=null)&&(typeof gaul_subnational_level_2!="undefined")){
//                            for(var j=0; j<gaul_subnational_level_2.length; j++)
//                            {
//                                if(keys_ar[i]==gaul_subnational_level_2[j]){
//                                    subnational_level_2.push(subnational_obj);
//                                    subnational_found = true;
//                                    break;
//                                }
//                            }
//                        }
//
//                        if((gaul_subnational_level_3!=null)&&(typeof gaul_subnational_level_3!="undefined")){
//                            for(var k=0; k<gaul_subnational_level_3.length; k++)
//                            {
//                                if(keys_ar[i]==gaul_subnational_level_3[k]){
//                                    subnational_level_3.push(subnational_obj);
//                                    subnational_found = true;
//                                    break;
//                                }
//                            }
//                        }
//                    }
//                }
//                console.log("Start subnational_level_2");
//                console.log(subnational_level_2);
//                console.log("End subnational_level_2");
//                console.log("Start subnational_level_3");
//                console.log(subnational_level_3);
//                console.log("End subnational_level_3");
//                console.log("Start country");
//                console.log(country);
//                console.log("End country!!!!!");
//                $("#gaul_0_button").removeClass('policy-button-show');
//                $("#gaul_0_button").addClass('policy-button');
//                $("#gaul_1_button").removeClass('policy-button-show');
//                $("#gaul_1_button").addClass('policy-button');
//                $("#gaul_2_button").removeClass('policy-button-show');
//                $("#gaul_2_button").addClass('policy-button');
//                // $('#'+this.options.id).text(this.options.title);
//                if((country!=null)&&(typeof country!= "undefined")&&(country.length>0)){
//                    $("#gaul_0_button").addClass('policy-button-show');
//                    $("#gaul_0_button").addClass('btn btn-xs btn-primary');
//
//                    $("#gaul_0_button").click(function(e){
//                        host_preview.create_join_layer(host_preview.options.cached_map.fmMap.map, country, "0", "Blues", host_preview);
//                    });
//                }
//
//                if((subnational_level_2!=null)&&(typeof subnational_level_2!= "undefined")&&(subnational_level_2.length>0)){
//                    //Green
//                    $("#gaul_1_button").addClass('policy-button-show');
//                    $("#gaul_1_button").click(function(e){
//                        host_preview.create_join_layer(host_preview.options.cached_map.fmMap.map, subnational_level_2, "1", "Greens", host_preview);
//                    });
//                    $("#gaul_1_button").addClass('btn btn-xs btn-success');
//                }
//
//                if((subnational_level_3!=null)&&(typeof subnational_level_3!= "undefined")&&(subnational_level_3.length>0)) {
//                    //Red
//                    $("#gaul_2_button").addClass('policy-button-show');
//                    $("#gaul_2_button").click(function (e) {
//                        host_preview.create_join_layer(host_preview.options.cached_map.fmMap.map, subnational_level_3, "2", "Reds", host_preview);
//                    });
//                    $("#gaul_2_button").addClass('btn btn-xs btn-danger');
//                }
//
//                host_preview.createMap("map", country, host_preview);
//                //$("#map").append("Prova");
//            },
//            error : function(err,b,c) {
//                alert(err.status + ", " + b + ", " + c);
//            }
//        });
//    };

    HostPreview.prototype.map_creation = function(data, host_preview, host, forGetMasterData) {

        var map_data = host.options.host_policy_data_object.voObjectConstruction();

        map_data.datasource = forGetMasterData.datasource;
        map_data.cpl_id = forGetMasterData.cpl_id;
        map_data.yearTab = host_preview.options.year_tab;
        map_data.year_list = host_preview.options.year_list;
        map_data.start_date = host_preview.options.start_date || host.options.default_start_date;
        map_data.end_date = host_preview.options.end_date || host.options.default_end_date;
        var payloadrestMapCreation = JSON.stringify(map_data);

        //console.log("map_creation start 1... ");
        $.ajax({
            type: 'POST',
            url: 'http://'+host.options.base_ip_address+':'+host.options.base_ip_port+host.options.mapData,
            data : {"pdObj": payloadrestMapCreation},

            success : function(response) {
                /* Convert the response in an object, i needed. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
//                console.log("In map success");
//                console.log(json);
//                console.log("In map success country_map");
//                console.log(json.country_map);
//                console.log("In map success subnationalMap");
//                console.log(json.subnational_map);
//                console.log("After Master subnational");

                //forGetMasterData.subnational = level 2
                //forGetMasterData.subnational_lev_3
                //Create the array of subnational level 2 and subnational level 3
                var subnational_level_2 = [];
                var subnational_level_3 = [];
                var country = [];
                //console.log(forGetMasterData.subnational);
                //console.log(forGetMasterData.subnational_lev_3);

                var gaul_country = Object.keys(forGetMasterData.country);
                var gaul_subnational_level_2 = Object.keys(forGetMasterData.subnational);
                var gaul_subnational_level_3 = Object.keys(forGetMasterData.subnational_lev_3);

                if((json.country_map!=null)&&(typeof json.country_map!="undefined")) {
                    var country_from_db = Object.keys(json.country_map);
                    for(var i=0; i<country_from_db.length;i++)
                    {
                        var country_obj ={};
                        country_obj[country_from_db[i]]= json.country_map[country_from_db[i]];
                        if((gaul_country!=null)&&(typeof gaul_country!="undefined")){
                            for(var j=0; j<gaul_country.length; j++)
                            {
                                if(country_from_db[i]==gaul_country[j]){
                                    country.push(country_obj);
                                    break;
                                }
                            }
                        }
                    }
                }

                if((json.subnational_map!=null)&&(typeof json.subnational_map!="undefined")){

                    var keys_ar =Object.keys(json.subnational_map);
                    //json.subnationalMap.keys_ar[0]
//                    for(var key in keys_ar){
                    var subnational_found = false;
                    for(var i=0; i<keys_ar.length;i++)
                    {
                        //console.log(keys_ar[i] +"  ----  "+json.subnational_map[keys_ar[i]])
                        var subnational_obj ={};
                        subnational_obj[keys_ar[i]]= json.subnational_map[keys_ar[i]];
                        if((gaul_subnational_level_2!=null)&&(typeof gaul_subnational_level_2!="undefined")){
                            for(var j=0; j<gaul_subnational_level_2.length; j++)
                            {
                                if(keys_ar[i]==gaul_subnational_level_2[j]){
                                    subnational_level_2.push(subnational_obj);
                                    subnational_found = true;
                                    break;
                                }
                            }
                        }

                        if((gaul_subnational_level_3!=null)&&(typeof gaul_subnational_level_3!="undefined")){
                            for(var k=0; k<gaul_subnational_level_3.length; k++)
                            {
                                if(keys_ar[i]==gaul_subnational_level_3[k]){
                                    subnational_level_3.push(subnational_obj);
                                    subnational_found = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                console.log("Start subnational_level_2");
                console.log(subnational_level_2);
                console.log("End subnational_level_2");
                console.log("Start subnational_level_3");
                console.log(subnational_level_3);
                console.log("End subnational_level_3");
                console.log("Start country");
                console.log(country);
                console.log("End country!!!!!");

                host_preview.createMap("map", country, subnational_level_2, subnational_level_3, host_preview);
                //$("#map").append("Prova");
            },
            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    };

//    HostPreview.prototype.createMap = function (id, country, host_preview) {
//        $("#" + id).empty()
//        var fmMap = new FM.Map(id, {
//            plugins: {
//                geosearch: false,
//                mouseposition: false,
//                controlloading: false,
//                zoomControl: 'bottomright'
//            },
//            guiController: {
//                overlay : true,
//                baselayer: true,
//                wmsLoader: false
//            },
//            gui: {
//                disclaimerfao: true
//            }
//        }, {
//            zoomControl: false,
//            attributionControl: false
//        });
//        fmMap.createMap();
//        fmMap.addLayer( new FM.layer({
//            urlWMS: "http://fenixapps2.fao.org/geoserver-demo",
//            layers: "fenix:gaul0_line_3857",
//            layertitle: "Boundaries",
//            styles: "gaul0_line",
//            opacity: "0.7",
//            zindex: 600
//        }));
//
//        //console.log(fmMap)
//        host_preview.options.cached_map.fmMap = fmMap;
//
//        //console.log(host_preview.options.cached_map.fmMap)
//
//        host_preview.create_join_layer(fmMap, country, "0", "Blues", host_preview);
////        fmMap.m.invalidateSize();
//
////        $("#pane2").on("click",  function (e) {
//////            console.log(host_preview.options.cached_map.fmMap)
////            console.log(host_preview.options.cached_map.fmMap.map.invalidateSize)
////            host_preview.options.cached_map.fmMap.map.invalidateSize();
////        });
//
//        $('#pane2[data-toggle="tab"]').on('shown.bs.tab', function (e) {
//            host_preview.options.cached_map.fmMap.map.invalidateSize();
//        });
//    }

    HostPreview.prototype.createMap = function (id, country, subnational_level_2, subnational_level_3, host_preview) {
        $("#" + id).empty()
        var fmMap = new FM.Map(id, {
            plugins: {
                geosearch: false,
                mouseposition: false,
                controlloading: false,
                zoomControl: 'bottomright'
            },
            guiController: {
                overlay : true,
                baselayer: true,
                wmsLoader: false
            },
            gui: {
                disclaimerfao: true
            }
        }, {
            zoomControl: false,
            attributionControl: false
        });
        fmMap.createMap();
//        fmMap.addLayer( new FM.layer({
//            urlWMS: "http://fenixapps2.fao.org/geoserver-demo",
//            layers: "fenix:gaul0_line_3857",
//            layertitle: "Boundaries",
//            styles: "gaul0_line",
//            opacity: "0.7",
//            zindex: 600
//        }));

        //console.log(fmMap)
        //host_preview.options.cached_map.fmMap = fmMap;

        //console.log(host_preview.options.cached_map.fmMap)
        if((country!=null)&&(typeof country!= "undefined")&&(country.length>0)) {
            host_preview.create_join_layer(fmMap, country, "0", "Blues");
        }

        if((subnational_level_2!=null)&&(typeof subnational_level_2!= "undefined")&&(subnational_level_2.length>0)) {
            host_preview.create_join_layer(fmMap, subnational_level_2, "1", "Greens");
        }

        if((subnational_level_3!=null)&&(typeof subnational_level_3!= "undefined")&&(subnational_level_3.length>0)) {
            host_preview.create_join_layer(fmMap, subnational_level_3, "2", "Reds");
        }

        fmMap.addLayer( new FM.layer({
            urlWMS: "http://fenixapps2.fao.org/geoserver-demo",
            layers: "fenix:gaul0_line_3857",
            layertitle: "Boundaries",
            styles: "gaul0_line",
            opacity: "0.7",
            zindex: 600
        }));

//        fmMap.m.invalidateSize();

//        $("#pane2").on("click",  function (e) {
////            console.log(host_preview.options.cached_map.fmMap)
//            console.log(host_preview.options.cached_map.fmMap.map.invalidateSize)
//            host_preview.options.cached_map.fmMap.map.invalidateSize();
//        });

        $('#pane2[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            fmMap.map.invalidateSize();
        });
    }

//    HostPreview.prototype.create_join_layer = function (fmMap, data, gaul_code, legend_color, host_preview) {
//
//        try {
//            //console.log(host_preview.options.cached_map.l)
//            host_preview.options.cached_map.fmMap.removeLayer(host_preview.options.cached_map.l)
//        }catch(e){
//            console.log("ERRRORR!@!!!")
//            //console.log(e)
//        }
////        $.when(host_preview.options.cached_map.fmMap.removeLayer(host_preview.options.cached_map.l)).done(function() {
////            alert("Done" ); // Alerts "123"
////        });
////        console.log(fmMap)
////        console.log(data)
////        console.log(gaul_code)
////        console.log(host_preview)
//
//        host_preview.options.cached_map.l = new FM.layer({
//            urlWMS: "http://fenixapps2.fao.org/geoserver-demo",
//            layers: "fenix:gaul"+gaul_code+"_3857",
//            joincolumn: "adm"+gaul_code+"_code",
//            layertitle: "Number of policy",
//            layertype : 'JOIN',
//            jointype:'shaded',
//            defaultgfi: true,
//            openlegend: true,
//            opacity: '0.7',
//            lang: "en",
//            joindata: JSON.stringify(data),
//            joincolumnlabel: "adm"+gaul_code+"_name",
//            colorramp:''+legend_color,
//            intervals:'3',
//            mu:'Number of policy'
//        });
//        host_preview.options.cached_map.fmMap.addLayer(host_preview.options.cached_map.l, host_preview.options.cached_map.fmMap);
//    }

    HostPreview.prototype.create_join_layer = function (fmMap, data, gaul_code, legend_color) {

        var layer = new FM.layer({
            urlWMS: "http://fenixapps2.fao.org/geoserver-demo",
            layers: "fenix:gaul"+gaul_code+"_3857",
            joincolumn: "adm"+gaul_code+"_code",
            layertitle: "Num.of policy for GAUL"+gaul_code,
            layertype : 'JOIN',
            jointype:'shaded',
            defaultgfi: true,
            openlegend: true,
            opacity: '0.7',
            lang: "en",
            joindata: JSON.stringify(data),
            joincolumnlabel: "adm"+gaul_code+"_name",
            colorramp:''+legend_color,
            intervals:'3',
            mu:'Number of policy for GAUL'+gaul_code
        });
        fmMap.addLayer(layer, fmMap);
    }


    HostPreview.prototype.master_grid_creation = function (data, host_preview, host) {

        host_preview.masterData = data;
        var source =
        {
            datafields: [
                { name: 'CountryName' },
                { name: 'SubnationalName' },
                { name: 'CommodityClassName' },
                { name: 'CommodityId' },
                { name: 'PolicyDomainName' },
                { name: 'PolicyTypeName' },
                { name: 'PolicyMeasureName' },
                { name: 'PolicyCondition' },
                { name: 'IndividualPolicyName' },
                { name: 'CplId' }
            ],
            //root: "Master",
            //record: "Master",
            id: 'CplId',
            localdata: data,
            datatype: "array"
        };
//        var employeesAdapter = new $.jqx.dataAdapter(source);
        // create nested grid.
        var initrowdetails = function (index, parentElement, gridElement, record) {
//            console.log("INITROWDETAILS 2")
//            console.log(host_preview.masterData)
//            console.log(host_preview.masterData[index])
//            console.log(index)
//            console.log(parentElement)
//            console.log(gridElement)
//            console.log(record)
            host_preview.build_policyTableGrid(index, parentElement, gridElement, record, host_preview, host);
        }

        var renderer = function (row, column, value) {
            return '<span class=fx_master_table_render>' + value + '</span>';
        };

        var $p =  $("#" + host_preview.options.standard_preview_jqxgrid).parent();

        var $c = $("<div id=" + host_preview.options.standard_preview_jqxgrid + "></div>");
        $("#" + host_preview.options.standard_preview_jqxgrid).jqxGrid('destroy');

        if ($("#" + host_preview.options.standard_preview_jqxgrid).length !== 0) {
            $("#" + host_preview.options.standard_preview_jqxgrid).remove()
        }

        $p.append( $c );

        // create jqxgrid
        $("#" + host_preview.options.standard_preview_jqxgrid).jqxGrid(
            {
                width: '100%',
                height: 370,
                source: source,
//                theme: theme,
                rowdetails: true,
                rowsheight: 35,
                initrowdetails: initrowdetails,
                rowdetailstemplate: { rowdetails: "<div id='grid' class=fx_master_table_row_details></div>", rowdetailsheight: 200, rowdetailshidden: true },
                enabletooltips: true,
                columnsheight: 35,
                rowsheight: 30,
                columnsresize: true,
                sortable: true,
                filterable: true,
                showfilterrow: true,
                ready: function () {
                    $("#" + host_preview.options.standard_preview_jqxgrid).jqxGrid('showrowdetails', 0);
                },

                columns: [
                    { text: 'Country', width: '10%', datafield: 'CountryName', filtertype: 'textbox', filtercondition: 'starts_with', cellsrenderer: renderer},
                    { text: 'Subnational level', datafield: 'SubnationalName', width: '10%', filtertype: 'textbox', filtercondition: 'starts_with', cellsrenderer: renderer },
                    { text: 'Commodity Class', datafield: 'CommodityClassName', width: '15%', filtertype: 'textbox', filtercondition: 'starts_with', cellsrenderer: renderer },
                    { text: 'Commodity ID', datafield: 'CommodityId', width: '10%', filtertype: 'textbox', filtercondition: 'starts_with', cellsrenderer: renderer },
                    { text: 'Policy Domain', datafield: 'PolicyDomainName', width: '10%', filtertype: 'textbox', filtercondition: 'starts_with', cellsrenderer: renderer },
                    { text: 'Policy Type', datafield: 'PolicyTypeName', width: '15%', filtertype: 'textbox', filtercondition: 'starts_with', cellsrenderer: renderer },
                    { text: 'Policy Measure', datafield: 'PolicyMeasureName', width: '15%', filtertype: 'textbox', filtercondition: 'starts_with', cellsrenderer: renderer },
                    { text: 'Policy Condition', datafield: 'PolicyCondition', width: '15%', filtertype: 'textbox', filtercondition: 'starts_with', cellsrenderer: renderer },
                    { text: 'Individual Policy', datafield: 'IndividualPolicyName', width: '15%', filtertype: 'textbox', filtercondition: 'starts_with', cellsrenderer: renderer }
                ]
            });

        NProgress.done();
    };

    HostPreview.prototype.build_policyTableGrid = function(index, parentElement, gridElement, record, host_preview, host)
    {
        var id = record.uid.toString();

        var data = host_preview.options.host_instance.options.host_policy_data_object.voObjectConstruction();
        data.datasource = host_preview.options.host_instance.options.datasource;
        //it could be 'slider' or 'classic'
        data.cpl_id = ''+record.CplId.toString();
        data.commodity_id = ''+record.CommodityId.toString();
        data.yearTab = host_preview.options.year_tab;
        data.year_list = host_preview.options.year_list;
//        data.start_date = host_preview.options.start_date;
//        data.end_date = host_preview.options.end_date;
//        data.start_date = host_preview.options.start_date || '1983-01-01';
//        data.end_date = host_preview.options.end_date || '2025-01-01';
        data.start_date = host_preview.options.start_date || host.options.default_start_date;
        data.end_date = host_preview.options.end_date || host.options.default_end_date;
        var payloadrest = JSON.stringify(data);

//        console.log("Before Policy Table Start");
//        console.log("data.datasource = "+data.datasource);
//        console.log("data.cpl_id = "+data.cpl_id);
//        console.log("data.commodity_id = "+data.commodity_id);
//        console.log("data.yearTab = "+data.yearTab);
//        console.log("data.year_list = "+data.year_list);
//        console.log("data.start_date = "+data.start_date);
//        console.log("data.end_date = "+data.end_date);
//        console.log("Before Policy Table End");

        $.ajax({
            type: 'POST',
//          url: ap_queryAndDownload.CONFIG.shareGroupCommodities_url+ '/' + ap_queryAndDownload.CONFIG.datasource+ '/' +ap_masterTableObject.CONFIG.commodity_id[commodity_index],
            url: 'http://' + host_preview.options.host_instance.options.base_ip_address + ':' + host_preview.options.host_instance.options.base_ip_port + host_preview.options.host_instance.options.policyTable_url,
            data: {"pdObj": payloadrest},

            success: function (response) {

                /* Convert the response in an object, if needed. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
                //  console.log("json ***"+json+"***");
                var metadata_id = [];
                var policy_id = [];
                var cpl_id = [];
                var commodity_id = [];
                var hs_version = [];
                var hs_code = [];
                var hs_suffix = [];
                var policy_element = [];
                var start_date = [];
                var end_date = [];
                var units = [];
                var value = [];
                var value_text = [];
                var value_type = [];
                var exemptions = [];
                var location_condition = [];
                var notes = [];
                var link = [];
                var source = [];
                var title_of_notice = [];
                var legal_basis_name = [];
                var date_of_publication = [];
                var imposed_end_date = [];
                var second_generation_specific = [];
                var benchmark_tax = [];
                var benchmark_product = [];
                var tax_rate_biofuel = [];
                var tax_rate_benchmark = [];
                var start_date_tax = [];
                var benchmark_link = [];
                var original_dataset = [];
                var type_of_change_code = [];
                var type_of_change_name = [];
                var measure_descr = [];
                var product_original_hs = [];
                var product_original_name = [];
                var implementationprocedure = [];
                var xs_yeartype = [];
                var link_pdf = [];
                var benchmark_link_pdf = [];
                var short_description = [];
                var shared_group_code = [];

                var policytable_data = new Array();
                for (var i = 0; i < json.length; i++) {
                    var row = {};
                    //row["CountryCode"] = record
                    row["AdditionalInfoButton"] = "Show";
                    row["MetadataButton"] = "Show";
                    row["EditButton"] = "Edit";
                    row["DeleteButton"] = "Delete";
                    for (var j = 0; j < json[i].length; j++) {
                        if ((json[i][j] == null) || (typeof json[i][j] == 'undefined')) {
                            json[i][j] = "";
                        }
                        switch (j) {
                            case 0:
                                metadata_id[i] = json[i][j];
                                break;
                            case 1:
                                policy_id[i] = json[i][j];
                                row["Policy_id"]= policy_id[i];
                                break;
                            case 2:
                                cpl_id[i] = json[i][j];
                                row["CplId"] = json[i][j];
                                break;
                            case 3:
                                commodity_id[i] = json[i][j];
                                //This is important for the Shared Group
                                row["CommodityId"] = json[i][j];
                                break;
                            case 4:
                                hs_version[i] = json[i][j];
                                row["HsVersion"] = json[i][j];
                                break;
                            case 5:
                                hs_code[i] = json[i][j];
                                row["HsCode"] = json[i][j];
                                break;
                            case 6:
                                hs_suffix[i] = json[i][j];
                                row["HsSuffix"] = json[i][j];
                                break;
                            case 7:
                                policy_element[i] = json[i][j];
                                row["PolicyElement"] = json[i][j];
                                break;
                            case 8:
                                start_date[i] = json[i][j];
                                row["StartDate"] = json[i][j];
                                break;
                            case 9:
                                end_date[i] = json[i][j];
                                row["EndDate"] = json[i][j];
                                break;
                            case 10:
                                units[i] = json[i][j];
                                row["Unit"] = json[i][j];
                                break;
                            case 11:
                                value[i] = json[i][j];
                                row["Value"] = json[i][j];
                                break;
                            case 12:
                                value_text[i] = json[i][j];
                                row["ValueText"] = json[i][j];
                                break;
                            case 13:
                                value_type[i] = json[i][j];
                                row["ValueType"] = json[i][j];
                                break;
                            case 14:
                                exemptions[i] = json[i][j];
                                row["Exemptions"] = json[i][j];
                                break;
                            case 15:
                                location_condition[i] = json[i][j];
                                row["LocalCondition"] = json[i][j];
                                break;
                            case 16:
                                notes[i] = json[i][j];
                                row["Notes"] = json[i][j];
                                break;
                            case 17:
                                link[i] = json[i][j];
                                row["Link"] = json[i][j];
                                break;
                            case 18:
                                source[i] = json[i][j];
                                row["Source"] = json[i][j];
                                break;
                            case 19:
                                title_of_notice[i] = json[i][j];
                                row["TitleOfNotice"] = json[i][j];
                                break;
                            case 20:
                                legal_basis_name[i] = json[i][j];
                                row["LegalBasisName"] = json[i][j];
                                break;
                            case 21:
                                date_of_publication[i] = json[i][j];
                                row["DateOfPublication"] = json[i][j];
                                break;
                            case 22:
                                imposed_end_date[i] = json[i][j];
                                row["ImposedEndDate"] = json[i][j];
                                break;
                            case 23:
                                second_generation_specific[i] = json[i][j];
                                break;
                            case 24:
                                benchmark_tax[i] = json[i][j];
                                break;
                            case 25:
                                benchmark_product[i] = json[i][j];
                                break;
                            case 26:
                                tax_rate_biofuel[i] = json[i][j];
                                break;
                            case 27:
                                tax_rate_benchmark[i] = json[i][j];
                                row["TaxRateBenchmark"] = json[i][j];
                                break;
                            case 28:
                                start_date_tax[i] = json[i][j];
                                row["StartDateTax"] = json[i][j];
                                break;
                            case 29:
                                benchmark_link[i] = json[i][j];
                                row["BenchmarkLink"] = json[i][j];
                                break;
                            case 30:
                                original_dataset[i] = json[i][j];
                                row["OriginalDataset"] = json[i][j];
                                break;
                            case 31:
                                type_of_change_code[i] = json[i][j];
                                break;
                            case 32:
                                type_of_change_name[i] = json[i][j];
                                row["TypeOfChangeName"] = json[i][j];
                                break;
                            case 33:
                                measure_descr[i] = json[i][j];
                                row["MeasureDescription"] = json[i][j];
                                break;
                            case 34:
                                product_original_hs[i] = json[i][j];
                                row["ProductOriginalHs"] = json[i][j];
                                break;
                            case 35:
                                product_original_name[i] = json[i][j];
                                row["ProductOriginalName"] = json[i][j];
                                break;
                            case 36:
                                implementationprocedure[i] = json[i][j];
                                row["ImplementationProcedure"] = json[i][j];
                                break;
                            case 37:
                                xs_yeartype[i] = json[i][j];
                                row["XsYearType"] = json[i][j];
                                break;
                            case 38:
                                link_pdf[i] = json[i][j];
                                row["LinkPdf"] = json[i][j];
                                break;
                            case 39:
                                benchmark_link_pdf[i] = json[i][j];
                                row["BenchmarkLinkPdf"] = json[i][j];
                                break;
                            case 40:
                                short_description[i] = json[i][j];
                                row["ShortDescription"] = json[i][j];
                                break;
                            case 41:
                                shared_group_code[i] = json[i][j];
                                row["SharedGroupCode"] = json[i][j];
                                break;
                        }
                    }
                    row["MasterIndex"] = index;
                    policytable_data[i]= row;
                }

                host_preview.policy_grid_creation(policytable_data, parentElement, host_preview, host, index);
            },
            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    };

    HostPreview.prototype.policy_grid_creation = function(policytable_data, parentElement, host_preview, host, index)
    {
        //"HsVersion", "HsCode", "HsSuffix", "PolicyElement", "StartDate", "EndDate", "Unit", "Value", "ValueText", "Exemptions", "ShortDescription"
        var policy_source = "";

        var info = host_preview.options.host_utility_instance.getPolicyTable_datafields(policytable_data, host);
        policy_source =
        {
            localdata: policytable_data,
            datatype: "array",
            id: "CommodityId",
            datafields: info.datafields
        };
        var grid = $($(parentElement).children()[0]);

        if (grid != null) {
            grid.jqxGrid({ source: policy_source, width: '95%',//theme: theme,
                height : 170,
                columnsheight: 40,
                enabletooltips: true,
                //columnsheight: 40,
                //rowsheight : 30,
                columnsresize: true,
                columns: info.columns,
                sortable: true
            });

            grid.on('cellclick', function (event) {
                if(event.args.datafield=="SharedGroupCode"){
                    var policy_grid = $($(parentElement).children()[0]);
                    host_preview.buildShareGroupPolicyTables(host_preview, policy_grid, event);
                }
                else if(event.args.datafield=="AdditionalInfoButton"){
                    var policy_grid = $($(parentElement).children()[0]);
                    var policy_grid2 = $($(parentElement).children()[0]);
                    var datarecord = policy_grid2.jqxGrid('getrowdata', event.args.rowindex);
                    //console.log(host_preview.masterData[datarecord["MasterIndex"]])

                    var data_entry_obj = {};
                    data_entry_obj["policy_data"] = datarecord;
                    data_entry_obj["master_data"] = host_preview.masterData[datarecord["MasterIndex"]];
                    console.log("Additional info obj")
                    console.log(data_entry_obj)
                    host_preview.buildAdditionalPolicyTables(host_preview, policy_grid, event);
                }
                else if(event.args.datafield=="MetadataButton"){
                    $('#close_metadata_fullscreen_button_container').children().remove();
                    var s = "<div><button id ='close_metadata_fullscreen_button'>Close</button></div>";
                    $('#close_metadata_fullscreen_button_container').append(s);
                    $('#metadata_fullscreen').css("display", "block");
                    $('#metadata_fullscreen').fullScreen(true);
                    host_preview.fullScreenContent();

                    $('#close_metadata_fullscreen_button').on('click', function () {
                        $('#metadata_fullscreen').css("display", "none");
                        $('#metadata_fullscreen').fullScreen(false);
                    });
                }
                else if(event.args.datafield=="EditButton"){
                    var properties = {};
                    var policy_grid = $($(parentElement).children()[0]);
                    var datarecord = policy_grid.jqxGrid('getrowdata', event.args.rowindex);
                    var data_entry_obj = {};
                    data_entry_obj["policy_data"] = datarecord;
                    data_entry_obj["master_data"] = host_preview.masterData[datarecord["MasterIndex"]];
                    console.log("Data entry obj")
                    console.log(data_entry_obj)
                    $('body').trigger('EditSearchButton', properties);
                }
                else if(event.args.datafield=="DeleteButton"){
                    var properties = {};
                    $('body').trigger('DeleteSearchButton', properties);
                }
            });
        }
    };

    HostPreview.prototype.buildShareGroupPolicyTables = function(host_preview, policy_grid, event)
    {
        var data = policy_grid.jqxGrid('getrowdata', event.args.rowindex);
        //Getting info about Share Group
        $.ajax({

            type: 'GET',
            url: 'http://'+host_preview.options.host_instance.options.base_ip_address+':'+host_preview.options.host_instance.options.base_ip_port+ host_preview.options.host_instance.options.shareGroupCommodities_url+ '/' + host_preview.options.host_instance.options.datasource+ '/' +data.CommodityId,//
            //   url: ap_queryAndDownload.CONFIG.shareGroupCommodities_url+ '/' + ap_queryAndDownload.CONFIG.datasource+ '/' +1250,

            success : function(response) {

                /* Convert the response in an object, i fneeded. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
                //if it's true there is at least one value in the end_date column that is null

                var hs_code = [];
                var hs_suffix = [];
                var hs_version = [];
                var short_description = [];
                var sgdata = new Array();
                for (var i = 0 ; i < json.length ; i++) {
                    var row= {};
                    for (var j = 0 ; j < json[i].length ; j++) {
//                            if((json[i][j] == null)||(typeof json[i][j] == 'undefined')) {
//                                json[i][j]="";
//                            }
                        switch(j)
                        {
                            case 0:
                                hs_code[i] = json[i][j];
                                row["hs_code"] = json[i][j];
                                break;
                            case 1:
                                hs_suffix[i] = json[i][j];
                                row["hs_suffix"] = json[i][j];
                                break;
                            case 2:
                                hs_version[i] = json[i][j];
                                row["hs_version"] = json[i][j];
                                break;
                            case 3:
                                short_description[i] = json[i][j];
                                row["short_description"] = json[i][j];
                                break;
                        }
                    }
                    sgdata[i] = row;
                }

                var data = new Array();
                var source =
                {
                    localdata: sgdata,
                    datatype: "array",
                    datafields:
                        [
                            { name: 'hs_code', type: 'string' },
                            { name: 'hs_suffix', type: 'string' },
                            { name: 'hs_version', type: 'string' },
                            { name: 'short_description', type: 'string' }
                        ]
                };

                var dataAdapter = new $.jqx.dataAdapter(source);

                var columnsrenderer = function (value) {
//                    return '<div style="text-align: center; margin: 1px;">' + value + '</div>';
                    return '<div class=fx_shared_group_table_render>' + value + '</div>';
                }

                $('#'+host_preview.options.shared_group_window).jqxWindow({
                    showCollapseButton: true, height: 250, width: '100%', title: 'Shared Group Details', position: 'center', isModal: true,
                    initContent: function () {
                        $('#'+host_preview.options.shared_group_grid).jqxGrid(
                            {
                                width: '100%',
                                height: 200,
                                columnsheight: 40,
                                rowsheight : 30,
                                source: dataAdapter,
                                columnsresize: true,
                                enabletooltips: true,

                                columns: [
                                    { text: 'HS Code', dataField: 'hs_code', width: '20%', renderer: columnsrenderer},
                                    { text: 'HS Suffix', dataField: 'hs_suffix', width: '10%', renderer: columnsrenderer},
                                    { text: 'HS Version', dataField: 'hs_version', width: '20%', renderer: columnsrenderer},
                                    { text: 'Short Description', dataField: 'short_description', width: '50%', renderer: columnsrenderer}
                                ]
                            });
                        $('#'+host_preview.options.shared_group_window).jqxWindow('focus');
                    }
                });

                if(host_preview.options.shared_group_window_once_open)
                {
                    $('#'+host_preview.options.shared_group_grid).jqxGrid(
                        {
                            width: '100%',
                            height: 200,
                            columnsheight: 40,
                            rowsheight : 30,
                            source: dataAdapter,
                            columnsresize: true,
                            enabletooltips: true,

                            columns: [
                                { text: 'HS Code', dataField: 'hs_code', width: '20%', renderer: columnsrenderer},
                                { text: 'HS Suffix', dataField: 'hs_suffix', width: '10%', renderer: columnsrenderer},
                                { text: 'HS Version', dataField: 'hs_version', width: '20%', renderer: columnsrenderer},
                                { text: 'Short Description', dataField: 'short_description', width: '50%', renderer: columnsrenderer}
                            ]
                        });
                }
                host_preview.options.shared_group_window_once_open = true;
                $('#'+host_preview.options.shared_group_window).jqxWindow('open');
            },
            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    };

    HostPreview.prototype.additional_info_container_build = function(host_preview, datarecord)
    {
//        var container = $('<div style="margin: 5px;"></div>')
//        var leftcolumn = $('<div style="float: left; width: 45%;"></div>');
//        var rightcolumn = $('<div style="float: left; width: 40%;"></div>');
        var container = $('<div class=fx_additional_info_content_container></div>')
        var leftcolumn = $('<div class=fx_additional_info_content_left_column></div>');
        var rightcolumn = $('<div class=fx_additional_info_content_right_column></div>');
        container.append(leftcolumn);
        container.append(rightcolumn);

        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("HsVersion", leftcolumn, "HS Version", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("HsCode", leftcolumn, "HS Code", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("HsSuffix", leftcolumn, "HS Suffix", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("PolicyElement", leftcolumn, "PolicyElement", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("StartDate", leftcolumn, "StartDate", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("EndDate", leftcolumn, "EndDate", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("Unit", leftcolumn, "Unit", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("Value", leftcolumn, "Value", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("ValueText", leftcolumn, "ValueText", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("ValueType", leftcolumn, "ValueType", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("Exemptions", leftcolumn, "Exemptions", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("LocalCondition", leftcolumn, "LocalCondition", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("Notes", leftcolumn, "Notes", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("Link", leftcolumn, "Link", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("Source", leftcolumn, "Source", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("TitleOfNotice", leftcolumn, "TitleOfNotice", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("LegalBasisName", leftcolumn, "LegalBasisName", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("DateOfPublication", leftcolumn, "DateOfPublication", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("ImposedEndDate", leftcolumn, "ImposedEndDate", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("MeasureDescription", leftcolumn, "MeasureDescription", datarecord);

        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("SecondGenerationSpecific", rightcolumn, "SecondGenerationSpecific", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("BenchmarkTax", rightcolumn, "BenchmarkTax", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("BenchmarkProduct", rightcolumn, "BenchmarkProduct", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("TaxRateBiofuel", rightcolumn, "TaxRateBiofuel", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("TaxRateBenchmark", rightcolumn, "TaxRateBenchmark", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("StartDateTax", rightcolumn, "StartDateTax", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("BenchmarkLink", rightcolumn, "BenchmarkLink", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("OriginalDataset", rightcolumn, "OriginalDataset", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("TypeOfChangeName", rightcolumn, "TypeOfChangeName", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("ProductOriginalHs", rightcolumn, "ProductOriginalHs", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("ProductOriginalName", rightcolumn, "ProductOriginalName", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("ImplementationProcedure", rightcolumn, "ImplementationProcedure", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("XsYearType", rightcolumn, "XsYearType", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("LinkPdf", rightcolumn, "LinkPdf", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("BenchmarkLinkPdf", rightcolumn, "BenchmarkLinkPdf", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("ShortDescription", rightcolumn, "ShortDescription", datarecord);
        host_preview.options.host_utility_instance.checkAdditional_info_window_Datafield("SharedGroupCode", rightcolumn, "SharedGroupCode", datarecord);

//        var hs_version = "<div style='margin: 10px;'><b>Hs Version:</b> " + datarecord["HsVersion"] + "</div>";
//            $(leftcolumn).append(hs_version);
//        var hs_code = "<div style='margin: 10px;'><b>Hs Code:</b> " + datarecord["HsCode"] + "</div>";
//        $(leftcolumn).append(hs_code);
//        var hs_suffix = "<div style='margin: 10px;'><b>Hs Suffix:</b> " + datarecord["HsSuffix"] + "</div>";
//        $(leftcolumn).append(hs_suffix);
//        var policy_element = "<div style='margin: 10px;'><b>Policy Element:</b> " + datarecord["PolicyElement"] + "</div>";
//        $(leftcolumn).append(policy_element);
//        var start_date = "<div style='margin: 10px;'><b>Start Date:</b> " + datarecord["StartDate"] + "</div>";
//        $(leftcolumn).append(start_date);
//        var end_date = "<div style='margin: 10px;'><b>End Date:</b> " + datarecord["EndDate"] + "</div>";
//        $(leftcolumn).append(end_date);
//        var units = "<div style='margin: 10px;'><b>Unit:</b> " + datarecord["Unit"] + "</div>";
//        $(leftcolumn).append(units);
//        var value = "<div style='margin: 10px;'><b>Value:</b> " + datarecord["Value"] + "</div>";
//        $(leftcolumn).append(value);
//        var value_text = "<div style='margin: 10px;'><b>Value Text:</b> " + datarecord["ValueText"] + "</div>";
//        $(leftcolumn).append(value_text);
//        var value_type = "<div style='margin: 10px;'><b>Value Type:</b> " + datarecord["ValueType"] + "</div>";
//        $(leftcolumn).append(value_type);
//
//        var exemptions = "<div style='margin: 10px;'><b>Exemptions:</b> " + datarecord["Exemptions"] + "</div>";
//        $(leftcolumn).append(exemptions);
//        var location_condition = "<div style='margin: 10px;'><b>Local Condition:</b> " + datarecord["LocalCondition"] + "</div>";
//        $(leftcolumn).append(location_condition);
//        var notes = "<div style='margin: 10px;'><b>Notes:</b> " + datarecord["Notes"] + "</div>";
//        $(leftcolumn).append(notes);
//        var link = "<div style='margin: 10px;'><b>Link:</b> " + datarecord["Link"] + "</div>";
//        $(leftcolumn).append(link);
//        var source = "<div style='margin: 10px;'><b>Source:</b> " + datarecord["Source"] + "</div>";
//        $(leftcolumn).append(source);
//        var title_of_notice = "<div style='margin: 10px;'><b>Title Of Notice:</b> " + datarecord["TitleOfNotice"] + "</div>";
//        $(leftcolumn).append(title_of_notice);
//        var legal_basis_name = "<div style='margin: 10px;'><b>Legal Basis Name:</b> " + datarecord["LegalBasisName"] + "</div>";
//        $(leftcolumn).append(legal_basis_name);
//        var date_of_publication = "<div style='margin: 10px;'><b>Date Of Publication:</b> " + datarecord["DateOfPublication"] + "</div>";
//        $(leftcolumn).append(date_of_publication);
//        var imposed_end_date = "<div style='margin: 10px;'><b>Imposed End Date:</b> " + datarecord["ImposedEndDate"] + "</div>";
//        $(leftcolumn).append(imposed_end_date);
//
//        var second_generation_specific = "<div style='margin: 10px;'><b>Second Generation Specific:</b> " + datarecord["SecondGenerationSpecific"] + "</div>";
//        $(rightcolumn).append(second_generation_specific);
//        var benchmark_tax = "<div style='margin: 10px;'><b>Benchmark Tax:</b> " + datarecord["BenchmarkTax"] + "</div>";
//        $(rightcolumn).append(benchmark_tax);
//        var benchmark_product = "<div style='margin: 10px;'><b>Benchmark Product:</b> " + datarecord["BenchmarkProduct"] + "</div>";
//        $(rightcolumn).append(benchmark_product);
//        var tax_rate_biofuel = "<div style='margin: 10px;'><b>Tax Rate Biofuel:</b> " + datarecord["TaxRateBiofuel"] + "</div>";
//        $(rightcolumn).append(tax_rate_biofuel);
//        var tax_rate_benchmark = "<div style='margin: 10px;'><b>Tax Rate Benchmark:</b> " + datarecord["TaxRateBenchmark"] + "</div>";
//        $(rightcolumn).append(tax_rate_benchmark);
//        var start_date_tax = "<div style='margin: 10px;'><b>Start Date Tax:</b> " + datarecord["StartDateTax"] + "</div>";
//        $(rightcolumn).append(start_date_tax);
//        var benchmark_link = "<div style='margin: 10px;'><b>Benchmark Link:</b> " + datarecord["BenchmarkLink"] + "</div>";
//        $(rightcolumn).append(benchmark_link);
//        var original_dataset = "<div style='margin: 10px;'><b>Original Dataset:</b> " + datarecord["OriginalDataset"] + "</div>";
//        $(rightcolumn).append(original_dataset);
//        //var type_of_change_code = "<div style='margin: 10px;'><b>"+$.i18n.prop('_type_of_change_code') +":</b> " + datarecord.type_of_change_code[index] + "</div>";
//        //$(rightcolumn).append(type_of_change_code);
//        var type_of_change_name = "<div style='margin: 10px;'><b>Type Of Change Name:</b> " + datarecord["TypeOfChangeName"] + "</div>";
//        $(rightcolumn).append(type_of_change_name);
//        var measure_descr = "<div style='margin: 10px;'><b>Measure Description:</b> " + datarecord["MeasureDescription"] + "</div>";
//        $(leftcolumn).append(measure_descr);
//        var product_original_hs = "<div style='margin: 10px;'><b>Product Original Hs:</b> " + datarecord["ProductOriginalHs"] + "</div>";
//        $(rightcolumn).append(product_original_hs);
//        var product_original_name = "<div style='margin: 10px;'><b>Product Original Name:</b> " + datarecord["ProductOriginalName"] + "</div>";
//        $(rightcolumn).append(product_original_name);
//
//        var implementationprocedure = "<div style='margin: 10px;'><b>Implementation Procedure:</b> " + datarecord["ImplementationProcedure"] + "</div>";
//        $(rightcolumn).append(implementationprocedure);
//        var xs_yeartype = "<div style='margin: 10px;'><b>Xs Year Type:</b> " + datarecord["XsYearType"] + "</div>";
//        $(rightcolumn).append(xs_yeartype);
//        var link_pdf = "<div style='margin: 10px;'><b>Link Pdf:</b> " + datarecord["LinkPdf"] + "</div>";
//        $(rightcolumn).append(link_pdf);
//        var benchmark_link_pdf = "<div style='margin: 10px;'><b>Benchmark Link Pdf:</b> " + datarecord["BenchmarkLinkPdf"] + "</div>";
//        $(rightcolumn).append(benchmark_link_pdf);
//        var short_description = "<div style='margin: 10px;'><b>Short Description:</b> " + datarecord["ShortDescription"] + "</div>";
//        $(rightcolumn).append(short_description);
//        var shared_group_code = "<div style='margin: 10px;'><b>Shared Group Code:</b> " + datarecord["SharedGroupCode"] + "</div>";
//        $(rightcolumn).append(shared_group_code);

        $('#'+host_preview.options.additional_info_policy_container).children().remove();
        $('#'+host_preview.options.additional_info_policy_container).html(container.html());
    };

    HostPreview.prototype.buildAdditionalPolicyTables = function(host_preview, policy_grid, event)
    {
        var datarecord = policy_grid.jqxGrid('getrowdata', event.args.rowindex);

        $('#'+host_preview.options.additional_info_policy_window).jqxWindow({
//            showCollapseButton: true, height: 400, width: '100%', title: 'Shared Group Details', position: 'bottom', isModal: true,
            showCollapseButton: true, height: 400, width: '100%', title: 'Additional Info', isModal: true,
            initContent: function () {
                host_preview.additional_info_container_build(host_preview, datarecord);
                $('#'+host_preview.options.additional_info_policy_window).jqxWindow('focus');
            }
        });

        if(host_preview.options.additional_info_policy_window_once_open)
        {
            host_preview.additional_info_container_build(host_preview, datarecord);
        }
        host_preview.options.additional_info_policy_window_once_open = true;

        $('#'+host_preview.options.additional_info_policy_window).jqxWindow('open');
    };

    HostPreview.prototype.standard_tab_preview_creation = function(data, host)
    {
        this.preview_action(data, host);
    };

    HostPreview.prototype.preview_render = function(data, host)
    {
        //Events Registration
        this.settingEvents();

        this.options.host_instance = host;

        this.options.host_utility_instance = new HostUtility();

        //Standard Preview Tab
        this.standard_tab_preview_creation(data, host);
    };

    HostPreview.prototype.fullScreenContent = function()
    {
        var container = $('<div class=fx_fullscreen_content_container></div>')  ;
//        var leftcolumn = $('<div style="margin: 20px; float: left; width: 97%;"></div>');
        var leftcolumn = $('<div class=fx_fullscreen_content_left_column></div>');
        container.append(leftcolumn);
        var html = $('<html></html>');
        var body = $('<body></body>');
        var htmlcontainer = $('<div style="overflow:auto; height: '+(screen.availHeight-50)+'px;"></div>');

        var x = "<div class=fx_fullscreen_content_element><b>"+"uid" +":</b> " + "" + "</div>";
        $(htmlcontainer).append(x1);
        var x1 = "<div class=fx_fullscreen_content_element><b>"+"language" +":</b> " + "EN" + "</div>";
        $(htmlcontainer).append(x1);
        var x2 = "<div class=fx_fullscreen_content_element><b>"+"title" +":</b> " + "Countervailing measures imposed by Australia on biodiesel exported from the USA" + "</div>";
        $(htmlcontainer).append(x2);
        var x3 = "<div class=fx_fullscreen_content_element><b>"+"creationDate" +":</b> " + "18/03/2014" + "</div>";
        $(htmlcontainer).append(x3);
        var x4 = "<div class=fx_fullscreen_content_element><b>"+"characterSet" +":</b> " + "UTF8" + "</div>";
        $(htmlcontainer).append(x4);
        var x5 = "<div class=fx_fullscreen_content_element><b>"+"contact" +":</b> " + "CI_ResponsibleParty" + "</div>";
        $(htmlcontainer).append(x5);
        var x6 = "<div class=fx_fullscreen_content_element><b>"+"name" +":</b> " + "Annelies Deuss" + "</div>";
        $(htmlcontainer).append(x6);
        var x7 = "<div class=fx_fullscreen_content_element><b>"+"organization" +":</b> " + "OECD" + "</div>";
        $(htmlcontainer).append(x7);
        var x8 = "<div class=fx_fullscreen_content_element><b>"+"position" +":</b> " + "Analyst TAD/ATM" + "</div>";
        $(htmlcontainer).append(x8);
        var x9 = "<div class=fx_fullscreen_content_element><b>"+"contactInfo" +":</b> " + "CI_Contact" + "</div>";
        $(htmlcontainer).append(x9);
        var x10 = "<div class=fx_fullscreen_content_element><b>"+"role" +":</b> " + "007, 008" + "</div>";
        $(htmlcontainer).append(x10);
        var x11 = "<div class=fx_fullscreen_content_element><b>"+"phone" +":</b> " + "+(33-1) 45 24 96 52" + "</div>";
        $(htmlcontainer).append(x11);
        var x12 = "<div class=fx_fullscreen_content_element><b>"+"address" +":</b> " + "2, rue André Pascal, 75775 Paris Cedex 16, France" + "</div>";
        $(htmlcontainer).append(x12);
        var x13 = "<div class=fx_fullscreen_content_element><b>"+"emailAddress" +":</b> " + "Annelies.DEUSS@oecd.org" + "</div>";
        $(htmlcontainer).append(x13);
        var x14 = "<div class=fx_fullscreen_content_element><b>"+"hoursOfService" +":</b> " + "9:00 to 18:00" + "</div>";
        $(htmlcontainer).append(x14);
//        var x15 = "<div style='margin: 10px;'><b>"+"contactInstruction" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x15);
        var x16 = "<div class=fx_fullscreen_content_element><b>"+"keyWords" +":</b> " + "Countervailing duty, biodiesel, Australia, USA" + "</div>";
        $(htmlcontainer).append(x16);
        var x17 = "<div class=fx_fullscreen_content_element><b>"+"description" +":</b> " + "Countervailing duty rates imposed by Australia on biodiesel exported from the USA are recorded for HS codes 38260010 and 38260020, version HS2012 of the internationally standardized product nomenclature, the Harmonized System (HS) used by WTO Members, and assigned to the Product_AMIS aggregate 'Biodiesel'. The duty rate might be indicated as a number or as a text if some additional explanation is required" + "</div>";
        $(htmlcontainer).append(x17);
        var x18 = "<div class=fx_fullscreen_content_element><b>"+"summary" +":</b> " + "007, 008" + "</div>";
        $(htmlcontainer).append(x18);
        var x19 = "<div class=fx_fullscreen_content_element><b>"+"classificationSystem" +":</b> " + "For countries: FAO-GAUL classification . For commodities: Harmonized System (HS) used by WTO Members, version HS2012. Product aggregation and policy domains, policy types and measures are classified according to an AMIS internal classification system (provided in the home page www. (area with standards)." + "</div>";
        $(htmlcontainer).append(x19);
        var x20 = "<div class=fx_fullscreen_content_element><b>"+"statisticalPopulation" +":</b> " + "Policy measures targeted at wheat, maize, rice, soyabeans and biofuel transport liquids implemented on AMIS countries" + "</div>";
        $(htmlcontainer).append(x20);
        var x21 = "<div class=fx_fullscreen_content_element><b>"+"referencePeriod" +":</b> " + "From 18-04-2011 to 18-04-2016" + "</div>";
        $(htmlcontainer).append(x21);
//        var x22 = "<div style='margin: 10px;'><b>"+"referenceArea" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x22);
        var x23 = "<div class=fx_fullscreen_content_element><b>"+"coverageSector" +":</b> " + "Crops: wheat, maize, rice, soyabean and biofuels products: ethanol, biodiesel." + "</div>";
        $(htmlcontainer).append(x23);
//        var x24 = "<div style='margin: 10px;'><b>"+"sectorCoded" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x24);
        var x25 = "<div class=fx_fullscreen_content_element><b>"+"coverageTime" +":</b> " + "Data for the period starting from 2011" + "</div>";
        $(htmlcontainer).append(x25);
        var x26 = "<div class=fx_fullscreen_content_element><b>"+"coverageGeographic" +":</b> " + "Argentina, Australia, Brazil, Canada, China, European Union, France, Germany, India, Indonesia, Italy, Japan, Mexico, Republic of Korea, Russian Federation, Saudi Arabia, Turkey, U.K. of Great Britain and Northern Ireland and United States of America from the G20, and Egypt, Kazakhstan, Nigeria, Philippines, South Africa, Spain, Thailand, Ukraine and Viet Nam" + "</div>";
        $(htmlcontainer).append(x26);
        var x27 = "<div class=fx_fullscreen_content_element><b>"+"statisticalUnit" +":</b> " + "Duty rates applied" + "</div>";
        $(htmlcontainer).append(x27);
        var x28 = "<div class=fx_fullscreen_content_element><b>"+"unitOfMeasure" +":</b> " + "unkwnown" + "</div>";
        $(htmlcontainer).append(x28);
        var x29 = "<div class=fx_fullscreen_content_element><b>"+"unitOfMeasureDetails" +":</b> " + "Measurement units are not provided because duty rates are confidential" + "</div>";
        $(htmlcontainer).append(x29);
        var x30 = "<div class=fx_fullscreen_content_element><b>"+"institutionalMandateDataSharing" +":</b> " + "WTO?" + "</div>";
        $(htmlcontainer).append(x30);
//        var x31 = "<div style='margin: 10px;'><b>"+"legalActAgreements" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x31);
//        var x32 = "<div style='margin: 10px;'><b>"+"Punctuality" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x32);
//        var x33 = "<div style='margin: 10px;'><b>"+"costAndBurden" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x33);
//        var x34 = "<div style='margin: 10px;'><b>"+"efficiencyManagement" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x34);
//        var x35 = "<div style='margin: 10px;'><b>"+"costAndBurdenResources" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x35);
        var x36 = "<div class=fx_fullscreen_content_element><b>"+"UserNeeds" +":</b> " + "The main users are AMIS analysts, other international organizations, ministries and government agencies, trade and professional associations, research institutes and universities, journalists and general public. The AMIS team is not aware of unmet needs." + "</div>";
        $(htmlcontainer).append(x36);
        var x37 = "<div class=fx_fullscreen_content_element><b>"+"UserSatisfaction" +":</b> " + "No user satisfaction studies have been conducted which may explain why the AMIS is not aware of unmet user needs." + "</div>";
        $(htmlcontainer).append(x37);
        var x38 = "<div class=fx_fullscreen_content_element><b>"+"comparabilityDomains" +":</b> " + "There is a limitation in the comparability across individual commodities/products because product data are sometimes recorded in different HS versions or in the case of domestic measures there are not standard international classifications based on which policy measures are issued." + "</div>";
        $(htmlcontainer).append(x38);
//        var x39 = "<div style='margin: 10px;'><b>"+"comparabilityTime" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x39);
        var x40 = "<div class=fx_fullscreen_content_element><b>"+"comparabilityGeographical" +":</b> " + "There is limited geographical comparability due to differences between countries in methods, coverage or currencies, except for regions with homogenous countries, e.g. EU countries, which are bound by EU trade regulations. Furthermore for some countries information on the duty level remains confidential or duty rates are different for different producing companies." + "</div>";
        $(htmlcontainer).append(x40);
//        var x41 = "<div style='margin: 10px;'><b>"+"coherenceCrossDomain" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x41);
//        var x42 = "<div style='margin: 10px;'><b>"+"coherenceIntern" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x42);
        var x43 = "<div class=fx_fullscreen_content_element><b>"+"statisticalConceptAndDefinitions" +":</b> " + "Applied duty rate" + "</div>";
        $(htmlcontainer).append(x43);
        var x44 = "<div class=fx_fullscreen_content_element><b>"+"documentsOfMetodology" +":</b> " + "URUGUAY ROUND AGREEMENT, Agreement on Subsidies and Countervailing Measures. 'Members shall take all necessary steps to ensure that the imposition of a countervailing duty  on any product of the territory of any Member imported into the territory of another Member is in accordance with the provisions of Article VI of GATT 1994 and the terms of this Agreement.  Countervailing duties may only be imposed pursuant to investigations initiated and conducted in accordance with the provisions of this Agreement and the Agreement on Agriculture'. http://www.wto.org/english/docs_e/legal_e/24-scm.pdf" + "</div>";
        $(htmlcontainer).append(x44);
        var x45 = "<div class=fx_fullscreen_content_element><b>"+"dataCollection" +":</b> " + "Data has been collected from on-line available country legislations. In the future it is planned to make avaible for country officials an on-line input form to allow for the continuosly update of the data" + "</div>";
        $(htmlcontainer).append(x45);
        var x46 = "<div class=fx_fullscreen_content_element><b>"+"dataCompilation" +":</b> " + "Irregularly" + "</div>";
        $(htmlcontainer).append(x46);
        var x47 = "<div class=fx_fullscreen_content_element><b>"+"dataSource" +":</b> " + "The main source are the country legislations and regulations issued by Ministries or government agencies" + "</div>";
        $(htmlcontainer).append(x47);
        var x48 = "<div class=fx_fullscreen_content_element><b>"+"frequencyOfCollection" +":</b> " + "Data is expected to be annually updated" + "</div>";
        $(htmlcontainer).append(x48);
//        var x49 = "<div style='margin: 10px;'><b>"+"indexType" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x49);
//        var x50 = "<div style='margin: 10px;'><b>"+"IndexTypeCoded" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x50);
//        var x51 = "<div style='margin: 10px;'><b>"+"basePeriod" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x51);
        var x52 = "<div class=fx_fullscreen_content_element><b>"+"Adjustment" +":</b> " + "No adjustments are made" + "</div>";
        $(htmlcontainer).append(x52);
//        var x53 = "<div style='margin: 10px;'><b>"+"AdjustmentCoded" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x53);
        var x54 = "<div class=fx_fullscreen_content_element><b>"+"Aggregation" +":</b> " + "No aggregation rules apply" + "</div>";
        $(htmlcontainer).append(x54);
        var x55 = "<div class=fx_fullscreen_content_element><b>"+"qualityManagement" +":</b> " + "There is a methodological document that documents the structure, the procedures, the data production and dissemination proccess. Responsibilities and yet described in the methodological document" + "</div>";
        $(htmlcontainer).append(x55);
        var x56 = "<div class=fx_fullscreen_content_element><b>"+"qualityAssessment" +":</b> " + "There are no routines for assessing the quality, except for some input validation. Ideally country officials should validate the policy data input by the OECD. Data input by the country officials should be double check by the OECD." + "</div>";
        $(htmlcontainer).append(x56);
        var x57 = "<div class=fx_fullscreen_content_element><b>"+"qualityAssurance" +":</b> " + "Not specified" + "</div>";
        $(htmlcontainer).append(x57);
        var x58 = "<div class=fx_fullscreen_content_element><b>"+"qualityDocumentation" +":</b> " + "No quality documentation has been created" + "</div>";
        $(htmlcontainer).append(x58);
//        var x59 = "<div style='margin: 10px;'><b>"+"dataValidationIntermediate" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x59);
//        var x60 = "<div style='margin: 10px;'><b>"+"dataValidationOutput" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x60);
//        var x61 = "<div style='margin: 10px;'><b>"+"dataValidationResource" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x61);
//        var x62 = "<div style='margin: 10px;'><b>"+"clarity" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x62);
        var x63 = "<div class=fx_fullscreen_content_element><b>"+"completeness" +":</b> " + "Dataset is complete, although the values of the measure remain condifential as indicated in the official document from the Australian Government" + "</div>";
        $(htmlcontainer).append(x63);
//        var x64 = "<div style='margin: 10px;'><b>"+"compleetenessPercentage" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x64);
//        var x65 = "<div style='margin: 10px;'><b>"+"accuracyOverall" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x65);
//        var x66 = "<div style='margin: 10px;'><b>"+"accuracySampling" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x66);
//        var x67 = "<div style='margin: 10px;'><b>"+"accuracyNonSampling" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x67);
//        var x68 = "<div style='margin: 10px;'><b>"+"confidentialityPolicy" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x68);
        var x69 = "<div class=fx_fullscreen_content_element><b>"+"confidantialityDataSharing" +":</b> " + "Only non-confidential data are collected and recorded" + "</div>";
        $(htmlcontainer).append(x69);
        var x70 = "<div class=fx_fullscreen_content_element><b>"+"confidentialityStatus" +":</b> " + "Secondary confidentiality set by the sender, not for publication" + "</div>";
        $(htmlcontainer).append(x70);
        var x71 = "<div class=fx_fullscreen_content_element><b>"+"releaseCalendar" +":</b> " + "Not yet defined" + "</div>";
        $(htmlcontainer).append(x71);
//        var x72 = "<div style='margin: 10px;'><b>"+"releaseCalendarAccess" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x72);
        var x73 = "<div class=fx_fullscreen_content_element><b>"+"releaseTrasparency" +":</b> " + "Not yet defined" + "</div>";
        $(htmlcontainer).append(x73);
        var x74 = "<div class=fx_fullscreen_content_element><b>"+"releaseUserAccess" +":</b> " + "Data are first released only to country officials for their validation, then to the general public. How users are informed that the data are being released has not yet been defined" + "</div>";
        $(htmlcontainer).append(x74);
        var x75 = "<div class=fx_fullscreen_content_element><b>"+"onlineDatabase" +":</b> " + "Free consultation on the web." + "</div>";
        $(htmlcontainer).append(x75);
        var x76 = "<div class=fx_fullscreen_content_element><b>"+"disseminationFormat" +":</b> " + "Not yet defined" + "</div>";
        $(htmlcontainer).append(x76);
        var x77 = "<div class=fx_fullscreen_content_element><b>"+"disseminationPeriodicity" +":</b> " + "Not yet defined" + "</div>";
        $(htmlcontainer).append(x77);
        var x78 = "<div class=fx_fullscreen_content_element><b>"+"embargoTime" +":</b> " + "Not yet defined" + "</div>";
        $(htmlcontainer).append(x78);
        var x79 = "<div class=fx_fullscreen_content_element><b>"+"maintenanceAgency" +":</b> " + "OECD" + "</div>";
        $(htmlcontainer).append(x79);
//        var x80 = "<div style='margin: 10px;'><b>"+"revisionPolicy" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x80);
        var x81 = "<div class=fx_fullscreen_content_element><b>"+"revisionPractice" +":</b> " + "Preliminary data are compiled and country officials are asked to review it" + "</div>";
        $(htmlcontainer).append(x81);
        var x82 = "<div class=fx_fullscreen_content_element><b>"+"revisionStudies" +":</b> " + "Not planned" + "</div>";
        $(htmlcontainer).append(x82);
        var x83 = "<div class=fx_fullscreen_content_element><b>"+"updateDate" +":</b> " + "Not defined yet" + "</div>";
        $(htmlcontainer).append(x83);
        var x84 = "<div class=fx_fullscreen_content_element><b>"+"referenceUpdateDate" +":</b> " + "Not defined yet" + "</div>";
        $(htmlcontainer).append(x84);
        var x85 = "<div class=fx_fullscreen_content_element><b>"+"updatePeriodicity" +":</b> " + "Not defined yet" + "</div>";
        $(htmlcontainer).append(x85);
        var x86 = "<div class=fx_fullscreen_content_element><b>"+"pubblications" +":</b> " + "CI_Citation" + "</div>";
        $(htmlcontainer).append(x86);
        var x87 = "<div class=fx_fullscreen_content_element><b>"+"attachments" +":</b> " + "http://www.adcommission.gov.au/system/CurrentMeasures.asp" + "</div>";
        $(htmlcontainer).append(x87);
//        var x88 = "<div style='margin: 10px;'><b>"+"news" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x88);
//        var x89 = "<div style='margin: 10px;'><b>"+"otherDisseminatedData" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x89);
        var x90 = "<div class=fx_fullscreen_content_element><b>"+"documentKind" +":</b> " + "Legal document: Decision" + "</div>";
        $(htmlcontainer).append(x90);
        var x91 = "<div class=fx_fullscreen_content_element><b>"+"title" +":</b> " + "DUMPING COMMODITY REGISTER, BIODIESEL EXPORTED FROM THE UNITED STATES OF AMERICA" + "</div>";
        $(htmlcontainer).append(x91);
        var x92 = "<div class=fx_fullscreen_content_element><b>"+"date" +":</b> " + "01/01/2012" + "</div>";
        $(htmlcontainer).append(x92);
        var x93 = "<div class=fx_fullscreen_content_element><b>"+"citedResponsibleParty" +":</b> " + "CI_ResponsibleParty" + "</div>";
        $(htmlcontainer).append(x93);
//        var x94 = "<div style='margin: 10px;'><b>"+"periodicity" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x94);
        var x95 = "<div class=fx_fullscreen_content_element><b>"+"link" +":</b> " + "http://www.adcommission.gov.au/system/documents/Bio-D38260010-120315.pdf" + "</div>";
        $(htmlcontainer).append(x95);
        //To remove start
//        var x96 = "<div style='margin: 10px;'><b>"+"name" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x96);
//        var x97 = "<div style='margin: 10px;'><b>"+"organization" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x97);
//        var x98 = "<div style='margin: 10px;'><b>"+"position" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x98);
//        var x99 = "<div style='margin: 10px;'><b>"+"contactInfo" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x99);
//        var x100 = "<div style='margin: 10px;'><b>"+"role" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x100);
//        var x101 = "<div style='margin: 10px;'><b>"+"phone " +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x101);
//        var x102 = "<div style='margin: 10px;'><b>"+"address" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x102);
//        var x103 = "<div style='margin: 10px;'><b>"+"emailAddress" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x103);
//        var x104 = "<div style='margin: 10px;'><b>"+"hoursOfService" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x104);
//        var x105 = "<div style='margin: 10px;'><b>"+"contractIntruction" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x105);
        //To remove end
        var x106 = "<div class=fx_fullscreen_content_element><b>"+"name" +":</b> " + "The Commissioner" + "</div>";
        $(htmlcontainer).append(x106);
        var x107 = "<div class=fx_fullscreen_content_element><b>"+"organization" +":</b> " + "Anti-Dumping Commission, Australian Government" + "</div>";
        $(htmlcontainer).append(x107);
//        var x108 = "<div style='margin: 10px;'><b>"+"position" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x108);
        var x109 = "<div class=fx_fullscreen_content_element><b>"+"contactInfo" +":</b> " + "CI_Contact" + "</div>";
        $(htmlcontainer).append(x109);
        var x110 = "<div class=fx_fullscreen_content_element><b>"+"role" +":</b> " + "'001" + "</div>";
        $(htmlcontainer).append(x110);
        var x111 = "<div class=fx_fullscreen_content_element><b>"+"phone" +":</b> " + "+61 2 6275 6066 " + "</div>";
        $(htmlcontainer).append(x111);
        var x112 = "<div class=fx_fullscreen_content_element><b>"+"address" +":</b> " + "Melbourne, Ground Floor Customs House Docklands, 1010 La Trobe Street, Docklands VIC 3008" + "</div>";
        $(htmlcontainer).append(x112);
        var x113 = "<div class=fx_fullscreen_content_element><b>"+"emailAddress" +":</b> " + "clientsupport@adcommission.gov.au" + "</div>";
        $(htmlcontainer).append(x113);
//        var x114 = "<div style='margin: 10px;'><b>"+"hoursOfService" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x114);
//        var x115 = "<div style='margin: 10px;'><b>"+"contractIntruction" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x115);
//        var x116 = "<div style='margin: 10px;'><b>"+"documentKind" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x116);
//        var x117 = "<div style='margin: 10px;'><b>"+"title" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x117);
//        var x118 = "<div style='margin: 10px;'><b>"+"date" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x118);
//        var x119 = "<div style='margin: 10px;'><b>"+"citedResponsibleParty" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x119);
//        var x120 = "<div style='margin: 10px;'><b>"+"periodicity" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x120);

        $(body).append(htmlcontainer);
        $(html).append(body);
        $(leftcolumn).append(html);

//        var x = "<div style='margin: 10px;'><b>"+"uid" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x1);
//        var x1 = "<div style='margin: 10px;'><b>"+"language" +":</b> " + "EN" + "</div>";
//        $(leftcolumn).append(x1);
//        var x2 = "<div style='margin: 10px;'><b>"+"title" +":</b> " + "Countervailing measures imposed by Australia on biodiesel exported from the USA" + "</div>";
//        $(leftcolumn).append(x2);
//        var x3 = "<div style='margin: 10px;'><b>"+"creationDate" +":</b> " + "18/03/2014" + "</div>";
//        $(leftcolumn).append(x3);
//        var x4 = "<div style='margin: 10px;'><b>"+"characterSet" +":</b> " + "UTF8" + "</div>";
//        $(leftcolumn).append(x4);
//        var x5 = "<div style='margin: 10px;'><b>"+"contact" +":</b> " + "CI_ResponsibleParty" + "</div>";
//        $(leftcolumn).append(x5);
//        var x6 = "<div style='margin: 10px;'><b>"+"name" +":</b> " + "Annelies Deuss" + "</div>";
//        $(leftcolumn).append(x6);
//        var x7 = "<div style='margin: 10px;'><b>"+"organization" +":</b> " + "OECD" + "</div>";
//        $(leftcolumn).append(x7);
//        var x8 = "<div style='margin: 10px;'><b>"+"position" +":</b> " + "Analyst TAD/ATM" + "</div>";
//        $(leftcolumn).append(x8);
//        var x9 = "<div style='margin: 10px;'><b>"+"contactInfo" +":</b> " + "CI_Contact" + "</div>";
//        $(leftcolumn).append(x9);
//        var x10 = "<div style='margin: 10px;'><b>"+"role" +":</b> " + "007, 008" + "</div>";
//        $(leftcolumn).append(x10);
//        var x11 = "<div style='margin: 10px;'><b>"+"phone" +":</b> " + "+(33-1) 45 24 96 52" + "</div>";
//        $(leftcolumn).append(x11);
//        var x12 = "<div style='margin: 10px;'><b>"+"address" +":</b> " + "2, rue André Pascal, 75775 Paris Cedex 16, France" + "</div>";
//        $(leftcolumn).append(x12);
//        var x13 = "<div style='margin: 10px;'><b>"+"emailAddress" +":</b> " + "Annelies.DEUSS@oecd.org" + "</div>";
//        $(leftcolumn).append(x13);
//        var x14 = "<div style='margin: 10px;'><b>"+"hoursOfService" +":</b> " + "9:00 to 18:00" + "</div>";
//        $(leftcolumn).append(x14);
//        var x15 = "<div style='margin: 10px;'><b>"+"contactInstruction" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x15);
//        var x16 = "<div style='margin: 10px;'><b>"+"keyWords" +":</b> " + "Countervailing duty, biodiesel, Australia, USA" + "</div>";
//        $(leftcolumn).append(x16);
//        var x17 = "<div style='margin: 10px;'><b>"+"description" +":</b> " + "Countervailing duty rates imposed by Australia on biodiesel exported from the USA are recorded for HS codes 38260010 and 38260020, version HS2012 of the internationally standardized product nomenclature, the Harmonized System (HS) used by WTO Members, and assigned to the Product_AMIS aggregate 'Biodiesel'. The duty rate might be indicated as a number or as a text if some additional explanation is required" + "</div>";
//        $(leftcolumn).append(x17);
//        var x18 = "<div style='margin: 10px;'><b>"+"summary" +":</b> " + "007, 008" + "</div>";
//        $(leftcolumn).append(x18);
//        var x19 = "<div style='margin: 10px;'><b>"+"classificationSystem" +":</b> " + "For countries: FAO-GAUL classification . For commodities: Harmonized System (HS) used by WTO Members, version HS2012. Product aggregation and policy domains, policy types and measures are classified according to an AMIS internal classification system (provided in the home page www. (area with standards)." + "</div>";
//        $(leftcolumn).append(x19);
//        var x20 = "<div style='margin: 10px;'><b>"+"statisticalPopulation" +":</b> " + "Policy measures targeted at wheat, maize, rice, soyabeans and biofuel transport liquids implemented on AMIS countries" + "</div>";
//        $(leftcolumn).append(x20);
//        var x21 = "<div style='margin: 10px;'><b>"+"referencePeriod" +":</b> " + "From 18-04-2011 to 18-04-2016" + "</div>";
//        $(leftcolumn).append(x21);
//        var x22 = "<div style='margin: 10px;'><b>"+"referenceArea" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x22);
//        var x23 = "<div style='margin: 10px;'><b>"+"coverageSector" +":</b> " + "Crops: wheat, maize, rice, soyabean and biofuels products: ethanol, biodiesel." + "</div>";
//        $(leftcolumn).append(x23);
//        var x24 = "<div style='margin: 10px;'><b>"+"sectorCoded" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x24);
//        var x25 = "<div style='margin: 10px;'><b>"+"coverageTime" +":</b> " + "Data for the period starting from 2011" + "</div>";
//        $(leftcolumn).append(x25);
//        var x26 = "<div style='margin: 10px;'><b>"+"coverageGeographic" +":</b> " + "Argentina, Australia, Brazil, Canada, China, European Union, France, Germany, India, Indonesia, Italy, Japan, Mexico, Republic of Korea, Russian Federation, Saudi Arabia, Turkey, U.K. of Great Britain and Northern Ireland and United States of America from the G20, and Egypt, Kazakhstan, Nigeria, Philippines, South Africa, Spain, Thailand, Ukraine and Viet Nam" + "</div>";
//        $(leftcolumn).append(x26);
//        var x27 = "<div style='margin: 10px;'><b>"+"statisticalUnit" +":</b> " + "Duty rates applied" + "</div>";
//        $(leftcolumn).append(x27);
//        var x28 = "<div style='margin: 10px;'><b>"+"unitOfMeasure" +":</b> " + "unkwnown" + "</div>";
//        $(leftcolumn).append(x28);
//        var x29 = "<div style='margin: 10px;'><b>"+"unitOfMeasureDetails" +":</b> " + "Measurement units are not provided because duty rates are confidential" + "</div>";
//        $(leftcolumn).append(x29);
//        var x30 = "<div style='margin: 10px;'><b>"+"institutionalMandateDataSharing" +":</b> " + "WTO?" + "</div>";
//        $(leftcolumn).append(x30);
//        var x31 = "<div style='margin: 10px;'><b>"+"legalActAgreements" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x31);
//        var x32 = "<div style='margin: 10px;'><b>"+"Punctuality" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x32);
//        var x33 = "<div style='margin: 10px;'><b>"+"costAndBurden" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x33);
//        var x34 = "<div style='margin: 10px;'><b>"+"efficiencyManagement" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x34);
//        var x35 = "<div style='margin: 10px;'><b>"+"costAndBurdenResources" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x35);
//        var x36 = "<div style='margin: 10px;'><b>"+"UserNeeds" +":</b> " + "The main users are AMIS analysts, other international organizations, ministries and government agencies, trade and professional associations, research institutes and universities, journalists and general public. The AMIS team is not aware of unmet needs." + "</div>";
//        $(leftcolumn).append(x36);
//        var x37 = "<div style='margin: 10px;'><b>"+"UserSatisfaction" +":</b> " + "No user satisfaction studies have been conducted which may explain why the AMIS is not aware of unmet user needs." + "</div>";
//        $(leftcolumn).append(x37);
//        var x38 = "<div style='margin: 10px;'><b>"+"comparabilityDomains" +":</b> " + "There is a limitation in the comparability across individual commodities/products because product data are sometimes recorded in different HS versions or in the case of domestic measures there are not standard international classifications based on which policy measures are issued." + "</div>";
//        $(leftcolumn).append(x38);
//        var x39 = "<div style='margin: 10px;'><b>"+"comparabilityTime" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x39);
//        var x40 = "<div style='margin: 10px;'><b>"+"comparabilityGeographical" +":</b> " + "There is limited geographical comparability due to differences between countries in methods, coverage or currencies, except for regions with homogenous countries, e.g. EU countries, which are bound by EU trade regulations. Furthermore for some countries information on the duty level remains confidential or duty rates are different for different producing companies." + "</div>";
//        $(leftcolumn).append(x40);
//        var x41 = "<div style='margin: 10px;'><b>"+"coherenceCrossDomain" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x41);
//        var x42 = "<div style='margin: 10px;'><b>"+"coherenceIntern" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x42);
//        var x43 = "<div style='margin: 10px;'><b>"+"statisticalConceptAndDefinitions" +":</b> " + "Applied duty rate" + "</div>";
//        $(leftcolumn).append(x43);
//        var x44 = "<div style='margin: 10px;'><b>"+"documentsOfMetodology" +":</b> " + "URUGUAY ROUND AGREEMENT, Agreement on Subsidies and Countervailing Measures. 'Members shall take all necessary steps to ensure that the imposition of a countervailing duty  on any product of the territory of any Member imported into the territory of another Member is in accordance with the provisions of Article VI of GATT 1994 and the terms of this Agreement.  Countervailing duties may only be imposed pursuant to investigations initiated and conducted in accordance with the provisions of this Agreement and the Agreement on Agriculture'. http://www.wto.org/english/docs_e/legal_e/24-scm.pdf" + "</div>";
//        $(leftcolumn).append(x44);
//        var x45 = "<div style='margin: 10px;'><b>"+"dataCollection" +":</b> " + "Data has been collected from on-line available country legislations. In the future it is planned to make avaible for country officials an on-line input form to allow for the continuosly update of the data" + "</div>";
//        $(leftcolumn).append(x45);
//        var x46 = "<div style='margin: 10px;'><b>"+"dataCompilation" +":</b> " + "Irregularly" + "</div>";
//        $(leftcolumn).append(x46);
//        var x47 = "<div style='margin: 10px;'><b>"+"dataSource" +":</b> " + "The main source are the country legislations and regulations issued by Ministries or government agencies" + "</div>";
//        $(leftcolumn).append(x47);

//        $("#metadata_fullScreenContent").children().remove();
        $("#metadata_fullScreenContent").html(container.html());
    }

    return HostPreview;

});

