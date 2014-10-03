function amis_chart_init() {
    var chart_script_tag;
    var ensureJS;
    var ensureCSS;
    var ensureCSS1;
    var dependenciesJS = ["http://statistics.amis-outlook.org/data/amis-market-monitor/js/model/domainmodel.js", "http://statistics.amis-outlook.org/data/amis-market-monitor/js/view/chartview.js", "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js", "http://statistics.amis-outlook.org/data/amis-market-monitor/js/util/xdr.js"];
    var ensureJSLoaded = false;
    // include_CSS("http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css", "http://statistics.amis-outlook.org/data/amis-market-monitor/css/jquery-ui-custom.css");
    include_CSS("http://statistics.amis-outlook.org/data/amis-market-monitor/plugin/jquery-ui-datepicker/css/custom-theme/jquery-ui-1.10.2.custom.min.css");
    include_ensureJS("http://statistics.amis-outlook.org/data/amis-market-monitor/js/util/head.min.js");
    include_ensureJS("http://statistics.amis-outlook.org/data/amis-market-monitor/js/util/jQuery.XDomainRequest.js");
    if (dependenciesJS.length > 3)
        dependenciesJS.pop();
    var documentUrl = document.URL;
    var pageId = document.URL.split('id=')[1];
    if ($("#amis_mm_l_charts").length > 0) {
        dependenciesJS.push("http://statistics.amis-outlook.org/data/amis-market-monitor/js/controller/amis-basic-hstocks-controller.js");
        onEnsureScriptLoad(dependenciesJS, "LANDING");
    } else if ($("#amis_mm_p_charts").length > 0) {
        dependenciesJS.push("http://statistics.amis-outlook.org/data/amis-market-monitor/js/controller/amis-basic-hstocks-controller.js");
        onEnsureScriptLoad(dependenciesJS, "PRICES");
    } else if ($("#amis_mm_oi_charts").length > 0) {
        dependenciesJS.push("http://statistics.amis-outlook.org/data/amis-market-monitor/js/controller/amis-basic-hstocks-controller.js");
        onEnsureScriptLoad(dependenciesJS, "OTHER_INDICATORS");
    } else if ($("#amis_mm_stu_charts").length > 0) {
        dependenciesJS.push("http://statistics.amis-outlook.org/data/amis-market-monitor/js/controller/amis-stocks-and-ratios-controller.js");
        onEnsureScriptLoad(dependenciesJS, "STOCKS");
    } else if ($("#amis_mm_ofe_charts").length > 0) {
        dependenciesJS.push("http://statistics.amis-outlook.org/data/amis-market-monitor/js/controller/amis-basic-hstocks-controller.js");
        onEnsureScriptLoad(dependenciesJS, "OIL_FREIGHTS_ETHANOL");
    } else if ($("#amis_mm_fred_charts").length > 0) {
        dependenciesJS.push("http://statistics.amis-outlook.org/data/amis-market-monitor/js/controller/amis-basic-hstocks-controller.js");
        onEnsureScriptLoad(dependenciesJS, "FRED");
    }
};

function include_ensureJS(file) {
    var html_doc = document.getElementsByTagName('head')[0];
    ensureJS = document.createElement('script');
    ensureJS.setAttribute('type', 'text/javascript');
    ensureJS.setAttribute('src', file);
    html_doc.appendChild(ensureJS);
    return false;
}

function include_CSS(file, file2) {
    var html_doc = document.getElementsByTagName('head')[0];
    ensureCSS = document.createElement('link');
    ensureCSS.setAttribute('rel', 'stylesheet');
    ensureCSS.setAttribute('href', file);
    html_doc.appendChild(ensureCSS);
    ensureCSS1 = document.createElement('link');
    ensureCSS1.setAttribute('rel', 'stylesheet');
    ensureCSS1.setAttribute('href', file2);
    html_doc.appendChild(ensureCSS1);
    return false;
}

function onEnsureScriptLoad(urlControllers, pagetype) {
    ensureJS.onreadystatechange = function () {
        if (ensureJS.readyState == 'complete') {
            loadEnsureScriptHandler(urlControllers, pagetype);
        }
    }
    ensureJS.onload = function () {
        loadEnsureScriptHandler(urlControllers, pagetype);
    }
}

function loadEnsureScriptHandler(controllerUrls, pagetype) {
    if (typeof head !== 'undefined') {
        $.getScript("http://statistics.amis-outlook.org/data/amis-market-monitor/js/util/json3.min.js", function (data, textStatus, jqxhr) {
            head.js(controllerUrls[0], controllerUrls[1], controllerUrls[2], controllerUrls[3], function () {
                if (pagetype == "LANDING") {
                    loadLandingPage();
                } else if (pagetype == "OTHER_INDICATORS") {
                    loadOtherIndicatorsPage();
                } else if (pagetype == "STOCKS") {
                    loadStocksPage();
                } else if (pagetype == "PRICES") {
                    loadPricesPage();
                } else if (pagetype == "OIL_FREIGHTS_ETHANOL") {
                    loadOilFreightsEthanolPage();
                } else if (pagetype == "FRED") {
                    loadFREDPage();
                }
            });
        });
    } else {}
}

function loadLandingPage() {
    if ($("#amis_mm_l_chart_IGC").length > 0) {
        var model1Y = new MarketMonitorDomainModel('IGC Grains and Oilseeds Index and sub-Indices', '5', 'AMIS_IGC_DAILY_INDICATORS', 'AMIS-STATISTICS', ['GOI', 'WPI', 'MPI', 'RPI', 'SPI'], null, 'amis-mm-other-indicators');
        var view1Y = new MarketMonitorChartView(model1Y, {
            'chartDivId': 'amis_mm_l_chart_IGC',
            'chartSessionId': 'IGC',
            'chartHideDataExport': false,
            'chartTimeFrame': '12m',
            'chartRangeSelectorButtons': ['12m', '6m', '1m']
        });
        var chart1Y = new BasicHighStocksController(model1Y, view1Y).getData();
    }
    if ($("#amis_mm_l_chart_FP").length > 0) {
        model1Y = new MarketMonitorDomainModel('Fertilizer Prices-FOB', '2', 'AMIS_MONTHLY_INDICATORS', 'AMIS-STATISTICS', ['GCFPPGVC', 'GCFPDAGE', 'GCFPURBS', 'GCFPPRM'], null, 'amis-mm-other-indicators');
        view1Y = new MarketMonitorChartView(model1Y, {
            'chartDivId': 'amis_mm_l_chart_FP',
            'chartSessionId': 'FP',
            'chartHideDataExport': false,
            'chartTimeFrame': '12m',
            'chartRangeSelectorButtons': ['12m', '6m', '1m']
        });
        chart1Y = new BasicHighStocksController(model1Y, view1Y).getData();
    }
    if ($("#amis_mm_l_chart_STUR").length > 0) {
        model1Y = new MarketMonitorDomainModel('World Stocks-to-Use Ratio', '2', 'AMIS', 'AMIS-STATISTICS', ['1', '5', '6', '4'], null, 'amis-mm-other-indicators');
        view1Y = new MarketMonitorChartView(model1Y, {
            'chartDivId': 'amis_mm_l_chart_STUR',
            'chartSessionId': 'STUR',
            'chartHideDataExport': false,
            'chartTimeFrame': '5y',
            'chartHideSeries': ['6']
        });
        chart1Y = new BasicHighStocksController(model1Y, view1Y).getData();
    }
    // var chartTrial = new StocksAndRatiosController(modelTrial, viewTrial).getData();
    if ($("#amis_mm_l_chart_FPI").length > 0) {
        model1Y = new MarketMonitorDomainModel('FAO Food Price Index and Sub-Indices', '4', 'AMIS_MONTHLY_INDICATORS', 'AMIS-STATISTICS', ['FPI', 'FPIC', 'FPIOF', 'FPIS', 'FPIM', 'FPID'], null, 'amis-mm-other-indicators');
        view1Y = new MarketMonitorChartView(model1Y, {
            'chartDivId': 'amis_mm_l_chart_FPI',
            'chartSessionId': 'FPI',
            'chartHideDataExport': false,
            'chartTimeFrame': '12m',
            'chartRangeSelectorButtons': ['12m', '6m', '1m']
        });
        chart1Y = new BasicHighStocksController(model1Y, view1Y).getData();
    }
}

function loadOtherIndicatorsPage() {
    //replaced with FRED
    // if ($("#amis_mm_oi_chart_USD").length > 0){
    // var model = new MarketMonitorDomainModel('Dollar Indices', '1', 'AMIS_MONTHLY_INDICATORS', 'AMIS-STATISTICS', ['USTR$','USTRBROA'], null, 'amis-mm-other-indicators');
    // var view = new MarketMonitorChartView(model, {
    // 'chartDivId' : 'amis_mm_oi_chart_USD',
    // 'chartSessionId' : 'USD',
    // 'chartHideDataExport': false
    // });
    // var chart1 = new BasicHighStocksController(model, view).getData();
    // }
    if ($("#amis_mm_oi_chart_FP").length > 0) {
        var model2 = new MarketMonitorDomainModel('Fertilizer Prices-FOB', '2', 'AMIS_MONTHLY_INDICATORS', 'AMIS-STATISTICS', ['GCFPPGVC', 'GCFPDAGE', 'GCFPURBS', 'GCFPPRM'], null, 'amis-mm-other-indicators');
        var view2 = new MarketMonitorChartView(model2, {
            'chartDivId': 'amis_mm_oi_chart_FP',
            'chartSessionId': 'FP',
            'chartHideDataExport': false
        });
        var chartFO = new BasicHighStocksController(model2, view2).getData();
    }
    //Compare by Year charts
    if ($("#amis_mm_oi_chart_FP_GCFPPGVC").length > 0) {
        var model2 = new MarketMonitorDomainModel('(by year)', '2', 'AMIS_MONTHLY_INDICATORS', 'AMIS-STATISTICS', ['GCFPPGVC'], null, 'amis-mm-compare-indicators');
        var view2 = new MarketMonitorChartView(model2, {
            'chartDivId': 'amis_mm_oi_chart_FP_GCFPPGVC',
            'chartSessionId': 'FP_GCFPPGVC',
            'chartTimeFrame': '4y',
            'chartType': 'COMPARE_YEARS',
            // 'chartXAxisStartMonth':'03',
            'chartHideDataExport': false
        });
        var chartFO = new BasicHighStocksController(model2, view2).getData();
    }
    if ($("#amis_mm_oi_chart_FP_GCFPDAGE").length > 0) {
        var model2 = new MarketMonitorDomainModel('(by year)', '2', 'AMIS_MONTHLY_INDICATORS', 'AMIS-STATISTICS', ['GCFPDAGE'], null, 'amis-mm-compare-indicators');
        var view2 = new MarketMonitorChartView(model2, {
            'chartDivId': 'amis_mm_oi_chart_FP_GCFPDAGE',
            'chartSessionId': 'FP_GCFPDAGE',
            'chartTimeFrame': '4y',
            'chartType': 'COMPARE_YEARS',
            'chartHideDataExport': false
        });
        var chartFO = new BasicHighStocksController(model2, view2).getData();
    }
    if ($("#amis_mm_oi_chart_FP_GCFPURBS").length > 0) {
        var model2 = new MarketMonitorDomainModel('(by year)', '2', 'AMIS_MONTHLY_INDICATORS', 'AMIS-STATISTICS', ['GCFPURBS'], null, 'amis-mm-compare-indicators');
        var view2 = new MarketMonitorChartView(model2, {
            'chartDivId': 'amis_mm_oi_chart_FP_GCFPURBS',
            'chartSessionId': 'FP_GCFPURBS',
            'chartTimeFrame': '4y',
            'chartType': 'COMPARE_YEARS',
            'chartHideDataExport': false
        });
        var chartFO = new BasicHighStocksController(model2, view2).getData();
    }
    if ($("#amis_mm_oi_chart_FP_GCFPPRM").length > 0) {
        var model2 = new MarketMonitorDomainModel('(by year)', '2', 'AMIS_MONTHLY_INDICATORS', 'AMIS-STATISTICS', ['GCFPPRM'], null, 'amis-mm-compare-indicators');
        var view2 = new MarketMonitorChartView(model2, {
            'chartDivId': 'amis_mm_oi_chart_FP_GCFPPRM',
            'chartSessionId': 'FP_GCFPPRM',
            'chartTimeFrame': '4y',
            'chartType': 'COMPARE_YEARS',
            'chartHideDataExport': false
        });
        var chartFO = new BasicHighStocksController(model2, view2).getData();
    }
    //'chartEnableTooltip': false
    //replaced with FRED
    // if ($("#amis_mm_oi_chart_COP").length > 0){
    // var modelCo = new MarketMonitorDomainModel('Crude Oil Prices-FOB', '2', 'AMIS_MONTHLY_INDICATORS', 'AMIS-STATISTICS', ['COY','COWTI'], null, 'amis-mm-other-indicators');
    // var viewCo = new MarketMonitorChartView(modelCo, {
    // 'chartDivId' : 'amis_mm_oi_chart_COP',
    // 'chartSessionId' : 'COP',
    // 'chartHideDataExport': false
    // });
    // var chartCo = new BasicHighStocksController(modelCo, viewCo).getData();
    // }
}

function loadPricesPage() {
    if ($("#amis_mm_p_chart_HVW").length > 0) {
        var modelHVol1 = new MarketMonitorDomainModel('Wheat Historical Volatility', '7', 'AMIS_VOLATILITY_DAILY_INDICATORS', 'AMIS-STATISTICS', ['HVW'], null, 'amis-mm-other-indicators');
        var viewHVol1 = new MarketMonitorChartView(modelHVol1, {
            'chartDivId': 'amis_mm_p_chart_HVW',
            'chartSessionId': 'HVW',
            'chartHideDataExport': true
        });
        var chartHVol1 = new BasicHighStocksController(modelHVol1, viewHVol1).getData();
    }
    if ($("#amis_mm_p_chart_HVM").length > 0) {
        var modelHVol2 = new MarketMonitorDomainModel('Maize Historical Volatility', '7', 'AMIS_VOLATILITY_DAILY_INDICATORS', 'AMIS-STATISTICS', ['HVM'], null, 'amis-mm-other-indicators');
        var viewHVol2 = new MarketMonitorChartView(modelHVol2, {
            'chartDivId': 'amis_mm_p_chart_HVM',
            'chartSessionId': 'HVM',
            'chartHideDataExport': true
        });
        var chartHVol2 = new BasicHighStocksController(modelHVol2, viewHVol2).getData();
    }
    if ($("#amis_mm_p_chart_HVR").length > 0) {
        var modelHVol3 = new MarketMonitorDomainModel('Rough Rice Historical Volatility', '7', 'AMIS_VOLATILITY_DAILY_INDICATORS', 'AMIS-STATISTICS', ['HVR'], null, 'amis-mm-other-indicators');
        var viewHVol3 = new MarketMonitorChartView(modelHVol3, {
            'chartDivId': 'amis_mm_p_chart_HVR',
            'chartSessionId': 'HVR',
            'chartHideDataExport': true
        });
        var chartHVol3 = new BasicHighStocksController(modelHVol3, viewHVol3).getData();
    }
    if ($("#amis_mm_p_chart_HVS").length > 0) {
        var modelHVol4 = new MarketMonitorDomainModel('Soybeans Historical Volatility', '7', 'AMIS_VOLATILITY_DAILY_INDICATORS', 'AMIS-STATISTICS', ['HVS'], null, 'amis-mm-other-indicators');
        var viewHVol4 = new MarketMonitorChartView(modelHVol4, {
            'chartDivId': 'amis_mm_p_chart_HVS',
            'chartSessionId': 'HVS',
            'chartHideDataExport': true
        });
        var chartHVol4 = new BasicHighStocksController(modelHVol4, viewHVol4).getData();
    }
    if ($("#amis_mm_p_chart_FPI").length > 0) {
        var model6 = new MarketMonitorDomainModel('FAO Food Price Index and Sub-Indices', '4', 'AMIS_MONTHLY_INDICATORS', 'AMIS-STATISTICS', ['FPI', 'FPIC', 'FPIOF', 'FPIS', 'FPIM', 'FPID'], null, 'amis-mm-other-indicators');
        var view6 = new MarketMonitorChartView(model6, {
            'chartDivId': 'amis_mm_p_chart_FPI',
            'chartSessionId': 'FPI',
            'chartHideDataExport': false,
            'chartHideSeries': ['FPIC', 'FPIOF', 'FPIS', 'FPIM', 'FPID']
            //'chartTimeFrame': '',
            //'chartRangeSelectorButtons': ['1y','2y','5y','all']
        });
        var chart6 = new BasicHighStocksController(model6, view6).getData();
    }
    //Compare By Year Charts
    if ($("#amis_mm_p_chart_FPI_FPI").length > 0) {
        var model6 = new MarketMonitorDomainModel('(by year)', '4', 'AMIS_MONTHLY_INDICATORS', 'AMIS-STATISTICS', ['FPI'], null, 'amis-mm-compare-indicators');
        var view6 = new MarketMonitorChartView(model6, {
            'chartDivId': 'amis_mm_p_chart_FPI_FPI',
            'chartSessionId': 'FPI_FPI',
            'chartTimeFrame': '4y',
            'chartType': 'COMPARE_YEARS',
            'chartHideDataExport': false
        });
        var chart6 = new BasicHighStocksController(model6, view6).getData();
    }
    if ($("#amis_mm_p_chart_FPI_FPIC").length > 0) {
        var model6 = new MarketMonitorDomainModel('Price Index (by year)', '4', 'AMIS_MONTHLY_INDICATORS', 'AMIS-STATISTICS', ['FPIC'], null, 'amis-mm-compare-indicators');
        var view6 = new MarketMonitorChartView(model6, {
            'chartDivId': 'amis_mm_p_chart_FPI_FPIC',
            'chartSessionId': 'FPI_FPIC',
            'chartTimeFrame': '4y',
            'chartType': 'COMPARE_YEARS',
            'chartHideDataExport': false
        });
        var chart6 = new BasicHighStocksController(model6, view6).getData();
    }
    if ($("#amis_mm_p_chart_FPI_FPIOF").length > 0) {
        var model6 = new MarketMonitorDomainModel('Price Index (by year)', '4', 'AMIS_MONTHLY_INDICATORS', 'AMIS-STATISTICS', ['FPIOF'], null, 'amis-mm-compare-indicators');
        var view6 = new MarketMonitorChartView(model6, {
            'chartDivId': 'amis_mm_p_chart_FPI_FPIOF',
            'chartSessionId': 'FPI_FPIOF',
            'chartTimeFrame': '4y',
            'chartType': 'COMPARE_YEARS',
            'chartHideDataExport': false
        });
        var chart6 = new BasicHighStocksController(model6, view6).getData();
    }
    if ($("#amis_mm_p_chart_FPI_FPIS").length > 0) {
        var model6 = new MarketMonitorDomainModel('Price Index (by year)', '4', 'AMIS_MONTHLY_INDICATORS', 'AMIS-STATISTICS', ['FPIS'], null, 'amis-mm-compare-indicators');
        var view6 = new MarketMonitorChartView(model6, {
            'chartDivId': 'amis_mm_p_chart_FPI_FPIS',
            'chartSessionId': 'FPI_FPIS',
            'chartTimeFrame': '4y',
            'chartType': 'COMPARE_YEARS',
            'chartHideDataExport': false
        });
        var chart6 = new BasicHighStocksController(model6, view6).getData();
    }
    if ($("#amis_mm_p_chart_FPI_FPIM").length > 0) {
        var model6 = new MarketMonitorDomainModel('Price Index (by year)', '4', 'AMIS_MONTHLY_INDICATORS', 'AMIS-STATISTICS', ['FPIM'], null, 'amis-mm-compare-indicators');
        var view6 = new MarketMonitorChartView(model6, {
            'chartDivId': 'amis_mm_p_chart_FPI_FPIM',
            'chartSessionId': 'FPI_FPIM',
            'chartTimeFrame': '4y',
            'chartType': 'COMPARE_YEARS',
            'chartHideDataExport': false
        });
        var chart6 = new BasicHighStocksController(model6, view6).getData();
    }
    if ($("#amis_mm_p_chart_FPI_FPID").length > 0) {
        var model6 = new MarketMonitorDomainModel('Price Index (by year)', '4', 'AMIS_MONTHLY_INDICATORS', 'AMIS-STATISTICS', ['FPID'], null, 'amis-mm-compare-indicators');
        var view6 = new MarketMonitorChartView(model6, {
            'chartDivId': 'amis_mm_p_chart_FPI_FPID',
            'chartSessionId': 'FPI_FPID',
            'chartTimeFrame': '4y',
            'chartType': 'COMPARE_YEARS',
            'chartHideDataExport': false
        });
        var chart6 = new BasicHighStocksController(model6, view6).getData();
    }
    if ($("#amis_mm_p_chart_IGC").length > 0) {
        var model6 = new MarketMonitorDomainModel('IGC Grains and Oilseeds Index and sub-Indices', '5', 'AMIS_IGC_DAILY_INDICATORS', 'AMIS-STATISTICS', ['GOI', 'WPI', 'MPI', 'RPI', 'SPI'], null, 'amis-mm-other-indicators');
        var view6 = new MarketMonitorChartView(model6, {
            'chartDivId': 'amis_mm_p_chart_IGC',
            'chartSessionId': 'IGC',
            'chartHideDataExport': false
        });
        var chart = new BasicHighStocksController(model6, view6).getData();
    }
    //IGC Charts by Year
    if ($("#amis_mm_p_chart_IGC_GOI").length > 0) {
        var model6 = new MarketMonitorDomainModel('(by year)', '5', 'AMIS_IGC_DAILY_INDICATORS', 'AMIS-STATISTICS', ['GOI'], null, 'amis-mm-compare-indicators');
        var view6 = new MarketMonitorChartView(model6, {
            'chartDivId': 'amis_mm_p_chart_IGC_GOI',
            'chartSessionId': 'IGC_IGC',
            'chartTimeFrame': '4y',
            'chartType': 'COMPARE_YEARS',
            'chartHideDataExport': false
        });
        var chart = new BasicHighStocksController(model6, view6).getData();
    }
    if ($("#amis_mm_p_chart_IGC_WPI").length > 0) {
        var model6 = new MarketMonitorDomainModel('Sub-Index (by year)', '5', 'AMIS_IGC_DAILY_INDICATORS', 'AMIS-STATISTICS', ['WPI'], null, 'amis-mm-compare-indicators');
        var view6 = new MarketMonitorChartView(model6, {
            'chartDivId': 'amis_mm_p_chart_IGC_WPI',
            'chartSessionId': 'IGC_WPI',
            'chartTimeFrame': '4y',
            'chartType': 'COMPARE_YEARS',
            'chartHideDataExport': false
        });
        var chart = new BasicHighStocksController(model6, view6).getData();
    }
    if ($("#amis_mm_p_chart_IGC_MPI").length > 0) {
        var model6 = new MarketMonitorDomainModel('Sub-Index (by year)', '5', 'AMIS_IGC_DAILY_INDICATORS', 'AMIS-STATISTICS', ['MPI'], null, 'amis-mm-compare-indicators');
        var view6 = new MarketMonitorChartView(model6, {
            'chartDivId': 'amis_mm_p_chart_IGC_MPI',
            'chartSessionId': 'IGC_MPI',
            'chartTimeFrame': '4y',
            'chartType': 'COMPARE_YEARS',
            'chartHideDataExport': false
        });
        var chart = new BasicHighStocksController(model6, view6).getData();
    }
    if ($("#amis_mm_p_chart_IGC_RPI").length > 0) {
        var model6 = new MarketMonitorDomainModel('Sub-Index (by year)', '5', 'AMIS_IGC_DAILY_INDICATORS', 'AMIS-STATISTICS', ['RPI'], null, 'amis-mm-compare-indicators');
        var view6 = new MarketMonitorChartView(model6, {
            'chartDivId': 'amis_mm_p_chart_IGC_RPI',
            'chartSessionId': 'IGC_RPI',
            'chartTimeFrame': '4y',
            'chartType': 'COMPARE_YEARS',
            'chartHideDataExport': false
        });
        var chart = new BasicHighStocksController(model6, view6).getData();
    }
    if ($("#amis_mm_p_chart_IGC_SPI").length > 0) {
        var model6 = new MarketMonitorDomainModel('Sub-Index (by year)', '5', 'AMIS_IGC_DAILY_INDICATORS', 'AMIS-STATISTICS', ['SPI'], null, 'amis-mm-compare-indicators');
        var view6 = new MarketMonitorChartView(model6, {
            'chartDivId': 'amis_mm_p_chart_IGC_SPI',
            'chartSessionId': 'IGC_SPI',
            'chartTimeFrame': '4y',
            'chartType': 'COMPARE_YEARS',
            'chartHideDataExport': false
        });
        var chart = new BasicHighStocksController(model6, view6).getData();
    }
    if ($("#amis_mm_p_chart_2301").length > 0) {
        //var productsArray=new Array("2301","2302","2311", "2303");
        //var marketsArray=new Array("16","3","25", "4");
        //var model2 = new MarketMonitorDomainModel('International Prices', '6', 'EST_DATABASE', 'FAO-EST', ['2301', '2301', '2301'], ['16', '17', '44'], 'amis-mm-est-prices');
        var model2 = new MarketMonitorDomainModel('International Prices', '6', 'EST_DATABASE', 'FAO-EST', ['2301', '2301'], ['16', '17'], 'amis-mm-est-prices');
        var view2 = new MarketMonitorChartView(model2, {
            'chartDivId': 'amis_mm_p_chart_2301',
            'chartSessionId': '2301',
            'chartHideDataExport': false
        });
        var chart2 = new BasicHighStocksController(model2, view2).getData();
    }
    if ($("#amis_mm_p_chart_2302").length > 0) {
        var model3 = new MarketMonitorDomainModel('International Prices', '6', 'EST_DATABASE', 'FAO-EST', ['2302', '2302'], ['3', '44'], 'amis-mm-est-prices');
        var view3 = new MarketMonitorChartView(model3, {
            'chartDivId': 'amis_mm_p_chart_2302',
            'chartSessionId': '2302',
            'chartHideDataExport': false
        });
        var chart3 = new BasicHighStocksController(model3, view3).getData();
    }
    if ($("#amis_mm_p_chart_2311").length > 0) {
        var model4 = new MarketMonitorDomainModel('International Prices', '6', 'EST_DATABASE', 'FAO-EST', ['2311', '2311'], ['14', '25'], 'amis-mm-est-prices');
        var view4 = new MarketMonitorChartView(model4, {
            'chartDivId': 'amis_mm_p_chart_2311',
            'chartSessionId': '2311',
            'chartHideDataExport': false
        });
        var chart4 = new BasicHighStocksController(model4, view4).getData();
    }
    if ($("#amis_mm_p_chart_2303").length > 0) {
        var model5 = new MarketMonitorDomainModel('International Prices', '6', 'EST_DATABASE', 'FAO-EST', ['2303'], ['4'], 'amis-mm-est-prices');
        var view5 = new MarketMonitorChartView(model5, {
            'chartDivId': 'amis_mm_p_chart_2303',
            'chartSessionId': '2303',
            'chartHideDataExport': false
        });
        var chart5 = new BasicHighStocksController(model5, view5).getData();
    }
    if ($("#amis_mm_p_chart_WFSMA").length > 0) {
        var modelWFSMA = new MarketMonitorDomainModel('Wheat Futures Prices and Simple Moving Average', '10', 'AMIS_WHEAT_FUTURES_SMA_DAILY_INDICATORS', 'AMIS-STATISTICS', ['CMEW', 'CMEWSMA30', 'CMEWSMA60'], null, 'amis-mm-other-indicators');
        var viewWFSMA = new MarketMonitorChartView(modelWFSMA, {
            'chartDivId': 'amis_mm_p_chart_WFSMA',
            'chartSessionId': 'WFSMA',
            'chartHideDataExport': true,
            'chartEnableTooltip': false
        });
        var chartHVol = new BasicHighStocksController(modelWFSMA, viewWFSMA).getData();
    }
    if ($("#amis_mm_p_chart_SFSMA").length > 0) {
        var modelWFSMA = new MarketMonitorDomainModel('Soybean Futures Prices and Simple Moving Average', '10', 'AMIS_SOYBEAN_FUTURES_SMA_DAILY_INDICATORS', 'AMIS-STATISTICS', ['CMES', 'CMESSMA30', 'CMESSMA60'], null, 'amis-mm-other-indicators');
        var viewWFSMA = new MarketMonitorChartView(modelWFSMA, {
            'chartDivId': 'amis_mm_p_chart_SFSMA',
            'chartSessionId': 'SFSMA',
            'chartHideDataExport': true,
            'chartEnableTooltip': false
        });
        var chartHVol = new BasicHighStocksController(modelWFSMA, viewWFSMA).getData();
    }
    if ($("#amis_mm_p_chart_RFSMA").length > 0) {
        var modelWFSMA = new MarketMonitorDomainModel('Rice Futures Prices and Simple Moving Average', '10', 'AMIS_RICE_FUTURES_SMA_DAILY_INDICATORS', 'AMIS-STATISTICS', ['CMER', 'CMERSMA30', 'CMERSMA60'], null, 'amis-mm-other-indicators');
        var viewWFSMA = new MarketMonitorChartView(modelWFSMA, {
            'chartDivId': 'amis_mm_p_chart_RFSMA',
            'chartSessionId': 'RFSMA',
            'chartHideDataExport': true,
            'chartEnableTooltip': false
        });
        var chartHVol = new BasicHighStocksController(modelWFSMA, viewWFSMA).getData();
    }
    if ($("#amis_mm_p_chart_MFSMA").length > 0) {
        var modelWFSMA = new MarketMonitorDomainModel('Maize Futures Prices and Simple Moving Average', '10', 'AMIS_MAIZE_FUTURES_SMA_DAILY_INDICATORS', 'AMIS-STATISTICS', ['CMEM', 'CMEMSMA30', 'CMEMSMA60'], null, 'amis-mm-other-indicators');
        var viewWFSMA = new MarketMonitorChartView(modelWFSMA, {
            'chartDivId': 'amis_mm_p_chart_MFSMA',
            'chartSessionId': 'MFSMA',
            'chartHideDataExport': true,
            'chartEnableTooltip': false
        });
        var chartHVol = new BasicHighStocksController(modelWFSMA, viewWFSMA).getData();
    }
    //Compare By Year Chart
    if ($("#amis_mm_p_chart_WFSMA_COMPARE").length > 0) {
        var modelWFSMA = new MarketMonitorDomainModel('(by year)', '10', 'AMIS_WHEAT_FUTURES_SMA_DAILY_INDICATORS', 'AMIS-STATISTICS', ['CMEW'], null, 'amis-mm-compare-indicators');
        var viewWFSMA = new MarketMonitorChartView(modelWFSMA, {
            'chartDivId': 'amis_mm_p_chart_WFSMA_COMPARE',
            'chartSessionId': 'WFSMA_COMPARE',
            'chartTimeFrame': '4y',
            'chartType': 'COMPARE_YEARS',
            'chartHideDataExport': true
        });
        var chartHVol = new BasicHighStocksController(modelWFSMA, viewWFSMA).getData();
    }
}

function loadStocksPage() {
    var model = new MarketMonitorDomainModel('Stocks and Ratios', '6', 'AMIS', 'AMIS-STATISTICS', ['1'], null, 'amis-mm-stocks-and-ratios');
    var view = new MarketMonitorChartView(model, {
        'chartDivId': 'amis_mm_stu_chart_1',
        'chartSessionId': '1',
        'chartHideDataExport': false
    });
    var chart1 = new StocksAndRatiosController(model, view).getData();
    //var productsArray=new Array("2301","2302","2311", "2303");
    //var marketsArray=new Array("16","3","25", "4");
    var model2 = new MarketMonitorDomainModel('Stocks and Ratios', '6', 'AMIS', 'AMIS-STATISTICS', ['5'], null, 'amis-mm-stocks-and-ratios');
    var view2 = new MarketMonitorChartView(model2, {
        'chartDivId': 'amis_mm_stu_chart_5',
        'chartSessionId': '5',
        'chartHideDataExport': false
    });
    var chart2 = new StocksAndRatiosController(model2, view2).getData();
    var model3 = new MarketMonitorDomainModel('Stocks and Ratios', '6', 'AMIS', 'AMIS-STATISTICS', ['4'], null, 'amis-mm-stocks-and-ratios');
    var view3 = new MarketMonitorChartView(model3, {
        'chartDivId': 'amis_mm_stu_chart_4',
        'chartSessionId': '4',
        'chartHideDataExport': false
    });
    var chart3 = new StocksAndRatiosController(model3, view3).getData();
    var model4 = new MarketMonitorDomainModel('Stocks and Ratios', '6', 'AMIS', 'AMIS-STATISTICS', ['6'], null, 'amis-mm-stocks-and-ratios');
    var view4 = new MarketMonitorChartView(model4, {
        'chartDivId': 'amis_mm_stu_chart_6',
        'chartSessionId': '6',
        'chartHideDataExport': false
    });
    var chart4 = new StocksAndRatiosController(model4, view4).getData();
}

function loadOilFreightsEthanolPage() {
    if ($("#amis_mm_ofe_chart_OFI").length > 0) {
        var model = new MarketMonitorDomainModel('Ocean Freight Indices', '8', 'AMIS_OCEAN_FREIGHTS_ETHANOL_DAILY_INDICATORS', 'AMIS-STATISTICS', ['BDI', 'BHI', 'BPI'], null, 'amis-mm-other-indicators');
        var view = new MarketMonitorChartView(model, {
            'chartDivId': 'amis_mm_ofe_chart_OFI',
            'chartSessionId': 'OFI',
            'chartHideDataExport': true,
            'chartEnableTooltip': false
        });
        var chart1 = new BasicHighStocksController(model, view).getData();
    }
    if ($("#amis_mm_ofe_chart_EFP").length > 0) {
        var model2 = new MarketMonitorDomainModel('Chicago Ethanol Futures Prices', '9', 'AMIS_OCEAN_FREIGHTS_ETHANOL_DAILY_INDICATORS', 'AMIS-STATISTICS', ['EFP'], null, 'amis-mm-other-indicators');
        var view2 = new MarketMonitorChartView(model2, {
            'chartDivId': 'amis_mm_ofe_chart_EFP',
            'chartSessionId': 'EFP',
            'chartHideDataExport': true,
            'chartEnableTooltip': false
        });
        var chartFO = new BasicHighStocksController(model2, view2).getData();
    }
    //Compare By Year Charts
    if ($("#amis_mm_ofe_chart_OFI_BDI").length > 0) {
        var model = new MarketMonitorDomainModel('(by year)', '8', 'AMIS_OCEAN_FREIGHTS_ETHANOL_DAILY_INDICATORS', 'AMIS-STATISTICS', ['BDI'], null, 'amis-mm-compare-indicators');
        var view = new MarketMonitorChartView(model, {
            'chartDivId': 'amis_mm_ofe_chart_OFI_BDI',
            'chartSessionId': 'OFI_BDI',
            'chartTimeFrame': '4y',
            'chartHideDataExport': true,
            'chartType': 'COMPARE_YEARS',
            'chartEnableTooltip': false
        });
        var chart1 = new BasicHighStocksController(model, view).getData();
    }
    if ($("#amis_mm_ofe_chart_OFI_BHI").length > 0) {
        var model = new MarketMonitorDomainModel('(by year)', '8', 'AMIS_OCEAN_FREIGHTS_ETHANOL_DAILY_INDICATORS', 'AMIS-STATISTICS', ['BHI'], null, 'amis-mm-compare-indicators');
        var view = new MarketMonitorChartView(model, {
            'chartDivId': 'amis_mm_ofe_chart_OFI_BHI',
            'chartSessionId': 'OFI_BHI',
            'chartTimeFrame': '4y',
            'chartHideDataExport': true,
            'chartType': 'COMPARE_YEARS',
            'chartEnableTooltip': false
        });
        var chart1 = new BasicHighStocksController(model, view).getData();
    }
    if ($("#amis_mm_ofe_chart_OFI_BPI").length > 0) {
        var model = new MarketMonitorDomainModel('(by year)', '8', 'AMIS_OCEAN_FREIGHTS_ETHANOL_DAILY_INDICATORS', 'AMIS-STATISTICS', ['BPI'], null, 'amis-mm-compare-indicators');
        var view = new MarketMonitorChartView(model, {
            'chartDivId': 'amis_mm_ofe_chart_OFI_BPI',
            'chartSessionId': 'OFI_BPI',
            'chartTimeFrame': '4y',
            'chartHideDataExport': true,
            'chartType': 'COMPARE_YEARS',
            'chartEnableTooltip': false
        });
        var chart1 = new BasicHighStocksController(model, view).getData();
    }
}

function loadFREDPage() {
    if ($("#amis_mm_fred_chart_COP").length > 0) {
        var model = new MarketMonitorDomainModel('Crude Oil Prices', '2', 'FRED', 'FRED', ['MCOILWTICO', 'MCOILBRENTEU'], null, null);
        var view = new MarketMonitorChartView(model, {
            'chartDivId': 'amis_mm_fred_chart_COP',
            'chartSessionId': 'COP',
            'chartHideDataExport': false
        });
        var chart1 = new BasicHighStocksController(model, view).getData();
    }
    if ($("#amis_mm_fred_chart_DI").length > 0) {
        var model = new MarketMonitorDomainModel('Dollar Indices', '1', 'FRED', 'FRED', ['TWEXMPA', 'TWEXBPA'], null, null);
        var view = new MarketMonitorChartView(model, {
            'chartDivId': 'amis_mm_fred_chart_DI',
            'chartSessionId': 'DI',
            'chartHideDataExport': false
        });
        var chart1 = new BasicHighStocksController(model, view).getData();
    }
}

function loadDomainJSScript(url) {
    chart_script_tag = document.createElement('script');
    chart_script_tag.setAttribute("type", "text/javascript");
    chart_script_tag.setAttribute("src", url);
    // Try to find the head, otherwise default to the documentElement
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(chart_script_tag);
}
//}
//else {
// }