define([
    'jquery',
    'qd_selector',
    'qd_utils',
    'jqwidget',
    'bootstrap'
], function($, QDSelector, QDUtils) {

//    Configuration Example:
//    {
//        "id":"fx_selector_3",
//        "type":"listbox",
//        "domain_type" : "PolicyType",
//        "list_id":"fx_selector_3_listbox",
//        "language"  :   "EN",
//        "title" :   {"value":"Policy Type"},
//        "domain":[{"value":"fouth","id":"4"}],
//        "default_selected_items":[4,6,8],
//        "buttons":[{"type":"select", "id": "fx_selector_3_button_select", "title": "Select All", "color": "red", "tooltip": "Button Select Tooltip"}, {"type":"clear", "id": "fx_selector_3_button_clear", "title": "Clear Selection", "color": "blue", "tooltip": "Button Clear Selection Tooltip"}]
//    }

    var optionsDefault = {
        domain_type : '',
        language : '',
        //This is used in this selector type to indicate the id of the list that belong to this selector
        list_id :   '',
        //This is used to insert or remove the elements from the listbox....
        //managed by the checkbox
        //[{'label': '', 'code': ''}]
        checkbox_elements_removeFromList : '',
        //This boolean indicates if the checkbox removeFromList is checked or not
        checkbox_status_removeFromList : false,
        //The obj containing the parent for each element in the checkbox_elements_removeFromList
        //It's not mandatory
        //e.g. var parent = {'8':[1,3],'9':[2,3],'10':[3,4],'11':[1,2,3],'12':[1,2]};
        parent : '',
        columns : '',
        //This is a boolean that store if Select All Button has be pressed
        //By default is false so that if the component has not to include the Select All Button
        //it remains false
        //It is used by the checkbox of type removeFromList
        // (if Select All is pressed insert the elements in the list box like selected)
        select_all_button_pressed : false,
        multipleextended : true,
        style :{"heigth":250}
    }

    function QDSelectorGrid( o )
    {
        QDSelector.call(this);

        //Overwrite the options
        if (this.options === undefined) {
            this.options = {};
        }

        $.extend(true, this.options, optionsDefault, o);
    };

    QDSelectorGrid.inherits(QDSelector);

    QDSelectorGrid.prototype.getSelectedRows = function() {
        var selectedRow = $('#' + this.options.list_id).jqxGrid('getselectedrowindex');
        return selectedRow;
    }

    QDSelectorGrid.prototype.modelUpdate = function(self, changed_item){
        //var items = $('#'+self.options.list_id).jqxListBox('getSelectedItems');
        //var items = $('#'+self.options.list_id).jqxGrid('getselectedrowindex');
        //console.log(self.getSelectedRows())

        var datarecord = '';
        if((changed_item!=null)&&(typeof changed_item!="undefined")){
            datarecord = $('#'+self.options.list_id).jqxGrid('getrowdata', changed_item.rowindex);
            //var selectedRow = $('#fx_selector_5_b_listbox').jqxGrid('getselectedrowindex');
            //console.log("2 selectedRow id = "+self.options.list_id)
            //console.log("2 selectedRow = "+selectedRow)
            //debugger;
        }
        var selectedRow = $('#'+self.options.list_id).jqxGrid('getselectedrowindex');
        //var selectedRow = $('#fx_selector_5_b_listbox').jqxGrid('getselectedrowindex');
        //console.log("selectedRow id = "+self.options.list_id)
        //console.log("selectedRow = "+selectedRow)

        var properties = {};
        //console.log("changed_item")
        //console.log(changed_item)
        //console.log("datarecord")
        //console.log(datarecord)
        //properties.changed_item= changed_item;
        properties.changed_item= datarecord;
        //Call the controller to update the model for this component
        //self.options.controller.modelUpdate(self, items, properties);
        //console.log("modelUpdate GRID start")
        //console.log(changed_item)
        //console.log(properties)
        if((changed_item!=null)&&(typeof changed_item!='undefined')){
            changed_item.selectedRowIndex = selectedRow;
            //changed_item.selectedRowIndex = changed_item.rowindex;
            if((datarecord!=null)&&(typeof datarecord!='undefined')){
                changed_item.changed_item= datarecord;
            }
        }
        //console.log("modelUpdate GRID end")
        //console.log(changed_item)
        //console.log(properties)
        self.options.controller.modelUpdate(self, changed_item, properties);
    };

    QDSelectorGrid.prototype.buttonGetClassByColor = function(color){
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

    QDSelectorGrid.prototype.buttonPropertiesSetting = function(iButton){
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

    QDSelectorGrid.prototype.buttonEventsSetting = function(iButton){
        var self= this;
        $('#'+self.options.buttons[iButton].id).click(function(e){
            switch(self.options.buttons[iButton].type)
            {
                //Button Select All
                case 'select':
                    //This variable is used in the checkbox
                    self.options.select_all_button_pressed = true;
                    //Deselect All
                    var source_domain = self.getDomain(true);
                    if ((source_domain != null) && (typeof source_domain != 'undefined')) {
                        source_domain = source_domain.localdata;
                        var properties = [];
                        //console.log("source_domain")
                        //console.log(source_domain)
                        if ((source_domain != null) && (typeof source_domain != 'undefined')) {

                            for (var i = 0; i < source_domain.length; i++) {
                                properties[i] = ""+i;
                            }
                            self.deselectItems(properties);
                        }
                    }
                    //console.log("properties")
                    //console.log(properties)

                    //Select again
                    var selectAll= true;
                    self.selectItems(properties, selectAll);
                    var items = $('#'+self.options.list_id).jqxListBox('getItems');
                    break;
                case 'clear'://Button Clear Selection
                    //This variable is used in the checkbox
                    self.options.select_all_button_pressed = false;
                    //Deselect All
                    console.log(self)
                    var buttonUpdateObj = {};
                    if((self.options.buttons!=null)&&(typeof self.options.buttons!='undefined')){
                        for(var i=0; i< self.options.buttons.length; i++){
                            if(self.options.buttons[i].type == 'clear'){
                                buttonUpdateObj.options = {};
                                buttonUpdateObj.options.id = self.options.buttons[i].id;
                                buttonUpdateObj.options.list_id = self.options.list_id;
                                buttonUpdateObj.options.controller = self.options.controller;
                                //console.log("Clear")
                                //console.log(buttonUpdateObj)
                                //alert("Before modelUpdate 1")
                                self.modelUpdate(buttonUpdateObj);
                                break;
                            }
                        }
                    }
                    //selector_instance.options.id
                    var source_domain = self.getDomain(true);
                    //console.log(source_domain)
                    if ((source_domain != null) && (typeof source_domain != 'undefined')) {
                        source_domain = source_domain.localdata;
                        var properties = [];
                        if ((source_domain != null) && (typeof source_domain != 'undefined')) {

                            for (var i = 0; i < source_domain.length; i++) {
                                properties[i] = ""+i;
                            }
                            //console.log("Before deselect Item")
                            //console.log(source_domain)
                            self.deselectItems(properties);
                        }
                    }
                    break;
                default :
                    break;
            }
        });
    };

    QDSelectorGrid.prototype.createButtons = function(){
        if((this.options.buttons!=null)&&(typeof this.options.buttons!="undefined"))
        {
            for(var iButton=0; iButton<this.options.buttons.length; iButton++)
            {
                this.buttonPropertiesSetting(iButton);

                if((this.options.buttons[iButton].type!= null)&&(typeof this.options.buttons[iButton].type != 'undefined'))
                {
                    this.buttonEventsSetting(iButton);
                }

                //alert("Button info ")
                //console.log(this.options.buttons[iButton]);
                //console.log(this.options.buttons[iButton].show);
                if((this.options.buttons[iButton].show!=null)&&(typeof this.options.buttons[iButton].show!="undefined")){
                    if(this.options.buttons[iButton].show==false){
                        $('#'+this.options.buttons[iButton].id).hide();
                    }
                    else{
                        $('#'+this.options.buttons[iButton].id).show();
                    }
                }
            }
        }
    };

    //div= the div of the element that has to contains the tooltip
    //element_type = e.g. buttons, checkbox
    //element_index = the index of the element in the array (contained in the configuration file) of the elements of these element_types
    QDSelectorGrid.prototype.createTooltips = function(div, element_type, element_index){

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

    QDSelectorGrid.prototype.changeListBox = function(){
        var self= this;
//        $('#'+self.options.list_id).on('change', function (event) {
//            console.log("ON CHANGE!!!!!!!!!!!!!!!!!");
//            console.log(event);
//            self.modelUpdate(self, event.args.item);
//        });

        //$("#jqxgrid").bind('rowselect', function (event) {
        //    var selectedRowIndex = event.args.rowindex;
        //});
        //$("#jqxgrid").bind('rowunselect', function (event) {
        //    var unselectedRowIndex = event.args.rowindex;
        //});

        //$('#'+self.options.list_id).on('rowselect', function (event)
        $('#'+self.options.list_id).bind('rowselect', function (event)
        {
            //console.log("ROWSELECT ")
            //console.log(event.args);
            // event arguments.
            var args = event.args;
            // row's bound index.
            var rowBoundIndex = args.rowindex;
            // row's data. The row's data object or null(when all rows are being selected or unselected with a single action). If you have a datafield called "firstName", to access the row's firstName, use var firstName = rowData.firstName;
            //var rowData = args.row;
            var obj = {};
            obj.event_type = 'select';
            obj.rowindex = event.args.rowindex;
            //self.modelUpdate(self, event.args.rowindex);
            self.modelUpdate(self, obj);
        });

        //$('#'+self.options.list_id).on('rowunselect', function (event)
        //$('#'+self.options.list_id).bind('rowunselect', function (event)
        //{
        //    console.log("ROWUNSELECT ")
        //    console.log(event)
        //    //console.log(event.args);
        //    // event arguments.
        //    var args = event.args;
        //    // row's bound index.
        //    var rowBoundIndex = args.rowindex;
        //    console.log("rowBoundIndex=  "+rowBoundIndex)
        //    // row's data. The row's data object or null(when all rows are being selected or unselected with a single action). If you have a datafield called "firstName", to access the row's firstName, use var firstName = rowData.firstName;
        //    //var rowData = args.row;
        //    var obj = {};
        //    obj.event_type = 'unselect';
        //    obj.rowindex = event.args.rowindex;
        //    //self.modelUpdate(self, event.args.rowindex);
        //    self.modelUpdate(self, obj);
        //});
    };

    QDSelectorGrid.prototype.initGrid = function(){
        var self = this;

        //$('#'+this.options.list_id).on('bindingComplete', function (event) {
        //    //This means that the jqxwidget has been initialized
        //    self.options.controller.options.selector_list_ready_count++;
        //    self.options.controller.options.selector_list_ready[self.options.id]= 1;
        //});


        //data.push({'selected': true, 'commodity': source[0].label, 'originalHsCode': 'origHScode1', 'originalHsVersion': 'origHSVersion1', 'originalHsSuffix': 'origHSsuffix1'},
        //    {'selected': false, 'commodity': 'comm2', 'originalHsCode': 'origHScode2', 'originalHsVersion': 'origHSVersion2', 'originalHsSuffix': 'origHSsuffix2'},
        //    {'selected': false, 'commodity': 'comm3', 'originalHsCode': 'origHScode3', 'originalHsVersion': 'origHSVersion3', 'originalHsSuffix': 'origHSsuffix3'});

        // initialize jqxGrid
        $("#"+this.options.list_id).jqxGrid(
            {
                //height: 200,
                height: this.options.style.heigth,
                width: '100%',
                //source: dataAdapter,
                //editable: true,
                enabletooltips: true,
                showfilterrow: this.options.style.showfilterrow,
                filterable: this.options.style.filterable,
                selectionmode: 'singlerow'
            });

        if((this.options.columns!=null)&&(typeof this.options.columns!="undefined")){
            $("#"+this.options.list_id).jqxGrid('columns',this.options.columns);
        }

        //$("#"+this.options.list_id).bind('rowselect', function (event) {
        //    var row = event.args.rowindex;
        //});

        self.options.controller.options.selector_list_ready_count++;
        self.options.controller.options.selector_list_ready[self.options.id]= 1;



        //$('#'+this.options.list_id).on('bindingComplete', function (event) {
        //    //This means that the jqxwidget has been initialized
        //    self.options.controller.options.selector_list_ready_count++;
        //    self.options.controller.options.selector_list_ready[self.options.id]= 1;
        //});

        //$('#'+this.options.list_id).jqxListBox({width:"99%", height: this.options.style.heigth, multipleextended: this.options.multipleextended});

        //This is not the right event
        this.changeListBox();
        this.createButtons();
        //this.createCheckboxes();
    };

    //This function is called to create the jqwidget
    QDSelectorGrid.prototype.render = function(){
        var self = this;
        if((this.options.domain!= null)&&(typeof this.options.domain!= "undefined"))
        {
            $('#'+this.options.id).jqxTabs({width:"100%", initTabContent:function (tab) {
                switch (tab) {
                    case 0:
                        self.initGrid();
                        break;
                }
            }
            });
            $('#'+this.options.id).jqxTabs('setTitleAt', 0, this.options.title.value);
        }
    };

    //This obj 'properties' is specific for the update of each selector type
    //In this case is used in the checkbox
    QDSelectorGrid.prototype.updateDomain = function(properties){

        var dataAdapter = new $.jqx.dataAdapter(this.options.domain);
        $('#'+this.options.list_id).jqxGrid({source: dataAdapter});
        $('#'+this.options.list_id).jqxGrid('clearselection');

        //Setting the source ... the on change is not called
        this.modelUpdate(this);
        if((this.options.default_selected_items!=null)&&(typeof this.options.default_selected_items!= 'undefined'))
        {
            var properties2 = [];
            for(var i=0 ; i< this.options.default_selected_items.length; i++)
            {
                properties2.push(this.options.default_selected_items[i]);
            }
            if((properties2!=null)&&(typeof properties2!='undefined')&&(properties2.length>0))
            {
                this.selectItems(properties2);
            }
        }
        //The logic for the object 'properties' for this selector
        if((properties != null)&&(typeof properties!='undefined'))
        {}
    };

    //Properties contains the index of elements to select
    QDSelectorGrid.prototype.selectItems = function(properties, select_all_button_pressed){
        if(select_all_button_pressed)
        {
            this.options.select_all_button_pressed = true;
        }
        else{
            this.options.select_all_button_pressed = false;
        }
        if((properties!=null)&&(typeof properties!='undefined'))
        {
            for(var i=0 ; i< properties.length; i++)
            {
                //var items = $('#'+this.options.list_id).jqxListBox('getSelectedItems');
                var items = $('#'+this.options.list_id).jqxGrid('getselectedrowindexes');

                //-1 = no selection
                if((items!=null)&&(typeof items != 'undefined')&&(items != -1))
                {
                    var j=0;
                    for(j=0; j<items.length; j++)
                    {
                        //console.log("items[j].index= *"+items[j].index+"* properties[i] = *"+properties[i]+"*");
                        if((items[j]!=null)&&(typeof items[j]!='undefined')&&(items[j] == properties[i]))
                        {
                            break;
                        }
                    }

                    if(j==items.length)
                    {
                        //The element is not selected
                        //So... can be selected
                        //console.log("Selecting 1 properties[i] "+properties[i] )
                        //$('#'+this.options.list_id).jqxListBox('selectIndex', properties[i]);
                        $('#'+this.options.list_id).jqxGrid('selectrow', properties[i]);
                    }
                }
                else{
                    //So... can be selected
                    //console.log("Selecting 2 properties[i] "+properties[i] )
                    //$('#'+this.options.list_id).jqxListBox('selectIndex', properties[i]);
                    $('#'+this.options.list_id).jqxGrid('selectrow', properties[i]);
                }
            }
            //this.modelUpdate(this);
        }
    };

    //Properties contains the index of elements to deselect
    QDSelectorGrid.prototype.deselectItems = function(properties){

        //console.log("!!!!!!!!!!!!!!deselectItems start")
        //console.log(properties)
        if((properties!=null)&&(typeof properties!='undefined'))
        {
            for(var i=0 ; i< properties.length; i++)
            {
                //var items = $('#'+this.options.list_id).jqxListBox('getSelectedItems');
                var items = $('#'+this.options.list_id).jqxGrid('getselectedrowindexes');
                if((items!=null)&&(typeof items != 'undefined')&&(items != -1))
                {
                    var j=0;
                    for(j=0; j<items.length; j++)
                    {
                        if((items[j]!=null)&&(typeof items[j]!='undefined')&&(items[j] == properties[i]))
                        {
                            break;
                        }
                    }
                    if(j<items.length)
                    {
                        //The element is selected
                        //So... can be unselected
                       // $('#'+this.options.list_id).jqxListBox('unselectIndex', properties[i] );
                        $('#'+this.options.list_id).jqxGrid('unselectrow', properties[i]);
                    }
                }
            }
            //this.modelUpdate(this);
        }
    };

    //Properties contains the index of elements to disable
    QDSelectorGrid.prototype.disableItems = function(properties){

        //if((properties!=null)&&(typeof properties!='undefined'))
        //{
        //    for(var i=0 ; i< properties.length; i++)
        //    {
        //        $('#'+this.options.list_id).jqxListBox('disableAt', properties[i] );
        //    }
        //}
    };

    //Properties contains the index of elements to enable
    QDSelectorGrid.prototype.enableItems = function(properties){

        //if((properties!=null)&&(typeof properties!='undefined'))
        //{
        //    for(var i=0 ; i< properties.length; i++)
        //    {
        //        $('#'+this.options.list_id).jqxListBox('enableAt', properties[i] );
        //    }
        //}
    };

    //Define again the getDomain function
    QDSelectorGrid.prototype.getDomain = function(full){
        return this.options.domain;
    };

    QDSelectorGrid.prototype.getDomainType = function(){

        return this.options.domain_type;
    };

    QDSelectorGrid.prototype.setDomainType = function(domain_type){

        this.options.domain_type = domain_type;
    };

    QDSelectorGrid.prototype.getLanguage = function(){

        return this.options.language;
    };

    QDSelectorGrid.prototype.setLanguage = function(language){

        this.options.language = language;
    };


    //QDSelectorGrid.prototype.createSharedGroupPopup = function(qd_instance, self, selecteditem_country, selecteditem_commodityClass){
    //    $("#singleCommodityContent").hide();
    //    $("#sharedGroupContent").show();
    //
    //    var selecteditem_commodityClass_found = false;
    //    var selecteditem_commodityClass_label = '';
    //    var selecteditem_commodityClass_code = '';
    //
    //    if((selecteditem_commodityClass!=null)&&(typeof selecteditem_commodityClass!="undefined")&&(selecteditem_commodityClass.length>0)){
    //        if((selecteditem_commodityClass[0].originalItem!=null)&&(typeof selecteditem_commodityClass[0].originalItem!="undefined")){
    //
    //            if((selecteditem_commodityClass[0].originalItem.code!=null)&&(typeof selecteditem_commodityClass[0].originalItem.code!="undefined")){
    //                selecteditem_commodityClass_found = true;
    //                selecteditem_commodityClass_label = selecteditem_commodityClass[0].originalItem.label;
    //                selecteditem_commodityClass_code = selecteditem_commodityClass[0].originalItem.code;
    //            }
    //        }
    //    }
    //
    //    var commodityClassListContent = ap_util_variables.CONFIG.commodityClassChildren[selecteditem_commodityClass_code];
    //    if((commodityClassListContent!= null)&&(typeof commodityClassListContent!="undefined")){
    //        var commodityClassParentLabel = '';
    //        for(var j=0; j<ap_util_variables.CONFIG.commodityClassParent.length; j++){
    //            var commodityClassCode = ap_util_variables.CONFIG.commodityClassParent[j][selecteditem_commodityClass_code];
    //            if((commodityClassCode!=null)&&(typeof commodityClassCode!= "undefined"))
    //            {
    //                commodityClassParentLabel = commodityClassCode;
    //                break;
    //            }
    //        }
    //        var data = new Array();
    //        data[0] = commodityClassParentLabel;
    //        var j=1;
    //        for(var i=0; i< commodityClassListContent.length; i++){
    //            data[j] = commodityClassListContent[i];
    //            j++;
    //        }
    //        var source = {
    //            localdata: data,
    //            datatype: "array"
    //        }
    //        var dataAdapter = new $.jqx.dataAdapter(source);
    //
    //        $("#sharedGroupCommodityClass_input").jqxComboBox({source: dataAdapter, displayMember: "label", valueMember: "code"});
    //        $("#sharedGroupCommodityClass_input").jqxComboBox('selectIndex',0);
    //        $("#sharedGroupCommodityClass_row").show();
    //    }
    //    else{
    //        $("#sharedGroupCommodityClass_row").hide();
    //    }
    //
    //    var source = [];
    //
    //    //ap_util_variables.CONFIG.domestic_policyDomain_code
    //
    //    //Commodity Class
    //    var selecteditem_commodityClass = qd_instance.getSelectedItems(self.options.fx_selector_5);
    //    var selecteditem_commodityDomain = qd_instance.getSelectedItems(self.options.fx_selector_1);
    //    var selecteditem_policyDomain = qd_instance.getSelectedItems(self.options.fx_selector_2);
    //
    //    var commodityDomaincCode = selecteditem_commodityDomain.code;
    //    var policyDomaincCode = selecteditem_policyDomain.code;
    //    if (selecteditem_commodityDomain.code == self.options.commodity_domain_both_code) {
    //        //Both
    //        commodityDomaincCode = self.options.commodity_domain_both;
    //    }
    //    if (selecteditem_policyDomain.code == self.options.policy_domain_both_code) {
    //        //Both
    //        policyDomaincCode = self.options.policy_domain_both;
    //    }
    //    //var obj_code = selecteditem_commodityClass[0].originalItem.code;
    //    var commodityClassCode = selecteditem_commodityClass[0].originalItem.code;
    //    var selecteditem_country = qd_instance.getSelectedItems(self.options.fx_selector_6);
    //    var obj_code_country = selecteditem_country[0].originalItem.code;
    //    //var rest_url = {'rest_url_type':self.options.commodityByClass_url, 'rest_url_datasource' : self.options.datasource};
    //    var rest_url = {'rest_url_type':self.options.commodity_url, 'rest_url_datasource' : self.options.datasource};
    //    //var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/' + obj_code_country+ '/' + obj_code;
    //    var url = 'http://' + self.options.base_ip_address + ':' + self.options.base_ip_port + rest_url.rest_url_type + '/' + rest_url.rest_url_datasource + '/' + commodityDomaincCode + '/' + policyDomaincCode + '/' + commodityClassCode+ '/' +obj_code_country;
    //    $.ajax({
    //        type: 'GET',
    //        url:  url,
    //        dataType: 'json',
    //
    //        success: function (response) {
    //            /* Convert the response in an object, if needed. */
    //            var json = response;
    //            if (typeof(response) == 'string')
    //                json = $.parseJSON(response);
    //            //To order the json elements based on the title(label)
    //            if((json!=null)&&(typeof json!="undefined")&&(json.length>0))
    //            {
    //                for (var i = 0; i < json.length; i++) {
    //
    //                    var commodityId = '';
    //                    var hsCode = '';
    //                    var hsVersion = '';
    //                    var hsSuffix = '';
    //                    var shortDescription = '';
    //                    var longDescription = '';
    //                    var app = '';
    //                    //commodity_id, country_name, hs_code, hs_suffix, hs_version, target_code, description, short_description, commodityclass_code, commodityclass_name, shared_group_code
    //
    //                    if((json[i][0]!=null)&&(typeof json[i][0]!= "undefined")&&(json[i][0].length>0)){
    //                        commodityId = json[i][0];
    //                        if(commodityId==self.options.none){
    //                            commodityId = self.options.na;
    //                        }
    //                    }
    //
    //                    if((json[i][2]!=null)&&(typeof json[i][2]!= "undefined")&&(json[i][2].length>0)){
    //                        hsCode = json[i][2];
    //
    //                        var space = "";
    //                        if(hsCode.length<8)
    //                        {
    //                            var diff = 8-(hsCode.length);
    //                            if(diff==2)
    //                                space = "  ";
    //                            if(diff==4)
    //                                space = "    ";
    //                        }
    //                        app += hsCode+space;
    //                    }
    //
    //                    if((json[i][3]!=null)&&(typeof json[i][3]!= "undefined")&&(json[i][3].length>0)){
    //                        hsSuffix = json[i][3];
    //                    }
    //
    //                    if((json[i][4]!=null)&&(typeof json[i][4]!= "undefined")&&(json[i][4].length>0)){
    //                        hsVersion = json[i][4];
    //                        if(hsVersion==self.options.none){
    //                            hsVersion = self.options.na;
    //                        }
    //                        app += "["+hsVersion+"]";
    //                    }
    //
    //                    if((json[i][5]!=null)&&(typeof json[i][5]!= "undefined")&&(json[i][5].length>0)){
    //                        longDescription = json[i][5];
    //                    }
    //
    //                    if((json[i][6]!=null)&&(typeof json[i][6]!= "undefined")&&(json[i][6].length>0)){
    //                        shortDescription = json[i][6];
    //                        app += shortDescription;
    //                    }
    //                    var type = 'addCommodityPopup';
    //                    var value = ""+type + "_COMMODITYID:"+commodityId+"_HSCODE:"+hsCode+"_HSSUFFIX:"+hsSuffix+"_HSVERSION:"+hsVersion+"_DESCRIPTION:"+longDescription+"_SHORTDESCRIP:"+shortDescription;
    //                    //var obj = {"value": value, "label": app, "code" : hsCode, "type": type};
    //                    var obj = {"value": value, "label": app, "code" : hsCode, "type": 'addCommodityPopup'};
    //                    source[i] = obj;
    //                }
    //            }
    //            //$("#sharedGroupCommodityList_listbox").jqxListBox({source: source, checkboxes: true, height: 150, width: 500});
    //
    //            //This list is used to retrive all the info related to each commodity listed in the commodity grid
    //            self.options.add_commodity_popup_commodityList_sharedGroup = source;
    //            var data = [];
    //            if((source!=null)&&(typeof source!="undefined")){
    //                for(var iSource= 0; iSource<source.length; iSource++){
    //                    var obj = {};
    //                    obj['selected'] = false;
    //                    obj['commodity'] = source[iSource].label;
    //                    obj['originalHsCode'] = '';
    //                    obj['originalHsVersion'] = '';
    //                    obj['originalHsSuffix'] = '';
    //                    data.push(obj);
    //                }
    //                //data.push({'selected': true, 'commodity': source[0].label, 'originalHsCode': 'origHScode1', 'originalHsVersion': 'origHSVersion1', 'originalHsSuffix': 'origHSsuffix1'},
    //                //    {'selected': false, 'commodity': 'comm2', 'originalHsCode': 'origHScode2', 'originalHsVersion': 'origHSVersion2', 'originalHsSuffix': 'origHSsuffix2'},
    //                //    {'selected': false, 'commodity': 'comm3', 'originalHsCode': 'origHScode3', 'originalHsVersion': 'origHSVersion3', 'originalHsSuffix': 'origHSsuffix3'});
    //                var gridSource =
    //                {
    //                    localdata: data,
    //                    datatype: "array",
    //                    datafields:
    //                        [
    //                            { name: 'selected', type: 'bool' },
    //                            { name: 'commodity', type: 'string' },
    //                            { name: 'originalHsCode', type: 'string' },
    //                            { name: 'originalHsVersion', type: 'string' },
    //                            { name: 'originalHsSuffix', type: 'string' }
    //                        ]
    //                };
    //                var dataAdapter = new $.jqx.dataAdapter(gridSource);
    //                // initialize jqxGrid
    //                $("#sharedGroupCommodityList_grid").jqxGrid(
    //                    {
    //                        height: 200,
    //                        width: '100%',
    //                        source: dataAdapter,
    //                        editable: true,
    //                        enabletooltips: true,
    //                        selectionmode: 'multiplecellsadvanced',
    //                        columns: [
    //                            { text: '', datafield: 'selected', columntype: 'checkbox', width: '5%' },
    //                            { text: 'Commodity', datafield: 'commodity', columntype: 'textbox', width: '35%' , editable: false},
    //                            { text: 'Original Hs Code', datafield: 'originalHsCode', columntype: 'textbox', width: '20%' },
    //                            { text: 'Original Hs Version', datafield: 'originalHsVersion', columntype: 'textbox', width: '20%' },
    //                            { text: 'Original Hs Suffix', datafield: 'originalHsSuffix', columntype: 'textbox', width: '20%' }
    //                        ]
    //                    });
    //            }
    //        },
    //
    //        error: function (err, b, c) {
    //            alert(err.status + ", " + b + ", " + c);
    //        }
    //    });
    //};

    return QDSelectorGrid;

});