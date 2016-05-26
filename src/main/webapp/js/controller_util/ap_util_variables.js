//var ap_utilVariables = (function() {
define([
], function(){

    var CONFIG ={
        //base_ip_address    :  '168.202.36.186',
        //base_ip_port    :  '10400',
       base_ip_address    :  'statistics.amis-outlook.org',
       base_ip_port    :  '80',
        datasource      :   'POLICY',
//        biofuel_pt_url   :   '/wds/rest/policyservice/policyTypesFromDomain',
//        biofuelTimeSeries_url   :   '/wds/rest/policyservice/biofuelPoliciesTimeSeries',
//        biofuelPoliciesMeasuresTimeSeries_url   :   '/wds/rest/policyservice/biofuelPoliciesMeasuresTimeSeries',
//        exportRestrictionsPoliciesMeasuresTimeSeries_url    :   '/wds/rest/policyservice/exportRestrictionsPoliciesMeasuresTimeSeries',
//        biofuelPoliciesBarChart_url :   '/wds/rest/policyservice/biofuelPoliciesBarChart',
//        biofuelPolicyMeasuresBarChart : '/wds/rest/policyservice/biofuelPolicyMeasuresBarChart',
//        exportRestrictionsPolicyMeasuresBarChart_url : '/wds/rest/policyservice/exportRestrictionsPolicyMeasuresBarChart',
//        exportSubsidiesCountries_url :'/wds/rest/policyservice/exportSubsidiesCountries',
//        exportSubsidiesPolicyElementLineChart_url : '/wds/rest/policyservice/exportSubsidiesPolicyElementLineChart',
//        importTariffsPolicyMeasuresBarChart : '/wds/rest/policyservice/importTariffsPolicyMeasuresBarChart',
//        startAndEndDate_url   :   '/wds/rest/policyservice/startEndDate',

        biofuel_pt_url   :   '/wdspolicy/rest/policyservice/policyTypesFromDomain',
        biofuelTimeSeries_url   :   '/wdspolicy/rest/policyservice/biofuelPoliciesTimeSeries',
        biofuelPoliciesMeasuresTimeSeries_url   :   '/wdspolicy/rest/policyservice/biofuelPoliciesMeasuresTimeSeries',
        exportRestrictionsPoliciesMeasuresTimeSeries_url    :   '/wdspolicy/rest/policyservice/exportRestrictionsPoliciesMeasuresTimeSeries',
        biofuelPoliciesBarChart_url :   '/wdspolicy/rest/policyservice/biofuelPoliciesBarChart',
        biofuelPolicyMeasuresBarChart : '/wdspolicy/rest/policyservice/biofuelPolicyMeasuresBarChart',
        exportRestrictionsPolicyMeasuresBarChart_url : '/wdspolicy/rest/policyservice/exportRestrictionsPolicyMeasuresBarChart',
        exportSubsidiesCountries_url :'/wdspolicy/rest/policyservice/exportSubsidiesCountries',
        exportSubsidiesPolicyElementLineChart_url : '/wdspolicy/rest/policyservice/exportSubsidiesPolicyElementLineChart',
        importTariffsPolicyMeasuresBarChart : '/wdspolicy/rest/policyservice/importTariffsPolicyMeasuresBarChart',
        startAndEndDate_url   :   '/wdspolicy/rest/policyservice/startEndDate',
        createNewSingleCommodity    : '/wdspolicy/rest/policyservice/createNewSingleCommodity',
        createNewSharedGroup    : '/wdspolicy/rest/policyservice/createNewSharedGroup',
        subnationalMaxCodeNotGaul : '/wdspolicy/rest/policyservice/subnationalMaxCodeNotGaul',
        conditionMaxCode : '/wdspolicy/rest/policyservice/conditionMaxCode',

        biofuel_commodity_domain_code   :  2,
        //The order in biofuel_commodity_class_codes is important
        biofuel_commodity_class_codes   :  "5,6,7",
//        biofuel_commodity_class_codes_all   :  "5-6-7-5,6,7",
//        biofuel_commodity_class_names_all   :  "Ethanol-Biodiesel-Biofuel (unspecified)-All",
//        biofuel_commodity_class_names_all_time_series   :  "ethanol-biodiesel-unspecified biofuel-biofuel",
        biofuel_commodity_class_codes_all   :  "5,6,7-5-6-7",
        biofuel_commodity_class_names_all   :  "All-Ethanol-Biodiesel-Biofuel (unspecified)",
        biofuel_commodity_class_names_all_time_series   :  "biofuel-ethanol-biodiesel-unspecified biofuel",

        export_commodity_class_codes    :   "1,3,2,4",
//        export_commodity_class_codes_all   :  "1-3-2-4-1,3,2,4",
//        export_commodity_class_names_all   :  "Wheat-Maize-Rice-Soybeans-All",
//        export_commodity_class_names_all_times_series:  "wheat-maize-rice-soybeans-all AMIS commodities",
        export_commodity_class_codes_all   :  "1,3,2,4-1-3-2-4",
        export_commodity_class_names_all   :  "All-Wheat-Maize-Rice-Soybeans",
        export_commodity_class_names_all_times_series:  "all AMIS commodities-wheat-maize-rice-soybeans",

        import_tariffs_commodity_class_codes    :   "1,3,2,4",
        import_tariffs_commodity_class_names    :   "Wheat-Maize-Rice-Soybeans",
        import_tariffs_policy_type_code : '2',
        import_tariffs_policy_measure_code : '11',
        //import_tariffs_year_list : '2010,2011,2012,2013',
        import_tariffs_year_list : '2012,2013,2014,2015',
        import_tariffs_hsCode_list : "'1001','1005','1006','1201'",
        import_tariffs_unit : '%',
        import_tariffs_policy_element : ['Final bound tariff','MFN applied tariff'],

        export_measures_codes :  ['1','2','4','5','8'],
        export_measure_obj_array : [],

        export_subsidies_policy_element : ['BudgetaryOutlay_Commitment', 'BudgetaryOutlay_Notified', 'Quantity_Commitment', 'Quantity_Notified'],
        export_subsidies_policy_element_code : ['1', '2', '11', '12'],
        export_subsidies_policy_element_for_legend : ['Budgetary commitments', 'Budgetary notifications', 'Quantity commitments', 'Quantity notifications'],
        export_subsidies_units : ['USD', 'USD', 'Tonnes', 'Tonnes'],
        export_subsidies_units_y : [0, 0, 1, 1],

        tax_concession_policyType_code : 9,
        domestic_policyDomain_code : 2,
        export_measure_policyType_code : 1,
        export_subsidies_policyMeasure_code : 3,
        export_restrictions_policyType_code : "Export Measures",

        //To D3S
        codelist_url    :   'http://faostat3.fao.org/d3sp/service/msd/cl/system',
//        codelist_url    :   'http://faostat3.fao.org:7788/msd/cl/system',
        //codelist_url    :   'http://hqlprfenixapp2.hq.un.fao.org:7788/msd/cl/system',
        codelist_url_CommodityAgricultural  :  'OECD_CommodityClass1',
        codelist_url_CommodityBiofuels  :  'OECD_CommodityClass2',
        codelist_url_CommodityBoth  :   'OECD_CommodityClass',
        codelist_url_Country  : 'OECD_Country',
        codelist_url_PolicyType :   'OECD_PolicyType',

        start_date_dd_int_for_chart : 1,
        start_date_mm_int_for_chart : 0,
        start_date_yy_int_for_chart : 2005,
        start_date_yy_int_for_chart_biofuelPolicy : 2011,
        start_date_yy_int_for_chart_exportRestriction : 2007,
        start_date_yy_int_for_chart_timeSeries : 1983,
        start_date_yy_int_for_chart_timeSeries_biofuelPolicy : 2011,
        start_date_yy_int_for_chart_timeSeries_exportRestriction : 2007,
        importTariffs : 11,
        tariffQuotas : 12,
        commodityClassParent : [{3: 'Maize'}, {2: 'Rice'}, {4: 'Soybeans'}, {1: 'Wheat'}],
        //commodityClassChildren :{ 3: [{code: 9, label: 'Maize + Rice'},{code: 10, label: 'Maize + Soybeans'},{code: 8, label: 'Wheat + Maize'},{code: 11, label: 'Wheat + Maize + Rice'}],
        //    2 : [{code: 9, label: 'Maize + Rice'},{code: 11, label: 'Wheat + Maize + Rice'},{code: 12, label: 'Wheat + Rice'}],
        //    4 : [{code: 10, label: 'Maize + Soybeans'}],
        //    1 : [{code: 8, label: 'Wheat + Maize'}, {code: 11, label: 'Wheat + Maize + Rice'}, {code: 12, label: 'Wheat + Rice'}]
        //},
        commodityClassChildren :{ 3: [{code: 8, label: 'Maize + Wheat'},{code: 9, label: 'Maize + Rice'},{code: 13, label: 'Maize + Rice + Soybeans'},{code: 10, label: 'Maize + Soybeans'},{code: 18, label: 'Maize + Rice + Soybeans + Wheat'},{code: 11, label: 'Maize + Rice + Wheat'},{code: 14, label: 'Maize + Soybeans + Wheat'}],
            2 : [{code: 9, label: 'Maize + Rice'},{code: 13, label: 'Maize + Rice + Soybeans'},{code: 18, label: 'Maize + Rice + Soybeans + Wheat'},{code: 11, label: 'Maize + Rice + Wheat'},{code: 15, label: 'Rice + Soybeans'},{code: 16, label: 'Rice + Soybeans + Wheat'},{code: 12, label: 'Rice + Wheat'}],
            4 : [{code: 13, label: 'Maize + Rice + Soybeans'},{code: 10, label: 'Maize + Soybeans'},{code: 18, label: 'Maize + Rice + Soybeans + Wheat'},{code: 14, label: 'Maize + Soybeans + Wheat'},{code: 15, label: 'Rice + Soybeans'},{code: 16, label: 'Rice + Soybeans + Wheat'},{code: 17, label: 'Soybeans + Wheat'}],
            1 : [{code: 8, label: 'Maize + Wheat'},{code: 18, label: 'Maize + Rice + Soybeans + Wheat'},{code: 11, label: 'Maize + Rice + Wheat'},{code: 14, label: 'Maize + Soybeans + Wheat'},{code: 16, label: 'Rice + Soybeans + Wheat'},{code: 12, label: 'Rice + Wheat'},{code: 17, label: 'Soybeans + Wheat'}]
        },
        commodityClassInArray : {6:['Biodiesel'], 7:['Biofuel (unspecified)'], 5:['Ethanol'], 3:['Maize'], 8:[['Maize'],['Wheat']], 9:[['Maize'],['Rice']], 13:[['Maize'],['Rice'],['Soybeans']],
            10:[['Maize'],['Soybeans']],18:[['Maize'],['Rice'],['Soybeans'],['Wheat']],11:[['Maize'],['Rice'],['Wheat']],14:[['Maize'],['Soybeans'],['Wheat']],2:['Rice'],15:[['Rice'],['Soybeans']],
            16:[['Rice'],['Soybeans'],['Wheat']],12:[['Rice'],['Wheat']],4:[['Soybeans']],17:[['Soybeans'],['Wheat']],1:[['Wheat']]},

        commodityClassInArray_originalName : {6:'Biodiesel', 7:'Biofuel (unspecified)', 5:'Ethanol', 3:'Maize', 8:'Maize + Wheat', 9:'Maize + Rice', 13:'Maize + Rice + Soybeans',
            10:'Maize + Soybeans', 18:'Maize + Rice + Soybeans + Wheat',11:'Maize + Rice + Wheat',14:'Maize + Soybeans + Wheat',2:'Rice',15:'Rice + Soybeans',
            16:'Rice + Soybeans + Wheat',12:'Rice + Wheat',4:'Soybeans',17:'Soybeans + Wheat',1:'Wheat'},

        //6;Biodiesel
        //7;Biofuel (unspecified)
        //5;Ethanol
        //3;Maize
        //8;Maize + Wheat
        //9;Maize + Rice
        //13;Maize + Rice + Soybeans
        //10;Maize + Soybeans
        //18;Maize + Rice + Soybeans + Wheat
        //11;Maize + Rice + Wheat
        //14;Maize + Soybeans + Wheat
        //2;Rice
        //15;Rice + Soybeans
        //16;Rice + Soybeans + Wheat
        //12;Rice + Wheat
        //4;Soybeans
        //17;Soybeans + Wheat
        //1;Wheat

        //WTO CODES
        //They are used to eliminate WTO data from the application
        //11;Import tariffs  12;Tariff quotas
        WTOImportCodes : ['11','12','3'],
        commodity_domain_bothForPolicyMeasure : '0',
        commodity_domain_agriculturalForPolicyMeasure : '1',
        commodity_domain_biofuelsForPolicyMeasure : '2',
        policy_domain_bothForPolicyMeasure : '0',

        export_quota_code : '2',
        export_subsidies_code : '3',
        tariff_quotas_code : '12'
    };

    function init(){
    };

    return {  CONFIG :CONFIG,
        init : init,
        lang : function(){ return lang; } }
});

//window.addEventListener('load', ap_utilVariables.init, false);