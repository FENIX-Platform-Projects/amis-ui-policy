var ap_queryAndDownload = (function() {

    var CONFIG = {
        placeholderID   :   null,
        lang    :   null,
        I18N_prefix :   '',
        lang_ISO2   :   null,

        commodity_type  :   'commodity',
        country_type     :   'country',
        policy_type     :   'policyType',
        year_type     :   'yearType',

        //Selected Policy Domain
        policy_radio_checked    :   '',
        //Selected Commodity Domain
        commodity_radio_checked :   '',
        //Contains the list of commodity domain for each policy domain
        policy_commodity_domain_map :   null,
        //Contains the couple policy name, policy code... for the query after the preview
        policy_domain_map :   null,
        //Contains the couple policy name, commodity code... for the query after the preview
        commodity_domain_map :   null,

        //Code from the db
        comodity_agricultural_code  :   1,
        policy_trade_code   :   1,

        //This is used for multiple tab of Policy Type
        ap_list_tab_obj_policyTypes :   '',
        //These are the start and the end date below the slider
        slider_start_date : '',
        slider_start_date_dd : '',
        slider_start_date_mm : '',
        slider_start_date_yy : '',
        slider_end_date : '',
        slider_end_date_dd : '',
        slider_end_date_mm : '',
        slider_end_date_yy : '',
        //Range start and end date in the slider
        slider_start_date_selected  :   '',
        slider_end_date_selected  :   ''
    };

    function init(){
        buildUI({"placeholderID" : "placeholder", "lang" : "E"});
    };

    function buildUI(config) {

        /* Store user preferences. */
        CONFIG = $.extend(CONFIG, config);

        /* Set ISO2 language code. */
        switch (CONFIG.lang) {
            case 'F': lang_ISO2 = 'FR'; break;
            case 'S': lang_ISO2 = 'ES'; break;
            default : lang_ISO2 = 'EN'; break;
        }

        /* Initiate multi-language. */
        $.i18n.properties({
            name: 'I18N',
            path: CONFIG.I18N_prefix + 'I18N/',
            mode: 'both',
            language: CONFIG.lang_ISO2
        });


        //Bulk Downloads Button
        buildBulkDownloads();

        //Commodity and Policy Domain Button
        buildCommodityPolicyDomain();

        //Commodity Tabl
        buildSingleTab(ap_queryAndDownload.CONFIG.commodity_type);
        buildSingleTab(ap_queryAndDownload.CONFIG.country_type);
        buildMultipleTab(ap_queryAndDownload.CONFIG.policy_type);
        //buildMultipleTab(ap_queryAndDownload.CONFIG.year_type);


//        /* Initiate Bootstrap. */
//        $('#' + CONFIG.placeholderID).append("<div class='container' id='" + CONFIG.placeholderID + "_container'></div>");
//
//        /* Add placeholder to the page. */
//        $('#' + CONFIG.placeholderID + '_container').append(buildUIStructure());
//
//        //Download_tab
//        var s2 = ap_queryAndDownload.buildBulkDownloadTab();
//        $('#' + CONFIG.placeholderID + 'bulk_download_container').append(s2);
//        ap_queryAndDownload.populateBulkDownloadsTab();
//
//        //Show/Hide Selection
//        buildPageActionsContainer();
//
//        /* Query DB and build structure. */
//        getDomainStructure();
//
//        /* Build options. */
//        buildOptions();
//
//        /* Build preview and download button */
//        buildPreviewAndDownloadButton();
//
//        /* Build output. */
//        buildOutput();
    };


    function buildBulkDownloads(){//"+$.i18n.prop('_policy_db')+"

        $('#bulk-downloads-btn-span').text(""+$.i18n.prop('_query_download_bulk_download'));
        var s = "<li><a class='drop-down-menu-item' target='_blank' id='allData' href='../policy/doc/query_download/Bulk_AllData.zip'>"+$.i18n.prop('_bulk_download_all_data')+"</a></li>";
        $('#bulk-downloads-menu').append(s);
        s = "<li><a class='drop-down-menu-item' target='_blank' id='biofuelData' href='../policy/doc/query_download/Bulk_BiofuelData.zip'>"+$.i18n.prop('_bulk_download_biofuel_data')+"</a></li>";
        $('#bulk-downloads-menu').append(s);
        s = "<li><a class='drop-down-menu-item' target='_blank' id='agriculturalData' href='../policy/doc/query_download/Bulk_AgricultureData.zip'>"+$.i18n.prop('_bulk_download_agricultural_data')+"</a></li>";
        $('#bulk-downloads-menu').append(s);
        s = "<li><a class='drop-down-menu-item' target='_blank' id='biofuelTrade' href='../policy/doc/query_download/Bulk_BiofuelData_trade.zip'>"+$.i18n.prop('_bulk_download_biofuel_trade')+"</a></li>";
        $('#bulk-downloads-menu').append(s);
        s = "<li><a class='drop-down-menu-item' target='_blank' id='biofuelDomestic' href='../policy/doc/query_download/Bulk_BiofuelData_domestic.zip'>"+$.i18n.prop('_bulk_download_biofuel_domestic')+"</a></li>";
        $('#bulk-downloads-menu').append(s);
        s = "<li><a class='drop-down-menu-item' target='_blank' id='agriculturalImportMeasures' href='../policy/doc/query_download/Bulk_AgricultureData_ImportMeasures.zip'>"+$.i18n.prop('_bulk_download_agri_import_meas')+"</a></li>";
        $('#bulk-downloads-menu').append(s);
        s = "<li><a class='drop-down-menu-item' target='_blank' id='agriculturalExportMeasures' href='../policy/doc/query_download/Bulk_AgricultureData_ExportMeasures.zip'>"+$.i18n.prop('_bulk_download_agri_export_meas')+"</a></li>";
        $('#bulk-downloads-menu').append(s);
    };

    function buildCommodityPolicyDomain(){
        //Commodity and Policy Domain Title Setting
        $('#commodity_domain_label').text(""+$.i18n.prop('_commodity_domain_title'));
        $('#policy_domain_label').text(""+$.i18n.prop('_policy_domain_title'));

        //Commodity Domain Radio Setting
        $('#commodity_radioButton1').text(""+$.i18n.prop('_commodity_domain_agricultural'));
        $('#commodity_radioButton2').text(""+$.i18n.prop('_commodity_domain_biofuels'));
        $('#commodity_radioButton3').text(""+$.i18n.prop('_commodity_domain_both'));

        //Policy Domain Radio Setting
        $('#policy_radioButton1').text(""+$.i18n.prop('_policy_domain_trade'));
        $('#policy_radioButton2').text(""+$.i18n.prop('_policy_domain_domestic'));
        $('#policy_radioButton3').text(""+$.i18n.prop('_policy_domain_both'));

        $("#commodity_radioButton1").jqxRadioButton({checked : true, theme: CONFIG.theme, groupName :'selector_commodityDomain'});
        $("#commodity_radioButton2").jqxRadioButton({checked : false, theme: CONFIG.theme, groupName :'selector_commodityDomain'});
        $("#commodity_radioButton3").jqxRadioButton({checked : false, theme: CONFIG.theme, groupName :'selector_commodityDomain'});
        //By default this commodity radio button is Checked
        ap_queryAndDownload.CONFIG.commodity_radio_checked = $.i18n.prop('_commodity_domain_agricultural');

        $("#policy_radioButton1").jqxRadioButton({checked : true, theme: CONFIG.theme, groupName :'selector_policyDomain'});
        $("#policy_radioButton2").jqxRadioButton({checked : false, theme: CONFIG.theme, groupName :'selector_policyDomain'});
        $("#policy_radioButton3").jqxRadioButton({checked : false, theme: CONFIG.theme, groupName :'selector_policyDomain'});
        //By default this policy radio button is Checked
        ap_queryAndDownload.CONFIG.policy_radio_checked = $.i18n.prop('_policy_domain_trade');

        //Maps initialization
        ap_queryAndDownload.CONFIG.policy_commodity_domain_map = new Object();
        ap_queryAndDownload.CONFIG.policy_domain_map = new Object();
        ap_queryAndDownload.CONFIG.commodity_domain_map = new Object();
        //Commodity and Policy code associated to the Selected Commodity and Policy Domain
        //The codes of the first elements are setted by default
        ap_queryAndDownload.CONFIG.policy_domain_map[ap_queryAndDownload.CONFIG.policy_radio_checked]= ap_queryAndDownload.CONFIG.policy_trade_code;
        ap_queryAndDownload.CONFIG.commodity_domain_map[ap_queryAndDownload.CONFIG.commodity_radio_checked]= ap_queryAndDownload.CONFIG.comodity_agricultural_code;

        /* Retrive UI structure from DB. */
        $.ajax({

            type: 'GET',
            // url: CONFIG.listboxes_url + '/' + CONFIG.datasource + '/' + CONFIG.domainCode + '/' + CONFIG.lang,
            //url: 'http://localhost:8090/wds/rest/policyservice/commodityPolicyDomain/POLICY',
            url: 'http://'+ap_utilVariables.CONFIG.base_ip_address+':'+ap_utilVariables.CONFIG.base_ip_port+ap_utilVariables.CONFIG.commodityPolicyDomain_url+ '/' + ap_utilVariables.CONFIG.datasource,
            //url: ap_queryAndDownload.CONFIG.commodityPolicyDomain_url+ '/' + ap_queryAndDownload.CONFIG.datasource,

            success : function(response) {

                /* Convert the response in an object, if needed. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
                //alert(json);
                var trade_commodity_domain = [];
                var iTradeDomain = 0;
                var domestic_commodity_domain = [];
                var iDomesticDomain = 0;
                //alert("json[0]= "+json[0]);
                //alert("json[0][0]= "+json[0][0]);
                //json = '[[2, "Domestic", 1, "Agricultural"],[1, "Trade", 1, "Agricultural"],[1, "Trade", 2, "Biofuels"],[2, "Domestic", 2, "Biofuels"]]';
                //alert("after json[0]= "+json[0]);
                //alert("after json[0][0]= "+json[0][0]);
                for (var i = 0 ; i < json.length ; i++) {
//                        //Code
//                        var policy_domain_code = json[i][0];
//                        //Name
//                        var policy_domain = json[i][1];
//                        //Code
//                        var commodity_domain_code = json[i][2];
//                        //Name
//                        var commodity_domain = json[i][3];
                    //Code
                    var policy_domain_code = json[i]["policy_domain_code"];
                    //Name
                    var policy_domain = json[i]["policy_domain_name"];
                    //Code
                    var commodity_domain_code = json[i]["commoditydomain_code"];
                    //Name
                    var commodity_domain = json[i]["commoditydomain_name"];
                    //alert("policy_domain_code *"+policy_domain_code+"* policy_domain *"+policy_domain +"* commodity_domain_code *"+commodity_domain_code+"* commodity_domain *"+commodity_domain+"*");
                    if(policy_domain==$.i18n.prop('_policy_domain_trade'))
                    {
                        //alert("Policy Trade");
                        ap_queryAndDownload.CONFIG.policy_domain_map[policy_domain]= policy_domain_code;
                        ap_queryAndDownload.CONFIG.commodity_domain_map[commodity_domain]= commodity_domain_code;
                        trade_commodity_domain[iTradeDomain]= commodity_domain;
                        iTradeDomain++;
                    }
                    else if(policy_domain==$.i18n.prop('_policy_domain_domestic'))
                    {
                        // alert("Policy Domestic");
                        ap_queryAndDownload.CONFIG.policy_domain_map[policy_domain]= policy_domain_code;
                        ap_queryAndDownload.CONFIG.commodity_domain_map[commodity_domain]= commodity_domain_code;
                        domestic_commodity_domain[iDomesticDomain]= commodity_domain;
                        iDomesticDomain++;
                    }
                    //alert("iTradeDomain "+iTradeDomain+" iDomesticDomain "+iDomesticDomain);
                }
                if(trade_commodity_domain.length>1)
                {
                    trade_commodity_domain[iTradeDomain] = $.i18n.prop('_commodity_domain_both');
                }
                if(domestic_commodity_domain.length>1)
                {
                    domestic_commodity_domain[iDomesticDomain] = $.i18n.prop('_commodity_domain_both');
                }
                // console.log("ap_queryAndDownload.CONFIG.policy_domain_map agric "+ap_queryAndDownload.CONFIG.commodity_domain_map[$.i18n.prop('_commodity_domain_agricultural')]);
                // console.log("ap_queryAndDownload.CONFIG.policy_domain_map biof "+ap_queryAndDownload.CONFIG.commodity_domain_map[$.i18n.prop('_commodity_domain_biofuels')]);

                // var keys = ap_queryAndDownload.CONFIG.policy_domain_map.keys();
//                for(var i=0; keys.length; i++)
//                {
//                    console.log(" i= "+i+" key= "+keys[i]+ " value=  "+ap_queryAndDownload.CONFIG.policy_domain_map[keys[i]] );
//                }
//                for(var i=0; ap_queryAndDownload.CONFIG.policy_domain_map.length; i++)
//                {
//                    console.log(" i= "+i+" key= "+ap_queryAndDownload.CONFIG.policy_domain_map.+ " value=  "+ap_queryAndDownload.CONFIG.policy_domain_map[keys[i]] );
//                }
                ap_queryAndDownload.CONFIG.policy_commodity_domain_map[$.i18n.prop('_policy_domain_trade')] = trade_commodity_domain;
                ap_queryAndDownload.CONFIG.policy_commodity_domain_map[$.i18n.prop('_policy_domain_domestic')] = domestic_commodity_domain;
                var both_commodity_domain = [$.i18n.prop('_commodity_domain_agricultural'),$.i18n.prop('_commodity_domain_biofuels'),$.i18n.prop('_commodity_domain_both')];
                ap_queryAndDownload.CONFIG.policy_commodity_domain_map[$.i18n.prop('_policy_domain_both')] = both_commodity_domain;

                //If the user select "Domestic" only "Biofuels" will be available
                $("#policy_radioButton1").on('change', function (event) {
                    var checked = event.args.checked;
                    var policy_label = $.i18n.prop('_policy_domain_trade');
                    if(checked)
                    {
                        ap_queryAndDownload.CONFIG.policy_radio_checked = policy_label;
                        //ap_queryAndDownload.commodity_from_policy_domain_changes(policy_label, payload[0][3]);
                    }
                });

                $("#policy_radioButton2").on('change', function (event) {
                    var checked = event.args.checked;
                    var policy_label = $.i18n.prop('_policy_domain_domestic');
                    if(checked)
                    {
                        ap_queryAndDownload.CONFIG.policy_radio_checked = policy_label;
                        //ap_queryAndDownload.commodity_from_policy_domain_changes(policy_label, payload[0][3]);
                    }
                });

                $("#policy_radioButton3").on('change', function (event) {
                    var checked = event.args.checked;
                    var policy_label = $.i18n.prop('_policy_domain_both');
                    if(checked)
                    {
                        ap_queryAndDownload.CONFIG.policy_radio_checked = policy_label;
                        //ap_queryAndDownload.commodity_from_policy_domain_changes(policy_label, payload[0][3]);
                    }
                });

                $("#commodity_radioButton1").on('change', function (event) {
                    var checked = event.args.checked;
                    var commodity_label = $.i18n.prop('_commodity_domain_agricultural');
                    if(checked)
                    {
                        ap_queryAndDownload.CONFIG.commodity_radio_checked = commodity_label;
//                        ap_queryAndDownload.rebuild_selectionPanelPolicyTypes();
//                        ap_queryAndDownload.rebuild_selectionPanelCommodityClass();
                    }
                });

                $("#commodity_radioButton2").on('change', function (event) {
                    var checked = event.args.checked;
                    var commodity_label = $.i18n.prop('_commodity_domain_biofuels');
                    if(checked)
                    {
                        ap_queryAndDownload.CONFIG.commodity_radio_checked = commodity_label;
//                        ap_queryAndDownload.rebuild_selectionPanelPolicyTypes();
//                        ap_queryAndDownload.rebuild_selectionPanelCommodityClass();
                    }
                });

                $("#commodity_radioButton3").on('change', function (event) {
                    var checked = event.args.checked;
                    var commodity_label = $.i18n.prop('_commodity_domain_both');
                    if(checked)
                    {
                        ap_queryAndDownload.CONFIG.commodity_radio_checked = commodity_label;
//                        ap_queryAndDownload.rebuild_selectionPanelPolicyTypes();
//                        ap_queryAndDownload.rebuild_selectionPanelCommodityClass();
                    }
                });
            },

            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });

    };

//    function buildCommodityTab()
//    {
//        ap_queryAndDownload.buildSingleTab(ap_queryAndDownload.CONFIG.commodity_type);
//    }

//    function populateStandardTab_codelist(listboxID, tabNameCode, tabNameLabel, procedure_name) {
    function buildSingleTab(type)
    {
        var rest_url = ap_utilVariables.CONFIG.codelist_url+"/";
        //alert("ap_queryAndDownload.CONFIG.commodity_radio_checked "+ap_queryAndDownload.CONFIG.commodity_radio_checked);
        switch(type)
        {
            case ap_queryAndDownload.CONFIG.commodity_type  :
                if(ap_queryAndDownload.CONFIG.commodity_radio_checked == $.i18n.prop('_commodity_domain_agricultural'))
                {
                    rest_url+= ap_utilVariables.CONFIG.codelist_url_CommodityAgricultural;
                }
                else if(ap_queryAndDownload.CONFIG.commodity_radio_checked == $.i18n.prop('_commodity_domain_biofuels'))
                {
                    rest_url+= ap_utilVariables.CONFIG.codelist_url_CommodityBiofuels;
                }
                else
                {
                    //Both
                    rest_url+= ap_utilVariables.CONFIG.codelist_url_CommodityBoth;
                }
                break;
            case ap_queryAndDownload.CONFIG.country_type  :
                rest_url += ap_utilVariables.CONFIG.codelist_url_Country;
                break;
        }
        rest_url+= "/1.0";

        /* Retrive UI structure from DB. */
        $.ajax({
            type: 'GET',
            url :   rest_url,
            dataType: 'json',

            success : function(response) {
                //  alert("SUCCESS");
                /* Convert the response in an object, i fneeded. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
                //To order the json elements based on the title(label)
                var jsonCodes = json.rootCodes;
                jsonCodes.sort(function(a, b){
                    if ( a.title.EN < b.title.EN )
                        return -1;
                    if ( a.title.EN > b.title.EN )
                        return 1;
                    return 0;
                });

                var data = new Array();
                /* Fill it...result from codelist */
                var system = json.system;
                console.log("system="+system);
                if(system.indexOf('Commodity')!=-1)
                {
                    type = ap_queryAndDownload.CONFIG.commodity_type;
                }
                else if(system.indexOf('Country')!=-1)
                {
                    type = ap_queryAndDownload.CONFIG.country_type;
                }
                console.log("Type="+type);
                for (var i = 0 ; i < json.rootCodes.length ; i++) {
//                        var c = json.rootCodes[i].code;
//                        var l = json.rootCodes[i].title['EN'];
                    var c = jsonCodes[i].code;
                    var l = jsonCodes[i].title['EN'];
                   //  alert("c= "+c+" l= "+l);
                    //i=position and code=code of the item in the db
                    var obj = {value:type+"_"+i+"_"+c, label: ''+l};
                    data[i]= obj;
                    // console.log("data[(i+1)] "+ data[i].label);
                    //code[i]= c;
                }

                //For commodity and country tab there is one source element in this array
                var sources = new Array();
                sources[0] = data;
               // console.log("sources[(i+1)] "+ sources[0][0].label);
                ap_queryAndDownload.buildTab(type, sources);

                //in the combo box will be inserted on the list of the first item... during initialization phase
//                $("#selection_" + listboxID).jqxComboBox({ checkboxes: true, height: 25, width: '100%', source: data});
//                console.log("Area or commodity call code "+ code);
//
//                //Initialize the element array of the ALL tabs in the map
//                for(var i=0; i<tabNameCode.length; i++)
//                {
//                    //Get the single tab
//                    var map_obj = ap_queryAndDownload.CONFIG.selection_map[tabNameCode[i]];
//                    //Creating the array for the elements and the values for each tab
//                    var count = 0;
//
//                    for(var j=0; j<data.length; j++)
//                    {
//                        if(j==0)
//                        {
//                            map_obj.elements_name[j]= $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[i]+")";
//                        }
//                        else{
//                            map_obj.elements_name[j]= data[j].label;
//                        }
//                        map_obj.elements_code[j]= code[j];
//                        map_obj.elements_value[j]= false;
//                        map_obj.elements_id[j]= tabNameCode[i]+"_"+ count;
//                        count++;
//                    }
//                }
//                ap_queryAndDownload.CONFIG.active_tab[listboxID]= tabNameCode[0];
            },

            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });



//        var code = [];
//        code[0]= 0;
//        var rest_url = "";
//        var data = new Array();
//        var obj = {value:tabNameCode[0]+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[0]+")"};
//        data[0]= obj;
//        switch(procedure_name[0])
//        {
//            case ap_list_tab.CONFIG.commodity_type   :
//                // console.log("populateStandardTab_codelist CommodityClassList ");
//                // code = [0,1,7,10,11,8,2,5,12,4,7,9,3];
//                //code[0]= 0;
//                rest_url = ap_queryAndDownload.CONFIG.codelist_url+"/";
////                        ap_queryAndDownload.CONFIG.commodity_radio_checked = $.i18n.prop('_commodity_domain_agricultural');
//                if(ap_queryAndDownload.CONFIG.commodity_radio_checked == $.i18n.prop('_commodity_domain_agricultural'))
//                {
//                    rest_url+= ap_queryAndDownload.CONFIG.codelist_url_CommodityAgricultural;
//                }
//                else if(ap_queryAndDownload.CONFIG.commodity_radio_checked == $.i18n.prop('_commodity_domain_biofuels'))
//                {
//                    rest_url+= ap_queryAndDownload.CONFIG.codelist_url_CommodityBiofuels;
//                }
//                else
//                {
//                    //Both
//                    rest_url+= ap_queryAndDownload.CONFIG.codelist_url_CommodityBoth;
//                }
//                rest_url+= "/1.0";
////                        var obj = {value:tabNameCode[0]+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[0]+")"};
////                        data[0]= obj;
//                // data = [{value:tabNameCode[0]+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[0]+")"},{value:tabNameCode[0]+"_1", label: "Wheat"}, {value:tabNameCode[0]+"_2", label: "Biofuel"}, {value:tabNameCode[0]+"_3", label: "Maize + Soybeans"}, {value:tabNameCode[0]+"_4", label: "Wheat + Maize + Rice"}, {value:tabNameCode[0]+"_5", label: "Wheat + Maize"}, {value:tabNameCode[0]+"_6", label: "Rice"},{value:tabNameCode[0]+"_7", label: "Ethanol"}, {value:tabNameCode[0]+"_8", label: "Wheat + Rice"},{value:tabNameCode[0]+"_9", label: "Soybeans"},{value:tabNameCode[0]+"_10", label: "Biodiesel"},{value:tabNameCode[0]+"_11", label: "Maize + Rice"},{value:tabNameCode[0]+"_12", label: "Maize"}];
////                        for(var i =1; i<12; i++)
////                        {
////                            obj = {value:tabNameCode[0]+"_"+i, label: "Test"+i};
////                            data[i]= obj;
////                        }
//                break;
//            case 'AreaList'   :
//                //  console.log("populateStandardTab_codelist AreaList ");
//                //code = [0,53,256,240,17,227,249,93,999000,12,85,204,132,126];
//                rest_url = ap_queryAndDownload.CONFIG.codelist_url +"/"+ap_queryAndDownload.CONFIG.codelist_url_Country+"/1.0";
//                // data = [{value:tabNameCode[0]+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[0]+")"},{value:tabNameCode[0]+"_1", label: "China"}, {value:tabNameCode[0]+"_2", label: "U.K. of Great Britain and Northern Ireland"}, {value:tabNameCode[0]+"_3", label: "Thailand"}, {value:tabNameCode[0]+"_4", label: "Australia"}, {value:tabNameCode[0]+"_5", label: "South Africa"}, {value:tabNameCode[0]+"_6", label: "Turkey"},{value:tabNameCode[0]+"_7", label: "Germany"}, {value:tabNameCode[0]+"_8", label: "European Union"}, {value:tabNameCode[0]+"_9", label: "Argentina"}, {value:tabNameCode[0]+"_10", label: "France"}, {value:tabNameCode[0]+"_11", label: "Russian Federation"}, {value:tabNameCode[0]+"_12", label: "Kazakhstan"}, {value:tabNameCode[0]+"_13", label: "Japan"}];
//                break;
//        }
//        /* Retrive UI structure from DB. */
//        $.ajax({
//            type: 'GET',
//            url :   rest_url,
//            dataType: 'json',
//
//            success : function(response) {
//                //  alert("SUCCESS");
//                /* Convert the response in an object, i fneeded. */
//                var json = response;
//                if (typeof(response) == 'string')
//                    json = $.parseJSON(response);
//                //To order the json elements based on the title(label)
//                var jsonCodes = json.rootCodes;
//                jsonCodes.sort(function(a, b){
//                    if ( a.title.EN < b.title.EN )
//                        return -1;
//                    if ( a.title.EN > b.title.EN )
//                        return 1;
//                    return 0;
//                });
//
//                /* Fill it...result from codelist */
//                for (var i = 0 ; i < json.rootCodes.length ; i++) {
////                        var c = json.rootCodes[i].code;
////                        var l = json.rootCodes[i].title['EN'];
//                    var c = jsonCodes[i].code;
//                    var l = jsonCodes[i].title['EN'];
//                    // alert("c= "+c+" l= "+l);
//                    var obj = {value:tabNameCode[0]+"_"+(i+1), label: ''+l};
//                    data[(i+1)]= obj;
//                    // console.log("data[(i+1)] "+ data[(i+1)]);
//                    code[(i+1)]= c;
//                }
//                //in the combo box will be inserted on the list of the first item... during initialization phase
//                $("#selection_" + listboxID).jqxComboBox({ checkboxes: true, height: 25, width: '100%', source: data});
//                console.log("Area or commodity call code "+ code);
//
//                //Initialize the element array of the ALL tabs in the map
//                for(var i=0; i<tabNameCode.length; i++)
//                {
//                    //Get the single tab
//                    var map_obj = ap_queryAndDownload.CONFIG.selection_map[tabNameCode[i]];
//                    //Creating the array for the elements and the values for each tab
//                    var count = 0;
//
//                    for(var j=0; j<data.length; j++)
//                    {
//                        if(j==0)
//                        {
//                            map_obj.elements_name[j]= $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[i]+")";
//                        }
//                        else{
//                            map_obj.elements_name[j]= data[j].label;
//                        }
//                        map_obj.elements_code[j]= code[j];
//                        map_obj.elements_value[j]= false;
//                        map_obj.elements_id[j]= tabNameCode[i]+"_"+ count;
//                        count++;
//                    }
//                }
//                ap_queryAndDownload.CONFIG.active_tab[listboxID]= tabNameCode[0];
//            },
//
//            error : function(err,b,c) {
//                alert(err.status + ", " + b + ", " + c);
//            }
//        });
    };

    function buildMultipleTab(type)
    {
        //If policy types tab
        if(type == ap_queryAndDownload.CONFIG.policy_type)
        {
            var policy_domain_code = "";
            var commodity_domain_code = "";

            if(ap_queryAndDownload.CONFIG.policy_radio_checked == $.i18n.prop('_policy_domain_both'))
            {
                policy_domain_code = ap_queryAndDownload.CONFIG.policy_domain_map[$.i18n.prop('_policy_domain_trade')]+","+ap_queryAndDownload.CONFIG.policy_domain_map[$.i18n.prop('_policy_domain_domestic')];
            }
            else
            {
                policy_domain_code = ap_queryAndDownload.CONFIG.policy_domain_map[ap_queryAndDownload.CONFIG.policy_radio_checked];
            }
            //Getting codes from the Commodity Domain Selection
            if(ap_queryAndDownload.CONFIG.commodity_radio_checked == $.i18n.prop('_commodity_domain_both'))
            {
                commodity_domain_code = ap_queryAndDownload.CONFIG.commodity_domain_map[$.i18n.prop('_commodity_domain_agricultural')]+","+ap_queryAndDownload.CONFIG.commodity_domain_map[$.i18n.prop('_commodity_domain_biofuels')];
            }
            else
            {
                commodity_domain_code = ap_queryAndDownload.CONFIG.commodity_domain_map[ap_queryAndDownload.CONFIG.commodity_radio_checked];
            }
            /* Retrive UI structure from DB. */
            $.ajax({

                type: 'GET',
                //url: 'http://localhost:8090/wds/rest/policyservice/commodityPolicyDomain/POLICY',
                url: 'http://'+ap_utilVariables.CONFIG.base_ip_address+':'+ap_utilVariables.CONFIG.base_ip_port+ap_utilVariables.CONFIG.commodityPolicyTypes_url+ '/' + ap_utilVariables.CONFIG.datasource+ '/' +policy_domain_code+ '/' +commodity_domain_code,
//            url: ap_queryAndDownload.CONFIG.commodityPolicyTypes_url+ '/' + ap_queryAndDownload.CONFIG.datasource+ '/' +policy_domain_code+ '/' +commodity_domain_code,

                success : function(response) {

                    /* Convert the response in an object, i fneeded. */
                    var json = response;
                    if (typeof(response) == 'string')
                        json = $.parseJSON(response);
                    //   console.log("Policy Measure Types ***"+ json+"***");
                    var tab_name_code = [];
                    var tab_name_label = [];
                    var tab_name_description = [];
                    var tab_procedure_name = [];

                    for (var i = 0 ; i < json.length ; i++) {
                        console.log("Policy json["+i+"][0] ***"+ json[i][0]+"***");
                        console.log("Policy json["+i+"][1] ***"+ json[i][1]+"***");
                    }

                    buildPolicyMeasures(json);
                },

                error : function(err,b,c) {
                    alert(err.status + ", " + b + ", " + c);
                }
            });
        }
        else if(type == ap_queryAndDownload.CONFIG.year_type)
        {
            $.ajax({

                type: 'GET',
                url: 'http://'+ap_utilVariables.CONFIG.base_ip_address+':'+ap_utilVariables.CONFIG.base_ip_port+ap_utilVariables.CONFIG.startAndEndDate_url+ '/' + ap_utilVariables.CONFIG.datasource,
//            url: ap_queryAndDownload.CONFIG.startAndEndDate_url+ '/' + ap_queryAndDownload.CONFIG.datasource,

                success : function(response) {

                    /* Convert the response in an object, i fneeded. */
                    var json = response;
                    if (typeof(response) == 'string')
                        json = $.parseJSON(response);

                    //if it's true there is at least one value in the end_date column that is null
                    var end_date_null = json[0][0];
                    //  console.log("year = "+json);
                    var start_date_dd = json[1][1];
                    var start_date_mm = json[1][2];
                    var start_date_yy = json[1][3];
                    var final_start_date = start_date_dd+"/"+start_date_mm+"/"+start_date_yy;
                    var start_date_dd_int = parseInt(start_date_dd);
                    var start_date_mm_int = parseInt(start_date_mm)-1;
                    var start_date_yy_int = parseInt(start_date_yy);
//                console.log("start_date_dd = "+start_date_dd);
//                console.log("start_date_mm = "+start_date_mm);
//                console.log("start_date_yy = "+start_date_yy);
//                console.log("final_start_date = "+final_start_date);
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
//                console.log("end_date = "+end_date);
//                console.log("end_date_dd = "+end_date_dd);
//                console.log("end_date_mm = "+end_date_mm);
//                console.log("end_date_yy = "+end_date_yy);

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
                            var best_date = ap_queryAndDownload.data_compare(end_date_dd, end_date_mm, end_date_yy, end_date_dd_today, end_date_mm_today, end_date_yy_today);
                            if(best_date=='first')
                            {
                                final_end_date = end_date_dd+"/"+end_date_mm+"/"+end_date_yy;
                                ap_queryAndDownload.CONFIG.slider_end_date_dd = end_date_dd;
                                ap_queryAndDownload.CONFIG.slider_end_date_mm = end_date_mm;
                                ap_queryAndDownload.CONFIG.slider_end_date_yy = end_date_yy;
                                end_date_dd_int = parseInt(end_date_dd);
                                end_date_mm_int = parseInt(end_date_mm)-1;
                                end_date_yy_int = parseInt(end_date_yy);
                            }
                            else if(best_date=='second')
                            {
                                final_end_date = end_date_dd_today+"/"+end_date_mm_today+"/"+end_date_yy_today;
                                ap_queryAndDownload.CONFIG.slider_end_date_dd = end_date_dd_today;
                                ap_queryAndDownload.CONFIG.slider_end_date_mm = end_date_mm_today;
                                ap_queryAndDownload.CONFIG.slider_end_date_yy = end_date_yy_today;
                                end_date_dd_int = parseInt(end_date_dd_today);
                                end_date_mm_int = parseInt(end_date_mm_today)-1;
                                end_date_yy_int = parseInt(end_date_yy_today);
                            }
                        }
                        else{
                            final_end_date = end_date_dd_today+"/"+end_date_mm_today+"/"+end_date_yy_today;
                            ap_queryAndDownload.CONFIG.slider_end_date_dd = end_date_dd_today;
                            ap_queryAndDownload.CONFIG.slider_end_date_mm = end_date_mm_today;
                            ap_queryAndDownload.CONFIG.slider_end_date_yy = end_date_yy_today;
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
                        ap_queryAndDownload.CONFIG.slider_end_date_dd = end_date_dd;
                        ap_queryAndDownload.CONFIG.slider_end_date_mm = end_date_mm;
                        ap_queryAndDownload.CONFIG.slider_end_date_yy = end_date_yy;
                        end_date_dd_int = parseInt(end_date_dd);
                        end_date_mm_int = parseInt(end_date_mm)-1;
                        end_date_yy_int = parseInt(end_date_yy);
                    }

                    ap_queryAndDownload.CONFIG.slider_start_date = final_start_date;
                    ap_queryAndDownload.CONFIG.slider_start_date_dd = start_date_dd;
                    ap_queryAndDownload.CONFIG.slider_start_date_mm = start_date_mm;
                    ap_queryAndDownload.CONFIG.slider_start_date_yy = start_date_yy;
                    ap_queryAndDownload.CONFIG.slider_end_date = final_end_date;

                    //Start to change
////                    $("#"+tabNameCode + "_yearSlider").dateRangeSlider({bounds:{min: new Date(2000, 0, 1), max: new Date(2014, 11, 31)}, wheelMode: 'zoom', step:{days: 1}, range:{min:{days: 1}, max:{years: 40}}});
//                    $("#"+tabNameCode + "_yearSlider").dateRangeSlider({bounds:{min: new Date(start_date_yy, ''+start_date_mm_int, start_date_dd), max: new Date(end_date_yy, ''+end_date_mm_int, end_date_dd)}, wheelMode: 'zoom', step:{days: 1}, range:{min:{years: 5}, max:{years: 60}}, formatter:function(val){
//                        var days = val.getDate(),
//                            month = val.getMonth() + 1,
//                            year = val.getFullYear();
//                        return days + "/" + month + "/" + year;
//                    }});
//
//                    $("#yearMin").text(start_date_yy);
//                    $("#yearMax").text(end_date_yy);
//                    var dateValues = $("#"+tabNameCode + "_yearSlider").dateRangeSlider("values");
//                    //console.log(" Populate tab "+dateValues.min.toString() + " " + dateValues.max.toString());
//                    //var date = new Date("Fri May 31 2013 17:41:01 GMT+0200 (CEST)");
//                    //var date_str = moment(dateValues.min.toString()).format("DD/MM/YYYY");
//                    // ap_queryAndDownload.CONFIG.slider_start_date_selected = dateValues.min.toString();
//                    // ap_queryAndDownload.CONFIG.slider_end_date_selected = dateValues.max.toString();
//                    ap_queryAndDownload.CONFIG.slider_start_date_selected = moment(dateValues.min.toString()).format("DD/MM/YYYY");
//                    ap_queryAndDownload.CONFIG.slider_end_date_selected = moment(dateValues.max.toString()).format("DD/MM/YYYY");
//                    //alert("ap_queryAndDownload.CONFIG.slider_start_date_selected "+ap_queryAndDownload.CONFIG.slider_start_date_selected+" ap_queryAndDownload.CONFIG.slider_end_date_selected "+ap_queryAndDownload.CONFIG.slider_end_date_selected);
//                    $("#"+tabNameCode + "_yearSlider").bind("valuesChanged", function(e, data){
//                        ap_queryAndDownload.CONFIG.slider_start_date_selected = moment(data.values.min.toString()).format("DD/MM/YYYY");
//                        ap_queryAndDownload.CONFIG.slider_end_date_selected = moment(data.values.max.toString()).format("DD/MM/YYYY");
//                        // alert("ap_queryAndDownload.CONFIG.slider_start_date_selected "+ap_queryAndDownload.CONFIG.slider_start_date_selected+" ap_queryAndDownload.CONFIG.slider_end_date_selected "+ap_queryAndDownload.CONFIG.slider_end_date_selected);
//                    });

                    //End to change
                    //console.log(" Populate slider_start_date_selected "+ap_queryAndDownload.CONFIG.slider_start_date_selected + " slider_end_date_selected " + ap_queryAndDownload.CONFIG.slider_end_date_selected);
                    //Classic Years
                    // data = [{value:tabNameCode[0]+"_0", label: "Select All("+tabNameLabel[0]+")"},{value:tabNameCode[0]+"_1", label: "1995"}, {value:tabNameCode[0]+"_2", label: "1996"}, {value:tabNameCode[0]+"_3", label: "1997"}, {value:tabNameCode[0]+"_4", label: "1998"}, {value:tabNameCode[0]+"_5", label: "1999"}, {value:tabNameCode[0]+"_6", label: "2000"},{value:tabNameCode[0]+"_7", label: "2001"}, {value:tabNameCode[0]+"_8", label: "2002"}, {value:tabNameCode[0]+"_9", label: "2003"}, {value:tabNameCode[0]+"_10", label: "2004"}, {value:tabNameCode[0]+"_11", label: "2005"}, {value:tabNameCode[0]+"_12", label: "2006"}, {value:tabNameCode[0]+"_13", label: "2007"}, {value:tabNameCode[0]+"_14", label: "2008"}, {value:tabNameCode[0]+"_15", label: "2009"}, {value:tabNameCode[0]+"_16", label: "2010"}, {value:tabNameCode[0]+"_17", label: "2011"}, {value:tabNameCode[0]+"_18", label: "2012"}, {value:tabNameCode[0]+"_19", label: "2013"}];
                    var start_date_yy_int = parseInt(start_date_yy);
                    var end_date_yy_int = parseInt(end_date_yy);

                    //Start to change
                    var data = new Array();
                    //data = [{value:tabNameCode[0]+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[0]+")"}];
                    var count = 0;
                    //  alert("c= "+c+" l= "+l);
                    //i=position and code=code of the item in the db
//                    var obj = {value:type+"_"+i+"_"+c, label: ''+l};
//                    data[i]= obj;

                    for(var i=start_date_yy_int; i<=end_date_yy_int; i++)
                    {
                        //For the year there is not code associated with the label so "value:type+"_"+count" and NOT value:type+"_"+"_"+count_code
                        data[count]={value:type+"_"+count, label: ''+i};
                        count++;
                    }
                    //End to change
//                data[1]={value:tabNameCode[0]+"_1", label: "1995"};
//                data[2]={value:tabNameCode[0]+"_2", label: "1996"};

                    //in the combo box will be inserted on the list of the first item... during initialization phase
                   // $("#selection_" + listboxID).jqxComboBox({ checkboxes: true, height: 25, width: '100%', source: data});


                    var source = new Array();
                    source[0] = data;
                    //Create the tabs
                    ap_queryAndDownload.buildTab(ap_queryAndDownload.CONFIG.year_type, source);

                },

                error : function(err,b,c) {
                    alert(err.status + ", " + b + ", " + c);
                }
            });
        }
    };

    function buildPolicyMeasures(json)
    {
        //ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.custom_widget
        ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes = new Object();
        ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.custom_widget='jqxPolicyTypesTabs';
        ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.tabs_num=json.length;
        ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.actual_tab_num=0;
        ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.property_object = {height: 200, position: 'top', animationType: 'fade'};
        //ap_utilVariables.CONFIG.ap_list_tab_obj_policyTypes.tabs_title=[$.i18n.prop('_selection_map_Countries')];
        ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.tabs_title = new Array();
        ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.main_tabs_id = 'jqxtabs_policyTypes';
        //ap_list_tab_obj.tabs_id=['jqxlist_country'];
        ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.tabs_id = new Array();

        //For Policy Types each tabs is a list
        ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.tabs_init_function = new Array();
        ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.tabs_text = new Array();
        for(var i=0; i<json.length; i++)
        {
            //ap_utilVariables.CONFIG.ap_list_tab_obj_policyTypes.tabs_init_function=[ap_list_tab.init_list];
            ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.tabs_init_function[i] = ap_list_tab.init_list;
            //ap_utilVariables.CONFIG.ap_list_tab_obj_policyTypes.tabs_text=[''];
            ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.tabs_text[i] = '';
        }
        //ap_list_tab_obj.tab_sources=sources;
        ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.tab_sources = new Array();
        for(var i=0; i<json.length; i++)
        {
            var tabCode = json[i][0];

            var rest_url = ap_utilVariables.CONFIG.codelist_url +"/"+ap_utilVariables.CONFIG.codelist_url_PolicyType+tabCode+"/1.0";
            $.ajax({
                type: 'GET',
                //url: rest_url,
                //  url: ap_queryAndDownload.CONFIG.startAndEndDate_url+ '/' + ap_queryAndDownload.CONFIG.datasource,
                //url : 'http://faostat3.fao.org:7777/msd/cl/system/OECD_CommodityClass/1.0',
                url :   rest_url,
                dataType: 'json',

                success : function(response) {
                    // console.log("SUCCESS ");
                    /* Convert the response in an object, i fneeded. */
                    var json = response;
                    if (typeof(response) == 'string')
                        json = $.parseJSON(response);
                    // alert("system "+json.system);
                    //"OECD_PolicyType2"
                    var system = json.system;
                    //OECD Import measures
                    var title = json.title['EN'];
                    //OECD_PolicyType2
                    var pt_code = system.substring(15);
                    var pt_label = title.substring(5);
                    console.log("pt_code "+pt_code +" pt_label "+pt_label);
                    // alert("pt_code "+pt_code);
                    /* Fill it...result from codelist */
//                    var code = [];
//                    code[0]= 0;
//                    var data = new Array();
//                    //  var obj = {value:tabNameCode[i]+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+pt_label+")"};
//                    var obj = {value:"Pmt"+pt_code+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+pt_label+")"};
//                    data[0]= obj;
                    //To order the json elements based on the title(label)
                    var jsonCodes = json.rootCodes;
                    jsonCodes.sort(function(a, b){
                        if ( a.title.EN < b.title.EN )
                            return -1;
                        if ( a.title.EN > b.title.EN )
                            return 1;
                        return 0;
                    });

                    //These are set through information about the Policy Type Tabs
                    ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.tabs_title[ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.actual_tab_num]=pt_label;
                    ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.tabs_id[ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.actual_tab_num]='pt'+pt_code;

                    var data = new Array();
                    for (var j = 0 ; j < json.rootCodes.length ; j++) {
//                            var c = json.rootCodes[j].code;
//                            var l = json.rootCodes[j].title['EN']; //Create the tabs
                        //ap_queryAndDownload.buildTab(ap_queryAndDownload.CONFIG.policy_type, '');
                        var c = jsonCodes[j].code;
                        var l = jsonCodes[j].title['EN'];
                         console.log("c= "+c+" l= "+l);
                        var obj = {value:ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.tabs_id[ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.actual_tab_num]+"_"+j+"_"+c, label: ''+l};
                        data[j]= obj;
                        //tabNameCode Pmt2,Pmt1    tabNameLabel Import measures,Export measures
//                            var obj = {value:tabNameCode[i]+"_"+(j+1), label: ''+l};
//                        var obj = {value:"Pmt"+pt_code+"_"+(j+1), label: ''+l};
//                        data[(j+1)]= obj;
//                        //console.log("data[(i+1)] "+ data[(j+1)]);
//                        code[(j+1)]= c;
                        // var l = json.rootCodes[i].title[FMM.CONFIG.lang_ISO2.toUpperCase()];
                        // s += '<option id="' + c + '" onclick="FMM.setNestedProperty(\'' + id + '\', \'' + sequenceNumber + '\');" value="' + c + '" selected="selected">' + l + '</option>';
                    }
                    ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.tab_sources[ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.actual_tab_num] = data;
                    //Now I can increment the number of tabs loaded
                    ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.actual_tab_num++;
                    if(ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.actual_tab_num == ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.tabs_num)
                    {
                        //All the ajax calls have been done...
                        //Create the tabs
                        ap_queryAndDownload.buildTab(ap_queryAndDownload.CONFIG.policy_type, '');
                    }
//                    var ap_list_tab_obj = new Object();
//                    ap_list_tab_obj.custom_widget='jqxCountryTabs';
//                    ap_list_tab_obj.tabs_num=1;
//                    ap_list_tab_obj.property_object = {height: 200, position: 'top', animationType: 'fade'};
//                    ap_list_tab_obj.tabs_title=[$.i18n.prop('_selection_map_Countries')];
//                    ap_list_tab_obj.main_tabs_id = 'jqxtabs_country';
//                    ap_list_tab_obj.tabs_id=['jqxlist_country'];
//                    ap_list_tab_obj.tabs_text=[''];
//                    ap_list_tab_obj.tabs_init_function=[ap_list_tab.init_list];
//                    ap_list_tab_obj.tab_sources=sources;

                    //in the combo box will be inserted on the list of the first item... during initialization phase
                    //Pmt1
                    // alert("Pmtpt_code *"+"Pmt"+pt_code+"* ap_queryAndDownload.CONFIG.first_tab_PMT "+ap_queryAndDownload.CONFIG.first_tab_PMT);
//                    if(("Pmt"+pt_code) == ap_queryAndDownload.CONFIG.first_tab_PMT)
//                    {
//                        $("#selection_" + listboxID).jqxComboBox({ checkboxes: true, height: 25, width: '100%', source: data});
//                    }
//
//                    //Initialize the element array of the ALL tabs in the map
////                        for(var i=0; i<tabNameCode.length; i++)
////                        {
//                    //  console.log("populateStandardTab i= "+i+" tabNameCode[i] "+tabNameCode[i]);
//                    //Get the single tab
////                            var map_obj = ap_queryAndDownload.CONFIG.selection_map[tabNameCode[i]];
//                    //console.log("ptcode "+pt_code+" ptlabel "+pt_label);
//                    var map_obj = ap_queryAndDownload.CONFIG.selection_map["Pmt"+pt_code];
//                    //Creating the array for the elements and the values for each tab
//                    var count = 0;
//                    // var i=0;
//
//                    for(var j=0; j<data.length; j++)
//                    {
//                        if(j==0)
//                        {
//                            //console.log("pt_label "+pt_label);
//                            map_obj.elements_name[j]= $.i18n.prop('_selectAll_list_item') +"("+pt_label+")";
////                                    map_obj.elements_name[j]= $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[i]+")";
//                        }
//                        else{
//                            map_obj.elements_name[j]= data[j].label;
//                        }
//                        map_obj.elements_value[j]= false;
//                        map_obj.elements_code[j]= code[j];
////                                map_obj.elements_id[j]= tabNameCode[i]+"_"+ count;
//                        map_obj.elements_id[j]= "Pmt"+pt_code+"_"+ count;
//                        count++;
//                        // i++;
//                    }
//                    //  alert("map_obj.elements_id= "+map_obj.elements_id);
//                    //}
//                    ap_queryAndDownload.CONFIG.active_tab[listboxID]= tabNameCode[0];
                },

                error : function(err,b,c) {
                    alert(err.status + ", " + b + ", " + c);
                }
            });
        }
    };

    //The type is the name of the tab in the page example:'Commodity', 'Country'
    //The source is the data to show in the tab(it's an array)
    function buildTab(type, sources){
        //console.log("buildTab type "+type);
        //console.log("buildTab sources 2 "+sources[0][0].label);
        var ap_list_tab_obj = new Object();
        switch(type)
        {
            case ap_queryAndDownload.CONFIG.commodity_type:
//                ap_list_tab.CONFIG.custom_widget='jqxCommodityTabs';
//                ap_list_tab.CONFIG.tabs_num=1;
//                ap_list_tab.CONFIG.property_object = {height: 200, position: 'top', animationType: 'fade'};
//                ap_list_tab.CONFIG.tabs_title=[$.i18n.prop('_commodity_class_title')];
//                ap_list_tab.CONFIG.main_tabs_id = 'jqxtabs_commodity';
//                ap_list_tab.CONFIG.tabs_id=['jqxlist_commodity'];
//                ap_list_tab.CONFIG.tabs_text=[''];
//                ap_list_tab.CONFIG.tabs_init_function=[ap_list_tab.init_list];


                ap_list_tab_obj.custom_widget='jqxCommodityTabs';
                ap_list_tab_obj.tabs_num=1;
                ap_list_tab_obj.property_object = {height: 200, position: 'top', animationType: 'fade'};
                ap_list_tab_obj.tabs_title=[$.i18n.prop('_commodity_class_title')];
                ap_list_tab_obj.main_tabs_id = 'jqxtabs_commodity';
                ap_list_tab_obj.tabs_id=['jqxlist_commodity'];
                ap_list_tab_obj.tabs_text=[''];
                ap_list_tab_obj.tabs_init_function=[ap_list_tab.init_list];
                ap_list_tab_obj.tab_sources=sources;
               // console.log("ap_list_tab.CONFIG.tabs_init_functions[0] "+ap_list_tab.CONFIG.tabs_init_function[0]);
                break;
//            case ap_queryAndDownload.CONFIG.country_type:
//                ap_list_tab.CONFIG.custom_widget='jqxCountryTabs';
//                ap_list_tab.CONFIG.tabs_num=1;
//                ap_list_tab.CONFIG.property_object = {height: 200, position: 'top', animationType: 'fade'};
//                ap_list_tab.CONFIG.tabs_title=[$.i18n.prop('_selection_map_Countries')];
//                ap_list_tab.CONFIG.main_tabs_id = 'jqxtabs_country';
//                ap_list_tab.CONFIG.tabs_id=['jqxlist_country'];
//                ap_list_tab.CONFIG.tabs_text=[''];
//                ap_list_tab.CONFIG.tabs_init_function=[ap_list_tab.init_list];
//                // console.log("ap_list_tab.CONFIG.tabs_init_functions[0] "+ap_list_tab.CONFIG.tabs_init_function[0]);
//                break;
            case ap_queryAndDownload.CONFIG.country_type:
               // var ap_list_tab_obj = new Object();
                ap_list_tab_obj.custom_widget='jqxCountryTabs';
                ap_list_tab_obj.tabs_num=1;
                ap_list_tab_obj.property_object = {height: 200, position: 'top', animationType: 'fade'};
                ap_list_tab_obj.tabs_title=[$.i18n.prop('_selection_map_Countries')];
                ap_list_tab_obj.main_tabs_id = 'jqxtabs_country';
                ap_list_tab_obj.tabs_id=['jqxlist_country'];
                ap_list_tab_obj.tabs_text=[''];
                ap_list_tab_obj.tabs_init_function=[ap_list_tab.init_list];
                ap_list_tab_obj.tab_sources=sources;
                // console.log("ap_list_tab.CONFIG.tabs_init_functions[0] "+ap_list_tab.CONFIG.tabs_init_function[0]);
                break;
            case ap_queryAndDownload.CONFIG.policy_type:
                ap_list_tab_obj = ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes;
                console.log("ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.custom_widget "+ap_queryAndDownload.CONFIG.ap_list_tab_obj_policyTypes.custom_widget);
                console.log("ap_list_tab_obj.custom_widget "+ap_list_tab_obj.custom_widget);
                break;
        }

        //ap_list_tab.CONFIG.tab_sources=sources;
        ap_list_tab.init(ap_list_tab_obj);
    };

    function data_compare(firt_dd, first_mm, first_yy, second_dd, second_mm, second_yy){
        var last_date = '';
        if(second_yy>first_yy)
        {
            return last_date = 'second';
        }
        else if(second_yy<first_yy)
        {
            return last_date = 'first';
        }
        else if(second_yy==first_yy)
        {
            if(second_mm>first_mm)
            {
                return last_date = 'second';
            }
            else if(second_mm<first_mm)
            {
                return last_date = 'first';
            }
            else if(second_yy==first_yy)
            {
                if(second_dd>first_dd)
                {
                    return last_date = 'second';
                }
                else if(second_dd<first_dd)
                {
                    return last_date = 'first';
                }
                else if(second_yy==first_yy)
                {
                    //The date are equal
                    return last_date = 'first';
                }
            }
        }
    }

    return {
        CONFIG              :   CONFIG,
        init                :   init,
        buildUI             :   buildUI,
        buildBulkDownloads  :   buildBulkDownloads,
        buildCommodityPolicyDomain  :   buildCommodityPolicyDomain,
        buildTab            :   buildTab,
        buildSingleTab   :   buildSingleTab,
        buildMultipleTab   :   buildMultipleTab,
        buildPolicyMeasures :   buildPolicyMeasures,
        data_compare        :   data_compare
    };

    })();

window.addEventListener('load', ap_queryAndDownload.init, false);

