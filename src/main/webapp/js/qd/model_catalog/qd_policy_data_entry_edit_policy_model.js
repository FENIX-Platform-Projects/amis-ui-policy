define([
    'jquery',
    'qd_model',
    'qd_utils',
    'jqwidget'
], function($,QDModel, QDUtils){

    var optionsDefault = {

        //Selector id
        fx_selector_1 : 'fx_selector_1',
        fx_selector_2 : 'fx_selector_2',
        fx_selector_3 : 'fx_selector_3',
        fx_selector_4 : 'fx_selector_4',
        fx_selector_5 : 'fx_selector_5',
        fx_selector_6 : 'fx_selector_6',
        fx_selector_7 : 'fx_selector_7',
        fx_selector_8_1 : 'fx_selector_8_1',

        //They are single element
        //Contains the code and the label
        selectedItems_fx_selector_1: '',
        selectedItems_fx_selector_2: '',
        //They are arrays of objects
        //Policy Types
        selectedItems_fx_selector_3:[],
        //Policy Measures
        selectedItems_fx_selector_4:[],
        //Commodities Class
        selectedItems_fx_selector_5:[],
        //Countries
        selectedItems_fx_selector_6:[],

        //The array containing the model event that are raised by the model
        model_structure_event:[]
    }

    function QDPolicyModel( o ) {

        QDModel.call(this);

        //Overwrite the options

        if (this.options === undefined) {
            this.options = {};
        }

        $.extend(true, this.options, optionsDefault, o);

        this.map_event_creation();
    };

    QDPolicyModel.inherits( QDModel );

    QDPolicyModel.prototype.map_event_creation = function(){
        this.options.model_structure_event["selected_fx_selector_1_changed"] = "selected_fx_selector_1_changed";
        this.options.model_structure_event["selected_fx_selector_2_changed"] = "selected_fx_selector_2_changed";
        this.options.model_structure_event["selected_fx_selector_3_changed"] = "selected_fx_selector_3_changed";
        this.options.model_structure_event["selected_fx_selector_4_changed"] = "selected_fx_selector_4_changed";
        this.options.model_structure_event["selected_fx_selector_5_changed"] = "selected_fx_selector_5_changed";
        this.options.model_structure_event["selected_fx_selector_6_changed"] = "selected_fx_selector_6_changed";
        this.options.model_structure_event["selected_fx_selector_7_changed"] = "selected_fx_selector_7_changed";
        this.options.model_structure_event["selected_fx_selector_8_1_changed"] = "selected_fx_selector_8_1_changed";
    };

    QDPolicyModel.prototype.setSelectedItems_fx_selector_1 = function(selected_items){
        this.options.selectedItems_fx_selector_1 = selected_items;
    };

    QDPolicyModel.prototype.changeSelectedItems_fx_selector_1 = function(selected_items, properties){
        this.setSelectedItems_fx_selector_1(selected_items);
        //Raise the commodities change event
        //$('#fx_selector_1').trigger(this.options.model_structure_event["selected_fx_selector_1_changed"]);
        $('#'+ this.options.fx_selector_1).trigger(this.options.model_structure_event["selected_fx_selector_1_changed"], properties);
    };

    QDPolicyModel.prototype.getSelectedItems_fx_selector_1 = function(){
        return this.options.selectedItems_fx_selector_1;
    };

    QDPolicyModel.prototype.setSelectedItems_fx_selector_2 = function(selected_items){
        this.options.selectedItems_fx_selector_2 = selected_items;
    };

    QDPolicyModel.prototype.changeSelectedItems_fx_selector_2 = function(selected_items, properties){
        this.setSelectedItems_fx_selector_2(selected_items);
        //Raise the commodities change event
//        $('#fx_selector_2').trigger(this.options.model_structure_event["selected_fx_selector_2_changed"]);
        $('#'+ this.options.fx_selector_2).trigger(this.options.model_structure_event["selected_fx_selector_2_changed"], properties);
    };

    QDPolicyModel.prototype.getSelectedItems_fx_selector_2 = function(){
        return this.options.selectedItems_fx_selector_2;
    };

    QDPolicyModel.prototype.setSelectedItems_fx_selector_3 = function(selected_items){
        this.options.selectedItems_fx_selector_3 = selected_items;
    };

    QDPolicyModel.prototype.changeSelectedItems_fx_selector_3 = function(selected_items, properties){
        this.setSelectedItems_fx_selector_3(selected_items);
        //Raise the commodities change event
//        $('#fx_selector_3').trigger(this.options.model_structure_event["selected_fx_selector_3_changed"]);
        $('#'+ this.options.fx_selector_3).trigger(this.options.model_structure_event["selected_fx_selector_3_changed"], properties);
    };

    QDPolicyModel.prototype.getSelectedItems_fx_selector_3 = function(){
        return this.options.selectedItems_fx_selector_3;
    };

    QDPolicyModel.prototype.setSelectedItems_fx_selector_4 = function(selected_items){
        this.options.selectedItems_fx_selector_4 = selected_items;
    };

    QDPolicyModel.prototype.changeSelectedItems_fx_selector_4 = function(selected_items, properties){
        this.setSelectedItems_fx_selector_4(selected_items);
        //Raise the commodities change event
//        $('#fx_selector_4').trigger(this.options.model_structure_event["selected_fx_selector_4_changed"]);
        $('#'+ this.options.fx_selector_4).trigger(this.options.model_structure_event["selected_fx_selector_4_changed"], properties);
    };

    QDPolicyModel.prototype.getSelectedItems_fx_selector_4 = function(){
        return this.options.selectedItems_fx_selector_4;
    };

    QDPolicyModel.prototype.setSelectedItems_fx_selector_5 = function(selected_items){
        this.options.selectedItems_fx_selector_5 = selected_items;
    };

    QDPolicyModel.prototype.changeSelectedItems_fx_selector_5 = function(selected_items, properties){
        this.setSelectedItems_fx_selector_5(selected_items);
        //Raise the commodities change event
//        $('#fx_selector_5').trigger(this.options.model_structure_event["selected_fx_selector_5_changed"]);
        $('#'+ this.options.fx_selector_5).trigger(this.options.model_structure_event["selected_fx_selector_5_changed"], properties);
    };

    QDPolicyModel.prototype.getSelectedItems_fx_selector_5 = function(){
        return this.options.selectedItems_fx_selector_5;
    };

    QDPolicyModel.prototype.setSelectedItems_fx_selector_6 = function(selected_items){
        this.options.selectedItems_fx_selector_6 = selected_items;
    };

    QDPolicyModel.prototype.changeSelectedItems_fx_selector_6 = function(selected_items, properties){
        this.setSelectedItems_fx_selector_6(selected_items);
        //Raise the commodities change event
//        $('#fx_selector_6').trigger(this.options.model_structure_event["selected_fx_selector_6_changed"]);
        $('#'+ this.options.fx_selector_6).trigger(this.options.model_structure_event["selected_fx_selector_6_changed"], properties);
    };

    QDPolicyModel.prototype.getSelectedItems_fx_selector_6 = function(){
        return this.options.selectedItems_fx_selector_6;
    };

    QDPolicyModel.prototype.setSelectedItems_fx_selector_7 = function(selected_items){
        this.options.selectedItems_fx_selector_7 = selected_items;
    };

    QDPolicyModel.prototype.changeSelectedItems_fx_selector_7 = function(selected_items, properties){
        this.setSelectedItems_fx_selector_7(selected_items);
        //Raise the commodities change event
//        $('#fx_selector_7').trigger(this.options.model_structure_event["selected_fx_selector_7_changed"]);
        $('#'+ this.options.fx_selector_7).trigger(this.options.model_structure_event["selected_fx_selector_7_changed"], properties);
    };

    QDPolicyModel.prototype.getSelectedItems_fx_selector_7 = function(){
        return this.options.selectedItems_fx_selector_7;
    };

    QDPolicyModel.prototype.changeSelectedItems_fx_selector_8_1 = function(selected_items){
        //Raise the commodities change event
//        $('#fx_selector_8').trigger(this.options.model_structure_event["selected_fx_selector_8_changed"]);
        $('#'+ this.options.fx_selector_8_1).trigger(this.options.model_structure_event["selected_fx_selector_8_1_changed"]);
    };

//    Old Download with the menu containing: Policy Data and Shared Group Data START
//    QDPolicyModel.prototype.changeSelectedItems_fx_selector_8_2 = function(properties){
//        //Raise the commodities change event
//        $('#'+ this.options.fx_selector_8_2).trigger(this.options.model_structure_event["selected_"+properties+"_changed"]);
//    };
//    Old Download with the menu containing: Policy Data and Shared Group Data END

    //properties is specific for the specific selector
    //For example it can contain the 'menu item id' in the 'dropdown menu button'
    QDPolicyModel.prototype.update = function(selector_instance, new_selection, properties){

        if((selector_instance!=null)&&(typeof selector_instance != "undefined"))
        {
            if((new_selection == null)||(typeof new_selection == 'undefined')||(new_selection.length==0))
            {
                new_selection = [];
            }
            switch(selector_instance.options.id)
            {
//                case 'fx_selector_1' :
//                    this.changeSelectedItems_fx_selector_1(new_selection);
//                    break;
//                case 'fx_selector_2' :
//                    this.changeSelectedItems_fx_selector_2(new_selection);
//                    break;
//                case 'fx_selector_3' :
//                    this.changeSelectedItems_fx_selector_3(new_selection);
//                    break;
//                case 'fx_selector_4' :
//                    this.changeSelectedItems_fx_selector_4(new_selection);
////                    console.log('Policy model'+this.options.selectedItems_fx_selector_4);
////                    for(var i=0; i< this.options.selectedItems_fx_selector_4.length; i++)
////                    {
////                        console.log('Policy model Label= '+this.options.selectedItems_fx_selector_4[i].label+' Value= '+this.options.selectedItems_fx_selector_4[i].value);
////                    }
//                    break;
//                case 'fx_selector_5' :
//                    this.changeSelectedItems_fx_selector_5(new_selection);
//                    break;
//                case 'fx_selector_6' :
//                    this.changeSelectedItems_fx_selector_6(new_selection);
//                    break;
//                case 'fx_selector_7' :
//                    this.changeSelectedItems_fx_selector_7(new_selection);
//                    break;
//                case 'fx_selector_8' ://Preview Button
//                    this.changeSelectedItems_fx_selector_8();
//                    break;
                case this.options.fx_selector_1 :
                    this.changeSelectedItems_fx_selector_1(new_selection, properties);
                    break;
                case this.options.fx_selector_2 :
                    this.changeSelectedItems_fx_selector_2(new_selection, properties);
                    break;
                case this.options.fx_selector_3 :
                    this.changeSelectedItems_fx_selector_3(new_selection, properties);
                    break;
                case this.options.fx_selector_4 :
                    this.changeSelectedItems_fx_selector_4(new_selection, properties);
//                    console.log('Policy model'+this.options.selectedItems_fx_selector_4);
//                    for(var i=0; i< this.options.selectedItems_fx_selector_4.length; i++)
//                    {
//                        console.log('Policy model Label= '+this.options.selectedItems_fx_selector_4[i].label+' Value= '+this.options.selectedItems_fx_selector_4[i].value);
//                    }
                    break;
                case this.options.fx_selector_5 :
                    this.changeSelectedItems_fx_selector_5(new_selection, properties);
                    break;
                case this.options.fx_selector_6 :
                    this.changeSelectedItems_fx_selector_6(new_selection, properties);
                    break;
                case this.options.fx_selector_7 :
                    this.changeSelectedItems_fx_selector_7(new_selection, properties);
                    break;
                case this.options.fx_selector_8_1 ://Preview Button
                   // console.log("In grid update properties  = "+properties);
                    this.changeSelectedItems_fx_selector_8_1(properties, properties);
                    break;
                default :
                    break;
            }
        }
    };

    QDPolicyModel.prototype.getSelectedItems = function(selector_instance){
        var selected_elements = '';

        switch(selector_instance.options.id)
        {
//            case 'fx_selector_1' :
//                selected_elements = this.getSelectedItems_fx_selector_1();
//                break;
//            case 'fx_selector_2' :
//                selected_elements = this.getSelectedItems_fx_selector_2();
//                break;
//            case 'fx_selector_3' :
//                selected_elements = this.getSelectedItems_fx_selector_3();
//                break;
//            case 'fx_selector_4' :
//                selected_elements = this.getSelectedItems_fx_selector_4();
//                break;
//            case 'fx_selector_5' :
//                selected_elements = this.getSelectedItems_fx_selector_5();
//                break;
//            case 'fx_selector_6' :
//                selected_elements = this.getSelectedItems_fx_selector_6();
//                break;
//            case 'fx_selector_7' :
//                selected_elements = this.getSelectedItems_fx_selector_7();
//                break;
            case this.options.fx_selector_1 :
                selected_elements = this.getSelectedItems_fx_selector_1();
                break;
            case this.options.fx_selector_2 :
                selected_elements = this.getSelectedItems_fx_selector_2();
                break;
            case this.options.fx_selector_3 :
                selected_elements = this.getSelectedItems_fx_selector_3();
                break;
            case this.options.fx_selector_4 :
                selected_elements = this.getSelectedItems_fx_selector_4();
                break;
            case this.options.fx_selector_5 :
                selected_elements = this.getSelectedItems_fx_selector_5();
                break;
            case this.options.fx_selector_6 :
                selected_elements = this.getSelectedItems_fx_selector_6();
                break;
            case this.options.fx_selector_7 :
                selected_elements = this.getSelectedItems_fx_selector_7();
                break;
            default :
                break;
        }
        return selected_elements;
    };

    return QDPolicyModel;

});