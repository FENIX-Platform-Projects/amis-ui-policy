//var ap_policiesAtaGlance_importTariffsQuotas_util = (function() {
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

    var pmTariffQuotas_name_description = {};
    pmTariffQuotas_name_description["1"] = "Wheat: Final Bound Tariff ";
    pmTariffQuotas_name_description["2"] = "Wheat: MFN Applied Tariff ";
    pmTariffQuotas_name_description["3"] = "Maize: Final Bound Tariff ";
    pmTariffQuotas_name_description["4"] = "Maize: MFN Applied Tariff ";
    pmTariffQuotas_name_description["5"] = "Rice: Final Bound Tariff ";
    pmTariffQuotas_name_description["6"] = "Rice: MFN Applied Tariff ";
    pmTariffQuotas_name_description["7"] = "Soybean: Final Bound Tariff ";
    pmTariffQuotas_name_description["8"] = "Soybean: MFN Applied Tariff ";


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

    function subMenu3(obj){

        //Chart
        $('#bd4_submenu1-chart_one').highcharts({
            chart: {
                type: 'column',
                borderWidth: 2,
                marginBottom: 100
            },
            title: {
                text: 'Frequency of the Import Tariffs'
            },
            subtitle: {
                text: 'Period '+ obj.start_date_yy+'/'+obj.end_date_yy
            },
            xAxis: {
                categories: [
                    '2010',
                    '2011',
                    '2012',
                    '2013'
                ]
            },
            yAxis: {
                min: 0,
                title: {
                    text: '%',
                    rotation: 0
                }
            },
            colors: [
                '#255ba3',//Dark Blue
                '#67b7e3',//Light Blue
                '#c52b15',//Dark Red
                '#ec6754',//Light Red
                '#125824',//Dark Green
                '#199e34',//Light Green
                '#9a9a9a',//Dark Gray
                '#cccccc'//Light Gray
            ],
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
//                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                    '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            legend: {
                title: {
                    text: 'Commodity Class',
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
                    var html_legend = ''+this.name+': '+ split_string(pmTariffQuotas_name_description[this.name]);
                    return html_legend;
                }
            },
            credits: {
                enabled: false
//                href: 'javascript:;',
//                position: {
//                    align: 'right'
//                    // x: 10,
//                    // y: -5
//                },
//                style: {
//                    cursor: 'default',
//                    color: '#413839',
//                    fontSize: '10px'
//                },
//                text: 'Source: AMIS Policy'
            },
            exporting: {
                buttons: {
                    contextButton: {
                        enabled: false

                    }
//                    ,
//                    exportButton: {
////                        theme: {
////                            title: 'Download',
////                            'stroke-width': 1,
////                            stroke: '#4572a7',
////                            //fill: '#bada55',
////                            fill: '#f5cd54',
////                            r: 0
////                        },
//                        theme: {
//                            title: 'Download',
//                            'stroke-width': 1,
//                            stroke: '#4572a7',
//                            //fill: '#f5cd54',
//                            //  fill: '#bada55',
//                            fill:'#ADD8E6',
//                            r: 0,
//                            states: {
//                                hover: {
//                                    fill: '#d3d3d3'
//                                }
//                            }
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
            series: [{
//                name: '1',
//                data: [49, 71, 106, , 8, 5, 2, 3, 3]
//
//            }, {
//                name: '2',
//                data: [93, 106, 84, 49, 41, 23, 49, 71, 13]
//
//            }, {
                name: '1',
                data: [47, 48, 59, 38]

            }, {
                name: '2',
                data: [20, 47, 39, 9]

            }, {
                name: '3',
                data: [42, 33, 34]
            }, {
                name: '4',
                data: [ 75, 57, 60]

            }, {
                name: '5',
                data: [42, 33, 34]

            }, {
                name: '6',
                data: [57, 60, 47]

            }, {
                name: '7',
                data: [75, 57, 60]

            }, {
                name: '8',
                data: [42, 33, 75]

            }
        ]
        });
    };

    function subMenu1(obj){

        var policy_type_codes_array = [];
        policy_type_codes_array.push(ap_utilVariables.CONFIG.import_tariffs_policy_type_code);
        var policy_measure_codes_array = [];
        policy_measure_codes_array.push(ap_utilVariables.CONFIG.import_tariffs_policy_measure_code);
        var data = ap_policyDataObject.init();
        data.datasource = ap_utilVariables.CONFIG.datasource;
        data.commodity_class_code = ap_utilVariables.CONFIG.import_tariffs_commodity_class_codes;
        //The order is important
        data.policy_type_code = policy_type_codes_array;
        data.policy_measure_code = policy_measure_codes_array;
        data.hs_code = ap_utilVariables.CONFIG.import_tariffs_hsCode_list;
        data.year_list = ap_utilVariables.CONFIG.import_tariffs_year_list;
        data.unit = ap_utilVariables.CONFIG.import_tariffs_unit;
        data.policy_element = ap_utilVariables.CONFIG.import_tariffs_policy_element;
        //MIN
        data.chart_type = true;

        var payloadrest = JSON.stringify(data);
        /* Retrive UI structure from DB. */
        $.ajax({

            type: 'POST',
            url: 'http://'+ap_utilVariables.CONFIG.base_ip_address+':'+ap_utilVariables.CONFIG.base_ip_port+ap_utilVariables.CONFIG.importTariffsPolicyMeasuresBarChart,
            data : {"pdObj": payloadrest},

            success : function(response) {

                /* Convert the response in an object, i needed. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);

                //Chart
                var o={  chart: {
                    type: 'column',
                    borderWidth: 2,
//                    marginBottom: 100
                    marginBottom: 170,
                    events: {
                        load: function () {
                            var label = this.renderer.label('Graph only considers tariffs on raw agricultural commodities (HS codes 1001, 1005, 1006, 1201)<br>Non-ad valorem tariffs were excluded in the calculation of the averages<br>Source: AMIS Policy Database.')
                            //var label = this.renderer.label('Graph excludes mixed commodity classes. Not all countries notify each year. Graph only considers ad valorem<br>tariffs for which notifications were made for both the MFN applied tariff and the Final bound tariff.<br>Source: AMIS Policy Database.')
                                .css({
                                    width: '500px',
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
                        text: 'Average values of applied and bound ad valorem import tariffs in the AMIS countries',
                        style: {"fontSize": "15px"}
                    },
                    subtitle: {
                        text: 'Period '+ obj.start_date_yy+'/'+obj.end_date_yy
                    },
                    xAxis: {
                        //categories: [
                        //    '2010',
                        //    '2011',
                        //    '2012',
                        //    '2013'
                        //]
                        categories: [
                            '2012',
                            '2013',
                            '2014',
                            '2015'
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '%',
                            rotation: 0
                        }
                    },
                    colors: [
                        '#255ba3',//Dark Blue
                        '#67b7e3',//Light Blue
                        '#c52b15',//Dark Red
                        '#ec6754',//Light Red
                        '#125824',//Dark Green
                        '#199e34',//Light Green
                        '#9a9a9a',//Dark Gray
                        '#cccccc'//Light Gray
                    ],
                    tooltip: {
                        shared: true,
                        formatter: function () {
                            var s = '';
                            $.each(this.points, function (i,point) {
                                s +='<span style="color:'+point.series.color+'">'+point.series.name+'</span>: <b>'+Highcharts.numberFormat(point.y, 1) +'</b>%; <b>'+point.point.name+ '</b> TLS<br/>';
                            });

                            return s;
                        }
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    legend: {
                        title: {
                            text: 'Commodity Class',
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
                        y: 370,
                        x:0,
                        useHTML: true,
//                                borderWidth: 1,
                        enabled: true,
                        borderColor: '#4572a7',
                        labelFormatter: function() {
//                    var html_legend = '<dl><dt><b>'+this.name+'</b></dt><dd> :'+ pmt_name_description[this.name]+'</dd></dl>';
                            //return this.name +' ('+pmt_name_description[this.name]+')';
                            //var html_legend = '<table><tr><td valign="top"><b>'+this.name+': </b></td><td>'+ split_string(pmt_name_description[this.name])+'</td></tr></table>';
//                            var html_legend = ''+this.name+': '+ split_string(pmTariffQuotas_name_description[this.name]);
                            var html_legend = ''+this.name+': '+ '<span style="font-weight: normal;font-size: 10px;">'+pmTariffQuotas_name_description[this.name]+'</span>';
                            return html_legend;
                        }
                    },

//                    labels: {
//                        items: [
//                            {
////                        html: 'In Australia, Brazil, Canada, Mexico and US biofuel policies can be implemented at state-level.<br>Source: AMIS Policy',
//                                html: 'Graph excludes mixed commodity classes.<br>Graph only considers ad valorem tariffs for which notifications were made for both the MFN applied tariff and the Final bound tariff.<br>Not all countries notify each year.<br>Source: AMIS Policy Database.',
//                                style: {
//                                    left: '1px',
//                                    //top: '402px',
//                                    top: '260',
//                                    cursor: 'default',
//                                    color: '#413839',
//                                    fontSize: '10px'
//                                }
//                            }
//                        ]
//                    },
                    credits: {
                        enabled: false
//                href: 'javascript:;',
//                position: {
//                    align: 'right'
//                    // x: 10,
//                    // y: -5
//                },
//                style: {
//                    cursor: 'default',
//                    color: '#413839',
//                    fontSize: '10px'
//                },
//                text: 'Source: AMIS Policy'
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
                                            var today = currentDate();
                                            this.exportChart({filename: 'Import-tariffs-frequency_graph'}, {subtitle: {text: this.subtitle.textStr+today}});
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
                                                filename: 'Import-tariffs-frequency_graph'
                                            }, {subtitle: {text: this.subtitle.textStr+today}});
                                        }
                                    },
                                    {
                                        text: 'As SVG vector image',
                                        onclick: function () {
                                            var today = currentDate();
                                            this.exportChart({
                                                type: 'image/svg+xml',
                                                filename: 'Import-tariffs-frequency_graph'
                                            }, {subtitle: {text: this.subtitle.textStr+today}});
                                        }

                                    },
                                    {
                                        text: 'To PDF document',
                                        onclick: function () {
                                            var today = currentDate();
                                            this.exportChart({
                                                type: 'application/pdf',
                                                filename: 'Import-tariffs-frequency_graph'
                                            }, {subtitle: {text: this.subtitle.textStr+today}});
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    series: json};
                console.log(JSON.stringify(o));
                $('#bd4_submenu1-chart_one').highcharts(o);
            },

            error : function(err,b,c) {
              //  alert(err.status + ", " + b + ", " + c);
            }
        });
    }

//    function subMenu2(obj){
//
//        var policy_type_codes_array = [];
//        policy_type_codes_array.push(ap_utilVariables.CONFIG.import_tariffs_policy_type_code);
//        var policy_measure_codes_array = [];
//        policy_measure_codes_array.push(ap_utilVariables.CONFIG.import_tariffs_policy_measure_code);
//        var data = ap_policyDataObject.init();
//        data.datasource = ap_utilVariables.CONFIG.datasource;
//        data.commodity_class_code = ap_utilVariables.CONFIG.import_tariffs_commodity_class_codes;
//        //The order is important
//        data.policy_type_code = policy_type_codes_array;
//        data.policy_measure_code = policy_measure_codes_array;
//        data.year_list = ap_utilVariables.CONFIG.import_tariffs_year_list;
//        data.unit = ap_utilVariables.CONFIG.import_tariffs_unit;
//        data.policy_element = ap_utilVariables.CONFIG.import_tariffs_policy_element;
//        //MAX
//        data.chart_type = false;
//
//        var payloadrest = JSON.stringify(data);
//        /* Retrive UI structure from DB. */
//        $.ajax({
//
//            type: 'POST',
//            url: 'http://'+ap_utilVariables.CONFIG.base_ip_address+':'+ap_utilVariables.CONFIG.base_ip_port+ap_utilVariables.CONFIG.importTariffsPolicyMeasuresBarChart,
//            data : {"pdObj": payloadrest},
//
//            success : function(response) {
//
//                /* Convert the response in an object, i needed. */
//                var json = response;
//                if (typeof(response) == 'string')
//                    json = $.parseJSON(response);
//
//                //Chart
//                $('#bd4_submenu1-chart_two').highcharts({
//                    chart: {
//                        type: 'column',
//                        borderWidth: 2,
//                        marginBottom: 100
//                    },
//                    title: {
//                        text: 'Average values of applied and bound ad valorem import tariffs in the AMIS countries'
//                    },
//                    subtitle: {
//                        text: 'Period '+ obj.start_date_yy+'/'+obj.end_date_yy
//                    },
//                    xAxis: {
//                        categories: [
//                            '2010',
//                            '2011',
//                            '2012',
//                            '2013'
//                        ]
//                    },
//                    yAxis: {
//                        min: 0,
//                        title: {
//                            text: '%',
//                            rotation: 0
//                        }
//                    },
//                    colors: [
//                        '#255ba3',//Dark Blue
//                        '#67b7e3',//Light Blue
//                        '#c52b15',//Dark Red
//                        '#ec6754',//Light Red
//                        '#125824',//Dark Green
//                        '#199e34',//Light Green
//                        '#9a9a9a',//Dark Gray
//                        '#cccccc'//Light Gray
//                    ],
//                    tooltip: {
//                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
//                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
////                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
//                            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
//                        footerFormat: '</table>',
//                        shared: true,
//                        useHTML: true
//                    },
//                    plotOptions: {
//                        column: {
//                            pointPadding: 0.2,
//                            borderWidth: 0
//                        }
//                    },
//                    legend: {
//                        title: {
//                            text: 'Commodity Class',
//                            style: {
//                                fontStyle: 'italic'
//                            }
//                        },
//                        layout: 'vertical',
//                        align: 'right',
//                        verticalAlign: 'top',
//                        y: 50,
//                        borderWidth: 1,
//                        enabled: true,
//                        borderColor: '#4572a7',
//                        labelFormatter: function() {
////                    var html_legend = '<dl><dt><b>'+this.name+'</b></dt><dd> :'+ pmt_name_description[this.name]+'</dd></dl>';
//                            //return this.name +' ('+pmt_name_description[this.name]+')';
//                            //var html_legend = '<table><tr><td valign="top"><b>'+this.name+': </b></td><td>'+ split_string(pmt_name_description[this.name])+'</td></tr></table>';
//                            var html_legend = ''+this.name+': '+ split_string(pmTariffQuotas_name_description[this.name]);
//                            return html_legend;
//                        }
//                    },
//                    labels: {
//                        items: [
//                            {
////                        html: 'In Australia, Brazil, Canada, Mexico and US biofuel policies can be implemented at state-level.<br>Source: AMIS Policy',
//                                html: 'Graph excludes mixed commodity classes.<br>Graph only considers ad valorem tariffs for which notifications were made for both the MFN applied tariff and the Final bound tariff.<br>Not all countries notify each year.<br>Source: AMIS Policy Database.',
//                                style: {
//                                    left: '1px',
//                                    //top: '402px',
//                                    top: '260',
//                                    cursor: 'default',
//                                    color: '#413839',
//                                    fontSize: '10px'
//                                }
//                            }
//                        ]
//                    },
//                    credits: {
//                        enabled: false
////                href: 'javascript:;',
////                position: {
////                    align: 'right'
////                    // x: 10,
////                    // y: -5
////                },
////                style: {
////                    cursor: 'default',
////                    color: '#413839',
////                    fontSize: '10px'
////                },
////                text: 'Source: AMIS Policy'
//                    },
//                    exporting: {
//                        buttons: {
//                            contextButton: {
//                                enabled: false
//
//                            }
////                    ,
////                    exportButton: {
//////                        theme: {
//////                            title: 'Download',
//////                            'stroke-width': 1,
//////                            stroke: '#4572a7',
//////                            //fill: '#bada55',
//////                            fill: '#f5cd54',
//////                            r: 0
//////                        },
////                        theme: {
////                            title: 'Download',
////                            'stroke-width': 1,
////                            stroke: '#4572a7',
////                            //fill: '#f5cd54',
////                            //  fill: '#bada55',
////                            fill:'#ADD8E6',
////                            r: 0,
////                            states: {
////                                hover: {
////                                    fill: '#d3d3d3'
////                                }
////                            }
////                        },
////                        text: 'Chart Download',
////                        menuItems: [
////                            {
////                                text: 'As PNG image',
////                                onclick: function () {
////                                    this.exportChart();
////                                }
////
////                            },
////                            {
////                                text: 'As JPEG image',
////                                onclick: function () {
////                                    this.exportChart({
////                                        type: 'image/jpeg'
////                                    });
////                                }
////                            },
////                            {
////                                text: 'As SVG vector image',
////                                onclick: function () {
////                                    this.exportChart({
////                                        type: 'image/svg+xml'
////                                    });
////                                }
////
////                            },
////                            {
////                                text: 'To PDF document',
////                                onclick: function () {
////                                    this.exportChart({
////                                        type: 'application/pdf'
////                                    });
////                                }
////                            }
////                        ]
////                    }
//                        }
//                    },
//                    series: json
//                });
//            },
//
//            error : function(err,b,c) {
//                alert(err.status + ", " + b + ", " + c);
//            }
//        });
//    }

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

    return { subMenu1 : subMenu1,
        currentDate : currentDate
//        subMenu2 : subMenu2
    }

});

//window.addEventListener('load', ap_policiesAtaGlance_importTariffsQuotas_util.init, false);
