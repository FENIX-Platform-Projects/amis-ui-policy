var ap_policyTableObject = (function() {

    var CONFIG = {

        //integer
        metadata_id : [],
        //integer
        policy_id  : [],
        //integer
        cpl_id    :   [],
        //integer
        commodity_id    :   [],
        //character varying(510)
        hs_version  :   [],
        //character varying(510)
        hs_code  :   [],
        //character varying(510)
        hs_suffix  :   [],
        //character varying(510)
        policy_element  :   [],
        //data -> string
        start_date  :   [],
        //data -> string
        end_date  :   [],

        //character varying(510)
        units  :   [],
        //character varying(510)
        value  :   [],
        //character varying(510)
        value_text  :   [],
        //character varying(510)
        value_type  :   [],
        //character varying(510)
        exemptions  :   [],
        //character varying(510)
        location_condition  :   [],
        //character varying(510)
        notes  :   [],
        //character varying(510)
        link  :   [],
        //character varying(510)
        source  :   [],
        //character varying(510)
        title_of_notice  :   [],

        //character varying(510)
        legal_basis_name  :   [],
        //data -> string
        date_of_publication  :   [],
        //character varying(510)
        imposed_end_date  :   [],
        //character varying(510)
        second_generation_specific  :   [],
        //character varying(510)
        benchmark_tax  :   [],
        //character varying(510)
        benchmark_product  :   [],
        //character varying(510)
        tax_rate_biofuel  :   [],
        //character varying(510)
        tax_rate_benchmark  :   [],
        //character varying(510)
        start_date_tax  :   [],
        //character varying(510)
        benchmark_link  :   [],

        //character varying(510)
        original_dataset  :   [],
        //double precision
        type_of_change_code  :   [],
        //character varying(510)
        type_of_change_name  :   [],
        //character varying(510)
        measure_descr  :   [],
        //character varying(510)
        product_original_hs  :   [],
        //character varying(510)
        product_original_name  :   [],
        //character varying(510)
        implementationprocedure  :   [],
        //character varying(510)
        xs_yeartype  :   [],
        //character varying(510)
        link_pdf  :   [],
        //character varying(510)
        benchmark_link_pdf : [],

        //character varying(510)
        short_description  :   [],
        //character varying(510)
        shared_group_code  :   []

}

//    metadata_id, policy_id, cpl_id, commodity_id, hs_version, hs_code, hs_suffix, policy_element, start_date, end_date, units, value, value_text,
//    value_type, exemptions, location_condition, notes, link, source, title_of_notice, legal_basis_name, date_of_publication, imposed_end_date,
//    second_generation_specific, benchmark_tax, benchmark_product, tax_rate_biofuel, tax_rate_benchmark, start_date_tax, benchmark_link,
//    original_dataset, type_of_change_code, type_of_change_name, measure_descr, product_original_hs, product_original_name,
//    implementationprocedure, xs_yeartype, link_pdf, benchmark_link_pdf, short_description, shared_group_code

    //Second table
    function init(metadata_id, policy_id, cpl_id, commodity_id, hs_version, hs_code, hs_suffix, policy_element, start_date, end_date, units, value, value_text,
                  value_type, exemptions, location_condition, notes, link, source, title_of_notice, legal_basis_name, date_of_publication, imposed_end_date,
                  second_generation_specific, benchmark_tax, benchmark_product, tax_rate_biofuel, tax_rate_benchmark, start_date_tax, benchmark_link,
                  original_dataset, type_of_change_code, type_of_change_name, measure_descr, product_original_hs, product_original_name,
                  implementationprocedure, xs_yeartype, link_pdf, benchmark_link_pdf, short_description, shared_group_code)
    {
        ap_policyTableObject.CONFIG.metadata_id = metadata_id;
        ap_policyTableObject.CONFIG.policy_id = policy_id;
        ap_policyTableObject.CONFIG.cpl_id = cpl_id;
        ap_policyTableObject.CONFIG.commodity_id = commodity_id;
        ap_policyTableObject.CONFIG.hs_version = hs_version;
        ap_policyTableObject.CONFIG.hs_code = hs_code;
        ap_policyTableObject.CONFIG.hs_suffix = hs_suffix;
        ap_policyTableObject.CONFIG.policy_element = policy_element;
        ap_policyTableObject.CONFIG.start_date = start_date;
        ap_policyTableObject.CONFIG.end_date = end_date;

        ap_policyTableObject.CONFIG.units = units;
        ap_policyTableObject.CONFIG.value = value;
        ap_policyTableObject.CONFIG.value_text = value_text;
        ap_policyTableObject.CONFIG.value_type = value_type;
        ap_policyTableObject.CONFIG.exemptions = exemptions;
        ap_policyTableObject.CONFIG.location_condition = location_condition;
        ap_policyTableObject.CONFIG.notes = notes;
        ap_policyTableObject.CONFIG.link = link;
        ap_policyTableObject.CONFIG.source = source;
        ap_policyTableObject.CONFIG.title_of_notice = title_of_notice;

        ap_policyTableObject.CONFIG.legal_basis_name = legal_basis_name;
        ap_policyTableObject.CONFIG.date_of_publication = date_of_publication;
        ap_policyTableObject.CONFIG.imposed_end_date = imposed_end_date;
        ap_policyTableObject.CONFIG.second_generation_specific = second_generation_specific;
        ap_policyTableObject.CONFIG.benchmark_tax = benchmark_tax;
        ap_policyTableObject.CONFIG.benchmark_product = benchmark_product;
        ap_policyTableObject.CONFIG.tax_rate_biofuel = tax_rate_biofuel;
        ap_policyTableObject.CONFIG.tax_rate_benchmark = tax_rate_benchmark;
        ap_policyTableObject.CONFIG.start_date_tax = start_date_tax;
        ap_policyTableObject.CONFIG.benchmark_link = benchmark_link;

        ap_policyTableObject.CONFIG.original_dataset = original_dataset;
        ap_policyTableObject.CONFIG.type_of_change_code = type_of_change_code;
        ap_policyTableObject.CONFIG.type_of_change_name = type_of_change_name;
        ap_policyTableObject.CONFIG.measure_descr = measure_descr;
        ap_policyTableObject.CONFIG.product_original_hs = product_original_hs;
        ap_policyTableObject.CONFIG.product_original_name = product_original_name;
        ap_policyTableObject.CONFIG.implementationprocedure = implementationprocedure;
        ap_policyTableObject.CONFIG.xs_yeartype = xs_yeartype;
        ap_policyTableObject.CONFIG.link_pdf = link_pdf;
        ap_policyTableObject.CONFIG.benchmark_link_pdf = benchmark_link_pdf;

        ap_policyTableObject.CONFIG.short_description = short_description;
        ap_policyTableObject.CONFIG.shared_group_code = shared_group_code;
    }


return {  CONFIG : CONFIG,
            init    :  init
    }

})();
