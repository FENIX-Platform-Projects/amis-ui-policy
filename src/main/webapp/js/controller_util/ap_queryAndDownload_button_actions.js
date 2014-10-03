define([
    'jquery',
    'pnotify',
    'host_preview',
    'jQAllRangeSliders'
], function($, PNotify, HostPreview) {

    var optionsDefault = {
        host_preview : ''
    }

    //text= Loads dependencies as plain text files.
    function HostButtonActions(o) {
        if (this.options === undefined) {
            this.options = {};
        }
        $.extend(true, this.options, optionsDefault, o);
    }

    HostButtonActions.prototype.preview_action = function(qd_instance, self)
    {
        //This variable has been initialized in the host code
        // this.options.host_preview = new HostPreview();

        //Commodity Domain
        var selecteditems = qd_instance.getSelectedItems(self.options.fx_selector_1);
        var commodity_domain = self.options.host_utility_instance.selected_items_parser(0, selecteditems, '', '', self.options.commodity_domain_both);

        //Policy Domain
        selecteditems = qd_instance.getSelectedItems(self.options.fx_selector_2);
        var policy_domain = self.options.host_utility_instance.selected_items_parser(0, selecteditems, '', '', self.options.policy_domain_both);

        //Policy Type
        selecteditems = qd_instance.getSelectedItems(self.options.fx_selector_3);
        var policy_type = self.options.host_utility_instance.selected_items_parser(1, selecteditems, true);

        //Policy Measure
        selecteditems = qd_instance.getSelectedItems(self.options.fx_selector_4);
        var policy_measure = self.options.host_utility_instance.selected_items_parser(3, selecteditems, false, policy_type);

        //Commodity Class
        selecteditems = qd_instance.getSelectedItems(self.options.fx_selector_5);
        var commodity_class = self.options.host_utility_instance.selected_items_parser(1, selecteditems);

        //Country
        selecteditems = qd_instance.getSelectedItems(self.options.fx_selector_6);
        var country = self.options.host_utility_instance.selected_items_parser(1, selecteditems);

        //Years
        selecteditems = qd_instance.getSelectedItems(self.options.fx_selector_7);
        var year = self.options.host_utility_instance.selected_items_parser(2, selecteditems);

        var stop = false;
        if((commodity_domain==null)||(typeof commodity_domain=='undefined')||(commodity_domain.length==0)||(policy_domain==null)||(typeof policy_domain=='undefined')||(policy_domain.length==0)||(policy_type==null)||(policy_type=='undefined')||(policy_type.length==0)||(commodity_class==null)||(typeof commodity_class=='undefined')||(commodity_class.length==0)||(country==null)||(typeof country=='undefined')||(country.length==0)||(year==null)||(typeof year=='undefined')||(year.length==0))
        {
            new PNotify({
                title: 'Error',
                text: 'Please select at least one Policy Type, Policy Measure, Commodity Class, Country and specific Year.',
                //hide: false,
                type: 'error',
                delay: 5000,
                buttons: {
                    closer: true,
                    closer_hover: false,
                    sticker_hover: false
                }
            });
            stop = true;
        }
        if(!stop)
        {
            //Check the policy measure map
            var iMeasureMap =0;
            for(iMeasureMap=0; iMeasureMap<policy_measure.length; iMeasureMap++)
            {
                if((policy_measure[iMeasureMap]!=null)&&(typeof policy_measure[iMeasureMap]!='undefined')&&(policy_measure[iMeasureMap].length>0))
                {
                    break;
                }
            }
            if(iMeasureMap==policy_measure.length)
            {
                //The map is empty
                new PNotify({
                    title: 'Error',
                    text: 'Please select at least one Policy Type, Policy Measure, Commodity Class, Country and specific Year. Or check if the selected Policy Measures belong to the selected Policy Types.',
                    //hide: false,
                    type: 'error',
                    delay: 5000,
                    buttons: {
                        closer: true,
                        closer_hover: false,
                        sticker_hover: false
                    }
                });
                stop = true;
            }
        }
        console.log("Result Start");
        console.log("commodity_domain = "+commodity_domain);
        console.log("policy_domain = "+policy_domain);
        console.log("policy_type = "+policy_type);
        if((policy_type!=null)&&(policy_type!='undefined'))
        {
            for(var i=0; i< policy_type.length; i++)
            {
                console.log("Policy_type: "+policy_type[i]);
                //console.log("Policy_Measure: "+policy_measure[policy_type[i]]);
                console.log("Policy_Measure: "+policy_measure[i]);
            }
        }
        //console.log("policy_measure = "+policy_measure);
        console.log("commodity_class = "+commodity_class);
        console.log("country = "+country);
        console.log("years = "+year);
        console.log("Result End");

        if(!stop)
        {
            var data = self.options.host_policy_data_object.voObjectConstruction();
            data.datasource = self.options.datasource;
            data.policy_domain_code = policy_domain;
            data.commodity_domain_code = commodity_domain;
            data.commodity_class_code = commodity_class;
            data.policy_type_code = policy_type;
            data.policy_measure_code = policy_measure;
            data.country_code = country;
            //it could be 'slider' or 'classic'
            if((selecteditems.min != null)&&(typeof selecteditems.min != 'undefined')&&(selecteditems.max != null)&&(typeof selecteditems.max != 'undefined'))
            {
                data.yearTab = self.options.slider;
                data.start_date = year[0];
                data.end_date = year[1];
            }
            else{
                data.yearTab = self.options.classic;
                data.year_list = year;
            }
            /* Retrive UI structure from DB. */
            console.log("Before all data");
            console.log("data.datasource "+data.datasource);
            console.log("data.policy_domain_code "+data.policy_domain_code);
            console.log("data.commodity_domain_code "+data.commodity_domain_code);
            console.log("data.commodity_class_code "+data.commodity_class_code);
            console.log("data.policy_type_code "+data.policy_type_code);
            console.log("data.policy_measure_code "+data.policy_measure_code);
            console.log("data.country_code "+data.country_code);
            console.log("data.yearTab "+data.yearTab);
            console.log("data.year_list "+data.year_list);
            console.log("data.start_date "+data.start_date);
            console.log("data.end_date "+data.end_date);
            this.options.host_preview.preview_render(data, self);
        }
    }

    HostButtonActions.prototype.download_action = function(qd_instance, self, export_type)
    {
        //Commodity Domain
        var selecteditems = qd_instance.getSelectedItems(self.options.fx_selector_1);
        var commodity_domain = self.options.host_utility_instance.selected_items_parser(0, selecteditems, '', '', self.options.commodity_domain_both);

        //Policy Domain
        selecteditems = qd_instance.getSelectedItems(self.options.fx_selector_2);
        var policy_domain = self.options.host_utility_instance.selected_items_parser(0, selecteditems, '', '', self.options.policy_domain_both);

        //Policy Type
        selecteditems = qd_instance.getSelectedItems(self.options.fx_selector_3);
        var policy_type = self.options.host_utility_instance.selected_items_parser(1, selecteditems, true);

        //Policy Measure
        selecteditems = qd_instance.getSelectedItems(self.options.fx_selector_4);
        var policy_measure = self.options.host_utility_instance.selected_items_parser(3, selecteditems, false, policy_type);

        //Commodity Class
        selecteditems = qd_instance.getSelectedItems(self.options.fx_selector_5);
        var commodity_class = self.options.host_utility_instance.selected_items_parser(1, selecteditems);

        //Country
        selecteditems = qd_instance.getSelectedItems(self.options.fx_selector_6);
        var country = self.options.host_utility_instance.selected_items_parser(1, selecteditems);

        //Years
        selecteditems = qd_instance.getSelectedItems(self.options.fx_selector_7);
        var year = self.options.host_utility_instance.selected_items_parser(2, selecteditems);

        var stop = false;
        if((commodity_domain==null)||(typeof commodity_domain=='undefined')||(commodity_domain.length==0)||(policy_domain==null)||(typeof policy_domain=='undefined')||(policy_domain.length==0)||(policy_type==null)||(policy_type=='undefined')||(policy_type.length==0)||(commodity_class==null)||(typeof commodity_class=='undefined')||(commodity_class.length==0)||(country==null)||(typeof country=='undefined')||(country.length==0)||(year==null)||(typeof year=='undefined')||(year.length==0))
        {
            new PNotify({
                title: 'Error',
                text: 'Please select at least one Policy Type, Policy Measure, Commodity Class, Country and specific Year.',
                //hide: false,
                type: 'error',
                delay: 5000,
                buttons: {
                    closer: true,
                    closer_hover: false,
                    sticker_hover: false
                }
            });

            stop = true;
        }
        if(!stop)
        {
            //Check the policy measure map
            var iMeasureMap =0;
            for(iMeasureMap=0; iMeasureMap<policy_measure.length; iMeasureMap++)
            {
                if((policy_measure[iMeasureMap]!=null)&&(typeof policy_measure[iMeasureMap]!='undefined')&&(policy_measure[iMeasureMap].length>0))
                {
                    break;
                }
            }
            if(iMeasureMap==policy_measure.length)
            {
                //The map is empty
                new PNotify({
                    title: 'Error',
                    text: 'Please select at least one Policy Type, Policy Measure, Commodity Class, Country and specific Year.',
                    //hide: false,
                    type: 'error',
                    delay: 5000,
                    buttons: {
                        closer: true,
                        closer_hover: false,
                        sticker_hover: false
                    }
                });
                stop = true;
            }
        }

        console.log("Result Start");
        console.log("commodity_domain = "+commodity_domain);
        console.log("policy_domain = "+policy_domain);
        console.log("policy_type = "+policy_type);
        if((policy_type!=null)&&(policy_type!='undefined'))
        {
            for(var i=0; i< policy_type.length; i++)
            {
                console.log("Policy_type: "+policy_type[i]);
                //console.log("Policy_Measure: "+policy_measure[policy_type[i]]);
                console.log("Policy_Measure: "+policy_measure[i]);
            }
        }
        //console.log("policy_measure = "+policy_measure);
        console.log("commodity_class = "+commodity_class);
        console.log("country = "+country);
        console.log("years = "+year);
        console.log("Result End");

        if(!stop)
        {
            var data = self.options.host_policy_data_object.voObjectConstruction();
            data.datasource = self.options.datasource;
            data.policy_domain_code = policy_domain;
            data.commodity_domain_code = commodity_domain;
            data.commodity_class_code = commodity_class;
            data.policy_type_code = policy_type;
            data.policy_measure_code = policy_measure;
            data.country_code = country;
            //it could be 'slider' or 'classic'
            if((selecteditems.min != null)&&(typeof selecteditems.min != 'undefined')&&(selecteditems.max != null)&&(typeof selecteditems.max != 'undefined'))
            {
                data.yearTab = self.options.slider;
                data.start_date = year[0];
                data.end_date = year[1];
            }
            else{
                data.yearTab = self.options.classic;
                data.year_list = year;
            }
            /* Retrive UI structure from DB. */
            console.log("Before all data");
            console.log("data.datasource "+data.datasource);
            console.log("data.policy_domain_code "+data.policy_domain_code);
            console.log("data.commodity_domain_code "+data.commodity_domain_code);
            console.log("data.commodity_class_code "+data.commodity_class_code);
            console.log("data.policy_type_code "+data.policy_type_code);
            console.log("data.policy_measure_code "+data.policy_measure_code);
            console.log("data.country_code "+data.country_code);
            console.log("data.yearTab "+data.yearTab);
            console.log("data.year_list "+data.year_list);
            console.log("data.start_date "+data.start_date);
            console.log("data.end_date "+data.end_date);

            if((export_type!=null)&&(typeof export_type!='undefined'))
            {
                if(export_type== 'AllData')
                {
                    //Policy Data
                    self.options.host_utility_instance.download_export(data, 'AllData');
                }
                else{
                    //Shared Group Data
                    self.options.host_utility_instance.download_export(data, 'ShareGroupData');
                }
            }
        }
    }

    return HostButtonActions;

});
