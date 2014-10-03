define([
    'jquery'
], function($){

    var optionsDefault = {
        //Instance of the generic component controller to update the model associated to the selector
        type    :  ''

    }

    function QDModel( o ){

        if (this.options === undefined) {this.options = {}; }

        $.extend(true, this.options, optionsDefault, o);
        return this;

    }

    return QDModel;

});

