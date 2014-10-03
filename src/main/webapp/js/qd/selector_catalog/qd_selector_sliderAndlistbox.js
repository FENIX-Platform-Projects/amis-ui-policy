define([
    'jquery',
    'qd_selector',
    'qd_utils',
    'jqwidget',
    'bootstrap',
    'jQAllRangeSliders'
], function($, QDSelector, QDUtils) {

//    Configuration Example:
//    {
//        "id":"fx_selector_7",
//        "type":"sliderAndlistbox",
//        "domain_type" : "Year",
//        "slider_id":"fx_selector_7_slider",
//        "slider_container_id":"fx_selector_7_slider_container",
//        "list_id":"fx_selector_7_listbox",
//        "language"  :   "EN",
//        "title" :   [{"value":"Years Slider"},{"value":"Years List"}],
//        "slider_properties" : {"slider_type":"data","left_label_id":"fx_selector_7_slider_labelMin","left_label_title":"Year Min", "right_label_id":"fx_selector_7_slider_labelMax","right_label_title":"Year Max", "wheelMode": "zoom", "step":{"days": 1}, "range":{"min":{"years": 5}, "max":{"years": 60}}},
//        "domain":[{"value":"fifty","id":"5"}],
//        "buttons":[{"type":"select", "id": "fx_selector_7_button_select", "title": "Select All", "color": "red", "tooltip": "Button Select Tooltip", "show_in" : [1]}, {"type":"clear", "id": "fx_selector_7_button_clear", "title": "Clear Selection", "color": "blue", "tooltip": "Button Clear Selection Tooltip", "show_in" : [1]}]
//    }

    var optionsDefault = {
        domain_type : '',
        language : '',
        //This is used in this selector type to indicate the id of the list that belong to this selector
        list_id :   '',
        slider_id : '',
        //This is used to insert or remove the elements from the listbox....
        //managed by the checkbox
        //[{'label': '', 'code': ''}]
        checkbox_elements_removeFromList : '',
        //This boolean indicates if the checkbox removeFromList is checked or not
        checkbox_status_removeFromList : false,
        //This is a boolean that store if Select All Button has be pressed
        //By default is false so that if the component has not to include the Select All Button
        //it remains false
        //It is used by the checkbox of type removeFromList
        // (if Select All is pressed insert the elements in the list box like selected)
        select_all_button_pressed : false,
        //The obj containing the parent for each element in the checkbox_elements_removeFromList
        //It's not mandatory
        //e.g. var parent = {'8':[1,3],'9':[2,3],'10':[3,4],'11':[1,2,3],'12':[1,2]};
        parent : '',

        //This variable contains the tab that the user is seeing
        //Slider=0, Listbox=1
        active_tab: '',

        //This variable stores the properties that are passed by the controller during the initialization phase.
        //This is used every time the user click on one tab to restore the original properties
        original_properties : '',

        slider_container_id : '',
        //slider_type in slider_properties is Mandatory
        slider_properties : {"slider_type":"data"}
    }

    function QDSelectorSliderAndListbox( o )
    {
        QDSelector.call(this);

        //Overwrite the options
        if (this.options === undefined) {
            this.options = {};
        }

        $.extend(true, this.options, optionsDefault, o);
    };

    QDSelectorSliderAndListbox.inherits(QDSelector);

    QDSelectorSliderAndListbox.prototype.modelUpdate = function(self, changed_item){
        var items='';
        var properties = {};
        if(self.options.active_tab==0)
        {
            //Slider
            if(this.options.slider_properties.slider_type == "data") {
                //Format
                //{"min" : Date {Mon Jan 01 2007 00:00:00 GMT+0100 (CET)}, "max" : Date {Thu Jan 01 2015 00:00:00 GMT+0100 (CET)}}
                items = $('#' + self.options.slider_container_id).dateRangeSlider("values");
                properties.active_tab=0;
            }
        }
        else if(self.options.active_tab==1)
        {
            //Listbox
            items = $('#'+self.options.list_id).jqxListBox('getSelectedItems');
            properties.changed_item= changed_item;
            properties.active_tab=1;
        }
        //Call the controller to update the model for this component
        self.options.controller.modelUpdate(self, items, properties);
    };

    QDSelectorSliderAndListbox.prototype.buttonGetClassByColor = function(color){
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

    QDSelectorSliderAndListbox.prototype.buttonPropertiesSetting = function(iButton){
        // $('#'+this.options.buttons[iButton].id).css('display','block');
        $('#'+this.options.buttons[iButton].id).text(this.options.buttons[iButton].title);
        $('#'+this.options.buttons[iButton].id).addClass('policy-button-show');
        var class_name = '';
        if((this.options.buttons[iButton].color!=null)&&(typeof this.options.buttons[iButton].color!= 'undefined'))
        {
            class_name = this.buttonGetClassByColor(this.options.buttons[iButton].color);
        }
        else
        {
            class_name = this.buttonGetClassByColor('');
        }

        //Tooltips
        this.createTooltips(this.options.buttons[iButton].id, 'button', iButton);
        if(typeof class_name != 'undefined')
        {
            $('#'+this.options.buttons[iButton].id).addClass(class_name);
        }
    };

    QDSelectorSliderAndListbox.prototype.checkboxesPropertiesSetting = function(iCheckbox){

        if((this.options.checkboxes[iCheckbox].id_title!= null)&&(typeof this.options.checkboxes[iCheckbox].id_title != 'undefined'))
        {
            $('#'+this.options.checkboxes[iCheckbox].id_title).text(this.options.checkboxes[iCheckbox].title);
        }
        if((this.options.checkboxes[iCheckbox].value!= null)&&(typeof this.options.checkboxes[iCheckbox].value != 'undefined')&&(typeof this.options.checkboxes[iCheckbox].value != 'checked'))
        {
            $('#'+this.options.checkboxes[iCheckbox].id).jqxCheckBox('check');
        }
        //Tooltips
        this.createTooltips(this.options.checkboxes[iCheckbox].id, 'checkbox', iCheckbox);

        $('#'+this.options.checkboxes[iCheckbox].id).addClass('policy-button-show');
        if((this.options.checkboxes[iCheckbox].type!=null)&&(typeof this.options.checkboxes[iCheckbox].type!='undefined'))
        {
            switch(this.options.checkboxes[iCheckbox].type)
            {
                case 'removeFromList':
                    this.options.checkbox_status_removeFromList = this.options.checkboxes[iCheckbox].value;
                    break;
                default :
                    break;
            }
        }
    };

    QDSelectorSliderAndListbox.prototype.buttonEventsSetting = function(iButton){
        var self= this;
        $('#'+self.options.buttons[iButton].id).click(function(e){
            switch(self.options.buttons[iButton].type)
            {
                //Button Select All
                case 'select':
                    //This variable is used in the checkbox
                    self.options.select_all_button_pressed = true;
                    //Deselect All
                    var objGetDomain = {};
                    objGetDomain.tab_type =1;
                    objGetDomain.full =true;
                    var source_domain = self.getDomain(objGetDomain);

                    var properties = {};
                    properties.tab_type = 1;
                    properties.values = [];
                    if ((source_domain != null) && (typeof source_domain != 'undefined')) {

                        for (var i = 0; i < source_domain.length; i++) {
                            properties.values[i] = ""+i;
                        }
                        self.deselectItems(properties);
                    }

                    //Select again
                    var selectAll= true;
                    self.selectItems(properties, selectAll);
                    var items = $('#'+self.options.list_id).jqxListBox('getItems');
                    break;
                case 'clear'://Button Clear Selection
                    //This variable is used in the checkbox
                    self.options.select_all_button_pressed = false;
                    //Deselect All
                    var objGetDomain = {};
                    objGetDomain.tab_type =1;
                    objGetDomain.full =true;
                    var source_domain = self.getDomain(objGetDomain);
                    var properties = {};
                    properties.tab_type = 1;
                    properties.values = [];
                    if ((source_domain != null) && (typeof source_domain != 'undefined')) {

                        for (var i = 0; i < source_domain.length; i++) {
                            properties.values[i] = ""+i;
                        }
                        self.deselectItems(properties);
                    }

                    break;
                default :
                    break;
            }
        });
    };

    QDSelectorSliderAndListbox.prototype.updateCheckbox_removeFromList = function(self){
        //If it is checked show the elements in the list
        if(self.options.checkbox_status_removeFromList)
        {
            //Include some elements in the list
            if((self.options.checkbox_elements_removeFromList!=null)&&(typeof self.options.checkbox_elements_removeFromList!='undefined'))
            {
                var model_update_done = false;
                for(var i=0; i< self.options.checkbox_elements_removeFromList.length; i++)
                {
                    var item = self.options.checkbox_elements_removeFromList[i];
                    //Add the item ... it doesn't call the onchange
                    $("#"+self.options.list_id).jqxListBox('addItem', item );

                    //If the user has pressed 'Select All' button... select the elements
                    if(self.options.select_all_button_pressed)
                    {
                        var items = $('#'+self.options.list_id).jqxListBox('getItems');
                        for (var iItem = 0; iItem < items.length; iItem++) {
                            if ((items[iItem].value == item.value) && (items[iItem].label == item.label)) {
                                var properties = {};
                                properties.tab_type = 1;
                                properties.values = [];
                                properties.values.push(iItem);
                                self.selectItems(properties);
                                model_update_done = true;
                                break;
                            }
                        }
                    }
                    else
                    {
                        //Else... unselect the elements or select
                        //It's important to do the 'unselect' otherwise it remains selected
                        var items = $('#'+self.options.list_id).jqxListBox('getItems');
                        var selected_items = $('#'+self.options.list_id).jqxListBox('getSelectedItems');
                        for (var iItem = 0; iItem < items.length; iItem++) {
                            if ((items[iItem].value == item.value) && (items[iItem].label == item.label)) {
                                if((self.options.parent!=null)&&(typeof self.options.parent!='undefined'))
                                {
                                    var start_index = items[iItem].value.indexOf('_')+1;
                                    var elem_code = items[iItem].value.substring(start_index);
                                    var parent_array = self.options.parent[elem_code];
                                    if((parent_array!=null)&&(typeof parent_array!='undefined')&&(parent_array.length>0)){
                                        for(var iParent=0; iParent<parent_array.length;iParent++){
                                            var parent_code = parent_array[iParent];
                                            var iItem2 = 0;
                                            for (iItem2 = 0; iItem2 < selected_items.length; iItem2++) {//
                                                if((selected_items[iItem2]!=null)&&(typeof selected_items[iItem2]!="undefined")&&(selected_items[iItem2].value!=null)&&(typeof selected_items[iItem2].value!="undefined"))
                                                {
                                                    var selected_value = selected_items[iItem2].value;    //Commodity_code
                                                    var selected_code_index = selected_value.indexOf('_');
                                                    if(selected_value.substring(selected_code_index+1)==parent_code)
                                                    {
                                                        //If the parent is selected.... the element has to be selected...
                                                        //if one of the all father is selected is enough
                                                        break;
                                                    }
                                                }
                                            }

                                            if(iItem2<selected_items.length)
                                            {
                                                //If the parent is selected.... the element has to be selected...
                                                var properties = {};
                                                properties.tab_type = 1;
                                                properties.values = [];
                                                properties.value.push(iItem);
                                                self.selectItems(properties);
                                                model_update_done = true;
                                                break;
                                            }
                                            else{
                                                //If the father is not selected... the element has to be deselected...
                                                var properties = {};
                                                properties.tab_type = 1;
                                                properties.values = [];
                                                properties.values.push(iItem);
                                                self.deselectItems(properties);
                                                model_update_done = true;
                                            }
                                        }
                                    }
                                }
                                else{
                                    var properties = {};
                                    properties.tab_type = 1;
                                    properties.values = [];
                                    properties.values.push(iItem);
                                    self.deselectItems(properties);
                                    selected_items = $('#'+self.options.list_id).jqxListBox('getSelectedItems');
                                    model_update_done = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                if(model_update_done==false)
                {
                    //Could happen that the addItem is done and the selectIndex or unselect Index is not done
                    //So reload the model
                    //The elements in the listbox  are changed so... update the model to update the list of the selected elements
                    self.modelUpdate(self);
                }
            }
        }
        else{
            //Loop on the items to remove from the list
            if((self.options.checkbox_elements_removeFromList!=null)&&(typeof self.options.checkbox_elements_removeFromList!='undefined'))
            {
                var items = $('#'+self.options.list_id).jqxListBox('getItems');

                for(var i=0; i< self.options.checkbox_elements_removeFromList.length; i++) {
                    for (var iItem = 0; iItem < items.length; iItem++) {
                        if ((items[iItem].value == self.options.checkbox_elements_removeFromList[i].value) && (items[iItem].label == self.options.checkbox_elements_removeFromList[i].label)) {
                            $("#"+self.options.list_id).jqxListBox('removeAt', iItem );
                            items = $('#'+self.options.list_id).jqxListBox('getItems');
                            iItem = 0;
                            break;
                        }
                    }
                }
                self.modelUpdate(self);
            }
        }
        //The elements in the listbox  are changed so... update the model to update the list of the selected elements
        // self.modelUpdate(self);
    };

    QDSelectorSliderAndListbox.prototype.checkboxEventsSetting = function(iCheckbox){

        var self= this;
        $('#'+self.options.checkboxes[iCheckbox].id).on('change', function (event){
            var checked = event.args.checked;

            switch(self.options.checkboxes[iCheckbox].type)
            {
                case 'removeFromList':
                    if(checked)
                    {
                        self.options.checkbox_status_removeFromList = true;
                    }
                    else{
                        self.options.checkbox_status_removeFromList = false;
                    }
                    self.updateCheckbox_removeFromList(self);
                    break;
                default :
                    break;
            }
        });
    };

    QDSelectorSliderAndListbox.prototype.createButtons = function(){
        if((this.options.buttons!=null)&&(typeof this.options.buttons!="undefined"))
        {
            for(var iButton=0; iButton<this.options.buttons.length; iButton++)
            {
                this.buttonPropertiesSetting(iButton);
                if((this.options.buttons[iButton].type!= null)&&(typeof this.options.buttons[iButton].type != 'undefined'))
                {
                    this.buttonEventsSetting(iButton);
                }
            }
        }
    };

    QDSelectorSliderAndListbox.prototype.createCheckboxes = function(){
        if((this.options.checkboxes!=null)&&(typeof this.options.checkboxes!="undefined"))
        {
            for(var iCheckbox=0; iCheckbox<this.options.checkboxes.length; iCheckbox++)
            {
                $("#"+ this.options.checkboxes[iCheckbox].id).jqxCheckBox({});

                this.checkboxesPropertiesSetting(iCheckbox);

                if((this.options.checkboxes[iCheckbox].type!= null)&&(typeof this.options.checkboxes[iCheckbox].type != 'undefined'))
                {
                    this.checkboxEventsSetting(iCheckbox);
                }
            }
        }
    };

    //div= the div of the element that has to contains the tooltip
    //element_type = e.g. buttons, checkbox
    //element_index = the index of the element in the array (contained in the configuration file) of the elements of these element_types
    QDSelectorSliderAndListbox.prototype.createTooltips = function(div, element_type, element_index){
        //If the tooltip has to be created
        var tooltip_bool = false;
        //The string to insert in the tooltip
        var tooltip_value = false;
        switch(element_type)
        {
            case 'button':
                if((this.options.buttons[element_index].tooltip!=null)&&(typeof this.options.buttons[element_index].tooltip!= 'undefined'))
                {
                    tooltip_value = this.options.buttons[element_index].tooltip;
                    tooltip_bool = true;
                }
                break;
            case 'checkbox':
                if((this.options.checkboxes[element_index].tooltip!=null)&&(typeof this.options.checkboxes[element_index].tooltip!= 'undefined'))
                {
                    tooltip_value = this.options.checkboxes[element_index].tooltip;
                    tooltip_bool = true;
                }
            default : '';
        }

        if(tooltip_bool)
        {
            $('#'+div).attr('data-toggle', 'tooltip');
            $('#'+div).attr('data-placement', 'bottom');
            $('#'+div).attr('title', tooltip_value);
            $("#"+div).tooltip();
        }
    };

    QDSelectorSliderAndListbox.prototype.changeListBox = function(){
        var self= this;
//        $('#'+self.options.list_id).on('change', function (event) {
//            console.log("ON CHANGE!!!!!!!!!!!!!!!!!");
//            console.log(event);
//            self.modelUpdate(self, event.args.item);
//        });
        $('#'+self.options.list_id).on('select', function (event) {
            var properties = new Object();
            properties = event.args.item;
            if((properties!=null)&&(typeof properties!='undefined')){
                properties.event_type = event.type;
            }
            self.modelUpdate(self, properties);
//            self.modelUpdate(self, event.args.item);
        });
        $('#'+self.options.list_id).on('unselect', function (event) {
//            self.modelUpdate(self, event.args.item);
            var properties = new Object();
            properties = event.args.item;
            if((properties!=null)&&(typeof properties!='undefined')){
                properties.event_type = event.type;
            }
            self.modelUpdate(self, properties);
        });
    };

    QDSelectorSliderAndListbox.prototype.initListBox = function(){
        var self = this;
//        $('#'+this.options.list_id).on('bindingComplete', function (event) {
//            //This means that the jqxwidget has been initialized
//            self.options.controller.options.selector_list_ready_count++;
//            self.options.controller.options.selector_list_ready[self.options.id]= 1;
//        });

        //The domain is not set in initialization phase
        $('#'+this.options.list_id).jqxListBox({width:"99%", height: 250, multipleextended:true});

        //This is not the right event
        this.changeListBox();
        this.createButtons();
        this.createCheckboxes();
    };

    QDSelectorSliderAndListbox.prototype.setSliderProperties = function(){

        if((this.options.slider_properties!=null)&&(typeof this.options.slider_properties!='undefined'))
        {
            if((this.options.slider_properties.left_label_id!=null)&&(typeof this.options.slider_properties.left_label_id!='undefined')&&(this.options.slider_properties.left_label_title!=null)&&(typeof this.options.slider_properties.left_label_title!='undefined'))
            {
                $("#"+this.options.slider_properties.left_label_id).text(this.options.slider_properties.left_label_title);
            }
            if((this.options.slider_properties.right_label_id!=null)&&(typeof this.options.slider_properties.right_label_id!='undefined')&&(this.options.slider_properties.right_label_title!=null)&&(typeof this.options.slider_properties.right_label_title!='undefined'))
            {
                $("#"+this.options.slider_properties.right_label_id).text(this.options.slider_properties.right_label_title);
            }

            //"wheelMode": "zoom", "step":{"days": 1}, "range":{"min":{"years": 5}, "max":{"years": 60}}},
            if(this.options.slider_properties.slider_type == "data")
            {
                if((this.options.slider_properties.wheelMode!=null)&&(typeof this.options.slider_properties.wheelMode!='undefined'))
                {
                    $("#"+this.options.slider_container_id).dateRangeSlider({wheelMode: this.options.slider_properties.wheelMode});
                }
                if((this.options.slider_properties.step!=null)&&(typeof this.options.slider_properties.step!='undefined'))
                {
                    $("#"+this.options.slider_container_id).dateRangeSlider({step:this.options.slider_properties.step});
                }
                if((this.options.slider_properties.range!=null)&&(typeof this.options.slider_properties.range!='undefined'))
                {
                    $("#"+this.options.slider_container_id).dateRangeSlider({range:this.options.slider_properties.range});
                }
            }
        }
    };

    QDSelectorSliderAndListbox.prototype.setSliderEvents = function(){
        var self = this;
        $("#" + this.options.slider_container_id).bind("valuesChanged", function(e, data){
            //The elements in the slider have been changed so... update the model to update the selected elements
            self.modelUpdate(self);
        });
    };

    QDSelectorSliderAndListbox.prototype.initSlider = function(){
        var self = this;

        //Initialize the slider
        if(this.options.slider_properties.slider_type == "data") {
            $("#" + this.options.slider_container_id).dateRangeSlider();
        }
        //Set the properties
        this.setSliderProperties();

        //Set the events
        this.setSliderEvents();

        //This means that the jqxwidget has been initialized
        self.options.controller.options.selector_list_ready_count++;
        self.options.controller.options.selector_list_ready[self.options.id]= 1;
    };

    QDSelectorSliderAndListbox.prototype.hideShowElements = function(self, tabclicked){
        if((self.options.buttons!=null)&&(typeof self.options.buttons!="undefined"))
        {
            //If there are buttons... check if some of them have to be hidden
            for(var iButton=0; iButton<self.options.buttons.length; iButton++)
            {
                if(($.inArray(tabclicked, self.options.buttons[iButton].show_in))!=-1)
                {
                    //The button has to be shown
                    $("#" + self.options.buttons[iButton].id).show();
                }
                else
                {
                    $("#" + self.options.buttons[iButton].id).hide();
                }
            }
        }
        if((self.options.checkboxes!=null)&&(typeof self.options.checkboxes!="undefined"))
        {
            //If there are checkboxes... check if some of them have to be hidden
            for(var iCheckbox=0; iCheckbox<self.options.checkboxes.length; iCheckbox++) {
                if(($.inArray(tabclicked, self.options.buttons[iButton].show_in))!=-1)
                {
                    $("#" + self.options.checkboxes[iCheckbox].id).show();
                }
                else {
                    $("#" + self.options.checkboxes[iCheckbox].id).hide();
                }
            }
        }
    }

    //This function is called to create the jqwidget
    QDSelectorSliderAndListbox.prototype.render = function(){
        var self = this;
        //In the initialization phase the slider is the active tab
        this.options.active_tab =0;
        if((this.options.domain!= null)&&(typeof this.options.domain!= "undefined"))
        {
            $('#'+this.options.id).jqxTabs({width:"100%", initTabContent:function (tab) {
                switch (tab) {
                    case 0:
                        //By default the first tab is clicked
                        self.hideShowElements(self, 0);
                        self.initSlider();
                        break;
                    case 1:
                        self.initListBox();
                        break;
                }

                $('#'+self.options.id).on('tabclick', function (event) {
                    self.options.select_all_button_pressed = false;
                    //The active tab stores the selected tab
                    var tabclicked = event.args.item;
                    self.options.active_tab = tabclicked;
                    //Restore the default tab condition
                    self.updateDomain(self.original_properties, self);
                    self.hideShowElements(self, tabclicked);
                });
            }
            });
            if((this.options.title!=null)&&(typeof this.options.title!= "undefined"))
            {
                for(var i=0; i<this.options.title.length;i++)
                {
                    if((this.options.title[i]!= null)&&(typeof this.options.title[i]!= "undefined"))
                    {
                        //Title
                        $('#'+this.options.id).jqxTabs('setTitleAt', i, this.options.title[i].value);
                    }
                }
            }
        }
    };

    //This obj 'properties' is specific for the update of each selector type
    //In this case is used in the checkbox and in the slider
//    var properties = {"bounds" : {min: new Date(start_date_yy, ''+start_date_mm_int, start_date_dd), max: new Date(end_date_yy, ''+end_date_mm_int, end_date_dd)}, "formatter" :function(val){
//        var days = val.getDate(),
//            month = val.getMonth() + 1,
//            year = val.getFullYear();
//        return days + "/" + month + "/" + year;
//    }, "left_label_title": start_date_yy, "right_label_title": end_date_yy};

    //This function is called by the controller to update the domain
    QDSelectorSliderAndListbox.prototype.updateDomain = function(properties, self){
        if((self == null)||(typeof self == 'undefined'))
        {
            //This happen when this function is called by the controller
            self = this;
        }

        if((self.original_properties==null)||(typeof self.original_properties == 'undefined'))
        {
            //Store the original properties... to use them at each tab click
            self.original_properties = properties;
        }
        $('#'+self.options.list_id).jqxListBox({source: self.options.domain});

//        if((self.options.default_selected_items!=null)&&(typeof self.options.default_selected_items!= 'undefined'))
//        {
//            for(var i=0 ; i< self.options.default_selected_items.length; i++)
//            {
//                $('#'+self.options.list_id).jqxListBox('selectIndex', self.options.default_selected_items[i] );
//            }
//        }
        if((this.options.default_selected_items!=null)&&(typeof this.options.default_selected_items!= 'undefined'))
        {
            var properties2 = {};
            properties2.tab_type = 1;
            properties2.values = [];
            for(var i=0 ; i< this.options.default_selected_items.length; i++)
            {
                //$('#'+this.options.list_id).jqxListBox('selectIndex', this.options.default_selected_items[i] );
                properties2.values.push(this.options.default_selected_items[i]);

            }
            if((properties2!=null)&&(typeof properties2!='undefined')&&(properties2.values!=null)&&(typeof properties2.values!='undefined')&&(properties2.values.length>0))
            {
                this.selectItems(properties2);
            }
        }
        //The logic for the object 'properties' for this selector
        if((properties != null)&&(typeof properties!='undefined')) {
            if ((properties.removeFromList != null) && (typeof properties.removeFromList != 'undefined')) {
                //Set this properties in the selector object
                self.options.checkbox_elements_removeFromList = properties.removeFromList;

                self.updateCheckbox_removeFromList(self);
            }
            else {
                self.options.checkbox_elements_removeFromList = [];
            }

            //Setting Slider Properties
            //Bounds
            if(self.options.slider_properties.slider_type == "data") {
                //Setting the domain in the slider
                if ((properties.bounds != null) && (typeof properties.bounds != 'undefined')) {
                    $("#" + self.options.slider_container_id).dateRangeSlider({"bounds": properties.bounds});
                }
                //Formatter
                if ((properties.formatter != null) && (typeof properties.formatter != 'undefined')) {
                    $("#" + self.options.slider_container_id).dateRangeSlider({"formatter": properties.formatter});
                }
            }
            //Slider Left Label(Min Value)
            if ((properties.left_label_title != null) && (typeof properties.left_label_title != 'undefined')) {
                $("#" + self.options.slider_properties.left_label_id).text(properties.left_label_title);
            }
            //Slider Rigth Label(Max Value)
            if ((properties.right_label_title != null) && (typeof properties.right_label_title != 'undefined')) {
                $("#" + self.options.slider_properties.right_label_id).text(properties.right_label_title);
            }

            //Parent Logic
            if((properties.parent != null)&&(typeof properties.parent!='undefined'))
            {
                //Set this properties in the selector object
                this.options.parent = properties.parent;
            }
        }
        self.modelUpdate(self);
    };

    //Properties contains the index of elements to select or the range depending on the properties flag
    QDSelectorSliderAndListbox.prototype.selectItems = function(properties, select_all_button_pressed){
        if(select_all_button_pressed)
        {
            this.options.select_all_button_pressed = true;
        }
        else{
            this.options.select_all_button_pressed = false;
        }
        if((properties!=null)&&(typeof properties!='undefined'))
        {
            if(properties.tab_type == 0)
            {
               //Slider
                //$("#dateSlider").dateRangeSlider("values", new Date(2012, 0, 1), new Date(2012, 0, 31));
                if(this.options.slider_properties.slider_type == "data") {
                    $("#" + this.options.slider_container_id).dateRangeSlider("values", properties.values[0], properties.values[1]);
                }
//                this.modelUpdate(this);
            }
            else if(properties.tab_type == 1)
            {
                //Listbox
                if((properties.values!=null)&&(properties.values!='undefined'))
                {
                    for(var i=0 ; i< properties.values.length; i++)
                    {
                        var items = $('#'+this.options.list_id).jqxListBox('getSelectedItems');
                        if((items!=null)&&(typeof items != 'undefined'))
                        {
                            var j=0;
                            for(j=0; j<items.length; j++)
                            {
                                //console.log("items[j].index= *"+items[j].index+"* properties[i] = *"+properties[i]+"*");
                                if((items[j]!=null)&&(typeof items[j]!='undefined')&&(items[j].index == properties.values[i]))
                                {
                                    break;
                                }
                            }

                            if(j==items.length)
                            {
                                //The element is not selected
                                //So... can be selected
                                $('#'+this.options.list_id).jqxListBox('selectIndex', properties.values[i]);
                            }
                        }
                        else{
                            //So... can be selected
                            $('#'+this.options.list_id).jqxListBox('selectIndex', properties.values[i]);
                        }
                    }
                }
            }
        }
    };

    //Properties contains the index of elements to deselect
    //This function works only for listbox NOT for slider
    QDSelectorSliderAndListbox.prototype.deselectItems = function(properties){

        if((properties!=null)&&(typeof properties!='undefined')) {
            if (properties.tab_type == 1)
            {
                //Listbox
                if((properties.values!=null)&&(properties.values!='undefined'))
                {
                    for(var i=0 ; i< properties.values.length; i++)
                    {
                        var items = $('#' + this.options.list_id).jqxListBox('getSelectedItems');
                        if ((items != null) && (typeof items != 'undefined')) {
                            var j = 0;
                            for (j = 0; j < items.length; j++) {
//                        if(items[j].index ==properties[i])
                                if ((items[j] != null) && (typeof items[j] != 'undefined') && (items[j].index == properties.values[i])) {
                                    break;
                                }
                            }
                            if (j < items.length) {
                                //The element is selected
                                //So... can be unselected
                                $('#' + this.options.list_id).jqxListBox('unselectIndex', properties.values[i]);
                            }
                        }
                    }
                }
            }
            //this.modelUpdate(this);
        }
    };

    //This function is only for the list box
    //Properties contains the index of elements to disable
    QDSelectorSliderAndListbox.prototype.disableItems = function(properties){

        if((properties!=null)&&(typeof properties!='undefined'))
        {
            if (properties.tab_type == 1)
            {
                if((properties.values!=null)&&(typeof properties.values!='undefined')) {
                    for (var i = 0; i < properties.values.length; i++) {
                        $('#' + this.options.list_id).jqxListBox('disableAt', properties.values[i]);
                    }
                }
            }
        }
    };

    //This function is only for the list box
    //Properties contains the index of elements to enable
    QDSelectorSliderAndListbox.prototype.enableItems = function(properties){

        if((properties!=null)&&(typeof properties!='undefined'))
        {
            if (properties.tab_type == 1)
            {
                if((properties.values!=null)&&(typeof properties.values!='undefined')) {
                    for (var i = 0; i < properties.values.length; i++) {
                        $('#' + this.options.list_id).jqxListBox('enableAt', properties.values[i]);
                    }
                }
            }
        }
    };

    //Define again the getDomain function
    //This function is used for the listbox
    QDSelectorSliderAndListbox.prototype.getDomain = function(obj){
        if(obj.tab_type == 0)
        {
            //Slider
            //Getting the domain in the slider
            if((this.options.original_properties!=null)&&(typeof this.options.original_properties!='undefined')){
                return this.options.original_properties.bounds;
            }
        }
        else if(obj.tab_type == 1)
        {
            //Listbox
            if(obj.full)
            {
                //Include also the elements from the checkbox
                return this.options.domain.concat(this.options.checkbox_elements_removeFromList);
            }
            else{
                return this.options.domain;
            }
        }
    };

    QDSelectorSliderAndListbox.prototype.getDomainType = function(){

        return this.options.domain_type;
    };

    QDSelectorSliderAndListbox.prototype.setDomainType = function(domain_type){

        this.options.domain_type = domain_type;
    };

    QDSelectorSliderAndListbox.prototype.getLanguage = function(){

        return this.options.language;
    };

    QDSelectorSliderAndListbox.prototype.setLanguage = function(language){

        this.options.language = language;
    };

    return QDSelectorSliderAndListbox;

});