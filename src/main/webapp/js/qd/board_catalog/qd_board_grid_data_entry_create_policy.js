define(['jquery', 'underscore', 'qd_selector','text!template/board/policy_create.html', 'qd_board'],

    function($, _, QDSelector, Grid, QDBoard){

        /*
         "layout_config":{"selectors_layout":[
         {"selector_id":"selector_1", "bounding_box":{"row":{"start":"1", "end":"1"}, "col":{"start":"1", "end":"1"}}},
         {"selector_id":"selector_2", "bounding_box":{"row":{"start":"1", "end":"1"}, "col":{"start":"2", "end":"2"}}},
         {"selector_id":"selector_3", "bounding_box":{"row":{"start":"2", "end":"2"}, "col":{"start":"1", "end":"2"}}},
         {"selector_id":"selector_4", "bounding_box":{"row":{"start":"3", "end":"3"}, "col":{"start":"1", "end":"1"}}},
         {"selector_id":"selector_5", "bounding_box":{"row":{"start":"3", "end":"3"}, "col":{"start":"2", "end":"2"}}},
         {"selector_id":"selector_6", "bounding_box":{"row":{"start":"4", "end":"4"}, "col":{"start":"1", "end":"2"}}}
         ]}
        */

        var optionsDefault = {
            generic_component_main_div : '',
            //The array containing the grid event that are listened by the controller
            generic_component_structure_event : [],

            layout_configuration : {"selectors_layout":[
                {"selector_id":"selector_1", "bounding_box":{"row":{"start":"1", "end":"1"}, "col":{"start":"1", "end":"1"}}},
                {"selector_id":"selector_2", "bounding_box":{"row":{"start":"1", "end":"1"}, "col":{"start":"2", "end":"2"}}}
            ]},
            selector_grid_obj : {
                id : '',
                row_start : '',
                row_end : '',
                col_start : '',
                col_end : ''
            },
            //This list contains the grid selector obj
            //with structure information
            selectors_grid_list_obj : '',
            //This obj contains the id... Maybe could be removed
            //With this list can be found the generic selector object(Selector.js)
            selectors_generic_list_obj : ''

//            //This map contains the association: selector_id-selector_instance
//            //It's used in addItem,
//            selectors_map : {}
        }

        function QDGridPolicy( o )
        {
            if (this.options === undefined) {
                this.options = {};
            }

            $.extend(true, this.options, optionsDefault, o);
        };

        //selector_config_json_obj is : {"selector_id":"selector_1", "bounding_box":{"row":{"start":"1", "end":"1"}, "col":{"start":"1", "end":"1"}}}
        QDGridPolicy.prototype.selectors_bounding_box_parser = function(selector_config_json_obj, selector_obj_index){
            //For the specific obj list
            this.options.selector_grid_obj = {};
            this.options.selector_grid_obj.id = selector_config_json_obj.selector_id;
            var bounding_box_obj = selector_config_json_obj.bounding_box;
            this.options.selector_grid_obj.row_start = bounding_box_obj.row.start;
            this.options.selector_grid_obj.row_end = bounding_box_obj.row.end;
            this.options.selector_grid_obj.col_start = bounding_box_obj.col.start;
            this.options.selector_grid_obj.col_end = bounding_box_obj.col.end;
            this.options.selectors_grid_list_obj[selector_obj_index]= this.options.selector_grid_obj;
        };

        QDGridPolicy.prototype.configuration_parser = function(){
            if(typeof this.options.layout_configuration!="undefined"){
                var selectors_layout = this.options.layout_configuration.selectors_layout;
                this.options.selectors_generic_list_obj = [];
                this.options.selectors_grid_list_obj = [];
                for(var iSelector=0; iSelector<selectors_layout.length; iSelector++)
                {
                   //For the generic obj list
                   var selector = new QDSelector();
                   selector.setId(selectors_layout[iSelector].selector_id);
                   this.options.selectors_generic_list_obj.push(selector);
                   this.selectors_bounding_box_parser(selectors_layout[iSelector], iSelector);
                }

                //Draw the structure with the selectors
                this.draw();
            }
        };

        QDGridPolicy.prototype.map_event_creation = function(){
            this.options.generic_component_structure_event["structure_ready"] = "structure_ready";
        };

        QDGridPolicy.prototype.initialize = function(){
            this.map_event_creation();

            this.configuration_parser();

            //The structure is ready
            $(this.options.generic_component_main_div).trigger(this.options.generic_component_structure_event["structure_ready"]);
        };

        QDGridPolicy.prototype.addItem = function(qd_controller_instance, selector_id, selector_instance){
            //Keep track in the map ... storing selector id and selector instance
            qd_controller_instance.options.board.keep_track_add_item(selector_id, selector_instance);
            //Store the controller instance in each selector... so that the selector can call directly the controller to change the model associated with the selector
            selector_instance.setControllerInstance(qd_controller_instance);
        }

        //Draw the structure
        QDGridPolicy.prototype.draw = function(){
            $(this.options.generic_component_main_div).html(Grid);
        };

        QDGridPolicy.prototype.getSelector_obj = function(selector_list_index)
        {
            return this.options.selectors_generic_list_obj[selector_list_index];
        }

        QDGridPolicy.prototype.getSelector_id = function(selector_list_index)
        {
            return this.options.selectors_generic_list_obj[selector_list_index].id;
        }

        return QDGridPolicy;

    });

