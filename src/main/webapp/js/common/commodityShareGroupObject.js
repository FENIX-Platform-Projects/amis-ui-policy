define([
], function( ){

//var ap_commodityShareGroupObject = (function() {

    var CONFIG = {

        //character varying(510)
        hs_code : [],
        //character varying(510)
        hs_suffix : [],
        //character varying(510)
        hs_version : [],
        //character varying(510)
        short_description : []
}

    function init(hs_code, hs_suffix, hs_version, short_description)
    {
//        ap_commodityShareGroupObject.CONFIG.hs_code = hs_code;
//        ap_commodityShareGroupObject.CONFIG.hs_suffix = hs_suffix;
//        ap_commodityShareGroupObject.CONFIG.hs_version = hs_version;
//        ap_commodityShareGroupObject.CONFIG.short_description = short_description;
        this.CONFIG.hs_code = hs_code;
        this.CONFIG.hs_suffix = hs_suffix;
        this.CONFIG.hs_version = hs_version;
        this.CONFIG.short_description = short_description;
    }

return {  CONFIG : CONFIG,
            init    :  init
    }
});
