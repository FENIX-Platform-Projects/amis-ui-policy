define([
    'jquery'
], function($){

    var optionsDefault = {
    }

    function QDUtils( o ){

        if (this.options === undefined) {this.options = {}; }

        $.extend(true, this.options, optionsDefault, o);
        return this;

    };

    Function.prototype.inherits = function(superclass) {
        var temp = function() {};
        temp.prototype = superclass.prototype;
        this.prototype = new temp();
    }

    return QDUtils;

});

