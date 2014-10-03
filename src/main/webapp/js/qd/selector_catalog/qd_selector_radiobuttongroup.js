define([
    'jquery',
    'qd_selector',
    'qd_utils',
    'jqwidget',
    'bootstrap'
], function($, QDSelector, QDUtils) {

    //    Configuration Example:
//    {
//        "id":"fx_selector_1",
//        "type":"radiobuttongroup",
//        "domain_type" : "CommodityDomain",
//        "group_name":"fx_selector_1_group",
//        "elements" : [{"value":true,"id":"fx_selector_1_rb1", "label":"Agricultural", "code": 1}, {"value":false,"id":"fx_selector_1_rb2", "label":"Biofuels", "code":2}, {"value":false,"id":"fx_selector_1_rb3", "label":"Both", "code":-1}],
//        "language"  :   "EN",
//        "title" :   {"id":"fx_selector_1_label", "value":"Commodity Domain"}
//    }

    var optionsDefault = {
        //MANDATORY: This is the name of the radio button group
        "group_name":"",
        //MANDATORY: Element list with id
        //This is the list of the radio buttons that belong to this list
        "elements" : "",
        "language" : "",
        "domain_type":""
    }

    function QDSelectorRadioButtonGroup( o )
    {
        QDSelector.call(this);

        //Overwrite the options
        if (this.options === undefined) {
            this.options = {};
        }

        $.extend(true, this.options, optionsDefault, o);
    };

    QDSelectorRadioButtonGroup.inherits(QDSelector);

    QDSelectorRadioButtonGroup.prototype.modelUpdate = function(self, element_index){
//         var item = {"value": ""+self.options.domain_type +"_"+self.options.elements[element_index].position +"_"+self.options.elements[element_index].code, "label":self.options.elements[element_index].label, "code":self.options.elements[element_index].code, "position":self.options.elements[element_index].position};
        var item = {"value": ""+self.options.domain_type +"_"+self.options.elements[element_index].code, "label":self.options.elements[element_index].label, "code":self.options.elements[element_index].code};
         //Call the controller to update the model for this component
         self.options.controller.modelUpdate(self, item);
     };

    QDSelectorRadioButtonGroup.prototype.changeRadioButton = function(element_index){
        var self= this;
        $('#'+self.options.elements[element_index].id).on('change', function (event) {
            var checked = event.args.checked;
            if (checked) {
                //it's done only if it's selected .... because it's a radio group button.... so only one can be selected
                self.modelUpdate(self, element_index);
            }
        });
    };

    QDSelectorRadioButtonGroup.prototype.initRadioButtonGroup = function(){

        for(var iRb =0; iRb<this.options.elements.length; iRb++)
        {
            //Initialize
            if((this.options.elements[iRb].label!=null)&&(typeof this.options.elements[iRb].label!='undefined'))
            {
                $("#"+this.options.elements[iRb].id).append("<span>"+this.options.elements[iRb].label+"</span>");
            }

//            $("#"+this.options.elements[iRb].id).jqxRadioButton({height: 25, checked: this.options.elements[iRb].value, groupName: this.options.group_name});
            $("#"+this.options.elements[iRb].id).jqxRadioButton({height: 25, groupName: this.options.group_name});
//            if(this.options.elements[iRb].value)
//            {
//                //If the button is checked
//                this.modelUpdate(this, iRb);
//            }
        }

        if((this.options.title!=null)&&(typeof this.options.title!='undefined')&&(this.options.title.value!=null)&&(typeof this.options.title.value!='undefined'))
        {
            $("#"+this.options.title.id).text(this.options.title.value);
        }

        //For each radio button create the onchange...
        for(var iRb =0; iRb<this.options.elements.length; iRb++)
        {
            this.changeRadioButton(iRb);
        }

        //This means that the jqxwidget has been initialized
        this.options.controller.options.selector_list_ready_count++;
        this.options.controller.options.selector_list_ready[this.options.id]= 1;
    };

    QDSelectorRadioButtonGroup.prototype.updateDomain = function(properties){

        //{"value": ""+self.options.domain_type +"_"+self.options.elements[element_index].code, "label":self.options.elements[element_index].label, "code":self.options.elements[element_index].code};
        if((this.options.elements!=null)&&(typeof this.options.elements!='undefined'))
        {
            for(var iRb =0; iRb<this.options.elements.length; iRb++)
            {
                //Initialize
                //$("#"+this.options.elements[iRb].id).append("<span>"+this.options.elements[iRb].label+"</span>");
                if((this.options.elements[iRb].value!=null)&&(this.options.elements[iRb].value!='undefined'))
                {
                    $("#"+this.options.elements[iRb].id).jqxRadioButton({checked: this.options.elements[iRb].value});
                }
                else if((this.options.domain[iRb].value!=null)&&(this.options.domain[iRb].value!='undefined'))
                {
                    this.options.elements[iRb].value = this.options.domain[iRb].value;
                    $("#"+this.options.elements[iRb].id).jqxRadioButton({checked: this.options.elements[iRb].value});
                }

                //If info: code, label have not been inserted in the configuration file ... check if they are in the domain
//                if((this.options.elements[iRb].position == null)&&(typeof this.options.elements[iRb].position == 'undefined'))
//                {
//                    if((this.options.domain[iRb].position != null)&&(typeof this.options.domain[iRb].position != 'undefined'))
//                    {
//                        this.options.elements[iRb].position = this.options.domain[iRb].position;
//                    }
//                }
                if((this.options.elements[iRb].code == null)&&(typeof this.options.elements[iRb].code == 'undefined'))
                {
                    if((this.options.domain[iRb].code != null)&&(typeof this.options.domain[iRb].code != 'undefined'))
                    {
                        this.options.elements[iRb].code = this.options.domain[iRb].code;
                    }
                }
                if((this.options.elements[iRb].label == null)&&(typeof this.options.elements[iRb].label == 'undefined'))
                {
                    if((this.options.domain[iRb].label != null)&&(typeof this.options.domain[iRb].label != 'undefined'))
                    {
                        this.options.elements[iRb].label = this.options.domain[iRb].label;
                    }
                }
//                if(this.options.elements[iRb].value)
//                {
//                    //If the button is checked
//                    this.modelUpdate(this, iRb);
//                }
            }
        }
    };

    QDSelectorRadioButtonGroup.prototype.selectItems = function(properties){

        //{"value": ""+self.options.domain_type +"_"+self.options.elements[element_index].code, "label":self.options.elements[element_index].label, "code":self.options.elements[element_index].code};
        if((this.options.elements!=null)&&(typeof this.options.elements!='undefined'))
        {
            //Check the element that is passed like argument
            for(var iRb =0; iRb<this.options.elements.length; iRb++)
            {
                for(var iPr =0; iPr<properties.length; iPr++) {
                    if (this.options.elements[iRb].code == properties[iPr].code) {
                        $("#" + this.options.elements[iRb].id).jqxRadioButton('check');
                        //If the button is checked
                        //this.modelUpdate(this, iRb);
                    }
                }
            }
        }
    };

    QDSelectorRadioButtonGroup.prototype.deselectItems = function(properties){

        //{"value": ""+self.options.domain_type +"_"+self.options.elements[element_index].code, "label":self.options.elements[element_index].label, "code":self.options.elements[element_index].code};
        if((this.options.elements!=null)&&(typeof this.options.elements!='undefined'))
        {
            //Check the element that is passed like argument
            for(var iRb =0; iRb<this.options.elements.length; iRb++)
            {
                for(var iPr =0; iPr<properties.length; iPr++) {
                    if (this.options.elements[iRb].code == properties[iPr].code) {
                        $("#" + this.options.elements[iRb].id).jqxRadioButton('uncheck');

                        //If the button is checked
                        //this.modelUpdate(this, iRb);
                    }
                }
            }
        }
    };

    //Properties contains the index of elements to disable
    QDSelectorRadioButtonGroup.prototype.disableItems = function(properties){

        if((this.options.elements!=null)&&(typeof this.options.elements!='undefined'))
        {
            //Check the element that is passed like argument
            for(var iRb =0; iRb<this.options.elements.length; iRb++)
            {
                for(var iPr =0; iPr<properties.length; iPr++) {
                    if(this.options.elements[iRb].code == properties[iPr].code)
                    {
                        $("#"+this.options.elements[iRb].id).jqxRadioButton('disable');

                        //If the button is checked
                        //this.modelUpdate(this, iRb);
                    }
                }
            }
        }
    };

    //Properties contains the index of elements to enable
    QDSelectorRadioButtonGroup.prototype.enableItems = function(properties){

        if((this.options.elements!=null)&&(typeof this.options.elements!='undefined'))
        {
            //Check the element that is passed like argument
            for(var iRb =0; iRb<this.options.elements.length; iRb++)
            {
                for(var iPr =0; iPr<properties.length; iPr++) {
                    if (this.options.elements[iRb].code == properties[iPr].code) {
                        $("#" + this.options.elements[iRb].id).jqxRadioButton('enable');

                        //If the button is checked
                        //this.modelUpdate(this, iRb);
                    }
                }
            }
        }
    };

    //This function is called to create the jqwidget
    QDSelectorRadioButtonGroup.prototype.render = function(){

        this.initRadioButtonGroup();
    };

    QDSelectorRadioButtonGroup.prototype.getDomainType = function(){

        return this.options.domain_type;
    };

    QDSelectorRadioButtonGroup.prototype.setDomainType = function(domain_type){

        this.options.domain_type = domain_type;
    };

    QDSelectorRadioButtonGroup.prototype.getLanguage = function(){

        return this.options.language;
    };

    QDSelectorRadioButtonGroup.prototype.setLanguage = function(language){

        this.options.language = language;
    };

    return QDSelectorRadioButtonGroup;

});