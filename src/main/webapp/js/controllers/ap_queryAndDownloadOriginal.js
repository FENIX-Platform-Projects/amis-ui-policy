var ap_queryAndDownload = (function() {

    var CONFIG = {
        placeholderID   :   null,
        lang            :   null,
        lang_ISO2       :   null,
        domainCode      :   null,
        tabsPerRow      :   2,
        limit           :   20,
        theme           :   'faostat',
        datasource      :   'POLICY',
//       base_ip_address    :  'localhost',//168.202.28.56
        base_ip_address    :  '168.202.36.186',
        base_ip_port    :  '8090',
        //base_ip_address    :  'statistics.amis-outlook.org',
        //base_ip_port    :  '80',
        commodityPolicyDomain_url   :   '/wds/rest/policyservice/commodityPolicyDomain',
        startAndEndDate_url   :   '/wds/rest/policyservice/startEndDate',
        commodityPolicyTypes_url   :   '/wds/rest/policyservice/policyTypes',
       // cpl_id_url      :   'http://localhost:8090/wds/rest/policyservice/cplid',
        downloadPreview_url      :   '/wds/rest/policyservice/downloadPreview',
        downloadExport_url      :   '/wds/rest/policyservice/streamexcel',
        masterFromCplId_url     :   '/wds/rest/policyservice/masterFromCplId',
        shareGroupCommodities_url     :   '/wds/rest/policyservice/shareGroupInfo',
        policyTable_url     :   '/wds/rest/policyservice/downloadPreviewPolicyTable',
       // codelist_url    :   'http://faostat3.fao.org:7777/msd/cl/system',
        codelist_url    :   'http://faostat3.fao.org/d3sp/service/msd/cl/system',
        codelist_url_CommodityAgricultural  :  'OECD_CommodityClass1',
        codelist_url_CommodityBiofuels  :  'OECD_CommodityClass2',
        codelist_url_CommodityBoth  :   'OECD_CommodityClass',
        codelist_url_Country  : 'OECD_Country',
        codelist_url_PolicyType :   'OECD_PolicyType',

       // codelist_url    :   'http://fenixapps.fao.org/d3sp/service/msd/cl/system',
//        listboxes_url   :   'http://fenixapps.fao.org/wds/rest/procedures/listboxes',
       // codelist_url    :   'http://fenixapps.fao.org/wds/rest/procedures/',
//        data_url        :   'http://fenixapps.fao.org/wds/rest/procedures/data',
//        bulk_url        :   'http://faostat3.fao.org/wds/rest/bulkdownloads',
//        bulk_root       :   'http://faostat.fao.org/Portals/_Faostat/Downloads/zip_files/',
//        years_url       :   'http://faostat3.fao.org/wds/rest/procedures/years',
//        procedures_url  :   'http://faostat3.fao.org/wds/rest/procedures',

        I18N_prefix     :   '',
        yearsMode       :   'slider',
        config_file     :   'json/queryAndDownload_config2.json',
        selection_map   :   null,
        list_box_ids    :   null,
        active_tab      :   null,
        active_year_tab :   '' ,

        //Utility Map
        //Contains the list of commodity domain for each policy domain
        policy_commodity_domain_map :   null,
        //Contains the couple policy name, policy code... for the query after the preview
        policy_domain_map :   null,
        //Contains the couple policy name, commodity code... for the query after the preview
        commodity_domain_map :   null,
        //Radio Button Chacked from Policy Domain
        policy_radio_checked : "",
        //Radio Button Chacked from Commodity Domain
        commodity_radio_checked : "",
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
        slider_end_date_selected  :   '',

        //This variable is used in the loading window object
        loading_window_created  :   false,
        //This is the policy tabs array that is used to remove the object in the selection_map
        //when the user changes the Policy or the Commodity Domain
        //Format:  'Pmt'+code = 'Pmt1';
        policyType_actualTabs : [],
        //Contains the cpl_ids obtained by the user selection
        //In this list the cpl_id are distinct
        cpl_id_list : [],
        shareGroupGrid : false,
        first_tab_PMT   :   ''
};
   //Start Crea URL per collegarsi a un altro servizio qnd si e' gia' lato server
    //Da usare con la creazione dei file xls del metadato
    //Poi tornare al server i file e creare lo zip
    //con l'altro file ottenuto dal mio db (FREDAPIConnector)
    //Si crea lo zip e si mostra al client il save as con lo zip
    //  @GET
//    @Path("/export/excel")
//    @Produces("application/vnd.ms-excel")   ... per tornare il file al client  FREDRESTService
//    URL url = new URL(fredServiceUrl);
//    InputSource xmlResponse = new InputSource(url.openStream());

    //Libreria poi usata da giudo per la creazione dell'excel in ExcelFactory di package org.fao.fenix.wds.core.utils
    //End

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
//        $('#' + CONFIG.placeholderID).append("<div class='container' id='" + CONFIG.placeholderID + "_options'></div>");
//        $('#' + CONFIG.placeholderID).append("<div class='container' id='" + CONFIG.placeholderID + "_output'></div>");

        /* Add placeholder to the page. */
        $('#' + CONFIG.placeholderID + '_container').append(buildUIStructure());

        //Download_tab
        var s2 = ap_queryAndDownload.buildBulkDownloadTab();
        $('#' + CONFIG.placeholderID + 'bulk_download_container').append(s2);
        ap_queryAndDownload.populateBulkDownloadsTab();
        //$('#pane2').append(s2);

//        /* Build bulk downloads. */
//        populateBulkDownloads();

        //Show/Hide Selection
        buildPageActionsContainer();

        /* Query DB and build structure. */
        getDomainStructure();

        /* Build options. */
        buildOptions();

        /* Build preview and download button */
        buildPreviewAndDownloadButton();

        /* Build output. */
        buildOutput();

       // var fullscreen = "<div id='fullscreen' style='background-color: #FFFFFF; width:100%; height: 100%;'>fsd</div>";
//        var s = "";    //onclick='ap_queryAndDownload.preview_button();'
//        s += "<div class='row'>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-10 col-lg-10'>";
//        s += "&nbsp;";
//        s += "</div>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-1 col-lg-1'>";
//        s += "<button class='btn btn-sm btn-primary' id='close_fullscreen_button' type='button' style='width: 100%;' >";
//        s += "<span class='glyphicon glyphicon-eye-open'></span>";
//        s += " " + $.i18n.prop('_close_fullscreen');
//        s += "</button>";
//        s += "</div>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-1 col-lg-1'>";
//        s += "&nbsp;";
//        s += "</div>";
//        s += "</div>";
////            $('#close_fullscreen_button').on('click', function () {
////                alert("Close full screen clicked");
////                $('#fullscreen').fullScreen(false);
////            });
//        $('#fullscreen').append(s);
       // $('#' + CONFIG.placeholderID + 'fullScreen_container').append(fullscreen);
       // container.append(fullscreen);


       // $('#output_placeholder').append(s);


    }

    function previewTable() {

        /* Show loading bar. */
       // var load = "<img src='img/loadingbar.gif'>";
        var load = "<img src='img/loading.gif' />";
        $('#output_placeholder').append(load);
        //Getting codes from the Policy Domain Selection
        //The format is: "x,y,z"
        //Policy Domain and Commodity Domain are mandatory
        var policy_domain_code = "";
        var commodity_domain_code = "";
        var commodity_class_code = "";
        var country_code = "";
        var country_name = "";
        var year_list = "";
        var obj;

        if(ap_queryAndDownload.CONFIG.policy_radio_checked == $.i18n.prop('_policy_domain_both'))
        {
            policy_domain_code = ap_queryAndDownload.CONFIG.policy_domain_map[$.i18n.prop('_policy_domain_trade')]+","+ap_queryAndDownload.CONFIG.policy_domain_map[$.i18n.prop('_policy_domain_domestic')];
        }
        else
        {
            policy_domain_code = ap_queryAndDownload.CONFIG.policy_domain_map[ap_queryAndDownload.CONFIG.policy_radio_checked];
        }
       // console.log(" policy_domain_code "+policy_domain_code);

        //Getting codes from the Commodity Domain Selection
        if(ap_queryAndDownload.CONFIG.commodity_radio_checked == $.i18n.prop('_commodity_domain_both'))
        {
            commodity_domain_code = ap_queryAndDownload.CONFIG.commodity_domain_map[$.i18n.prop('_commodity_domain_agricultural')]+","+ap_queryAndDownload.CONFIG.commodity_domain_map[$.i18n.prop('_commodity_domain_biofuels')];
        }
        else
        {
            commodity_domain_code = ap_queryAndDownload.CONFIG.commodity_domain_map[ap_queryAndDownload.CONFIG.commodity_radio_checked];
        }
      //  console.log(" commodity_domain_code "+commodity_domain_code);

        //Getting codes from the Commodity Class selection
        obj = ap_queryAndDownload.CONFIG.selection_map[$.i18n.prop('_selection_map_CommodityClass')];
      //  console.log(" commodity_class_name obj.elements_name "+obj.elements_name);
      // console.log(" commodity_class_name obj.elements_code "+obj.elements_code);
        //Case Select All
        if(obj.elements_value[0]==true)
        {
            for(var i=1; i<obj.elements_value.length; i++)
            {
                if(commodity_class_code.length>0)
                {
                    commodity_class_code += ", ";
                }
                commodity_class_code += obj.elements_code[i];
            }
        }
        else
        {
            for(var i=1; i<obj.elements_value.length; i++)
            {
                if(obj.elements_value[i]==true)
                {
                    if(commodity_class_code.length>0)
                    {
                        commodity_class_code += ", ";
                    }
                    commodity_class_code += obj.elements_code[i];
                }
            }
        }
      //  console.log(" commodity_class_code "+commodity_class_code);

        //Getting codes from the Country Class selection
        obj = ap_queryAndDownload.CONFIG.selection_map[$.i18n.prop('_selection_map_Countries')];
        var country_class_name = "";
//        console.log(" country_class_name obj.elements_name "+obj.elements_name);
//        console.log(" country_class_name obj.elements_code "+obj.elements_code);
        //Case Select All
        if(obj.elements_value[0]==true)
        {
            for(var i=1; i<obj.elements_value.length; i++)
            {
                if(country_code.length>0)
                {
                    country_code += ", ";
                }
                country_code += obj.elements_code[i];
                country_name += obj.elements_name[i];
            }
        }
        else
        {
            for(var i=1; i<obj.elements_value.length; i++)
            {
                if(obj.elements_value[i]==true)
                {
                    if(country_code.length>0)
                    {
                        country_code += ", ";
                    }
                    country_code += obj.elements_code[i];
                    country_name += obj.elements_name[i];
                }
            }
        }
      //  console.log(" country_name "+country_name);
      //  console.log(" country_code "+country_code);

        var policy_type_code = [];
        var policy_measure_code = [];
        //Getting codes from the Policy Types selection
       // console.log(" ap_queryAndDownload.CONFIG.policyType_actualTabs.length "+ap_queryAndDownload.CONFIG.policyType_actualTabs.length);
        for(var j=0; j<ap_queryAndDownload.CONFIG.policyType_actualTabs.length; j++)
        {   //Pmt1
            var tab_code = ap_queryAndDownload.CONFIG.policyType_actualTabs[j];
            policy_type_code[j] = tab_code.substring(tab_code.indexOf('Pmt')+3);

            //Getting codes from the Policy Measures selection
            obj = ap_queryAndDownload.CONFIG.selection_map[tab_code];
            policy_measure_code[j]= "";
            //Case Select All
            if(obj.elements_value[0]==true)
            {
                for(var i=1; i<obj.elements_value.length; i++)
                {
                    if(obj.elements_value[i]==true)
                    {
                        if((policy_measure_code[j]!=null)&&(policy_measure_code[j].length>0))
                        {
                            policy_measure_code[j] += ", ";
                        }
                        policy_measure_code[j] += obj.elements_code[i];
                    }
                }
            }
            else{
                for(var i=1; i<obj.elements_value.length; i++)
                {
                    if(obj.elements_value[i]==true)
                    {
                        if((policy_measure_code[j]!=null)&&(policy_measure_code[j].length>0))
                        {
                            policy_measure_code[j] += ", ";
                        }
                        policy_measure_code[j] += obj.elements_code[i];
                    }
                }
            }
        }

//        for(var j=0; j<policy_type_code.length; j++)
//        {
//            console.log(" j=  "+j);
//            console.log(" policy_type_code "+policy_type_code[j]);
//            console.log(" policy_measure_code "+policy_measure_code);
//        }

        var start_date = "";
        var end_date = "";
       // alert("year tab "+ap_queryAndDownload.CONFIG.active_year_tab);
        if(ap_queryAndDownload.CONFIG.active_year_tab == 'slider')
        {
              //11/03/2014
            var start_date_app = ap_queryAndDownload.CONFIG.slider_start_date_selected;
            var index = start_date_app.indexOf('/');
            var start_date_dd = start_date_app.substring(0,index);
            //03/2014
            start_date_app = start_date_app.substring(index+1);
            index = start_date_app.indexOf('/');
            var start_date_mm = start_date_app.substring(0,index);
            //2014
            start_date_app = start_date_app.substring(index+1);
            var start_date_yy = start_date_app;
            var end_date_app = ap_queryAndDownload.CONFIG.slider_end_date_selected;
            var index = end_date_app.indexOf('/');
            var end_date_dd = end_date_app.substring(0,index);
            //03/2014
            end_date_app = end_date_app.substring(index+1);
            index = end_date_app.indexOf('/');
            var end_date_mm = end_date_app.substring(0,index);
            //2014
            end_date_app = end_date_app.substring(index+1);
            var end_date_yy = end_date_app;
            start_date = start_date_yy+"-"+start_date_mm+"-"+start_date_dd;
            end_date = end_date_yy+"-"+end_date_mm+"-"+end_date_dd;
         //   console.log("ap_queryAndDownload.CONFIG.slider_start_date_selected = "+ap_queryAndDownload.CONFIG.slider_start_date_selected + " ap_queryAndDownload.CONFIG.slider_end_date_selected "+ap_queryAndDownload.CONFIG.slider_end_date_selected);
        }
        else{
            //If it's classic
            //Getting codes from the Policy Measures selection
            obj = ap_queryAndDownload.CONFIG.selection_map['Years'];
            //Case Select All
            if(obj.elements_value[0]==true)
            {
                for(var i=1; i<obj.elements_value.length; i++)
                {
                    if(year_list.length>0)
                    {
                        year_list += ", ";
                    }
                    year_list += obj.elements_name[i];
                }
            }
            else
            {
                for(var i=1; i<obj.elements_value.length; i++)
                {
                    if(obj.elements_value[i]==true)
                    {
                        if(year_list.length>0)
                        {
                            year_list += ", ";
                        }
                        year_list += obj.elements_name[i];
                    }
                }
            }
          //  console.log("year_list "+year_list);
        }

        var data = ap_policyDataObject.init();
        data.datasource = ap_queryAndDownload.CONFIG.datasource;
        data.policy_domain_code = policy_domain_code;
        data.commodity_domain_code = commodity_domain_code;
        data.commodity_class_code = commodity_class_code;
        data.policy_type_code = policy_type_code;
        data.policy_measure_code = policy_measure_code;
        data.country_code = country_code;
        //it could be 'slider' or 'classic'
        data.yearTab = ap_queryAndDownload.CONFIG.active_year_tab;
        data.year_list = year_list;
        data.start_date = start_date;
        data.end_date = end_date;
        var payloadrest = JSON.stringify(data);
        /* Retrive UI structure from DB. */
        $.ajax({

            type: 'POST',
            // url: CONFIG.listboxes_url + '/' + CONFIG.datasource + '/' + CONFIG.domainCode + '/' + CONFIG.lang,
            url: 'http://'+ap_queryAndDownload.CONFIG.base_ip_address+':'+ap_queryAndDownload.CONFIG.base_ip_port+ap_queryAndDownload.CONFIG.downloadPreview_url,
//            url: ap_queryAndDownload.CONFIG.downloadPreview_url,
            data : {"pdObj": payloadrest},

            success : function(response) {

                /* Convert the response in an object, i needed. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
             //   console.log(" success post");
             //   console.log(" "+json);
//                for (var i = 0 ; i < json.length ; i++) {
//                    console.log(" "+json[i]);
//                }
                ap_queryAndDownload.CONFIG.cpl_id_list=[];
                if(json.length==0)
                {
                    //Case No cpl_id for this selection
                    var s = "<div class='row'>";
                    s += "<div class='col-xs-12 col-sm-12 col-md-10 col-lg-10'>";
                   // s += "<div><b>"+$.i18n.prop('_no_data')+"<b></div>";
                    s += "<h1 class='fx_header_title'>"+$.i18n.prop('_no_data')+"</h1>";
                    s += "</div>";
                    s += "</div>";
                    $('#output_placeholder').children().remove();
                    $('#output_placeholder').append(s);
                }
                else
                {   //masterFromCplId_url    type: 'GET',
//                    url:  CONFIG.config_file,
                    var cpl_id_list_String ="";
                    for (var i = 0 ; i < json.length ; i++) {
                        ap_queryAndDownload.CONFIG.cpl_id_list[i] = json[i];
                        if(cpl_id_list_String.length>0)
                        {
                            cpl_id_list_String += ', ';
                        }
                        cpl_id_list_String += "'"+ap_queryAndDownload.CONFIG.cpl_id_list[i]+"'";
                    }
                   // alert("cpl_id_list_String *"+cpl_id_list_String+"*");
                    var forGetMasterData = ap_policyDataObject.init();
                    forGetMasterData.datasource = ap_queryAndDownload.CONFIG.datasource;
                    forGetMasterData.cpl_id = cpl_id_list_String;
                    var payloadrestMasterData = JSON.stringify(forGetMasterData);
                    //console.log("url "+ap_queryAndDownload.CONFIG.masterFromCplId_url+ '/' + ap_queryAndDownload.CONFIG.datasource+ '/'+ ap_queryAndDownload.CONFIG.cpl_id_list[0]);
                    $.ajax({

                            type: 'POST',
//                            url: ap_queryAndDownload.CONFIG.masterFromCplId_url,
                            url: 'http://'+ap_queryAndDownload.CONFIG.base_ip_address+':'+ap_queryAndDownload.CONFIG.base_ip_port+ap_queryAndDownload.CONFIG.masterFromCplId_url,
                            data : {"pdObj": payloadrestMasterData},

                            success : function(response) {
                                /* Convert the response in an object, i needed. */
                                var json = response;
                                if (typeof(response) == 'string')
                                    json = $.parseJSON(response);

                                var cpl_id = [];
                                var cpl_code = [];
                                var commodity_id = [];
                                var country_code = [];
                                var country_name = [];
                                var subnational_code = [];
                                var subnational_name = [];
                                var commoditydomain_code = [];
                                var commoditydomain_name = [];
                                var commodityclass_code = [];
                                var commodityclass_name = [];
                                var policydomain_code = [];
                                var policydomain_name = [];
                                var policytype_code = [];
                                var policytype_name = [];
                                var policymeasure_code = [];
                                var policymeasure_name = [];
                                var condition_code = [];
                                var condition = [];
                                var individualpolicy_code = [];
                                var individualpolicy_name = [];



                                // cpl_code              | character varying(255) |

//                                condition_code        | integer                |
//                                condition             | character varying(255) |
//                                individualpolicy_code | integer                |
//                                individualpolicy_name    character varying(255)
                                for (var i = 0 ; i < json.length ; i++) {
                                    for (var j = 0 ; j < json[i].length ; j++) {
                                        if((json[i][j] == null)||(typeof json[i][j] == 'undefined')) {
                                            json[i][j]="";
                                        }
                                        switch(j)
                                        {
                                            case 0:
                                                cpl_id[i] = json[i][j];
                                                break;
                                            case 1:
                                                cpl_code[i] = json[i][j];
                                                break;
                                            case 2:
                                                commodity_id[i] = json[i][j];
                                                break;
                                            case 3:
                                                country_code[i] = json[i][j];
                                                break;
                                            case 4:
                                                country_name[i] = json[i][j];
                                                break;
                                            case 5:
                                                subnational_code[i] = json[i][j];
                                                break;
                                            case 6:
                                                subnational_name[i] = json[i][j];
                                                break;
                                            case 7:
                                                commoditydomain_code[i] = json[i][j];
                                                break;
                                            case 8:
                                                commoditydomain_name[i] = json[i][j];
                                                break;
                                            case 9:
                                                commodityclass_code[i] = json[i][j];
                                                break;
                                            case 10:
                                                commodityclass_name[i] = json[i][j];
                                                break;
                                            case 11:
                                                policydomain_code[i] = json[i][j];
                                                break;
                                            case 12:
                                                policydomain_name[i] = json[i][j];
                                                break;
                                            case 13:
                                                policytype_code[i] = json[i][j];
                                                break;
                                            case 14:
                                                policytype_name[i] = json[i][j];
                                                break;
                                            case 15:
                                                policymeasure_code[i] = json[i][j];
                                                break;
                                            case 16:
                                                policymeasure_name[i] = json[i][j];
                                                break;
                                            case 17:
                                                condition_code[i] = json[i][j];
                                                break;
                                            case 18:
                                                condition[i] = json[i][j];
                                                break;
                                            case 19:
                                                individualpolicy_code[i] = json[i][j];
                                                break;
                                            case 20:
                                                individualpolicy_name[i] = json[i][j];
                                                break;
                                        }
                                    }
                                }


                            //    console.log(" success masterFromCplId get");
                            //    console.log(" "+json + " json[0] "+json[0][0]);

                                //metadata_id, cpl_id, commodity_id, country_code, country_name, subnational_code, subnational_name, commoditydomain_code, commoditydomain_name,
                                //commodityclass_code, commodityclass_name, policydomain_code, policydomain_name, policytype_code, policytype_name, policymeasure_code, policymeasure_name,
                                //    condition, condition_exists
//                                ap_masterTableObject.init(json[0][0], json[0][1], json[0][2], json[0][3], json[0][4], json[0][5], json[0][6], json[0][7], json[0][8],
//                                    json[0][9], json[0][10], json[0][11], json[0][12], json[0][13], json[0][14], json[0][15], json[0][16], json[0][17], json[0][18]);

                                ap_masterTableObject.init(cpl_id, cpl_code, commodity_id, country_code, country_name, subnational_code, subnational_name, commoditydomain_code, commoditydomain_name,
                                    commodityclass_code, commodityclass_name, policydomain_code, policydomain_name, policytype_code, policytype_name, policymeasure_code, policymeasure_name, condition_code, condition, individualpolicy_code, individualpolicy_name);
                                $('#output_placeholder').children().remove();
                                // var s = '<div id="jqxWidget"><div id="mainSplitter"><div class="splitter-panel"> Panel 1</div><div class="splitter-panel">Panel 2</div> </div> </div></div>';

                                var s = "<div class='row'>";
                                s += "<div class='col-xs-12 col-sm-12 col-md-6 col-lg-6'>";
//                                s += "<div title="+$.i18n.prop('_master_table_tooltip')+">"+$.i18n.prop('_master_table_title')+"</div>";
                                //s += "<div title="+$.i18n.prop('_master_table_tooltip')+">"+$.i18n.prop('_master_table_title')+"</div>";
//                                s += "<div id='master_title' class='summary-item grey-tooltip' data-toggle='tooltip' data-placement='bottom' title='"+$.i18n.prop('_master_table_tooltip')+"'><span class='glyphicon glyphicon-info-sign'></span>&nbsp"+$.i18n.prop('_master_table_title')+"</div>"
                                s += "<div id='master_title' class='summary-item grey-tooltip' data-toggle='tooltip' data-placement='bottom' title='"+$.i18n.prop('_master_table_tooltip')+"'><span class='glyphicon glyphicon-info-sign'></span>&nbsp</div>";
                                s += "<div class='summary-item-no-pointer' data-placement='bottom'><div>"+$.i18n.prop('_master_table_title')+"</div></div>";
                                //s += '<div id="jqxWidget"><div id="mainSplitter"><div class="splitter-panel"> Panel jfsdnfsndfasdfsdfnskdngsdgsdmgsdg1</div><div class="splitter-panel">Panel 2dsgsndnfglsdn</div> </div> </div></div>';
                                s += '<div id="splitter"><div style="overflow: hidden;"><div style="border: none;" id="listbox"></div></div><div style="overflow: auto;" id="ContentPanel"></div></div>';
                                s += "</div>";
                                s += "<div class='col-xs-12 col-sm-12 col-md-6 col-lg-6'>";
                                //s += '<div id="jqxWidget"><div id="mainSplitter"><div class="splitter-panel"> Panel jfsdnfsndfasdfsdfnskdngsdgsdmgsdg1</div><div class="splitter-panel">Panel 2dsgsndnfglsdn</div> </div> </div></div>';
                                //s += '<div id="splitter"><div style="overflow: hidden;"><div style="border: none;" id="listbox"></div></div><div style="overflow: hidden;" id="ContentPanel"></div></div>';

                                //s += '<div id="window"><div id="windowHeader"></div><div style="overflow: hidden;" id="windowContent"></div></div>'  ;
                                //s += "<div title="+$.i18n.prop('_share_group_table_tooltip')+">"+$.i18n.prop('_share_group_table_title')+"</div>";
                                s += "<div id='shareGroup_title' class='summary-item grey-tooltip' data-toggle='tooltip' data-placement='bottom' title='"+$.i18n.prop('_share_group_table_tooltip')+"'><span class='glyphicon glyphicon-info-sign'></span>&nbsp</div>";
//                                s += "<div class='summary-item' data-placement='bottom' title='"+$.i18n.prop('_share_group_table_tooltip')+"'>"+$.i18n.prop('_share_group_table_title')+"</div>"
                                s += "<div class='summary-item-no-pointer' data-placement='bottom'><div>"+$.i18n.prop('_share_group_table_title')+"</div></div>";
                                s +="<div id='shareGroupGridContainer'></div>";
                                s +="<div id='shareGroupGrid'></div>";
                                s += "</div>";
                                s += "</div>";
                                s += "<br>";
                                s += "<div class='row'>";
                                s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
//                                s += "<div title="+$.i18n.prop('_policy_table_tooltip_one')+">"+$.i18n.prop('_policy_table_title_one')+"</div>";
                                s += "<div id='policy_one_title' class='summary-item grey-tooltip' data-toggle='tooltip' data-placement='bottom' title='"+$.i18n.prop('_policy_table_tooltip_one')+"'><span class='glyphicon glyphicon-info-sign'></span>&nbsp</div>";
                                s += "<div class='summary-item-no-pointer' data-placement='bottom'><div>"+$.i18n.prop('_policy_table_title_one')+"</div></div>";
                                s +="<div id='policyTableOneGridContainer'>";
                                s +="<div id='policyTableOneGrid'></div>";
                                s += "</div>";
                                s += "</div>";
                                s += "</div>";
                                s += "<br>";
                                s += "<div class='row'>";
                                s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
//                                s += "<div title="+$.i18n.prop('_policy_table_tooltip_two')+">"+$.i18n.prop('_policy_table_title_two')+"</div>";
                                s += "<div id='policy_two_title' class='summary-item grey-tooltip' data-toggle='tooltip' data-placement='bottom' title='"+$.i18n.prop('_policy_table_tooltip_two')+"'><span class='glyphicon glyphicon-info-sign'></span>&nbsp</div>";
                                s += "<div class='summary-item-no-pointer' data-placement='bottom'><div>"+$.i18n.prop('_policy_table_title_two')+"</div></div>";
                                s +="<div style='overflow: auto; background-color:#FFFFFF;height: 400px;' id='policyTableTwoPanel'  ></div>";
                                s += "</div>";
                                s += "</div>";

                                $('#output_placeholder').append(s);
                                $("#master_title").tooltip();
                                $("#shareGroup_title").tooltip();
                                $("#policy_one_title").tooltip();
                                $("#policy_two_title").tooltip();

                                // $('#mainSplitter').jqxSplitter({ width: 850, height: 480, panels: [{ size: 300 }] });
                                $('#splitter').jqxSplitter({width: '100%', panels: [{ size: '40%' }] });
//                $('#window').jqxWindow('resizable', true);
//
//                $('#window').jqxWindow({
//                    showCollapseButton: true, maxHeight: 400, maxWidth: 700, minHeight: 200, minWidth: 200, height: 300, width: 500,
//                    initContent: function () {
//                        //$('#tab').jqxTabs({ height: '100%', width:  '100%' });
//                        $('#window').jqxWindow('focus');
//                    }
//                });
                                ap_queryAndDownload.build_splitter();
                                 //Test removing this call start
                                //ap_queryAndDownload.buildShareGroupPolicyTables(0,'firstLoad', start_date, end_date, year_list);
                                //Test removing this call end

                            },
                            error : function(err,b,c) {
                                alert(err.status + ", " + b + ", " + c);
                            }
                    });
                }
            },

            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    }

    //The commodity_index is the index in the ap_masterTableObject because in the listbox
    //and in the master panel the elements are taken from that objects
    function buildShareGroupPolicyTables(commodity_index, load, start_date, end_date, year_list){
     //   console.log("buildShareGroupPolicyTables start ");
        //Getting info about Share Group
        $.ajax({

            type: 'GET',
            url: 'http://'+ap_queryAndDownload.CONFIG.base_ip_address+':'+ap_queryAndDownload.CONFIG.base_ip_port+ ap_queryAndDownload.CONFIG.shareGroupCommodities_url+ '/' + ap_queryAndDownload.CONFIG.datasource+ '/' +ap_masterTableObject.CONFIG.commodity_id[commodity_index],
//            url: ap_queryAndDownload.CONFIG.shareGroupCommodities_url+ '/' + ap_queryAndDownload.CONFIG.datasource+ '/' +ap_masterTableObject.CONFIG.commodity_id[commodity_index],
         //   url: ap_queryAndDownload.CONFIG.shareGroupCommodities_url+ '/' + ap_queryAndDownload.CONFIG.datasource+ '/' +1250,

            success : function(response) {

                /* Convert the response in an object, i fneeded. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
                //if it's true there is at least one value in the end_date column that is null
                //var end_date_null = json[0][0];
              //  console.log("ap_queryAndDownload.CONFIG.shareGroupCommodities_url json[0][0] = "+json[0]);
                if((typeof json[0]!='undefined')&&(json[0]!="NOT_FOUND"))
                {
                   // alert("if");
                    //$("#shareGroupGridContainer").children().remove();
                    $("#shareGroupGrid").remove();
                    var s ="<div id='shareGroupGrid'></div>";
                    $("#shareGroupGridContainer").append(s);
                   // ap_queryAndDownload.CONFIG.shareGroupGrid = false;
//                    console.log("ap_queryAndDownload.CONFIG.shareGroupCommodities_url in if if((typeof json[0]!='undefined')&&(json[0]!=NOT_FOUND)) ");

                    var hs_code = [];
                    var hs_suffix = [];
                    var hs_version = [];
                    var short_description = [];
                    for (var i = 0 ; i < json.length ; i++) {
                  //      console.log("buildShareGroupPolicyTables json[i] "+json[i]);
                        for (var j = 0 ; j < json[i].length ; j++) {
//                            if((json[i][j] == null)||(typeof json[i][j] == 'undefined')) {
//                                json[i][j]="";
//                            }
                            switch(j)
                            {
                                case 0:
                                    hs_code[i] = json[i][j];
                                    break;
                                case 1:
                                    hs_suffix[i] = json[i][j];
                                    break;
                                case 2:
                                    hs_version[i] = json[i][j];
                                    break;
                                case 3:
                                    short_description[i] = json[i][j];
                                    break;
                            }
                        }
                    }
//                    console.log("ap_queryAndDownload.CONFIG.shareGroupCommodities_url hs_code "+hs_code+" hs_suffix "+hs_suffix+" hs_version "+hs_version+" short_description "+short_description);
//                    ap_commodityShareGroupObject.init(commodity_id, target_code, description);
                    ap_commodityShareGroupObject.init(hs_code, hs_suffix, hs_version, short_description);
                    ap_queryAndDownload.build_shareGroupGrid(load);
                }
                else
                {
                   // alert("else");
                   // $('#shareGroupGrid').jqxGrid('destroy');
                    //$("#shareGroupGridContainer").children().remove();
                    $("#shareGroupGrid").remove();
                    var s ="<div id='shareGroupGrid'>"+$.i18n.prop('_no_share_group')+"</div>";
                    //$("#shareGroupGrid").html("Not found");
                    $("#shareGroupGridContainer").append(s);
                    //ap_queryAndDownload.CONFIG.shareGroupGrid = false;
                }
                //ap_queryAndDownload.build_shareGroupGrid(load);
                ap_queryAndDownload.build_policyTableGrid(commodity_index, load, start_date, end_date, year_list);
            },
            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    }

    function exportTable(id){

       // alert("id = "+id);
        /* Show loading bar. */
        // var load = "<img src='img/loadingbar.gif'>";
       // var load = "<img src='img/loading.gif' />";
       // $('#output_placeholder').append(load);
        //Getting codes from the Policy Domain Selection
        //The format is: "x,y,z"
        //Policy Domain and Commodity Domain are mandatory
        var policy_domain_code = "";
        var commodity_domain_code = "";
        var commodity_class_code = "";
        var country_code = "";
        var country_name = "";
        var year_list = "";
        var obj;

        if(ap_queryAndDownload.CONFIG.policy_radio_checked == $.i18n.prop('_policy_domain_both'))
        {
            policy_domain_code = ap_queryAndDownload.CONFIG.policy_domain_map[$.i18n.prop('_policy_domain_trade')]+","+ap_queryAndDownload.CONFIG.policy_domain_map[$.i18n.prop('_policy_domain_domestic')];
        }
        else
        {
            policy_domain_code = ap_queryAndDownload.CONFIG.policy_domain_map[ap_queryAndDownload.CONFIG.policy_radio_checked];
        }
       // console.log(" policy_domain_code "+policy_domain_code);

        //Getting codes from the Commodity Domain Selection
        if(ap_queryAndDownload.CONFIG.commodity_radio_checked == $.i18n.prop('_commodity_domain_both'))
        {
            commodity_domain_code = ap_queryAndDownload.CONFIG.commodity_domain_map[$.i18n.prop('_commodity_domain_agricultural')]+","+ap_queryAndDownload.CONFIG.commodity_domain_map[$.i18n.prop('_commodity_domain_biofuels')];
        }
        else
        {
            commodity_domain_code = ap_queryAndDownload.CONFIG.commodity_domain_map[ap_queryAndDownload.CONFIG.commodity_radio_checked];
        }
     //   console.log(" commodity_domain_code "+commodity_domain_code);

        //Getting codes from the Commodity Class selection
        obj = ap_queryAndDownload.CONFIG.selection_map[$.i18n.prop('_selection_map_CommodityClass')];
     //   console.log(" commodity_class_name obj.elements_name "+obj.elements_name);
     //   console.log(" commodity_class_name obj.elements_code "+obj.elements_code);
        //Case Select All
        if(obj.elements_value[0]==true)
        {
            for(var i=1; i<obj.elements_value.length; i++)
            {
                if(commodity_class_code.length>0)
                {
                    commodity_class_code += ", ";
                }
                commodity_class_code += obj.elements_code[i];
            }
        }
        else
        {
            for(var i=1; i<obj.elements_value.length; i++)
            {
                if(obj.elements_value[i]==true)
                {
                    if(commodity_class_code.length>0)
                    {
                        commodity_class_code += ", ";
                    }
                    commodity_class_code += obj.elements_code[i];
                }
            }
        }
      //  console.log(" commodity_class_code "+commodity_class_code);

        //Getting codes from the Country Class selection
        obj = ap_queryAndDownload.CONFIG.selection_map[$.i18n.prop('_selection_map_Countries')];
        var country_class_name = "";
//        console.log(" country_class_name obj.elements_name "+obj.elements_name);
//        console.log(" country_class_name obj.elements_code "+obj.elements_code);
        //Case Select All
        if(obj.elements_value[0]==true)
        {
            for(var i=1; i<obj.elements_value.length; i++)
            {
                if(country_code.length>0)
                {
                    country_code += ", ";
                }
                country_code += obj.elements_code[i];
                country_name += obj.elements_name[i];
            }
        }
        else
        {
            for(var i=1; i<obj.elements_value.length; i++)
            {
                if(obj.elements_value[i]==true)
                {
                    if(country_code.length>0)
                    {
                        country_code += ", ";
                    }
                    country_code += obj.elements_code[i];
                    country_name += obj.elements_name[i];
                }
            }
        }
      //  console.log(" country_name "+country_name);
       // console.log(" country_code "+country_code);

        var policy_type_code = [];
        var policy_measure_code = [];
        //Getting codes from the Policy Types selection
     //   console.log(" ap_queryAndDownload.CONFIG.policyType_actualTabs.length "+ap_queryAndDownload.CONFIG.policyType_actualTabs.length);
        for(var j=0; j<ap_queryAndDownload.CONFIG.policyType_actualTabs.length; j++)
        {   //Pmt1
            var tab_code = ap_queryAndDownload.CONFIG.policyType_actualTabs[j];
            policy_type_code[j] = tab_code.substring(tab_code.indexOf('Pmt')+3);

            //Getting codes from the Policy Measures selection
            obj = ap_queryAndDownload.CONFIG.selection_map[tab_code];
            policy_measure_code[j]= "";
            //Case Select All
            if(obj.elements_value[0]==true)
            {
                for(var i=1; i<obj.elements_value.length; i++)
                {
                    if(obj.elements_value[i]==true)
                    {
                        if((policy_measure_code[j]!=null)&&(policy_measure_code[j].length>0))
                        {
                            policy_measure_code[j] += ", ";
                        }
                        policy_measure_code[j] += obj.elements_code[i];
                    }
                }
            }
            else{
                for(var i=1; i<obj.elements_value.length; i++)
                {
                    if(obj.elements_value[i]==true)
                    {
                        if((policy_measure_code[j]!=null)&&(policy_measure_code[j].length>0))
                        {
                            policy_measure_code[j] += ", ";
                        }
                        policy_measure_code[j] += obj.elements_code[i];
                    }
                }
            }
        }

//        for(var j=0; j<policy_type_code.length; j++)
//        {
//            console.log(" j=  "+j);
//            console.log(" policy_type_code "+policy_type_code[j]);
//            console.log(" policy_measure_code "+policy_measure_code);
//        }

        var start_date = "";
        var end_date = "";
       // alert("year tab "+ap_queryAndDownload.CONFIG.active_year_tab);
        if(ap_queryAndDownload.CONFIG.active_year_tab == 'slider')
        {
            //11/03/2014
            var start_date_app = ap_queryAndDownload.CONFIG.slider_start_date_selected;
            var index = start_date_app.indexOf('/');
            var start_date_dd = start_date_app.substring(0,index);
            //03/2014
            start_date_app = start_date_app.substring(index+1);
            index = start_date_app.indexOf('/');
            var start_date_mm = start_date_app.substring(0,index);
            //2014
            start_date_app = start_date_app.substring(index+1);
            var start_date_yy = start_date_app;
            var end_date_app = ap_queryAndDownload.CONFIG.slider_end_date_selected;
            var index = end_date_app.indexOf('/');
            var end_date_dd = end_date_app.substring(0,index);
            //03/2014
            end_date_app = end_date_app.substring(index+1);
            index = end_date_app.indexOf('/');
            var end_date_mm = end_date_app.substring(0,index);
            //2014
            end_date_app = end_date_app.substring(index+1);
            var end_date_yy = end_date_app;
            start_date = start_date_yy+"-"+start_date_mm+"-"+start_date_dd;
            end_date = end_date_yy+"-"+end_date_mm+"-"+end_date_dd;
         //   console.log("ap_queryAndDownload.CONFIG.slider_start_date_selected = "+ap_queryAndDownload.CONFIG.slider_start_date_selected + " ap_queryAndDownload.CONFIG.slider_end_date_selected "+ap_queryAndDownload.CONFIG.slider_end_date_selected);
        }
        else{
            //If it's classic
            //Getting codes from the Policy Measures selection
            obj = ap_queryAndDownload.CONFIG.selection_map['Years'];
            //Case Select All
            if(obj.elements_value[0]==true)
            {
                for(var i=1; i<obj.elements_value.length; i++)
                {
                    if(year_list.length>0)
                    {
                        year_list += ", ";
                    }
                    year_list += obj.elements_name[i];
                }
            }
            else
            {
                for(var i=1; i<obj.elements_value.length; i++)
                {
                    if(obj.elements_value[i]==true)
                    {
                        if(year_list.length>0)
                        {
                            year_list += ", ";
                        }
                        year_list += obj.elements_name[i];
                    }
                }
            }
          //  console.log("year_list "+year_list);
        }

        if(id=='PolicyDb')
        {
            var data = ap_policyDataObject.init();
            data.datasource = ap_queryAndDownload.CONFIG.datasource;
            data.policy_domain_code = policy_domain_code;
            data.commodity_domain_code = commodity_domain_code;
            data.commodity_class_code = commodity_class_code;
            data.policy_type_code = policy_type_code;
            data.policy_measure_code = policy_measure_code;
            data.country_code = country_code;
            //it could be 'slider' or 'classic'
            data.yearTab = ap_queryAndDownload.CONFIG.active_year_tab;
            data.year_list = year_list;
            data.start_date = start_date;
            data.end_date = end_date;
//        var payloadrest = JSON.stringify(data);
            /* Retrive UI structure from DB. */
            console.log("Before all data");
            console.log("data.datasource "+data.datasource);
            console.log("data.policy_domain_code "+data.policy_domain_code);
            console.log("data.commodity_domain_code "+data.commodity_domain_code);
            console.log("data.commodity_class_code "+data.commodity_class_code);
            console.log("data.policy_type_code "+data.policy_type_code);
            console.log("data.policy_measure_code "+data.policy_measure_code);
            console.log("data.country_code "+data.country_code);
            console.log("data.yearTab "+data.yearTab);
            console.log("data.year_list "+data.year_list);
            console.log("data.start_date "+data.start_date);
            console.log("data.end_date "+data.end_date);
            ap_queryAndDownload.exportPlainData(data, 'AllData');
        }
        else
        {
            var data2 = ap_policyDataObject.init();
            data2.datasource = ap_queryAndDownload.CONFIG.datasource;
            data2.policy_domain_code = policy_domain_code;
            data2.commodity_domain_code = commodity_domain_code;
            data2.commodity_class_code = commodity_class_code;
            data2.policy_type_code = policy_type_code;
            data2.policy_measure_code = policy_measure_code;
            data2.country_code = country_code;
            //it could be 'slider' or 'classic'
            data2.yearTab = ap_queryAndDownload.CONFIG.active_year_tab;
            data2.year_list = year_list;
            data2.start_date = start_date;
            data2.end_date = end_date;
////        setInterval(function(){ap_queryAndDownload.exportShareGroupData(data2, 'ShareGroupData');},5000);
            ap_queryAndDownload.exportShareGroupData(data2, 'ShareGroupData');
        }



//        $.when(ap_queryAndDownload.exportPlainData(data, 'AllData')).done(function( x ) {
//            console.log("Before share group data");
//            var data2 = ap_policyDataObject.init();
//            data2.datasource = ap_queryAndDownload.CONFIG.datasource;
//            data2.policy_domain_code = policy_domain_code;
//            data2.commodity_domain_code = commodity_domain_code;
//            data2.commodity_class_code = commodity_class_code;
//            data2.policy_type_code = policy_type_code;
//            data2.policy_measure_code = policy_measure_code;
//            data2.country_code = country_code;
//            //it could be 'slider' or 'classic'
//            data2.yearTab = ap_queryAndDownload.CONFIG.active_year_tab;
//            data2.year_list = year_list;
//            data2.start_date = start_date;
//            data2.end_date = end_date;
//            ap_queryAndDownload.exportShareGroupData(data2, 'ShareGroupData');
//        });


       // console.log("Before share group data 2");


    }


//    function build_splitter(){
//
//        // prepare the data
//        var data = new Array();
//        var firstNames = ["Nancy", "Andrew", "Janet", "Margaret", "Steven", "Michael", "Robert", "Laura", "Anne"];
//        var lastNames = ["Davolio", "Fuller", "Leverling", "Peacock", "Buchanan", "Suyama", "King", "Callahan", "Dodsworth"];
//        var titles = ["Sales Representative", "Vice President, Sales", "Sales Representative", "Sales Representative", "Sales Manager", "Sales Representative", "Sales Representative", "Inside Sales Coordinator", "Sales Representative"];
//        var titleofcourtesy = ["Ms.", "Dr.", "Ms.", "Mrs.", "Mr.", "Mr.", "Mr.", "Ms.", "Ms."];
//        var birthdate = ["08-Dec-48", "19-Feb-52", "30-Aug-63", "19-Sep-37", "04-Mar-55", "02-Jul-63", "29-May-60", "09-Jan-58", "27-Jan-66"];
//        var hiredate = ["01-May-92", "14-Aug-92", "01-Apr-92", "03-May-93", "17-Oct-93", "17-Oct-93", "02-Jan-94", "05-Mar-94", "15-Nov-94"];
//        var address = ["507 - 20th Ave. E. Apt. 2A", "908 W. Capital Way", "722 Moss Bay Blvd.", "4110 Old Redmond Rd.", "14 Garrett Hill", "Coventry House", "Miner Rd.", "Edgeham Hollow", "Winchester Way", "4726 - 11th Ave. N.E.", "7 Houndstooth Rd."];
//        var city = ["Seattle", "Tacoma", "Kirkland", "Redmond", "London", "London", "London", "Seattle", "London"];
//        var postalcode = ["98122", "98401", "98033", "98052", "SW1 8JR", "EC2 7JR", "RG1 9SP", "98105", "WG2 7LT"];
//        var country = ["USA", "USA", "USA", "USA", "UK", "UK", "UK", "USA", "UK"];
//        var homephone = ["(206) 555-9857", "(206) 555-9482", "(206) 555-3412", "(206) 555-8122", "(71) 555-4848", "(71) 555-7773", "(71) 555-5598", "(206) 555-1189", "(71) 555-4444"];
//        var notes = ["Education includes a BA in psychology from Colorado State University in 1970.  She also completed 'The Art of the Cold Call.'  Nancy is a member of Toastmasters International.",
//            "Andrew received his BTS commercial in 1974 and a Ph.D. in international marketing from the University of Dallas in 1981.  He is fluent in French and Italian and reads German.  He joined the company as a sales representative, was promoted to sales manager in January 1992 and to vice president of sales in March 1993.  Andrew is a member of the Sales Management Roundtable, the Seattle Chamber of Commerce, and the Pacific Rim Importers Association.",
//            "Janet has a BS degree in chemistry from Boston College (1984).  She has also completed a certificate program in food retailing management.  Janet was hired as a sales associate in 1991 and promoted to sales representative in February 1992.",
//            "Margaret holds a BA in English literature from Concordia College (1958) and an MA from the American Institute of Culinary Arts (1966).  She was assigned to the London office temporarily from July through November 1992.",
//            "Steven Buchanan graduated from St. Andrews University, Scotland, with a BSC degree in 1976.  Upon joining the company as a sales representative in 1992, he spent 6 months in an orientation program at the Seattle office and then returned to his permanent post in London.  He was promoted to sales manager in March 1993.  Mr. Buchanan has completed the courses 'Successful Telemarketing' and 'International Sales Management.'  He is fluent in French.",
//            "Michael is a graduate of Sussex University (MA, economics, 1983) and the University of California at Los Angeles (MBA, marketing, 1986).  He has also taken the courses 'Multi-Cultural Selling' and 'Time Management for the Sales Professional.'  He is fluent in Japanese and can read and write French, Portuguese, and Spanish.",
//            "Robert King served in the Peace Corps and traveled extensively before completing his degree in English at the University of Michigan in 1992, the year he joined the company.  After completing a course entitled 'Selling in Europe,' he was transferred to the London office in March 1993.",
//            "Laura received a BA in psychology from the University of Washington. She has also completed a course in business French.  She reads and writes French.",
//            "Anne has a BA degree in English from St. Lawrence College.  She is fluent in French and German."];
//        var k = 0;
//        for (var i = 0; i < firstNames.length; i++) {
//            var row = {};
//            row["firstname"] = firstNames[k];
//            row["lastname"] = lastNames[k];
//            row["title"] = titles[k];
//            row["titleofcourtesy"] = titleofcourtesy[k];
//            row["birthdate"] = birthdate[k];
//            row["hiredate"] = hiredate[k];
//            row["address"] = address[k];
//            row["city"] = city[k];
//            row["postalcode"] = postalcode[k];
//            row["country"] = country[k];
//            row["homephone"] = homephone[k];
//            row["notes"] = notes[k];
//            data[i] = row;
//            k++;
//        }
//        var dataList = new Array();
//        for (var i = 0; i < ap_queryAndDownload.CONFIG.cpl_id_list.length; i++) {
//            var row = {};
//            row["cpl_id"] = ap_queryAndDownload.CONFIG.cpl_id_list[i];
//            dataList[i] = row;
//        }
//        var source =
//        {
//            localdata: dataList,
//            datatype: "array"
//        };
//
//        var dataAdapter = new $.jqx.dataAdapter(source);
//        var updatePanel = function (index) {
//            var container = $('<div style="margin: 5px;"></div>')
//            var leftcolumn = $('<div style="float: left; width: 100%;"></div>');
//            //var rightcolumn = $('<div style="float: left; width: 40%;"></div>');
//            container.append(leftcolumn);
//           // container.append(rightcolumn);
//            var datarecord = data[index];
//            var firstname = "<div style='margin: 10px;'><b>First Name:</b> " + datarecord.firstname + "</div>";
//            var lastname = "<div style='margin: 10px;'><b>Last Name:</b> " + datarecord.lastname + "</div>";
//            var title = "<div style='margin: 10px;'><b>Title:</b> " + datarecord.title + "</div>";
//            var address = "<div style='margin: 10px;'><b>Address:</b> " + datarecord.address + "</div>";
//            var cpl_id =  "<div style='margin: 10px;'><b>Cpl_id:</b> " + dataList[index].cpl_id + "</div>";
//            $(leftcolumn).append(firstname);
//            $(leftcolumn).append(lastname);
//            $(leftcolumn).append(title);
//            $(leftcolumn).append(address);
//
//            var postalcode = "<div style='margin: 10px;'><b>Postal Code:</b> " + datarecord.postalcode + "</div>";
//            var city = "<div style='margin: 10px;'><b>City:</b> " + datarecord.city + "</div>";
//            var phone = "<div style='margin: 10px;'><b>Phone:</b> " + datarecord.homephone + "</div>";
//            var hiredate = "<div style='margin: 10px;'><b>Hire Date:</b> " + datarecord.hiredate + "</div>";
////            $(rightcolumn).append(postalcode);
////            $(rightcolumn).append(city);
////            $(rightcolumn).append(phone);
////            $(rightcolumn).append(hiredate);
//           // var education = "<div style='clear: both; margin: 10px;'><div><b>Education</b></div><div>" +  $('#listbox').jqxListBox('getItem', index).value + "</div></div>";
//           // container.append(education);
//            var button = "<div style='margin: 10px;'><input type='button' value="+$.i18n.prop('_showMetadata_button') +" id='jqxButton' /></div>";
//            container.append(button);
//            $("#ContentPanel").html(container.html());
//            $("#jqxButton").jqxButton({ width: '150'});
//        }
//        $('#listbox').on('select', function (event) {
//            updatePanel(event.args.index);
//        });
//
//        // Create jqxListBox
//        $('#listbox').jqxListBox({ selectedIndex: 0,  source: dataAdapter, displayMember: "cpl_id", valueMember: "cpl_id", itemHeight: 70, height: '100%', width: '100%',
//            renderer: function (index, label, value) {
//                var datarecord = dataList[index];
//                //var imgurl = '../../images/' + label.toLowerCase() + '.png';
//                //var img = '<img height="50" width="40" src="' + imgurl + '"/>';
////                var table = '<table style="min-width: 130px;"><tr><td style="width: 40px;" rowspan="2">' + img + '</td><td>' + datarecord.firstname + " " + datarecord.lastname + '</td></tr><tr><td>' + datarecord.title + '</td></tr></table>';
////                var table = '<table style="min-width: 130px;"><tr><td>' + datarecord.firstname + " " + datarecord.lastname + '</td></tr><tr><td>' + datarecord.title + '</td></tr></table>';
//                var table = '<table style="min-width: 130px;"><tr><td>' + datarecord.cpl_id + '</td></tr></table>';
//
//                return table;
//            }
//        });
//        updatePanel(0);
//
//    }

    function build_splitter(){

        // prepare the data
        var data = new Array();
        var k = 0;
        // alert(" ap_masterTableObject.CONFIG.commodity_id "+ap_masterTableObject.CONFIG.commodity_id);
       // alert(" ap_masterTableObject.CONFIG.cpl_id "+ap_masterTableObject.CONFIG.cpl_id);
       // alert(" ap_queryAndDownload.CONFIG.cpl_id_list "+ap_queryAndDownload.CONFIG.cpl_id_list);

        //alert("ApMaster len "+ap_masterTableObject.CONFIG.cpl_id.length+"Apquery len "+ap_queryAndDownload.CONFIG.cpl_id_list.length);
//        for (var i = 0; i < ap_queryAndDownload.CONFIG.cpl_id_list.length; i++) {
        for (var i = 0; i < ap_masterTableObject.CONFIG.cpl_id.length; i++) {
            var row = {};
            //row["metadataId"] = ap_masterTableObject.CONFIG.metadata_id[i];
            //row["cplId"] = ap_queryAndDownload.CONFIG.cpl_id_list[i];
            row["cplId"] = ap_masterTableObject.CONFIG.cpl_id[i];
            row["cplCode"] = ap_masterTableObject.CONFIG.cpl_code[i];
            row["commodityId"] = ap_masterTableObject.CONFIG.commodity_id[i];
            row["countryCode"] = ap_masterTableObject.CONFIG.country_code[i];
            row["countryName"] = ap_masterTableObject.CONFIG.country_name[i];
            row["subnationalCode"] = ap_masterTableObject.CONFIG.subnational_code[i];
            row["subnationalName"] = ap_masterTableObject.CONFIG.subnational_name[i];
            row["commodityDomainCode"] = ap_masterTableObject.CONFIG.commoditydomain_code[i];
            row["commodityDomainName"] = ap_masterTableObject.CONFIG.commoditydomain_name[i];
            row["commodityClassCode"] = ap_masterTableObject.CONFIG.commodityclass_code[i];
            row["commodityClassName"] = ap_masterTableObject.CONFIG.commodityclass_name[i];
            row["policyDomainCode"] = ap_masterTableObject.CONFIG.policydomain_code[i];
            row["policyDomainName"] = ap_masterTableObject.CONFIG.policydomain_name[i];
            row["policyTypeCode"] = ap_masterTableObject.CONFIG.policytype_code[i];
            row["policyTypeName"] = ap_masterTableObject.CONFIG.policytype_name[i];
            row["policyMeasureCode"] = ap_masterTableObject.CONFIG.policymeasure_code[i];
            row["policyMeasureName"] = ap_masterTableObject.CONFIG.policymeasure_name[i];
            //This is condition not policycondition
            row["policyConditionCode"] = ap_masterTableObject.CONFIG.condition_code[i];
            row["policyCondition"] = ap_masterTableObject.CONFIG.condition[i];
            row["individualPolicyConditionCode"] = ap_masterTableObject.CONFIG.individualpolicy_code[i];
            row["individualPolicyCondition"] = ap_masterTableObject.CONFIG.individualpolicy_name[i];

            var condition_code = [];
            var condition = [];
            var individualpolicy_code = [];
            var individualpolicy_name = [];
            data[i] = row;
            k++;
        }
        var source =
        {
            localdata: data,
            datatype: "array"
        };

        var dataAdapter = new $.jqx.dataAdapter(source);
        var updatePanel = function (index) {
          //  console.log("listbox index "+index);
            var container = $('<div style="margin: 5px; "></div>')
            var leftcolumn = $('<div style="float: left; width: 100%;"></div>');
            //var rightcolumn = $('<div style="float: left; width: 40%;"></div>');
            container.append(leftcolumn);
            // container.append(rightcolumn);
            var datarecord = data[index];


            //var cplId = "<div style='margin: 10px;'><b>"+$.i18n.prop('_cpl_id') +":</b> " + datarecord.cplId + "</div>";
            //$(leftcolumn).append(cplId);
            //var cplCode = "<div style='margin: 10px;'><b>"+$.i18n.prop('_cpl_code') +":</b> " + datarecord.cplId + "</div>";
            //$(leftcolumn).append(cplCode);
            //var commodityId = "<div style='margin: 10px;'><b>"+$.i18n.prop('_commodity_id') +":</b> " + datarecord.commodityId + "</div>";
            //$(leftcolumn).append(commodityId);
            //var countryCode = "<div style='margin: 10px;'><b>"+$.i18n.prop('_country_code') +":</b> " + datarecord.countryCode + "</div>";
            //$(leftcolumn).append(countryCode);
            var countryName = "<div style='margin: 10px;'><b>"+$.i18n.prop('_country_name') +":</b> " + datarecord.countryName + "</div>";
            $(leftcolumn).append(countryName);
            //var subnationalCode = "<div style='margin: 10px;'><b>"+$.i18n.prop('_subnational_level') +":</b> " + datarecord.subnationalCode + "</div>";
            //$(leftcolumn).append(subnationalCode);
           if(datarecord.subnationalName != 'none')
           {
                var subnationalName = "<div style='margin: 10px;'><b>"+$.i18n.prop('_subnational_name') +":</b> " + datarecord.subnationalName + "</div>";
                $(leftcolumn).append(subnationalName);
            }
            //var commodityDomainCode = "<div style='margin: 10px;'><b>"+$.i18n.prop('_commodity_domain_code') +":</b> " + datarecord.commodityDomainCode + "</div>";
            //$(leftcolumn).append(commodityDomainCode);
            var commodityDomainName = "<div style='margin: 10px;'><b>"+$.i18n.prop('_commodity_domain_name') +":</b> " + datarecord.commodityDomainName + "</div>";
            $(leftcolumn).append(commodityDomainName);
            //var commodityClassCode = "<div style='margin: 10px;'><b>"+$.i18n.prop('_commodity_class_code') +":</b> " + datarecord.commodityClassCode + "</div>";
            //$(leftcolumn).append(commodityClassCode);
            var commodityClassName = "<div style='margin: 10px;'><b>"+$.i18n.prop('_commodity_class_name') +":</b> " + datarecord.commodityClassName + "</div>";
            $(leftcolumn).append(commodityClassName);
            //var policyDomainCode = "<div style='margin: 10px;'><b>"+$.i18n.prop('_policy_domain_code') +":</b> " + datarecord.policyDomainCode + "</div>";
            //$(leftcolumn).append(policyDomainCode);
            var policyDomainName = "<div style='margin: 10px;'><b>"+$.i18n.prop('_policy_domain_name') +":</b> " + datarecord.policyDomainName + "</div>";
            $(leftcolumn).append(policyDomainName);
            var policyTypeCode = "<div style='margin: 10px;'><b>"+$.i18n.prop('_policy_type_code') +":</b> " + datarecord.policyTypeCode + "</div>";
            //$(leftcolumn).append(policyTypeCode);
            var policyTypeName = "<div style='margin: 10px;'><b>"+$.i18n.prop('_policy_type_name') +":</b> " + datarecord.policyTypeName + "</div>";
            $(leftcolumn).append(policyTypeName);
            //var policyMeasureCode = "<div style='margin: 10px;'><b>"+$.i18n.prop('_policy_measure_code') +":</b> " + datarecord.policyMeasureCode + "</div>";
            //$(leftcolumn).append(policyMeasureCode);
            var policyMeasureName = "<div style='margin: 10px;'><b>"+$.i18n.prop('_policy_measure_name') +":</b> " + datarecord.policyMeasureName + "</div>";
            $(leftcolumn).append(policyMeasureName);
            var condition = "<div style='margin: 10px;'><b>"+$.i18n.prop('_condition') +":</b> " + datarecord.policyCondition + "</div>";
            $(leftcolumn).append(condition);
            var individualPolicyCondition = "<div style='margin: 10px;'><b>"+$.i18n.prop('_individualPolicyCondition') +":</b> " + datarecord.individualPolicyCondition + "</div>";
            $(leftcolumn).append(individualPolicyCondition);

            // var education = "<div style='clear: both; margin: 10px;'><div><b>Education</b></div><div>" +  $('#listbox').jqxListBox('getItem', index).value + "</div></div>";
            // container.append(education);
//            var button = "<div style='margin: 10px;'><input type='button' value="+$.i18n.prop('_showMetadata_button') +" id='metadataButton' /></div>";
//            container.append(button);
//            var fullscreen = "<div id='fullscreen' style='background-color: #FFFFFF; width:100%; height: 100%;'>fsd</div>";
//
//            var s = "";    //onclick='ap_queryAndDownload.preview_button();'
//            s += "<div class='row'>";
//            s += "<div class='col-xs-12 col-sm-12 col-md-10 col-lg-10'>";
//            s += "&nbsp;";
//            s += "</div>";
//            s += "<div class='col-xs-12 col-sm-12 col-md-1 col-lg-1'>";
//            s += "<button class='btn btn-sm btn-primary' id='close_fullscreen_button' type='button' style='width: 100%;' >";
//            s += "<span class='glyphicon glyphicon-eye-open'></span>";
//            s += " " + $.i18n.prop('_close_fullscreen');
//            s += "</button>";
//            s += "</div>";
//            s += "<div class='col-xs-12 col-sm-12 col-md-1 col-lg-1'>";
//            s += "&nbsp;";
//            s += "</div>";
//            s += "</div>";
////            $('#close_fullscreen_button').on('click', function () {
////                alert("Close full screen clicked");
////                $('#fullscreen').fullScreen(false);
////            });
//
//            container.append(fullscreen);
//           $('#fullscreen').append(s);
//            var window = '<div id="MetadataMasterWindow"><div id="MetadataMasterWindowHeader"></div> <div style="overflow: hidden;" id="MetadataMasterWindowContent"></div></div>';
//            container.append(window);
            $("#ContentPanel").html(container.html());
            //$("#metadataButton").jqxButton({ width: '30%'});
//            var width = $(window).width();
//            var height = $(window).height();
//            ap_queryAndDownload.fullscreen('metadataButton', 'fullscreen');
          //  ap_fullScreen.fullscreen('metadataButton','fullscreen');

//            $('#metadataButton').on('click', function () {
//                //alert("Button clicked");
//                $('#fullscreen').css("display", "block");
//
//                $('#fullscreen').fullScreen(true);
//
//               // $('#fullscreen').show();
////                var fsElement = document.getElementById('fullscreen');
////                alert("Button clicked fsElement"+fsElement);
////                if (window.fullScreenApi.supportsFullScreen) {
////                    alert("Found full screen support ");
////                    window.fullScreenApi.requestFullScreen(fsElement);
////                }
////                else{
////                    alert("No full screen");
////                }
//            });

//            if (window.fullScreenApi.supportsFullScreen) {
//                $('#' + idButton).on('click', function () {
//
//                });
//            } else {
//                //alert('is not supported the full screen on your browser')
//            }

//            $("#jqxButton").on('click', function () {
////                $('#MetadataMasterWindow').jqxWindow({
////                    animationType: 'slide', showCollapseButton: true,  maxHeight: height + 100, maxWidth: width + 100, height: height, width: width, autoOpen: false, isModal: true,
////                   // showCollapseButton: true, maxHeight: 400, maxWidth: 700, minHeight: 200, minWidth: 200, height: 300, width: 500,
////                    initContent: function () {
////                       // $('#tab').jqxTabs({ height: '100%', width:  '100%' });
////                        $('#MetadataMasterWindow').jqxWindow('focus');
////                    }
////                });
////                $('#MetadataMasterWindow').jqxWindow('open');
//            });
        }
        var time_load = 'firstLoad';
        $('#listbox').on('select', function (event) {
           // alert("event.args.index "+event.args.index);
            updatePanel(event.args.index);
            //Destroy the Share Group Grid
           // $('#shareGroupGrid').jqxGrid('destroy');
           // $("#shareGroupGrid").empty();
            var start_date = "";
            var end_date = "";
            var year_list = "";
           // alert("year tab "+ap_queryAndDownload.CONFIG.active_year_tab);
            if(ap_queryAndDownload.CONFIG.active_year_tab == 'slider')
            {
                //11/03/2014
                var start_date_app = ap_queryAndDownload.CONFIG.slider_start_date_selected;
                var index = start_date_app.indexOf('/');
                var start_date_dd = start_date_app.substring(0,index);
                //03/2014
                start_date_app = start_date_app.substring(index+1);
                index = start_date_app.indexOf('/');
                var start_date_mm = start_date_app.substring(0,index);
                //2014
                start_date_app = start_date_app.substring(index+1);
                var start_date_yy = start_date_app;
                var end_date_app = ap_queryAndDownload.CONFIG.slider_end_date_selected;
                var index = end_date_app.indexOf('/');
                var end_date_dd = end_date_app.substring(0,index);
                //03/2014
                end_date_app = end_date_app.substring(index+1);
                index = end_date_app.indexOf('/');
                var end_date_mm = end_date_app.substring(0,index);
                //2014
                end_date_app = end_date_app.substring(index+1);
                var end_date_yy = end_date_app;
                start_date = start_date_yy+"-"+start_date_mm+"-"+start_date_dd;
                end_date = end_date_yy+"-"+end_date_mm+"-"+end_date_dd;
            //    console.log("ap_queryAndDownload.CONFIG.slider_start_date_selected = "+ap_queryAndDownload.CONFIG.slider_start_date_selected + " ap_queryAndDownload.CONFIG.slider_end_date_selected "+ap_queryAndDownload.CONFIG.slider_end_date_selected);
            }
            else{
                //If it's classic
                //Getting codes from the Policy Measures selection
                obj = ap_queryAndDownload.CONFIG.selection_map['Years'];
                //Case Select All
                if(obj.elements_value[0]==true)
                {
                    for(var i=1; i<obj.elements_value.length; i++)
                    {
                        if(year_list.length>0)
                        {
                            year_list += ", ";
                        }
                        year_list += obj.elements_name[i];
                    }
                }
                else
                {
                    for(var i=1; i<obj.elements_value.length; i++)
                    {
                        if(obj.elements_value[i]==true)
                        {
                            if(year_list.length>0)
                            {
                                year_list += ", ";
                            }
                            year_list += obj.elements_name[i];
                        }
                    }
                }
            //    console.log("year_list "+year_list);
            }
           // time_load = 'otherLoad';
            ap_queryAndDownload.buildShareGroupPolicyTables(event.args.index, time_load, start_date, end_date, year_list);
            time_load = 'otherLoad';
        });

        // Create jqxListBox
        $('#listbox').jqxListBox({ selectedIndex: 0,  source: dataAdapter, displayMember: "cplCode", valueMember: "cplCode", itemHeight: 30, height: '100%', width: '100%',
            renderer: function (index, label, value) {
                var datarecord = data[index];
                //var imgurl = '../../images/' + label.toLowerCase() + '.png';
                //var img = '<img height="50" width="40" src="' + imgurl + '"/>';
//                var table = '<table style="min-width: 130px;"><tr><td style="width: 40px;" rowspan="2">' + img + '</td><td>' + datarecord.firstname + " " + datarecord.lastname + '</td></tr><tr><td>' + datarecord.title + '</td></tr></table>';
//                var table = '<table style="min-width: 130px;"><tr><td>' + datarecord.firstname + " " + datarecord.lastname + '</td></tr><tr><td>' + datarecord.title + '</td></tr></table>';
                //var table = '<table><tr><td>' + datarecord.cplCode + '</td></tr></table>';
                var table = datarecord.cplCode;
                return table;
            }
        });
       // alert("Before update");
        updatePanel(0);

    }

    //commodity_id, target_code, description
    function build_shareGroupGrid(load){
     //   console.log("build_shareGroupGrid start ");
        var data = new Array();
//        var commodity_id =
//            [
//                "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"
//            ];
//        var target_code =
//            [
//                "Maize", "Wheat", "Rice", "Biofuel", "Biodisel", "RiceMilled", "RicePaddy", "Wheat2", "Rice2", "Maize3"
//            ];
//        var description =
//            [
//                "MaizeMaizeg sfdgfdgdfgd fgdffgdrggdfgdf gdffgdfgdfgrrrrrrrrrrrt", "WheatMaize", "RiceMaize", "BiofuelMaize", "BiodiselMaize", "RiceMilledMaize", "RicePaddyMaize", "Wheat2Maize", "Rice2Maize", "Maize3Maize"
//            ];
//
//        for (var i = 0; i < 10; i++) {
//            var row = {};
//            row["commodity_id"] = commodity_id[i];
//            row["target_code"] = target_code[i];
//            row["description"] = description[i];
//            data[i] = row;
//        }

        for (var i = 0; i < ap_commodityShareGroupObject.CONFIG.hs_code.length; i++) {
            var row = {};
//            row["commodity_id"] = ap_commodityShareGroupObject.CONFIG.commodity_id[i];
            row["hs_code"] = ap_commodityShareGroupObject.CONFIG.hs_code[i];
            row["hs_suffix"] = ap_commodityShareGroupObject.CONFIG.hs_suffix[i];
            row["hs_version"] = ap_commodityShareGroupObject.CONFIG.hs_version[i];
            row["short_description"] = ap_commodityShareGroupObject.CONFIG.short_description[i];
            //  console.log("row[commodity_id] "+row["commodity_id"]+" row[target_code] "+row["target_code"]+" row[description] "+row["description"]);
            data[i] = row;
        }
//        for (var i = 0; i < ap_commodityShareGroupObject.CONFIG.commodity_id.length; i++) {
//            var row = {};
////            row["commodity_id"] = ap_commodityShareGroupObject.CONFIG.commodity_id[i];
//            row["target_code"] = ap_commodityShareGroupObject.CONFIG.target_code[i];
//            row["description"] = ap_commodityShareGroupObject.CONFIG.description[i];
//          //  console.log("row[commodity_id] "+row["commodity_id"]+" row[target_code] "+row["target_code"]+" row[description] "+row["description"]);
//            data[i] = row;
//        }

        var source =
        {
            localdata: data,
            datatype: "array",
            datafields:
                [
//                    { name: 'commodity_id', type: 'string' },
                    { name: 'hs_code', type: 'string' },
                    { name: 'hs_suffix', type: 'string' },
                    { name: 'hs_version', type: 'string' },
                    { name: 'short_description', type: 'string' }
                ]
        };

        var dataAdapter = new $.jqx.dataAdapter(source);
        var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
            return '<div style="white-space: normal;">' + value + '</div>';
        }
      //  console.log("build_shareGroupGrid before shareGroupGrid build ");
        var columnsrenderer = function (value) {
            return '<div style="text-align: center; margin: 1px;">' + value + '</div>';
        }
        $("#shareGroupGrid").jqxGrid(
            {
                width: '100%',
                height: 200,
                columnsheight: 40,
                //autoheight:true,
                //autorowheight: true,
                rowsheight : 30,
                source: dataAdapter,
                columnsresize: true,
                enabletooltips: true,

//                //height: '100%',
//                autoheight:true,
//                autorowheight: true,
//                source: dataAdapter,
//                columnsresize: true,
                columns: [
                   // { text: $.i18n.prop('_commodity_id'), dataField: 'commodity_id', width: '20%', renderer: columnsrenderer},
                    { text: $.i18n.prop('_hs_code'), dataField: 'hs_code', width: '20%', renderer: columnsrenderer},
                    { text: $.i18n.prop('_hs_suffix'), dataField: 'hs_suffix', width: '10%', renderer: columnsrenderer},
                    { text: $.i18n.prop('_hs_version'), dataField: 'hs_version', width: '20%', renderer: columnsrenderer},
                    { text: $.i18n.prop('_short_description'), dataField: 'short_description', width: '50%', renderer: columnsrenderer}
                ]
            });
        //inizio
//        var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
//            return '<div style="white-space: normal;">' + value + '</div>';
//        }
//
//        console.log("build_policyTableGrid before policyTableOneGrid build ");
//        if(load == 'firstLoad')
//        {
//            console.log("firstLoad!!!");
//            $("#policyTableOneGrid").jqxGrid(
//                {
//                    width: '100%',
//                    height: 200,
//                    columnsheight: 40,
//                    //autoheight:true,
//                    //autorowheight: true,
//                    rowsheight : 30,
//                    source: dataAdapter,
//                    columnsresize: true,
//                    enabletooltips: true,
//                    columns: [
//                        { text: $.i18n.prop('_hs_version'), dataField: 'hs_version', width: '10%', renderer: columnsrenderer },
//                        { text: $.i18n.prop('_hs_code'), dataField: 'hs_code', width: '10%', renderer: columnsrenderer },
//                        { text: $.i18n.prop('_hs_suffix'), dataField: 'hs_suffix', width: '10%', renderer: columnsrenderer },
//                        { text: $.i18n.prop('_shared_group_code'), dataField: 'shared_group_code', width: '10%', renderer: columnsrenderer },
//                        { text: $.i18n.prop('_start_date'), dataField: 'start_date', width: '10%', renderer: columnsrenderer },
//                        { text: $.i18n.prop('_end_date'), dataField: 'end_date', width: '10%', renderer: columnsrenderer },
//                        { text: $.i18n.prop('_units'), dataField: 'units', width: '10%', renderer: columnsrenderer },
//                        { text: $.i18n.prop('_value'), dataField: 'value', width: '10%', renderer: columnsrenderer },
//                        { text: $.i18n.prop('_value_text'), dataField: 'value_text', width: '10%', renderer: columnsrenderer },
//                        { text: $.i18n.prop('_commodity_description'), dataField: 'commodity_description', width: '10%', renderer: columnsrenderer }
//                    ]
//                });//fine
      //  console.log("build_shareGroupGrid before shareGroupGrid before refresh ");
        $("#shareGroupGrid").jqxGrid('refresh');
    }

    function build_policyTableGrid(commodity_index, load, start_date, end_date, year_list){

        var data = ap_policyDataObject.init();
        data.datasource = ap_queryAndDownload.CONFIG.datasource;
//        data.cpl_id = '254';ap_masterTableObject
        //it could be 'slider' or 'classic'
//        data.cpl_id = ''+ap_queryAndDownload.CONFIG.cpl_id_list[commodity_index];
        data.cpl_id = ''+ap_masterTableObject.CONFIG.cpl_id[commodity_index];
        data.commodity_id = ''+ap_masterTableObject.CONFIG.commodity_id[commodity_index];
       // alert("data.cpl_id "+data.cpl_id);
        //console.log("ap_queryAndDownload.CONFIG.cpl_id_list "+ap_queryAndDownload.CONFIG.cpl_id_list);
       // console.log("ap_masterTableObject.CONFIG.cpl_id "+ap_masterTableObject.CONFIG.cpl_id);
       // alert("build_policyTableGrid commodity_index "+commodity_index+" cpl_id= "+data.cpl_id);
        data.yearTab = ap_queryAndDownload.CONFIG.active_year_tab;
        data.year_list = year_list;
        data.start_date = start_date;
        data.end_date = end_date;
        var payloadrest = JSON.stringify(data);

        console.log("Before Policy Table Start");
        console.log("data.datasource = "+data.datasource);
        console.log("data.cpl_id = "+data.cpl_id);
        console.log("data.commodity_id = "+data.commodity_id);
        console.log("data.yearTab = "+data.yearTab);
        console.log("data.year_list = "+data.year_list);
        console.log("data.start_date = "+data.start_date);
        console.log("data.end_date = "+data.end_date);
        console.log("Before Policy Table End");

       // console.log("build_policyTableGrid start ");
        $.ajax({

            type: 'POST',
//          url: ap_queryAndDownload.CONFIG.shareGroupCommodities_url+ '/' + ap_queryAndDownload.CONFIG.datasource+ '/' +ap_masterTableObject.CONFIG.commodity_id[commodity_index],
            url: 'http://'+ap_queryAndDownload.CONFIG.base_ip_address+':'+ap_queryAndDownload.CONFIG.base_ip_port+ap_queryAndDownload.CONFIG.policyTable_url,
//            url: ap_queryAndDownload.CONFIG.policyTable_url,
            data : {"pdObj": payloadrest},

            success : function(response) {

                /* Convert the response in an object, i fneeded. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
                  //  console.log("json ***"+json+"***");

                var metadata_id = [];
                var policy_id = [];
                var cpl_id = [];
                var commodity_id = [];
                var hs_version = [];
                var hs_code = [];
                var hs_suffix = [];
                var policy_element = [];
                var start_date = [];
                var end_date = [];
                var units = [];
                var value = [];
                var value_text = [];
                var value_type = [];
                var exemptions = [];
                var location_condition = [];
                var notes = [];
                var link = [];
                var source = [];
                var title_of_notice = [];
                var legal_basis_name = [];
                var date_of_publication = [];
                var imposed_end_date = [];
                var second_generation_specific = [];
                var benchmark_tax = [];
                var benchmark_product = [];
                var tax_rate_biofuel = [];
                var tax_rate_benchmark = [];
                var start_date_tax = [];
                var benchmark_link = [];
                var original_dataset = [];
                var type_of_change_code = [];
                var type_of_change_name = [];
                var measure_descr = [];
                var product_original_hs = [];
                var product_original_name = [];
                var implementationprocedure = [];
                var xs_yeartype = [];
                var link_pdf = [];
                var benchmark_link_pdf = [];
                var short_description = [];
                var shared_group_code = [];

                for (var i = 0 ; i < json.length ; i++) {
                    for (var j = 0 ; j < json[i].length ; j++) {
                        if((json[i][j] == null)||(typeof json[i][j] == 'undefined')) {
                            json[i][j]="";
                        }
                        switch(j)
                        {
                            case 0:
                                metadata_id[i] = json[i][j];
                                break;
                            case 1:
                                policy_id[i] = json[i][j];
                                break;
                            case 2:
                                cpl_id[i] = json[i][j];
                                break;
                            case 3:
                                commodity_id[i] = json[i][j];
                                break;
                            case 4:
                                hs_version[i] = json[i][j];
                               // alert("hs_version "+hs_version[i]);
                                break;
                            case 5:
                                hs_code[i] = json[i][j];
                               // alert("hs_code "+hs_code[i]);
                                break;
                            case 6:
                                hs_suffix[i] = json[i][j];
                               // alert("hs_suffix "+hs_suffix[i]);
                                break;
                            case 7:
                                policy_element[i] = json[i][j];
                                break;
                            case 8:
                                start_date[i] = json[i][j];
                                break;
                            case 9:
                                end_date[i] = json[i][j];
                                break;
                            case 10:
                                units[i] = json[i][j];
                                break;
                            case 11:
                                value[i] = json[i][j];
                                break;
                            case 12:
                                value_text[i] = json[i][j];
                                break;
                            case 13:
                                value_type[i] = json[i][j];
                                break;
                            case 14:
                                exemptions[i] = json[i][j];
                                break;
                            case 15:
                                location_condition[i] = json[i][j];
                                break;
                            case 16:
                                notes[i] = json[i][j];
                                break;
                            case 17:
                                link[i] = json[i][j];
                                break;
                            case 18:
                                source[i] = json[i][j];
                                break;
                            case 19:
                                title_of_notice[i] = json[i][j];
                                break;
                            case 20:
                                legal_basis_name[i] = json[i][j];
                                break;
                            case 21:
                                date_of_publication[i] = json[i][j];
                                break;
                            case 22:
                                imposed_end_date[i] = json[i][j];
                                break;
                            case 23:
                                second_generation_specific[i] = json[i][j];
                                break;
                            case 24:
                                benchmark_tax[i] = json[i][j];
                                break;
                            case 25:
                                benchmark_product[i] = json[i][j];
                                break;
                            case 26:
                                tax_rate_biofuel[i] = json[i][j];
                                break;
                            case 27:
                                tax_rate_benchmark[i] = json[i][j];
                                break;
                            case 28:
                                start_date_tax[i] = json[i][j];
                                break;
                            case 29:
                                benchmark_link[i] = json[i][j];
                                break;
                            case 30:
                                original_dataset[i] = json[i][j];
                                break;
                            case 31:
                                type_of_change_code[i] = json[i][j];
                                break;
                            case 32:
                                type_of_change_name[i] = json[i][j];
                                break;
                            case 33:
                                measure_descr[i] = json[i][j];
                                break;
                            case 34:
                                product_original_hs[i] = json[i][j];
                                break;
                            case 35:
                                product_original_name[i] = json[i][j];
                                break;
                            case 36:
                                implementationprocedure[i] = json[i][j];
                                break;
                            case 37:
                                xs_yeartype[i] = json[i][j];
                                break;
                            case 38:
                                link_pdf[i] = json[i][j];
                                break;
                            case 39:
                                benchmark_link_pdf[i] = json[i][j];
                                break;
                            case 40:
                                short_description[i] = json[i][j];
                                break;
                            case 41:
                                shared_group_code[i] = json[i][j];
                                break;
                        }
                    }
                }
              //  console.log(" success build_policyTableGrid get");
             //   console.log(" "+json + " json[0] "+json[0][0]);
                ap_policyTableObject.init(metadata_id, policy_id, cpl_id, commodity_id, hs_version, hs_code, hs_suffix, policy_element, start_date, end_date, units, value, value_text,
                    value_type, exemptions, location_condition, notes, link, source, title_of_notice, legal_basis_name, date_of_publication, imposed_end_date,
                    second_generation_specific, benchmark_tax, benchmark_product, tax_rate_biofuel, tax_rate_benchmark, start_date_tax, benchmark_link,
                    original_dataset, type_of_change_code, type_of_change_name, measure_descr, product_original_hs, product_original_name,
                    implementationprocedure, xs_yeartype, link_pdf, benchmark_link_pdf, short_description, shared_group_code);
                var data = new Array();
//                var commodity_id =
//                    [
//                        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"
//                    ];
//                var target_code =
//                    [
//                        "Maize", "Wheat", "Rice", "Biofuel", "Biodisel", "RiceMilled", "RicePaddy", "Wheat2", "Rice2", "Maize3"
//                    ];
//                var description =
//                    [
//                        "MaizeMaizeg sfdgfdgdfgd fgdffgdrggdfgdf gdffgdfgdfgrrrrrrrrrrrt", "WheatMaize", "RiceMaize", "BiofuelMaize", "BiodiselMaize", "RiceMilledMaize", "RicePaddyMaize", "Wheat2Maize", "Rice2Maize", "Maize3Maize"
//                    ];

//                for (var i = 0; i < 10; i++) {
//                    var row = {};
//                    row["commodity_id"] = commodity_id[i];
//                    row["target_code"] = target_code[i];
//                    row["description"] = description[i];
//                    data[i] = row;
//                }
                //hs_version, hs_code, hs_suffix, shared_group_code, start_date, end_date, units, value, value_text, commodity_description
                for (var i = 0; i < ap_policyTableObject.CONFIG.metadata_id.length; i++) {
                    var row = {};
                    row["hs_version"] = ap_policyTableObject.CONFIG.hs_version[i];
                    row["hs_code"] = ap_policyTableObject.CONFIG.hs_code[i];
                    row["hs_suffix"] = ap_policyTableObject.CONFIG.hs_suffix[i];
                    row["shared_group_code"] = ap_policyTableObject.CONFIG.shared_group_code[i];
                    row["start_date"] = ap_policyTableObject.CONFIG.start_date[i];
                    row["end_date"] = ap_policyTableObject.CONFIG.end_date[i];
                    row["units"] = ap_policyTableObject.CONFIG.units[i];
                    if(ap_policyTableObject.CONFIG.value[0].length!=0)
                    {
                        //alert("value length not 0");
                        row["value"] = ap_policyTableObject.CONFIG.value[i];
                    }
                    else{
                        row["value_text"] = ap_policyTableObject.CONFIG.value_text[i];
                    }
                    row["short_description"] = ap_policyTableObject.CONFIG.short_description[i];
                    row["exemptions"] = ap_policyTableObject.CONFIG.exemptions[i];
                    row["policy_element"] = ap_policyTableObject.CONFIG.policy_element[i];
                    data[i] = row;
                }
                var source = "";
                if(ap_policyTableObject.CONFIG.value[0].length!=0)
                {
                    source =
                    {
                        localdata: data,
                        datatype: "array",
                        datafields:
                            [
                                { name: 'hs_version', type: 'string' },
                                { name: 'hs_code', type: 'string' },
                                { name: 'hs_suffix', type: 'string' },
                                { name: 'shared_group_code', type: 'string' },
                                { name: 'start_date', type: 'string' },
                                { name: 'end_date', type: 'string' },
                                { name: 'units', type: 'string' },
                                { name: 'value', type: 'string' },
                                { name: 'short_description', type: 'string' },
                                { name: 'exemptions', type: 'string' },
                                { name: 'policy_element', type: 'string' }
                            ]
                    };
                }
                else{
                    source =
                    {
                        localdata: data,
                        datatype: "array",
                        datafields:
                            [
                                { name: 'hs_version', type: 'string' },
                                { name: 'hs_code', type: 'string' },
                                { name: 'hs_suffix', type: 'string' },
                                { name: 'shared_group_code', type: 'string' },
                                { name: 'start_date', type: 'string' },
                                { name: 'end_date', type: 'string' },
                                { name: 'units', type: 'string' },
                                { name: 'value_text', type: 'string' },
                                { name: 'short_description', type: 'string' },
                                { name: 'exemptions', type: 'string' },
                                { name: 'policy_element', type: 'string' }
                            ]
                    };
                }
//                var source =
//                {
//                    localdata: data,
//                    datatype: "array",
//                    datafields:
//                        [
//                            { name: 'hs_version', type: 'string' },
//                            { name: 'hs_code', type: 'string' },
//                            { name: 'hs_suffix', type: 'string' },
//                            { name: 'shared_group_code', type: 'string' },
//                            { name: 'start_date', type: 'string' },
//                            { name: 'end_date', type: 'string' },
//                            { name: 'units', type: 'string' },
//                            { name: 'value', type: 'string' },
//                            { name: 'value_text', type: 'string' },
//                            { name: 'commodity_description', type: 'string' },
//                            { name: 'exemptions', type: 'string' },
//                            { name: 'policy_element', type: 'string' }
//                        ]
//                };

                var dataAdapter = new $.jqx.dataAdapter(source);
                var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
                    return '<div style="margin: 6px; white-space: normal; font-size: 12px;">' + value + '</div>';
                }

//                var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
//                    return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + '; font-size: 11px;">' + value + '</span>';
//                }

                var columnsrenderer = function (value) {
                    return '<div style="text-align: center; margin: 1px;">' + value + '</div>';
                }
             //   console.log("build_policyTableGrid before policyTableOneGrid build ");
                var col='';
//                if(ap_policyTableObject.CONFIG.value[0].length!=0)
//                if(ap_policyTableObject.CONFIG.value_text[0].length!=0)
//                {
//                    col = [
//                        { text: $.i18n.prop('_hs_version'), dataField: 'hs_version', width: '6%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                        { text: $.i18n.prop('_hs_code'), dataField: 'hs_code', width: '8%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                        { text: $.i18n.prop('_hs_suffix'), dataField: 'hs_suffix', width: '6%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                        { text: $.i18n.prop('_shared_group_code'), dataField: 'shared_group_code', width: '8%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                        { text: $.i18n.prop('_start_date'), dataField: 'start_date', width: '8%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                        { text: $.i18n.prop('_end_date'), dataField: 'end_date', width: '8%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                        { text: $.i18n.prop('_units'), dataField: 'units', width: '8%', renderer: columnsrenderer },
//                        { text: $.i18n.prop('_value_text'), dataField: 'value_text', width: '20%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                        { text: $.i18n.prop('_short_description'), dataField: 'short_description', width: '12%', renderer: columnsrenderer},
//                        { text: $.i18n.prop('_exemptions'), dataField: 'exemptions', width: '8%', renderer: columnsrenderer},
//                        { text: $.i18n.prop('_policy_element'), dataField: 'policy_element', width: '8%', renderer: columnsrenderer}
//                    ];
//                }
//                else{
//                    col = [
//                        { text: $.i18n.prop('_hs_version'), dataField: 'hs_version', width: '6%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                        { text: $.i18n.prop('_hs_code'), dataField: 'hs_code', width: '8%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                        { text: $.i18n.prop('_hs_suffix'), dataField: 'hs_suffix', width: '6%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                        { text: $.i18n.prop('_shared_group_code'), dataField: 'shared_group_code', width: '8%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                        { text: $.i18n.prop('_start_date'), dataField: 'start_date', width: '8%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                        { text: $.i18n.prop('_end_date'), dataField: 'end_date', width: '8%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                        { text: $.i18n.prop('_units'), dataField: 'units', width: '8%', renderer: columnsrenderer },
//                        { text: $.i18n.prop('_value'), dataField: 'value', width: '12%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                        { text: $.i18n.prop('_short_description'), dataField: 'short_description', width: '14%', renderer: columnsrenderer },
//                        { text: $.i18n.prop('_exemptions'), dataField: 'exemptions', width: '12%', renderer: columnsrenderer},
//                        { text: $.i18n.prop('_policy_element'), dataField: 'policy_element', width: '10%', renderer: columnsrenderer}
//                    ];
//                }
                if(ap_policyTableObject.CONFIG.value_text[0].length!=0)
                {
                    col = [
                        { text: $.i18n.prop('_hs_version'), dataField: 'hs_version', width: '6%', renderer: columnsrenderer },
                        { text: $.i18n.prop('_hs_code'), dataField: 'hs_code', width: '8%', renderer: columnsrenderer},
                        { text: $.i18n.prop('_hs_suffix'), dataField: 'hs_suffix', width: '4%', renderer: columnsrenderer },
                        { text: $.i18n.prop('_shared_group_code'), dataField: 'shared_group_code', width: '8%', renderer: columnsrenderer},
                        { text: $.i18n.prop('_start_date'), dataField: 'start_date', width: '8%', renderer: columnsrenderer},
                        { text: $.i18n.prop('_end_date'), dataField: 'end_date', width: '8%', renderer: columnsrenderer },
                        { text: $.i18n.prop('_units'), dataField: 'units', width: '8%', renderer: columnsrenderer },
                        { text: $.i18n.prop('_value_text'), dataField: 'value_text', width: '20%', renderer: columnsrenderer },
                        { text: $.i18n.prop('_short_description'), dataField: 'short_description', width: '12%', renderer: columnsrenderer},
                        { text: $.i18n.prop('_exemptions'), dataField: 'exemptions', width: '9%', renderer: columnsrenderer},
                        { text: $.i18n.prop('_policy_element'), dataField: 'policy_element', width: '9%', renderer: columnsrenderer}
                    ];
                }
                else{
                    col = [
                        { text: $.i18n.prop('_hs_version'), dataField: 'hs_version', width: '6%', renderer: columnsrenderer},
                        { text: $.i18n.prop('_hs_code'), dataField: 'hs_code', width: '8%', renderer: columnsrenderer},
                        { text: $.i18n.prop('_hs_suffix'), dataField: 'hs_suffix', width: '4%', renderer: columnsrenderer},
                        { text: $.i18n.prop('_shared_group_code'), dataField: 'shared_group_code', width: '8%', renderer: columnsrenderer },
                        { text: $.i18n.prop('_start_date'), dataField: 'start_date', width: '8%', renderer: columnsrenderer },
                        { text: $.i18n.prop('_end_date'), dataField: 'end_date', width: '8%', renderer: columnsrenderer },
                        { text: $.i18n.prop('_units'), dataField: 'units', width: '8%', renderer: columnsrenderer },
                        { text: $.i18n.prop('_value'), dataField: 'value', width: '12%', renderer: columnsrenderer},
                        { text: $.i18n.prop('_short_description'), dataField: 'short_description', width: '14%', renderer: columnsrenderer },
                        { text: $.i18n.prop('_exemptions'), dataField: 'exemptions', width: '13%', renderer: columnsrenderer},
                        { text: $.i18n.prop('_policy_element'), dataField: 'policy_element', width: '11%', renderer: columnsrenderer}
                    ];
                }

//                if(load == 'firstLoad')
//                {
//                    console.log("firstLoad!!!");
//                    $("#policyTableOneGrid").jqxGrid(
//                        {
//                            width: '100%',
//                            height: 200,
//                            columnsheight: 40,
//                            //autoheight:true,
//                            //autorowheight: true,
//                            rowsheight : 30,
//                            source: dataAdapter,
//                            columnsresize: true,
//                            enabletooltips: true,
////                            columns: [
////                                { text: $.i18n.prop('_hs_version'), dataField: 'hs_version', width: '6%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
////                                { text: $.i18n.prop('_hs_code'), dataField: 'hs_code', width: '6%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
////                                { text: $.i18n.prop('_hs_suffix'), dataField: 'hs_suffix', width: '8%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
////                                { text: $.i18n.prop('_shared_group_code'), dataField: 'shared_group_code', width: '8%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
////                                { text: $.i18n.prop('_start_date'), dataField: 'start_date', width: '8%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
////                                { text: $.i18n.prop('_end_date'), dataField: 'end_date', width: '8%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
////                                { text: $.i18n.prop('_units'), dataField: 'units', width: '8%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
////                                { text: $.i18n.prop('_value'), dataField: 'value', width: '10%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
////                                { text: $.i18n.prop('_value_text'), dataField: 'value_text', width: '10%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
////                                { text: $.i18n.prop('_commodity_description'), dataField: 'commodity_description', width: '10%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
////                                { text: $.i18n.prop('_exemptions'), dataField: 'exemptions', width: '10%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
////                                { text: $.i18n.prop('_policy_element'), dataField: 'policy_element', width: '10%', renderer: columnsrenderer, cellsrenderer: cellsrenderer }
////                            ]
//                            columns : col
//                        });
//                    $('#policyTableOneGrid').on('rowclick', function (event)
//                    {
//                        var args = event.args;
//                        var row = args.rowindex;
//                        //alert(row);
//                        updatePanel(row);
//                    });
//                }
//                else
//                {
//                    alert("col "+col);
//                    console.log("otherLoad!!!");
//                  //  console.log("build_policyTableGrid before policyTableOneGrid before refresh ");
//                    $("#policyTableOneGrid").jqxGrid({columns: col});
//                    $("#policyTableOneGrid").jqxGrid({source: dataAdapter});
//                    console.log("otherLoad end!!!");
//                }
               // $('#policyTableOneGrid').jqxGrid('destroy');

                $("#policyTableOneGrid").remove();
                var s ="<div id='policyTableOneGrid'></div>";
                $("#policyTableOneGridContainer").append(s);
                $("#policyTableOneGrid").jqxGrid(
                    {
                        width: '100%',
                        height: 200,
                        columnsheight: 40,
                        //autoheight:true,
                        //autorowheight: true,
                        rowsheight : 30,
                        source: dataAdapter,
                        columnsresize: true,
                        enabletooltips: true,
//                            columns: [
//                                { text: $.i18n.prop('_hs_version'), dataField: 'hs_version', width: '6%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                                { text: $.i18n.prop('_hs_code'), dataField: 'hs_code', width: '6%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                                { text: $.i18n.prop('_hs_suffix'), dataField: 'hs_suffix', width: '8%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                                { text: $.i18n.prop('_shared_group_code'), dataField: 'shared_group_code', width: '8%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                                { text: $.i18n.prop('_start_date'), dataField: 'start_date', width: '8%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                                { text: $.i18n.prop('_end_date'), dataField: 'end_date', width: '8%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                                { text: $.i18n.prop('_units'), dataField: 'units', width: '8%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                                { text: $.i18n.prop('_value'), dataField: 'value', width: '10%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                                { text: $.i18n.prop('_value_text'), dataField: 'value_text', width: '10%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                                { text: $.i18n.prop('_commodity_description'), dataField: 'commodity_description', width: '10%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                                { text: $.i18n.prop('_exemptions'), dataField: 'exemptions', width: '10%', renderer: columnsrenderer, cellsrenderer: cellsrenderer },
//                                { text: $.i18n.prop('_policy_element'), dataField: 'policy_element', width: '10%', renderer: columnsrenderer, cellsrenderer: cellsrenderer }
//                            ]
                        columns : col
                    });
                $('#policyTableOneGrid').on('rowclick', function (event)
                {
                    var args = event.args;
                    var row = args.rowindex;
                    //alert(row);
                    updatePanel(row);
                });

              //  console.log("build_policyTableGrid before policyTableGrid before refresh ");
              //  $('#policyTableOneGrid').jqxGrid({ columnsheight: 60});
                $("#policyTableOneGrid").jqxGrid('refresh');

                // prepare the data
                var dataPolicyTable = new Array();
                var k = 0;
              //  console.log("in policy table one cpl_id "+ap_policyTableObject.CONFIG.cpl_id);
                for (var i = 0; i < ap_policyTableObject.CONFIG.cpl_id.length; i++) {
                    var row = {};

                    row["metadata_id"] = ap_policyTableObject.CONFIG.metadata_id[i];
                    row["policy_id"] = ap_policyTableObject.CONFIG.policy_id[i];
                    row["cpl_id"] = ap_policyTableObject.CONFIG.cpl_id[i];
                    row["commodity_id"] = ap_policyTableObject.CONFIG.commodity_id[i];
                    row["hs_version"] = ap_policyTableObject.CONFIG.hs_version[i];
                    row["hs_code"] = ap_policyTableObject.CONFIG.hs_code[i];
                    row["hs_suffix"] = ap_policyTableObject.CONFIG.hs_suffix[i];
                    row["policy_element"] = ap_policyTableObject.CONFIG.policy_element[i];
                    row["start_date"] = ap_policyTableObject.CONFIG.start_date[i];
                    row["end_date"] = ap_policyTableObject.CONFIG.end_date[i];
                    row["units"] = ap_policyTableObject.CONFIG.units[i];
                    row["value"] = ap_policyTableObject.CONFIG.value[i];
                    row["value_text"] = ap_policyTableObject.CONFIG.value_text[i];
                    row["value_type"] = ap_policyTableObject.CONFIG.value_type[i];
                    row["exemptions"] = ap_policyTableObject.CONFIG.exemptions[i];
                    row["MinAVTariffValue"] = ap_policyTableObject.CONFIG.MinAVTariffValue[i];
                    row["notes"] = ap_policyTableObject.CONFIG.notes[i];
                    row["link"] = ap_policyTableObject.CONFIG.link[i];
                    row["source"] = ap_policyTableObject.CONFIG.source[i];
                    row["title_of_notice"] = ap_policyTableObject.CONFIG.title_of_notice[i];
                    row["legal_basis_name"] = ap_policyTableObject.CONFIG.legal_basis_name[i];
                    row["date_of_publication"] = ap_policyTableObject.CONFIG.date_of_publication[i];
                    row["imposed_end_date"] = ap_policyTableObject.CONFIG.imposed_end_date[i];
                    row["second_generation_specific"] = ap_policyTableObject.CONFIG.second_generation_specific[i];
                    row["benchmark_tax"] = ap_policyTableObject.CONFIG.benchmark_tax[i];
                    row["benchmark_product"] = ap_policyTableObject.CONFIG.benchmark_product[i];
                    row["tax_rate_biofuel"] = ap_policyTableObject.CONFIG.tax_rate_biofuel[i];
                    row["tax_rate_benchmark"] = ap_policyTableObject.CONFIG.tax_rate_benchmark[i];
                    row["start_date_tax"] = ap_policyTableObject.CONFIG.start_date_tax[i];
                    row["benchmark_link"] = ap_policyTableObject.CONFIG.benchmark_link[i];
                    row["original_dataset"] = ap_policyTableObject.CONFIG.original_dataset[i];
                    row["type_of_change_code"] = ap_policyTableObject.CONFIG.type_of_change_code[i];
                    row["type_of_change_name"] = ap_policyTableObject.CONFIG.type_of_change_name[i];
                    row["measure_description"] = ap_policyTableObject.CONFIG.measure_description[i];
                    row["product_original_hs"] = ap_policyTableObject.CONFIG.product_original_hs[i];
                    row["product_original_name"] = ap_policyTableObject.CONFIG.product_original_name[i];
                    //row["implementationprocedure"] = ap_policyTableObject.CONFIG.implementationprocedure[i];
                    //row["xs_yeartype"] = ap_policyTableObject.CONFIG.xs_yeartype[i];
                    row["link_pdf"] = ap_policyTableObject.CONFIG.link_pdf[i];
                    row["benchmark_link_pdf"] = ap_policyTableObject.CONFIG.benchmark_link_pdf[i];
                    row["short_description"] = ap_policyTableObject.CONFIG.short_description[i];
                    row["shared_group_code"] = ap_policyTableObject.CONFIG.shared_group_code[i];
                    row["MaxAVTariffValue"] = ap_policyTableObject.CONFIG.MaxAVTariffValue[i];
                    row["CountAVTariff"] = ap_policyTableObject.CONFIG.CountAVTariff[i];
                    row["CountNAVTariff"] = ap_policyTableObject.CONFIG.CountNAVTariff[i];

                    dataPolicyTable[i] = row;
                    k++;
                }

                var source =
                {
                    localdata: dataPolicyTable,
                    datatype: "array"
                };

                var dataAdapter = new $.jqx.dataAdapter(source);
                var updatePanel = function (index) {
                  //  alert("updatePanel index = "+index );
                    var container = $('<div style="margin: 5px;"></div>')
                    var leftcolumn = $('<div style="float: left; width: 45%;"></div>');
                    var rightcolumn = $('<div style="float: left; width: 40%;"></div>');
                    container.append(leftcolumn);
                    var button = "<div style='margin: 10px;'><input type='button' value="+$.i18n.prop('_showMetadata_button') +" id='metadataButton2' /></div>";
                    container.append(button);
                     container.append(rightcolumn);
                   // var datarecord = dataPolicyTable[index];
                    var datarecord = ap_policyTableObject.CONFIG;
                    //console.log("dataPolicyTable[index].cpl_id "+dataPolicyTable[index].cpl_id);
                    //console.log("in update in policy table one cpl_id "+ap_policyTableObject.CONFIG.cpl_id);
                    //alert("updatePanel index = "+index +" datarecord.cpl_id  "+datarecord.cpl_id );
                    //var metadata_id = "<div style='margin: 10px;'><b>"+$.i18n.prop('_metadata_id') +":</b> " + datarecord.metadata_id[index] + "</div>";
                    //$(leftcolumn).append(metadata_id);
                    //var policy_id = "<div style='margin: 10px;'><b>"+$.i18n.prop('_policy_id') +":</b> " + datarecord.policy_id[index] + "</div>";
                    //$(leftcolumn).append(policy_id);
                    //var cpl_id = "<div style='margin: 10px;'><b>"+$.i18n.prop('_cpl_id') +":</b> " + datarecord.cpl_id[index] + "</div>";
                    //$(leftcolumn).append(cpl_id);
                    //var commodity_id = "<div style='margin: 10px;'><b>"+$.i18n.prop('_commodity_id') +":</b> " + datarecord.commodity_id[index] + "</div>";
                    //$(leftcolumn).append(commodity_id);

                    var hs_version = "<div style='margin: 10px;'><b>"+$.i18n.prop('_hs_version') +":</b> " + datarecord.hs_version[index] + "</div>";
                    $(leftcolumn).append(hs_version);
                    var hs_code = "<div style='margin: 10px;'><b>"+$.i18n.prop('_hs_code') +":</b> " + datarecord.hs_code[index] + "</div>";
                    $(leftcolumn).append(hs_code);
                    var hs_suffix = "<div style='margin: 10px;'><b>"+$.i18n.prop('_hs_suffix') +":</b> " + datarecord.hs_suffix[index] + "</div>";
                    $(leftcolumn).append(hs_suffix);
                    var policy_element = "<div style='margin: 10px;'><b>"+$.i18n.prop('_policy_element') +":</b> " + datarecord.policy_element[index] + "</div>";
                    $(leftcolumn).append(policy_element);
                    var start_date = "<div style='margin: 10px;'><b>"+$.i18n.prop('_start_date') +":</b> " + datarecord.start_date[index] + "</div>";
                    $(leftcolumn).append(start_date);
                    var end_date = "<div style='margin: 10px;'><b>"+$.i18n.prop('_end_date') +":</b> " + datarecord.end_date[index] + "</div>";
                    $(leftcolumn).append(end_date);
                    var units = "<div style='margin: 10px;'><b>"+$.i18n.prop('_units') +":</b> " + datarecord.units[index] + "</div>";
                    $(leftcolumn).append(units);
                    var value = "<div style='margin: 10px;'><b>"+$.i18n.prop('_value') +":</b> " + datarecord.value[index] + "</div>";
                    $(leftcolumn).append(value);
                    var value_text = "<div style='margin: 10px;'><b>"+$.i18n.prop('_value_text') +":</b> " + datarecord.value_text[index] + "</div>";
                    $(leftcolumn).append(value_text);
                    var value_type = "<div style='margin: 10px;'><b>"+$.i18n.prop('_value_type') +":</b> " + datarecord.value_type[index] + "</div>";
                    $(leftcolumn).append(value_type);

                    var exemptions = "<div style='margin: 10px;'><b>"+$.i18n.prop('_exemptions') +":</b> " + datarecord.exemptions[index] + "</div>";
                    $(leftcolumn).append(exemptions);
                    var location_condition = "<div style='margin: 10px;'><b>"+$.i18n.prop('_location_condition') +":</b> " + datarecord.location_condition[index] + "</div>";
                    $(leftcolumn).append(location_condition);
                    var notes = "<div style='margin: 10px;'><b>"+$.i18n.prop('_notes') +":</b> " + datarecord.notes[index] + "</div>";
                    $(leftcolumn).append(notes);
                    var link = "<div style='margin: 10px;'><b>"+$.i18n.prop('_link') +":</b> " + datarecord.link[index] + "</div>";
                    $(leftcolumn).append(link);
                    var source = "<div style='margin: 10px;'><b>"+$.i18n.prop('_source') +":</b> " + datarecord.source[index] + "</div>";
                    $(leftcolumn).append(source);
                    var title_of_notice = "<div style='margin: 10px;'><b>"+$.i18n.prop('_title_of_notice') +":</b> " + datarecord.title_of_notice[index] + "</div>";
                    $(leftcolumn).append(title_of_notice);
                    var legal_basis_name = "<div style='margin: 10px;'><b>"+$.i18n.prop('_legal_basis_name') +":</b> " + datarecord.legal_basis_name[index] + "</div>";
                    $(leftcolumn).append(legal_basis_name);
                    var date_of_publication = "<div style='margin: 10px;'><b>"+$.i18n.prop('_date_of_publication') +":</b> " + datarecord.date_of_publication[index] + "</div>";
                    $(leftcolumn).append(date_of_publication);
                    var imposed_end_date = "<div style='margin: 10px;'><b>"+$.i18n.prop('_imposed_end_date') +":</b> " + datarecord.imposed_end_date[index] + "</div>";
                    $(leftcolumn).append(imposed_end_date);

                    var second_generation_specific = "<div style='margin: 10px;'><b>"+$.i18n.prop('_second_generation_specific') +":</b> " + datarecord.second_generation_specific[index] + "</div>";
                    $(rightcolumn).append(second_generation_specific);
                    var benchmark_tax = "<div style='margin: 10px;'><b>"+$.i18n.prop('_benchmark_tax') +":</b> " + datarecord.benchmark_tax[index] + "</div>";
                    $(rightcolumn).append(benchmark_tax);
                    var benchmark_product = "<div style='margin: 10px;'><b>"+$.i18n.prop('_benchmark_product') +":</b> " + datarecord.benchmark_product[index] + "</div>";
                    $(rightcolumn).append(benchmark_product);
                    var tax_rate_biofuel = "<div style='margin: 10px;'><b>"+$.i18n.prop('_tax_rate_biofuel') +":</b> " + datarecord.tax_rate_biofuel[index] + "</div>";
                    $(rightcolumn).append(tax_rate_biofuel);
                    var tax_rate_benchmark = "<div style='margin: 10px;'><b>"+$.i18n.prop('_tax_rate_benchmark') +":</b> " + datarecord.tax_rate_benchmark[index] + "</div>";
                    $(rightcolumn).append(tax_rate_benchmark);
                    var start_date_tax = "<div style='margin: 10px;'><b>"+$.i18n.prop('_start_date_tax') +":</b> " + datarecord.start_date_tax[index] + "</div>";
                    $(rightcolumn).append(start_date_tax);
                    var benchmark_link = "<div style='margin: 10px;'><b>"+$.i18n.prop('_benchmark_link') +":</b> " + datarecord.benchmark_link[index] + "</div>";
                    $(rightcolumn).append(benchmark_link);
                    var original_dataset = "<div style='margin: 10px;'><b>"+$.i18n.prop('_original_dataset') +":</b> " + datarecord.original_dataset[index] + "</div>";
                    $(rightcolumn).append(original_dataset);
                    //var type_of_change_code = "<div style='margin: 10px;'><b>"+$.i18n.prop('_type_of_change_code') +":</b> " + datarecord.type_of_change_code[index] + "</div>";
                    //$(rightcolumn).append(type_of_change_code);
                    var type_of_change_name = "<div style='margin: 10px;'><b>"+$.i18n.prop('_type_of_change_name') +":</b> " + datarecord.type_of_change_name[index] + "</div>";
                    $(rightcolumn).append(type_of_change_name);
                    var measure_descr = "<div style='margin: 10px;'><b>"+$.i18n.prop('_measure_description') +":</b> " + datarecord.measure_descr[index] + "</div>";
                    $(leftcolumn).append(measure_descr);
                    var product_original_hs = "<div style='margin: 10px;'><b>"+$.i18n.prop('_product_original_hs') +":</b> " + datarecord.product_original_hs[index] + "</div>";
                    $(rightcolumn).append(product_original_hs);
                    var product_original_name = "<div style='margin: 10px;'><b>"+$.i18n.prop('_product_original_name') +":</b> " + datarecord.product_original_name[index] + "</div>";
                    $(rightcolumn).append(product_original_name);

                    //var implementationprocedure = "<div style='margin: 10px;'><b>"+$.i18n.prop('_implementationprocedure') +":</b> " + datarecord.implementationprocedure[index] + "</div>";
                    //$(rightcolumn).append(implementationprocedure);
                    //var xs_yeartype = "<div style='margin: 10px;'><b>"+$.i18n.prop('_xs_yeartype') +":</b> " + datarecord.xs_yeartype[index] + "</div>";
                    //$(rightcolumn).append(xs_yeartype);
                    var link_pdf = "<div style='margin: 10px;'><b>"+$.i18n.prop('_link_pdf') +":</b> " + datarecord.link_pdf[index] + "</div>";
                    $(rightcolumn).append(link_pdf);
                    var benchmark_link_pdf = "<div style='margin: 10px;'><b>"+$.i18n.prop('_benchmark_link_pdf') +":</b> " + datarecord.benchmark_link_pdf[index] + "</div>";
                    $(rightcolumn).append(benchmark_link_pdf);
                    var short_description = "<div style='margin: 10px;'><b>"+$.i18n.prop('_short_description') +":</b> " + datarecord.short_description[index] + "</div>";
                    $(rightcolumn).append(short_description);
                    var shared_group_code = "<div style='margin: 10px;'><b>"+$.i18n.prop('_shared_group_code') +":</b> " + datarecord.shared_group_code[index] + "</div>";
                    $(rightcolumn).append(shared_group_code);


                     //Start

                   // $("#ContentPanel").html(container.html());
                    //End

                    // var education = "<div style='clear: both; margin: 10px;'><div><b>Education</b></div><div>" +  $('#listbox').jqxListBox('getItem', index).value + "</div></div>";
                    // container.append(education);
//                    var button = "<div style='margin: 10px;'><input type='button' value="+$.i18n.prop('_showMetadata_button') +" id='jqxButton' /></div>";
//                    container.append(button);
                    $("#policyTableTwoPanel").html(container.html());
                    $("#metadataButton2").jqxButton({ width: '20%'});
                    var width = $(window).width();
                    var height = $(window).height();

                    $('#metadataButton2').on('click', function () {
                        //alert("Button clicked");
                        $('#fullscreen').css("display", "block");

                        $('#fullscreen').fullScreen(true);
                    });
                    //document.getElementById('fullscreen');
                   // $("#fullscreen").html(container.html());
                   // $("#jqxButton").jqxButton({ width: '150'});
                }
                updatePanel(0);
               // $('#policyTableOneGrid')
                $('#policyTableOneGrid').jqxGrid({ selectedrowindex: 0});
            },
            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    }

//    function build_policyTableGrid(){
//        var data = new Array();
//        var firstNames = ["Nancy", "Andrew", "Janet", "Margaret", "Steven", "Michael", "Robert", "Laura", "Anne"];
//        var lastNames = ["Davolio", "Fuller", "Leverling", "Peacock", "Buchanan", "Suyama", "King", "Callahan", "Dodsworth"];
//        var titles = ["Sales Representative", "Vice President, Sales", "Sales Representative", "Sales Representative", "Sales Manager", "Sales Representative", "Sales Representative", "Inside Sales Coordinator", "Sales Representative"];
//        var titleofcourtesy = ["Ms.", "Dr.", "Ms.", "Mrs.", "Mr.", "Mr.", "Mr.", "Ms.", "Ms."];
//        var birthdate = ["08-Dec-48", "19-Feb-52", "30-Aug-63", "19-Sep-37", "04-Mar-55", "02-Jul-63", "29-May-60", "09-Jan-58", "27-Jan-66"];
//        var hiredate = ["01-May-92", "14-Aug-92", "01-Apr-92", "03-May-93", "17-Oct-93", "17-Oct-93", "02-Jan-94", "05-Mar-94", "15-Nov-94"];
//        var address = ["507 - 20th Ave. E. Apt. 2A", "908 W. Capital Way", "722 Moss Bay Blvd.", "4110 Old Redmond Rd.", "14 Garrett Hill", "Coventry House", "Miner Rd.", "Edgeham Hollow", "Winchester Way", "4726 - 11th Ave. N.E.", "7 Houndstooth Rd."];
//        var city = ["Seattle", "Tacoma", "Kirkland", "Redmond", "London", "London", "London", "Seattle", "London"];
//        var postalcode = ["98122", "98401", "98033", "98052", "SW1 8JR", "EC2 7JR", "RG1 9SP", "98105", "WG2 7LT"];
//        var country = ["USA", "USA", "USA", "USA", "UK", "UK", "UK", "USA", "UK"];
//        var homephone = ["(206) 555-9857", "(206) 555-9482", "(206) 555-3412", "(206) 555-8122", "(71) 555-4848", "(71) 555-7773", "(71) 555-5598", "(206) 555-1189", "(71) 555-4444"];
//        var notes = ["Education includes a BA in psychology from Colorado State University in 1970.  She also completed 'The Art of the Cold Call.'  Nancy is a member of Toastmasters International.",
//
//            "Andrew received his BTS commercial in 1974 and a Ph.D. in international marketing from the University of Dallas in 1981.  He is fluent in French and Italian and reads German.  He joined the company as a sales representative, was promoted to sales manager in January 1992 and to vice president of sales in March 1993.  Andrew is a member of the Sales Management Roundtable, the Seattle Chamber of Commerce, and the Pacific Rim Importers Association.",
//
//            "Janet has a BS degree in chemistry from Boston College (1984).  She has also completed a certificate program in food retailing management.  Janet was hired as a sales associate in 1991 and promoted to sales representative in February 1992.",
//
//            "Margaret holds a BA in English literature from Concordia College (1958) and an MA from the American Institute of Culinary Arts (1966).  She was assigned to the London office temporarily from July through November 1992.",
//
//            "Steven Buchanan graduated from St. Andrews University, Scotland, with a BSC degree in 1976.  Upon joining the company as a sales representative in 1992, he spent 6 months in an orientation program at the Seattle office and then returned to his permanent post in London.  He was promoted to sales manager in March 1993.  Mr. Buchanan has completed the courses 'Successful Telemarketing' and 'International Sales Management.'  He is fluent in French.",
//
//            "Michael is a graduate of Sussex University (MA, economics, 1983) and the University of California at Los Angeles (MBA, marketing, 1986).  He has also taken the courses 'Multi-Cultural Selling' and 'Time Management for the Sales Professional.'  He is fluent in Japanese and can read and write French, Portuguese, and Spanish.",
//
//            "Robert King served in the Peace Corps and traveled extensively before completing his degree in English at the University of Michigan in 1992, the year he joined the company.  After completing a course entitled 'Selling in Europe,' he was transferred to the London office in March 1993.",
//
//            "Laura received a BA in psychology from the University of Washington.  She has also completed a course in business French.  She reads and writes French.",
//
//            "Anne has a BA degree in English from St. Lawrence College.  She is fluent in French and German."];
//        var k = 0;
//        for (var i = 0; i < firstNames.length; i++) {
//            var row = {};
//            row["firstname"] = firstNames[k];
//            row["lastname"] = lastNames[k];
//            row["title"] = titles[k];
//            row["titleofcourtesy"] = titleofcourtesy[k];
//            row["birthdate"] = birthdate[k];
//            row["hiredate"] = hiredate[k];
//            row["address"] = address[k];
//            row["city"] = city[k];
//            row["postalcode"] = postalcode[k];
//            row["country"] = country[k];
//            row["homephone"] = homephone[k];
//            row["notes"] = notes[k];
//            data[i] = row;
//            k++;
//        }
//        var source = {
//            localdata: data,
//            datatype: "array"
//        };
//        var initrowdetails = function (index, parentElement, gridElement, datarecord) {
////            var details = $($(parentElement).children()[0]);
////            details.html("Details: " + index);
//
//            var k = 0;
//            for (var i = 0; i < firstNames.length; i++) {
//                var row = {};
//                row["firstname"] = firstNames[k];
//                row["lastname"] = lastNames[k];
//                row["title"] = titles[k];
//                row["titleofcourtesy"] = titleofcourtesy[k];
//                row["birthdate"] = birthdate[k];
//                data[i] = row;
//                k++;
//            }
//            var source = {
//                localdata: data,
//                datatype: "array"
//            };
//            var grid = $($(parentElement).children()[0]);
//            var nestedGridAdapter = new $.jqx.dataAdapter(source);
//            if (grid != null) {
//                grid.jqxGrid({
//                    source: nestedGridAdapter, width: 780, height: 200,
//                    columns: [
//                        { text: 'Ship Name', datafield: 'firstname', width: 200 },
//                        { text: 'Ship Address', datafield: 'lastname', width: 200 },
//                        { text: 'Ship City', datafield: 'title', width: 150 },
//                        { text: 'Ship Country', datafield: 'titleofcourtesy', width: 150 },
//                        { text: 'Shipped Date', datafield: 'birthdate', width: 200 }
//                    ]
//                });
//            }
//        }
//        var dataAdapter = new $.jqx.dataAdapter(source);
//        $("#policyTableGrid").jqxGrid({
//            width: '100%',
////            height: 250,
//            theme: 'energyblue',
//            source: dataAdapter,
//            rowdetails: true,
////            rowdetailstemplate: {
////                rowdetails: "<div style='margin: 10px;'>Row Details</div>",
////                rowdetailsheight: 50
////            },
////            initrowdetails: initrowdetails,
////            ready: function () {
////                $("#jqxgrid").jqxGrid('showrowdetails', 0);
////                $("#jqxgrid").jqxGrid('showrowdetails', 1);
////            },
//            initrowdetails: initrowdetails,
//            rowdetailstemplate: { rowdetails: "<div id='grid' style='margin: 10px;'></div>", rowdetailsheight: 220, rowdetailshidden: true },
//            ready: function () {
//                $("#policyTableGrid").jqxGrid('showrowdetails', 1);
//            },
//
//            columns: [{
//                text: 'First Name',
//                datafield: 'firstname',
//                width: 100
//            }, {
//                text: 'Last Name',
//                datafield: 'lastname',
//                width: 100
//            }, {
//                text: 'Title',
//                datafield: 'title',
//                width: 180
//            }, {
//                text: 'City',
//                datafield: 'city',
//                width: 100
//            }, {
//                text: 'Country',
//                datafield: 'country',
//                width: 140
//            }]
//        });
//    }

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
        //$('#' + CONFIG.placeholderID + '_output').append(s);
       // $('#pane1').append(s);
        $('#' + CONFIG.placeholderID + 'output_container').append(s);
    }

    function buildOptions() {

        /* Initiate HTML. */
        var s = "";

        /* Options label. */
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
//        s += "<div class='standard-title'>" + $.i18n.prop('_options') + "</div>";
        s += "<div class='standard-title'>" + $.i18n.prop('_previewOptions_title') + "</div>";
        s += "<hr  class='standard-hr'>";
        s += "</div>";
        s += "</div>";

        /* 1st line. */
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-3 col-lg-3'>";
        s += "<div class='compare-label'>" + $.i18n.prop('_output_type') + "</div>";
        s += "<select id='option_1' class='chosen-select' style='width: 100%;'>";
        s += "<option data-code='table' selected='selected'>" + $.i18n.prop('_table') + "</option>";
//        s += "<option data-code='pivot'>" + $.i18n.prop('_pivot') + "</option>";
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
//        s += "<div class='compare-label' id='checkbox1'>" + $.i18n.prop('_show_flags') + "</div>";
        s += "<div class='compare-label' id='checkbox1'>" + $.i18n.prop('_show_full_description') + "</div>";
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

//        /* Output buttons. */
//        s += "<div class='row'>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-8 col-lg-8'>";
//        s += "&nbsp;";
//        s += "</div>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-2 col-lg-2'>";
//        s += "<button class='btn btn-sm btn-primary' type='button' style='width: 100%;' onclick='ap_queryAndDownload.preview();'>";
//        s += "<span class='glyphicon glyphicon-eye-open'></span>";
//        s += " " + $.i18n.prop('_preview');
//        s += "</button>";
//        s += "</div>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-2 col-lg-2'>";
//        s += "<button class='btn btn-sm btn-primary' type='button' style='width: 100%;' onclick='ap_queryAndDownload.download();'>";
//        s += "<span class='glyphicon glyphicon-arrow-down'></span>";
//        s += " " + $.i18n.prop('_download');
//        s += "</button>";
//        s += "</div>";
//        s += "</div>";

        /* Append HTML to the structure. */
        //$('#' + CONFIG.placeholderID + '_options').append(s);
        //$('#pane1').append(s);
//        s="";
        $('#' + CONFIG.placeholderID + 'option_container').append(s);
        /* Initiate check-boxes. */
        $('#checkbox1').jqxCheckBox({checked : false, theme: CONFIG.theme});
        $('#checkbox2').jqxCheckBox({checked : false, theme: CONFIG.theme});
        $('#checkbox3').jqxCheckBox({checked : true, theme: CONFIG.theme});
        $('#checkbox4').jqxCheckBox({checked : true, theme: CONFIG.theme});
        $('#' + CONFIG.placeholderID + 'option_container').hide();
    }

    function buildPreviewAndDownloadButton() {

        /* Initiate HTML. */
        var s = "";

        /* Output buttons. */
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-8 col-lg-8'>";
        s += "&nbsp;";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-2 col-lg-2'>";
//        s += "<button class='btn btn-sm btn-primary' type='button' style='width: 100%;' onclick='ap_queryAndDownload.preview();'>";
        s += "<button class='btn btn-sm btn-primary' id='preview_button' type='button' style='width: 100%;' onclick='ap_queryAndDownload.preview_button();'>";
        s += "<span class='glyphicon glyphicon-eye-open'></span>";
        s += " " + $.i18n.prop('_preview_button');
        s += "</button>";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-2 col-lg-2'>";
        //s += "<button class='btn btn-sm btn-primary' id='download_button' type='button' style='width: 100%;' onclick='ap_queryAndDownload.download_button();'>";
        s += "<button class='btn btn-sm btn-primary dropdown-toggle' data-toggle='dropdown' id='download_button' type='button' style='width: 100%;'>";
        s += "<span class='glyphicon glyphicon-arrow-down'></span>";
        s += " " + $.i18n.prop('_download_button');
        s += "</button>";
        s += "<ul class='dropdown-menu' role='menu' id='bulk-downloads-menu'>";
        s += "</ul>";
        s += "</div>";
        s += "</div>";


//        s += "<div class='btn-group' style='width: 100%;'>";
//        s += "<button type='button' class='btn btn-default btn-primary btn-sm dropdown-toggle' data-toggle='dropdown' style='width: 100%;'>";
//        s += "<span class='glyphicon glyphicon-compressed'></span> ";
//        s += $.i18n.prop('_bulk_downloads') + " <span class='caret'></span>";
//        s += "</button>";
//        s += "<ul class='dropdown-menu' role='menu' id='bulk-downloads-menu'>";
//        s += "</ul>";

        /* Append HTML to the structure. */
        $('#' + CONFIG.placeholderID + 'previowdownload_container_buttons').append(s);

        var s2 = "<li><a target='_blank' id='PolicyDb' onclick='ap_queryAndDownload.download_button(this.id)'>"+$.i18n.prop('_policy_db')+"</a></li>";
        $('#bulk-downloads-menu').append(s2);
        s2 = "<li><a target='_blank' id='ShareGroupDb' onclick='ap_queryAndDownload.download_button(this.id)'>"+$.i18n.prop('_shared_group_db')+"</a></li>";
        $('#bulk-downloads-menu').append(s2);
    }

    function preview_button(){
      //  alert("Preview button action");
        $('#option_1').find('option:selected').each(function(k, v) {
            switch ($(v).data('code')) {
                case 'table': return ap_queryAndDownload.previewTable();
                case 'pivot': return previewPivot();
            }
        });
       // ap_queryAndDownload.previewTable();
    }

    function download_button(id){
        //  alert("Preview button action");
        $('#option_1').find('option:selected').each(function(k, v) {
            switch ($(v).data('code')) {
                case 'table': return ap_queryAndDownload.exportTable(id);
                case 'pivot': return previewPivot();
            }
        });
        // ap_queryAndDownload.previewTable();
    }

    function getDomainStructure() {
        // alert("URL "+CONFIG.listboxes_url + '/' + CONFIG.datasource + '/' + CONFIG.domainCode + '/' + CONFIG.lang);
        //Initialize the selection map
        ap_queryAndDownload.CONFIG.selection_map = new Object();

        /* Retrive UI structure from DB. */

        $.ajax({

            type: 'GET',
            url:  CONFIG.config_file,

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
                ap_queryAndDownload.CONFIG.list_box_ids =[];
                ap_queryAndDownload.CONFIG.active_tab = new Object();
                var i=0;
                /* Build tabs. */
                $.each(tabsCollection, function(k, v) {
                    ap_queryAndDownload.CONFIG.list_box_ids[i]= k;
                    ap_queryAndDownload.CONFIG.active_tab[k]='';
                    buildTab(k, v);
                    i++;
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


//    function buildTab(listboxID, payload) {
//
//        if (payload[0][1].indexOf('Years') > -1) {
//            buildYearTab(listboxID, payload);
//        }
//        else if (payload[0][1].indexOf('Domain') > -1) {
//                buildDomainTab(listboxID, payload);
//        }
//        else if (payload[0][1].indexOf('PolicyMeasureType') > -1) {
//           // buildPMTab(listboxID, payload);
//            buildMultipleTab(listboxID, payload);
//        }
////        else if (payload[0][1].indexOf('Policy Measure Type') > -1) {
////            buildPMTTab(listboxID, payload);
////        }
//        else {   //For Countries and Commodities
//        //    buildStandardTab(listboxID, payload);
//        }
//    }
//
    function buildTab(listboxID, payload) {

        var fromDb = false;
        if (payload[0][1].indexOf('Years') > -1) {
            buildYearTab(listboxID, payload, fromDb);
        }
        else if (payload[0][1].indexOf('Domain') > -1) {
            buildDomainTab(listboxID, payload);
        }
        else {
            if (payload[0][1].indexOf('PolicyMeasureType') > -1) {
                fromDb = true;
              // buildMultipleTab(listboxID, payload);
//                buildStandardTab(listboxID, payload, fromDb);
            }
            buildStandardTab(listboxID, payload, fromDb);
        }
    }

    function populateStandardTab(listboxID, tabNameCode, tabNameLabel, procedure_name) {
        var data = null;
        //console.log("populateStandardTab procedure_name[0] **"+procedure_name[0]+"**");

        switch(procedure_name[0]) {

//            case 'PMTList'   :  //console.log("Building data ...");
//                data = [{value:tabNameCode[0]+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[0]+")"},{value:tabNameCode[0]+"_1", label: "Biofuel mandates"}, {value:tabNameCode[0]+"_2", label: "Import measures"}, {value:tabNameCode[0]+"_3", label: "Export measures"}, {value:tabNameCode[0]+"_4", label: "Per unit domestic measures"}, {value:tabNameCode[0]+"_5", label: "Other domestic measures"}];
//                //ap_queryAndDownload.populateStandardTab_codelist(listboxID, tabNameCode, tabNameLabel, procedure_name);
//                break;
            case 'CommodityClassList'   :   ap_queryAndDownload.populateStandardTab_codelist(listboxID, tabNameCode, tabNameLabel, procedure_name);
                                            break;
            case 'AreaList'   :     ap_queryAndDownload.populateStandardTab_codelist(listboxID, tabNameCode, tabNameLabel, procedure_name);
                                    break;
            //From 1995 to 2013
            case 'YearList'   : ap_queryAndDownload.populateStandardTab_year(listboxID, tabNameCode, tabNameLabel, procedure_name);
                                break;
//            default:     console.log(" default .."+procedure_name[0]);
//                ap_queryAndDownload.populateStandardTab_codelist(listboxID, tabNameCode, tabNameLabel, procedure_name);
//                break;
        }

        if(procedure_name[0]== 'PMTList')
        {
           // alert("tabNameCode "+tabNameCode+" tabNameLabel "+tabNameLabel);
            //tabNameCode Pmt2,Pmt1    tabNameLabel Import measures,Export measures
            //Initialize the element array of the ALL tabs in the map


            for(var i=0; i<tabNameCode.length; i++)
            {
                var tabCode = tabNameCode[i].substring(3);
                //alert("tabCode"+tabCode);

                var rest_url = ap_queryAndDownload.CONFIG.codelist_url +"/"+ap_queryAndDownload.CONFIG.codelist_url_PolicyType+tabCode+"/1.0";
               // alert("Before ajax rest url rest_url"+rest_url);
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
                       // alert("pt_code "+pt_code);
                        /* Fill it...result from codelist */
                        var code = [];
                        code[0]= 0;
                        var data = new Array();
                      //  var obj = {value:tabNameCode[i]+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+pt_label+")"};
                        var obj = {value:"Pmt"+pt_code+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+pt_label+")"};
                        data[0]= obj;
                        //To order the json elements based on the title(label)
                        var jsonCodes = json.rootCodes;
                        jsonCodes.sort(function(a, b){
                            if ( a.title.EN < b.title.EN )
                                return -1;
                            if ( a.title.EN > b.title.EN )
                                return 1;
                            return 0;
                        });

                        for (var j = 0 ; j < json.rootCodes.length ; j++) {
//                            var c = json.rootCodes[j].code;
//                            var l = json.rootCodes[j].title['EN'];
                            var c = jsonCodes[j].code;
                            var l = jsonCodes[j].title['EN'];
                            // console.log(""+tabCode+"c= "+c+" l= "+l);
                            //tabNameCode Pmt2,Pmt1    tabNameLabel Import measures,Export measures
//                            var obj = {value:tabNameCode[i]+"_"+(j+1), label: ''+l};
                            var obj = {value:"Pmt"+pt_code+"_"+(j+1), label: ''+l};
                            data[(j+1)]= obj;
                            //console.log("data[(i+1)] "+ data[(j+1)]);
                            code[(j+1)]= c;
                            // var l = json.rootCodes[i].title[FMM.CONFIG.lang_ISO2.toUpperCase()];
                            // s += '<option id="' + c + '" onclick="FMM.setNestedProperty(\'' + id + '\', \'' + sequenceNumber + '\');" value="' + c + '" selected="selected">' + l + '</option>';
                        }

                        //in the combo box will be inserted on the list of the first item... during initialization phase
                        //Pmt1
                       // alert("Pmtpt_code *"+"Pmt"+pt_code+"* ap_queryAndDownload.CONFIG.first_tab_PMT "+ap_queryAndDownload.CONFIG.first_tab_PMT);
                        if(("Pmt"+pt_code) == ap_queryAndDownload.CONFIG.first_tab_PMT)
                        {
                            $("#selection_" + listboxID).jqxComboBox({ checkboxes: true, height: 25, width: '100%', source: data});
                        }

                        //Initialize the element array of the ALL tabs in the map
//                        for(var i=0; i<tabNameCode.length; i++)
//                        {
                            //  console.log("populateStandardTab i= "+i+" tabNameCode[i] "+tabNameCode[i]);
                            //Get the single tab
//                            var map_obj = ap_queryAndDownload.CONFIG.selection_map[tabNameCode[i]];
                        //console.log("ptcode "+pt_code+" ptlabel "+pt_label);
                            var map_obj = ap_queryAndDownload.CONFIG.selection_map["Pmt"+pt_code];
                            //Creating the array for the elements and the values for each tab
                            var count = 0;
                            // var i=0;

                            for(var j=0; j<data.length; j++)
                            {
                                if(j==0)
                                {
                                    //console.log("pt_label "+pt_label);
                                    map_obj.elements_name[j]= $.i18n.prop('_selectAll_list_item') +"("+pt_label+")";
//                                    map_obj.elements_name[j]= $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[i]+")";
                                }
                                else{
                                    map_obj.elements_name[j]= data[j].label;
                                }
                                map_obj.elements_value[j]= false;
                                map_obj.elements_code[j]= code[j];
//                                map_obj.elements_id[j]= tabNameCode[i]+"_"+ count;
                                map_obj.elements_id[j]= "Pmt"+pt_code+"_"+ count;
                                count++;
                                // i++;
                            }
                            //  alert("map_obj.elements_id= "+map_obj.elements_id);
                        //}
                        ap_queryAndDownload.CONFIG.active_tab[listboxID]= tabNameCode[0];
                    },

                    error : function(err,b,c) {
                        alert(err.status + ", " + b + ", " + c);
                    }
                });
            }

            //ap_queryAndDownload.CONFIG.active_tab[listboxID]= procedureName;

            //End
            // var code = [0,1,7,10,11,8,2,5,12,4,7,9,3];
            // data = [{value:tabNameCode[0]+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[0]+")"},{value:tabNameCode[0]+"_1", label: "Biofuel mandates"}, {value:tabNameCode[0]+"_2", label: "Import measures"}, {value:tabNameCode[0]+"_3", label: "Export measures"}, {value:tabNameCode[0]+"_4", label: "Per unit domestic measures"}, {value:tabNameCode[0]+"_5", label: "Other domestic measures"}];

            // console.log("procedure_name[0]== 'PMTList' end");
        }


//        if(procedure_name[0]== 'PMTList')
//        {
//            alert("tabNameCode "+tabNameCode+" tabNameLabel "+tabNameLabel);
//             //ap_queryAndDownload.CONFIG.active_tab[listboxID]= procedureName;
//            var code = [];
//            code[0]= 0;
//            var data = new Array();
//            var obj = {value:tabNameCode[0]+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[0]+")"};
//            data[0]= obj;
//            var rest_url = ap_queryAndDownload.CONFIG.codelist_url +"/"+'OECD_PolicyType1'+"/1.0";
//            $.ajax({
//                type: 'GET',
//                //url: rest_url,
//                //  url: ap_queryAndDownload.CONFIG.startAndEndDate_url+ '/' + ap_queryAndDownload.CONFIG.datasource,
//                //url : 'http://faostat3.fao.org:7777/msd/cl/system/OECD_CommodityClass/1.0',
//                url :   rest_url,
//                dataType: 'json',
//
//                success : function(response) {
//                    alert("SUCCESS");
//                    /* Convert the response in an object, i fneeded. */
//                    var json = response;
//                    if (typeof(response) == 'string')
//                        json = $.parseJSON(response);
//
//                    /* Fill it...result from codelist */
//                    for (var i = 0 ; i < json.rootCodes.length ; i++) {
//                        var c = json.rootCodes[i].code;
//                        var l = json.rootCodes[i].title['EN'];
//                        // alert("c= "+c+" l= "+l);
//                        var obj = {value:tabNameCode[0]+"_"+(i+1), label: ''+l};
//                        data[(i+1)]= obj;
//                        console.log("data[(i+1)] "+ data[(i+1)]);
//                        code[i]= c;
//                        // var l = json.rootCodes[i].title[FMM.CONFIG.lang_ISO2.toUpperCase()];
//                        // s += '<option id="' + c + '" onclick="FMM.setNestedProperty(\'' + id + '\', \'' + sequenceNumber + '\');" value="' + c + '" selected="selected">' + l + '</option>';
//                    }
//
//                    //in the combo box will be inserted on the list of the first item... during initialization phase
//                    $("#selection_" + listboxID).jqxComboBox({ checkboxes: true, height: 25, width: '100%', source: data});
//                    //Initialize the element array of the ALL tabs in the map
//                    for(var i=0; i<tabNameCode.length; i++)
//                    {
//                        //  console.log("populateStandardTab i= "+i+" tabNameCode[i] "+tabNameCode[i]);
//                        //Get the single tab
//                        var map_obj = ap_queryAndDownload.CONFIG.selection_map[tabNameCode[i]];
//                        //Creating the array for the elements and the values for each tab
//                        var count = 0;
//                        // var i=0;
//                        //alert("Before  data ...");
//                        for(var j=0; j<data.length; j++)
//                        {
//                            if(j==0)
//                            {
//                                map_obj.elements_name[j]= $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[i]+")";
//                            }
//                            else{
//                                map_obj.elements_name[j]= data[j].label;
//                            }
//                            map_obj.elements_value[j]= false;
//                            map_obj.elements_code[j]= code[j];
//                            map_obj.elements_id[j]= tabNameCode[i]+"_"+ count;
//                            count++;
//                            // i++;
//                        }
//                        //  alert("map_obj.elements_id= "+map_obj.elements_id);
//                    }
//                    ap_queryAndDownload.CONFIG.active_tab[listboxID]= tabNameCode[0];
//                },
//
//                error : function(err,b,c) {
//                    alert(err.status + ", " + b + ", " + c);
//                }
//            });
//            //End
//           // var code = [0,1,7,10,11,8,2,5,12,4,7,9,3];
//           // data = [{value:tabNameCode[0]+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[0]+")"},{value:tabNameCode[0]+"_1", label: "Biofuel mandates"}, {value:tabNameCode[0]+"_2", label: "Import measures"}, {value:tabNameCode[0]+"_3", label: "Export measures"}, {value:tabNameCode[0]+"_4", label: "Per unit domestic measures"}, {value:tabNameCode[0]+"_5", label: "Other domestic measures"}];
//
//           // console.log("procedure_name[0]== 'PMTList' end");
//        }
    }

//    function populateStandardTab_year(listboxID, tabNameCode, tabNameLabel, procedure_name) {
//        /* Retrive UI structure from DB. */
//        $.ajax({
//
//            type: 'GET',
//            url: ap_queryAndDownload.CONFIG.startAndEndDate_url+ '/' + ap_queryAndDownload.CONFIG.datasource,
//
//            success : function(response) {
//
//                /* Convert the response in an object, i fneeded. */
//                var json = response;
//                if (typeof(response) == 'string')
//                    json = $.parseJSON(response);
//                console.log("year = "+json);
//                //Start Date Original
//                var start_date = json[0][0];
//                //11/03/2014
//                var start_date_app = start_date;
//                var index = start_date_app.indexOf('/');
//                var start_date_dd = start_date_app.substring(0,index);
//                //03/2014
//                start_date_app = start_date_app.substring(index+1);
//                index = start_date_app.indexOf('/');
//                var start_date_mm = start_date_app.substring(0,index);
//                //2014
//                start_date_app = start_date_app.substring(index+1);
//                var start_date_yy = start_date_app;
//
//                //End Date Original
//                var end_date = json[0][1];
//                var end_date_dd = '';
//                var end_date_mm = '';
//                var end_date_yy = '';
//
//                if((end_date==null)||(typeof end_date == 'undefined'))
//                {
//                    var today = new Date();
//                    end_date_dd = today.getDate();
//                    end_date_mm = today.getMonth()+1; //January is 0!
//                    end_date_yy = today.getFullYear();
//                }
//                else
//                {
//                    var end_date_app = end_date;
//                    var index = end_date_app.indexOf('/');
//                    end_date_dd = end_date_app.substring(0,index);
//                    //03/2014
//                    end_date_app = end_date_app.substring(index+1);
//                    index = end_date_app.indexOf('/');
//                    end_date_mm = end_date_app.substring(0,index);
//                    //2014
//                    end_date_app = end_date_app.substring(index+1);
//                    end_date_yy = end_date_app;
//                }
////                    console.log("Start_date "+start_date);
////                    console.log("Start_date dd "+start_date_dd);
////                    console.log("Start_date mm "+start_date_mm);
////                    console.log("Start_date yy "+start_date_yy);
////                    console.log("End_date "+end_date);
////                    console.log("End_date dd "+end_date_dd);
////                    console.log("End_date mm "+end_date_mm);
////                    console.log("End_date yy "+end_date_yy);
//                var start_date_mm_int = parseInt(start_date_mm)-1;
//                var end_date_mm_int = parseInt(end_date_mm)-1;
//
//                ap_queryAndDownload.CONFIG.slider_start_date = start_date;
//                ap_queryAndDownload.CONFIG.slider_start_date_dd = start_date_dd;
//                ap_queryAndDownload.CONFIG.slider_start_date_mm = start_date_mm;
//                ap_queryAndDownload.CONFIG.slider_start_date_yy = start_date_yy;
//                ap_queryAndDownload.CONFIG.slider_end_date = end_date;
//                ap_queryAndDownload.CONFIG.slider_end_date_dd = end_date_dd;
//                ap_queryAndDownload.CONFIG.slider_end_date_mm = end_date_mm;
//                ap_queryAndDownload.CONFIG.slider_end_date_yy = end_date_yy;
////                    $("#"+tabNameCode + "_yearSlider").dateRangeSlider({bounds:{min: new Date(2000, 0, 1), max: new Date(2014, 11, 31)}, wheelMode: 'zoom', step:{days: 1}, range:{min:{days: 1}, max:{years: 40}}});
//                $("#"+tabNameCode + "_yearSlider").dateRangeSlider({bounds:{min: new Date(start_date_yy, ''+start_date_mm_int, start_date_dd), max: new Date(end_date_yy, ''+end_date_mm_int, end_date_dd)}, wheelMode: 'zoom', step:{days: 1}, range:{min:{years: 5}, max:{years: 60}}});
//                $("#yearMin").text(start_date_yy);
//                $("#yearMax").text(end_date_yy);
//                var dateValues = $("#"+tabNameCode + "_yearSlider").dateRangeSlider("values");
//                //console.log(" Populate tab "+dateValues.min.toString() + " " + dateValues.max.toString());
//                //var date = new Date("Fri May 31 2013 17:41:01 GMT+0200 (CEST)");
//                //var date_str = moment(dateValues.min.toString()).format("DD/MM/YYYY");
//                ap_queryAndDownload.CONFIG.slider_start_date_selected = moment(dateValues.min.toString()).format("DD/MM/YYYY");
//                ap_queryAndDownload.CONFIG.slider_end_date_selected = moment(dateValues.max.toString()).format("DD/MM/YYYY");
//                $("#"+tabNameCode + "_yearSlider").bind("valuesChanged", function(e, data){
//                    // console.log("Values just changed. min: " + data.values.min + " max: " + data.values.max);
//                    ap_queryAndDownload.CONFIG.slider_start_date_selected = moment(data.values.min.toString()).format("DD/MM/YYYY");
//                    ap_queryAndDownload.CONFIG.slider_end_date_selected = moment(data.values.max.toString()).format("DD/MM/YYYY");
//                    //console.log("After ap_queryAndDownload.CONFIG.slider_start_date_selected "+ap_queryAndDownload.CONFIG.slider_start_date_selected);
//                    //console.log("After ap_queryAndDownload.CONFIG.slider_end_date_selected "+ap_queryAndDownload.CONFIG.slider_end_date_selected);
//                });
//                //console.log(" Populate slider_start_date_selected "+ap_queryAndDownload.CONFIG.slider_start_date_selected + " slider_end_date_selected " + ap_queryAndDownload.CONFIG.slider_end_date_selected);
//                //Classic Years
//                // data = [{value:tabNameCode[0]+"_0", label: "Select All("+tabNameLabel[0]+")"},{value:tabNameCode[0]+"_1", label: "1995"}, {value:tabNameCode[0]+"_2", label: "1996"}, {value:tabNameCode[0]+"_3", label: "1997"}, {value:tabNameCode[0]+"_4", label: "1998"}, {value:tabNameCode[0]+"_5", label: "1999"}, {value:tabNameCode[0]+"_6", label: "2000"},{value:tabNameCode[0]+"_7", label: "2001"}, {value:tabNameCode[0]+"_8", label: "2002"}, {value:tabNameCode[0]+"_9", label: "2003"}, {value:tabNameCode[0]+"_10", label: "2004"}, {value:tabNameCode[0]+"_11", label: "2005"}, {value:tabNameCode[0]+"_12", label: "2006"}, {value:tabNameCode[0]+"_13", label: "2007"}, {value:tabNameCode[0]+"_14", label: "2008"}, {value:tabNameCode[0]+"_15", label: "2009"}, {value:tabNameCode[0]+"_16", label: "2010"}, {value:tabNameCode[0]+"_17", label: "2011"}, {value:tabNameCode[0]+"_18", label: "2012"}, {value:tabNameCode[0]+"_19", label: "2013"}];
//                var start_date_yy_int = parseInt(start_date_yy);
//                var end_date_yy_int = parseInt(end_date_yy);
//
//                data = [{value:tabNameCode[0]+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[0]+")"}];
//                var count = 1;
//                for(var i=start_date_yy_int; i<=end_date_yy_int; i++)
//                {
//                    data[count]={value:tabNameCode[0]+"_"+count, label: ''+i};
//                    count++;
//                }
////                data[1]={value:tabNameCode[0]+"_1", label: "1995"};
////                data[2]={value:tabNameCode[0]+"_2", label: "1996"};
//
//                //in the combo box will be inserted on the list of the first item... during initialization phase
//                $("#selection_" + listboxID).jqxComboBox({ checkboxes: true, height: 25, width: '100%', source: data});
//
//                //Initialize the element array of the ALL tabs in the map
//                for(var i=0; i<tabNameCode.length; i++)
//                {
//                    //console.log("populateStandardTab i= "+i+" tabNameCode[i] "+tabNameCode[i]);
//                    //Get the single tab
//                    var map_obj = ap_queryAndDownload.CONFIG.selection_map[tabNameCode[i]];
//                    //Creating the array for the elements and the values for each tab
//                    var count = 0;
//                    for(var j=0; j<data.length; j++)
//                    {
//                        if(j==0)
//                        {
//                            map_obj.elements_name[j]= $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[i]+")";
//
//                        }
//                        else{
//                            map_obj.elements_name[j]= data[j].label;
//                        }
//                        map_obj.elements_value[j]= false;
//                        map_obj.elements_id[j]= tabNameCode[i]+"_"+ count;
//                        count++;
//                    }
//                    //  alert("map_obj.elements_id= "+map_obj.elements_id);
//                }
//                ap_queryAndDownload.CONFIG.active_tab[listboxID]= tabNameCode[0];
//            },
//
//            error : function(err,b,c) {
//                alert(err.status + ", " + b + ", " + c);
//            }
//        });
//    }

    function populateStandardTab_year(listboxID, tabNameCode, tabNameLabel, procedure_name) {
        /* Retrive UI structure from DB. */
        $.ajax({

            type: 'GET',
            url: 'http://'+ap_queryAndDownload.CONFIG.base_ip_address+':'+ap_queryAndDownload.CONFIG.base_ip_port+ap_queryAndDownload.CONFIG.startAndEndDate_url+ '/' + ap_queryAndDownload.CONFIG.datasource,
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

//                    $("#"+tabNameCode + "_yearSlider").dateRangeSlider({bounds:{min: new Date(2000, 0, 1), max: new Date(2014, 11, 31)}, wheelMode: 'zoom', step:{days: 1}, range:{min:{days: 1}, max:{years: 40}}});
                $("#"+tabNameCode + "_yearSlider").dateRangeSlider({bounds:{min: new Date(start_date_yy, ''+start_date_mm_int, start_date_dd), max: new Date(end_date_yy, ''+end_date_mm_int, end_date_dd)}, wheelMode: 'zoom', step:{days: 1}, range:{min:{years: 5}, max:{years: 60}}, formatter:function(val){
                    var days = val.getDate(),
                        month = val.getMonth() + 1,
                        year = val.getFullYear();
                    return days + "/" + month + "/" + year;
                }});

                $("#yearMin").text(start_date_yy);
                $("#yearMax").text(end_date_yy);
                var dateValues = $("#"+tabNameCode + "_yearSlider").dateRangeSlider("values");
                //console.log(" Populate tab "+dateValues.min.toString() + " " + dateValues.max.toString());
                //var date = new Date("Fri May 31 2013 17:41:01 GMT+0200 (CEST)");
                //var date_str = moment(dateValues.min.toString()).format("DD/MM/YYYY");
               // ap_queryAndDownload.CONFIG.slider_start_date_selected = dateValues.min.toString();
               // ap_queryAndDownload.CONFIG.slider_end_date_selected = dateValues.max.toString();
                ap_queryAndDownload.CONFIG.slider_start_date_selected = moment(dateValues.min.toString()).format("DD/MM/YYYY");
                ap_queryAndDownload.CONFIG.slider_end_date_selected = moment(dateValues.max.toString()).format("DD/MM/YYYY");
                //alert("ap_queryAndDownload.CONFIG.slider_start_date_selected "+ap_queryAndDownload.CONFIG.slider_start_date_selected+" ap_queryAndDownload.CONFIG.slider_end_date_selected "+ap_queryAndDownload.CONFIG.slider_end_date_selected);
                $("#"+tabNameCode + "_yearSlider").bind("valuesChanged", function(e, data){
                    ap_queryAndDownload.CONFIG.slider_start_date_selected = moment(data.values.min.toString()).format("DD/MM/YYYY");
                    ap_queryAndDownload.CONFIG.slider_end_date_selected = moment(data.values.max.toString()).format("DD/MM/YYYY");
                   // alert("ap_queryAndDownload.CONFIG.slider_start_date_selected "+ap_queryAndDownload.CONFIG.slider_start_date_selected+" ap_queryAndDownload.CONFIG.slider_end_date_selected "+ap_queryAndDownload.CONFIG.slider_end_date_selected);
                });
                //console.log(" Populate slider_start_date_selected "+ap_queryAndDownload.CONFIG.slider_start_date_selected + " slider_end_date_selected " + ap_queryAndDownload.CONFIG.slider_end_date_selected);
                //Classic Years
                // data = [{value:tabNameCode[0]+"_0", label: "Select All("+tabNameLabel[0]+")"},{value:tabNameCode[0]+"_1", label: "1995"}, {value:tabNameCode[0]+"_2", label: "1996"}, {value:tabNameCode[0]+"_3", label: "1997"}, {value:tabNameCode[0]+"_4", label: "1998"}, {value:tabNameCode[0]+"_5", label: "1999"}, {value:tabNameCode[0]+"_6", label: "2000"},{value:tabNameCode[0]+"_7", label: "2001"}, {value:tabNameCode[0]+"_8", label: "2002"}, {value:tabNameCode[0]+"_9", label: "2003"}, {value:tabNameCode[0]+"_10", label: "2004"}, {value:tabNameCode[0]+"_11", label: "2005"}, {value:tabNameCode[0]+"_12", label: "2006"}, {value:tabNameCode[0]+"_13", label: "2007"}, {value:tabNameCode[0]+"_14", label: "2008"}, {value:tabNameCode[0]+"_15", label: "2009"}, {value:tabNameCode[0]+"_16", label: "2010"}, {value:tabNameCode[0]+"_17", label: "2011"}, {value:tabNameCode[0]+"_18", label: "2012"}, {value:tabNameCode[0]+"_19", label: "2013"}];
                var start_date_yy_int = parseInt(start_date_yy);
                var end_date_yy_int = parseInt(end_date_yy);

                data = [{value:tabNameCode[0]+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[0]+")"}];
                var count = 1;
                for(var i=start_date_yy_int; i<=end_date_yy_int; i++)
                {
                    data[count]={value:tabNameCode[0]+"_"+count, label: ''+i};
                    count++;
                }
//                data[1]={value:tabNameCode[0]+"_1", label: "1995"};
//                data[2]={value:tabNameCode[0]+"_2", label: "1996"};

                //in the combo box will be inserted on the list of the first item... during initialization phase
                $("#selection_" + listboxID).jqxComboBox({ checkboxes: true, height: 25, width: '100%', source: data});

                //Initialize the element array of the ALL tabs in the map
                for(var i=0; i<tabNameCode.length; i++)
                {
                    //console.log("populateStandardTab i= "+i+" tabNameCode[i] "+tabNameCode[i]);
                    //Get the single tab
                    var map_obj = ap_queryAndDownload.CONFIG.selection_map[tabNameCode[i]];
                    //Creating the array for the elements and the values for each tab
                    var count = 0;
                    for(var j=0; j<data.length; j++)
                    {
                        if(j==0)
                        {
                            map_obj.elements_name[j]= $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[i]+")";

                        }
                        else{
                            map_obj.elements_name[j]= data[j].label;
                        }
                        map_obj.elements_value[j]= false;
                        map_obj.elements_id[j]= tabNameCode[i]+"_"+ count;
                        count++;
                    }
                    //  alert("map_obj.elements_id= "+map_obj.elements_id);
                }
                ap_queryAndDownload.CONFIG.active_tab[listboxID]= tabNameCode[0];
            },

            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    }

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

    function populateStandardTab_codelist(listboxID, tabNameCode, tabNameLabel, procedure_name) {
      //  console.log("populateStandardTab_codelist !!!");
        var code = [];
        code[0]= 0;
        var rest_url = "";
        var data = new Array();
        var obj = {value:tabNameCode[0]+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[0]+")"};
        data[0]= obj;
        switch(procedure_name[0])
        {
            case 'CommodityClassList'   :
               // console.log("populateStandardTab_codelist CommodityClassList ");
                       // code = [0,1,7,10,11,8,2,5,12,4,7,9,3];
                        //code[0]= 0;
                        rest_url = ap_queryAndDownload.CONFIG.codelist_url+"/";
//                        ap_queryAndDownload.CONFIG.commodity_radio_checked = $.i18n.prop('_commodity_domain_agricultural');
                        if(ap_queryAndDownload.CONFIG.commodity_radio_checked == $.i18n.prop('_commodity_domain_agricultural'))
                        {
                            rest_url+= ap_queryAndDownload.CONFIG.codelist_url_CommodityAgricultural;
                        }
                        else if(ap_queryAndDownload.CONFIG.commodity_radio_checked == $.i18n.prop('_commodity_domain_biofuels'))
                        {
                            rest_url+= ap_queryAndDownload.CONFIG.codelist_url_CommodityBiofuels;
                        }
                        else
                        {
                            //Both
                            rest_url+= ap_queryAndDownload.CONFIG.codelist_url_CommodityBoth;
                        }
                        rest_url+= "/1.0";
//                        var obj = {value:tabNameCode[0]+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[0]+")"};
//                        data[0]= obj;
                       // data = [{value:tabNameCode[0]+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[0]+")"},{value:tabNameCode[0]+"_1", label: "Wheat"}, {value:tabNameCode[0]+"_2", label: "Biofuel"}, {value:tabNameCode[0]+"_3", label: "Maize + Soybeans"}, {value:tabNameCode[0]+"_4", label: "Wheat + Maize + Rice"}, {value:tabNameCode[0]+"_5", label: "Wheat + Maize"}, {value:tabNameCode[0]+"_6", label: "Rice"},{value:tabNameCode[0]+"_7", label: "Ethanol"}, {value:tabNameCode[0]+"_8", label: "Wheat + Rice"},{value:tabNameCode[0]+"_9", label: "Soybeans"},{value:tabNameCode[0]+"_10", label: "Biodiesel"},{value:tabNameCode[0]+"_11", label: "Maize + Rice"},{value:tabNameCode[0]+"_12", label: "Maize"}];
//                        for(var i =1; i<12; i++)
//                        {
//                            obj = {value:tabNameCode[0]+"_"+i, label: "Test"+i};
//                            data[i]= obj;
//                        }
                        break;
            case 'AreaList'   :
              //  console.log("populateStandardTab_codelist AreaList ");
                        //code = [0,53,256,240,17,227,249,93,999000,12,85,204,132,126];
                        rest_url = ap_queryAndDownload.CONFIG.codelist_url +"/"+ap_queryAndDownload.CONFIG.codelist_url_Country+"/1.0";
                       // data = [{value:tabNameCode[0]+"_0", label: $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[0]+")"},{value:tabNameCode[0]+"_1", label: "China"}, {value:tabNameCode[0]+"_2", label: "U.K. of Great Britain and Northern Ireland"}, {value:tabNameCode[0]+"_3", label: "Thailand"}, {value:tabNameCode[0]+"_4", label: "Australia"}, {value:tabNameCode[0]+"_5", label: "South Africa"}, {value:tabNameCode[0]+"_6", label: "Turkey"},{value:tabNameCode[0]+"_7", label: "Germany"}, {value:tabNameCode[0]+"_8", label: "European Union"}, {value:tabNameCode[0]+"_9", label: "Argentina"}, {value:tabNameCode[0]+"_10", label: "France"}, {value:tabNameCode[0]+"_11", label: "Russian Federation"}, {value:tabNameCode[0]+"_12", label: "Kazakhstan"}, {value:tabNameCode[0]+"_13", label: "Japan"}];
                        break;
        }

//        if(procedure_name[0]=='CommodityClassList')
//        {
            //  http://faostat3.fao.org:7777/msd/cl/system/OECD_CommodityClass/1.0
            /* Retrive UI structure from DB. */
            $.ajax({
                type: 'GET',
                //url: rest_url,
                //  url: ap_queryAndDownload.CONFIG.startAndEndDate_url+ '/' + ap_queryAndDownload.CONFIG.datasource,
                //url : 'http://faostat3.fao.org:7777/msd/cl/system/OECD_CommodityClass/1.0',
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

                    /* Fill it...result from codelist */
                    for (var i = 0 ; i < json.rootCodes.length ; i++) {
//                        var c = json.rootCodes[i].code;
//                        var l = json.rootCodes[i].title['EN'];
                        var c = jsonCodes[i].code;
                        var l = jsonCodes[i].title['EN'];
                       // alert("c= "+c+" l= "+l);
                        var obj = {value:tabNameCode[0]+"_"+(i+1), label: ''+l};
                        data[(i+1)]= obj;
                       // console.log("data[(i+1)] "+ data[(i+1)]);
                        code[(i+1)]= c;
                        // var l = json.rootCodes[i].title[FMM.CONFIG.lang_ISO2.toUpperCase()];
                        // s += '<option id="' + c + '" onclick="FMM.setNestedProperty(\'' + id + '\', \'' + sequenceNumber + '\');" value="' + c + '" selected="selected">' + l + '</option>';
                    }
                    //in the combo box will be inserted on the list of the first item... during initialization phase
                    $("#selection_" + listboxID).jqxComboBox({ checkboxes: true, height: 25, width: '100%', source: data});
                   console.log("Area or commodity call code "+ code);

                    //Initialize the element array of the ALL tabs in the map
                    for(var i=0; i<tabNameCode.length; i++)
                    {
                        //console.log("populateStandardTab i= "+i+" tabNameCode[i] "+tabNameCode[i]);
                        //Get the single tab
                        var map_obj = ap_queryAndDownload.CONFIG.selection_map[tabNameCode[i]];
                        //Creating the array for the elements and the values for each tab
                        var count = 0;

                        for(var j=0; j<data.length; j++)
                        {
                            if(j==0)
                            {
                                map_obj.elements_name[j]= $.i18n.prop('_selectAll_list_item') +"("+tabNameLabel[i]+")";
                            }
                            else{
                                map_obj.elements_name[j]= data[j].label;
                            }
//                console.log("populateStandardTab_codelist data[j].label "+data[j].label);
//                console.log("populateStandardTab_codelist code[i] "+code[j]);
                            map_obj.elements_code[j]= code[j];
//                if(procedure_name[0]== 'CommodityClassList')
//                {
//                    map_obj.elements_code[j]= code[i];
//                }
//                else if(procedure_name[0]== 'AreaList')
//                {
//                    map_obj.elements_code[j]= code[i];
//                }
                            map_obj.elements_value[j]= false;
                            map_obj.elements_id[j]= tabNameCode[i]+"_"+ count;
                            count++;
                        }
                        //  alert("map_obj.elements_id= "+map_obj.elements_id);
                    }
                    ap_queryAndDownload.CONFIG.active_tab[listboxID]= tabNameCode[0];
                },

                error : function(err,b,c) {
                    alert(err.status + ", " + b + ", " + c);
                }
            });

        //}
    }

    //procedureName = Code associated to the real name of the PMT
    function clickTab(listboxID, procedureName, procedureNameArray) {
        ap_queryAndDownload.CONFIG.active_tab[listboxID]= procedureName;
      //  String procedureNameArray to procedureNameArray
        var rest = null;
        //Clear the combo box to insert the new values
        $("#selection_" + listboxID).jqxComboBox('clear');
        //Get the info of the new tab from the map
      //  console.log("procedureName "+procedureName);
        var map_obj = ap_queryAndDownload.CONFIG.selection_map[procedureName];
        var data=[];
      //  console.log("map_obj.elements_name len "+map_obj.elements_name.length);
        for(var j=0; j<map_obj.elements_name.length; j++)
        {  //  console.log("map_obj.elements_name "+map_obj.elements_name[j]);
            data[j] = {value: map_obj.elements_id[j], label: map_obj.elements_name[j], checked: map_obj.elements_value[j]};
            $("#selection_" + listboxID).jqxComboBox('insertAt', data[j], j);
            if(map_obj.elements_value[j]==true)
            {
                $("#selection_" + listboxID).jqxComboBox('checkIndex', j);
            }
        }
        //Recreate the memory section
        var memory_app = "";
        $('#memory_' + listboxID).children().remove();
        var title = $("<div class='compare-summary-title'></div>");
        title.text("SELECTION: ");
        $('#memory_' + listboxID).append(title);
        for(var i=0; i<procedureNameArray.length;i++)
        {
            var obj = ap_queryAndDownload.CONFIG.selection_map[procedureNameArray[i]];
            for(var z=0; z<obj.elements_name.length;z++)
            {
                if(obj.elements_value[z]==true)
                {
                    var labelelement = $("<div id='"+obj.elements_id[z]+"_"+listboxID+"' class='summary-item grey-tooltip' data-toggle='tooltip' data-placement='bottom' title='Click to remove it from the selection' onClick='ap_queryAndDownload.removeItem(this.id);'></div>");
                    labelelement.text("" + obj.elements_name[z]);
                    $('#memory_' + listboxID).append(labelelement);
                    $("#"+obj.elements_id[z]+"_"+listboxID).tooltip();
                }
            }
        }

        if($('#memory_' + listboxID).children().length==1)
        {
            //There is only the Selection element
            $('#memory_' + listboxID).hide();
            ap_queryAndDownload.visibilityCheck('hide');
        }
       // $("#selection_" + listboxID).jqxComboBox('open' );
    }

    //ap_queryAndDownload.active_year_tab
    //procedureName = Code associated to the real name of the PMT
    function clickYearTab(listboxID, procedureName, procedureNameArray, tabType) {
       // alert("clickTab "+procedureName);
       // alert("before if")
        if(tabType == 'slider')
        {
            //Recreate the slider
           // alert("slider creation");
           // $("#"+procedureName + "_yearSlider").dateRangeSlider({bounds:{min: new Date(2000, 0, 1), max: new Date(2014, 11, 31)}, wheelMode: 'zoom', step:{days: 1}, range:{min:{days: 1}, max:{years: 40}}});
            var start_date_mm_int = parseInt(ap_queryAndDownload.CONFIG.slider_start_date_mm)-1;
            var end_date_mm_int = parseInt(ap_queryAndDownload.CONFIG.slider_end_date_mm)-1;
            $("#"+procedureName + "_yearSlider").dateRangeSlider("destroy");
            $("#"+procedureName + "_yearSlider").dateRangeSlider({bounds:{min: new Date(ap_queryAndDownload.CONFIG.slider_start_date_yy, ''+start_date_mm_int, ap_queryAndDownload.CONFIG.slider_start_date_dd), max: new Date(ap_queryAndDownload.CONFIG.slider_end_date_yy, ''+end_date_mm_int, ap_queryAndDownload.CONFIG.slider_end_date_dd)}, wheelMode: 'zoom', step:{days: 1}, range:{min:{years: 5}, max:{years: 60}}, formatter:function(val){
                var days = val.getDate(),
                    month = val.getMonth() + 1,
                    year = val.getFullYear();
                return days + "/" + month + "/" + year;
            }});
            $("#yearMin").text(ap_queryAndDownload.CONFIG.slider_start_date_yy);
            $("#yearMax").text(ap_queryAndDownload.CONFIG.slider_end_date_yy);
            var dateValues = $("#"+procedureName + "_yearSlider").dateRangeSlider("values");
            //console.log(dateValues.min.toString() + " " + dateValues.max.toString());
//            ap_queryAndDownload.CONFIG.slider_start_date_selected = dateValues.min.toString();
//            ap_queryAndDownload.CONFIG.slider_end_date_selected = dateValues.max.toString();
//            ap_queryAndDownload.CONFIG.slider_start_date_selected = moment(dateValues.min.toString()).format("YYYY-MM-DD");
//            ap_queryAndDownload.CONFIG.slider_end_date_selected = moment(dateValues.max.toString()).format("YYYY-MM-DD");
            ap_queryAndDownload.CONFIG.slider_start_date_selected = moment(dateValues.min.toString()).format("DD/MM/YYYY");
            ap_queryAndDownload.CONFIG.slider_end_date_selected = moment(dateValues.max.toString()).format("DD/MM/YYYY");
           // console.log("Before ap_queryAndDownload.CONFIG.slider_start_date_selected "+ap_queryAndDownload.CONFIG.slider_start_date_selected);
           // console.log("Before ap_queryAndDownload.CONFIG.slider_end_date_selected "+ap_queryAndDownload.CONFIG.slider_end_date_selected);
//            $("#"+procedureName + "_yearSlider").bind("valuesChanged", function(e, data){
//               // console.log("Values just changed. min: " + data.values.min + " max: " + data.values.max);
//                ap_queryAndDownload.CONFIG.slider_start_date_selected = moment(data.values.min.toString()).format("DD/MM/YYYY");
//                ap_queryAndDownload.CONFIG.slider_end_date_selected = moment(data.values.max.toString()).format("DD/MM/YYYY");
               // alert("ap_queryAndDownload.CONFIG.slider_start_date_selected "+ap_queryAndDownload.CONFIG.slider_start_date_selected+" ap_queryAndDownload.CONFIG.slider_end_date_selected "+ap_queryAndDownload.CONFIG.slider_end_date_selected);
//                //console.log("After ap_queryAndDownload.CONFIG.slider_start_date_selected "+ap_queryAndDownload.CONFIG.slider_start_date_selected);
//                //console.log("After ap_queryAndDownload.CONFIG.slider_end_date_selected "+ap_queryAndDownload.CONFIG.slider_end_date_selected);
//            });

            $("#selection_" + listboxID).jqxComboBox('uncheckAll');
            //Recreate the memory section
            $('#memory_' + listboxID).children().remove();
            var title = $("<div class='compare-summary-title'></div>");
            title.text("SELECTION: ");
            $('#memory_' + listboxID).append(title);
            var obj = ap_queryAndDownload.CONFIG.selection_map[procedureName];
           // console.log("procedureName = "+procedureName);
            for(var z=0; z<obj.elements_value.length;z++)
            {
                obj.elements_value[z]= false;
            }

            $('#memory_' + listboxID).hide();
            ap_queryAndDownload.visibilityCheck('hide');
        }
//        else{
//            //Classic year
//           // alert("classic creation");
//            //Uncheck all the elements in that combobox
//            $("#selection_" + listboxID).jqxComboBox('uncheckAll');
//
//            //Recreate the memory section
//            $('#memory_' + listboxID).children().remove();
//            var title = $("<div class='compare-summary-title'></div>");
//            title.text("SELECTION: ");
//            $('#memory_' + listboxID).append(title);
//
//            var obj = ap_queryAndDownload.CONFIG.selection_map[procedureName];
//            for(var z=0; z<obj.elements_value.length;z++)
//            {
//                  obj.elements_value[z]= false;
//            }
//
//            $('#memory_' + listboxID).hide();
//            ap_queryAndDownload.visibilityCheck('hide');
//        }

        ap_queryAndDownload.CONFIG.active_year_tab = tabType;
       // alert("clickTab ap_queryAndDownload.active_year_tab "+ap_queryAndDownload.CONFIG.active_year_tab);

        ap_queryAndDownload.CONFIG.active_tab[listboxID]= procedureName;

       // $("#selection_" + listboxID).jqxComboBox('open' );
//
//        //  String procedureNameArray to procedureNameArray
//        var rest = null;
//        //Clear the combo box to insert the new values
//        $("#selection_" + listboxID).jqxComboBox('clear');
//        //Get the info of the new tab from the map
//        var map_obj = ap_queryAndDownload.CONFIG.selection_map[procedureName];
//        var data=[];
//        for(var j=0; j<map_obj.elements_name.length; j++)
//        {
//            data[j] = {value: map_obj.elements_id[j], label: map_obj.elements_name[j], checked: map_obj.elements_value[j]};
//            $("#selection_" + listboxID).jqxComboBox('insertAt', data[j], j);
//            if(map_obj.elements_value[j]==true)
//            {
//                $("#selection_" + listboxID).jqxComboBox('checkIndex', j);
//            }
//        }
//        //Recreate the memory section
//        var memory_app = "";
//        $('#memory_' + listboxID).children().remove();
//        var title = $("<div class='compare-summary-title'></div>");
//        title.text("SELECTION: ");
//        $('#memory_' + listboxID).append(title);
//        for(var i=0; i<procedureNameArray.length;i++)
//        {
//            var obj = ap_queryAndDownload.CONFIG.selection_map[procedureNameArray[i]];
//            for(var z=0; z<obj.elements_name.length;z++)
//            {
//                if(obj.elements_value[z]==true)
//                {
//                    var labelelement = $("<div id='"+obj.elements_id[z]+"_"+listboxID+"' class='summary-item grey-tooltip' data-toggle='tooltip' data-placement='bottom' title='Click to remove it from the selection' onClick='ap_downloaddata.removeItem(this.id);'></div>");
//                    labelelement.text("" + obj.elements_name[z]);
//                    $('#memory_' + listboxID).append(labelelement);
//                    $("#"+obj.elements_id[z]+"_"+listboxID).tooltip();
//                }
//            }
//        }
//
//        if($('#memory_' + listboxID).children().length==1)
//        {
//            //There is only the Selection element
//            $('#memory_' + listboxID).hide();
//            ap_queryAndDownload.visibilityCheck('hide');
//        }
    }

    function checkItemEvent(listboxID) {

//        var rest = null;
//        // var list_id = null;
//        switch (procedureName) {
//            case 'usp_GetAreaList1'     : rest = 'countries';       break;
//            case 'usp_GetAreaList2'     : rest = 'regions';         break;
//            case 'usp_GetAreaList3'     : rest = 'specialgroups';   break;
//            case 'usp_GetItemList1'     : rest = 'items';           break;
//            case 'usp_GetItemList2'     : rest = 'itemsaggregated'; break;
//            case 'usp_GetElementList'   : rest = 'elements';        break;
//        }

        $("#selection_"+ listboxID).on('checkChange', function (event)
        {
            if (event.args) {
                var item = event.args.item;
                //Value is the id of the element
                var value = item.value;
                var label = item.label;
                //alert("value "+value+" label "+label);
                var checked = item.checked;
                var mapKey_index = value.indexOf('_');
                var mapKey = value.substring(0,mapKey_index);
               // alert("mapKey "+mapKey);
                var elem_position = value.substring(mapKey_index+1);
                var map_obj= ap_queryAndDownload.CONFIG.selection_map[mapKey];
                var map_elem_index = map_obj.elements_name.indexOf(label);
                //alert("map_elem_index "+map_elem_index);
//                console.log("item "+item);
//                console.log("value "+value);
//                console.log("label "+label);
//                console.log("checked "+checked);
               // console.log("checkedItems "+checkedItems);
                if(checked == true)
                {
                   // alert('elem_position '+elem_position);
//                    if(listboxID == 'ListBox2')
//                    {
                        if(elem_position==0)
                        {
                            //"Select All" case
                            //Change the value for each element of the selected combo box
                            //to put each element at false
                            //It starts from 1 because the first element is "Select All"
                            //alert('map_obj.elements_name.length  '+map_obj.elements_name.length);
                            for(var i_elem = 1; i_elem< map_obj.elements_name.length; i_elem++)
                            {
                                $("#selection_" + listboxID).jqxComboBox('uncheckIndex', i_elem);
                            }
                        }
                        else
                        {
                            //If the user click on another element
                            //Uncheck "Select All"
                            $("#selection_" + listboxID).jqxComboBox('uncheckIndex', 0);
                        }
                   // }
                  //  console.log(" listboxID "+listboxID);
                    $('#memory_' + listboxID).show();
                    ap_queryAndDownload.visibilityCheck('show');
                    //Id without space
                    var labelelement = $("<div id='"+value+"_"+listboxID+"' class='summary-item grey-tooltip' data-toggle='tooltip' data-placement='bottom' title='Click to remove it from the selection' onClick='ap_queryAndDownload.removeItem(this.id);'></div>");
                    labelelement.text("" + label);
                    $('#memory_' + listboxID).append(labelelement);

                    $("#"+value+"_"+listboxID).tooltip();

                    //Updating the list map
                    if(map_elem_index != -1)
                    {
                        map_obj.elements_value[map_elem_index] = true;
                    }
                }
                else
                {
                    //Updating the list map
                    if(map_elem_index != -1)
                    {
                        map_obj.elements_value[map_elem_index] = false;
                    }

                    $("#"+value+"_"+listboxID).tooltip('destroy'); // $("#Pmt1_3_ListBox2").tooltip('destroy');
                    $("#"+value+"_"+listboxID).remove();
                    if($('#memory_' + listboxID).children().length==1)
                    {
                        //There is only the Selection element
                        $('#memory_' + listboxID).hide();
                        ap_queryAndDownload.visibilityCheck('show');
                    }
                }
            }
        });
    }

    function removeItem(id)
    {
        //id=Pmt1_1_ListBox2
        var n = id.lastIndexOf("_");
        var listboxID = id.substring(n+1);
        var s = id.indexOf("_");
        var value = id.substring(0, n);

        var mapKey = id.substring(0,s);
       // $("#"+id).remove();
        //alert("s="+s+" n="+n);
        var position= parseInt(id.substring((s+1),n));

        var map_obj= ap_queryAndDownload.CONFIG.selection_map[mapKey];
        var map_elem_index = map_obj.elements_id.indexOf(value);
        if(map_elem_index != -1)
        {
            map_obj.elements_value[map_elem_index] = false;
        }
        $("#"+value+"_"+listboxID).tooltip('destroy'); // $("#Pmt1_3_ListBox2").tooltip('destroy');
        $("#"+value+"_"+listboxID).remove();
        if($('#memory_' + listboxID).children().length==2)
        {
            //There is only the Selection element
            $('#memory_' + listboxID).hide();
            ap_queryAndDownload.visibilityCheck('hide');
        }

        var listBox_current_tab = ap_queryAndDownload.CONFIG.active_tab[listboxID];
       // alert("Before uncheck index listBox_current_tab ="+listBox_current_tab+" mapKey "+mapKey);
        if(listBox_current_tab==mapKey)
        {
            $("#selection_"+ listboxID).jqxComboBox('uncheckIndex', position);
        }
    }

    function buildStandardTab(listboxID, payload, fromDb) {

        //The unique difference if:
        //1- fromDb = true -> the name of tabs are taken from db
        //2- fromDb = false -> the name of tabs are taken from json file
        var tab_name_code= [];
        var tab_name_description= [];
        var tab_name_label= [];
        var tab_procedure_name= [];

        if(fromDb == true)
        {
//            tab_name_code = ["Pmt1","Pmt2","Pmt3","Pmt4"];
//            tab_name_label = ["Pmt1","Pmt2","Pmt3","Pmt4"];
//            tab_name_description = ["Real Name Pmt1","Real Name Pmt2","Real Name Pmt3","Real Name Pmt4"];
//            tab_procedure_name = ["PMTList", "PMTList", "PMTList", "PMTList"];
            //This is the case of the PMT

            ap_queryAndDownload.buildStandardTabFromDbPolicyType(listboxID);
        }
        else
        {
            for(var i=0 ; i < payload.length ; i++) {
                tab_name_code[i]= payload[i][1];
               // alert("tab_name_code[i] "+tab_name_code[i]);
                tab_name_label[i]= payload[i][4];
                tab_name_description[i]= payload[i][5];
                tab_procedure_name[i]= payload[i][3];
            }
            for(var i = 0 ; i < tab_name_code.length ; i++) {
                var obj = new Object();
                //Potrebbe sparire perche' e' gia' nella chiave
                obj.list_name = listboxID;
                obj.elements_name =[];
                obj.elements_value =[];
                obj.elements_code =[];
                obj.elements_id =[];
                ap_queryAndDownload.CONFIG.selection_map[tab_name_code[i]] = obj;
            }

            /* Initiate the variable. */
            var s = "";
            /* Build the UI. */
            s += "<div class='row'>";
            s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
            if((payload[0][1]=="PolicyMeasureType"))
            {
                s += "<div class='codelistType'>";
            }
            else{
                s += "<div class='codelistTypeWithoutPointer'>";
            }

            /* Build tab headers. */
            for (var i = 0 ; i < tab_name_code.length ; i++) {
                var c = (i == 0) ? 'checked="checked"' : '';
                s += "<input type='radio' " + c + " value='" + tab_name_code[i] + "' name='radios_" + listboxID + "' id='" + tab_name_code[i] + "'>";
                s += "<label title='"+tab_name_description[i]+"'for='" + tab_name_code[i] + "' id='" + tab_name_code[i] + "_label'>" + tab_name_label[i] + "</label>";
                if (i < tab_name_code.length - 1)
                    s += " | ";
            }
            s += "</div>";
            s += "<div class='row'>";
            s += "<div class='col-xs-12 col-sm-12 col-md-10 col-lg-10'>";
            s += "<div id='selection_" + listboxID + "' style='width: 100%;'>";
            s += "</div>";
            s += "</div>";
            s += "<div class='col-xs-6 col-sm-6 col-md-1 col-lg-1'>";
            //s += "<button id='" + listboxID + "_select_all' onclick='selectAll(\"" + 'memory_' + listboxID + "\");' style='width: 100%;' type='button' class='btn btn-sm btn-primary' title='"+ $.i18n.prop('_select_all')+"'>";
            s += "<button id='" + listboxID + "_select_all' style='width: 100%;' type='button' class='btn btn-xs btn-primary'>"+$.i18n.prop('_selectAll_button');
//        s += "<span class='glyphicon glyphicon-ok'></span> ";
            s += "</button>";
            s += "</div>";
            s += "<div class='col-xs-6 col-sm-6 col-md-1 col-lg-1'>";
            s += "<button id='" + listboxID + "_clear_all' style='width: 100%;' type='button' class='btn btn-xs btn-danger' title='"+ $.i18n.prop('_clear_selection')+"'>";
            s += "<span class='glyphicon glyphicon-remove'></span> ";
            s += "</button>";
            s += "</div>";
            s += "</div>";
            s += "</div>";
            s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
            s += "<div id='memory_" + listboxID + "' style='width: 100%;'></div>";
            s += "</div>";
            s += "</div>";
            s += "<br>";
            /* Append it to the document. */
            if((payload[0][1]=="CommodityClass"))
            {
                $('#' + CONFIG.placeholderID + 'selector_container_1').append(s);
            }
            else if((payload[0][1]=="Countries")){
                $('#' + CONFIG.placeholderID + 'selector_container_3').append(s);
            }

            $('#' +  listboxID + '_select_all').click({ listboxID: listboxID},function(e){
              //  console.log(e.data.listboxID);
                ap_queryAndDownload.selectAll(e.data.listboxID);
            });

            $('#' +  listboxID + '_clear_all').click({ listboxID: listboxID},function(e){
              //  console.log(e.data.listboxID);
                ap_queryAndDownload.clearAll(e.data.listboxID);
            });

//            for (var i = 0 ; i < tab_name_code.length ; i++) {
//                if((payload[0][1]=="PolicyMeasureType"))
//                {
//                    $('#' + tab_name_code[i]).click({ listboxID: listboxID, tab_single_code: tab_name_code[i], tab_code_array: tab_name_code},function(e){
//                     //   console.log(e.data.listboxID);
//                     //  console.log(e.data.tab_single_code);
//                     //   console.log(e.data.tab_code_array);
//                        ap_queryAndDownload.clickTab(e.data.listboxID, e.data.tab_single_code, e.data.tab_code_array);
//                    });
//                }
//            }
            $('#memory_' + listboxID).hide();
            ap_queryAndDownload.visibilityCheck('hide');
            var title = $("<div class='compare-summary-title'></div>");
            title.text("SELECTION: ");
            $('#memory_' + listboxID).append(title);
            ap_queryAndDownload.checkItemEvent(listboxID);
            ap_queryAndDownload.populateStandardTab(listboxID, tab_name_code, tab_name_label, tab_procedure_name);
        }
    }


    function buildStandardTabFromDbPolicyType(listboxID) {

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
//        console.log(" policy_domain_code "+policy_domain_code);

        //Getting codes from the Commodity Domain Selection
        if(ap_queryAndDownload.CONFIG.commodity_radio_checked == $.i18n.prop('_commodity_domain_both'))
        {
            commodity_domain_code = ap_queryAndDownload.CONFIG.commodity_domain_map[$.i18n.prop('_commodity_domain_agricultural')]+","+ap_queryAndDownload.CONFIG.commodity_domain_map[$.i18n.prop('_commodity_domain_biofuels')];
            //alert(" IF Before call commodity_domain_code "+commodity_domain_code);
        }
        else
        {
            commodity_domain_code = ap_queryAndDownload.CONFIG.commodity_domain_map[ap_queryAndDownload.CONFIG.commodity_radio_checked];
            //alert(" ELSE Before call commodity_domain_code "+commodity_domain_code +" ap_queryAndDownload.CONFIG.commodity_radio_checked "+ap_queryAndDownload.CONFIG.commodity_radio_checked);
        }
      //  console.log(" Before call policy_domain_code "+policy_domain_code);
      //  console.log(" Before call commodity_domain_code "+commodity_domain_code);
        /* Retrive UI structure from DB. */
        $.ajax({

            type: 'GET',
            // url: CONFIG.listboxes_url + '/' + CONFIG.datasource + '/' + CONFIG.domainCode + '/' + CONFIG.lang,
            //url: 'http://localhost:8090/wds/rest/policyservice/commodityPolicyDomain/POLICY',
            url: 'http://'+ap_queryAndDownload.CONFIG.base_ip_address+':'+ap_queryAndDownload.CONFIG.base_ip_port+ap_queryAndDownload.CONFIG.commodityPolicyTypes_url+ '/' + ap_queryAndDownload.CONFIG.datasource+ '/' +policy_domain_code+ '/' +commodity_domain_code,
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
                //    console.log("Policy json["+i+"][0] ***"+ json[i][0]+"***");
                //    console.log("Policy json["+i+"][1] ***"+ json[i][1]+"***");
                    tab_name_code[i] = 'Pmt'+json[i][0];
                    tab_name_label[i] = json[i][1];
                    tab_name_description[i] = json[i][1];
                    tab_procedure_name[i] = ["PMTList"];
                }

//                for (var i = 3 ; i < 100 ; i++) {
//                    //    console.log("Policy json["+i+"][0] ***"+ json[i][0]+"***");
//                    //    console.log("Policy json["+i+"][1] ***"+ json[i][1]+"***");
//                    tab_name_code[i] = 'Pmt'+i;
//                    tab_name_label[i] = "Test"+i;
//                    tab_name_description[i] = "Test"+i;
//                    tab_procedure_name[i] = ["PMTList"];
//                }

                ap_queryAndDownload.CONFIG.first_tab_PMT = tab_name_code[0];
                //alert("init "+ap_queryAndDownload.CONFIG.first_tab_PMT);

//                var tab_name_code = ["Pmt1","Pmt2","Pmt3","Pmt4"];
//                var tab_name_label = ["Pmt1","Pmt2","Pmt3","Pmt4"];
//                var tab_name_description = ["Real Name Pmt1","Real Name Pmt2","Real Name Pmt3","Real Name Pmt4"];
//                var tab_procedure_name = ["PMTList", "PMTList", "PMTList", "PMTList"];

//                var tab_name_code = ["Pmt1","Pmt2","Pmt3","Pmt4"];
//                var tab_name_label = ["Pmt1","Pmt2","Pmt3","Pmt4"];
//                var tab_name_description = ["Real Name Pmt1","Real Name Pmt2","Real Name Pmt3","Real Name Pmt4"];
//                var tab_procedure_name = ["PMTList", "PMTList", "PMTList", "PMTList"];
                ap_queryAndDownload.CONFIG.policyType_actualTabs = [];
                for(var i = 0 ; i < tab_name_code.length ; i++) {
                    var obj = new Object();
                    //Potrebbe sparire perche' e' gia' nella chiave
                    obj.list_name = listboxID;
                    obj.elements_name =[];
                    obj.elements_value =[];
                    obj.elements_code =[];
                    obj.elements_id =[];
                    ap_queryAndDownload.CONFIG.selection_map[tab_name_code[i]] = obj;
                    ap_queryAndDownload.CONFIG.policyType_actualTabs[i] = tab_name_code[i];
                   // console.log("ap_queryAndDownload.policyType_actualTabs[i] "+ap_queryAndDownload.policyType_actualTabs[i]);
                }

                /* Initiate the variable. */
                var s = "";
                /* Build the UI. */
                s += "<div class='row'>";
                s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
//                if((payload[0][1]=="PolicyMeasureType"))
//                {
//                    s += "<div class='codelistType'>";
//                }
//                else{
//                    s += "<div class='codelistTypeWithoutPointer'>";
//                }
                s += "<div class='codelistType'>";

                /* Build tab headers. */
                for (var i = 0 ; i < tab_name_code.length ; i++) {
                    var c = (i == 0) ? 'checked="checked"' : '';
                    s += "<input type='radio' " + c + " value='" + tab_name_code[i] + "' name='radios_" + listboxID + "' id='" + tab_name_code[i] + "'>";
                    s += "<label title='"+tab_name_description[i]+"'for='" + tab_name_code[i] + "' id='" + tab_name_code[i] + "_label'>" + tab_name_label[i] + "</label>";
                    if (i < tab_name_code.length - 1)
                        s += " | ";
                }
                s += "</div>";
                s += "<div class='row'>";
                s += "<div class='col-xs-12 col-sm-12 col-md-10 col-lg-10'>";
                s += "<div id='selection_" + listboxID + "' style='width: 100%;'>";
                s += "</div>";
                s += "</div>";
                s += "<div class='col-xs-6 col-sm-6 col-md-1 col-lg-1'>";
                //s += "<button id='" + listboxID + "_select_all' onclick='selectAll(\"" + 'memory_' + listboxID + "\");' style='width: 100%;' type='button' class='btn btn-sm btn-primary' title='"+ $.i18n.prop('_select_all')+"'>";
                s += "<button id='" + listboxID + "_select_all' style='width: 100%;' type='button' class='btn btn-xs btn-primary'>"+$.i18n.prop('_selectAll_button');
                //s += "<span class='glyphicon glyphicon-ok'></span> ";
                s += "</button>";
                s += "</div>";
                s += "<div class='col-xs-6 col-sm-6 col-md-1 col-lg-1'>";
                s += "<button id='" + listboxID + "_clear_all' style='width: 100%;' type='button' class='btn btn-xs btn-danger' title='"+ $.i18n.prop('_clear_selection')+"'>";
                s += "<span class='glyphicon glyphicon-remove'></span> ";
                s += "</button>";
                s += "</div>";
                s += "</div>";
                s += "</div>";
                s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
                s += "<div id='memory_" + listboxID + "' style='width: 100%;'></div>";
                s += "</div>";
                s += "</div>";
                s += "<br>";
                /* Append it to the document. */
                $('#' + CONFIG.placeholderID + 'selector_container_2').append(s);

                $('#' +  listboxID + '_select_all').click({ listboxID: listboxID},function(e){
                  //  console.log(e.data.listboxID);
                    ap_queryAndDownload.selectAll(e.data.listboxID);
                });

                $('#' +  listboxID + '_clear_all').click({ listboxID: listboxID},function(e){
                  //  console.log(e.data.listboxID);
                    ap_queryAndDownload.clearAll(e.data.listboxID);
                });


                for (var i = 0 ; i < tab_name_code.length ; i++) {
                    $('#' + tab_name_code[i]).click({ listboxID: listboxID, tab_single_code: tab_name_code[i], tab_code_array: tab_name_code},function(e){
                    //    console.log(e.data.listboxID);
                    //    console.log(e.data.tab_single_code);
                    //    console.log(e.data.tab_code_array);
                        ap_queryAndDownload.clickTab(e.data.listboxID, e.data.tab_single_code, e.data.tab_code_array);
                    });
                }
//                    if((payload[0][1]=="PolicyMeasureType"))
//                    {
//                        $('#' + tab_name_code[i]).click({ listboxID: listboxID, tab_single_code: tab_name_code[i], tab_code_array: tab_name_code},function(e){
//                            console.log(e.data.listboxID);
//                            console.log(e.data.tab_single_code);
//                            console.log(e.data.tab_code_array);
//                            ap_queryAndDownload.clickTab(e.data.listboxID, e.data.tab_single_code, e.data.tab_code_array);
//                        });
//                    }

                $('#memory_' + listboxID).hide();
                ap_queryAndDownload.visibilityCheck('hide');
                var title = $("<div class='compare-summary-title'></div>");
                title.text("SELECTION: ");
                $('#memory_' + listboxID).append(title);
                ap_queryAndDownload.checkItemEvent(listboxID);
                ap_queryAndDownload.populateStandardTab(listboxID, tab_name_code, tab_name_label, tab_procedure_name);
            },

            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    }

    function buildStandardTabFromDb(listboxID) {

        //The unique difference if:
        //1- fromDb = true -> the name of tabs are taken from db
        //2- fromDb = false -> the name of tabs are taken from json file
        var tab_name_code= [];
        var tab_name_description= [];
        var tab_name_label= [];
        var tab_procedure_name= [];

        //tab_name_code[i] = 'ListBox1';

        if(listboxID=='ListBox1')
        {
            tab_name_code[0] = 'CommodityClass';
            tab_name_label[0] = $.i18n.prop('_commodity_class_title');
            tab_name_description[0] = $.i18n.prop('_commodity_class_title');
            tab_procedure_name[0] = "CommodityClassList";
        }
//
//        for(var i = 0 ; i < tab_name_code.length ; i++) {
//            console.log("tab_name_code[i] "+tab_name_code[i]);
//            delete ap_queryAndDownload.CONFIG.selection_map[tab_name_code[i]];
//        }

        for(var i = 0 ; i < tab_name_code.length ; i++) {
            var obj = new Object();
            //Potrebbe sparire perche' e' gia' nella chiave
            obj.list_name = listboxID;
            obj.elements_name =[];
            obj.elements_value =[];
            obj.elements_code =[];
            obj.elements_id =[];

//            if((ap_queryAndDownload.CONFIG.selection_map[tab_name_code[i]]!=null)||(typeof ap_queryAndDownload.CONFIG.selection_map[tab_name_code[i]]!= 'undefined'))
//            {
//                console.log("Deleting from selection_map tab_name_code[i] "+tab_name_code[i]);
//                delete ap_queryAndDownload.CONFIG.selection_map[tab_name_code[i]];
//            }
//            else
//            {
//                console.log("NOT Deleting from selection_map tab_name_code[i] "+tab_name_code[i]);
//            }
            ap_queryAndDownload.CONFIG.selection_map[tab_name_code[i]] = obj;
        }

        /* Initiate the variable. */
        var s = "";
        /* Build the UI. */
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
        s += "<div class='codelistTypeWithoutPointer'>";

        /* Build tab headers. */
        for (var i = 0 ; i < tab_name_code.length ; i++) {
            var c = (i == 0) ? 'checked="checked"' : '';
            s += "<input type='radio' " + c + " value='" + tab_name_code[i] + "' name='radios_" + listboxID + "' id='" + tab_name_code[i] + "'>";
            s += "<label title='"+tab_name_description[i]+"'for='" + tab_name_code[i] + "' id='" + tab_name_code[i] + "_label'>" + tab_name_label[i] + "</label>";
            if (i < tab_name_code.length - 1)
                s += " | ";
        }
        s += "</div>";
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-10 col-lg-10'>";
        s += "<div id='selection_" + listboxID + "' style='width: 100%;'>";
        s += "</div>";
        s += "</div>";
        s += "<div class='col-xs-6 col-sm-6 col-md-1 col-lg-1'>";
        //s += "<button id='" + listboxID + "_select_all' onclick='selectAll(\"" + 'memory_' + listboxID + "\");' style='width: 100%;' type='button' class='btn btn-sm btn-primary' title='"+ $.i18n.prop('_select_all')+"'>";
        s += "<button id='" + listboxID + "_select_all' style='width: 100%;' type='button' class='btn btn-xs btn-primary'>"+$.i18n.prop('_selectAll_button');
//        s += "<span class='glyphicon glyphicon-ok'></span> ";
        s += "</button>";
        s += "</div>";
        s += "<div class='col-xs-6 col-sm-6 col-md-1 col-lg-1'>";
        s += "<button id='" + listboxID + "_clear_all' style='width: 100%;' type='button' class='btn btn-xs btn-danger' title='"+ $.i18n.prop('_clear_selection')+"'>";
        s += "<span class='glyphicon glyphicon-remove'></span> ";
        s += "</button>";
        s += "</div>";
        s += "</div>";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
        s += "<div id='memory_" + listboxID + "' style='width: 100%;'></div>";
        s += "</div>";
        s += "</div>";
        s += "<br>";
        /* Append it to the document. */
        if(listboxID == 'ListBox1')
        {
            $('#' + CONFIG.placeholderID + 'selector_container_1').append(s);
        }

        $('#' +  listboxID + '_select_all').click({ listboxID: listboxID},function(e){
            //  console.log(e.data.listboxID);
            ap_queryAndDownload.selectAll(e.data.listboxID);
        });

        $('#' +  listboxID + '_clear_all').click({ listboxID: listboxID},function(e){
            //  console.log(e.data.listboxID);
            ap_queryAndDownload.clearAll(e.data.listboxID);
        });

        $('#memory_' + listboxID).hide();
        ap_queryAndDownload.visibilityCheck('hide');
        var title = $("<div class='compare-summary-title'></div>");
        title.text("SELECTION: ");
        $('#memory_' + listboxID).append(title);
        ap_queryAndDownload.checkItemEvent(listboxID);
        //ListBox1 tab_name_code ListBox1 tab_name_label Commodity Class tab_procedure_name CommodityClassList
        //console.log("buildStandardTabFromDb before calling populateStandardTab "+listboxID +" tab_name_code "+tab_name_code[0]+" tab_name_label "+tab_name_label[0]+" tab_procedure_name[0] "+tab_procedure_name[0]);
        ap_queryAndDownload.populateStandardTab(listboxID, tab_name_code, tab_name_label, tab_procedure_name);
    }

    function buildYearTab(listboxID, payload, fromDb) {

        //The unique difference if:
        //1- fromDb = true -> the name of tabs are taken from db
        //2- fromDb = false -> the name of tabs are taken from json file
        var tab_name_code= [];
        var tab_name_description= [];
        var tab_name_label= [];
        var tab_procedure_name= [];

        for(var i=0 ; i < payload.length ; i++) {
            // console.log("buildYearTab: tab_name_code= "+payload[i][1]+" tab_name_label= "+payload[i][4]+" tab_name_description= "+payload[i][5]+" tab_procedure_name= "+payload[i][3]);
            //tab_name_code= Years
            tab_name_code[i]= payload[i][1];
            //tab_name_label= Years
            tab_name_label[i]= payload[i][4];
            //tab_name_description= Years Title
            tab_name_description[i]= payload[i][5];
            //tab_procedure_name= YearList
            tab_procedure_name[i]= payload[i][3];
        }
        for(var i = 0 ; i < tab_name_code.length ; i++) {
            var obj = new Object();
            //Potrebbe sparire perche' e' gia' nella chiave
            obj.list_name = listboxID;
            obj.elements_name =[];
            obj.elements_value =[];
            obj.elements_id =[];
            ap_queryAndDownload.CONFIG.selection_map[tab_name_code[i]] = obj;
        }

        /* Initiate the variable. */
        var s = "";

        /* Build the UI. */
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
        s += "<div class='codelistType'>";

        /* Build tab headers. */
        for (var i = 0 ; i < tab_name_code.length ; i++) {
            var c = (i == 0) ? 'checked="checked"' : '';
            s += "<input type='radio' " + c + " value='" + tab_name_code[i] + "_slider' name='radios_" + listboxID + "' id='" + tab_name_code[i] + "_slider'>";
            s += "<label title='"+tab_name_description[i]+"'onclick='ap_queryAndDownload.showSlider();' for='" + tab_name_code[i] + "_slider' id='" + tab_name_code[i] + "_slider_label'>" + tab_name_label[i] + " " + $.i18n.prop('_slider') + "</label>";
            s += " | ";
            s += "<input type='radio' value='" + tab_name_code[i] + "_classic' name='radios_" + listboxID + "' id='" + tab_name_code[i] + "_classic'>";
            s += "<label title='"+tab_name_description[i]+"'onclick='ap_queryAndDownload.hideSlider();' for='" + tab_name_code[i] + "_classic' id='" + tab_name_code[i] + "_classic_label'>" + tab_name_label[i] + " " + $.i18n.prop('_classic') + "</label>";
        }

        s += "</div>";
        s += "<div id='years_classic_container' style='display: none;'>";
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-10 col-lg-10'>";
//        s += "<select data-placeholder='" + $.i18n.prop('_' + listboxID) + "' id='selection_years' multiple='' class='chosen-select' style='width: 100%;'>";
//        s += "</select>";
        s += "<div id='selection_" + listboxID + "' style='width: 100%;'>";
        s += "Test</div>";
        s += "</div>";
        s += "<div class='col-xs-6 col-sm-6 col-md-1 col-lg-1'>";
        s += "<button id='" + listboxID + "_select_all' style='width: 100%;' type='button' class='btn btn-xs btn-primary'>"+$.i18n.prop('_selectAll_button');
//        s += "<span class='glyphicon glyphicon-ok'></span> ";
        s += "</button>";
        s += "</div>";
        s += "<div class='col-xs-6 col-sm-6 col-md-1 col-lg-1'>";
        s += "<button id='" + listboxID + "_clear_all' style='width: 100%;' type='button' class='btn btn-xs btn-danger' title='"+ $.i18n.prop('_clear_selection')+"'>";
        s += "<span class='glyphicon glyphicon-remove'></span> ";
        s += "</button>";
        s += "</div>";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
        s += "<div id='memory_" + listboxID + "' style='width: 100%;'></div>";
        s += "</div>";
        s += "</div>";
        s += "<div id='years_slider_container' style='display: block;'>";
        s += "<br><div class='col-lg-12'><div id='"+tab_name_code[0] + "_yearSlider'></div></div>";
        s += "<div id='yearMin' style='float: left'></div>";
        s += "<div id='yearMax' style='float: right'></div>";
        s += "</div>";
        s += "</div>";
        s += "</div>";
        s += "</div>";
        s += "<br>";
        /* Append it to the document. */
        $('#' + CONFIG.placeholderID + 'selector_container_3').append(s);
//        $("#"+tab_name_code[0] + "_yearSlider").dateRangeSlider({bounds:{min: new Date(2000, 0, 1), max: new Date(2014, 11, 31)}, wheelMode: 'zoom', step:{days: 1}, range:{min:{days: 1}, max:{years: 40}}});

        $('#' +  listboxID + '_select_all').click({ listboxID: listboxID},function(e){
          //  console.log(e.data.listboxID);
            ap_queryAndDownload.selectAll(e.data.listboxID);
        });

        $('#' +  listboxID + '_clear_all').click({ listboxID: listboxID},function(e){
          //  console.log(e.data.listboxID);
            ap_queryAndDownload.clearAll(e.data.listboxID);
        });

//        for (var i = 0 ; i < tab_name_code.length ; i++) {
//            alert("tab_name_code.length "+tab_name_code.length +" tab_name_code[i] "+tab_name_code[i]);
//            $('#' + tab_name_code[i]).click({ listboxID: listboxID, tab_single_code: tab_name_code[i], tab_code_array: tab_name_code},function(e){
//                console.log(e.data.listboxID);
//                console.log(e.data.tab_single_code);
//                console.log(e.data.tab_code_array);
//                ap_queryAndDownload.clickTab(e.data.listboxID, e.data.tab_single_code, e.data.tab_code_array);
//            });
//        }
        //Classic
        $("#"+tab_name_code[0] + "_classic").click({ listboxID: listboxID, tab_single_code: tab_name_code[0], tab_code_array: tab_name_code, tab_type: 'classic'},function(e){
          //  console.log(e.data.listboxID);
          //  console.log(e.data.tab_single_code);
          //  console.log(e.data.tab_code_array);
            ap_queryAndDownload.clickYearTab(e.data.listboxID, e.data.tab_single_code, e.data.tab_code_array, e.data.tab_type);
        });
        //Slider
        $("#"+tab_name_code[0] + "_slider").click({ listboxID: listboxID, tab_single_code: tab_name_code[0], tab_code_array: tab_name_code, tab_type: 'slider'},function(e){
         //   console.log(e.data.listboxID);
         //   console.log(e.data.tab_single_code);
         //   console.log(e.data.tab_code_array);
            ap_queryAndDownload.clickYearTab(e.data.listboxID, e.data.tab_single_code, e.data.tab_code_array, e.data.tab_type);
        });

        ap_queryAndDownload.CONFIG.active_year_tab = 'slider';

        $('#memory_' + listboxID).hide();
        ap_queryAndDownload.visibilityCheck('hide');
        var title = $("<div class='compare-summary-title'></div>");
        title.text("SELECTION: ");
        $('#memory_' + listboxID).append(title);
        ap_queryAndDownload.checkItemEvent(listboxID);
        ap_queryAndDownload.populateStandardTab(listboxID, tab_name_code, tab_name_label, tab_procedure_name);

        //To remove Start
        /* Initiate the slider. */
      //  populateYears();

        /* Add 'memory' control. */
     //   memoryController('selection_years', 'memory_years', true);
        //To remove End
    }

//    function buildDomainTab(listboxID, payload) {
//
//        /* Initiate the variable. */
//        var s = "";
//
//        /* Build the UI. */
//        s += "<div class='row'>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
//
//        s += "<div class='codelistTypeWithoutPointer'>";
//        s += "<input type='radio' checked='checked' value='" + payload[0][3] + "' name='radios_" + listboxID + "' id='" + payload[0][3] + "'>";
//        s += "<label for='" + payload[0][3] + "' id='" + payload[0][3] + "_label'>" + payload[0][1] + "</label>";
//        s += "</div>";
//        s += "</div>";
//
//        s += "<div class='row'>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-1 col-lg-1'></div>";
//        s += "<div class='col-xs-6 col-sm-6 col-md-6 col-lg-3'><div>Commodity Domain</div></div>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-2 col-lg-2'></div>";
//        s += "<div class='col-xs-6 col-sm-6 col-md-6 col-lg-3'><div>Policy Domain</div></div>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-3 col-lg-3'></div>";
//        s += "</div>";
//        s += "<div class='row'>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-1 col-lg-1'></div>";
//        s += "<div class='col-xs-2 col-sm-2 col-md-1 col-lg-1'><div id='" + payload[0][3] + "_commodity_radioButton1'>Agriculture</div></div>";
//        s += "<div class='col-xs-2 col-sm-2 col-md-1 col-lg-1'><div id='" + payload[0][3] + "_commodity_radioButton2'>Biofuels</div></div>";
//        s += "<div class='col-xs-2 col-sm-2 col-md-1 col-lg-1'><div id='" + payload[0][3] + "_commodity_radioButton3'>Both</div></div>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-2 col-lg-2'></div>";
//        s += "<div class='col-xs-2 col-sm-2 col-md-1 col-lg-1'><div id='" + payload[0][3] + "_policy_radioButton1'>Trade</div></div>";
//        s += "<div class='col-xs-2 col-sm-2 col-md-1 col-lg-1'><div id='" + payload[0][3] + "_policy_radioButton2'>Domestic</div></div>";
//        s += "<div class='col-xs-2 col-sm-2 col-md-1 col-lg-1'><div id='" + payload[0][3] + "_policy_radioButton3'>Both</div></div>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-3 col-lg-3'></div>";
//        s += "</div>";
//        s += "<br>";
//
//        /* Append it to the document. */
////        $('#' + CONFIG.placeholderID + '_container').append(s);
//       // $('#pane1').append(s);
//        $('#' + CONFIG.placeholderID + 'selector_container').append(s);
//        $("#"+payload[0][3] + "_policy_radioButton1").jqxRadioButton({checked : true, theme: CONFIG.theme, groupName :'selector_policyDomain'});
//        $("#"+payload[0][3] + "_policy_radioButton2").jqxRadioButton({checked : false, theme: CONFIG.theme, groupName :'selector_policyDomain'});
//        $("#"+payload[0][3] + "_policy_radioButton3").jqxRadioButton({checked : false, theme: CONFIG.theme, groupName :'selector_policyDomain'});
//
//        $("#"+payload[0][3] + "_commodity_radioButton1").jqxRadioButton({checked : true, theme: CONFIG.theme, groupName :'selector_commodityDomain'});
//        $("#"+payload[0][3] + "_commodity_radioButton2").jqxRadioButton({checked : false, theme: CONFIG.theme, groupName :'selector_commodityDomain'});
//        $("#"+payload[0][3] + "_commodity_radioButton3").jqxRadioButton({checked : false, theme: CONFIG.theme, groupName :'selector_commodityDomain'});
//
//        //If the user select "Domestic" only "Biofuels" will be available
////        $("#"+payload[0][3] + "_policy_radioButton2").on('change', function (event) {
////            $("#"+payload[0][3] + "_commodity_radioButton1").jqxRadioButton('disable');
////            $("#"+payload[0][3] + "_commodity_radioButton3").jqxRadioButton('disable');
////        });
////
////        $("#"+payload[0][3] + "_policy_radioButton1").on('change', function (event) {
////            $("#"+payload[0][3] + "_commodity_radioButton1").jqxRadioButton('enable');
////            $("#"+payload[0][3] + "_commodity_radioButton3").jqxRadioButton('enable');
////        });
////
////        $("#"+payload[0][3] + "_policy_radioButton3").on('change', function (event) {
////            $("#"+payload[0][3] + "_commodity_radioButton1").jqxRadioButton('enable');
////            $("#"+payload[0][3] + "_commodity_radioButton3").jqxRadioButton('enable');
////        });
//    }

    function buildDomainTab(listboxID, payload) {

        /* Initiate the variable. */
        var s = "";

        /* Build the UI. */
        s += "<div class='row'>";
        s += "<div class='col-xs-6 col-sm-6 col-md-3 col-lg-3'>";
        s += "<div class='codelistTypeWithoutPointerCheckbox'>";
        s += "<input type='checkbox' checked='checked' value='" + payload[0][3] + "' name='radios_" + listboxID + "' id='" + payload[0][3] + "'>";
        s += "<label for='" + payload[0][3] + "' id='" + payload[0][3] + "_label'>" + $.i18n.prop('_commodity_domain_title') + "</label>";
        s += "</div>";
        s += "</div>";
        s += "<div class='col-md-2 col-lg-2'></div>";
        s += "<div class='col-xs-6 col-sm-6 col-md-3 col-lg-3'>";
        s += "<div class='codelistTypeWithoutPointerCheckbox'>";
        s += "<input type='checkbox' checked='checked' value='" + payload[0][3] + "' name='radios_" + listboxID + "' id='" + payload[0][3] + "'>";
        s += "<label for='" + payload[0][3] + "' id='" + payload[0][3] + "_label'>" + $.i18n.prop('_policy_domain_title') + "</label>";
        s += "</div>";
        s += "</div>";
        s += "</div>";

        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 '></div>";
        s += "<div class='col-xs-2 col-sm-2 col-md-1 col-lg-1'><div id='" + payload[0][3] + "_commodity_radioButton1'>"+$.i18n.prop('_commodity_domain_agricultural')+"</div></div>";
        s += "<div class='col-xs-2 col-sm-2 col-md-1 col-lg-1'><div id='" + payload[0][3] + "_commodity_radioButton2'>"+$.i18n.prop('_commodity_domain_biofuels')+"</div></div>";
        s += "<div class='col-xs-2 col-sm-2 col-md-1 col-lg-1'><div id='" + payload[0][3] + "_commodity_radioButton3'>"+$.i18n.prop('_commodity_domain_both')+"</div></div>";
        s += "<div class='col-md-2 col-lg-2'></div>";
        s += "<div class='col-xs-2 col-sm-2 col-md-1 col-lg-1'><div id='" + payload[0][3] + "_policy_radioButton1'>"+$.i18n.prop('_policy_domain_trade')+"</div></div>";
        s += "<div class='col-xs-2 col-sm-2 col-md-1 col-lg-1'><div id='" + payload[0][3] + "_policy_radioButton2'>"+$.i18n.prop('_policy_domain_domestic')+"</div></div>";
        s += "<div class='col-xs-2 col-sm-2 col-md-1 col-lg-1'><div id='" + payload[0][3] + "_policy_radioButton3'>"+$.i18n.prop('_policy_domain_both')+"</div></div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-6 col-lg-6'></div>";
        s += "</div>";
        s += "<br>";

        /* Append it to the document. */
//        $('#' + CONFIG.placeholderID + '_container').append(s);
        // $('#pane1').append(s);
        $('#' + CONFIG.placeholderID + 'selector_container_0').append(s);
        $("#"+payload[0][3] + "_policy_radioButton1").jqxRadioButton({checked : true, theme: CONFIG.theme, groupName :'selector_policyDomain'});
        $("#"+payload[0][3] + "_policy_radioButton2").jqxRadioButton({checked : false, theme: CONFIG.theme, groupName :'selector_policyDomain'});
        $("#"+payload[0][3] + "_policy_radioButton3").jqxRadioButton({checked : false, theme: CONFIG.theme, groupName :'selector_policyDomain'});
        //By default this policy radio button is Checked
        ap_queryAndDownload.CONFIG.policy_radio_checked = $.i18n.prop('_policy_domain_trade');

        $("#"+payload[0][3] + "_commodity_radioButton1").jqxRadioButton({checked : true, theme: CONFIG.theme, groupName :'selector_commodityDomain'});
        $("#"+payload[0][3] + "_commodity_radioButton2").jqxRadioButton({checked : false, theme: CONFIG.theme, groupName :'selector_commodityDomain'});
        $("#"+payload[0][3] + "_commodity_radioButton3").jqxRadioButton({checked : false, theme: CONFIG.theme, groupName :'selector_commodityDomain'});
        //By default this commodity radio button is Checked
        ap_queryAndDownload.CONFIG.commodity_radio_checked = $.i18n.prop('_commodity_domain_agricultural');
        ap_queryAndDownload.CONFIG.policy_commodity_domain_map = new Object();
        ap_queryAndDownload.CONFIG.policy_domain_map = new Object();
        ap_queryAndDownload.CONFIG.commodity_domain_map = new Object();
        ap_queryAndDownload.CONFIG.policy_domain_map[ap_queryAndDownload.CONFIG.policy_radio_checked]= 1;
        ap_queryAndDownload.CONFIG.commodity_domain_map[ap_queryAndDownload.CONFIG.commodity_radio_checked]= 1;
        //The codes are setted by default

        /* Retrive UI structure from DB. */
        $.ajax({

            type: 'GET',
            // url: CONFIG.listboxes_url + '/' + CONFIG.datasource + '/' + CONFIG.domainCode + '/' + CONFIG.lang,
            //url: 'http://localhost:8090/wds/rest/policyservice/commodityPolicyDomain/POLICY',
            url: 'http://'+ap_queryAndDownload.CONFIG.base_ip_address+':'+ap_queryAndDownload.CONFIG.base_ip_port+ap_queryAndDownload.CONFIG.commodityPolicyDomain_url+ '/' + ap_queryAndDownload.CONFIG.datasource,
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
                $("#"+payload[0][3] + "_policy_radioButton1").on('change', function (event) {
                    var checked = event.args.checked;
                    var policy_label = $.i18n.prop('_policy_domain_trade');
                    ap_queryAndDownload.CONFIG.policy_radio_checked = policy_label;
                    if(checked)
                    {
                        ap_queryAndDownload.commodity_from_policy_domain_changes(policy_label, payload[0][3]);
                    }
                });

                $("#"+payload[0][3] + "_policy_radioButton2").on('change', function (event) {
                    var checked = event.args.checked;
                    var policy_label = $.i18n.prop('_policy_domain_domestic');
                    ap_queryAndDownload.CONFIG.policy_radio_checked = policy_label;
                    if(checked)
                    {
                        ap_queryAndDownload.commodity_from_policy_domain_changes(policy_label, payload[0][3]);
                    }
                });

                $("#"+payload[0][3] + "_policy_radioButton3").on('change', function (event) {
                    var checked = event.args.checked;
                    var policy_label = $.i18n.prop('_policy_domain_both');
                    ap_queryAndDownload.CONFIG.policy_radio_checked = policy_label;
                    if(checked)
                    {
                        ap_queryAndDownload.commodity_from_policy_domain_changes(policy_label, payload[0][3]);
                    }
                });

                $("#"+payload[0][3] + "_commodity_radioButton1").on('change', function (event) {
                    var checked = event.args.checked;
                    if(checked)
                    {
                        ap_queryAndDownload.CONFIG.commodity_radio_checked = $.i18n.prop('_commodity_domain_agricultural');
                        ap_queryAndDownload.rebuild_selectionPanelPolicyTypes();
                        ap_queryAndDownload.rebuild_selectionPanelCommodityClass();
                    }
                });

                $("#"+payload[0][3] + "_commodity_radioButton2").on('change', function (event) {
                    var checked = event.args.checked;
                    if(checked)
                    {
                        ap_queryAndDownload.CONFIG.commodity_radio_checked = $.i18n.prop('_commodity_domain_biofuels');
                        ap_queryAndDownload.rebuild_selectionPanelPolicyTypes();
                        ap_queryAndDownload.rebuild_selectionPanelCommodityClass();
                    }
                });

                $("#"+payload[0][3] + "_commodity_radioButton3").on('change', function (event) {
                    var checked = event.args.checked;
                    if(checked)
                    {
                        ap_queryAndDownload.CONFIG.commodity_radio_checked = $.i18n.prop('_commodity_domain_both');
                        ap_queryAndDownload.rebuild_selectionPanelPolicyTypes();
                        ap_queryAndDownload.rebuild_selectionPanelCommodityClass();
                    }
                });
            },

            error : function(err,b,c) {
                alert(err.status + ", " + b + ", " + c);
            }
        });
    }

    function commodity_from_policy_domain_changes(policy_domain_label, list_for_id)
    {
        var commodity_domain_labels = ap_queryAndDownload.CONFIG.policy_commodity_domain_map[policy_domain_label];
        var enabled =[false,false,false];
        for(var i=0; i<commodity_domain_labels.length; i++)
        {
            switch(commodity_domain_labels[i])
            {
                case $.i18n.prop('_commodity_domain_agricultural'):
                    $("#"+list_for_id + "_commodity_radioButton1").jqxRadioButton('enable');
                    enabled[0]=true;
                    if(i==0)
                    {
                        $("#"+list_for_id + "_commodity_radioButton1").jqxRadioButton('check');
                    }
                    break;
                case $.i18n.prop('_commodity_domain_biofuels'):
                    $("#"+list_for_id + "_commodity_radioButton2").jqxRadioButton('enable');
                    enabled[1]=true;
                    if(i==0)
                    {
                        $("#"+list_for_id + "_commodity_radioButton2").jqxRadioButton('check');
                    }
                    break;
                case $.i18n.prop('_commodity_domain_both'):
                    $("#"+list_for_id + "_commodity_radioButton3").jqxRadioButton('enable');
                    enabled[2]=true;
                    if(i==0)
                    {
                        $("#"+list_for_id + "_commodity_radioButton3").jqxRadioButton('check');
                    }
                    break;
            }
        }
        for(var j=0; j<enabled.length; j++)
        {
             if(enabled[j]==false)
             {
                 $("#"+list_for_id + "_commodity_radioButton"+(j+1)).jqxRadioButton('disable');
             }
        }
    }

    function rebuild_selectionPanelPolicyTypes()
    {
        //Remove the Pmt Selection Panel
        $('#' + CONFIG.placeholderID + 'selector_container_2').children().remove();
        for(var z=0; z< ap_queryAndDownload.CONFIG.policyType_actualTabs.length; z++)
        {
            delete ap_queryAndDownload.CONFIG.selection_map[ap_queryAndDownload.CONFIG.policyType_actualTabs[z]];
        }
        //ap_queryAndDownload.policyType_actualTabs = [];
        //Build again the panel
        ap_queryAndDownload.buildStandardTabFromDbPolicyType('ListBox2');
    }

    function rebuild_selectionPanelCommodityClass()
    {
        //Remove the Pmt Selection Panel
        $('#' + CONFIG.placeholderID + 'selector_container_1').children().remove();

        //Build again the panel
        ap_queryAndDownload.buildStandardTabFromDb('ListBox1');
    }

//    function buildPMTTab(listboxID, payload) {
//
//        /* Initiate the variable. */
//        var s = "";
//
//        /* Build the UI. */
//        s += "<div class='row'>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
//
//        s += "<div class='codelistType'>";
//        s += "<input type='radio' checked='checked' value='" + payload[0][3] + "' name='radios_" + listboxID + "' id='" + payload[0][3] + "'>";
//        s += "<label for='" + payload[0][3] + "' id='" + payload[0][3] + "_label'>" + payload[0][1] + "</label>";
//        s += "</div>";
//        s += "</div>";
//
//        s += "<div class='row'>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
//        s += "<div class='col-lg-5'>Please select a/more Policy Measure Types</div>";
//        s += "<div class='col-lg-7'></div>";
//        s += "</div>";
//        s += "</div>";
//        s += "<br>";
//
//        s += "<div class='row'>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
//        s += "<div class='col-lg-3'></div>";
//        s += "<div class='col-lg-6'><div id='" + payload[0][3] + "_pmt_checkbox1'>PMT1</div></div>";
//        s += "<div class='col-lg-3'></div>";
//        s += "</div>";
//        s += "</div>";
//        s += "<div class='row'>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
//        s += "<div class='col-lg-3'></div>";
//        s += "<div class='col-lg-6'><div id='" + payload[0][3] + "_pmt_checkbox2'>PMT2</div></div>";
//        s += "<div class='col-lg-3'></div>";
//        s += "</div>";
//        s += "</div>";
//        s += "<div class='row'>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
//        s += "<div class='col-lg-3'></div>";
//        s += "<div class='col-lg-6'><div id='" + payload[0][3] + "_pmt_checkbox3'>PMT3</div></div>";
//        s += "<div class='col-lg-3'></div>";
//        s += "</div>";
//        s += "</div>";
//        s += "<div class='row'>";
//        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
//        s += "<div class='col-lg-3'></div>";
//        s += "<div class='col-lg-6'><div id='" + payload[0][3] + "_pmt_checkbox4'>PMT4</div></div>";
//        s += "<div class='col-lg-3'></div>";
//        s += "</div>";
//        s += "</div>";
//        s += "<br>";
//
//        /* Append it to the document. */
////        $('#' + CONFIG.placeholderID + '_container').append(s);
//       // $('#pane1').append(s);
//        $('#' + CONFIG.placeholderID + 'selector_container').append(s);
//        $('#'+payload[0][3] + '_pmt_checkbox1').jqxCheckBox({checked : false, theme: CONFIG.theme});
//        $('#'+payload[0][3] + '_pmt_checkbox2').jqxCheckBox({checked : false, theme: CONFIG.theme});
//        $('#'+payload[0][3] + '_pmt_checkbox3').jqxCheckBox({checked : false, theme: CONFIG.theme});
//        $('#'+payload[0][3] + '_pmt_checkbox4').jqxCheckBox({checked : false, theme: CONFIG.theme});
//    }

    function clearAll(listboxID) {
        //Cleaning the memory section
        $('#memory_' + listboxID).empty();
        var title = $("<div class='compare-summary-title'></div>");
        title.text("SELECTION: ");
        $('#memory_' + listboxID).append(title);
        $('#memory_' + listboxID).hide();
        ap_queryAndDownload.visibilityCheck('hide');
        $("#selection_" + listboxID).jqxComboBox('uncheckAll');
        //Setting all the elements of the map as false for that listbox(all the tabs)
       // console.log("Map Start ");
        $.each(ap_queryAndDownload.CONFIG.selection_map, function(k, v) {
          //  console.log(" list name from map= "+ap_queryAndDownload.CONFIG.selection_map[k].list_name);
           // console.log(" list name from listboxID= "+listboxID);
            if(ap_queryAndDownload.CONFIG.selection_map[k].list_name==listboxID)
            {   //Pmt1_0_ListBox2
                for(var i=0; i<ap_queryAndDownload.CONFIG.selection_map[k].elements_value.length; i++)
                {
                    ap_queryAndDownload.CONFIG.selection_map[k].elements_value[i] = false;
                }
            }
           // console.log("Map  k= "+k+" v= "+v);
        })
       // console.log("Map End ");
    }

    function selectAll(listboxID) {
        //Cleaning the memory section
      //  alert("selectAll function: before cleaning memory section");
        $('#memory_' + listboxID).empty();
        var title = $("<div class='compare-summary-title'></div>");
        title.text("SELECTION: ");
        $('#memory_' + listboxID).append(title);
        $('#memory_' + listboxID).show();
        ap_queryAndDownload.visibilityCheck('show');
        //Setting the 'Selection All' as checked
        $("#selection_" + listboxID).jqxComboBox('checkIndex', 0);
        //Setting all the elements of the map as false for that listbox(all the tabs)
      //  console.log("Map Start ");
        $.each(ap_queryAndDownload.CONFIG.selection_map, function(k, v) {
         //   console.log(" list name from map= "+ap_queryAndDownload.CONFIG.selection_map[k].list_name);
         //   console.log(" list name from listboxID= "+listboxID);
            if(ap_queryAndDownload.CONFIG.selection_map[k].list_name==listboxID)
            {   //Pmt1_0_ListBox2
                var value = ''+k+'_0';
                ap_queryAndDownload.CONFIG.selection_map[k].elements_value[0] = true;
                var labelelement = $("<div id='"+value+"_"+listboxID+"' class='summary-item grey-tooltip' data-toggle='tooltip' data-placement='bottom' title='Click to remove it from the selection' onClick='ap_downloaddata.removeItem(this.id);'></div>");
                labelelement.text("" + ap_queryAndDownload.CONFIG.selection_map[k].elements_name[0]);
                if(k!=ap_queryAndDownload.CONFIG.active_tab[listboxID])
                {
                    $('#memory_' + listboxID).append(labelelement);
                }
                $("#"+value+"_"+listboxID).tooltip();
                for(var i=1; i<ap_queryAndDownload.CONFIG.selection_map[k].elements_value.length; i++)
                {
                    ap_queryAndDownload.CONFIG.selection_map[k].elements_value[i] = false;
                }
            }
        })
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

//        var s = "<li ><a target='_blank' href='../policy/doc/PolicyDefinitions.pdf'>All_data</a></li>";
//        $('#bulk-downloads-menu').append(s);
//        s = "<li><a target='_blank' href='#'>Biofuel data</a></li>";
//        $('#bulk-downloads-menu').append(s);
//        s = "<li><a target='_blank' href='#'>Agricultural data</a></li>";
//        $('#bulk-downloads-menu').append(s);
//        s = "<li><a target='_blank' href='#'>Biofuel trade</a></li>";
//        $('#bulk-downloads-menu').append(s);
//        s = "<li><a target='_blank' href='#'>Biofuel domestic</a></li>";
//        $('#bulk-downloads-menu').append(s);
//        s = "<li><a target='_blank' href='#'>Agricultural import measures</a></li>";
//        $('#bulk-downloads-menu').append(s);
//        s = "<li><a target='_blank' href='#'>Agricultural export measures</a></li>";
//        $('#bulk-downloads-menu').append(s);
    }

    function populateBulkDownloadsTab() {
//        $("#allData_radioButton").jqxRadioButton({checked: true, theme: CONFIG.theme, groupName :'bulkDownload_type'});
//        $("#biofuelData_radioButton").jqxRadioButton({checked: false, theme: CONFIG.theme, groupName :'bulkDownload_type'});
//        $("#agriculturalData_radioButton").jqxRadioButton({checked: false, theme: CONFIG.theme, groupName :'bulkDownload_type'});
//        $("#biofuelTrade_radioButton").jqxRadioButton({checked: false, theme: CONFIG.theme, groupName :'bulkDownload_type'});
//        $("#bioufuelDomestic_radioButton").jqxRadioButton({checked: false, theme: CONFIG.theme, groupName :'bulkDownload_type'});
//        $("#agriculturalIm_radioButton").jqxRadioButton({checked: false, theme: CONFIG.theme, groupName :'bulkDownload_type'});
//        $("#agriculturalEx_radioButton").jqxRadioButton({checked: false, theme: CONFIG.theme, groupName :'bulkDownload_type'});
    }

    function buildBulkDownloadTab(){
        var s = "<br /><div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-8 col-lg-8'><div>Available downloads:</div>";
        s += "</div></div>";
        s +="<div class='row'>";
        s += "<div class='col-xs-2 col-sm-2 col-md-4 col-lg-4'></div>";
        s += "<div class='col-xs-10 col-sm-10 col-md-8 col-lg-8'>";
        s += "<div style='margin-top: 10px;' id='allData_radioButton'><a target='_blank' href='../policy/doc/query_download/Bulk_AllData.zip'>All data</a></div>";
        s += "<div style='margin-top: 10px;' id='biofuelData_radioButton'><a target='_blank' href='../policy/doc/query_download/Bulk_BiofuelData.zip'>Biofuel data</a></div>";
        s += "<div style='margin-top: 10px;' id='agriculturalData_radioButton'><a target='_blank' href='../policy/doc/query_download/Bulk_AgricultureData.zip'>Agricultural data</a></div>";
        s += "<div style='margin-top: 10px;' id='biofuelTrade_radioButton'><a target='_blank' href='../policy/doc/query_download/Bulk_BiofuelData_trade.zip'>Biofuel trade</a></div>";
        s += "<div style='margin-top: 10px;' id='bioufuelDomestic_radioButton'><a target='_blank' href='../policy/doc/query_download/Bulk_BiofuelData_domestic.zip'>Biofuel domestic</a></div>";
        s += "<div style='margin-top: 10px;' id='agriculturalIm_radioButton'><a target='_blank' href='../policy/doc/query_download/Bulk_AgricultureData_ImportMeasures.zip'>Agricultural import measures</a></div>";
        s += "<div style='margin-top: 10px;' id='agriculturalEx_radioButton'><a target='_blank' href='../policy/doc/query_download/Bulk_AgricultureData_ExportMeasures.zip'>Agricultural export measures</a></div>";
        s += "</div></div>";
//        //Download Button
//        s += "<br>";
//        s += "<div class='row'>";
//        s += "<div class='col-xs-1 col-sm-1 col-md-3 col-lg-3'></div>";
//        s += "<div class='col-xs-10 col-sm-10 col-md-5 col-lg-5'>";
//        s += "<button class='btn btn-sm btn-primary' type='button' style='width: 100%;' onclick='ap_queryAndDownload.preview();'>";
//        s += "<span class='glyphicon glyphicon-eye-open'></span>";
//        s += " Bulk Download";
//        s += "</button>";
//        s += "</div>";
//        s += "<div class='col-xs-1 col-sm-1 col-md-4 col-lg-4'></div>";
//        s += "</div>";
        return s;
    }


    function buildUIStructure() {

        /* Initiate variables. */
        var s = "";
        /* Append header. */
        s += buildUIHeader();
        s += "<br>";
        return s;
    }

    function buildPageActionsContainer() {

        /* Initiate variables. */
        var s = "";
        s += "<div class='row'>";
//        s += "<div class='col-md-8 col-lg-8'></div>";
//        s += "<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2'>";
//        s += "<a href='javascript:void(0)' onclick='ap_queryAndDownload.optionsVisibility();' id='hide_options'>"+$.i18n.prop('_hidePreviewOptions')+"</a></div>";
        s += "<div class='col-xs-6 col-sm-6 col-md-10 col-lg-10'>";
        s += "<div id='fullscreen' style='background-color: #FFFFFF; display: none;'></div>";
        s += "</div>";
        s += "<div class='col-xs-6 col-sm-6 col-md-2 col-lg-2'>";
        s += "<a href='javascript:void(0)' onclick='ap_queryAndDownload.selectionsVisibility();' id='hide_selections'>"+$.i18n.prop('_hideSelections')+"</a></div>";
        s += "</div>";
        $('#' + CONFIG.placeholderID + 'page_actions_container').append(s);
        var s = "";    //onclick='ap_queryAndDownload.preview_button();'
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-10 col-lg-10'>";
        s += "&nbsp;";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-1 col-lg-1'>";
//        s += "<button class='btn btn-sm btn-primary' id='close_fullscreen_button' type='button' style='width: 100%;' >";
//        s += "<span class='glyphicon glyphicon-eye-open'></span>";
//        s += " " + $.i18n.prop('_close_fullscreen');
//        s += "</button>";
//        s += "<button id='close_fullscreen_button' type='button' style='width: 100%;' >";
//        s += "<span class='glyphicon glyphicon-eye-open'></span>";
//        s += " " + $.i18n.prop('_close_fullscreen');
//        s += "</button>";
//        s += "<div><a href='#' onclick='ap_queryAndDownload.closeFullscreen()'>Close</a></div>";
        s += "<div><button onclick='ap_queryAndDownload.closeFullscreen()'>"+$.i18n.prop('_close_fullscreen')+"</button></div>";
        s += "</div>";
        s += "<div class='col-xs-12 col-sm-12 col-md-1 col-lg-1'>";
        s += "&nbsp;";
        s += "</div>";
        s += "</div>";
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>";
        s +="<div style='background-color:#FFFFFF;' id='fullScreenContent'  ></div>";  //
        s += "</div>";
        s += "</div>";


       $('#fullscreen').append(s);
        ap_queryAndDownload.fullScreenContent();
        $('#close_fullscreen_button').on('click', function () {
           // alert("Close full screen clicked");
            $('#fullscreen').css("display", "none");
            $('#fullscreen').fullScreen(false);
        });
    }

    function closeFullscreen()
    {
        $('#fullscreen').css("display", "none");
        $('#fullscreen').fullScreen(false);
    }

    function fullScreenContent()
    {
        var container = $('<div style="margin: 5px;"></div>')  ;
        var leftcolumn = $('<div style="margin: 20px; float: left; width: 97%;"></div>');
       // var rightcolumn = $('<div style="float: left; width: 40%;"></div>');
        container.append(leftcolumn);
        var html = $('<html></html>');
        var body = $('<body></body>');
       // alert(screen.availHeight);
        var htmlcontainer = $('<div style="overflow:auto; height: '+(screen.availHeight-50)+'px;"></div>');


        var x = "<div style='margin: 10px;'><b>"+"uid" +":</b> " + "" + "</div>";
        $(htmlcontainer).append(x1);
        var x1 = "<div style='margin: 10px;'><b>"+"language" +":</b> " + "EN" + "</div>";
        $(htmlcontainer).append(x1);
        var x2 = "<div style='margin: 10px;'><b>"+"title" +":</b> " + "Countervailing measures imposed by Australia on biodiesel exported from the USA" + "</div>";
        $(htmlcontainer).append(x2);
        var x3 = "<div style='margin: 10px;'><b>"+"creationDate" +":</b> " + "18/03/2014" + "</div>";
        $(htmlcontainer).append(x3);
        var x4 = "<div style='margin: 10px;'><b>"+"characterSet" +":</b> " + "UTF8" + "</div>";
        $(htmlcontainer).append(x4);
        var x5 = "<div style='margin: 10px;'><b>"+"contact" +":</b> " + "CI_ResponsibleParty" + "</div>";
        $(htmlcontainer).append(x5);
        var x6 = "<div style='margin: 10px;'><b>"+"name" +":</b> " + "Annelies Deuss" + "</div>";
        $(htmlcontainer).append(x6);
        var x7 = "<div style='margin: 10px;'><b>"+"organization" +":</b> " + "OECD" + "</div>";
        $(htmlcontainer).append(x7);
        var x8 = "<div style='margin: 10px;'><b>"+"position" +":</b> " + "Analyst TAD/ATM" + "</div>";
        $(htmlcontainer).append(x8);
        var x9 = "<div style='margin: 10px;'><b>"+"contactInfo" +":</b> " + "CI_Contact" + "</div>";
        $(htmlcontainer).append(x9);
        var x10 = "<div style='margin: 10px;'><b>"+"role" +":</b> " + "007, 008" + "</div>";
        $(htmlcontainer).append(x10);
        var x11 = "<div style='margin: 10px;'><b>"+"phone" +":</b> " + "+(33-1) 45 24 96 52" + "</div>";
        $(htmlcontainer).append(x11);
        var x12 = "<div style='margin: 10px;'><b>"+"address" +":</b> " + "2, rue André Pascal, 75775 Paris Cedex 16, France" + "</div>";
        $(htmlcontainer).append(x12);
        var x13 = "<div style='margin: 10px;'><b>"+"emailAddress" +":</b> " + "Annelies.DEUSS@oecd.org" + "</div>";
        $(htmlcontainer).append(x13);
        var x14 = "<div style='margin: 10px;'><b>"+"hoursOfService" +":</b> " + "9:00 to 18:00" + "</div>";
        $(htmlcontainer).append(x14);
//        var x15 = "<div style='margin: 10px;'><b>"+"contactInstruction" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x15);
        var x16 = "<div style='margin: 10px;'><b>"+"keyWords" +":</b> " + "Countervailing duty, biodiesel, Australia, USA" + "</div>";
        $(htmlcontainer).append(x16);
        var x17 = "<div style='margin: 10px;'><b>"+"description" +":</b> " + "Countervailing duty rates imposed by Australia on biodiesel exported from the USA are recorded for HS codes 38260010 and 38260020, version HS2012 of the internationally standardized product nomenclature, the Harmonized System (HS) used by WTO Members, and assigned to the Product_AMIS aggregate 'Biodiesel'. The duty rate might be indicated as a number or as a text if some additional explanation is required" + "</div>";
        $(htmlcontainer).append(x17);
        var x18 = "<div style='margin: 10px;'><b>"+"summary" +":</b> " + "007, 008" + "</div>";
        $(htmlcontainer).append(x18);
        var x19 = "<div style='margin: 10px;'><b>"+"classificationSystem" +":</b> " + "For countries: FAO-GAUL classification . For commodities: Harmonized System (HS) used by WTO Members, version HS2012. Product aggregation and policy domains, policy types and measures are classified according to an AMIS internal classification system (provided in the home page www. (area with standards)." + "</div>";
        $(htmlcontainer).append(x19);
        var x20 = "<div style='margin: 10px;'><b>"+"statisticalPopulation" +":</b> " + "Policy measures targeted at wheat, maize, rice, soyabeans and biofuel transport liquids implemented on AMIS countries" + "</div>";
        $(htmlcontainer).append(x20);
        var x21 = "<div style='margin: 10px;'><b>"+"referencePeriod" +":</b> " + "From 18-04-2011 to 18-04-2016" + "</div>";
        $(htmlcontainer).append(x21);
//        var x22 = "<div style='margin: 10px;'><b>"+"referenceArea" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x22);
        var x23 = "<div style='margin: 10px;'><b>"+"coverageSector" +":</b> " + "Crops: wheat, maize, rice, soyabean and biofuels products: ethanol, biodiesel." + "</div>";
        $(htmlcontainer).append(x23);
//        var x24 = "<div style='margin: 10px;'><b>"+"sectorCoded" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x24);
        var x25 = "<div style='margin: 10px;'><b>"+"coverageTime" +":</b> " + "Data for the period starting from 2011" + "</div>";
        $(htmlcontainer).append(x25);
        var x26 = "<div style='margin: 10px;'><b>"+"coverageGeographic" +":</b> " + "Argentina, Australia, Brazil, Canada, China, European Union, France, Germany, India, Indonesia, Italy, Japan, Mexico, Republic of Korea, Russian Federation, Saudi Arabia, Turkey, U.K. of Great Britain and Northern Ireland and United States of America from the G20, and Egypt, Kazakhstan, Nigeria, Philippines, South Africa, Spain, Thailand, Ukraine and Viet Nam" + "</div>";
        $(htmlcontainer).append(x26);
        var x27 = "<div style='margin: 10px;'><b>"+"statisticalUnit" +":</b> " + "Duty rates applied" + "</div>";
        $(htmlcontainer).append(x27);
        var x28 = "<div style='margin: 10px;'><b>"+"unitOfMeasure" +":</b> " + "unkwnown" + "</div>";
        $(htmlcontainer).append(x28);
        var x29 = "<div style='margin: 10px;'><b>"+"unitOfMeasureDetails" +":</b> " + "Measurement units are not provided because duty rates are confidential" + "</div>";
        $(htmlcontainer).append(x29);
        var x30 = "<div style='margin: 10px;'><b>"+"institutionalMandateDataSharing" +":</b> " + "WTO?" + "</div>";
        $(htmlcontainer).append(x30);
//        var x31 = "<div style='margin: 10px;'><b>"+"legalActAgreements" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x31);
//        var x32 = "<div style='margin: 10px;'><b>"+"Punctuality" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x32);
//        var x33 = "<div style='margin: 10px;'><b>"+"costAndBurden" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x33);
//        var x34 = "<div style='margin: 10px;'><b>"+"efficiencyManagement" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x34);
//        var x35 = "<div style='margin: 10px;'><b>"+"costAndBurdenResources" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x35);
        var x36 = "<div style='margin: 10px;'><b>"+"UserNeeds" +":</b> " + "The main users are AMIS analysts, other international organizations, ministries and government agencies, trade and professional associations, research institutes and universities, journalists and general public. The AMIS team is not aware of unmet needs." + "</div>";
        $(htmlcontainer).append(x36);
        var x37 = "<div style='margin: 10px;'><b>"+"UserSatisfaction" +":</b> " + "No user satisfaction studies have been conducted which may explain why the AMIS is not aware of unmet user needs." + "</div>";
        $(htmlcontainer).append(x37);
        var x38 = "<div style='margin: 10px;'><b>"+"comparabilityDomains" +":</b> " + "There is a limitation in the comparability across individual commodities/products because product data are sometimes recorded in different HS versions or in the case of domestic measures there are not standard international classifications based on which policy measures are issued." + "</div>";
        $(htmlcontainer).append(x38);
//        var x39 = "<div style='margin: 10px;'><b>"+"comparabilityTime" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x39);
        var x40 = "<div style='margin: 10px;'><b>"+"comparabilityGeographical" +":</b> " + "There is limited geographical comparability due to differences between countries in methods, coverage or currencies, except for regions with homogenous countries, e.g. EU countries, which are bound by EU trade regulations. Furthermore for some countries information on the duty level remains confidential or duty rates are different for different producing companies." + "</div>";
        $(htmlcontainer).append(x40);
//        var x41 = "<div style='margin: 10px;'><b>"+"coherenceCrossDomain" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x41);
//        var x42 = "<div style='margin: 10px;'><b>"+"coherenceIntern" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x42);
        var x43 = "<div style='margin: 10px;'><b>"+"statisticalConceptAndDefinitions" +":</b> " + "Applied duty rate" + "</div>";
        $(htmlcontainer).append(x43);
        var x44 = "<div style='margin: 10px;'><b>"+"documentsOfMetodology" +":</b> " + "URUGUAY ROUND AGREEMENT, Agreement on Subsidies and Countervailing Measures. 'Members shall take all necessary steps to ensure that the imposition of a countervailing duty  on any product of the territory of any Member imported into the territory of another Member is in accordance with the provisions of Article VI of GATT 1994 and the terms of this Agreement.  Countervailing duties may only be imposed pursuant to investigations initiated and conducted in accordance with the provisions of this Agreement and the Agreement on Agriculture'. http://www.wto.org/english/docs_e/legal_e/24-scm.pdf" + "</div>";
        $(htmlcontainer).append(x44);
        var x45 = "<div style='margin: 10px;'><b>"+"dataCollection" +":</b> " + "Data has been collected from on-line available country legislations. In the future it is planned to make avaible for country officials an on-line input form to allow for the continuosly update of the data" + "</div>";
        $(htmlcontainer).append(x45);
        var x46 = "<div style='margin: 10px;'><b>"+"dataCompilation" +":</b> " + "Irregularly" + "</div>";
        $(htmlcontainer).append(x46);
        var x47 = "<div style='margin: 10px;'><b>"+"dataSource" +":</b> " + "The main source are the country legislations and regulations issued by Ministries or government agencies" + "</div>";
        $(htmlcontainer).append(x47);
        var x48 = "<div style='margin: 10px;'><b>"+"frequencyOfCollection" +":</b> " + "Data is expected to be annually updated" + "</div>";
        $(htmlcontainer).append(x48);
//        var x49 = "<div style='margin: 10px;'><b>"+"indexType" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x49);
//        var x50 = "<div style='margin: 10px;'><b>"+"IndexTypeCoded" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x50);
//        var x51 = "<div style='margin: 10px;'><b>"+"basePeriod" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x51);
        var x52 = "<div style='margin: 10px;'><b>"+"Adjustment" +":</b> " + "No adjustments are made" + "</div>";
        $(htmlcontainer).append(x52);
//        var x53 = "<div style='margin: 10px;'><b>"+"AdjustmentCoded" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x53);
        var x54 = "<div style='margin: 10px;'><b>"+"Aggregation" +":</b> " + "No aggregation rules apply" + "</div>";
        $(htmlcontainer).append(x54);
        var x55 = "<div style='margin: 10px;'><b>"+"qualityManagement" +":</b> " + "There is a methodological document that documents the structure, the procedures, the data production and dissemination proccess. Responsibilities and yet described in the methodological document" + "</div>";
        $(htmlcontainer).append(x55);
        var x56 = "<div style='margin: 10px;'><b>"+"qualityAssessment" +":</b> " + "There are no routines for assessing the quality, except for some input validation. Ideally country officials should validate the policy data input by the OECD. Data input by the country officials should be double check by the OECD." + "</div>";
        $(htmlcontainer).append(x56);
        var x57 = "<div style='margin: 10px;'><b>"+"qualityAssurance" +":</b> " + "Not specified" + "</div>";
        $(htmlcontainer).append(x57);
        var x58 = "<div style='margin: 10px;'><b>"+"qualityDocumentation" +":</b> " + "No quality documentation has been created" + "</div>";
        $(htmlcontainer).append(x58);
//        var x59 = "<div style='margin: 10px;'><b>"+"dataValidationIntermediate" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x59);
//        var x60 = "<div style='margin: 10px;'><b>"+"dataValidationOutput" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x60);
//        var x61 = "<div style='margin: 10px;'><b>"+"dataValidationResource" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x61);
//        var x62 = "<div style='margin: 10px;'><b>"+"clarity" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x62);
        var x63 = "<div style='margin: 10px;'><b>"+"completeness" +":</b> " + "Dataset is complete, although the values of the measure remain condifential as indicated in the official document from the Australian Government" + "</div>";
        $(htmlcontainer).append(x63);
//        var x64 = "<div style='margin: 10px;'><b>"+"compleetenessPercentage" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x64);
//        var x65 = "<div style='margin: 10px;'><b>"+"accuracyOverall" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x65);
//        var x66 = "<div style='margin: 10px;'><b>"+"accuracySampling" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x66);
//        var x67 = "<div style='margin: 10px;'><b>"+"accuracyNonSampling" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x67);
//        var x68 = "<div style='margin: 10px;'><b>"+"confidentialityPolicy" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x68);
        var x69 = "<div style='margin: 10px;'><b>"+"confidantialityDataSharing" +":</b> " + "Only non-confidential data are collected and recorded" + "</div>";
        $(htmlcontainer).append(x69);
        var x70 = "<div style='margin: 10px;'><b>"+"confidentialityStatus" +":</b> " + "Secondary confidentiality set by the sender, not for publication" + "</div>";
        $(htmlcontainer).append(x70);
        var x71 = "<div style='margin: 10px;'><b>"+"releaseCalendar" +":</b> " + "Not yet defined" + "</div>";
        $(htmlcontainer).append(x71);
//        var x72 = "<div style='margin: 10px;'><b>"+"releaseCalendarAccess" +":</b> " + "Not applicable" + "</div>";
//        $(htmlcontainer).append(x72);
        var x73 = "<div style='margin: 10px;'><b>"+"releaseTrasparency" +":</b> " + "Not yet defined" + "</div>";
        $(htmlcontainer).append(x73);
        var x74 = "<div style='margin: 10px;'><b>"+"releaseUserAccess" +":</b> " + "Data are first released only to country officials for their validation, then to the general public. How users are informed that the data are being released has not yet been defined" + "</div>";
        $(htmlcontainer).append(x74);
        var x75 = "<div style='margin: 10px;'><b>"+"onlineDatabase" +":</b> " + "Free consultation on the web." + "</div>";
        $(htmlcontainer).append(x75);
        var x76 = "<div style='margin: 10px;'><b>"+"disseminationFormat" +":</b> " + "Not yet defined" + "</div>";
        $(htmlcontainer).append(x76);
        var x77 = "<div style='margin: 10px;'><b>"+"disseminationPeriodicity" +":</b> " + "Not yet defined" + "</div>";
        $(htmlcontainer).append(x77);
        var x78 = "<div style='margin: 10px;'><b>"+"embargoTime" +":</b> " + "Not yet defined" + "</div>";
        $(htmlcontainer).append(x78);
        var x79 = "<div style='margin: 10px;'><b>"+"maintenanceAgency" +":</b> " + "OECD" + "</div>";
        $(htmlcontainer).append(x79);
//        var x80 = "<div style='margin: 10px;'><b>"+"revisionPolicy" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x80);
        var x81 = "<div style='margin: 10px;'><b>"+"revisionPractice" +":</b> " + "Preliminary data are compiled and country officials are asked to review it" + "</div>";
        $(htmlcontainer).append(x81);
        var x82 = "<div style='margin: 10px;'><b>"+"revisionStudies" +":</b> " + "Not planned" + "</div>";
        $(htmlcontainer).append(x82);
        var x83 = "<div style='margin: 10px;'><b>"+"updateDate" +":</b> " + "Not defined yet" + "</div>";
        $(htmlcontainer).append(x83);
        var x84 = "<div style='margin: 10px;'><b>"+"referenceUpdateDate" +":</b> " + "Not defined yet" + "</div>";
        $(htmlcontainer).append(x84);
        var x85 = "<div style='margin: 10px;'><b>"+"updatePeriodicity" +":</b> " + "Not defined yet" + "</div>";
        $(htmlcontainer).append(x85);
        var x86 = "<div style='margin: 10px;'><b>"+"pubblications" +":</b> " + "CI_Citation" + "</div>";
        $(htmlcontainer).append(x86);
        var x87 = "<div style='margin: 10px;'><b>"+"attachments" +":</b> " + "http://www.adcommission.gov.au/system/CurrentMeasures.asp" + "</div>";
        $(htmlcontainer).append(x87);
//        var x88 = "<div style='margin: 10px;'><b>"+"news" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x88);
//        var x89 = "<div style='margin: 10px;'><b>"+"otherDisseminatedData" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x89);
        var x90 = "<div style='margin: 10px;'><b>"+"documentKind" +":</b> " + "Legal document: Decision" + "</div>";
        $(htmlcontainer).append(x90);
        var x91 = "<div style='margin: 10px;'><b>"+"title" +":</b> " + "DUMPING COMMODITY REGISTER, BIODIESEL EXPORTED FROM THE UNITED STATES OF AMERICA" + "</div>";
        $(htmlcontainer).append(x91);
        var x92 = "<div style='margin: 10px;'><b>"+"date" +":</b> " + "01/01/2012" + "</div>";
        $(htmlcontainer).append(x92);
        var x93 = "<div style='margin: 10px;'><b>"+"citedResponsibleParty" +":</b> " + "CI_ResponsibleParty" + "</div>";
        $(htmlcontainer).append(x93);
//        var x94 = "<div style='margin: 10px;'><b>"+"periodicity" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x94);
        var x95 = "<div style='margin: 10px;'><b>"+"link" +":</b> " + "http://www.adcommission.gov.au/system/documents/Bio-D38260010-120315.pdf" + "</div>";
        $(htmlcontainer).append(x95);
        //To remove start
//        var x96 = "<div style='margin: 10px;'><b>"+"name" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x96);
//        var x97 = "<div style='margin: 10px;'><b>"+"organization" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x97);
//        var x98 = "<div style='margin: 10px;'><b>"+"position" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x98);
//        var x99 = "<div style='margin: 10px;'><b>"+"contactInfo" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x99);
//        var x100 = "<div style='margin: 10px;'><b>"+"role" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x100);
//        var x101 = "<div style='margin: 10px;'><b>"+"phone " +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x101);
//        var x102 = "<div style='margin: 10px;'><b>"+"address" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x102);
//        var x103 = "<div style='margin: 10px;'><b>"+"emailAddress" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x103);
//        var x104 = "<div style='margin: 10px;'><b>"+"hoursOfService" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x104);
//        var x105 = "<div style='margin: 10px;'><b>"+"contractIntruction" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x105);
        //To remove end
        var x106 = "<div style='margin: 10px;'><b>"+"name" +":</b> " + "The Commissioner" + "</div>";
        $(htmlcontainer).append(x106);
        var x107 = "<div style='margin: 10px;'><b>"+"organization" +":</b> " + "Anti-Dumping Commission, Australian Government" + "</div>";
        $(htmlcontainer).append(x107);
//        var x108 = "<div style='margin: 10px;'><b>"+"position" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x108);
        var x109 = "<div style='margin: 10px;'><b>"+"contactInfo" +":</b> " + "CI_Contact" + "</div>";
        $(htmlcontainer).append(x109);
        var x110 = "<div style='margin: 10px;'><b>"+"role" +":</b> " + "'001" + "</div>";
        $(htmlcontainer).append(x110);
        var x111 = "<div style='margin: 10px;'><b>"+"phone" +":</b> " + "+61 2 6275 6066 " + "</div>";
        $(htmlcontainer).append(x111);
        var x112 = "<div style='margin: 10px;'><b>"+"address" +":</b> " + "Melbourne, Ground Floor Customs House Docklands, 1010 La Trobe Street, Docklands VIC 3008" + "</div>";
        $(htmlcontainer).append(x112);
        var x113 = "<div style='margin: 10px;'><b>"+"emailAddress" +":</b> " + "clientsupport@adcommission.gov.au" + "</div>";
        $(htmlcontainer).append(x113);
//        var x114 = "<div style='margin: 10px;'><b>"+"hoursOfService" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x114);
//        var x115 = "<div style='margin: 10px;'><b>"+"contractIntruction" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x115);
//        var x116 = "<div style='margin: 10px;'><b>"+"documentKind" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x116);
//        var x117 = "<div style='margin: 10px;'><b>"+"title" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x117);
//        var x118 = "<div style='margin: 10px;'><b>"+"date" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x118);
//        var x119 = "<div style='margin: 10px;'><b>"+"citedResponsibleParty" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x119);
//        var x120 = "<div style='margin: 10px;'><b>"+"periodicity" +":</b> " + "" + "</div>";
//        $(htmlcontainer).append(x120);

        $(body).append(htmlcontainer);
        $(html).append(body);
        $(leftcolumn).append(html);

//        var x = "<div style='margin: 10px;'><b>"+"uid" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x1);
//        var x1 = "<div style='margin: 10px;'><b>"+"language" +":</b> " + "EN" + "</div>";
//        $(leftcolumn).append(x1);
//        var x2 = "<div style='margin: 10px;'><b>"+"title" +":</b> " + "Countervailing measures imposed by Australia on biodiesel exported from the USA" + "</div>";
//        $(leftcolumn).append(x2);
//        var x3 = "<div style='margin: 10px;'><b>"+"creationDate" +":</b> " + "18/03/2014" + "</div>";
//        $(leftcolumn).append(x3);
//        var x4 = "<div style='margin: 10px;'><b>"+"characterSet" +":</b> " + "UTF8" + "</div>";
//        $(leftcolumn).append(x4);
//        var x5 = "<div style='margin: 10px;'><b>"+"contact" +":</b> " + "CI_ResponsibleParty" + "</div>";
//        $(leftcolumn).append(x5);
//        var x6 = "<div style='margin: 10px;'><b>"+"name" +":</b> " + "Annelies Deuss" + "</div>";
//        $(leftcolumn).append(x6);
//        var x7 = "<div style='margin: 10px;'><b>"+"organization" +":</b> " + "OECD" + "</div>";
//        $(leftcolumn).append(x7);
//        var x8 = "<div style='margin: 10px;'><b>"+"position" +":</b> " + "Analyst TAD/ATM" + "</div>";
//        $(leftcolumn).append(x8);
//        var x9 = "<div style='margin: 10px;'><b>"+"contactInfo" +":</b> " + "CI_Contact" + "</div>";
//        $(leftcolumn).append(x9);
//        var x10 = "<div style='margin: 10px;'><b>"+"role" +":</b> " + "007, 008" + "</div>";
//        $(leftcolumn).append(x10);
//        var x11 = "<div style='margin: 10px;'><b>"+"phone" +":</b> " + "+(33-1) 45 24 96 52" + "</div>";
//        $(leftcolumn).append(x11);
//        var x12 = "<div style='margin: 10px;'><b>"+"address" +":</b> " + "2, rue André Pascal, 75775 Paris Cedex 16, France" + "</div>";
//        $(leftcolumn).append(x12);
//        var x13 = "<div style='margin: 10px;'><b>"+"emailAddress" +":</b> " + "Annelies.DEUSS@oecd.org" + "</div>";
//        $(leftcolumn).append(x13);
//        var x14 = "<div style='margin: 10px;'><b>"+"hoursOfService" +":</b> " + "9:00 to 18:00" + "</div>";
//        $(leftcolumn).append(x14);
//        var x15 = "<div style='margin: 10px;'><b>"+"contactInstruction" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x15);
//        var x16 = "<div style='margin: 10px;'><b>"+"keyWords" +":</b> " + "Countervailing duty, biodiesel, Australia, USA" + "</div>";
//        $(leftcolumn).append(x16);
//        var x17 = "<div style='margin: 10px;'><b>"+"description" +":</b> " + "Countervailing duty rates imposed by Australia on biodiesel exported from the USA are recorded for HS codes 38260010 and 38260020, version HS2012 of the internationally standardized product nomenclature, the Harmonized System (HS) used by WTO Members, and assigned to the Product_AMIS aggregate 'Biodiesel'. The duty rate might be indicated as a number or as a text if some additional explanation is required" + "</div>";
//        $(leftcolumn).append(x17);
//        var x18 = "<div style='margin: 10px;'><b>"+"summary" +":</b> " + "007, 008" + "</div>";
//        $(leftcolumn).append(x18);
//        var x19 = "<div style='margin: 10px;'><b>"+"classificationSystem" +":</b> " + "For countries: FAO-GAUL classification . For commodities: Harmonized System (HS) used by WTO Members, version HS2012. Product aggregation and policy domains, policy types and measures are classified according to an AMIS internal classification system (provided in the home page www. (area with standards)." + "</div>";
//        $(leftcolumn).append(x19);
//        var x20 = "<div style='margin: 10px;'><b>"+"statisticalPopulation" +":</b> " + "Policy measures targeted at wheat, maize, rice, soyabeans and biofuel transport liquids implemented on AMIS countries" + "</div>";
//        $(leftcolumn).append(x20);
//        var x21 = "<div style='margin: 10px;'><b>"+"referencePeriod" +":</b> " + "From 18-04-2011 to 18-04-2016" + "</div>";
//        $(leftcolumn).append(x21);
//        var x22 = "<div style='margin: 10px;'><b>"+"referenceArea" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x22);
//        var x23 = "<div style='margin: 10px;'><b>"+"coverageSector" +":</b> " + "Crops: wheat, maize, rice, soyabean and biofuels products: ethanol, biodiesel." + "</div>";
//        $(leftcolumn).append(x23);
//        var x24 = "<div style='margin: 10px;'><b>"+"sectorCoded" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x24);
//        var x25 = "<div style='margin: 10px;'><b>"+"coverageTime" +":</b> " + "Data for the period starting from 2011" + "</div>";
//        $(leftcolumn).append(x25);
//        var x26 = "<div style='margin: 10px;'><b>"+"coverageGeographic" +":</b> " + "Argentina, Australia, Brazil, Canada, China, European Union, France, Germany, India, Indonesia, Italy, Japan, Mexico, Republic of Korea, Russian Federation, Saudi Arabia, Turkey, U.K. of Great Britain and Northern Ireland and United States of America from the G20, and Egypt, Kazakhstan, Nigeria, Philippines, South Africa, Spain, Thailand, Ukraine and Viet Nam" + "</div>";
//        $(leftcolumn).append(x26);
//        var x27 = "<div style='margin: 10px;'><b>"+"statisticalUnit" +":</b> " + "Duty rates applied" + "</div>";
//        $(leftcolumn).append(x27);
//        var x28 = "<div style='margin: 10px;'><b>"+"unitOfMeasure" +":</b> " + "unkwnown" + "</div>";
//        $(leftcolumn).append(x28);
//        var x29 = "<div style='margin: 10px;'><b>"+"unitOfMeasureDetails" +":</b> " + "Measurement units are not provided because duty rates are confidential" + "</div>";
//        $(leftcolumn).append(x29);
//        var x30 = "<div style='margin: 10px;'><b>"+"institutionalMandateDataSharing" +":</b> " + "WTO?" + "</div>";
//        $(leftcolumn).append(x30);
//        var x31 = "<div style='margin: 10px;'><b>"+"legalActAgreements" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x31);
//        var x32 = "<div style='margin: 10px;'><b>"+"Punctuality" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x32);
//        var x33 = "<div style='margin: 10px;'><b>"+"costAndBurden" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x33);
//        var x34 = "<div style='margin: 10px;'><b>"+"efficiencyManagement" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x34);
//        var x35 = "<div style='margin: 10px;'><b>"+"costAndBurdenResources" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x35);
//        var x36 = "<div style='margin: 10px;'><b>"+"UserNeeds" +":</b> " + "The main users are AMIS analysts, other international organizations, ministries and government agencies, trade and professional associations, research institutes and universities, journalists and general public. The AMIS team is not aware of unmet needs." + "</div>";
//        $(leftcolumn).append(x36);
//        var x37 = "<div style='margin: 10px;'><b>"+"UserSatisfaction" +":</b> " + "No user satisfaction studies have been conducted which may explain why the AMIS is not aware of unmet user needs." + "</div>";
//        $(leftcolumn).append(x37);
//        var x38 = "<div style='margin: 10px;'><b>"+"comparabilityDomains" +":</b> " + "There is a limitation in the comparability across individual commodities/products because product data are sometimes recorded in different HS versions or in the case of domestic measures there are not standard international classifications based on which policy measures are issued." + "</div>";
//        $(leftcolumn).append(x38);
//        var x39 = "<div style='margin: 10px;'><b>"+"comparabilityTime" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x39);
//        var x40 = "<div style='margin: 10px;'><b>"+"comparabilityGeographical" +":</b> " + "There is limited geographical comparability due to differences between countries in methods, coverage or currencies, except for regions with homogenous countries, e.g. EU countries, which are bound by EU trade regulations. Furthermore for some countries information on the duty level remains confidential or duty rates are different for different producing companies." + "</div>";
//        $(leftcolumn).append(x40);
//        var x41 = "<div style='margin: 10px;'><b>"+"coherenceCrossDomain" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x41);
//        var x42 = "<div style='margin: 10px;'><b>"+"coherenceIntern" +":</b> " + "" + "</div>";
//        $(leftcolumn).append(x42);
//        var x43 = "<div style='margin: 10px;'><b>"+"statisticalConceptAndDefinitions" +":</b> " + "Applied duty rate" + "</div>";
//        $(leftcolumn).append(x43);
//        var x44 = "<div style='margin: 10px;'><b>"+"documentsOfMetodology" +":</b> " + "URUGUAY ROUND AGREEMENT, Agreement on Subsidies and Countervailing Measures. 'Members shall take all necessary steps to ensure that the imposition of a countervailing duty  on any product of the territory of any Member imported into the territory of another Member is in accordance with the provisions of Article VI of GATT 1994 and the terms of this Agreement.  Countervailing duties may only be imposed pursuant to investigations initiated and conducted in accordance with the provisions of this Agreement and the Agreement on Agriculture'. http://www.wto.org/english/docs_e/legal_e/24-scm.pdf" + "</div>";
//        $(leftcolumn).append(x44);
//        var x45 = "<div style='margin: 10px;'><b>"+"dataCollection" +":</b> " + "Data has been collected from on-line available country legislations. In the future it is planned to make avaible for country officials an on-line input form to allow for the continuosly update of the data" + "</div>";
//        $(leftcolumn).append(x45);
//        var x46 = "<div style='margin: 10px;'><b>"+"dataCompilation" +":</b> " + "Irregularly" + "</div>";
//        $(leftcolumn).append(x46);
//        var x47 = "<div style='margin: 10px;'><b>"+"dataSource" +":</b> " + "The main source are the country legislations and regulations issued by Ministries or government agencies" + "</div>";
//        $(leftcolumn).append(x47);


        $("#fullScreenContent").html(container.html());
    }

    function optionsVisibility(){

        var text = $('#hide_options').text();
        if(text==$.i18n.prop('_hidePreviewOptions'))
        {
            $('#' + CONFIG.placeholderID + 'option_container').hide();
            $('#hide_options').text($.i18n.prop('_showPreviewOptions'));
        }
        else
        {
            $('#' + CONFIG.placeholderID + 'option_container').show();
            $('#hide_options').text($.i18n.prop('_hidePreviewOptions'));
        }
    }

    function selectionsVisibility(){

        var text = $('#hide_selections').text();
        //if(text=='Hide Selections')
        if(text==$.i18n.prop('_hideSelections'))
        {
            for(var i=0; i<ap_queryAndDownload.CONFIG.list_box_ids.length; i++)
            {
                var listboxID= ap_queryAndDownload.CONFIG.list_box_ids[i];
                $('#memory_' + listboxID).hide();
            }
            $('#hide_selections').text($.i18n.prop('_showSelections'));
        }
        else
        {
            for(var i=0; i<ap_queryAndDownload.CONFIG.list_box_ids.length; i++)
            {
                var listboxID= ap_queryAndDownload.CONFIG.list_box_ids[i];
                $('#memory_' + listboxID).show();
            }
            $('#hide_selections').text($.i18n.prop('_hideSelections'));
        }
    }

    function visibilityCheck(action){

        var text = $('#hide_selections').text();
        if(action=='hide')
        {
            var i=0;
            for(i=0; i<ap_queryAndDownload.CONFIG.list_box_ids.length; i++)
            {
                var listboxID= ap_queryAndDownload.CONFIG.list_box_ids[i];
                if(((listboxID.toLowerCase().indexOf('years')>=0))&&(ap_queryAndDownload.CONFIG.active_year_tab == 'slider'))
                {
                    continue;
                }
                if($('#memory_' + listboxID).length>0)
                {
                    if($('#memory_' + listboxID).is(":visible"))
                    {
                        break;
                    }
                }
            }
            if(i==ap_queryAndDownload.CONFIG.list_box_ids.length)
            {
                $('#hide_selections').text($.i18n.prop('_showSelections'));
            }
        }
        else
        {
            var i=0;
            for(i=0; i<ap_queryAndDownload.CONFIG.list_box_ids.length; i++)
            {
                var listboxID= ap_queryAndDownload.CONFIG.list_box_ids[i];
                if(((listboxID.toLowerCase().indexOf('years')>=0))&&(ap_queryAndDownload.CONFIG.active_year_tab == 'slider'))
                {
                    continue;
                }
                if($('#memory_' + listboxID).length>0)
                {
                    if($('#memory_' + listboxID).is(":visible")==false)
                    {
                        break;
                    }
                }
            }
            if(i==ap_queryAndDownload.CONFIG.list_box_ids.length)
            {
                $('#hide_selections').text($.i18n.prop('_hideSelections'));
            }
        }
    }

    function buildUIHeader() {

        /* Initiate variables. */
        var s = "";

        /* Build content. */
        s += "<div class='row'>";
        s += "<div class='col-xs-12 col-sm-12 col-md-8 col-lg-8'>";

        s += "<div class='note-tabs'><ul class='nav nav-tabs'><li class='active'><a href='#pane1' data-toggle='tab' class='fx_header_title_small'>"+$.i18n.prop('_query_download_interactive_download')+"</a></li>";
        s += "<li><a href='#pane2' data-toggle='tab' class='fx_header_title_small'>"+$.i18n.prop('_query_download_bulk_download')+"</a></li> ";
        s += "</ul><div class='tab-content'><div id='pane1' class='tab-pane active'>";
        //Contains the Link for Hide And Show Options and Hide and Show Selections
        s += "<div class='container' id='" + CONFIG.placeholderID + "page_actions_container'></div>";
        //Contains Commodity Domain, Policy Domain
        s += "<div class='container' id='" + CONFIG.placeholderID + "selector_container_0'></div>";
        //Contains Commodity Class
        s += "<div class='container' id='" + CONFIG.placeholderID + "selector_container_1'></div>";
        //Contains Policy Types with their Policy Measures
        s += "<div class='container' id='" + CONFIG.placeholderID + "selector_container_2'></div>";
        //Contains Country and Year
        s += "<div class='container' id='" + CONFIG.placeholderID + "selector_container_3'></div>";
        s += "<div class='container' id='" + CONFIG.placeholderID + "option_container'></div>";
        s += "<div class='container' id='" + CONFIG.placeholderID + "previowdownload_container_buttons'></div>";
        s += "<div class='container' id='" + CONFIG.placeholderID + "output_container'></div></div>";
        s += "<div id='pane2' class='tab-pane'>";
        s += "<div class='container' id='" + CONFIG.placeholderID + "bulk_download_container'></div></div>";
        s += "</div><!-- /.tab-content --></div><!-- /.tabbable --></row>";

        /* Return UI. */
        return s;
    }

    function write(){
        alert('write Interactive Download');
    }

    function write2(){
        alert('write Bulk Download');
    }

    function exportPlainData(object, title) {
        /** Stream the Excel through the hidden form */
        $('#datasource_WQ').val(ap_queryAndDownload.CONFIG.datasource);
        $('#thousandSeparator_WQ').val(',');
        $('#decimalSeparator_WQ').val('.');
        $('#decimalNumbers_WQ').val('2');
        $('#json_WQ').val(JSON.stringify(object));
        $('#cssFilename_WQ').val('');
        $('#valueIndex_WQ').val(null);
        $('#quote_WQ').val('');
        $('#title_WQ').val(title);
        $('#subtitle_WQ').val('');
        console.log("Before submit 1 ");
//        {
//            try
//            {
//                document.excelFormWithQuotes.submit();
//            }
//            catch(err)
//            {
//                var txt="1111There was an error on this page.\n\n";
//                txt+="Error description: " + err.message + "\n\n";
//                txt+="Click OK to continue.\n\n";
//                alert(txt);
//            }
//        }
        document.excelFormWithQuotes.submit();

    }

    function exportShareGroupData(object, title) {
        /** Stream the Excel through the hidden form */
        $('#datasource_WQ2').val(ap_queryAndDownload.CONFIG.datasource);
        $('#thousandSeparator_WQ2').val(',');
        $('#decimalSeparator_WQ2').val('.');
        $('#decimalNumbers_WQ2').val('2');
        $('#json_WQ2').val(JSON.stringify(object));
        $('#cssFilename_WQ2').val('');
        $('#valueIndex_WQ2').val(null);
        $('#quote_WQ2').val('');
        $('#title_WQ2').val(title);
        $('#subtitle_WQ2').val('');
        console.log("Before submit 2");
        document.excelFormWithQuotes2.submit();
//        {
//            try
//            {
//                document.excelFormWithQuotes2.submit();
//            }
//            catch(err)
//            {
//                var txt="2222There was an error on this page.\n\n";
//                txt+="Error description: " + err.message + "\n\n";
//                txt+="Click OK to continue.\n\n";
//                alert(txt);
//            }
//        }
    }

    return {
        CONFIG              :   CONFIG,
        init                :   init,
//        buildUI             :   buildUI,
        showSlider          :   showSlider,
        hideSlider          :   hideSlider,
        buildBulkDownloadTab        :   buildBulkDownloadTab,
        populateBulkDownloadsTab    :   populateBulkDownloadsTab,
        checkItemEvent      :   checkItemEvent,
        clearAll            :   clearAll,
        selectAll           :   selectAll,
        populateStandardTab :   populateStandardTab,
        populateStandardTab_year    :   populateStandardTab_year,
        clickTab            : clickTab,
        clickYearTab            : clickYearTab,
        removeItem          :   removeItem,
       // preview             :   preview,
        download            :   download,
        previewTable        :   previewTable,
        exportTable         :   exportTable,
        optionsVisibility            :   optionsVisibility,
        selectionsVisibility         :   selectionsVisibility,
        visibilityCheck     :   visibilityCheck,
        buildPreviewAndDownloadButton   :   buildPreviewAndDownloadButton,
        preview_button  :   preview_button,
        download_button :   download_button,
        commodity_from_policy_domain_changes    :   commodity_from_policy_domain_changes,
        build_splitter  :   build_splitter,
        build_shareGroupGrid    :   build_shareGroupGrid,
        build_policyTableGrid   :   build_policyTableGrid,
        populateStandardTab_codelist    :   populateStandardTab_codelist,
        buildStandardTabFromDb  :   buildStandardTabFromDb,
        buildStandardTabFromDbPolicyType  :   buildStandardTabFromDbPolicyType,
        rebuild_selectionPanelPolicyTypes  :   rebuild_selectionPanelPolicyTypes,
        rebuild_selectionPanelCommodityClass   :   rebuild_selectionPanelCommodityClass,
        data_compare            :   data_compare,
        exportPlainData         :   exportPlainData,
        exportShareGroupData    :   exportShareGroupData,
        buildShareGroupPolicyTables : buildShareGroupPolicyTables,
        closeFullscreen : closeFullscreen,
        fullScreenContent : fullScreenContent
    };

    })();

window.addEventListener('load', ap_queryAndDownload.init, false);

