var ap_policiesAtaGlance_importTariffsQuotas_util = (function() {

    var from = '16-02-2014';
    var to = '18-02-2014';

    var pmt_name_description = {};
    pmt_name_description["1"] = "Per unit domestic measures";
    pmt_name_description["2"] = "Export measures";
    pmt_name_description["3"] = "Biofuel mandates";
    pmt_name_description["4"] = "Import measures";

    var pm_name_description = {};
    pm_name_description["1"] = "Export prohibition";
    pm_name_description["2"] = "Export tax";
    pm_name_description["3"] = "Restriction on customs clearance point for exports";
    pm_name_description["4"] = "Export quota";
    pm_name_description["5"] = "Minimum export price / price reference for exports";
    pm_name_description["6"] = "Domestic price regulation";
    pm_name_description["7"] = "Carbon tax exemption or similar disincentive systems on fossil fuels (in the transport sector)";
    pm_name_description["8"] = "Non-specified tax concessions";

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
                    marginBottom: 100
                },
                    title: {
                        text: 'Average values of applied and bound ad valorem import tariffs in the AMIS countries'
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
                    labels: {
                        items: [
                            {
//                        html: 'In Australia, Brazil, Canada, Mexico and US biofuel policies can be implemented at state-level.<br>Source: AMIS Policy',
                                html: 'Graph excludes mixed commodity classes.<br>Graph only considers ad valorem tariffs for which notifications were made for both the MFN applied tariff and the Final bound tariff.<br>Not all countries notify each year.<br>Source: AMIS Policy Database.',
                                style: {
                                    left: '1px',
                                    //top: '402px',
                                    top: '260',
                                    cursor: 'default',
                                    color: '#413839',
                                    fontSize: '10px'
                                }
                            }
                        ]
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
                    series: json};
                console.log(JSON.stringify(o));
                $('#bd4_submenu1-chart_one').highcharts(o);
            },

            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    }

    function subMenu2(obj){

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
        data.year_list = ap_utilVariables.CONFIG.import_tariffs_year_list;
        data.unit = ap_utilVariables.CONFIG.import_tariffs_unit;
        data.policy_element = ap_utilVariables.CONFIG.import_tariffs_policy_element;
        //MAX
        data.chart_type = false;

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
                $('#bd4_submenu1-chart_two').highcharts({
                    chart: {
                        type: 'column',
                        borderWidth: 2,
                        marginBottom: 100
                    },
                    title: {
                        text: 'Average values of applied and bound ad valorem import tariffs in the AMIS countries'
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
                    labels: {
                        items: [
                            {
//                        html: 'In Australia, Brazil, Canada, Mexico and US biofuel policies can be implemented at state-level.<br>Source: AMIS Policy',
                                html: 'Graph excludes mixed commodity classes.<br>Graph only considers ad valorem tariffs for which notifications were made for both the MFN applied tariff and the Final bound tariff.<br>Not all countries notify each year.<br>Source: AMIS Policy Database.',
                                style: {
                                    left: '1px',
                                    //top: '402px',
                                    top: '260',
                                    cursor: 'default',
                                    color: '#413839',
                                    fontSize: '10px'
                                }
                            }
                        ]
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
                    series: json
                });
            },

            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    }


    return { subMenu1 : subMenu1,
        subMenu2 : subMenu2
    }

})();

//window.addEventListener('load', ap_policiesAtaGlance_importTariffsQuotas_util.init, false);
