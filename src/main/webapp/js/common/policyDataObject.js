var ap_policyDataObject = (function() {

    function voObjectConstruction()
    {
        var data={};
        data.datasource = "";
        data.policy_domain_code = "";
        data.commodity_domain_code = "";
        data.commodity_class_code = "";
        data.policy_type_code = [];
        data.policy_measure_code = [];
        data.country_code = "";
        //it could be 'slider' or 'classic'
        data.yearTab ="";
        data.year_list = "";
        data.start_date = "";
        data.end_date = "";
        //The format is this: 'code1', 'code2', 'code3'
        data.cpl_id = "";
        data.commodity_id = "";
        data.policy_element = [];
        data.unit="";
        data.chart_type= false;


//        data.showNull = true;
//        data.showZeroes = true;
//        data.showOfficialflags = false;
//        data.thousandSeparator = "";
//        data.decimalseparator = ".";
//        data.showDec = "2";
//        data.datasetCodes = {};
//        data.applyOnlyYearFilter = false;
//        data.applyAllFiltersExceptYears = false;
//        data.applyAllFiltersExceptAggregrationType = false;
//        data.notApplyFilters = false;
//        data.applyAllFiltersExceptAreas = false;
//        data.showColumnHeaders = true;
//        data.tableHeaders = [];
//        data.tableSubHeaders = [];
//        data.tableContents = [];
        return data;
    }

return {  init : voObjectConstruction
    }

})();
