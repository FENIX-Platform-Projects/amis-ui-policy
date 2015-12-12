//var ap_policiesAtaGlance_exportRestrictions_util = (function() {
define([
    'jquery',
    'jqueryui',
    'highcharts',
    'highcharts_exporting',
    'ap_util_variables',
    'ap_policyDataObject',
    'ap_util_functions',
    'jQAllRangeSliders',
    'jqwidget',
    'bootstrap',
    'xDomainRequest'
], function($, ui, highcharts, highcharts_exporting, ap_utilVariables, ap_policyDataObject, ap_utilFunctions ){

    var from = '16-02-2014';
    var to = '18-02-2014';

    var pt_name_timeSeries_highcharts = {};
    var pt_name_timeSeries_highstockchart = {};

    //This contains the first and the last date in the database
    var original_start_date_dd = '';
    var original_start_date_mm = '';
    var original_start_date_yy = '';
    var original_end_date_dd = '';
    var original_end_date_mm = '';
    var original_end_date_yy = '';
    var original_start_date_yy_time_series = '';
    var start_date_dd = '';
    var start_date_mm = '';
    var start_date_yy = '';
    var end_date_dd = '';
    var end_date_mm = '';
    var end_date_yy = '';

    //For the charts in the tabs
    var submenu3_start_date_dd = '';
    var submenu3_start_date_mm = '';
    var submenu3_start_date_yy = '';
    var submenu3_end_date_dd = '';
    var submenu3_end_date_mm = '';
    var submenu3_end_date_yy = '';

    //For policy_type Export Measure =1
    //var policy_type_code = '1';
    var policy_type_code = ap_utilVariables.CONFIG.export_measure_policyType_code;
    var policy_types_array = [];

    function split_string(name){
        //console.log('split_string name '+name);
        var words = name.split(/[\s]+/);
        var numWordsPerLine = 4;
        var str = [];

        for (var word in words) {
            if (word > 0 && word % numWordsPerLine == 0)
                str.push('<br>');

            str.push(words[word]);
        }
        // console.log('split_string str '+str);
        return str.join(' ');
    }

    function break_label (label) {
        //  alert('Before '+label);
        var blank_count = 0;
        var chars_limit = 25;
        var words_limit = 3;
        for (var z = 0; z < label.length; z++) {
            if (label.charAt(z) == ' ') {
                blank_count++;
                if (blank_count >= words_limit || z >= chars_limit) {
                   // console.log('After '+label.substring(0, z) + '<br>' + label.substring(1 + z));
                    return label.substring(0, z) + '<br>' + label.substring(1 + z);
                }
            }
        }
        //alert('After '+label);

        return label;
    }

    function buttonEventsSetting(){
        $('#bd2_submenu3-chart_one_download').click(function(e){
            //All
            var commodity_index = 0;
            var title = "Number of AMIS countries export restrictions on wheat, maize, rice or soybeans, disaggregated by policy type";
            var policy_type_code = 1;
            var policy_type_name = "Export Measures";
            exportMeasure_timeSeries_download(policy_type_code, policy_type_name, commodity_index, title);
        });

        $('#bd2_submenu3-chart_two_download').click(function(e){
            //Ethanol
            var commodity_index = 1;
            var title = "Number of AMIS countries export restrictions on wheat, disaggregated by policy type";
            var policy_type_code = 1;
            var policy_type_name = "Export Measures";
            exportMeasure_timeSeries_download(policy_type_code, policy_type_name, commodity_index, title);
        });

        $('#bd2_submenu3-chart_three_download').click(function(e){
            //Biodiesel
            var commodity_index = 2;
            var title = "Number of AMIS countries export restrictions on maize, disaggregated by policy type";
            var policy_type_code = 1;
            var policy_type_name = "Export Measures";
            exportMeasure_timeSeries_download(policy_type_code, policy_type_name, commodity_index, title);
        });

        $('#bd2_submenu3-chart_four_download').click(function(e){
            //Biofuel (unspecified)
            var commodity_index = 3;
            var title = "Number of AMIS countries export restrictions on rice, disaggregated by policy type";
            var policy_type_code = 1;
            var policy_type_name = "Export Measures";
            exportMeasure_timeSeries_download(policy_type_code, policy_type_name, commodity_index, title);
        });

        $('#bd2_submenu3-chart_five_download').click(function(e){
            //Biofuel (unspecified)
            var commodity_index = 4;
            var title = "Number of AMIS countries export restrictions on soybeans, disaggregated by policy type";
            var policy_type_code = 1;
            var policy_type_name = "Export Measures";
            exportMeasure_timeSeries_download(policy_type_code, policy_type_name, commodity_index, title);
        });
    }

    function exportMeasure_timeSeries_download(policy_type_code, policy_type_name, commodity_index, title){

        //Naming the tabs
        var namesArrayAll = ap_utilVariables.CONFIG.biofuel_commodity_class_names_all.split("-");

        var policyMeasureForPolicyTypesCount = policy_types_array.length;
        var policyTypesInfo = {};
        var policyTypesInfoName = {};

        var policy_type_codes_array = [];
        var policy_type_names_array = [];
        for(var z=0; z<policyMeasureForPolicyTypesCount; z++) {
            policy_type_codes_array.push(policy_types_array[z].value);
            policy_type_names_array.push(policy_types_array[z].label);
        }
        for(var z=0; z<policyMeasureForPolicyTypesCount; z++){
            policyTypesInfo[policy_types_array[z].value] = {};
            $.ajax({
                type: 'GET',
                url: "http://fenixservices.fao.org/d3s/msd/resources/OECD_PolicyType"+ap_utilVariables.CONFIG.commodity_domain_agriculturalForPolicyMeasure+"_"+ap_utilVariables.CONFIG.policy_domain_bothForPolicyMeasure+"_"+policy_types_array[z].value+"/1.0",
                dataType: 'json',
                async : false,

                success: function (response) {
                    /* Convert the response in an object, if needed. */
                    var json = response;
                    if (typeof(response) == 'string')
                        json = $.parseJSON(response);
                    var uid = response.metadata.uid;
                    var policyTypeIndex = uid.lastIndexOf("_");
                    var policyTypeCode = uid.substring(policyTypeIndex+1);
                    var jsonCodes = json.data;
                    if((jsonCodes!=null)&&(typeof jsonCodes!="undefined")&&(jsonCodes.length>0)) {
                        jsonCodes.sort(function (a, b) {
                            if (a.title.EN < b.title.EN)
                                return -1;
                            if (a.title.EN > b.title.EN)
                                return 1;
                            return 0;
                        });
                        var policy_measure_codes = [];
                        var policy_measure_names = [];
                        var pm_name_timeSeries_highcharts = [];
                        //REMOVE THIS CODE TO MANAGE WTO DATA START
                        var j = 0;
                        for (var i = 0; i < jsonCodes.length; i++) {
//                        var c = json.rootCodes[i].code;
//                        var l = json.rootCodes[i].title['EN'];
                            if (policy_type_code == '2') {
                                //WTO DATA have to be removed
                                if ($.inArray(jsonCodes[i].code, ap_utilVariables.CONFIG.WTOImportCodes) == -1) {
                                    var pm_code_accepted = $.inArray(policy_measure_codes[j], ap_utilVariables.CONFIG.export_measures_codes);
                                    if(pm_code_accepted!=-1) {
                                        policy_measure_codes[j] = jsonCodes[i].code;
                                        pm_name_timeSeries_highcharts["" + (j + 1)] = jsonCodes[i].title['EN'];
                                        policy_measure_names[j] = jsonCodes[i].title['EN'];
                                        policyTypesInfo[policy_types_array[z].value][policy_measure_codes[j]] = policy_measure_names[j];
                                        j++;
                                    }
                                }
                            }
                            else {
                                //console.log(jsonCodes[i].code)
                                //console.log(ap_utilVariables.CONFIG.export_measures_codes)

                                var pm_code_accepted = $.inArray(jsonCodes[i].code, ap_utilVariables.CONFIG.export_measures_codes);
                                if(pm_code_accepted!=-1){
                                    policy_measure_codes[j] = jsonCodes[i].code;
                                    pm_name_timeSeries_highcharts["" + (j + 1)] = jsonCodes[i].title['EN'];
                                    policy_measure_names[j] = jsonCodes[i].title['EN'];
                                    policyTypesInfo[policy_types_array[z].value][policy_measure_codes[j]] = policy_measure_names[j];
                                    j++;
                                }
                            }
                        }
                        //console.log(policy_measure_codes)
                        //console.log(policy_measure_names)
                        //REMOVE THIS CODE TO MANAGE WTO DATA END

                        //REOPEN THIS CODE TO MANAGE WTO DATA START
//                for (var i = 0; i < json.rootCodes.length; i++) {
////                        var c = json.rootCodes[i].code;
////                        var l = json.rootCodes[i].title['EN'];
//                    policy_measure_codes[i] = jsonCodes[i].code;
//                    pm_name_timeSeries_highcharts[""+(i+1)] = jsonCodes[i].title['EN'];
//                }
                        //REOPEN THIS CODE TO MANAGE WTO DATA END
                        //policyTypesInfo[z] = policy_measure_codes;
                        //policyTypesInfoName[z]= policy_measure_names;
                        //policyTypesInfo[policy_types_array[z]] = policy_measure_codes;
                        //policyTypesInfoName[policy_types_array[z]]= policy_measure_names;
                        //console.log("policy_types_array[z]!!!!!!!")
                        //console.log(policy_types_array[z])
                        //policyTypesInfo[policy_types_array[z].value]= {};
                        //policyTypesInfo[policy_types_array[z].value][policy_measure_codes[j]] = policy_measure_names[j];
                        //policyTypesInfo["5"]= {};
                        //policyTypesInfoName["5"]["2"]= "2";
                        //policyTypesInfo[policy_types_array[z]]
                        //forGetMasterData.subnational_for_coutry[country][child_code]=child_name;
                    }
                    //var policy_type_codes_array = [];
                    //policy_type_codes_array.push(policy_type_code);
                    //var policy_type_names_array = [];
                    //policy_type_names_array.push(policy_type_name);

                    var payloadrest = JSON.stringify(data);
                    /* Retrive UI structure from DB. */
                    if(z==policyMeasureForPolicyTypesCount-1){

                        var commodityCodesArray = ap_utilVariables.CONFIG.export_commodity_class_codes_all.split("-");
                        var iCommodityCode = commodity_index;
                        var data = ap_policyDataObject.init();
                        data.datasource = ap_utilVariables.CONFIG.datasource;
                        data.commodity_class_code = commodityCodesArray[iCommodityCode];
                        data.policy_type_code = policy_type_codes_array;
                        data.policy_type_name = policy_type_names_array;
                        data.policy_measure_code = policy_measure_codes;
                        data.policy_measure_name = policy_measure_names;
                        //data.policyTypesMeasureInfo = policyTypesInfo;
                        data.policyTypesMeasureInfoName = policyTypesInfo;
                        //                data.start_date = '05/05/2010';
                        //                data.end_date = '05/04/2011';
//                    data.start_date = '' + start_date_dd + '/' + start_date_mm + '/' + start_date_yy;
//                    data.end_date = '' + end_date_dd + '/' + end_date_mm + '/' + end_date_yy;
                        original_start_date_dd = ap_utilFunctions.data_change('' + original_start_date_dd);
                        var start_month = parseInt(original_start_date_mm, 10) +1;
                        original_start_date_mm = ap_utilFunctions.data_change('' + original_start_date_mm);
                        var end_month = parseInt(original_end_date_mm, 10) +1;
                        original_end_date_dd = ap_utilFunctions.data_change('' + original_end_date_dd);
                        original_end_date_mm = ap_utilFunctions.data_change('' + original_end_date_mm);
                        //original_end_date_mm = ap_utilFunctions.data_change('' + end_month);
                        var original_start_date_mm_for_export = ap_utilFunctions.data_change('' + start_month);
                        var original_end_date_mm_for_export = ap_utilFunctions.data_change('' + end_month);
                        //data.start_date = '' + original_start_date_yy_time_series + '-' + original_start_date_mm + '-' + original_start_date_dd;
                        //data.end_date = '' + original_end_date_yy + '-' + original_end_date_mm + '-' + original_end_date_dd;
                        data.start_date = '' + original_start_date_yy_time_series + '-' + original_start_date_mm_for_export + '-' + original_start_date_dd;
                        data.end_date = '' + original_end_date_yy + '-' + original_end_date_mm_for_export + '-' + original_end_date_dd;
                        //console.log("DATA")
                        //console.log(data)
                        /** Stream the Excel through the hidden form */
                        $('#datasource_ER').val(data.datasource);
                        $('#thousandSeparator_ER').val(',');
                        $('#decimalSeparator_ER').val('.');
                        $('#decimalNumbers_ER').val('2');
                        $('#json_ER').val(JSON.stringify(data));
                        $('#cssFilename_ER').val('');
                        $('#valueIndex_ER').val(null);
                        $('#quote_ER').val('');
                        $('#title_ER').val(title);
                        $('#subtitle_ER').val('');
                        document.exportRestrictionsTimeSeriesExcel.submit();
                    }
                },
                error: function (err, b, c) {
                    alert(err.status + ", " + b + ", " + c);
                }
            });
        }
    };

    function subMenu0(start_date_dd_int, start_date_mm_int, start_date_yy_int, end_date_dd_int, end_date_mm_int, end_date_yy_int, start_date_yy_int_time_series){
        // $('#nav-wrapper').height($("#nav").height());
        //start_date_mm_int and end_date_mm_int are already with -1
        //To remove the AFFIX START
//        $("#bd2_submenu0_row_option").affix({
//            offset: { top: $("#bd2_submenu0_row_option").offset().top }
//          });
//
//        // ensure the affix element maintains it width
//        var affix = $("#bd2_submenu0_row_option");
//        var width = affix.width();
//        affix.width(width);
        //To remove the AFFIX END

        start_date_dd = '1';
        start_date_mm = '0';
        start_date_yy = '2010';
        end_date_dd = '1';
        end_date_mm = '0';
        end_date_yy = '2014';

//        start_date_dd = '1';
//        start_date_mm = '9';
//        start_date_yy = '2006';
//        end_date_dd = '1';
//        end_date_mm = '5';
//        end_date_yy = '2007';

        original_start_date_dd = ''+start_date_dd_int;
        original_start_date_mm = ''+start_date_mm_int;
        original_start_date_yy = ''+start_date_yy_int;
        original_start_date_yy_time_series = ''+start_date_yy_int_time_series;
        original_end_date_dd = ''+end_date_dd_int;
        original_end_date_mm = ''+end_date_mm_int;
        original_end_date_yy = ''+end_date_yy_int;

        policy_types_array = [];
        var row = {};
        row.value = policy_type_code;
        row.label = ap_utilVariables.CONFIG.export_restrictions_policyType_code;
        policy_types_array.push(row);

        $("#bd2_submenu0-slider_2_container").dateRangeSlider( {
            step: { days : 1 },
            bounds: {
                min:  new Date(original_start_date_yy, original_start_date_mm, original_start_date_dd),
                max:  new Date(original_end_date_yy, original_end_date_mm, original_end_date_dd)
            },
            defaultValues: {
//                min:  new Date(2013, 3, 16),
//                max:  new Date(2013, 8, 17)
                min:  new Date(start_date_yy, start_date_mm, start_date_dd),
                max:  new Date(end_date_yy, end_date_mm, end_date_dd)
            },
            wheelMode: "zoom",
            formatter :function(val){
                var date2 = new Date(val);
                var days = date2.getDate(),
                    month = date2.getMonth() + 1,
                    year = date2.getFullYear();
                return month + "/" + year;
//                return days + "/" + month + "/" + year;
            }
        });

        $("#bd2_submenu0-slider_2_container").bind("valuesChanged", function(e, data){
            //The elements in the slider have been changed so... update the model to update the selected elements
            //Format
            var selecteditems = $("#bd2_submenu0-slider_2_container").dateRangeSlider("values");

            var date2 = new Date(selecteditems.min);
            start_date_dd = date2.getDate();
            start_date_mm = date2.getMonth() + 1;
            start_date_yy = date2.getFullYear();
            date2 = new Date(selecteditems.max);
            end_date_dd = date2.getDate();
            end_date_mm = date2.getMonth() + 1;
            end_date_yy = date2.getFullYear();
        });

        //Slider Left Label(Min Value)
        $("#bd2_submenu0-slider_2_labelMin").text(original_start_date_yy);
        //Slider Rigth Label(Max Value)
        $("#bd2_submenu0-slider_2_labelMax").text(original_end_date_yy);

        //Policy Types Combobox
//        $.ajax({
//            type: 'GET',
//            url :   'http://'+ap_utilVariables.CONFIG.base_ip_address+':'+ap_utilVariables.CONFIG.base_ip_port+ap_utilVariables.CONFIG.biofuel_pt_url+ '/' + ap_utilVariables.CONFIG.datasource+ '/' + ap_utilVariables.CONFIG.biofuel_commodity_domain_code,
//            dataType: 'json',
//
//            success : function(response) {
//
//                var jsonPt = response;
//                if (typeof(response) == 'string')
//                    jsonPt = $.parseJSON(response);
////                console.log("jsonPt[0] "+jsonPt[0]+ " jsonPt.length "+jsonPt.length);
//                var policy_type_codes = [];
//                var policy_type_names = [];
//
//                var source = new Array();
//                for (var i = 0; i < jsonPt.length; i++) {
//                    var row = {};
//
//                    //Policy Type Code
//                    policy_type_codes[i] = jsonPt[i][0];
//                    row.value = policy_type_codes[i];
//                    //Policy Type Name
//                    policy_type_names[i] = jsonPt[i][1];
//                    row.label = policy_type_names[i];
//                    source.push(row);
//                }
//                $("#bd2_submenu0_combobox1").jqxComboBox({ source: source, selectedIndex: 0, height: '25px', displayMember: 'label', valueMember: 'value'});
//                $("#bd2_submenu0_combobox2").jqxComboBox({ source: source, selectedIndex: 0, height: '25px', displayMember: 'label', valueMember: 'value'});
//
//                $('#bd2_submenu0_combobox1').on('select', function (event)
//                {
//                    var args = event.args;
//                    if (args) {
//                        var item = args.item;
//                        //Policy type code
//                        policy_type_combobox1 = item.value;
//                    }
//                });
//                $('#bd2_submenu0_combobox2').on('select', function (event)
//                {
//                    var args = event.args;
//                    if (args) {
//                        var item = args.item;
//                        //Policy type code
//                        policy_type_combobox2 = item.value;
//                    }
//                });
//                subMenu1(source[0].value);
//                subMenu3(source[0].value);
//            },
//            error : function(err,b,c) {
//                alert(err.status + ", " + b + ", " + c);
//            }
//        });

        subMenu1(policy_type_code);
        subMenu3(policy_type_code, 0);

        $("#bd2_submenu0-button").on('click', function () {
            subMenu1(policy_type_code);
            // subMenu3();
        });

        //All
        $("#bd2_submenu3-chart_one_title").on('click', function () {
            subMenu3(policy_type_code, 0);
            // subMenu3();
        });

        //Wheat
        $("#bd2_submenu3-chart_two_title").on('click', function () {
            subMenu3(policy_type_code, 1);
            // subMenu3();
        });

        //Maize
        $("#bd2_submenu3-chart_three_title").on('click', function () {
            subMenu3(policy_type_code, 2);
            // subMenu3();
        });

        //Rice
        $("#bd2_submenu3-chart_four_title").on('click', function () {
            subMenu3(policy_type_code, 3);
            // subMenu3();
        });

        //Soybeans
        $("#bd2_submenu3-chart_five_title").on('click', function () {
            subMenu3(policy_type_code, 4);
            // subMenu3();
        });

//        $("#bd2_submenu0-button2").on('click', function () {
//            subMenu3(policy_type_code);
//            // subMenu3();
//        });

        var selecteditems = $("#bd2_submenu0-slider_2_container").dateRangeSlider("values");

        var date2 = new Date(selecteditems.min);
        start_date_dd = date2.getDate();
        start_date_mm = date2.getMonth() + 1;
        start_date_yy = date2.getFullYear();
        date2 = new Date(selecteditems.max);
        end_date_dd = date2.getDate();
        end_date_mm = date2.getMonth() + 1;
        end_date_yy = date2.getFullYear();
    }

    function subMenu1(policy_type_code){
        $.ajax({
            type: 'GET',
            //url: "http://faostat3.fao.org/d3sp/service/msd/cl/system/OECD_CommodityClass1/1.0",
            //url: ap_utilVariables.CONFIG.codelist_url +"/"+ ap_utilVariables.CONFIG.codelist_url_PolicyType+ policy_type_code +"/1.0",
            url: "http://fenixservices.fao.org/d3s/msd/resources/OECD_PolicyType"+ap_utilVariables.CONFIG.commodity_domain_agriculturalForPolicyMeasure+"_"+ap_utilVariables.CONFIG.policy_domain_bothForPolicyMeasure+"_"+policy_type_code+"/1.0",
            dataType: 'json',

            success: function (response) {
                /* Convert the response in an object, if needed. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
                //To order the json elements based on the title(label)
                var jsonCodes = json.data;
                if((jsonCodes!=null)&&(typeof jsonCodes!="undefined")&&(jsonCodes.length>0)) {
                    jsonCodes.sort(function (a, b) {
                        if (a.title.EN < b.title.EN)
                            return -1;
                        if (a.title.EN > b.title.EN)
                            return 1;
                        return 0;
                    });

                    var policy_measure_codes = [];
                    var policy_measure_names = [];
                    var pm_name_timeSeries_highcharts = [];
                    for (var i = 0; i < jsonCodes.length; i++) {
//                        var c = json.rootCodes[i].code;
//                        var l = json.rootCodes[i].title['EN'];
                        // policy_measure_codes[i] = jsonCodes[i].code;
                        var obj = new Object();
                        obj.code = jsonCodes[i].code;
                        obj.name = jsonCodes[i].title['EN'];
                        ap_utilVariables.CONFIG.export_measure_obj_array.push(obj);
                        // pm_name_timeSeries_highcharts[""+(i+1)] = jsonCodes[i].title['EN'];
                    }

                    for (var i = 0; i < ap_utilVariables.CONFIG.export_measures_codes.length; i++) {
                        var code = ap_utilVariables.CONFIG.export_measures_codes[i];
                        for (var j = 0; j < ap_utilVariables.CONFIG.export_measure_obj_array.length; j++) {
                            if (code == ap_utilVariables.CONFIG.export_measure_obj_array[j].code) {
                                pm_name_timeSeries_highcharts["" + (i + 1)] = ap_utilVariables.CONFIG.export_measure_obj_array[j].name;
                            }
                        }
                    }

                    var policy_type_codes_array = [];
                    policy_type_codes_array.push(policy_type_code);
                    var data = ap_policyDataObject.init();
                    data.datasource = ap_utilVariables.CONFIG.datasource;
                    data.commodity_class_code = ap_utilVariables.CONFIG.export_commodity_class_codes;
                    //The order is important
                    data.policy_type_code = policy_type_codes_array;
                    data.policy_measure_code = ap_utilVariables.CONFIG.export_measures_codes;
//                data.start_date = '05/05/2010';
//                data.end_date = '05/04/2011';
                    start_date_dd = ap_utilFunctions.data_change('' + start_date_dd);
                    start_date_mm = ap_utilFunctions.data_change('' + start_date_mm);
                    end_date_dd = ap_utilFunctions.data_change('' + end_date_dd);
                    end_date_mm = ap_utilFunctions.data_change('' + end_date_mm);
                    data.start_date = start_date_yy + '-' + start_date_mm + '-' + start_date_dd;
                    data.end_date = end_date_yy + '-' + end_date_mm + '-' + end_date_dd;
//                data.start_date = ''+start_date_dd+'/'+start_date_mm+'/'+start_date_yy;
//                data.end_date = ''+end_date_dd+'/'+end_date_mm+'/'+end_date_yy;

                    var payloadrest = JSON.stringify(data);
                    var commodityNamesArray = ap_utilVariables.CONFIG.export_commodity_class_names_all.split("-");
                    /* Retrive UI structure from DB. */
                    $.ajax({

                        type: 'POST',
                        url: 'http://' + ap_utilVariables.CONFIG.base_ip_address + ':' + ap_utilVariables.CONFIG.base_ip_port + ap_utilVariables.CONFIG.exportRestrictionsPolicyMeasuresBarChart_url,
                        data: {"pdObj": payloadrest},

                        success: function (response) {

                            /* Convert the response in an object, i needed. */
                            var json = response;
                            if (typeof(response) == 'string')
                                json = $.parseJSON(response);

                            var o = {
                                chart: {
                                    type: 'column',
//                                events: {
//                                    load: function(event) {
//                                        // modify the legend symbol from a rect to a line
//                                        $('.highcharts-legend-item rect').attr('height', '2').attr('y', '10');
//                                    }
//                                },
                                    borderWidth: 2,
//                            marginBottom: 100
                                    marginBottom: 170,
                                    events: {
                                        load: function () {
                                            var label = this.renderer.label('Graph excludes mixed commodity classes.<br>Countries target their interventions on specific varieties, often at the HS8 or HS10 digit level.<br>Source: AMIS Policy Database')
                                                .css({
                                                    width: '450px',
                                                    //color: '#222',
                                                    fontSize: '9px'
                                                })
                                                .attr({
                                                    //'stroke': 'silver',
                                                    //'stroke-width': 2,
                                                    'r': 5,
                                                    'padding': 10
                                                })
                                                .add();

                                            label.align(Highcharts.extend(label.getBBox(), {
//                                            align: 'center',
                                                align: 'left',
                                                x: 0, // offset
                                                verticalAlign: 'bottom',
                                                y: 50 // offset
                                            }), null, 'spacingBox');

                                        }
                                    },
                                    spacingBottom: 50
                                },
                                title: {
                                    text: 'Number of AMIS countries with export restriction policies, disaggregated by policy measure',
                                    style: {"fontSize": "11px"}
                                },

                                subtitle: {
                                    text: 'Period ' + start_date_mm + '-' + start_date_yy + ' until ' + end_date_mm + '-' + end_date_yy
                                }, //[colour order: light blue, dark blue, light green, dark green, light grey, dark grey, red]
                                colors: [
                                    '#125824',//Dark Green
                                    '#255ba3',//Dark Blue
                                    '#f6b539',//Dark Yellow
                                    '#199e34',//Light Green
                                    //'#cccccc',//Light Gray
                                    '#7f7f7f',//Dark Gray
                                    '#67b7e3',//Light Blue
                                    '#dc3018'//Red
                                ],
                                xAxis: {
                                    categories: [
                                        commodityNamesArray[1],
                                        commodityNamesArray[2],
                                        commodityNamesArray[3],
                                        commodityNamesArray[4],
                                        commodityNamesArray[5]
                                    ]
                                },
                                yAxis: {
                                    min: 0,
                                    allowDecimals: false,
                                    title: {
                                        text: 'Number of AMIS Countries'
                                    }
                                }, tooltip: {
                                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
//                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                                        //   '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
                                    footerFormat: '</table>',
                                    shared: true,
                                    useHTML: true
                                },
//                            labels: {
//                                items: [
//                                    {
//                                        html: 'Graph excludes mixed commodity classes.<br>Countries target their interventions on specific varieties, often at the HS8 or HS10 digit level.<br>Source: AMIS Policy Database',
//                                        style: {
//                                            left: '1px',
//                                            //top: '300px',
//                                            top: '300px',
//                                            cursor: 'default',
//                                            color: '#413839',
//                                            fontSize: '10px'
//                                        }
//                                    }
//                                ]
//                            },
                                credits: {
                                    enabled: false
                                },
                                plotOptions: {
                                    column: {
                                        pointPadding: 0.2,
                                        borderWidth: 0
                                    }
                                },
                                legend: {
                                    title: {
                                        text: 'Policy Measure',
                                        style: {
                                            fontWeight: 'bold'
                                            //  fontStyle: 'italic',
                                            // textDecoration: 'underline'
                                        }
                                    },
//                                layout: 'vertical',
//                                align: 'right',
//                                verticalAlign: 'top',
//                                y: 50,
//                                borderWidth: 1,
//                                enabled: true,
//                                borderColor: '#4572a7',
                                    itemWidth: 230,
                                    //y: 10,

                                    //Start Before
//                                layout: 'vertical',
//                                align: 'right',
//                                verticalAlign: 'top',
                                    // y: 50,
                                    //End Before
                                    verticalAlign: 'center',
                                    layout: 'horizontal',
//                                layout: 'vertical',
                                    align: 'center',
                                    //align: 'left',
                                    y: 370,
                                    x: 0,
                                    useHTML: true,
//                                borderWidth: 1,
                                    enabled: true,
                                    borderColor: '#4572a7',
                                    labelFormatter: function () {
                                        //var html_legend = '<table><tr><td valign="top"><b>'+this.name+': </b></td><td>'+ split_string(pmt_name_description[this.name])+'</td></tr></table>';
//                                    var html_legend = ''+this.name+': '+ split_string(pm_name_timeSeries_highcharts[this.name])+'<br/>';
                                        var html_legend = '' + this.name + ': ' + '<span style="font-weight: normal;font-size: 10px;">' + pm_name_timeSeries_highcharts[this.name] + '</span>';
                                        return html_legend;
                                    }
                                },
//                            credits: {
//                                enabled: true,
//                                href: 'javascript:;',
//                                position: {
//                                    align: 'center'
//                                    // x: 10,
//                                    // y: -5
//                                },
//                                style: {
//                                    cursor: 'default',
//                                    color: '#413839',
//                                    fontSize: '10px'
//                                },
//                                text: 'In Australia, Brazil, Canada, Mexico and US policies can be implemented at State-level. Biodiesel, ethanol and biofuel are mutually exclusive categories --- Source: AMIS Policy'
//                            },
                                exporting: {
                                    buttons: {
                                        contextButton: {
                                            enabled: false

                                        },
                                        exportButton: {
                                            theme: {
                                                title: 'Download',
                                                'stroke-width': 1,
                                                stroke: '#4572a7',
                                                //fill: '#f5cd54',
                                                //  fill: '#bada55',
                                                fill: '#ADD8E6',
                                                r: 0,
                                                states: {
                                                    hover: {
                                                        fill: '#d3d3d3'
                                                    }
                                                }
                                            },
                                            text: 'Download',
                                            menuItems: [
                                                {
                                                    text: 'As PNG image',
                                                    onclick: function () {
                                                        //this.exportChart({filename: 'Export-restrictions-frequency_graph'});
                                                        var today = currentDate();
                                                        this.exportChart({filename: 'Export-restrictions-frequency_graph'}, {subtitle: {text: this.subtitle.textStr + today}});
//                                    this.exportChart(null, {  chart: {
//                                        style: {
//                                            fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
//                                            fontSize: '6px'
//                                        }
//                                    }});
//                                     this.exportChart(null, { sourceWidth: 1200,
//                                         sourceHeight: 400,
//                                         scale : 2,
//                                         chartOptions: {
//                                             yAxis: [{
//                                                 min: 0,
//                                                 max: 20
//                                             }]
//                                         }
//                                     });

                                                    }

                                                },
                                                {
                                                    text: 'As JPEG image',
                                                    onclick: function () {
                                                        var today = currentDate();
                                                        this.exportChart({
                                                            type: 'image/jpeg',
                                                            filename: 'Export-restrictions-frequency_graph'
                                                        }, {subtitle: {text: this.subtitle.textStr + today}});
                                                    }
                                                },
                                                {
                                                    text: 'As SVG vector image',
                                                    onclick: function () {
                                                        var today = currentDate();
                                                        this.exportChart({
                                                            type: 'image/svg+xml',
                                                            filename: 'Export-restrictions-frequency_graph'
                                                        }, {subtitle: {text: this.subtitle.textStr + today}});
                                                    }
                                                },
                                                {
                                                    text: 'To PDF document',
                                                    onclick: function () {
                                                        var today = currentDate();
                                                        this.exportChart({
                                                            type: 'application/pdf',
                                                            filename: 'Export-restrictions-frequency_graph'
                                                        }, {subtitle: {text: this.subtitle.textStr + today}});
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                },

                                series: json
                            };
                            console.log("Export Restriction chart");
                            console.log(JSON.stringify(o));
                            //Chart
                            $('#bd2_submenu1-chart_one').highcharts(o);
                        },

                        error: function (err, b, c) {
                            // alert(err.status + ", " + b + ", " + c);
                        }
                    });
                }
            },
            error : function(err,b,c) {
              //  alert(err.status + ", " + b + ", " + c);
            }
        });
    }

    //Original subMenu3 Start
    /* function subMenu3(){

     //alert("subMenu3");

     $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
     //            console.log(submenu3_start_date_yy);
     //            console.log(submenu3_start_date_mm);
     //            console.log(submenu3_start_date_yy);
     //            console.log(submenu3_start_date_yy);
     //            console.log(submenu3_start_date_yy);
     //            console.log(submenu3_start_date_yy);
     $(window).resize();
     var chart = $('#bd1_submenu3-chart_one').highcharts();
     if((chart!=null)&&(typeof chart != 'undefined'))
     {
     chart.xAxis[0].setExtremes(
     Date.UTC(parseInt(submenu3_start_date_yy,10), parseInt(submenu3_start_date_mm,10), parseInt(submenu3_start_date_dd,10)),
     Date.UTC(parseInt(submenu3_end_date_yy,10), parseInt(submenu3_end_date_mm,10), parseInt(submenu3_end_date_dd,10))
     );
     }
     chart = $('#bd1_submenu3-chart_two').highcharts();
     if((chart!=null)&&(typeof chart != 'undefined'))
     {
     chart.xAxis[0].setExtremes(
     Date.UTC(parseInt(submenu3_start_date_yy,10), parseInt(submenu3_start_date_mm,10), parseInt(submenu3_start_date_dd,10)),
     Date.UTC(parseInt(submenu3_end_date_yy,10), parseInt(submenu3_end_date_mm,10), parseInt(submenu3_end_date_dd,10))
     );
     }
     chart = $('#bd1_submenu3-chart_three').highcharts();
     if((chart!=null)&&(typeof chart != 'undefined')) {
     chart.xAxis[0].setExtremes(
     Date.UTC(parseInt(submenu3_start_date_yy, 10), parseInt(submenu3_start_date_mm, 10), parseInt(submenu3_start_date_dd, 10)),
     Date.UTC(parseInt(submenu3_end_date_yy, 10), parseInt(submenu3_end_date_mm, 10), parseInt(submenu3_end_date_dd, 10))
     );
     }
     chart = $('#bd1_submenu3-chart_four').highcharts();
     if((chart!=null)&&(typeof chart != 'undefined')) {
     chart.xAxis[0].setExtremes(
     Date.UTC(parseInt(submenu3_start_date_yy, 10), parseInt(submenu3_start_date_mm, 10), parseInt(submenu3_start_date_dd, 10)),
     Date.UTC(parseInt(submenu3_end_date_yy, 10), parseInt(submenu3_end_date_mm, 10), parseInt(submenu3_end_date_dd, 10))
     );
     }
     });

     // alert("Before ajax rest url rest_url"+rest_url);
     $.ajax({
     type: 'GET',
     url :   'http://'+ap_utilVariables.CONFIG.base_ip_address+':'+ap_utilVariables.CONFIG.base_ip_port+ap_utilVariables.CONFIG.biofuel_pt_url+ '/' + ap_utilVariables.CONFIG.datasource+ '/' + ap_utilVariables.CONFIG.biofuel_commodity_domain_code,
     dataType: 'json',

     success : function(response) {
     // alert("success");
     *//* Convert the response in an object, i needed. *//*
     var jsonPt = response;
     if (typeof(response) == 'string')
     jsonPt = $.parseJSON(response);
     //                console.log("success "+jsonPt);
     //                console.log("jsonPt "+jsonPt);
     //                console.log("jsonPt[0] "+jsonPt[0]+ " jsonPt.length "+jsonPt.length);
     var policy_type_codes = [];
     var policy_type_names = [];
     for (var i = 0; i < jsonPt.length; i++) {
     //Policy Type Code
     policy_type_codes[i] = jsonPt[i][0];
     //Policy Type Name
     pt_name_timeSeries_highstockchart["" + (i + 1)] = jsonPt[i][1];
     }
     var commodityCodesArray = ap_utilVariables.CONFIG.biofuel_commodity_class_codes_all.split("-");
     for(var iCommodityCode =0; iCommodityCode<commodityCodesArray.length; iCommodityCode++)
     {
     var data = ap_policyDataObject.init();
     data.datasource = ap_utilVariables.CONFIG.datasource;
     data.commodity_class_code = commodityCodesArray[iCommodityCode];
     data.policy_type_code = policy_type_codes;
     //                data.start_date = '05/05/2010';
     //                data.end_date = '05/04/2011';
     data.start_date = '' + start_date_dd + '/' + start_date_mm + '/' + start_date_yy;
     data.end_date = '' + end_date_dd + '/' + end_date_mm + '/' + end_date_yy;
     var payloadrest = JSON.stringify(data);
     *//* Retrive UI structure from DB. *//*
     console.log("Before Post "+data.commodity_class_code);
     $.ajax({

     type: 'POST',
     url: 'http://' + ap_utilVariables.CONFIG.base_ip_address + ':' + ap_utilVariables.CONFIG.base_ip_port + ap_utilVariables.CONFIG.biofuelTimeSeries_url,
     data: {"pdObj": payloadrest},

     success: function (response) {

     *//* Convert the response in an object, i needed. *//*
     var json = response;
     if (typeof(response) == 'string')
     json = $.parseJSON(response);
     //console.log("Success json *"+json.name+"*"+" array "+json.data);
     var seriesOptions = json.dataArray;
     var commodityClassCode = json.commodityClassCode;
     var commodityClassName = '';
     var chart_div = '';

     if ((commodityClassCode != null) && (typeof commodityClassCode != 'undefined')) {
     //Check which is the commodity class
     var codesArray = ap_utilVariables.CONFIG.biofuel_commodity_class_codes_all.split("-");
     var namesArray = ap_utilVariables.CONFIG.biofuel_commodity_class_names_all.split("-");
     if(commodityClassCode==codesArray[0])
     {
     commodityClassName = namesArray[0];
     chart_div = "bd1_submenu3-chart_one";
     $("#bd1_submenu3-chart_one_title").text(commodityClassName);
     console.log("Before create chart 1 " + commodityClassName);
     }
     else if(commodityClassCode==codesArray[1])
     {
     commodityClassName = namesArray[1];
     chart_div = "bd1_submenu3-chart_two";
     $("#bd1_submenu3-chart_two_title").text(commodityClassName);
     console.log("Before create chart 2 " + commodityClassName);
     }
     else if(commodityClassCode==codesArray[2])
     {
     commodityClassName = namesArray[2];
     chart_div = "bd1_submenu3-chart_three";
     $("#bd1_submenu3-chart_three_title").text(commodityClassName);
     console.log("Before create chart 3 " + commodityClassName);
     }
     else if(commodityClassCode==codesArray[3])
     {
     commodityClassName = namesArray[3];
     chart_div = "bd1_submenu3-chart_four";
     $("#bd1_submenu3-chart_four_title").text(commodityClassName);
     console.log("Before create chart 4 " + commodityClassName);
     }
     createChart(chart_div, seriesOptions, commodityClassName);
     }
     },

     error: function (err, b, c) {
     alert(err.status + ", " + b + ", " + c);
     }
     });
     }
     },
     error : function(err,b,c) {
     alert(err.status + ", " + b + ", " + c);
     }
     });
     };*/
    //Original subMenu3 End

    function subMenu3(policy_type_code, commodity_index){
        //console.log("In submenu3 policy_type_code "+policy_type_code);

//        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
//            $(window).resize();
//            var chart = $('#bd2_submenu3-chart_one').highcharts();
//            if((chart!=null)&&(typeof chart != 'undefined'))
//            {
//                chart.xAxis[0].setExtremes(
//                    Date.UTC(parseInt(submenu3_start_date_yy,10), parseInt(submenu3_start_date_mm,10), parseInt(submenu3_start_date_dd,10)),
//                    Date.UTC(parseInt(submenu3_end_date_yy,10), parseInt(submenu3_end_date_mm,10), parseInt(submenu3_end_date_dd,10))
//                );
//            }
//            chart = $('#bd2_submenu3-chart_two').highcharts();
//            if((chart!=null)&&(typeof chart != 'undefined'))
//            {
//                chart.xAxis[0].setExtremes(
//                    Date.UTC(parseInt(submenu3_start_date_yy,10), parseInt(submenu3_start_date_mm,10), parseInt(submenu3_start_date_dd,10)),
//                    Date.UTC(parseInt(submenu3_end_date_yy,10), parseInt(submenu3_end_date_mm,10), parseInt(submenu3_end_date_dd,10))
//                );
//            }
//            chart = $('#bd2_submenu3-chart_three').highcharts();
//            if((chart!=null)&&(typeof chart != 'undefined')) {
//                chart.xAxis[0].setExtremes(
//                    Date.UTC(parseInt(submenu3_start_date_yy, 10), parseInt(submenu3_start_date_mm, 10), parseInt(submenu3_start_date_dd, 10)),
//                    Date.UTC(parseInt(submenu3_end_date_yy, 10), parseInt(submenu3_end_date_mm, 10), parseInt(submenu3_end_date_dd, 10))
//                );
//            }
//            chart = $('#bd2_submenu3-chart_four').highcharts();
//            if((chart!=null)&&(typeof chart != 'undefined')) {
//                chart.xAxis[0].setExtremes(
//                    Date.UTC(parseInt(submenu3_start_date_yy, 10), parseInt(submenu3_start_date_mm, 10), parseInt(submenu3_start_date_dd, 10)),
//                    Date.UTC(parseInt(submenu3_end_date_yy, 10), parseInt(submenu3_end_date_mm, 10), parseInt(submenu3_end_date_dd, 10))
//                );
//            }
//            chart = $('#bd2_submenu3-chart_five').highcharts();
//            if((chart!=null)&&(typeof chart != 'undefined')) {
//                chart.xAxis[0].setExtremes(
//                    Date.UTC(parseInt(submenu3_start_date_yy, 10), parseInt(submenu3_start_date_mm, 10), parseInt(submenu3_start_date_dd, 10)),
//                    Date.UTC(parseInt(submenu3_end_date_yy, 10), parseInt(submenu3_end_date_mm, 10), parseInt(submenu3_end_date_dd, 10))
//                );
//            }
//        });

        //Naming the tabs
        var namesArrayAll = ap_utilVariables.CONFIG.export_commodity_class_names_all.split("-");
        $("#bd2_submenu3-chart_one_title").text(namesArrayAll[0]);
        $("#bd2_submenu3-chart_two_title").text(namesArrayAll[1]);
        $("#bd2_submenu3-chart_three_title").text(namesArrayAll[2]);
        $("#bd2_submenu3-chart_four_title").text(namesArrayAll[3]);
        $("#bd2_submenu3-chart_five_title").text(namesArrayAll[4]);

        //To get the names of export policy measures
        $.ajax({
            type: 'GET',
            //url: "http://faostat3.fao.org/d3sp/service/msd/cl/system/OECD_CommodityClass1/1.0",
            //url: ap_utilVariables.CONFIG.codelist_url +"/"+ ap_utilVariables.CONFIG.codelist_url_PolicyType+ policy_type_code +"/1.0",
            url: "http://fenixservices.fao.org/d3s/msd/resources/OECD_PolicyType"+ap_utilVariables.CONFIG.commodity_domain_agriculturalForPolicyMeasure+"_"+ap_utilVariables.CONFIG.policy_domain_bothForPolicyMeasure+"_"+policy_type_code+"/1.0",
            dataType: 'json',

            success: function (response) {
                /* Convert the response in an object, if needed. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
                //To order the json elements based on the title(label)
                //var jsonCodes = json.rootCodes;
                //jsonCodes.sort(function (a, b) {
                //    if (a.title.EN < b.title.EN)
                //        return -1;
                //    if (a.title.EN > b.title.EN)
                //        return 1;
                //    return 0;
                //});

                var jsonCodes = json.data;
                if((jsonCodes!=null)&&(typeof jsonCodes!="undefined")&&(jsonCodes.length>0)) {
                    jsonCodes.sort(function (a, b) {
                        if (a.title.EN < b.title.EN)
                            return -1;
                        if (a.title.EN > b.title.EN)
                            return 1;
                        return 0;
                    });
                    var policy_measure_codes = [];
                    var policy_measure_names = [];
                    var pm_name_timeSeries_highcharts = [];
                    for (var i = 0; i < jsonCodes.length; i++) {
//                        var c = json.rootCodes[i].code;
//                        var l = json.rootCodes[i].title['EN'];
                        // policy_measure_codes[i] = jsonCodes[i].code;
                        var obj = new Object();
                        obj.code = jsonCodes[i].code;
                        obj.name = jsonCodes[i].title['EN'];
                        ap_utilVariables.CONFIG.export_measure_obj_array.push(obj);
                        // pm_name_timeSeries_highcharts[""+(i+1)] = jsonCodes[i].title['EN'];
                    }

                    for (var i = 0; i < ap_utilVariables.CONFIG.export_measures_codes.length; i++) {
                        var code = ap_utilVariables.CONFIG.export_measures_codes[i];
                        for (var j = 0; j < ap_utilVariables.CONFIG.export_measure_obj_array.length; j++) {
                            if (code == ap_utilVariables.CONFIG.export_measure_obj_array[j].code) {
                                pm_name_timeSeries_highcharts["" + (i + 1)] = ap_utilVariables.CONFIG.export_measure_obj_array[j].name;
                            }
                        }
                    }

                    var policy_type_codes_array = [];
                    policy_type_codes_array.push(policy_type_code);
//                var data = ap_policyDataObject.init();
//                data.datasource = ap_utilVariables.CONFIG.datasource;
//                data.commodity_class_code = ap_utilVariables.CONFIG.biofuel_commodity_class_codes;
//                //The order is important
//                data.policy_type_code = policy_type_codes_array;
//                data.policy_measure_code = policy_measure_codes;
////                data.start_date = '05/05/2010';
////                data.end_date = '05/04/2011';
//                data.start_date = ''+start_date_dd+'/'+start_date_mm+'/'+start_date_yy;
//                data.end_date = ''+end_date_dd+'/'+end_date_mm+'/'+end_date_yy;

//                var payloadrest = JSON.stringify(data);
                    /* Retrive UI structure from DB. */
                    // alert("Before ajax rest url rest_url"+rest_url);
                    var commodityCodesArray = ap_utilVariables.CONFIG.export_commodity_class_codes_all.split("-");
                    var iCommodityCode = commodity_index;
//                for(var iCommodityCode =0; iCommodityCode<commodityCodesArray.length; iCommodityCode++)
//                {
                    var data = ap_policyDataObject.init();
                    data.datasource = ap_utilVariables.CONFIG.datasource;
                    data.commodity_class_code = commodityCodesArray[iCommodityCode];
                    data.policy_type_code = policy_type_codes_array;
                    data.policy_measure_code = ap_utilVariables.CONFIG.export_measures_codes;
                    //                data.start_date = '05/05/2010';
                    //                data.end_date = '05/04/2011';
//                    data.start_date = '' + start_date_dd + '/' + start_date_mm + '/' + start_date_yy;
//                    data.end_date = '' + end_date_dd + '/' + end_date_mm + '/' + end_date_yy;
                    original_start_date_dd = ap_utilFunctions.data_change('' + original_start_date_dd);
                    original_start_date_mm = ap_utilFunctions.data_change('' + original_start_date_mm);
                    original_end_date_dd = ap_utilFunctions.data_change('' + original_end_date_dd);
                    original_end_date_mm = ap_utilFunctions.data_change('' + original_end_date_mm);
                    data.start_date = original_start_date_yy_time_series + '-' + original_start_date_mm + '-' + original_start_date_dd;
                    data.end_date = original_end_date_yy + '-' + original_end_date_mm + '-' + original_end_date_dd;

//                    data.start_date = '' + original_start_date_dd + '/' + original_start_date_mm + '/' + original_start_date_yy_time_series;
//                    data.end_date = '' + original_end_date_dd + '/' + original_end_date_mm + '/' + original_end_date_yy;
                    var payloadrest = JSON.stringify(data);
                    /* Retrive UI structure from DB. */
                    // console.log("Before Post "+data.commodity_class_code);
                    $.ajax({

                        type: 'POST',
                        url: 'http://' + ap_utilVariables.CONFIG.base_ip_address + ':' + ap_utilVariables.CONFIG.base_ip_port + ap_utilVariables.CONFIG.exportRestrictionsPoliciesMeasuresTimeSeries_url,
                        data: {"pdObj": payloadrest},

                        success: function (response) {

                            /* Convert the response in an object, i needed. */
                            var json = response;
                            if (typeof(response) == 'string')
                                json = $.parseJSON(response);
                            //console.log("Success json *"+json.name+"*"+" array "+json.data);
                            var seriesOptions = json.dataArray;
                            var commodityClassCode = json.commodityClassCode;
                            var commodityClassName = '';
                            var chart_div = '';

                            if ((commodityClassCode != null) && (typeof commodityClassCode != 'undefined')) {
                                //Check which is the commodity class
                                var codesArray = ap_utilVariables.CONFIG.export_commodity_class_codes_all.split("-");
                                var namesArray = ap_utilVariables.CONFIG.export_commodity_class_names_all_times_series.split("-");
                                if (commodityClassCode == codesArray[0]) {
                                    commodityClassName = 'wheat, maize, rice or soybeans';
                                    chart_div = "bd2_submenu3-chart_one";
                                    $("#bd2_submenu3-chart_two").hide();
                                    $("#bd2_submenu3-chart_three").hide();
                                    $("#bd2_submenu3-chart_four").hide();
                                    $("#bd2_submenu3-chart_five").hide();
                                    $("#bd2_submenu3-chart_one_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_two_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_three_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_four_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_five_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_one_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_two_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_three_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_four_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_five_title").removeClass("btn_policy_highstock_tab_active");

                                    $("#bd2_submenu3-chart_one_title").addClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_two_title").addClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_three_title").addClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_four_title").addClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_five_title").addClass("btn_policy_highstock_tab");
                                    $("#" + chart_div).show();
                                    // console.log("Before create chart 1 " + commodityClassName);
                                }
                                else if (commodityClassCode == codesArray[1]) {
                                    commodityClassName = namesArray[1];
                                    chart_div = "bd2_submenu3-chart_two";
                                    $("#bd2_submenu3-chart_one").hide();
                                    $("#bd2_submenu3-chart_three").hide();
                                    $("#bd2_submenu3-chart_four").hide();
                                    $("#bd2_submenu3-chart_five").hide();
                                    $("#bd2_submenu3-chart_one_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_two_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_three_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_four_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_five_title").removeClass("btn_policy_highstock_tab");

                                    $("#bd2_submenu3-chart_one_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_two_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_three_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_four_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_five_title").removeClass("btn_policy_highstock_tab_active");

                                    $("#bd2_submenu3-chart_one_title").addClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_two_title").addClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_three_title").addClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_four_title").addClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_five_title").addClass("btn_policy_highstock_tab");
                                    $("#" + chart_div).show();
                                    //$("#bd2_submenu3-chart_two_title").text(commodityClassName);
                                    //  console.log("Before create chart 2 " + commodityClassName);
                                }
                                else if (commodityClassCode == codesArray[2]) {
                                    commodityClassName = namesArray[2];
                                    chart_div = "bd2_submenu3-chart_three";
                                    $("#bd2_submenu3-chart_one").hide();
                                    $("#bd2_submenu3-chart_two").hide();
                                    $("#bd2_submenu3-chart_four").hide();
                                    $("#bd2_submenu3-chart_five").hide();
                                    $("#bd2_submenu3-chart_one_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_two_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_three_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_four_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_five_title").removeClass("btn_policy_highstock_tab");

                                    $("#bd2_submenu3-chart_one_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_two_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_three_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_four_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_five_title").removeClass("btn_policy_highstock_tab_active");

                                    $("#bd2_submenu3-chart_one_title").addClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_two_title").addClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_three_title").addClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_four_title").addClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_five_title").addClass("btn_policy_highstock_tab");
                                    $("#" + chart_div).show();
                                    //  console.log("Before create chart 3 " + commodityClassName);
                                }
                                else if (commodityClassCode == codesArray[3]) {
                                    commodityClassName = namesArray[3];
                                    chart_div = "bd2_submenu3-chart_four";
                                    $("#bd2_submenu3-chart_one").hide();
                                    $("#bd2_submenu3-chart_two").hide();
                                    $("#bd2_submenu3-chart_three").hide();
                                    $("#bd2_submenu3-chart_five").hide();
                                    $("#bd2_submenu3-chart_one_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_two_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_three_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_four_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_five_title").removeClass("btn_policy_highstock_tab");

                                    $("#bd2_submenu3-chart_one_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_two_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_three_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_four_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_five_title").removeClass("btn_policy_highstock_tab_active");

                                    $("#bd2_submenu3-chart_one_title").addClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_two_title").addClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_three_title").addClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_four_title").addClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_five_title").addClass("btn_policy_highstock_tab");
                                    $("#" + chart_div).show();
                                    // console.log("Before create chart 4 " + commodityClassName);
                                }
                                else if (commodityClassCode == codesArray[4]) {
                                    commodityClassName = namesArray[4];
                                    chart_div = "bd2_submenu3-chart_five";
                                    $("#bd2_submenu3-chart_one").hide();
                                    $("#bd2_submenu3-chart_two").hide();
                                    $("#bd2_submenu3-chart_three").hide();
                                    $("#bd2_submenu3-chart_four").hide();
                                    $("#bd2_submenu3-chart_one_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_two_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_three_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_four_title").removeClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_five_title").removeClass("btn_policy_highstock_tab");

                                    $("#bd2_submenu3-chart_one_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_two_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_three_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_four_title").removeClass("btn_policy_highstock_tab_active");
                                    $("#bd2_submenu3-chart_five_title").removeClass("btn_policy_highstock_tab_active");

                                    $("#bd2_submenu3-chart_one_title").addClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_two_title").addClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_three_title").addClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_four_title").addClass("btn_policy_highstock_tab");
                                    $("#bd2_submenu3-chart_five_title").addClass("btn_policy_highstock_tab_active");
                                    $("#" + chart_div).show();
                                    // console.log("Before create chart 5 " + commodityClassName);
                                }
                                createChart(chart_div, seriesOptions, commodityClassName, pm_name_timeSeries_highcharts);
                            }
                        },
                        error: function (err, b, c) {
                            //  alert(err.status + ", " + b + ", " + c);
                        }
                    });
                    //}
                }
            },
            error: function (err, b, c) {
              //  alert(err.status + ", " + b + ", " + c);
            }
        });
    };

    // create the chart when all data is loaded
    function createChart(chart_div, seriesOptions, title, pm_name_timeSeries_highcharts) {

//            $('#bd2_submenu3-chart_one').highcharts('StockChart', {
        $('#'+chart_div).highcharts('StockChart', {
            chart: {
                borderWidth: 2,
//                marginBottom: 120,
//                marginBottom: 80,
                marginBottom: 200,
                events: {
                    load: function(event) {
                        // modify the legend symbol from a rect to a line
                        $('.highcharts-legend-item path').attr('stroke-width', '12').attr('y', '10');
                        var label = this.renderer.label('Graph excludes mixed commodity classes.<br>Countries target their interventions on specific varieties, often at the HS8 or HS10 digit level.<br>Source: AMIS Policy Database')
                            .css({
                                width: '450px',
                                //color: '#222',
                                fontSize: '9px'
                            })
                            .attr({
                                //'stroke': 'silver',
                                //'stroke-width': 2,
                                'r': 5,
                                'padding': 50

                                //'paddingBottom': 50,
//                                'paddingLeft': 10
                            })
                            .add();

                        label.align(Highcharts.extend(label.getBBox(), {
//                                            align: 'center',
                            align: 'left',
                            x: -40, // offset
                            verticalAlign: 'bottom',
                            y: 60 // offset
                        }), null, 'spacingBox');
                    }
                },
                spacingBottom: 50

//                events: {
//                    selection: function(event) {
//                        console.log(
//                            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', event.xAxis[0].min),
//                            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', event.xAxis[0].max)
//                        );
//                    }
//                }
            },
            plotOptions: {
                area:{
                    dataGrouping: {
                        enabled: false
                    }
                },
                series: {
                    events: {
//                        legendItemClick: function () {
//                            alert('I am an alert series');
//                            $('.highcharts-legend-item path').attr('stroke-width', '12').attr('y', '10');
//                            //return false; // <== returning false will cancel the default action
//                        },
                        show: function () {
                            // alert('Show');
                            $('.highcharts-legend-item path').attr('stroke-width', '12').attr('y', '10');
                            //return false; // <== returning false will cancel the default action
                        }
                    }
                }
            },
            colors: [
                '#125824',//Dark Green
                '#255ba3',//Dark Blue
                '#f6b539',//Dark Yellow
                '#199e34',//Light Green
                //'#cccccc',//Light Gray
                '#7f7f7f',//Dark Gray
                '#67b7e3',//Light Blue
                '#dc3018'//Red
            ],
            navigator: {
//                top: 330
//                top: 270,
                top: 360
            },
            rangeSelector: {
                enabled: true,
                inputDateFormat: '%d-%m-%Y',
                inputEditDateFormat: '%d-%m-%Y',
                inputDateParser: function (value) {
                    value = value.split(/[-\.]/);
                    var month = parseInt(value[1],10)-1;
                    return Date.UTC(
                        parseInt(value[2], 10),
                        month,
                        parseInt(value[0], 10)
                    );
                }
            },

            xAxis : {
//                //min: Date.UTC(2003, 0,1),
//                max: Date.UTC(2014,11,30)

                min: Date.UTC(2010, 0,1),
                max: Date.UTC(2014,0,1),
                floor: Date.UTC(2007,0,1),
                //ceiling: Date.UTC(2016,0,1)
                ceiling: Date.UTC(2014,11,31)
            },

//                rangeSelector: {
//                    selected: 4
//                },
//            xAxis: {
//                events: {
//                    setExtremes: function(e) {
//                        //console.log(this);
//                        var date_start = new Date(this.min);
//                        submenu3_start_date_dd = date_start.getDate();
//                        submenu3_start_date_mm = date_start.getMonth() + 1;
//                        submenu3_start_date_yy = date_start.getFullYear();
//                        var date_end = new Date(this.max);
//                        submenu3_end_date_dd = date_end.getDate();
//                        submenu3_end_date_mm = date_end.getMonth() + 1;
//                        submenu3_end_date_yy = date_end.getFullYear();
//                    }
//                }
//            },
            yAxis: {
                min: 0,
                allowDecimals: false,
                title: {
                    text: 'Number of AMIS Countries'
                },
                opposite: false,
                labels: {
                    formatter: function() {
//                            return (this.value > 0 ? '+' : '') + this.value + '%';
                        return this.value;
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },
//
//            plotOptions: {
//                series: {
//                    //  compare: 'percent'
//                },
//                area:{
//                    dataGrouping: {
//                        enabled: false
//                    }
//                }
//            },

            title : {
//                                    text : 'Time Series of the frequency of the Policy Type'
                text : 'Number of AMIS countries with export restrictions on '+title,
                style: {"fontSize": "15px"}
            },

            tooltip: {
//                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                //headerFormat: '<span style="font-size: 10px">Highcharts.dateFormat("%B %Y", point.x)</span><br/>',
                formatter: function () {
                    var s = '<b>' + Highcharts.dateFormat('%B %Y', this.x) + '</b> <br/>';

                    $.each(this.points, function (i,point) {
                        s +='<span style="color:'+point.series.color+'">'+point.series.name+'</span>: '+Highcharts.numberFormat(point.y, 0) +'<br/>';
                    });

                    return s;
                }
//                headerFormat:'<span style="font-size: 10px"> {point.key}</span><br/>',
//                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
//                valueDecimals: 0
            },

//            tooltip: {
////                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
//                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
//                valueDecimals: 0
//            },
//                legend: {
//                    layout: 'horizontal',
//                    align: 'center',
//                    verticalAlign: 'bottom',
//                    borderWidth: 1,
//                    enabled: true,
//                    borderColor: '#4572a7'
//                },

            legend: {
                title: {
                    text: 'Policy Measure',
                    style: {
                        fontWeight: 'bold'
                        //  fontStyle: 'italic',
                        // textDecoration: 'underline'
                    }
                },

                itemWidth: 200,
                //y: 10,

                //Start Before
//                                layout: 'vertical',
//                                align: 'right',
//                                verticalAlign: 'top',
                // y: 50,
                //End Before
                verticalAlign: 'center',
                layout: 'horizontal',
//                                layout: 'vertical',
                align: 'center',
                //align: 'left',
//                y: 370,
                y: 420,
                x:0,
                useHTML: true,
//                                borderWidth: 1,
                enabled: true,
                borderColor: '#4572a7',
//                layout: 'vertical',
//                align: 'right',
//                verticalAlign: 'top',
//                y: 50,
//                borderWidth: 1,
//                enabled: true,
//                borderColor: '#4572a7',
                labelFormatter: function() {
//                    var html_legend = '<dl><dt><b>'+this.name+'</b></dt><dd> :'+ pmt_name_description[this.name]+'</dd></dl>';
                    //return this.name +' ('+pmt_name_description[this.name]+')';
                    //var html_legend = '<table><tr><td valign="top"><b>'+this.name+': </b></td><td>'+ split_string(pmt_name_description[this.name])+'</td></tr></table>';
//                    var html_legend = ''+this.name+': '+ pm_name_timeSeries_highcharts[this.name];
                    var html_legend = ''+this.name+': '+ '<span style="font-weight: normal;font-size: 10px;">'+pm_name_timeSeries_highcharts[this.name]+'</span>';
                    return html_legend;
                }
            },
            //Original legend start
//            legend: {
//                title: {
//                    text: 'Policy Type',
//                    style: {
//                        fontStyle: 'italic',
//                        align:  'center'
//                    }
//                },
//                layout: 'horizontal',
//                align: 'center',
//                verticalAlign: 'bottom',
////                                    y:-25,
//                y:-35,
//                borderWidth: 1,
//                enabled: true,
//                borderColor: '#4572a7',
//                labelFormatter: function() {
////                    var html_legend = '<dl><dt><b>'+this.name+'</b></dt><dd> :'+ pmt_name_description[this.name]+'</dd></dl>';
//                    //return this.name +' ('+pmt_name_description[this.name]+')';
//                    // var html_legend = '<table><tr><td valign="top"><b>'+this.name+': </b></td><td>'+ split_string(pmt_name_description[this.name])+'</td></tr></table>';
//                    var html_legend = ''+this.name+': '+ pt_name_timeSeries_highstockchart[this.name];
//                    return html_legend;
//                }
//            },//Original legend end

//            labels: {
//                items: [
//                    {
//                        html: 'Graph excludes mixed commodity classes.<br>Countries target their interventions on specific varieties, often at the HS8 or HS10 digit level.<br>Source: AMIS Policy Database',
//                        style: {
//                            left: '1px',
//                            //top: '402px',
//                            top: '300',
//                            cursor: 'default',
//                            color: '#413839',
//                            fontSize: '10px'
//                        }
//                    }
//                ]
//            },
            credits: {
                enabled: false
            },

//                                credits: {
//                                    enabled: true,
//                                    href: 'javascript:;',
//                                    position: {
//                                        align: 'center'
//                                        // x: 10,
//                                        // y: -5
//                                    },
//                                    style: {
//                                        cursor: 'default',
//                                        color: '#413839',
//                                        fontSize: '10px'
//                                    },
//                                    text: 'In Australia, Brazil, Canada, Mexico and US policies can be implemented at State-level. --- Source: AMIS Policy'
//                                },

            exporting: {
                buttons: {
                    contextButton: {
                        enabled: false

                    },
                    exportButton: {
                        theme: {
                            title: 'Download',
                            'stroke-width': 1,
                            stroke: '#4572a7',
                            //fill: '#f5cd54',
                            //  fill: '#bada55',
                            fill:'#ADD8E6',
                            r: 0,
                            states: {
                                hover: {
                                    fill: '#d3d3d3'
                                }
                            }
                        },
                        text: 'Download',
                        menuItems: [
                            {
                                text: 'As PNG image',
                                onclick: function () {
                                    var today = currentDate();
                                    this.exportChart({filename: 'Export-restrictions-time_series'}, {subtitle: {text: today}});
                                }

                            },
                            {
                                text: 'As JPEG image',
                                onclick: function () {
                                    var today = currentDate();
                                    this.exportChart({
                                        type: 'image/jpeg',
                                        filename: 'Export-restrictions-time_series'
                                    }, {subtitle: {text: today}});
                                }
                            },
                            {
                                text: 'As SVG vector image',
                                onclick: function () {
                                    var today = currentDate();
                                    this.exportChart({
                                        type: 'image/svg+xml',
                                        filename: 'Export-restrictions-time_series'
                                    }, {subtitle: {text: today}});
                                }

                            },
                            {
                                text: 'To PDF document',
                                onclick: function () {
                                    var today = currentDate();
                                    this.exportChart({
                                        type: 'application/pdf',
                                        filename: 'Export-restrictions-time_series'
                                    }, {subtitle: {text: today}});
                                }
                            }
                        ]
                    }
                }
            },
            series: seriesOptions
        });
    };

    // create the chart when all data is loaded
    function currentDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        }
        if(mm<10) {
            mm='0'+mm
        }

        var month = monthToAlph(mm);

        //today = month+'/'+dd+'/'+yyyy;
        today = dd+'/'+month+'/'+yyyy;
        today = "[Created on:"+today+"]";

        return today;
    };

    function monthToAlph(mm){
        var month = 'Jan';
        if(mm=='01'){
            month = 'Jan';
        }
        else if(mm=='02'){
            month = 'Feb';
        }
        else if(mm=='03'){
            month = 'Mar';
        }
        else if(mm=='04'){
            month = 'Apr';
        }
        else if(mm=='05'){
            month = 'May';
        }
        else if(mm=='06'){
            month = 'Jun';
        }
        else if(mm=='07'){
            month = 'Jul';
        }
        else if(mm=='08'){
            month = 'Aug';
        }
        else if(mm=='09'){
            month = 'Sep';
        }
        else if(mm=='10'){
            month = 'Oct';
        }
        else if(mm=='11'){
            month = 'Nov';
        }
        else if(mm=='12'){
            month = 'Dec';
        }

        return month;
    };

    return { subMenu0  : subMenu0,
        subMenu1 : subMenu1,
        subMenu3 : subMenu3,
        createChart : createChart,
        currentDate : currentDate,
        buttonEventsSetting : buttonEventsSetting,
        exportMeasure_timeSeries_download : exportMeasure_timeSeries_download
    }

});