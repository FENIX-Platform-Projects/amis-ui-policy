define([
    'jquery',
    'model_catalog/qd_policy_model',
    'model_catalog/qd_policy_data_entry_edit_policy_model',
    'model_catalog/qd_policy_data_entry_create_policy_model'

], function($, QDPolicyModel, QDPolicyDataEntryEditPolicyModel, QDPolicyDataEntryCreatePolicyModel) {

    var optionsDefault = {
        selectors : [],
        type : ''
    };

    function QDCatalogModel( o ) {

        if (this.options === undefined) {
            this.options = {};
        }

        $.extend(true, this.options, optionsDefault, o);
    }

    //This method is used to return the specific model constructor
    QDCatalogModel.prototype.model_look_up = function( model_type ){
        var model_func ='';
        switch(model_type){
            case 'grid_policy':
                model_func = QDPolicyModel;
                break;
            case 'grid_data_entry_edit_policy':
                model_func = QDPolicyDataEntryEditPolicyModel;
                break;
            case 'grid_data_entry_create_policy':
                model_func = QDPolicyDataEntryCreatePolicyModel;
                break;
            default: model_func = null;
        }

        return model_func;
    };

    return QDCatalogModel;
});
