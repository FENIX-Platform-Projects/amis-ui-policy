var ap_downloaddata = (function() {

    var CONFIG = {
        placeholderID   :   null,
        lang            :   null,
        lang_ISO2       :   null,
        domainCode      :   null,
        tabsPerRow      :   2,
        limit           :   20,
        theme           :   'faostat',
        datasource      :   'faostatproddiss',
        listboxes_url   :   'http://fenixapps.fao.org/wds/rest/procedures/listboxes',
        codelist_url    :   'http://fenixapps.fao.org/wds/rest/procedures/',
        data_url        :   'http://fenixapps.fao.org/wds/rest/procedures/data',
        bulk_url        :   'http://faostat3.fao.org/wds/rest/bulkdownloads',
        bulk_root       :   'http://faostat.fao.org/Portals/_Faostat/Downloads/zip_files/',
        years_url       :   'http://faostat3.fao.org/wds/rest/procedures/years',
        procedures_url  :   'http://faostat3.fao.org/wds/rest/procedures',
        I18N_prefix     :   '',
        yearsMode       :   'slider'
    };

    function init(){
        buildUI({"placeholderID" : "placeholder", "lang" : "E", "domainCode" : "QC"});
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

        /* Initiate Bootstrap. */
        $('#' + CONFIG.placeholderID).append("<div class='container' id='" + CONFIG.placeholderID + "_container'></div>");
        $('#' + CONFIG.placeholderID).append("<div class='container' id='" + CONFIG.placeholderID + "_options'></div>");
        $('#' + CONFIG.placeholderID).append("<div class='container' id='" + CONFIG.placeholderID + "_output'></div>");

        /* Add placeholder to the page. */
        $('#' + CONFIG.placeholderID + '_container').append(buildUIStructure());

        /* Build bulk downloads. */
        populateBulkDownloads();

        /* Query DB and build structure. */
        getDomainStructure();

        /* Build options. */
        buildOptions();

        /* Build output. */
        buildOutput();

    }

    function preview() {
        $('#option_1').find('option:selected').each(function(k, v) {
            switch ($(v).data('code')) {
                case 'table': return previewTable();
                case 'pivot': return previewPivot();
            }
        });
    };

    function previewTable() {

        /* Show loading bar. */
        var load = "<img src='img/loadingbar.gif'>";
        document.getElementById('output_placeholder').innerHTML = load;

        var data = {};
        var payload = {
            "datasource"        : CONFIG.datasource,
            "domainCode"        : CONFIG.domainCode,
            "lang"              : CONFIG.lang,
            "areaCodes"         : collectUserSelection('memory_ListBox1'),
            "itemCodes"         : collectUserSelection('memory_ListBox2'),
            "elementListCodes"  : collectUserSelection('memory_ListBox3'),
            "years"             : collectUserSelectionYears(),
            "flags"             : $('#checkbox1').val(),
            "codes"             : $('#checkbox2').val(),
            "units"             : $('#checkbox3').val(),
            "nullValues"        : $('#checkbox4').val(),
            "thousandSeparator" : $('#option_3').find('option:selected').val(),
            "decimalSeparator"  : $('#option_2').find('option:selected').val(),
            "decimalPlaces"     : parseFloat($('#option_4').find('option:selected').val()),
            "limit"             : CONFIG.limit
        };
        data.payload = JSON.stringify(payload);

        $.ajax({

            type : 'POST',
            url : 'http://faostat3.fao.org/wds/rest/procedures/data',
            data : data,

            success : function(response) {

                /* Convert the response in an object, i fneeded. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);

                /* Create the output. */
                var s = "";
                s += "<div class='compare-label'>Please note that the preview is limited to " + CONFIG.limit + " rows.</div>";
                s += "<div class='table-responsive'>";
                s += "<table class='table table-bordered table-condensed' style='width: 100%;'>";

                /* Create table headers. */
                s += buildPreviewTableHeaders();

                /* Create table content. */
                s += "<tbody>";
                for (var i = 0 ; i < json.length ; i++) {
                    s += "<tr>";
                    for (var j = 1 ; j < json[i].length ; j++)
                        s += "<td>" + json[i][j] + "</td>";
                    s += "</tr>";
                }

                /* Close the table. */
                s += "</tbody>";
                s += "</table>";
                s += "</div>";

                /* Add the output to the main page. */
                document.getElementById('output_placeholder').innerHTML = s;

            },

            error : function(err, b, c) {
                console.log(err);
                console.log(b);
                console.log(c);
            }

        });

    }

    function collectUserSelectionYears() {
        var a = [];
        switch (CONFIG.yearsMode) {
            case 'classic' :
                $('#memory_years').find('option:selected').each(function(k, v) {
                    a.push($(v).data('gaul'));
                });
                break;
            case 'slider' :
                var min = parseFloat(document.getElementById('yearMin').innerHTML);
                var max = parseFloat(document.getElementById('yearMax').innerHTML);
                for (var i = min ; i <= max ; i++)
                    a.push(i);
                break;
        }
        return a;
    }

    function collectUserSelection(listboxID) {
        var a = [];
        $('#' + listboxID).find('option:selected').each(function(k, v) {
            a.push($(v).data('gaul'));
        });
        return a;
    }

    function buildPreviewTableHeaders() {
        var showCodes = $('#checkbox2').val();
        var showUnits = $('#checkbox3').val();
        var showFlag = $('#checkbox1').val();
        var s = "";
        s += "<thead>";
        s += "<tr>";
        s += "<th>" + $.i18n.prop('_domain') + "</th>";
        s += "<th>" + $.i18n.prop('_area') + "</th>";
        if (showCodes)
            s += "<th>" + $.i18n.prop('_area_code') + "</th>";
        s += "<th>" + $.i18n.prop('_item') + "</th>";
        if (showCodes)
            s += "<th>" + $.i18n.prop('_item_code') + "</th>";
        s += "<th>" + $.i18n.prop('_element') + "</th>";
        if (showCodes)
            s += "<th>" + $.i18n.prop('_element_code') + "</th>";
        s += "<th>" + $.i18n.prop('_year') + "</th>";
        if (showUnits)
            s += "<th>" + $.i18n.prop('_unit') + "</th>";
        s += "<th>" + $.i18n.prop('_value') + "</th>";
        if (showFlag)
            s += "<th>" + $.i18n.prop('_flag') + "</th>";
        s += "</tr>";
        s += "</thead>";
        return s;
    }

    function previewPivot() {

    }

    function download() {
        $('#option_1').find('option:selected').each(function(k, v) {
            switch ($(v).data('code')) {
                case 'table': return downloadTable();
                case 'pivot': return downloadPivot();
            }
        });
    }

    function buildOutput() {

        /* Initiate HTML. */
        var s = "";

        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
        s += "<div class='standard-title'>" + $.i18n.prop('_output') + "</div>";
        s += "<hr  class='standard-hr'>";
        s += "<div id='output_placeholder'></div>";
        s += "</div>";
        s += "</div>";

        /* Append HTML to the structure. */
        $('#' + CONFIG.placeholderID + '_output').append(s);

    }

    function buildOptions() {

        /* Initiate HTML. */
        var s = "";

        /* Options label. */
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
        s += "<div class='standard-title'>" + $.i18n.prop('_options') + "</div>";
        s += "<hr  class='standard-hr'>";
        s += "</div>";
        s += "</div>";

        /* 1st line. */
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-3 col-lg-3'>";
        s += "<div class='compare-label'>" + $.i18n.prop('_output_type') + "</div>";
        s += "<select id='option_1' class='chosen-select' style='width: 100%;'>";
        s += "<option data-code='table' selected='selected'>" + $.i18n.prop('_table') + "</option>";
        s += "<option data-code='pivot'>" + $.i18n.prop('_pivot') + "</option>";
        s += "</select>";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-3 col-lg-3'>";
        s += "<div class='compare-label'>" + $.i18n.prop('_decimal_separator') + "</div>";
        s += "<select id='option_2' class='chosen-select' style='width: 100%;'>";
        s += "<option value=',' data-code=',' selected='selected'>" + $.i18n.prop('_period') + "</option>";
        s += "<option value='.' data-code='.'>" + $.i18n.prop('_comma') + "</option>";
        s += "</select>";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-3 col-lg-3'>";
        s += "<div class='compare-label'>" + $.i18n.prop('_thousand_separator') + "</div>";
        s += "<select id='option_3' class='chosen-select' style='width: 100%;'>";
        s += "<option value=',' data-code=',' selected='selected'>" + $.i18n.prop('_comma') + "</option>";
        s += "<option value='.' data-code='.'>" + $.i18n.prop('_period') + "</option>";
        s += "</select>";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-3 col-lg-3'>";
        s += "<div class='compare-label'>" + $.i18n.prop('_decimal_numbers') + "</div>";
        s += "<select id='option_4' class='chosen-select' style='width: 100%;'>";
        s += "<option value='0' data-code='0'>0</option>";
        s += "<option value='1' data-code='1'>1</option>";
        s += "<option value='2' data-code='2' selected='selected'>2</option>";
        s += "<option value='3' data-code='3'>3</option>";
        s += "<option value='4' data-code='4'>4</option>";
        s += "</select>";
        s += "</div>";
        s += "</div>";
        s += "<br>";

        /* 2nd line. */
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-3 col-lg-3'>";
        s += "<div class='compare-label' id='checkbox1'>" + $.i18n.prop('_show_flags') + "</div>";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-3 col-lg-3'>";
        s += "<div class='compare-label' id='checkbox2'>" + $.i18n.prop('_show_codes') + "</div>";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-3 col-lg-3'>";
        s += "<div class='compare-label' id='checkbox3'>" + $.i18n.prop('_show_units') + "</div>";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-3 col-lg-3'>";
        s += "<div class='compare-label' id='checkbox4'>" + $.i18n.prop('_show_null_values') + "</div>";
        s += "</div>";
        s += "</div>";
        s += "<br>";

        /* Output buttons. */
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-8 col-lg-8'>";
        s += "&nbsp;";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-2 col-lg-2'>";
        s += "<button class='btn btn-sm btn-primary' type='button' style='width: 100%;' onclick='ap_downloaddata.preview();'>";
        s += "<span class='glyphicon glyphicon-eye-open'></span>";
        s += " " + $.i18n.prop('_preview');
        s += "</button>";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-2 col-lg-2'>";
        s += "<button class='btn btn-sm btn-primary' type='button' style='width: 100%;' onclick='ap_downloaddata.download();'>";
        s += "<span class='glyphicon glyphicon-arrow-down'></span>";
        s += " " + $.i18n.prop('_download');
        s += "</button>";
        s += "</div>";
        s += "</div>";

        /* Append HTML to the structure. */
        $('#' + CONFIG.placeholderID + '_options').append(s);

        /* Initiate check-boxes. */
        $('#checkbox1').jqxCheckBox({checked : false, theme: CONFIG.theme});
        $('#checkbox2').jqxCheckBox({checked : false, theme: CONFIG.theme});
        $('#checkbox3').jqxCheckBox({checked : false, theme: CONFIG.theme});
        $('#checkbox4').jqxCheckBox({checked : true, theme: CONFIG.theme});
    }

    function getDomainStructure() {

        /* Retrive UI structure from DB. */
        $.ajax({

            type: 'GET',
            url: CONFIG.listboxes_url + '/' + CONFIG.datasource + '/' + CONFIG.domainCode + '/' + CONFIG.lang,

            success : function(response) {

                /* Convert the response in an object, i fneeded. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);

                /* Initiate variables. */
                var current = json[0][0];
                var tabs = [];
                var tabsCollection = {};

                /* Iterate over the response to create the tabs. */
                for (var i = 0 ; i < json.length ; i++) {
                    if (json[i][0] == current) {
                        tabs.push(json[i]);
                    } else {
                        tabsCollection[current] = tabs;
                        current = json[i][0];
                        tabs = [];
                        tabs.push(json[i]);
                    }
                }
                tabsCollection[current] = tabs;

                /* Build tabs. */
                $.each(tabsCollection, function(k, v) {
                    buildTab(k, v);
                })

                /* Initiate Chosen plugin. */
                $('.chosen-select').chosen({
                    no_results_text: $.i18n.prop('_nothing_found'),
                    disable_search_threshold: 10
                });

            },

            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }

        });

    }

    function buildTab(listboxID, payload) {
        if (payload[0][1].indexOf('Years') > -1) {
            buildYearTab(listboxID, payload);
        } else {
            buildStandardTab(listboxID, payload);
        }
    }

    function buildStandardTab(listboxID, payload) {

        /* Initiate the variable. */
        var s = "";

        /* Build the UI. */
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
        s += "<div class='codelistType'>";

        /* Build tab headers. */
        for (var i = 0 ; i < payload.length ; i++) {
            var c = (i == 0) ? 'checked="checked"' : '';
            s += "<input onclick='populateStandardTab(\"" + listboxID + "\", \"" + payload[i][3] + "\");' type='radio' " + c + " value='" + payload[i][3] + "' name='radios_" + listboxID + "' id='" + payload[i][3] + "'>";
            s += "<label for='" + payload[i][3] + "' id='" + payload[i][3] + "_label'>" + payload[i][1] + "</label>";
            if (i < payload.length - 1)
                s += " | ";
        }

        s += "</div>";
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-8 col-lg-8'>";
        s += "<select data-placeholder='" + $.i18n.prop('_' + listboxID) + "' id='selection_" + listboxID + "' multiple='' class='chosen-select' style='width: 100%;'>";
        s += "</select>";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-2 col-lg-2'>";
        s += "<button id='" + listboxID + "_select_all' onclick='selectAll(\"" + 'memory_' + listboxID + "\");' style='width: 100%;' type='button' class='btn btn-sm btn-primary'>";
        s += "<span class='glyphicon glyphicon-ok'></span> " + $.i18n.prop('_select_all');
        s += "</button>";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-2 col-lg-2'>";
        s += "<button style='width: 100%;' type='button' class='btn btn-sm btn-danger'>";
        s += "<span class='glyphicon glyphicon-remove'></span> " + $.i18n.prop('_clear_selection');
        s += "</button>";
        s += "</div>";
        s += "</div>";
        s += "</div>";
        s += "<div style='height: 8px;'></div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
        s += "<select data-placeholder='" +  $.i18n.prop('_your_selection') + "' id='memory_" + listboxID + "' multiple='' class='chosen-select' style='width: 100%;'></select>";
        s += "</div>";
        s += "</div>";
        s += "<br>";

        /* Append it to the document. */
        $('#' + CONFIG.placeholderID + '_container').append(s);

        /* Populate the select. */
        populateStandardTab(listboxID, payload[0][3]);
    }

    function populateStandardTab(listboxID, procedureName) {

        var rest = null;
        switch (procedureName) {
            case 'usp_GetAreaList1'     : rest = 'countries';       break;
            case 'usp_GetAreaList2'     : rest = 'regions';         break;
            case 'usp_GetAreaList3'     : rest = 'specialgroups';   break;
            case 'usp_GetItemList1'     : rest = 'items';           break;
            case 'usp_GetItemList2'     : rest = 'itemsaggregated'; break;
            case 'usp_GetElementList'   : rest = 'elements';        break;
        }

        /* Retrieve years from DB. */
        $.ajax({

            type: 'GET',
            url: CONFIG.procedures_url + '/' + rest + '/' + CONFIG.datasource + '/' + CONFIG.domainCode + '/' + CONFIG.lang,

            success : function(response) {

                /* Convert the response in an object, i fneeded. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);

                /* Clear selection list. */
                document.getElementById('selection_' + listboxID).innerHTML = '';

                /* Populate select. */
                for (var i = 0 ; i < json.length ; i++) {
                    var c = json[i][0];
                    var l = json[i][1];
                    var t = json[i][3];
                    var s = "<option data-label='" + l + "' data-gaul='" + c + "' data-type='" + t + "'>" + l + "</option>";
                    $('#selection_' + listboxID).append(s);
                }
                $('#selection_' + listboxID).attr('data-placeholder', $.i18n.prop(procedureName));
                $('#selection_' + listboxID).trigger('chosen:updated');

                /* Add 'memory' control. */
                memoryController('selection_' + listboxID, 'memory_' + listboxID, false);

                /* Override buttons. */
                $('#' + listboxID + '_select_all').removeAttr('onclick');
//                $('#' + listboxID + '_select_all').bind('click', function() {
//                    FDW.selectAll(procedureName);
//                });

            },

            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }

        });

    }

    function buildYearTab(listboxID, payload) {

        /* Initiate the variable. */
        var s = "";

        /* Build the UI. */
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
        s += "<div class='codelistType'>";

        /* Build tab headers. */
        for (var i = 0 ; i < payload.length ; i++) {
            var c = (i == 0) ? 'checked="checked"' : '';
            s += "<input type='radio' " + c + " value='" + payload[i][3] + "_slider' name='radios_" + listboxID + "' id='" + payload[i][3] + "_slider'>";
            s += "<label onclick='ap_downloaddata.showSlider();' for='" + payload[i][3] + "_slider' id='" + payload[i][3] + "_slider_label'>" + payload[i][1] + ": " + $.i18n.prop('_slider') + "</label>";
            s += " | ";
            s += "<input type='radio' value='" + payload[i][3] + "_classic' name='radios_" + listboxID + "' id='" + payload[i][3] + "_classic'>";
            s += "<label onclick='ap_downloaddata.hideSlider();' for='" + payload[i][3] + "_classic' id='" + payload[i][3] + "_classic_label'>" + payload[i][1] + ": " + $.i18n.prop('_classic') + "</label>";
        }

        s += "</div>";
        s += "<div id='years_classic_container' style='display: none;'>";
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-8 col-lg-8'>";
        s += "<select data-placeholder='" + $.i18n.prop('_' + listboxID) + "' id='selection_years' multiple='' class='chosen-select' style='width: 100%;'>";
        s += "</select>";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-2 col-lg-2'>";
        s += "<button onclick='selectAll(\"" + 'memory_years' + "\");' style='width: 100%;' type='button' class='btn btn-sm btn-primary'>";
        s += "<span class='glyphicon glyphicon-ok'></span> " + $.i18n.prop('_select_all');
        s += "</button>";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-2 col-lg-2'>";
        s += "<button onclick='clearAll(\"" + 'memory_years' + "\");' style='width: 100%;' type='button' class='btn btn-sm btn-danger'>";
        s += "<span class='glyphicon glyphicon-remove'></span> " + $.i18n.prop('_clear_selection');
        s += "</button>";
        s += "</div>";
        s += "</div>";
        s += "</div>";
        s += "<div id='years_slider_container' style='display: block;'>";
        s += "<div id='slider'></div>";
        s += "<div id='yearMin' style='float: left'>1960</div>";
        s += "<div id='yearMax' style='float: right'>2013</div>";
        s += "</div>";
        s += "</div>";
        s += "<div style='height: 8px;'></div>";
        s += "<div id='years_summary_container' style='display: none;'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
        s += "<select data-placeholder='" +  $.i18n.prop('_your_selection') + "' id='memory_years' multiple='' class='chosen-select' style='width: 100%;'>";
        s += "</select>";
        s += "</div>";
        s += "</div>";
        s += "</div>";
        s += "<br>";

        /* Append it to the document. */
        $('#' + CONFIG.placeholderID + '_container').append(s);

        /* Initiate the slider. */
        populateYears();

        /* Add 'memory' control. */
        memoryController('selection_years', 'memory_years', true);

    }

    function clearAll(memoryID) {
        $('#' + memoryID + ' :selected').attr('selected', false);
        $('#' + memoryID).trigger('chosen:updated');
    }

    function selectAll(memoryID) {
        var s = "<option data-label='All' data-gaul='ALL' data-type='ALL' selected='selected'>" + $.i18n.prop('_' + memoryID) + "</option>";
        $('#' + memoryID).append(s);
        $('#' + memoryID).trigger('chosen:updated');
    }

    function memoryController(selectionID, memoryID, isYear) {
        $('#' + selectionID).chosen().change(function() {
            $('#' + selectionID).find('option:selected').each(function(k, v) {
                var s = null;
                if (isYear) {
                    s = "<option data-label='" + $(v).data('label') + "' data-gaul='" + $(v).data('gaul') + "' selected='selected'>" + $(v).data('label') + "</option>";
                } else {
                    s = "<option data-label='" + $(v).data('label') + "' data-gaul='" + $(v).data('gaul') + "' data-type='" + $(v).data('type') + "' selected='selected'>" + $(v).data('label') + "</option>";
                }
                $('#' + selectionID + ' :selected').attr('selected', false);
                $('#' + selectionID).trigger('chosen:updated');
                $('#' + memoryID).append(s);
                $('#' + memoryID).trigger('chosen:updated');
            });
        });
    }

    function populateYears() {

        /* Retrive years from DB. */
        $.ajax({

            type: 'GET',
            url: CONFIG.years_url + '/' + CONFIG.datasource + '/' + CONFIG.domainCode,

            success : function(response) {

                /* Convert the response in an object, i fneeded. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);

                /* Initiate the slider. */
                $('#slider').jqxSlider({
                    showButtons: true,
                    showTicks: true,
                    theme: CONFIG.theme,
                    height: 50,
                    min: parseFloat(json[json.length - 1][0]),
                    max: parseFloat(json[0][0]),
                    step: 1,
                    ticksFrequency: 5,
                    mode: 'fixed',
                    values: [parseFloat(json[0][0]) - 10, parseFloat(json[0][0])],
                    rangeSlider: true,
                    width: '100%'
                });

                /* On slider change. */
                $('#slider').on('change', function (event) {
                    document.getElementById('yearMin').innerHTML = event.args.value.rangeStart;
                    document.getElementById('yearMax').innerHTML = event.args.value.rangeEnd;
                });

                /* Initiate placeholders. */
                document.getElementById('yearMin').innerHTML = parseFloat(json[0][0]) - 10;
                document.getElementById('yearMax').innerHTML = parseFloat(json[0][0]);

                /* Populate Chosen. */
                for (var i = 0 ; i < json.length ; i++) {
                    var s = "<option data-label='" + json[i][0] + "' data-gaul='" + json[i][0] + "'>" + json[i][0] + "</option>";
                    $('#selection_years').append(s);
                }
                $('#selection_years').trigger('chosen:updated');

            },

            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }

        });

    }

    function showSlider() {
        $('#years_classic_container').css('display', 'none');
        $('#years_slider_container').css('display', 'block');
        $('#years_summary_container').css('display', 'none');
        CONFIG.yearsMode = 'slider';
    }

    function hideSlider() {
        $('#years_classic_container').css('display', 'block');
        $('#years_slider_container').css('display', 'none');
        $('#years_summary_container').css('display', 'block');
        $('.chosen-select').chosen({
            no_results_text: 'Nothing found, please check your spelling.',
            disable_search_threshold: 10
        });
        $('#selection_years_chosen').css('width', '100%');
        $('#memory_years_chosen').css('width', '100%');
        CONFIG.yearsMode = 'classic';
    }

    function populateBulkDownloads() {

        /* Retrive bulk downloads from DB. */
        $.ajax({

            type: 'GET',
            url: CONFIG.bulk_url + '/' + CONFIG.datasource + '/' + CONFIG.domainCode + '/' + CONFIG.lang,

            success : function(response) {

                /* Convert the response in an object, i fneeded. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);

                /* Add links to the drop-down button. */
                var root = 'http://faostat.fao.org/Portals/_Faostat/Downloads/zip_files/';
                for (var i = 0 ; i < json.length ; i++) {
                    var href = CONFIG.bulk_root + json[i][2];
                    var s = "<li><a target='_blank' href='" + href + "'>" + json[i][3] + "</a></li>";
                    $('#bulk-downloads-menu').append(s);
                }

            },

            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }

        });

    }

    function buildUIStructure() {

        /* Initiate variables. */
        var s = "";

        /* Append header. */
        s += buildUIHeader();
        s += "<br>";

        /* Append UI structure to the document. */
        $('#'+ CONFIG.placeholderID + '_container').append(s);

    }

    function buildUIHeader() {

        /* Initiate variables. */
        var s = "";

        /* Build content. */
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-8 col-lg-8'>";
        s += "<div class='standard-title'>" + $.i18n.prop('_selectors') + "</div>";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-4 col-lg-4'>";
        s += "<div class='btn-group' style='width: 100%;'>";
        s += "<button type='button' class='btn btn-default btn-primary btn-sm dropdown-toggle' data-toggle='dropdown' style='width: 100%;'>";
        s += "<span class='glyphicon glyphicon-compressed'></span> ";
        s += $.i18n.prop('_bulk_downloads') + " <span class='caret'></span>";
        s += "</button>";
        s += "<ul class='dropdown-menu' role='menu' id='bulk-downloads-menu'>";
        s += "</ul>";
        s += "</div>";
        s += "</div>";
        s += "</div>";
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
        s += "<hr  class='standard-hr'>";
        s += "</div>";
        s += "</div>";

        /* Return UI. */
        return s;
    }

//    return {
//        CONFIG              :   CONFIG,
//        init                :   init,
//        buildUI             :   buildUI,
//        showSlider          :   showSlider,
//        hideSlider          :   hideSlider,
//        clearAll            :   clearAll,
//        selectAll           :   selectAll,
//        populateStandardTab :   populateStandardTab,
//        preview             :   preview,
//        download            :   download
//    };

    return {
        CONFIG              :   CONFIG,
        init                :   init,
//        buildUI             :   buildUI,
        showSlider          :   showSlider,
        hideSlider          :   hideSlider,
//        clearAll            :   clearAll,
//        selectAll           :   selectAll,
//        populateStandardTab :   populateStandardTab,
        preview             :   preview,
        download            :   download
    };

    })();

//window.addEventListener('load', ap_downloaddata.init, false);

