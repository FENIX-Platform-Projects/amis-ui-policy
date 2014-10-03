define([
    'jquery'
], function($){

    var optionsDefault = {
        //Instance of the generic component controller to update the model associated to the selector
        controller: '',
        id  :    '',
        adapter :   '',
        type    :  '',
        title   :   '',
        domain  :   [],
        default_selected_items  : '',
        "buttons":[],
        "checkboxes":[]
    }

    function QDSelector( o ){

        if (this.options === undefined) {this.options = {}; }

        $.extend(true, this.options, optionsDefault, o);
        return this;
    }

    QDSelector.prototype.getId = function(){

        return this.options.id;
    };

    QDSelector.prototype.setId = function(id){

        this.options.id = id;
    };

    QDSelector.prototype.getType = function(){

        return this.options.type;
    };

    QDSelector.prototype.setType = function(type){

        this.options.type = type;Id
    };

    QDSelector.prototype.getTitle = function(){

        return this.options.title;
    };

    QDSelector.prototype.setTitle = function(title){

        this.options.title = title;
    };

    QDSelector.prototype.getAdapter = function(){

        return this.options.adapter;
    };

    QDSelector.prototype.setAdapter = function(adapter){

        this.options.adapter = adapter;
    };

    QDSelector.prototype.getDomain = function(){

        return this.options.domain;
    };

    QDSelector.prototype.setDomain = function(domain){

        this.options.domain = domain;
    };

    QDSelector.prototype.getDefault_selected_items = function(){

        return this.options.row;
    };

    QDSelector.prototype.setDefault_selected_items = function(default_selected_items){

        this.options.default_selected_items = default_selected_items;
    };

    QDSelector.prototype.getButtons = function(){

        return this.options.buttons;
    };

    QDSelector.prototype.setButtons = function(buttons){

        this.options.buttons = buttons;
    };

    QDSelector.prototype.getCheckbox = function(){

        return this.options.checkbox;
    };

    QDSelector.prototype.setCheckbox = function(checkbox){

        this.options.checkbox = checkbox;
    };

    QDSelector.prototype.setControllerInstance = function(controller){

        this.options.controller = controller;
    };

    return QDSelector;

});

