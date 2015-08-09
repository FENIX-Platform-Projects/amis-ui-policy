//var ap_policiesAtaGlance_exportSubsidies_util = (function() {
define([
    'ap_util_variables',
    'ap_policyDataObject',
    'ap_util_functions',
    'highcharts',
    'highcharts_exporting',
    'jquery',
    'jQAllRangeSliders',
    'jqwidget',
    'bootstrap',
    'xDomainRequest'
], function(ap_utilVariables, ap_policyDataObject, ap_utilFunctions, highcharts ){

    var start_date_dd = '';
    var start_date_mm = '';
    var start_date_yy = '';
    var end_date_dd = '';
    var end_date_mm = '';
    var end_date_yy = '';

    var year_list = '';
    //var policy_type_code = '1';
    //For Policy type Export
    var policy_type_code = ap_utilVariables.CONFIG.export_measure_policyType_code;
    //Export subsidies
    //var policy_measure_code = '3';
    var policy_measure_code = ap_utilVariables.CONFIG.export_subsidies_policyMeasure_code;
    var unit_for_series_name = "";

    var commodity_class_combobox1 = "";
    var commodity_class_combobox1_label = "";
    var country_combobox2 = "";
    var country_combobox2_label = "";

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

    function subMenu0(obj){

        //Fix period
        start_date_dd = obj.start_date_dd;
        start_date_mm = obj.start_date_mm;
        start_date_yy = obj.start_date_yy;
        end_date_dd = obj.end_date_dd;
        end_date_mm = obj.end_date_mm;
        end_date_yy = obj.end_date_yy;

        $.ajax({
            type: 'GET',
            //url :   ap_utilVariables.CONFIG.codelist_url+"/"+ap_utilVariables.CONFIG.codelist_url_Country +'/1.0',
            url: 'http://'+ap_utilVariables.CONFIG.base_ip_address +':'+ap_utilVariables.CONFIG.base_ip_port + ap_utilVariables.CONFIG.exportSubsidiesCountries_url + '/' + ap_utilVariables.CONFIG.datasource + '/' + policy_type_code + '/' + policy_measure_code,
            dataType: 'json',

            success : function(response) {

                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);

                var source2 = new Array();
                for (var i = 0; i < json.length; i++) {
                    var row = {};
//                    console.log(json[i][0]);
//                    console.log(json[i][1]);
                    row.value = json[i][0];
                    row.label = json[i][1];
                    source2.push(row);
                }
//                for (var i = 0; i < jsonCodes.length; i++) {
//                    var c = jsonCodes[i].code;
//                    var l = jsonCodes[i].title['EN'];
//                    var row = {};
//                    row.value = c;
//                    row.label = l;
//                    console.log("i = "+i + " c = "+c+" l = "+l);
//                    source2.push(row);
//                }

                country_combobox2 = source2[0].value;
                country_combobox2_label = source2[0].label;

                $("#bd3_submenu1_combobox1").jqxComboBox({ source: source2, selectedIndex: 0, height: '25px', displayMember: 'label', valueMember: 'value'});

                $('#bd3_submenu1_combobox1').on('select', function (event)
                {
                    var args = event.args;
                    if (args) {
                        var item = args.item;
                        //Policy type code
                        country_combobox2 = item.value;
                        country_combobox2_label = item.label;
                    }
                });

                //Commodity Class Combobox
                $.ajax({
                    type: 'GET',
                    url :   ap_utilVariables.CONFIG.codelist_url+"/"+ap_utilVariables.CONFIG.codelist_url_CommodityAgricultural +'/1.0',
                    dataType: 'json',

                    success : function(response) {

                    var json = response;
                    if (typeof(response) == 'string')
                        json = $.parseJSON(response);

                    var jsonCodes = json.rootCodes;
                    jsonCodes.sort(function (a, b) {
                        if (a.title.EN < b.title.EN)
                            return -1;
                        if (a.title.EN > b.title.EN)
                            return 1;
                        return 0;
                    });

                    var source = new Array();
                    for (var i = 0; i < jsonCodes.length; i++) {
                        var c = jsonCodes[i].code;
                        var l = jsonCodes[i].title['EN'];
                        var row = {};
                        row.value = c;
                        row.label = l;
                        source.push(row);
                    }

                    commodity_class_combobox1 = source[1].value;
                    commodity_class_combobox1_label = source[1].label;

                    $("#bd3_submenu1_combobox2").jqxComboBox({ source: source, selectedIndex: 0, height: '25px', displayMember: 'label', valueMember: 'value', selectedIndex: 1});

                    $('#bd3_submenu1_combobox2').on('select', function(event)
                    {
                        var args = event.args;
                        if (args) {
                            var item = args.item;
                            //Policy type code
                            commodity_class_combobox1 = item.value;
                            commodity_class_combobox1_label = item.label;
                        }
                    });

                    $("#bd3_submenu1-button").on('click', function () {
                        subMenu1();
                    });

                    subMenu1();
                        },
                        error : function(err,b,c) {
                           // alert(err.status + ", " + b + ", " + c);
                        }
                    });
            },
            error : function(err,b,c) {
               // alert(err.status + ", " + b + ", " + c);
            }
        });
    }

    function subMenu1() {

        var start = parseInt(start_date_yy);
        var end = parseInt(end_date_yy);
        var count=0;
        year_list = [];
        for(var i= start; i<=end; i++)
        {
            year_list[count]= i;
            count++;
        }

        var data = ap_policyDataObject.init();
        data.datasource = ap_utilVariables.CONFIG.datasource;
        //data.commodity_class_code = commodity_class_code;//country_combobox2
        data.commodity_class_code = commodity_class_combobox1;
        var policy_type_code_array = [];
        policy_type_code_array.push(policy_type_code);
        data.policy_type_code = policy_type_code_array;
        var policy_measure_code_array = [];
        policy_measure_code_array.push(policy_measure_code);
        data.policy_measure_code = policy_measure_code_array;
        start_date_dd = ap_utilFunctions.data_change(''+start_date_dd);
        start_date_mm = ap_utilFunctions.data_change(''+start_date_mm);
        end_date_dd = ap_utilFunctions.data_change(''+end_date_dd);
        end_date_mm = ap_utilFunctions.data_change(''+end_date_mm);
        data.start_date = start_date_yy+'-'+start_date_mm+'-'+start_date_dd;
        data.end_date = end_date_yy+'-'+end_date_mm+'-'+end_date_dd;
//        data.start_date = '' + start_date_dd + '/' + start_date_mm + '/' + start_date_yy;
//        data.end_date = '' + end_date_dd + '/' + end_date_mm + '/' + end_date_yy;
//        data.country_code = country_code;//commodity_class_combobox1
        data.country_code = country_combobox2;
        data.policy_element = ap_utilVariables.CONFIG.export_subsidies_policy_element;
        var payloadrest = JSON.stringify(data);
        /* Retrive UI structure from DB. */
        $.ajax({

            type: 'POST',
            url: 'http://' + ap_utilVariables.CONFIG.base_ip_address + ':' + ap_utilVariables.CONFIG.base_ip_port + ap_utilVariables.CONFIG.exportSubsidiesPolicyElementLineChart_url,
            data: {"pdObj": payloadrest},

            success: function (response) {

                /* Convert the response in an object, i needed. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);

                if((typeof json[0]!='undefined')&&(json[0]!="NOT_FOUND"))
                {
                    //console.log(year_list);
                    //console.log(json);
                    unit_for_series_name = {};
                    for(var i=0; i<json.length; i++)
                    {
                        json[i].yAxis = ap_utilVariables.CONFIG.export_subsidies_units_y[i];
                        var index = i+1;
                        unit_for_series_name[""+index] = ap_utilVariables.CONFIG.export_subsidies_units_y[i];
                    }
                    //console.log("Success json *"+json.name+"*"+" array "+json.data);
//                var seriesOptions = json.dataArray;
//                var commodityClassCode = json.commodityClassCode;
//                var commodityClassName = '';
//                var chart_div = '';
                    $("#bd3_submenu1-chart_one").remove();
                    var s ="<div id='bd3_submenu1-chart_one'></div>";
                    $("#bd3_submenu1-chart_one_container").append(s);

                    //Chart
                    $('#bd3_submenu1-chart_one').highcharts({
                        chart: {
                            //type: 'column',
                            borderWidth: 2,
//                            marginBottom: 100
                            marginBottom: 170,
                            events: {
                                load: function () {
                                    var label = this.renderer.label('Graph excludes Special and Differential Treatment (SDT) Notifications<br>Source: AMIS Policy Database')
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
                            text: 'Quantity and budgetary outlay export subsidies in '+country_combobox2_label+' for '+commodity_class_combobox1_label+', commitments and notifications',
                            style: {"fontSize": "11px"}
                        },
                        subtitle: {
                            text: ''+start_date_yy+'-'+end_date_yy
                        }, //[colour order: light blue, dark blue, light green, dark green, light grey, dark grey, red]

//            budgetary commitments (dark blue), budgetary notifications (light blue), quantity commitments (dark green), quantity notifications (light green)
                        colors: [
                            '#255ba3',//Dark Blue
                            '#67b7e3',//Light Blue
                            '#125824',//Dark Green
                            '#199e34'//Light Green
                        ],

                        xAxis: {
//                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                            categories: year_list
                        },

                        yAxis: [{
                            min: 0,
                            allowDecimals: true,
                            title: {
                                text: ap_utilVariables.CONFIG.export_subsidies_units[0]
                            }
                        }, {
                            opposite: true,
                            min: 0,
                            allowDecimals: true,
                            title: {
                                text: ap_utilVariables.CONFIG.export_subsidies_units[2]
                            }
                        }
                        ],
                        tooltip: {
//                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
//                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
////                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
//                            '<td style="padding:0"><b>{point.y:.1f}</b>{series.name}</td></tr>',
////                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
//                        footerFormat: '</table>',
//                        shared: true,
//                        useHTML: true
                            shared: true,
//                        useHTML: true,
                            formatter: function () {
                                var s = '<b>' + this.x + '</b> <br/>';
//
                                $.each(this.points, function () {
//                                s += '<br/>' + this.series.name + ': '+this.y+" "+ ap_utilVariables.CONFIG.export_subsidies_units[parseInt(this.series.name)-1];
                                    s += '<br/><span style="color:'+this.series.color+'">' + this.series.name + '</span>: '+this.y+" "+ ap_utilVariables.CONFIG.export_subsidies_units[parseInt(this.series.name)-1];

                                });

//                            $.each(this.points, function (i,point) {
//                                console.log(point)
//
//
////                                s +='<span style="color:'+point.series.color+'">'+point.series.name+'</span>: '+Highcharts.numberFormat(point.y, 0) +'<br/>';
////                                s +='<span style="color:'+point.series.color+'">'+point.series.name+'</span><br/>';
//                               // s +='<span style="color:'+point.series.color+'">'+point.series.name+'</span>: '+Highcharts.numberFormat(point.y, 0) +'<br/>';
//
//                            });

                                return s;
                            }
                        },

//            yAxis: {
//                title: {
//                    text: 'Temperature (°C)'
//                },
//                plotLines: [
//                    {
//                        value: 0,
//                        width: 1,
//                        color: '#808080'
//                    }
//                ]
//            },
//                        legend: {
//                            title: {
//                                text: 'Policy Measure',
//                                style: {
//                                    fontWeight: 'bold'
//                                    //  fontStyle: 'italic',
//                                    // textDecoration: 'underline'
//                                }
//                            },
//                            layout: 'vertical',
//                            align: 'right',
//                            verticalAlign: 'top',
//                            y: 50,
//                            borderWidth: 1,
//                            enabled: true,
//                            borderColor: '#4572a7',
//                            labelFormatter: function() {
////                    var html_legend = ''+this.name+': '+ split_string(pm_name_timeSeries_highcharts[this.name])+'<br/>';
////                            var html_legend = ''+this.name+': <br/>';
////                            return html_legend;
//                                var html_legend = ''+this.name+': '+ split_string(ap_utilVariables.CONFIG.export_subsidies_policy_element_for_legend[parseInt(this.name)-1])+'<br/>';
//                                return html_legend;
//                            }
//                        },
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
//                            y: 370,
                            y: 280,
                            x:0,
                            useHTML: true,
//                                borderWidth: 1,
                            enabled: true,
                            borderColor: '#4572a7',
                            labelFormatter: function() {
//                    var html_legend = ''+this.name+': '+ split_string(pm_name_timeSeries_highcharts[this.name])+'<br/>';
//                            var html_legend = ''+this.name+': <br/>';
//                            return html_legend;
                                //var html_legend = ''+this.name+': '+ split_string(ap_utilVariables.CONFIG.export_subsidies_policy_element_for_legend[parseInt(this.name)-1])+'<br/>';
                                var html_legend = ''+this.name+': '+ '<span style="font-weight: normal;font-size: 10px;">'+ap_utilVariables.CONFIG.export_subsidies_policy_element_for_legend[parseInt(this.name)-1]+'</span>';
                                return html_legend;
                            }
                        },
//                        labels: {
//                            items: [
//                                {
////                        html: 'In Australia, Brazil, Canada, Mexico and US policies can be implemented at State-level.<br>Source: AMIS Policy',
//                                    html: 'Graph excludes Special and Differential Treatment (SDT) Notifications<br>Source: AMIS Policy Database',
//                                    style: {
//                                        left: '1px',
//                                        //top: '402px',
//                                        top: '260',
//                                        cursor: 'default',
//                                        color: '#413839',
//                                        fontSize: '10px'
//                                    }
//                                }
//                            ]
//                        },
                        credits: {
                            enabled: false
                        },
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
                                                this.exportChart({filename: 'Export-subsidies'});
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
                                                this.exportChart({
                                                    type: 'image/jpeg',
                                                    filename: 'Export-subsidies'
                                                });
                                            }
                                        },
                                        {
                                            text: 'As SVG vector image',
                                            onclick: function () {
                                                this.exportChart({
                                                    type: 'image/svg+xml',
                                                    filename: 'Export-subsidies'
                                                });
                                            }

                                        },
                                        {
                                            text: 'To PDF document',
                                            onclick: function () {
                                                this.exportChart({
                                                    type: 'application/pdf',
                                                    filename: 'Export-subsidies'
                                                });
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        series : json
                    });
                }
                else{
                    $('#bd3_submenu1-chart_one').remove();
                    var s ="<div id='bd3_submenu1-chart_one'><b>Data not Available for this selection</b></div>";
                    $('#bd3_submenu1-chart_one_container').append(s);
                }
            },
            error: function (err, b, c) {
              //  alert(err.status + ", " + b + ", " + c);
            }
        });
    }

    return {
        subMenu0 : subMenu0,
        subMenu1 : subMenu1
    }
});