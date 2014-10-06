var ap_policiesAtaGlance_biofuelPolicyTypes_util = (function() {

    var from = '16-02-2014';
    var to = '18-02-2014';

    var pmt_name_description = {};
    pmt_name_description["1"] = "Per unit domestic measures";
    pmt_name_description["2"] = "Export measures";
    pmt_name_description["3"] = "Biofuel mandates";
    pmt_name_description["4"] = "Import measures";
    pmt_name_description["5"] = "Other domestic measures1";
    pmt_name_description["6"] = "Other domestic measures2";
    pmt_name_description["7"] = "Other domestic measures3";
    pmt_name_description["8"] = "Other domestic measures4";
    pmt_name_description["9"] = "Other domestic measures5";
    pmt_name_description["10"] = "Other domestic measures6";

    var pt_name_timeSeries_highcharts = {};
    var pt_name_timeSeries_highstockchart = {};

    var pm_name_description = {};
    pm_name_description["1"] = "Export prohibition";
    pm_name_description["2"] = "Export tax";
    pm_name_description["3"] = "Restriction on customs clearance point for exports";
    pm_name_description["4"] = "Export quota";
    pm_name_description["5"] = "Minimum export price / price reference for exports";
    pm_name_description["6"] = "Domestic price regulation";
    pm_name_description["7"] = "Carbon tax exemption or similar disincentive systems on fossil fuels (in the transport sector)";
    pm_name_description["8"] = "Non-specified tax concessions";

    //This contains the first and the last date in the database
    var original_start_date_dd = '';
    var original_start_date_mm = '';
    var original_start_date_yy = '';
    var original_start_date_yy_time_series = '';
    var original_end_date_dd = '';
    var original_end_date_mm = '';
    var original_end_date_yy = '';

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
                    console.log('After '+label.substring(0, z) + '<br>' + label.substring(1 + z));
                    return label.substring(0, z) + '<br>' + label.substring(1 + z);
                }
            }
        }
        //alert('After '+label);

        return label;
    }

    function subMenu0(start_date_dd_int, start_date_mm_int, start_date_yy_int, end_date_dd_int, end_date_mm_int, end_date_yy_int, start_date_yy_int_time_series){
        // $('#nav-wrapper').height($("#nav").height());
        //start_date_mm_int and end_date_mm_int are already with -1
        //To remove the AFFIX START
//        $("#bd0_submenu0_row_option").affix({
//            offset: { top: $("#bd0_submenu0_row_option").offset().top }
//          });
//
//        // ensure the affix element maintains it width
//        var affix = $("#bd0_submenu0_row_option");
//        var width = affix.width();
//        affix.width(width);
        //To remove the AFFIX END

        start_date_dd = '1';
        start_date_mm = '0';
        start_date_yy = '2010';
        end_date_dd = '1';
        end_date_mm = '0';
        end_date_yy = '2014';

        original_start_date_dd = ''+start_date_dd_int;
        original_start_date_mm = ''+start_date_mm_int;
        original_start_date_yy = ''+start_date_yy_int;
        original_start_date_yy_time_series = ''+start_date_yy_int_time_series;
        original_end_date_dd = ''+end_date_dd_int;
        original_end_date_mm = ''+end_date_mm_int;
        original_end_date_yy = ''+end_date_yy_int;

        $("#bd0_submenu0-slider_2_container").dateRangeSlider( {
//            step: { days : 1 },
            step: { months : 1 },
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
                //return days + "/" + month + "/" + year;
                return month + "/" + year;
            }
        });
        $("#bd0_submenu0-slider_2_container").bind("valuesChanged", function(e, data){
            //The elements in the slider have been changed so... update the model to update the selected elements
            //Format
            var selecteditems = $("#bd0_submenu0-slider_2_container").dateRangeSlider("values");

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
        $("#bd0_submenu0-slider_2_labelMin").text(original_start_date_yy);
        //Slider Rigth Label(Max Value)
        $("#bd0_submenu0-slider_2_labelMax").text(original_end_date_yy);

        $("#bd0_submenu0-button").on('click', function () {
            subMenu1();
            // subMenu3();
        });

        var selecteditems = $("#bd0_submenu0-slider_2_container").dateRangeSlider("values");

        var date2 = new Date(selecteditems.min);
        start_date_dd = date2.getDate();
        start_date_mm = date2.getMonth() + 1;
        start_date_yy = date2.getFullYear();
        date2 = new Date(selecteditems.max);
        end_date_dd = date2.getDate();
        end_date_mm = date2.getMonth() + 1;
        end_date_yy = date2.getFullYear();
    }

    function subMenu1(){

        //General Information
//        var source = '{"chart":{"backgroundColor": "#F8F6F2", "renderTo":"obj_0","type":"column","zoomType":"xy"},"colors":["#009966","#009966","#009966","#6c79db","#a68122","#ffd569","#439966","#800432","#067dcc","#1f678a","#92a8b7","#5eadd5","#6c79db","#a68122","#ffd569","#439966","#800432","#067dcc"],"xAxis":{"categories":["Total Population - Both sexes","Rural population","Agricultural population","Male economically active population in Agr","Female economically active population in Agr"],"labels":{"enabled":true},"tickInterval":1},"title":{"text":""},"credits":{"position":{"align":"left","x":10},"text":"M = Million, K = Thousand","href":null},"tooltip":{"shared":true,"crosshairs":true},"plotOptions":{"line":{"marker":{"enabled":false}}},"yAxis":[{"title":{"text":"1000","style":{"color":"#1f678a"}},"labels":{"style":{"color":"#1f678a"}}}],"series":[{"name":"Nigeria","type":"column","data":[158423,79524,39405,7453,4814],"yAxis":0}]}'
//        var myObject = eval('(' + source + ')');
//        $('#chart-one').highcharts(myObject);
        //Slider
        $.ajax({
            type: 'GET',
            url :   'http://'+ap_utilVariables.CONFIG.base_ip_address+':'+ap_utilVariables.CONFIG.base_ip_port+ap_utilVariables.CONFIG.biofuel_pt_url+ '/' + ap_utilVariables.CONFIG.datasource+ '/' + ap_utilVariables.CONFIG.biofuel_commodity_domain_code,
            dataType: 'json',

            success : function(response) {

                var jsonPt = response;
                if (typeof(response) == 'string')
                    jsonPt = $.parseJSON(response);
//                console.log("jsonPt[0] "+jsonPt[0]+ " jsonPt.length "+jsonPt.length);
                var policy_type_codes =[];
                var policy_type_names =[];
                for(var i=0; i< jsonPt.length;i++)
                {
                    //Policy Type Code
                    policy_type_codes[i] = jsonPt[i][0];
                    //Policy Type Name
                    pt_name_timeSeries_highcharts[""+(i+1)] = jsonPt[i][1];
                    // console.log("pt_name "+pt_name[""+i]);
                }
                var data = ap_policyDataObject.init();
                data.datasource = ap_utilVariables.CONFIG.datasource;
                data.commodity_class_code = ap_utilVariables.CONFIG.biofuel_commodity_class_codes;
                //The order is important
                data.policy_type_code = policy_type_codes;
//                data.start_date = '05/05/2010';
//                data.end_date = '05/04/2011';
//                data.start_date = ''+start_date_dd+'/'+start_date_mm+'/'+start_date_yy;
//                data.end_date = ''+end_date_dd+'/'+end_date_mm+'/'+end_date_yy;
                start_date_mm = ap_utilFunctions.data_change(''+start_date_mm);
                end_date_mm = ap_utilFunctions.data_change(''+end_date_mm);
//                data.start_date = ''+1+'/'+start_date_mm+'/'+start_date_yy;
//                data.end_date = ''+31+'/'+end_date_mm+'/'+end_date_yy;
                data.start_date = ''+start_date_yy+'-'+start_date_mm+'-01';
                data.end_date = ''+end_date_yy+'-'+end_date_mm+'-31';


                var payloadrest = JSON.stringify(data);
                console.log(data);
                /* Retrive UI structure from DB. */
                $.ajax({

                    type: 'POST',
                    url: 'http://'+ap_utilVariables.CONFIG.base_ip_address+':'+ap_utilVariables.CONFIG.base_ip_port+ap_utilVariables.CONFIG.biofuelPoliciesBarChart_url,
                    data : {"pdObj": payloadrest},

                    success : function(response) {

                        /* Convert the response in an object, i needed. */
                        var json = response;
                        if (typeof(response) == 'string')
                            json = $.parseJSON(response);

                        var o ={
                            chart: {
                                type: 'column',
//                                events: {
//                                    load: function(event) {
//                                        // modify the legend symbol from a rect to a line
//                                        $('.highcharts-legend-item rect').attr('height', '2').attr('y', '10');
//                                    }
//                                },
                                borderWidth: 2,
                                marginBottom: 100
                            },
                            title: {
                                text: 'Number of AMIS countries with biofuel policies, disaggregated by policy type'
                            },

                            subtitle: {
                                //text: 'Period '+ start_date_dd+'-'+start_date_mm+'-'+start_date_yy+' until '+end_date_dd+'-'+end_date_mm+'-'+end_date_yy
                                text: 'Period '+ start_date_mm+'-'+start_date_yy+' until '+end_date_mm+'-'+end_date_yy
                            }, //[colour order: light blue, dark blue, light green, dark green, light grey, dark grey, red]
                            colors: [
                                '#125824',//Dark Green
                                '#255ba3',//Dark Blue
                                '#f6b539',//Dark Yellow
                                '#199e34',//Light Green
                                '#cccccc',//Light Gray
                                '#67b7e3',//Light Blue
                                '#dc3018'//Red
                            ],
                            xAxis: {
                                categories: [
                                    'Ethanol',
                                    'Biodiesel',
                                    'Biofuel (unspecified)'
                                ]
                            },
                            yAxis: {
                                min: 0,
                                allowDecimals: false,
                                title: {
                                    text: 'Number of AMIS Countries'
                                }
                            },tooltip: {
                                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
//                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
//                                    '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
                                footerFormat: '</table>',
                                shared: true,
                                useHTML: true
                            },
                            labels: {
                                items: [
                                    {
//                                    html: 'In Australia, Brazil, Canada, Mexico and US policies can be implemented at State-level. <br>Biodiesel, ethanol and biofuel are mutually exclusive categories. <br>Source: AMIS Policy',
                                        html: 'In Australia, Brazil, Canada, Mexico and US biofuel policies can be implemented at state-level. <br>Ethanol, biodiesel and biofuel (unspecified) are mutually exclusive categories. <br>Source: AMIS Policy Database',
                                        style: {
                                            left: '1px',
                                            //top: '300px',
                                            top: '300px',
                                            cursor: 'default',
                                            color: '#413839',
                                            fontSize: '10px'
                                        }
                                    }
                                ]
                            },
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
                                    text: 'Policy Type',
                                    style: {
                                        fontStyle: 'italic'
                                    }
                                },
                                layout: 'vertical',
                                align: 'right',
                                verticalAlign: 'top',
                                y: 50,
                                borderWidth: 1,
                                enabled: true,
                                borderColor: '#4572a7',
                                labelFormatter: function() {
                                    //var html_legend = '<table><tr><td valign="top"><b>'+this.name+': </b></td><td>'+ split_string(pmt_name_description[this.name])+'</td></tr></table>';
                                    var html_legend = ''+this.name+': '+ split_string(pt_name_timeSeries_highcharts[this.name])+'<br/>';
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

                                    }//,
//                    exportButton: {
//                        theme: {
//                            title: 'Download',
//                            'stroke-width': 1,
//                            stroke: '#4572a7',
//                            //fill: '#f5cd54',
//                          //  fill: '#bada55',
//                            fill:'#ADD8E6',
//                            r: 0,
//                            states: {
//                                hover: {
//                                    fill: '#d3d3d3'
//                                }
//                              }
//                        },
//                        text: 'Chart Download',
//                        menuItems: [
//                            {
//                                text: 'As PNG image',
//                                onclick: function () {
//                                    this.exportChart();
//                                }
//
//                            },
//                            {
//                                text: 'As JPEG image',
//                                onclick: function () {
//                                    this.exportChart({
//                                        type: 'image/jpeg'
//                                    });
//                                }
//                            },
//                            {
//                                text: 'As SVG vector image',
//                                onclick: function () {
//                                    this.exportChart({
//                                        type: 'image/svg+xml'
//                                    });
//                                }
//
//                            },
//                            {
//                                text: 'To PDF document',
//                                onclick: function () {
//                                    this.exportChart({
//                                        type: 'application/pdf'
//                                    });
//                                }
//                            }
//                        ]
//                    }
                                }
                            },

                            series: json
                        }
                        console.log(JSON.stringify(o));
                        //Chart
                        $('#bd0_submenu1-chart_one').highcharts(o);
                    },

                        error : function(err,b,c) {
                            alert(err.status + ", " + b + ", " + c);
                        }
                    });
            },
            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
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
            var chart = $('#bd0_submenu3-chart_one').highcharts();
            if((chart!=null)&&(typeof chart != 'undefined'))
            {
                chart.xAxis[0].setExtremes(
                    Date.UTC(parseInt(submenu3_start_date_yy,10), parseInt(submenu3_start_date_mm,10), parseInt(submenu3_start_date_dd,10)),
                    Date.UTC(parseInt(submenu3_end_date_yy,10), parseInt(submenu3_end_date_mm,10), parseInt(submenu3_end_date_dd,10))
                );
            }
            chart = $('#bd0_submenu3-chart_two').highcharts();
            if((chart!=null)&&(typeof chart != 'undefined'))
            {
                chart.xAxis[0].setExtremes(
                    Date.UTC(parseInt(submenu3_start_date_yy,10), parseInt(submenu3_start_date_mm,10), parseInt(submenu3_start_date_dd,10)),
                    Date.UTC(parseInt(submenu3_end_date_yy,10), parseInt(submenu3_end_date_mm,10), parseInt(submenu3_end_date_dd,10))
                );
            }
            chart = $('#bd0_submenu3-chart_three').highcharts();
            if((chart!=null)&&(typeof chart != 'undefined')) {
                chart.xAxis[0].setExtremes(
                    Date.UTC(parseInt(submenu3_start_date_yy, 10), parseInt(submenu3_start_date_mm, 10), parseInt(submenu3_start_date_dd, 10)),
                    Date.UTC(parseInt(submenu3_end_date_yy, 10), parseInt(submenu3_end_date_mm, 10), parseInt(submenu3_end_date_dd, 10))
                );
            }
            chart = $('#bd0_submenu3-chart_four').highcharts();
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
                                chart_div = "bd0_submenu3-chart_one";
                                $("#bd0_submenu3-chart_one_title").text(commodityClassName);
                                console.log("Before create chart 1 " + commodityClassName);
                            }
                            else if(commodityClassCode==codesArray[1])
                            {
                                commodityClassName = namesArray[1];
                                chart_div = "bd0_submenu3-chart_two";
                                $("#bd0_submenu3-chart_two_title").text(commodityClassName);
                                console.log("Before create chart 2 " + commodityClassName);
                            }
                            else if(commodityClassCode==codesArray[2])
                            {
                                commodityClassName = namesArray[2];
                                chart_div = "bd0_submenu3-chart_three";
                                $("#bd0_submenu3-chart_three_title").text(commodityClassName);
                                console.log("Before create chart 3 " + commodityClassName);
                            }
                            else if(commodityClassCode==codesArray[3])
                            {
                                commodityClassName = namesArray[3];
                                chart_div = "bd0_submenu3-chart_four";
                                $("#bd0_submenu3-chart_four_title").text(commodityClassName);
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

    function subMenu3(){

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            $(window).resize();
            var chart = $('#bd0_submenu3-chart_one').highcharts();
            if((chart!=null)&&(typeof chart != 'undefined'))
            {
                //alert("before set ext 1")
                chart.xAxis[0].setExtremes(
                    Date.UTC(parseInt(submenu3_start_date_yy,10), parseInt(submenu3_start_date_mm,10), parseInt(submenu3_start_date_dd,10)),
                    Date.UTC(parseInt(submenu3_end_date_yy,10), parseInt(submenu3_end_date_mm,10), parseInt(submenu3_end_date_dd,10))
                );
            }
            chart = $('#bd0_submenu3-chart_two').highcharts();
            if((chart!=null)&&(typeof chart != 'undefined'))
            {
               // alert("before set ext 2")
                chart.xAxis[0].setExtremes(
                    Date.UTC(parseInt(submenu3_start_date_yy,10), parseInt(submenu3_start_date_mm,10), parseInt(submenu3_start_date_dd,10)),
                    Date.UTC(parseInt(submenu3_end_date_yy,10), parseInt(submenu3_end_date_mm,10), parseInt(submenu3_end_date_dd,10))
                );
            }
            chart = $('#bd0_submenu3-chart_three').highcharts();
            if((chart!=null)&&(typeof chart != 'undefined')) {
              //  alert("before set ext 3")
                chart.xAxis[0].setExtremes(
                    Date.UTC(parseInt(submenu3_start_date_yy, 10), parseInt(submenu3_start_date_mm, 10), parseInt(submenu3_start_date_dd, 10)),
                    Date.UTC(parseInt(submenu3_end_date_yy, 10), parseInt(submenu3_end_date_mm, 10), parseInt(submenu3_end_date_dd, 10))
                );
            }
            chart = $('#bd0_submenu3-chart_four').highcharts();
            if((chart!=null)&&(typeof chart != 'undefined')) {
             //   alert("before set ext 4")
                chart.xAxis[0].setExtremes(
                    Date.UTC(parseInt(submenu3_start_date_yy, 10), parseInt(submenu3_start_date_mm, 10), parseInt(submenu3_start_date_dd, 10)),
                    Date.UTC(parseInt(submenu3_end_date_yy, 10), parseInt(submenu3_end_date_mm, 10), parseInt(submenu3_end_date_dd, 10))
                );
            }
        });

        //Naming the tabs
        var namesArray = ap_utilVariables.CONFIG.biofuel_commodity_class_names_all.split("-");
        $("#bd0_submenu3-chart_one_title").text(namesArray[0]);
        $("#bd0_submenu3-chart_two_title").text(namesArray[1]);
        $("#bd0_submenu3-chart_three_title").text(namesArray[2]);
        $("#bd0_submenu3-chart_four_title").text(namesArray[3]);

        var commodityCodesArray = ap_utilVariables.CONFIG.biofuel_commodity_class_codes_all.split("-");

        // alert("Before ajax rest url rest_url"+rest_url);
        $.ajax({
            type: 'GET',
            url :   'http://'+ap_utilVariables.CONFIG.base_ip_address+':'+ap_utilVariables.CONFIG.base_ip_port+ap_utilVariables.CONFIG.biofuel_pt_url+ '/' + ap_utilVariables.CONFIG.datasource+ '/' + ap_utilVariables.CONFIG.biofuel_commodity_domain_code,
            dataType: 'json',

            success : function(response) {
                // alert("success");
                /* Convert the response in an object, i needed. */
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

                var data = ap_policyDataObject.init();
                data.datasource = ap_utilVariables.CONFIG.datasource;
                data.commodity_class_code = commodityCodesArray[0];
                data.policy_type_code = policy_type_codes;
//                data.start_date = '05/05/2010';
//                data.end_date = '05/04/2011';
//                data.start_date = '' + start_date_dd + '/' + start_date_mm + '/' + start_date_yy;
//                data.end_date = '' + end_date_dd + '/' + end_date_mm + '/' + end_date_yy;
                original_start_date_dd= ap_utilFunctions.data_change(''+original_start_date_dd);
                original_start_date_mm= ap_utilFunctions.data_change(''+original_start_date_mm);
                original_end_date_dd= ap_utilFunctions.data_change(''+original_end_date_dd);
                original_end_date_mm= ap_utilFunctions.data_change(''+original_end_date_mm);
                data.start_date = ''+original_start_date_yy_time_series+'-'+original_start_date_mm+'-'+original_start_date_dd;
                data.end_date = '' + original_end_date_yy+'-'+original_end_date_mm+'-'+original_end_date_dd;
//                data.start_date = '' + original_start_date_dd + '/' + original_start_date_mm + '/' + original_start_date_yy_time_series;
//                data.end_date = '' + original_end_date_dd + '/' + original_end_date_mm + '/' + original_end_date_yy;

                var payloadrest = JSON.stringify(data);
                /* Retrive UI structure from DB. */
                console.log("Before Post "+data.commodity_class_code);
                $.ajax({

                    type: 'POST',
                    url: 'http://' + ap_utilVariables.CONFIG.base_ip_address + ':' + ap_utilVariables.CONFIG.base_ip_port + ap_utilVariables.CONFIG.biofuelTimeSeries_url,
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

                        namesArray = ap_utilVariables.CONFIG.biofuel_commodity_class_names_all_time_series.split("-");
                        commodityClassName = namesArray[0];
                        chart_div = "bd0_submenu3-chart_one";
                        console.log("Before create chart 1 " + commodityClassName);

                        //Creation of the first chart
                        //var notes = 'In Australia, Brazil, Canada, Mexico and US biofuel policies can be implemented at state-level.<br>Source: AMIS Policy Database';
                        var notes = 'In Australia, Brazil, Canada, Mexico and US biofuel policies can be implemented at state-level. <br>Combination of policies targeted on ethanol, biodiesel and biofuel (unspecified).<br>Source: AMIS Policy Database ';
                        createChart(chart_div, seriesOptions, commodityClassName, notes);

                        //For the other chart
                        for(var iCommodityCode =1; iCommodityCode<commodityCodesArray.length; iCommodityCode++)
                        {
                            var data = ap_policyDataObject.init();
                            data.datasource = ap_utilVariables.CONFIG.datasource;
                            data.commodity_class_code = commodityCodesArray[iCommodityCode];
                            data.policy_type_code = policy_type_codes;
//                data.start_date = '05/05/2010';
//                data.end_date = '05/04/2011';
//                            data.start_date = '' + start_date_dd + '/' + start_date_mm + '/' + start_date_yy;
//                            data.end_date = '' + end_date_dd + '/' + end_date_mm + '/' + end_date_yy;
                            original_start_date_dd = ap_utilFunctions.data_change(''+original_start_date_dd);
                            original_start_date_mm = ap_utilFunctions.data_change(''+original_start_date_mm);
                            original_end_date_dd = ap_utilFunctions.data_change(''+original_end_date_dd);
                            original_end_date_mm = ap_utilFunctions.data_change(''+original_end_date_mm);
                            data.start_date = original_start_date_yy_time_series+'-'+original_start_date_mm+'-'+original_start_date_dd;
                            data.end_date = original_end_date_yy+'-'+original_end_date_mm+'-'+original_end_date_dd;
//                            data.start_date = '' + original_start_date_dd + '/' + original_start_date_mm + '/' + original_start_date_yy_time_series;
//                            data.end_date = '' + original_end_date_dd + '/' + original_end_date_mm + '/' + original_end_date_yy;
                            var payloadrest = JSON.stringify(data);
                            /* Retrive UI structure from DB. */
                            console.log("Before Post "+data.commodity_class_code);
                            $.ajax({

                                type: 'POST',
                                url: 'http://' + ap_utilVariables.CONFIG.base_ip_address + ':' + ap_utilVariables.CONFIG.base_ip_port + ap_utilVariables.CONFIG.biofuelTimeSeries_url,
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
                                    var commodityClassNameTimeSeries = '';
                                    var chart_div = '';

                                    if ((commodityClassCode != null) && (typeof commodityClassCode != 'undefined')) {
                                        //Check which is the commodity class
                                        var codesArray = ap_utilVariables.CONFIG.biofuel_commodity_class_codes_all.split("-");
                                        var namesArray = ap_utilVariables.CONFIG.biofuel_commodity_class_names_all_time_series.split("-");
                                        if(commodityClassCode==codesArray[1])
                                        {
                                            commodityClassName = namesArray[1];
                                            chart_div = "bd0_submenu3-chart_two";
                                            //$("#bd0_submenu3-chart_two_title").text(commodityClassName);
                                            notes = 'n Australia, Brazil, Canada, Mexico and US biofuel policies can be implemented at state-level.<br>Source: AMIS Policy Database';
                                            console.log("Before create chart 2 " + commodityClassName);
                                        }
                                        else if(commodityClassCode==codesArray[2])
                                        {
                                            commodityClassName = namesArray[2];
                                            chart_div = "bd0_submenu3-chart_three";
                                            notes = 'In Australia, Brazil, Canada, Mexico and US biofuel policies can be implemented at state-level.<br>Source: AMIS Policy Database';
                                            console.log("Before create chart 3 " + commodityClassName);
                                        }
                                        else if(commodityClassCode==codesArray[3])
                                        {
                                            commodityClassName = namesArray[3];
                                            chart_div = "bd0_submenu3-chart_four";
                                            notes = 'In Australia, Brazil, Canada, Mexico and US biofuel policies can be implemented at state-level.<br>Unspecified biofuel policies are those policies for which the legal document does not specify whether the policy applies to ethanol or biodiesels.<br>Source: AMIS Policy Database';
                                            console.log("Before create chart 4 " + commodityClassName);
                                        }
                                        createChart(chart_div, seriesOptions, commodityClassName, notes);

                                    }
                                },
                                error: function (err, b, c) {
                                    alert(err.status + ", " + b + ", " + c);
                                }
                            });
                        }

                    },
                    error: function (err, b, c) {
                        alert(err.status + ", " + b + ", " + c);
                    }
                });
            },
            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    };

    // create the chart when all data is loaded
    function createChart(chart_div, seriesOptions, title, notes) {

//            $('#bd0_submenu3-chart_one').highcharts('StockChart', {
        $('#'+chart_div).highcharts('StockChart', {
            chart: {
                borderWidth: 2,
//                marginBottom: 120,
                marginBottom: 80,
                events: {
                    load: function(event) {
                        // modify the legend symbol from a rect to a line
                        $('.highcharts-legend-item path').attr('stroke-width', '12').attr('y', '10');
//                        this.xAxis[0].setExtremes(
//                                Date.UTC(parseInt('2005',10), parseInt(submenu3_start_date_mm,10), parseInt(submenu3_start_date_dd,10)),
//                //                Date.UTC(parseInt(submenu3_start_date_yy,10), parseInt(submenu3_start_date_mm,10), parseInt(submenu3_start_date_dd,10)),
//                                Date.UTC(parseInt(submenu3_end_date_yy,10), parseInt(submenu3_end_date_mm,10), parseInt(submenu3_end_date_dd,10)));
//                        var chart = $('#'+chart_div).highcharts();
//                        if((chart!=null)&&(typeof chart != 'undefined'))
//                        {
//                            //alert("before set ext 1")
//                            chart.xAxis[0].setExtremes(
//                                Date.UTC(parseInt('2005',10), parseInt(submenu3_start_date_mm,10), parseInt(submenu3_start_date_dd,10)),
//                //                Date.UTC(parseInt(submenu3_start_date_yy,10), parseInt(submenu3_start_date_mm,10), parseInt(submenu3_start_date_dd,10)),
//                                Date.UTC(parseInt(submenu3_end_date_yy,10), parseInt(submenu3_end_date_mm,10), parseInt(submenu3_end_date_dd,10))
//                            );
//                        }
                    }
                }

//                events: {
//                    selection: function(event) {
//                        console.log(
//                            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', event.xAxis[0].min),
//                            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', event.xAxis[0].max)
//                        );
//                    }
//                }
            },
            colors: [
                '#125824',//Dark Green
                '#255ba3',//Dark Blue
                '#f6b539',//Dark Yellow
                '#199e34',//Light Green
                '#cccccc',//Light Gray
                '#67b7e3',//Light Blue
                '#dc3018'//Red
            ],
            navigator: {
                top: 300
//                top: 270
            },
            rangeSelector: {
                enabled: false
            },

//                rangeSelector: {
//                    selected: 4
//                },
            xAxis: {
                events: {
                    setExtremes: function(e) {
                        //console.log(this);
                        var date_start = new Date(this.min);
                        submenu3_start_date_dd = date_start.getDate();
                        submenu3_start_date_mm = date_start.getMonth() + 1;
                        submenu3_start_date_yy = date_start.getFullYear();
                        var date_end = new Date(this.max);
                        submenu3_end_date_dd = date_end.getDate();
                        submenu3_end_date_mm = date_end.getMonth() + 1;
                        submenu3_end_date_yy = date_end.getFullYear();
                    }
                }
            },
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

            title : {
//                                    text : 'Time Series of the frequency of the Policy Type'
//                text : 'Time series of biofuel policies, disaggregated by policy type - '+title
                text : 'Number of AMIS countries with '+title+' policies, disaggregated by policy type'
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
                    text: 'Policy Type',
                    style: {
                        fontStyle: 'italic'
                    }
                },
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                y: 50,
                borderWidth: 1,
                enabled: true,
                borderColor: '#4572a7',
                labelFormatter: function() {
//                    var html_legend = '<dl><dt><b>'+this.name+'</b></dt><dd> :'+ pmt_name_description[this.name]+'</dd></dl>';
                    //return this.name +' ('+pmt_name_description[this.name]+')';
                    //var html_legend = '<table><tr><td valign="top"><b>'+this.name+': </b></td><td>'+ split_string(pmt_name_description[this.name])+'</td></tr></table>';
                    var html_legend = ''+this.name+': '+ pt_name_timeSeries_highstockchart[this.name];
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

            labels: {
                items: [
                    {
//                        html: 'In Australia, Brazil, Canada, Mexico and US biofuel policies can be implemented at state-level.<br>Source: AMIS Policy',
                        html: notes,
                        style: {
                            left: '1px',
                            //top: '402px',
                            top: '310',
                            cursor: 'default',
                            color: '#413839',
                            fontSize: '10px'
                        }
                    }
                ]
            },
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
//                    buttons: {
//                        contextButton: {
//                            symbol: 'circle',
//                            symbolStrokeWidth: 1,
//                            symbolFill: '#4572a7',
////                            symbolFill: '#f5cd54',
//                            symbolStroke: '#330033'
//                        }
//                    }

                buttons: {
                    contextButton: {
                        enabled: false
                    }//,
//                                exportButton: {
//                                    theme: {
//                                        title: 'Download',
//                                        'stroke-width': 1,
//                                        stroke: '#4572a7',
//                                        //fill: '#f5cd54',
//                                        //  fill: '#bada55',
//                                        fill:'#ADD8E6',
//                                        r: 0,
//                                        states: {
//                                            hover: {
//                                                fill: '#d3d3d3'
//                                            }
//                                        }
//                                    },
////                            theme: {
////                                title: 'Download',
////                                'stroke-width': 1,
////                                //stroke: 'silver',
////                                stroke: '#4572a7',
////                                fill: '#f5cd54',
////                                r: 0
//////                                states: {
//////                                    hover: {
//////                                        fill: '#f5cd54'
//////                                    },
//////                                    select: {
//////                                        stroke: '#039',
//////                                        fill: '#f5cd54'
//////                                    }
//////                                }
////                            },
//                                    // symbol: 'circle',
////                            symbol: 'url(http://highcharts.com/demo/gfx/diamond.png)',
//                                    // symbolStrokeWidth: 1,
//                                    // symbolFill: '#4572a7',
////                            symbolFill: '#f5cd54',
//                                    // symbolStroke: '#330033',
//                                    //stroke: '#f5cd54',
//                                    // stroke: '#c0c0c0',
//                                    // strokeWidth: 3,
//                                    text: 'Chart Download',
//                                    //  _titleKey: 'downloadButtonTitle',
//                                    // borderColor: '#330033',
//                                    menuItems: [
////                                {
////                                    text: exportButtonTitle,
////                                    onclick: function () {
////                                        //var minDate = $('input.highcharts-range-selector:eq(0)').val();
////                                        //var maxDate = $('input.highcharts-range-selector:eq(1)').val();
////                                        var minDate = $('input.highcharts-range-selector:eq(0)', $('#' + chart_div_id)).val();
////                                        var maxDate = $('input.highcharts-range-selector:eq(1)', $('#' + chart_div_id)).val();
////
////                                        if (minDate == null && maxDate == null) {
////                                            minDate = startdate;
////                                            maxDate = enddate;
////                                        }
////
////
////                                        var title = this.options.title.text + ' ' + this.options.subtitle.text
////                                        var exportUrl = "";
////                                        if (domain_source == 'AMIS-STATISTICS' || domain_source == 'FAO-EST') {
////                                            if (market_codes != null)
////                                                exportUrl = "http://statistics.amis-outlook.org/data/amis-market-monitor/jsp/amis-mm-est-data-export.jsp?indicatorcode=" + indicator_codes + "&marketcode=" + market_codes + "&mindate=" + minDate + "&maxdate=" + maxDate + "&title=" + title;
////                                            else
////                                                exportUrl = "http://statistics.amis-outlook.org/data/amis-market-monitor/jsp/amis-mm-data-export.jsp?indicatorcode=" + indicator_codes + "&domaintable=" + domain_table_code + "&mindate=" + minDate + "&maxdate=" + maxDate + "&title=" + title;
////                                        }
////                                        else if (domain_source == 'FRED') {
////                                            var newTitle = 'AMIS Market Monitor: '+ this.options.title.text;
////                                            exportUrl="http://fenixapps.fao.org/fenix-fred/rest/series/export/excel?series_id="+indicator_codes+"&start_date=" + minDate + "&end_date=" + maxDate+"&title="+newTitle+"&api_key=dab0b2bdc1c6816c598ba62118eda19d"
////                                        }
////
////                                        if (!chartHideDataExport)
////                                            window.open(exportUrl);
////                                    }
////                                },
//                                        // {
//                                        // text: '&nbsp;',
//                                        //	separator: true
//                                        // },
//
//                                        {
//                                            text: 'As PNG image',
//                                            onclick: function () {
//                                                this.exportChart();
//                                            }
//
//                                        },
//                                        {
//                                            text: 'As JPEG image',
//                                            onclick: function () {
//                                                this.exportChart({
//                                                    type: 'image/jpeg'
//                                                });
//                                            }
//                                        },
//                                        {
//                                            text: 'As SVG vector image',
//                                            onclick: function () {
//                                                this.exportChart({
//                                                    type: 'image/svg+xml'
//                                                });
//                                            }
//
//                                        },
//                                        {
//                                            text: 'To PDF document',
//                                            onclick: function () {
//                                                this.exportChart({
//                                                    type: 'application/pdf'
//                                                });
//                                            }
//                                        }
//                                    ]
//                                }
//                        printButton: {
//                            text: 'Print',
//                            _titleKey: 'printButtonTitle',
//                            onclick: function () {
//                                this.print();
//                            }
//                        }
                }
            },
            series: seriesOptions
        });

//        var start_year ='2005';
//        var chart = $('#'+chart_div).highcharts();
//
//        if((chart!=null)&&(typeof chart != 'undefined'))
//        {
//            //alert("before set ext 1")
//            chart.xAxis[0].setExtremes(
//                Date.UTC(parseInt(start_year,10), parseInt(submenu3_start_date_mm,10), parseInt(submenu3_start_date_dd,10)),
////                Date.UTC(parseInt(submenu3_start_date_yy,10), parseInt(submenu3_start_date_mm,10), parseInt(submenu3_start_date_dd,10)),
//                Date.UTC(parseInt(submenu3_end_date_yy,10), parseInt(submenu3_end_date_mm,10), parseInt(submenu3_end_date_dd,10))
//            );
//        }

        //var chart = $('#bd0_submenu3-chart_one').highcharts();
//        if((chart!=null)&&(typeof chart != 'undefined'))
//        {
//            //alert("before set ext 1")
//            chart.xAxis[0].setExtremes(
//                Date.UTC(parseInt(start_year,10), parseInt(submenu3_start_date_mm,10), parseInt(submenu3_start_date_dd,10)),
////                Date.UTC(parseInt(submenu3_start_date_yy,10), parseInt(submenu3_start_date_mm,10), parseInt(submenu3_start_date_dd,10)),
//                Date.UTC(parseInt(submenu3_end_date_yy,10), parseInt(submenu3_end_date_mm,10), parseInt(submenu3_end_date_dd,10))
//            );
//        }
//        chart = $('#bd0_submenu3-chart_two').highcharts();
//        if((chart!=null)&&(typeof chart != 'undefined'))
//        {
//            //alert("before set ext 2")
//            chart.xAxis[0].setExtremes(
//                Date.UTC(parseInt(start_year,10), parseInt(submenu3_start_date_mm,10), parseInt(submenu3_start_date_dd,10)),
//                Date.UTC(parseInt(submenu3_end_date_yy,10), parseInt(submenu3_end_date_mm,10), parseInt(submenu3_end_date_dd,10))
//            );
//        }
//        chart = $('#bd0_submenu3-chart_three').highcharts();
//        if((chart!=null)&&(typeof chart != 'undefined')) {
//            //alert("before set ext 3")
//            chart.xAxis[0].setExtremes(
//                Date.UTC(parseInt(start_year, 10), parseInt(submenu3_start_date_mm, 10), parseInt(submenu3_start_date_dd, 10)),
//                Date.UTC(parseInt(submenu3_end_date_yy, 10), parseInt(submenu3_end_date_mm, 10), parseInt(submenu3_end_date_dd, 10))
//            );
//        }
//        chart = $('#bd0_submenu3-chart_four').highcharts();
//        if((chart!=null)&&(typeof chart != 'undefined')) {
//            //alert("before set ext 4")
//            chart.xAxis[0].setExtremes(
//                Date.UTC(parseInt(start_year, 10), parseInt(submenu3_start_date_mm, 10), parseInt(submenu3_start_date_dd, 10)),
//                Date.UTC(parseInt(submenu3_end_date_yy, 10), parseInt(submenu3_end_date_mm, 10), parseInt(submenu3_end_date_dd, 10))
//            );
//        }
    };

    return { subMenu0  : subMenu0,
        subMenu1 : subMenu1,
        subMenu3 : subMenu3,
        createChart :   createChart()
    }

})();