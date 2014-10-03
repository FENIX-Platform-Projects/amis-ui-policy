function fx_viewwidget( baseOptions ) {

    //Inner options of fx_viewwidget
    var o = {};
    var $container, $fragments, $d, I18NLang;
    
    //Default options for the Widget Configuration
    var defaultOptions = {
        widgtet_name            : 'fx_viewwidget',
        html_base               : 'html/widgets/fx_viewwidget_fragments.html',
        s_base                  : '.fx-widget',
        s_tab_metadata_content  : '#metadatatab',
        s_tab_table_content     : '#tabletab',
        e_base                  : '.widget.fenix',
        //Multilanguage
        default_lang            : 'EN',
        file_labels             : 'fx_viewwidget',
        path_labels             : 'labels/widgets/fx_viewwidget/'
    };

    $.extend(true, o, defaultOptions);
    $.extend(true, o, baseOptions);

    function render( options ) {

        $.extend(true, o, options);

        if (!o.container) alert('Impossible to display data. Please selet a container for fx_viewwidget.js');
        if (!o.json) alert('Impossible to display data. Please specify a JSON source for fx_viewwidget.js');
        
        $container  = $(o.container);
        $container.empty();

        o.lang ? o.lang = o.lang.toUpperCase() : o.default_lang.toUpperCase();
        
        switch (o.lang ) {
        case 'IT'   : I18NLang = 'it'; break;
        case 'FR'   : I18NLang = 'fr'; break;
        case 'ES'   : I18NLang = 'es'; break;
        default     : I18NLang = 'en'; break;
        }

        loadstructure();
        
        //Uncomment to load external labels
        //Callback loads grid HTML base and initialize the elements
        /*$.i18n.properties({
            name    : o.file_labels, 
            path    : o.path_labels, 
            mode    :'both',
            language: I18NLang, 
            callback: loadstructure
        });
        */    
    };

    function loadstructure() {

        $.get(o.html_base, function( d ) {

            /* cache the loaded file to use it to create list's item */
            $fragments = $(d);

            $d = $fragments.find(o.s_base).clone();
            generateDynamicId($d);
            $container.html($d);

            initWidgetControlBtns($d);
            initTabControlBtns($d)
            initTabs();

            //raiseCustomEvent(document.body, "loadcompleted.widget.fenix", {id: widget_name});      
        
        }, 'html').error('Impossible to load HTML for fx_viewwidget');
    
    };

    function initTabs(){

        initMetatadaTab();
        initTableTab();
        initCharts();
        initMapTab();

        function initMetatadaTab(){ 
            
            $('#metadata-'+fx_dynamic_id_counter).html($fragments.find(o.s_tab_metadata_content).clone());
        
        };
        
        function initMapTab(){

            o.map = App.init('fenix-map-' + window.fx_dynamic_id_counter);

            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                //TODO Optimize
                //refresh map
                o.map.invalidateSize();
                //refresh table
                $('#fx-widget-table-content-'+ window.fx_dynamic_id_counter).jqxGrid('refresh');
            })
        };

        function initTableTab(){ 

            var theme   = '';
            var data    = '[{"year":"1995","crops":"Beans, dry","value":"2,338,145.00"},{"year":"1995","crops":"Cassava","value":"13,831,390.00"},{"year":"1995","crops":"Cotton Lint","value":"480,410.00"},{"year":"1995","crops":"Groundnut","value":"3,092,350.00"},{"year":"1995","crops":"Maize","value":"5,120,700.00"},{"year":"1995","crops":"Melon","value":"287,250.00"},{"year":"1995","crops":"Millet","value":"7,271,230.00"},{"year":"1995","crops":"Rice","value":"1,994,017.00"},{"year":"1995","crops":"Sorghum","value":"6,329,910.00"},{"year":"1995","crops":"Taro (Cococyam)","value":"1,560,450.00"},{"year":"1995","crops":"Yam","value":"23,395,754.00"},{"year":"1996","crops":"Beans, dry","value":"2,338,145.00"},{"year":"1996","crops":"Cassava","value":"13,831,390.00"},{"year":"1996","crops":"Cotton Lint","value":"480,410.00"},{"year":"1996","crops":"Groundnut","value":"3,092,350.00"},{"year":"1996","crops":"Maize","value":"5,120,700.00"},{"year":"1996","crops":"Melon","value":"287,250.00"},{"year":"1996","crops":"Millet","value":"7,271,230.00"},{"year":"1996","crops":"Rice","value":"1,994,017.00"},{"year":"1996","crops":"Sorghum","value":"6,329,910.00"},{"year":"1996","crops":"Taro (Cococyam)","value":"1,560,450.00"},{"year":"1996","crops":"Yam","value":"23,395,754.00"},{"year":"1997","crops":"Beans, dry","value":"2,338,145.00"},{"year":"1997","crops":"Cassava","value":"13,831,390.00"},{"year":"1997","crops":"Cotton Lint","value":"480,410.00"},{"year":"1997","crops":"Groundnut","value":"3,092,350.00"},{"year":"1997","crops":"Maize","value":"5,120,700.00"},{"year":"1997","crops":"Melon","value":"287,250.00"},{"year":"1997","crops":"Millet","value":"7,271,230.00"},{"year":"1997","crops":"Rice","value":"1,994,017.00"},{"year":"1997","crops":"Sorghum","value":"6,329,910.00"},{"year":"1997","crops":"Taro (Cococyam)","value":"1,560,450.00"},{"year":"1997","crops":"Yam","value":"23,395,754.00"}]';
            // prepare the data
            var source = {
                datatype: "json",
                datafields: [
                    { name: 'year', type: 'string'},
                    { name: 'crops', type: 'string'},
                    { name: 'value', type: 'string'}
                ],
                localdata: data
            };
            var dataAdapter = new $.jqx.dataAdapter(source);
            $('#fx-widget-table-content-'+ window.fx_dynamic_id_counter).jqxGrid({
                width: '100%',
                height: 350,
                source: dataAdapter,
                showfilterrow: true,
                filterable: true,
                source: dataAdapter,
                theme: theme,
                columnsresize: true,
                columns: [
                    { text: 'Year', datafield: 'year', width: '33%'},
                    { text: 'Crops', datafield: 'crops', width: '33%'},
                    { text: 'Value', datafield: 'value', width: '34%'}
                ]
            });

            document.body.addEventListener("resize.widget.fenix", function(event){
                $('#fx-widget-table-content-'+ window.fx_dynamic_id_counter).jqxGrid('refresh');
            }, false);
        };
        
        function initCharts(){

            o.container.addEventListener("changecharttype"+o.e_base, function(event){

                //Stop propagation to allow multiple widgets in the same page
                event.stopImmediatePropagation();
                
                switch(event.detail.type){
                    case 'columns'  : renderColumnsChart(); break;
                    case 'bars'     : renderBarsChart(); break;
                    case 'lines'    : renderLinesChart(); break;
                    case 'pie'      : renderPieChart(); break;
                }

                function renderColumnsChart(){

                    $d.find('#columnchart-content').highcharts({
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Stacked column chart'
                        },
                        xAxis: {
                            categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Total fruit consumption'
                            },
                            stackLabels: {
                                enabled: true,
                                style: {
                                    fontWeight: 'bold',
                                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                                }
                            }
                        },
                        legend: {
                            align: 'right',
                            x: -70,
                            verticalAlign: 'top',
                            y: 20,
                            floating: true,
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
                            borderColor: '#CCC',
                            borderWidth: 1,
                            shadow: false
                        },
                        tooltip: {
                            formatter: function() {
                                return '<b>'+ this.x +'</b><br/>'+
                                    this.series.name +': '+ this.y +'<br/>'+
                                    'Total: '+ this.point.stackTotal;
                            }
                        },
                        plotOptions: {
                            column: {
                                stacking: 'normal',
                                dataLabels: {
                                    enabled: true,
                                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                                }
                            }
                        },
                        series: [{
                            name: 'John',
                            data: [5, 3, 4, 7, 2]
                        }, {
                            name: 'Jane',
                            data: [2, 2, 3, 2, 1]
                        }, {
                            name: 'Joe',
                            data: [3, 4, 4, 2, 5]
                        }]
                    
                    });
                
                };

                function renderBarsChart(){
                    
                    $d.find('#barchart-content').highcharts({
                        chart: {
                            type: 'bar'
                        },
                        title: {
                            text: 'Historic World Population by Region'
                        },
                        subtitle: {
                            text: 'Source: Wikipedia.org'
                        },
                        xAxis: {
                            categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
                            title: {
                                text: null
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Population (millions)',
                                align: 'high'
                            },
                            labels: {
                                overflow: 'justify'
                            }
                        },
                        tooltip: {
                            valueSuffix: ' millions'
                        },
                        plotOptions: {
                            bar: {
                                dataLabels: {
                                    enabled: true
                                }
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'top',
                            x: -40,
                            y: 100,
                            floating: true,
                            borderWidth: 1,
                            backgroundColor: '#FFFFFF',
                            shadow: true
                        },
                        credits: {
                            enabled: false
                        },
                        series: [{
                            name: 'Year 1800',
                            data: [107, 31, 635, 203, 2]
                        }, {
                            name: 'Year 1900',
                            data: [133, 156, 947, 408, 6]
                        }, {
                            name: 'Year 2008',
                            data: [973, 914, 4054, 732, 34]
                        }]
                    });
                
                };

                function renderLinesChart(){

                    $d.find('#linechart-content').highcharts({
                        chart: {
                            type: 'line'
                        },
                        title: {
                            text: 'Monthly Average Temperature'
                        },
                        subtitle: {
                            text: 'Source: WorldClimate.com'
                        },
                        xAxis: {
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                        },
                        yAxis: {
                            title: {
                                text: 'Temperature (°C)'
                            }
                        },
                        tooltip: {
                            enabled: false,
                            formatter: function() {
                                return '<b>'+ this.series.name +'</b><br/>'+
                                    this.x +': '+ this.y +'°C';
                            }
                        },
                        plotOptions: {
                            line: {
                                dataLabels: {
                                    enabled: true
                                },
                                enableMouseTracking: false
                            }
                        },
                        series: [{
                            name: 'Tokyo',
                            data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                        }, {
                            name: 'London',
                            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                        }]
                    });
                
                };

                function renderPieChart(){
                    
                    $d.find('#piechart-content').highcharts({
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false
                        },
                        title: {
                            text: 'Browser market shares at a specific website, 2010'
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    color: '#000000',
                                    connectorColor: '#000000',
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                                }
                            }
                        },
                        series: [{
                            type: 'pie',
                            name: 'Browser share',
                            data: [
                                ['Firefox',   45.0],
                                ['IE',       26.8],
                                {
                                    name: 'Chrome',
                                    y: 12.8,
                                    sliced: true,
                                    selected: true
                                },
                                ['Safari',    8.5],
                                ['Opera',     6.2],
                                ['Others',   0.7]
                            ]
                        }]
                    });
                
                };

            }, false);
        
        };
    
    };

    function initTabControlBtns( e ){

        $(e).find('[aria-labelledby="charts-drop"] li').each(function(i, item){
            $(item).on('click', function(){
                raiseCustomEvent(item, "changecharttype"+o.e_base, {type : $(this).data('charttype')});
            });
        });

    };

    function initWidgetControlBtns( e ){

        $(e).find('#fx-viewwidget-btn-remove-' + window.fx_dynamic_id_counter).click(function(){
            raiseCustomEvent(this, "remove"+o.e_base, {widget: $container, json: o.json});
        });

        $(e).find('#fx-viewwidget-btn-resize-'+ window.fx_dynamic_id_counter).click(function(){
            raiseCustomEvent(this, "resize"+o.e_base, {widget: o.container, json: o.json});
            o.map.invalidateSize()
        });

        $(e).find('#fx-viewwidget-btn-minimize-'+ window.fx_dynamic_id_counter).click(function(){
            raiseCustomEvent(this, "minimize"+o.e_base, {widget: $container, json: o.json});
        });

        /*
        $(e).find('#fx-viewwidget-btn-pin-'+ window.fx_dynamic_id_counter).click(function(){
            pin ? pin = false : pin = true;
        });
        */

        $(e).find('#fx-viewwidget-btn-clone-'+ window.fx_dynamic_id_counter).click(function(){
            raiseCustomEvent(this, "clone"+o.e_base, {widget: $container, json: o.json});
        });
    
    };

    return { render : render };

};