define(['jquery', 'underscore', 'qd_controller'],

    function($, _, QDController){

        var optionsDefault = {
            layout_type :'grid_policy',
            layout_type_constant :['grid_policy', 'grid_data_entry_create_policy'],
            //This is the specific instance of the query and download structure
            layout_type_instance : '',

            //This map contains the association: selector_id-selector_instance
            //It's used in addItem
            selectors_map : {}
        }

        function QDBoard( o )
        {
            if (this.options === undefined) {
                this.options = {};
            }

            $.extend(true, this.options, optionsDefault, o);
        };

        QDBoard.prototype.setLayoutTypeConstant = function(layout_type_constant){
            this.options.layout_type_constant = layout_type_constant;
        };

        QDBoard.prototype.getLayoutTypeConstant = function(){
            return this.options.layout_type_constant;
        };

        QDBoard.prototype.draw = function(qd_controller_obj){

            if(typeof qd_controller_obj!="undefined")
            {
                if(typeof this.options.layout_type!="undefined")
                {
                    var self = this;
                    switch(this.options.layout_type)
                    {
                        //Grid Layout
                        case this.options.layout_type_constant[0]:

                            require(['board_catalog/qd_board_grid_policy'], function(QDGridPolicy) {
                                //console.log(this.options.layout_type)
                                //Parameters: 1-Grid Configuration
                                //2-Selectors List
                                var policy_grid = new QDGridPolicy({'layout_configuration' : qd_controller_obj.options.structure.layout_config, 'generic_component_main_div': qd_controller_obj.options.qd_component_main_div});
                                self.options.layout_type_instance = policy_grid;
                                policy_grid.initialize();
                            });
                            break;
                        //Data Entry Create Policy Layout
                        case this.options.layout_type_constant[1]:

                            require(['board_catalog/qd_board_grid_data_entry_create_policy'], function(QDGridPolicy) {

                                //Parameters: 1-Grid Configuration
                                //2-Selectors List
                                var policy_grid = new QDGridPolicy({'layout_configuration' : qd_controller_obj.options.structure.layout_config, 'generic_component_main_div': qd_controller_obj.options.qd_component_main_div});
                                self.options.layout_type_instance = policy_grid;
                                policy_grid.initialize();
                            });
                            break;
                        default: break;
                    }
                }
            }
        };

        //This function is called when the selector is inserted in the interface
        //It adds an item in the selectors map
        QDBoard.prototype.keep_track_add_item = function(selector_id, selector_instance){
            //Keep track in the map ... storing selector id and selector instance
            this.options.selectors_map[selector_id] = selector_instance;
        };

        QDBoard.prototype.keep_track_get_item = function(selector_id){
            //Find the selector instance through
            return this.options.selectors_map[selector_id];
        };

        return QDBoard;
});

