define([
    'jquery',
    'model_catalog/qd_policy_model'

], function($, QDPolicyModel) {

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
            default: model_func = null;
        }

        return model_func;
    };

    return QDCatalogModel;
});
