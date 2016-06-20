define([
    'jquery',
    'qd_selector',
    'qd_utils',
    'jqwidget',
    'bootstrap'
], function($, QDSelector, QDUtils) {

//    Configuration Example:
//    {
//        "id":"fx_selector_8",
//        "type":"button",
//        "domain_type" : "Preview",
//        "language"  :   "EN",
//        "title" :   "Preview",
//        "color" :   "red",
//        "tooltip": "Button Preview Tooltip"
//    }

    var optionsDefault = {
        color : '',
        tooltip : ''
    }

    function QDSelectorButton(o) {
        QDSelector.call(this);

        //Overwrite the options
        if (this.options === undefined) {
            this.options = {};
        }

        $.extend(true, this.options, optionsDefault, o);
    };

    QDSelectorButton.inherits(QDSelector);

    //div= the div of the element that has to contains the tooltip
    QDSelectorButton.prototype.createTooltips = function(div){

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

    QDSelectorButton.prototype.buttonGetClassByColor = function(color){
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

    QDSelectorButton.prototype.buttonPropertiesSetting = function(){
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

        //Tooltips
        this.createTooltips(this.options.id);

        if(typeof class_name != 'undefined')
        {
            $('#'+this.options.id).addClass(class_name);
        }
    };

    QDSelectorButton.prototype.modelUpdate = function(self){

        //Call the controller to update the model for this component
        self.options.controller.modelUpdate(self);
    };

    QDSelectorButton.prototype.buttonEventsSetting = function(iButton){
        var self= this;
        $('#'+self.options.id).click(function(e){
            switch(self.options.domain_type)
            {
                //Button Preview
                case 'Preview':
                    self.modelUpdate(self);
                    break;
                //Button Preview
                case 'Download':
                    self.modelUpdate(self);
                    break;
                case 'Metadata':
                    self.modelUpdate(self);
                    break;
                case 'HistoricPolicy':
                    self.modelUpdate(self);
                    break;
                case 'HistoricCommodity':
                    self.modelUpdate(self);
                    break;
                default :
                    break;
            }
        });
    };

    //This function is called to create the jqwidget
    QDSelectorButton.prototype.render = function() {

        //Set properties
        this.buttonPropertiesSetting();

        //Set the events
        this.buttonEventsSetting();

        //This means that the jqxwidget has been initialized
        this.options.controller.options.selector_list_ready_count++;
        this.options.controller.options.selector_list_ready[this.options.id]= 1;
    };

    QDSelectorButton.prototype.getColor = function(){

        return this.options.color;
    };

    QDSelectorButton.prototype.setColor = function(color){

        this.options.color = color;
    };

    QDSelectorButton.prototype.getTooltip = function(){

        return this.options.tooltip;
    };

    QDSelectorButton.prototype.setTooltip = function(tooltip){

        this.options.tooltip = tooltip;
    };

    return QDSelectorButton;
});