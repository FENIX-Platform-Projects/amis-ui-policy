define([
], function( ){

//var ap_masterTableObject = (function() {

    var CONFIG = {
//        //integer
//        cpl_id  : 1,
//        //character varying(510)
//        cpl_code  : AR99_AgTr_ExLice_108_105_999,
//        //integer
//        commodity_id    :   1,
//        //integer
//        country_code    :   1,
//        //character varying(510)
//        country_name    :   '',
//        //integer
//        subnational_code    :   '',
//        //character varying(510)
//        subnational_name    :   '',
//        //integer
//        commoditydomain_code    :   '',
//        //character varying(510)
//        commoditydomain_name    :   '',
//        //integer
//        commodityclass_code    :   '',
//        //character varying(510)
//        commodityclass_name    :   '',
//        //integer
//        policydomain_code    :   '',
//        //character varying(510)
//        policydomain_name    :   '',
//        //integer
//        policytype_code    :   '',
//        //character varying(510)
//        policytype_name    :   '',
//        //integer
//        policymeasure_code    :   '',
//        //character varying(510)
//        policymeasure_name    :   '',
//        //character varying(510)
//        condition    :   '',
//        //boolean
//        condition_exists    :   false


        //integer
        cpl_id  : [],
        //character varying(255)
        //cpl_code  : [],
        //integer
        commodity_id    :   [],
        //integer
        country_code    :   [],
        //character varying(510)
        country_name    :   [],
        //integer
        subnational_code    :   [],
        //character varying(510)
        subnational_name    :   [],
        //integer
        commoditydomain_code    :   [],
        //character varying(510)
        commoditydomain_name    :   [],
        //integer
        commodityclass_code    :   [],
        //character varying(510)
        commodityclass_name    :   [],
        //integer
        policydomain_code    :   [],
        //character varying(510)
        policydomain_name    :   [],
        //integer
        policytype_code    :   [],
        //character varying(510)
        policytype_name    :   [],
        //integer
        policymeasure_code    :   [],
        //character varying(510)
        policymeasure_name    :   [],
        //integer
        condition_code    :   [],
        //character varying(510)
        condition    :   [],
        //integer
        individualpolicy_code    :   [],
        //character varying(510)
        individualpolicy_name    :   []

}

    //function init(cpl_id, cpl_code, commodity_id, country_code, country_name, subnational_code, subnational_name, commoditydomain_code, commoditydomain_name,
    //              commodityclass_code, commodityclass_name, policydomain_code, policydomain_name, policytype_code, policytype_name, policymeasure_code, policymeasure_name,
    //              condition_code, condition, individualpolicy_code, individualpolicy_name)
    function init(cpl_id, commodity_id, country_code, country_name, subnational_code, subnational_name, commoditydomain_code, commoditydomain_name,
                  commodityclass_code, commodityclass_name, policydomain_code, policydomain_name, policytype_code, policytype_name, policymeasure_code, policymeasure_name,
                  condition_code, condition, individualpolicy_code, individualpolicy_name)
    {
//        ap_masterTableObject.CONFIG.cpl_id = cpl_id;
//        ap_masterTableObject.CONFIG.cpl_code = cpl_code;
//        ap_masterTableObject.CONFIG.commodity_id = commodity_id;
//        ap_masterTableObject.CONFIG.country_code = country_code;
//        ap_masterTableObject.CONFIG.country_name = country_name;
//        ap_masterTableObject.CONFIG.subnational_code = subnational_code;
//        ap_masterTableObject.CONFIG.subnational_name = subnational_name;
//        ap_masterTableObject.CONFIG.commoditydomain_code = commoditydomain_code;
//        ap_masterTableObject.CONFIG.commoditydomain_name = commoditydomain_name;
//        ap_masterTableObject.CONFIG.commodityclass_code = commodityclass_code;
//        ap_masterTableObject.CONFIG.commodityclass_name = commodityclass_name;
//        ap_masterTableObject.CONFIG.policydomain_code = policydomain_code;
//        ap_masterTableObject.CONFIG.policydomain_name = policydomain_name;
//        ap_masterTableObject.CONFIG.policytype_code = policytype_code;
//        ap_masterTableObject.CONFIG.policytype_name = policytype_name;
//        ap_masterTableObject.CONFIG.policymeasure_code = policymeasure_code;
//        ap_masterTableObject.CONFIG.policymeasure_name = policymeasure_name;
//        ap_masterTableObject.CONFIG.condition_code = condition_code;
//        ap_masterTableObject.CONFIG.condition = condition;
//        ap_masterTableObject.CONFIG.individualpolicy_code = individualpolicy_code;
//        ap_masterTableObject.CONFIG.individualpolicy_name = individualpolicy_name;

        this.CONFIG.cpl_id = cpl_id;
        //this.CONFIG.cpl_code = cpl_code;
        this.CONFIG.commodity_id = commodity_id;
        this.CONFIG.country_code = country_code;
        this.CONFIG.country_name = country_name;
        this.CONFIG.subnational_code = subnational_code;
        this.CONFIG.subnational_name = subnational_name;
        this.CONFIG.commoditydomain_code = commoditydomain_code;
        this.CONFIG.commoditydomain_name = commoditydomain_name;
        this.CONFIG.commodityclass_code = commodityclass_code;
        this.CONFIG.commodityclass_name = commodityclass_name;
        this.CONFIG.policydomain_code = policydomain_code;
        this.CONFIG.policydomain_name = policydomain_name;
        this.CONFIG.policytype_code = policytype_code;
        this.CONFIG.policytype_name = policytype_name;
        this.CONFIG.policymeasure_code = policymeasure_code;
        this.CONFIG.policymeasure_name = policymeasure_name;
        this.CONFIG.condition_code = condition_code;
        this.CONFIG.condition = condition;
        this.CONFIG.individualpolicy_code = individualpolicy_code;
        this.CONFIG.individualpolicy_name = individualpolicy_name;
    }

return {  CONFIG : CONFIG,
            init    :  init
    }
});
