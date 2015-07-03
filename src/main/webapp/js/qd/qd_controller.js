define([
    'jquery',
    'qd_board',
    'qd_selector',
    'qd_catalog_selector',
    'qd_catalog_model',
    'bootstrap'
], function ($, QDBoard, QDSelector, QDCatalogSelector, QDCatalogModel) {

    'use strict';

    var optionsDefault = {
        //Div per il query and download component
//        qd_component_main_div : '#qd_component',
        qd_component_main_div : '',
        //Event Map: event_type-function_name
        qd_component_board_event : {},
        //From the json configuration file
        validate    :   true,
        structure : {
        "layout_type":"grid_policy",
        "layout_config":{"selectors_layout":[
            {"selector_id":"selector_0", "bounding_box":{"row":{"start":"1", "end":"1"}, "col":{"start":"1", "end":"1"}}},
            {"selector_id":"selector_1", "bounding_box":{"row":{"start":"1", "end":"1"}, "col":{"start":"2", "end":"2"}}}
            ]}
        },
        selectors : {
            "selector_list":[{ "id":"selector_0","type":"list1","domain":[{"value":"first","id":"1"}],"default_selected_items":"[1,3,5]", "buttons":[{"type":"select", "title": "Select All" }, {"type":"clear", "title": "Clear" }], "events":[{"type":"click"}]},
                {"id":"selector_2", "type":"list1", "domain":[{"value":"second","id":"2"}], "default_selected_items":"[2,4,6]", "events":[{"type":"click"}]}
            ]
        },

        //Board contains the structure of the layout
        board :'',
        //Model is the model associated with the selectors and that contains the query variables
        model : '',
        //selectors_list contains the list of Selector obj that are shown in the board
        selectors_list : '',

        //The array containing the grid event that are listened by the controller
        generic_component_structure_event : [],

        //This counter is used to know WHEN all the selectors are ready
        //When all the selectors are in the html and have been initialized
        //"selectors_added" event is raised
        selector_list_ready_count : 0,
        //This list could be used to check which selector has not been created
        //but it has not been used yet
        selector_list_ready :[],
        window_info_done : false
    }

    function QD( o ){

        if (this.options === undefined) {this.options = {}; }

        $.extend(true, this.options, optionsDefault, o);

        //crea vero container
        //append dentro qd_component_main_div

        var c = document.createElement('DIV');
        c.className = 'fenix_namespace';
        this.options.container.appendChild(c);
        this.options.qd_component_main_div = c;

    }

    QD.prototype.callbacks = {};

    QD.prototype.validate = function () {
        return this;
    };

    QD.prototype.map_event_creation = function(){
        this.options.generic_component_structure_event["structure_ready"] = "structure_ready";
        this.options.generic_component_structure_event["selectors_added"] = "selectors_added";
    };

    QD.prototype.selectors_initialize = function () {
        var selectors_list = [];
        var list = this.options.selectors.selector_list;
        var list_length = this.options.selectors.selector_list.length;
        this.options.selectors_list = [];
        for(var i=0; i< list_length; i++)
        {
            var selector = this.options.selectors.selector_list[i];
            var selector_obj = new QDSelector();
            $.extend(selector_obj.options, selector);
            this.options.selectors_list[i]= selector_obj;
        }
        this.options.board.draw(this);
    };

    QD.prototype.structure_initialize = function () {
        var board = new QDBoard({layout_type : this.options.structure.layout_type});
        this.options.board = board;
        this.selectors_initialize();
    };

    QD.prototype.model_initialize = function (self) {
        var catalog_model = new QDCatalogModel();
        var model_func = catalog_model.model_look_up(self.options.structure.layout_type);
        self.options.model = new model_func();
    };

    QD.prototype.initEventListeners = function () {
        var self = this;

        //Call the function to initialize the model
        self.model_initialize(self);

        //This callback is called when the grid is ready
        $(this.options.qd_component_main_div).on(self.options.generic_component_structure_event["structure_ready"], function(){
            //Access to the Selector Catalog
            var catalog_selector = new QDCatalogSelector();
            //Loop for each selector red from the configuration file
            for(var iSelector = 0; iSelector<self.options.selectors.selector_list.length; iSelector++){
                //Get the specific selector type function from the selector catalog
                //This is the function associated with the selector type
                var selector_func = catalog_selector.selector_look_up(self.options.selectors.selector_list[iSelector].type);
                //Creating specific selector instance passing the selector configuration
                var customize_selector = new selector_func(self.options.selectors.selector_list[iSelector]);
                var customize_selector_id = self.options.selectors.selector_list[iSelector].id;

                //Adding the selector to the structure (the specific grid)
                self.options.board.options.layout_type_instance.addItem(self, customize_selector_id, customize_selector);
            }

            //Set the selector that have been added to the structure and initialized
            self.options.selector_list_ready_count = 0;
            for(var iSelector = 0; iSelector<self.options.selectors.selector_list.length; iSelector++){
                self.options.selector_list_ready[self.options.selectors.selector_list[iSelector].id] = 0;
            }

            //Call the render for each selector
            for(var iSelector = 0; iSelector<self.options.selectors.selector_list.length; iSelector++){

                //Creating specific selector instance passing the selector id
                var customize_selector = self.getSelector(self.options.selectors.selector_list[iSelector].id);
                customize_selector.render();
            }

            //All the selectors have been inserted in the board and the jqwidget are ready and without source... raise the event
            while(self.options.selector_list_ready_count<self.options.selectors.selector_list.length){
                console.log("Waiting...");
            }

            //Set AGAIN the selector that have been added to the structure and initialized
            //BECAUSE the render phase has changed the values(Data Binding Event)
            self.options.selector_list_ready_count = 0;
            for(var iSelector = 0; iSelector<self.options.selectors.selector_list.length; iSelector++){
                self.options.selector_list_ready[self.options.selectors.selector_list[iSelector].id] = 0;
            }

//            //Call the function to initialize the model
//            self.model_initialize(self);

            //All the selectors are in the html and have been initialized
            $(self.options.qd_component_main_div).trigger(self.options.generic_component_structure_event["selectors_added"]);
        });
    };

    //This function updates the model associated with the specific selector
    //properties is specific for the specific selector
    //For example it can contain the 'menu item id' in the 'dropdown menu button'
    QD.prototype.modelUpdate = function (selector_instance, new_selection, properties) {

        //alert("In modelUpdate")
        //console.log(selector_instance.options.id)
        if((selector_instance!=null)&&(typeof selector_instance!="undefined"))
        {
            this.options.model.update(selector_instance, new_selection, properties);
        }
    };

    QD.prototype.initialize = function (options, obj) {

        //The object will be used to set properties, that could be useful for other use cases
        $.extend(this.options, options);

        if (this.options.validate) {
            this.validate();
        }

        this.map_event_creation();

        this.structure_initialize();

        this.initEventListeners();

        return this;
    };

    //The properties object is used in the selector update domain function for specific field
    QD.prototype.update_selector_domain = function (selector_id, selector_domain, properties) {

        var selector_instance = this.getSelector(selector_id);
        selector_instance.setDomain(selector_domain);
        selector_instance.updateDomain(properties);
    };

    //The properties object is used in the selector update selection function for specific field
    //select_deselect= boolean to select or deselect items
    QD.prototype.update_selector_selection = function (selector_id, properties, select_deselect) {
        var selector_instance = this.getSelector(selector_id);
        if(select_deselect)
        {
            selector_instance.selectItems(properties);
        }
        else{
            //Now this is available only for listbox selector
            selector_instance.deselectItems(properties);
        }
    };

    //This function has to be used only by query and download component
    //and not by the host that uses this component
    QD.prototype.getSelector = function (selector_id) {
        return this.options.board.keep_track_get_item(selector_id);
    };

    QD.prototype.getSelector_domainType = function (selector_id) {

        var selector_instance = this.getSelector(selector_id);
        return selector_instance.getDomainType(selector_instance);
    };

    //obj is used to pass specific properties
    QD.prototype.getSelector_domain = function (selector_id, obj) {

        var selector_instance = this.getSelector(selector_id);
        return selector_instance.getDomain(obj);
    };

    QD.prototype.getSelector_language = function (selector_id) {

        var selector_instance = this.getSelector(selector_id);
        return selector_instance.getLanguage(selector_instance);
    };

    QD.prototype.getSelectedItems = function (id) {
        return this.options.model.getSelectedItems(this.getSelector(id));
    };

    //Now this is available only for listbox selector
    QD.prototype.disableItems = function (selector_id, properties) {
        var selector_instance = this.getSelector(selector_id);
        selector_instance.disableItems(properties);
    };

    //Now this is available only for listbox selector
    QD.prototype.enableItems = function (selector_id, properties) {
        var selector_instance = this.getSelector(selector_id);
        selector_instance.enableItems(properties);
    };

    return QD;

});