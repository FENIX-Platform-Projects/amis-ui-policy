define([
    'jquery',
    'qd_selector',
    'qd_utils',
    'jqwidget',
    'bootstrap'
], function($, QDSelector, QDUtils) {

//    Configuration Example:
//    {
//        "id":"fx_selector_8_2",
//        "type":"menubutton",
//        "domain_type" : "Download",
//        "language"  :   "EN",
//        "title" :   "Download",
//        "menu_properties" : {"id":"fx_selector_8_2_menu", "menuitems":[{"id": "fx_selector_8_2_menu_item1", "label": "Policy Data"}, {"id": "fx_selector_8_2_menu_item2", "label": "Shared Group Data"}]},
//        "color" :   "green",
//        "tooltip": "ButtonMenu Download Tooltip"
//  }

    var optionsDefault = {
        color : '',
        tooltip : '',
        menu_properties : ''
    }

    function QDSelectorMenuButton(o) {
        QDSelector.call(this);

        //Overwrite the options
        if (this.options === undefined) {
            this.options = {};
        }

        $.extend(true, this.options, optionsDefault, o);
    };

    QDSelectorMenuButton.inherits(QDSelector);

    //div= the div of the element that has to contains the tooltip
    QDSelectorMenuButton.prototype.createTooltips = function(div){

        //If the tooltip has to be created
        var tooltip_bool = false;
        //The string to insert in the tooltip
        var tooltip_value = false;
        if((this.options.tooltip!=null)&&(typeof this.options.tooltip!= 'undefined'))
        {
            tooltip_value = this.options.tooltip;
            tooltip_bool = true;
        }

        if(tooltip_bool)
        {
            $('#'+div).attr('data-toggle', 'tooltip');
            $('#'+div).attr('data-placement', 'bottom');
            $('#'+div).attr('title', tooltip_value);
            $("#"+div).tooltip();
        }
    };

    QDSelectorMenuButton.prototype.buttonGetClassByColor = function(color){
        var class_name = '';
        switch(color)
        {
            case 'white':
                class_name = 'btn btn-xs btn-default';
                break;
            case 'blue':
                class_name = 'btn btn-xs btn-primary';
                break;
            case 'green':
                class_name = 'btn btn-xs btn-success';
                break;
            case 'light blue':
                class_name = 'btn btn-xs btn-info';
                break;
            case 'orange':
                class_name = 'btn btn-xs btn-warning';
                break;
            case 'red':
                class_name = 'btn btn-xs btn-danger';
                break;
            default :
                class_name = 'btn btn-xs btn-default';
                break;
        }
        return class_name;
    };

    QDSelectorMenuButton.prototype.buttonPropertiesSetting = function(){
        $('#'+this.options.id).text(this.options.title);
        $('#'+this.options.id).addClass('policy-button-show');
        var class_name = '';
        if((this.options.color!=null)&&(typeof this.options.color!= 'undefined'))
        {
            class_name = this.buttonGetClassByColor(this.options.color);
        }
        else
        {
            class_name = this.buttonGetClassByColor('');
        }

        if(typeof class_name != 'undefined')
        {
            $('#'+this.options.id).addClass(class_name);
        }
    };

    //"menu_properties" : {"id":"fx_selector_8_2_menu", "menuitems":[{"id": "fx_selector_8_2_menu_item1", "label": "Policy Data"}, {"id": "fx_selector_8_2_menu_item2", "label": "Shared Group Data"}]},
    QDSelectorMenuButton.prototype.createMenuItems = function(){

        var self = this;
        if((this.options.menu_properties!= null)&&(typeof this.options.menu_properties!= 'undefined')&&(this.options.menu_properties.menuitems!= null)&&(typeof this.options.menu_properties.menuitems!= 'undefined'))
        {
            for(var i =0; i< this.options.menu_properties.menuitems.length; i++)
            {
                var s = "<li><a target='_blank' id="+this.options.menu_properties.menuitems[i].id+">"+this.options.menu_properties.menuitems[i].label+"</a></li>";

                $('#'+this.options.menu_properties.id).append(s);
                //Set the event for each items of the button menu
                $('#'+self.options.menu_properties.menuitems[i].id).click(function(e){
                    //self is the selector
                    self.modelUpdate(self, this.id);
                });
            }
        }
    };

    QDSelectorMenuButton.prototype.modelUpdate = function(self, properties){
        //Call the controller to update the model for this component
        self.options.controller.modelUpdate(self, '',properties);
    };

    //This function is called to create the jqwidget
    QDSelectorMenuButton.prototype.render = function() {

        //Set properties
        this.buttonPropertiesSetting();

        this.createMenuItems();

        //This means that the jqxwidget has been initialized
        this.options.controller.options.selector_list_ready_count++;
        this.options.controller.options.selector_list_ready[this.options.id]= 1;
    };

    QDSelectorMenuButton.prototype.getColor = function(){

        return this.options.color;
    };

    QDSelectorMenuButton.prototype.setColor = function(color){

        this.options.color = color;
    };

    QDSelectorMenuButton.prototype.getTooltip = function(){

        return this.options.tooltip;
    };

    QDSelectorMenuButton.prototype.setTooltip = function(tooltip){

        this.options.tooltip = tooltip;
    };

    return QDSelectorMenuButton;
});
