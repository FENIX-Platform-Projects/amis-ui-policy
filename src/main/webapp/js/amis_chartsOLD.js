window.AMIS_home_charts = {
    'chartOne':{
        "chart":{
            "type":"column",
            "borderWidth":0,
            "marginBottom":100,
            "backgroundColor": '#fafafa'
        },
        "title":{
            "text":"Number of AMIS countries with biofuel policies, disaggregated by policy type",
            "style": {
                color: '#2a5d9f',
                fontFamily: 'Open Sans Condensed'
            }
        },
        "subtitle":{
            "text":"Period 01-2010 until 01-2014"
        },
        "colors":[
            "#125824",
            "#255ba3",
            "#f6b539",
            "#199e34",
            "#cccccc",
            "#67b7e3",
            "#dc3018"
        ],
        "xAxis":{
            "categories":[
                "Ethanol",
                "Biodiesel",
                "Biofuel (unspecified)"
            ]
        },
        "yAxis":{
            "min":0,
            "allowDecimals":false,
            "title":{
                "text":"Number of AMIS Countries"
            }
        },
        "tooltip":{
            "headerFormat":"<span style='font-size:10px'>{point.key}</span><table>",
            "pointFormat":"<tr><td style='color:{series.color};padding:0'>{series.name}: </td><td style='padding:0'><b>{point.y}</b></td></tr>",
            "footerFormat":"</table>",
            "shared":true,
            "useHTML":true,
            "enabled":false
        },
        "labels":{
            "items":[
                {
                    "html":'In Australia, Brazil, Canada, Mexico and US biofuel policies can be implemented at state-level. <br>Ethanol, biodiesel and biofuel (unspecified) are mutually exclusive categories. <br>Source: AMIS Policy Database',
                    "style":{
                        "left":"1px",
                        "top":"220px",
                        "cursor":"default",
                        "color":"#413839",
                        "fontSize":"10px"
                    }
                }
            ]
        },
        "credits":{
            "enabled":false
        },
        "plotOptions":{
            "column":{
                "pointPadding":0.2,
                "borderWidth":0,
                events: {
                    legendItemClick: function () {
                        return false; // <== returning false will cancel the default action
                    }
                }
            }
        },
        "legend":{
            "enabled": true,
            "title":{
                "text":"Policy Type",
                "style":{
                    "fontStyle":"italic"
                }
            },
            "layout":"vertical",
            "align":"right",
            "verticalAlign":"top",
            "y":50,
            "borderWidth":1,
            "borderColor":"#4572a7"
        },
        "exporting":{
            "buttons":{
                "contextButton":{
                    "enabled":false
                }
            }
        },
        "series":[
            {
                "name":'1: Biofuel Target',
                "data":[
                    17,
                    12,
                    9
                ]
            },
            {
                "name":'2: Domestic price regulation',
                "data":[
                    4,
                    4,
                    0
                ]
            },
            {
                "name":'3: Export measures',
                "data":[
                    6,
                    4,
                    1
                ]
            },
            {
                "name":'4: Import measures',
                "data":[
                    23,
                    23,
                    0
                ]
            },
            {
                "name":'5: Other domestic measures',
                "data":[
                    0,
                    1,
                    1
                ]
            },
            {
                "name":'6: Production payments',
                "data":[
                    6,
                    4,
                    1
                ]
            },
            {
                "name":'7: Tax concession',
                "data":[
                    18,
                    15,
                    2
                ]
            }
        ]
    },
    //'chartTwo': {
    //    "chart":{
    //        "type":"column",
    //        "borderWidth":0,
    //        "marginBottom":100,
    //        "backgroundColor": '#fafafa'
    //    },
    //    "title":{
    //        "text":"Average values of applied and bound ad valorem import tariffs in the AMIS countries",
    //        "style": {
    //            color: '#2a5d9f',
    //            fontFamily: 'Open Sans Condensed'
    //        }
    //    },
    //    "subtitle":{
    //        "text":"Period 2010/2013"
    //    },
    //    "xAxis":{
    //        "categories":[
    //            "2010",
    //            "2011",
    //            "2012",
    //            "2013"
    //        ]
    //    },
    //    "yAxis":{
    //        "min":0,
    //        "title":{
    //            "text":"%",
    //            "rotation":0
    //        }
    //    },
    //    "colors":[
    //        "#255ba3",
    //        "#67b7e3",
    //        "#c52b15",
    //        "#ec6754",
    //        "#125824",
    //        "#199e34",
    //        "#9a9a9a",
    //        "#cccccc"
    //    ],
    //    "tooltip":{
    //        "headerFormat":"<span style='font-size:10px'>{point.key}</span><table>",
    //        "pointFormat":"<tr><td style='color:{series.color};padding:0'>{series.name}:</td><td style='padding:0'><b>{point.y:.1f}</b></td></tr>",
    //        "footerFormat":"</table>",
    //        "shared":true,
    //        "useHTML":true,
    //        "enabled":false
    //    },
    //    "plotOptions":{
    //        "column":{
    //            "pointPadding":0.2,
    //            "borderWidth":0,
    //            events: {
    //                legendItemClick: function () {
    //                    return false; // <== returning false will cancel the default action
    //                }
    //            }
    //        }
    //    },
    //    "legend":{
    //        "enabled": true,
    //        "title":{
    //            "text":"Commodity Class",
    //            "style":{
    //                "fontStyle":"italic"
    //            }
    //        },
    //        "layout":"vertical",
    //        "align":"right",
    //        "verticalAlign":"top",
    //        "y":50,
    //        "borderWidth":1,
    //        "borderColor":"#4572a7"
    //    },
    //    "labels":{
    //        "items":[
    //            {
    //                "html":"Graph excludes mixed commodity classes.<br>Graph only considers ad valorem tariffs for which notifications were made for both the MFN applied tariff and the Final bound tariff.<br>Not all countries notify each year.<br>Source: AMIS Policy Database.",
    //                "style":{
    //                    "left":"1px",
    //                    "top":"220px",
    //                    "cursor":"default",
    //                    "color":"#413839",
    //                    "fontSize":"10px"
    //                }
    //            }
    //        ]
    //    },
    //    "credits":{
    //        "enabled":false
    //    },
    //    "exporting":{
    //        "buttons":{
    //            "contextButton":{
    //                "enabled":false
    //            }
    //        }
    //    },
    //    "series":[{"name":'1: Wheat: Final Bound Tariff',"data":[44,60.1573770491803,34.902500000000025,28.76619718309869]},{"name":'2: Wheat: MFN Applied Tariff',"data":[44,23.217857142857152,11.701626016260152,10.781333333333436]},{"name":'3: Maize: Final Bound Tariff',"data":[33.333333333333336,59.552307692307714,37.541428571430565,51.9243243243246]},{"name":'4: Maize: MFN Applied Tariff',"data":[33.333333333333336,18.82586206896547,12.670422535211138,32.92151898734162]},{"name":'5: Rice: Final Bound Tariff',"data":[41.5625,54.82183908045977,39.16428571428571,34.499999999999915]},{"name":'6: Rice: MFN Applied Tariff',"data":[41.5625,29.25,16.95744680851064,18.260714285714293]},{"name":'7: Soybean: Final Bound Tariff',"data":[4.9,73.5758620689654,28.917045454545587,11.31800000000012]},{"name":'8: Soybean: MFN Applied Tariff',"data":[4.9,12.495652173913033,6.65568181818181,4.241176470588247]}]
    //
    //},
    'chartThree': {
        "chart":{
            "type":"column",
            "borderWidth":0,
            "marginBottom":100,
            "backgroundColor": '#fafafa'
        },
        "title":{
            "text":"Number of AMIS countries with export restriction policies, disaggregated by policy measure",
            "style": {
                color: '#2a5d9f',
                fontFamily: 'Open Sans Condensed'
            }
        },
        "subtitle":{
            "text":"Period 01-2010 until 01-2014"
        },
        "colors":[
            "#125824",
            "#255ba3",
            "#f6b539",
            "#199e34",
            "#cccccc",
            "#67b7e3",
            "#dc3018"
        ],
        "xAxis":{
            "categories":[
                "Wheat",
                "Maize",
                "Rice",
                "Soybeans",
                "All"
            ]
        },
        "yAxis":{
            "min":0,
            "allowDecimals":false,
            "title":{
                "text":"Number of AMIS Countries"
            }
        },
        "tooltip":{
            "headerFormat":"<span style='font-size:10px'>{point.key}</span><table>",
            "pointFormat":"<tr><td style='color:{series.color};padding:0'>{series.name}: </td><td style='padding:0'><b>{point.y}</b></td></tr>",
            "footerFormat":"</table>",
            "shared":true,
            "useHTML":true,
            "enabled":false
        },
        "labels":{
            "items":[
                {
                    html: 'Graph excludes mixed commodity classes.<br>Countries target their interventions on specific varieties, often at the HS8 or HS10 digit level.<br>Source: AMIS Policy Database',
                    "style":{
                        "left":"1px",
                        "top":"220px",
                        "cursor":"default",
                        "color":"#413839",
                        "fontSize":"10px"
                    }
                }
            ]
        },
        "credits":{
            "enabled":false
        },
        "plotOptions":{
            "column":{
                "pointPadding":0.2,
                "borderWidth":0,
                events: {
                    legendItemClick: function () {
                        return false; // <== returning false will cancel the default action
                    }
                }
            }
        },
        "legend":{
            "title":{
                "text":"Policy Measure",
                "style":{
                    "fontStyle":"italic"
                }
            },
            "layout":"vertical",
            "align":"right",
            "verticalAlign":"top",
            "y":50,
            "borderWidth":1,
            "enabled":true,
            "borderColor":"#4572a7"
        },
        "exporting":{
            "buttons":{
                "contextButton":{
                    "enabled":false
                }
            }
        },
        "series":[
            {
                "name":'1: Export prohibition',
                "data":[
                    4,
                    4,
                    5,
                    3
                ]
            },
            {
                "name":'2: Export quota',
                "data":[
                    3,
                    1,
                    3,
                    1
                ]
            },
            {
                "name":'3: Export tax',
                "data":[
                    4,
                    3,
                    4,
                    4
                ]
            },
            {
                "name":'4: Licensing requirement',
                "data":[
                    6,
                    5,
                    8,
                    3
                ]
            },
            {
                "name":'5: Minimum reference price',
                "data":[
                    1,
                    2,
                    2,
                    2
                ]
            }
        ]
    }
};