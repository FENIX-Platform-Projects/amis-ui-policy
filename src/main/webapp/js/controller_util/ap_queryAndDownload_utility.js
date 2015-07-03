define([
    'jquery',
    'jQAllRangeSliders',
    'xDomainRequest'
], function($) {

    var optionsDefault = {
        fieldsToHide : ''
    }

    //text= Loads dependencies as plain text files.
    function HostUtility(o) {
        if (this.options === undefined) {
            this.options = {};
        }
        $.extend(true, this.options, optionsDefault, o);
    }

    //policy_types is an array that contains the codes of the policy types...
    //it is used to get the policy measure
    HostUtility.prototype.selected_items_parser = function(q_d, type, selecteditems, policy_type_flag, policy_types, prop){

        var selected_items_string = '';
        var selected_items_array = [];
        //  {"value": ""+self.options.domain_type +"_"+self.options.elements[element_index].code, "label":self.options.elements[element_index].label, "code":self.options.elements[element_index].code};

        if((type!=null)&&(typeof type!='undefined')&&(selecteditems!=null)&&(typeof selecteditems!='undefined'))
        {
            if(type == 0)
            {
                //Commodity Domain and Policy Domain
                //selecteditems is an object
                selected_items_string = selecteditems.code;
                if((selecteditems.code == q_d.options.commodity_domain_both_code)||(selecteditems.code == q_d.options.policy_domain_both_code))
                {
                    //When both is clicked prop contains the both codes
                    selected_items_string = prop;
                }
            }
            else if((type == 1)&&(selecteditems.length>0))
            {
                //Policy Type, Commodity Class and Country
                //selecteditems is an array
                var len = selecteditems.length;
                var len_1 = selecteditems.length-1;

                for(var items=0; items<selecteditems.length; items++)
                {
                    //originalItem can be null when the item is inserted in the listbox using addItem
                    //originalItem is a jqxwidget object that contain the items that are inserted in the listbox through setDomain
                    //For this situation use value field

                    if((selecteditems[items]!=null)&&(typeof selecteditems[items] != 'undefined')&&(selecteditems[items].originalItem!=null)&&(typeof selecteditems[items].originalItem != 'undefined'))
                    {
                        selected_items_string+= selecteditems[items].originalItem.code;
                        selected_items_array.push(selecteditems[items].originalItem.code);
                        selected_items_string+= ",";
//                        if(items<len_1)
//                        {
//                            selected_items_string+= ",";
//                        }
                    }
                    else if((selecteditems[items]!=null)&&(typeof selecteditems[items] != 'undefined')){

                        //Example: "Commodity_8"
                        //Parse the value field
                        var value = selecteditems[items].value;
                        var index = value.lastIndexOf('_');
                        selected_items_string+= value.substring(index+1);
                        selected_items_array.push(value.substring(index+1));
                        selected_items_string+= ",";
//                        if(items<len_1)
//                        {
//                            selected_items_string+= ",";
//                        }
                    }
                }
                selected_items_string = selected_items_string.substring(0, selected_items_string.length-1);
                if(policy_type_flag)
                {
                    //Only in this case selected_items_string is an array
                    selected_items_string = selected_items_array;
                }
            }
            else if(type == 2)
            {
                //Years Case
                if((selecteditems.min != null)&&(typeof selecteditems.min != 'undefined')&&(selecteditems.max != null)&&(typeof selecteditems.max != 'undefined'))
                {
                    //Slider
                    //selected_items_string ...Array
                    selected_items_string = [];
                    var date2 = new Date(selecteditems.min);
                    var days = date2.getDate();
                    days=this.data_change(''+days);
                    //ONLY FOR THE POLICY
                    days= "01";
                    var month = date2.getMonth() + 1;
                    month=this.data_change(''+month);
                    var year = date2.getFullYear();
//                    selected_items_string[0] = year+ "-"+month + "-"+days;
                    selected_items_string[0] = year+ "-"+month + "-"+days;
                    date2 = new Date(selecteditems.max);
                    days = date2.getDate();
                    days=this.data_change(''+days);
                    //ONLY FOR THE POLICY
                    days= "28";
                    month = date2.getMonth() + 1;
                    month=this.data_change(''+month);
                    year = date2.getFullYear();
                    selected_items_string[1] = year+ "-"+month + "-"+days;
                }
                else{
                    if(selecteditems.length>0)
                    {
                        //Listbox
                        //selecteditems is an array
                        var len = selecteditems.length;
                        var len_1 = selecteditems.length-1;

                        for(var items=0; items<selecteditems.length; items++)
                        {
                            selected_items_string+= selecteditems[items].originalItem.label;

                            if(items<len_1)
                            {
                                selected_items_string+= ", ";
                            }
                        }
                    }
                }
            }
            else if(type == 3)
            {
                if((policy_types!=null)&&(typeof policy_types!="undefined"))
                {
                    var selected_items_map = [];
                    var selected_policy_measure_string = [];
                    for(var i=0; i< policy_types.length; i++)
                    {
                        selected_policy_measure_string = [];
                        var len = selecteditems.length;
                        var len_1 = selecteditems.length-1;

                        for(var items=0; items<selecteditems.length; items++)
                        {
                            //It can be done only for
                            if((selecteditems[items].originalItem!=null)&&(typeof selecteditems[items].originalItem != 'undefined'))
                            {
                                if(selecteditems[items].originalItem.parent_code==policy_types[i])
                                {
                                    selected_policy_measure_string.push(selecteditems[items].originalItem.code);
//                                        selected_policy_measure_string.push(selecteditems[items].originalItem.label);
                                }
                            }
                        }
                        var app = '';

                        for(var j=0; j<selected_policy_measure_string.length; j++)
                        {
                            app+= selected_policy_measure_string[j];
                            if(j<selected_policy_measure_string.length-1)
                            {
                                app+= ", ";
                            }
                        }
                        selected_items_map[i] = app;
                    }
                    //In this case selected_items_string is a map
                    selected_items_string = selected_items_map;
                }
            }
        }
        return selected_items_string;
    };

    HostUtility.prototype.buttonShowHide = function(buttonId, action) {

        if(action){
            //True = Show
            $("#"+buttonId).show();
        }
        else{
            //False = Hide
            $("#"+buttonId).hide();
        }
    }

        //Utility functions
    HostUtility.prototype.data_compare = function(firt_dd, first_mm, first_yy, second_dd, second_mm, second_yy) {

        var last_date = '';
        if(second_yy>first_yy)
        {
            return last_date = 'second';
        }
        else if(second_yy<first_yy)
        {
            return last_date = 'first';
        }
        else if(second_yy==first_yy)
        {
            if(second_mm>first_mm)
            {
                return last_date = 'second';
            }
            else if(second_mm<first_mm)
            {
                return last_date = 'first';
            }
            else if(second_yy==first_yy)
            {
                if(second_dd>first_dd)
                {
                    return last_date = 'second';
                }
                else if(second_dd<first_dd)
                {
                    return last_date = 'first';
                }
                else if(second_yy==first_yy)
                {
                    //The date are equal
                    return last_date = 'first';
                }
            }
        }
    }

    // Download function
    HostUtility.prototype.download_export = function(data, export_type) {
        if(export_type == 'AllData')
        {
            /** Stream the Excel through the hidden form */
            $('#datasource_WQ').val(data.datasource);
            $('#thousandSeparator_WQ').val(',');
            $('#decimalSeparator_WQ').val('.');
            $('#decimalNumbers_WQ').val('2');
            $('#json_WQ').val(JSON.stringify(data));
            $('#cssFilename_WQ').val('');
            $('#valueIndex_WQ').val(null);
            $('#quote_WQ').val('');
            $('#title_WQ').val(export_type);
            $('#subtitle_WQ').val('');
            document.excelFormWithQuotes.submit();
        }
        else{
            $('#datasource_WQ2').val(data.datasource);
            $('#thousandSeparator_WQ2').val(',');
            $('#decimalSeparator_WQ2').val('.');
            $('#decimalNumbers_WQ2').val('2');
            $('#json_WQ2').val(JSON.stringify(data));
            $('#cssFilename_WQ2').val('');
            $('#valueIndex_WQ2').val(null);
            $('#quote_WQ2').val('');
            $('#title_WQ2').val(export_type);
            $('#subtitle_WQ2').val('');
            document.excelFormWithQuotes2.submit();
        }
    }

//    HostUtility.prototype.getPolicyTable_datafields = function(data, export_type) {
    HostUtility.prototype.getPolicyTable_datafields = function(data, host) {
        var info= new Object();
        var self = this;

        var tooltiprenderer = function (element) {
            $(element).jqxTooltip({position: 'mouse', content: $(element).text() });
        }

//        var linkrenderer = function (row, column, value) {
//            return '<a style="margin-left: 4px; margin-top: 5px; float: left;">' + value + '</a>';
//        }
//
//        var linkrendererButton = function (row, column, value) {
//            return '<a style="margin-left: 8px; margin-top: 5px; float: left;">' + value + '</a>';
//        }

        var linkrenderer = function (row, column, value) {
            return '<a class=fx_policy_table_link_datafield>' + value + '</a>';
        }

        var linkrendererButton = function (row, column, value) {
            return '<a class=fx_policy_table_link_datafield_button>' + value + '</a>';
        }

        var datafields = new Array();
        var columns = new Array();
        var obj = { name: 'ShortDescription' };
        var obj2 = { text: 'Short Description', datafield: 'ShortDescription', rendered: tooltiprenderer };
        datafields.push(obj);
        columns.push(obj2);

        if((data[0]["SharedGroupCode"]!=null)&&(typeof data[0]["SharedGroupCode"]!="undefined")&&(data[0]["SharedGroupCode"].length>0)&&(data[0]["SharedGroupCode"]!= "none"))
        {
            //The element is a Shared Group
            //Insert Shared Group Code button
            obj = { name: 'SharedGroupCode' };
            datafields.push(obj);
            obj = { name: 'CommodityId'};
            datafields.push(obj);
            obj2 = { text: 'Shared Group', datafield: 'SharedGroupCode', cellsrenderer: linkrenderer };
            columns.push(obj2);
        }
        else{
            //No Shared Group
            obj = { name: 'HsCode' };
            datafields.push(obj);
            obj2 = { text: 'HS Code', datafield: 'HsCode', rendered: tooltiprenderer };
            columns.push(obj2);
            obj = { name: 'HsVersion' };
            datafields.push(obj);
            obj2 = { text: 'HS Version', datafield: 'HsVersion', rendered: tooltiprenderer };
            columns.push(obj2);
            obj = { name: 'HsSuffix' };
            datafields.push(obj);
            obj2 = { text: 'HS Suffix', datafield: 'HsSuffix', rendered: tooltiprenderer };
            columns.push(obj2);
        }

        obj = { name: 'StartDate' };
        datafields.push(obj);
        obj2 = { text: 'Start Date', datafield: 'StartDate', rendered: tooltiprenderer  };
        columns.push(obj2);
        obj = { name: 'EndDate' };
        datafields.push(obj);
        obj2 = { text: 'End Date', datafield: 'EndDate', rendered: tooltiprenderer  };
        columns.push(obj2);

        var combination = self.value_existence(data);
        if(combination==0)
        {
            //Value and Value Text
            obj = { name: 'Unit' };
            datafields.push(obj);
            obj2 = { text: 'Unit', datafield: 'Unit', rendered: tooltiprenderer  };
            columns.push(obj2);
            obj = { name: 'Value' };
            datafields.push(obj);
            obj2 = { text: 'Value', datafield: 'Value', rendered: tooltiprenderer  };
            columns.push(obj2);
            obj = { name: 'ValueText' };
            datafields.push(obj);
            obj2 = { text: 'Value Text', datafield: 'ValueText', rendered: tooltiprenderer  };
            columns.push(obj2);
        }
        else if(combination==1)
        {
            //No Value, No Value Text
        }
        else if(combination==2)
        {
            //Value
            obj = { name: 'Unit' };
            datafields.push(obj);
            obj2 = { text: 'Unit', datafield: 'Unit', rendered: tooltiprenderer  };
            columns.push(obj2);
            obj = { name: 'Value' };
            datafields.push(obj);
            obj2 = { text: 'Value', datafield: 'Value', rendered: tooltiprenderer  };
            columns.push(obj2);
        }
        else if(combination==3)
        {
            //Value Text
            obj = { name: 'ValueText' };
            datafields.push(obj);
            obj2 = { text: 'Value Text', datafield: 'ValueText', rendered: tooltiprenderer  };
            columns.push(obj2);
        }

//        if((data[0]["Value"]!=null)&&(typeof data[0]["Value"]!="undefined")&&(data[0]["Value"].length>0)&&(data[0]["Value"]!= "none"))
//        {
//            obj = { name: 'Value' };
//            obj2 = { text: 'Value', datafield: 'Value', rendered: tooltiprenderer  };
//        }
//        else{
//            obj = { name: 'ValueText' };
//            obj2 = { text: 'Value Text', datafield: 'ValueText', rendered: tooltiprenderer  };
//        }
//        datafields.push(obj);
//        columns.push(obj2);

        if((data[0]["Exemptions"]!=null)&&(typeof data[0]["Exemptions"]!="undefined")&&(data[0]["Exemptions"].length>0)&&(data[0]["Exemptions"]!= "none"))
        {
            obj = { name: 'Exemptions' };
            datafields.push(obj);
            obj2 = { text: 'Exemptions', datafield: 'Exemptions', rendered: tooltiprenderer  };
            columns.push(obj2);
        }

        if((data[0]["PolicyElement"]!=null)&&(typeof data[0]["PolicyElement"]!="undefined")&&(data[0]["PolicyElement"].length>0)&&(data[0]["PolicyElement"]!= "none"))
        {
            obj = { name: 'PolicyElement' };
            datafields.push(obj);
            obj2 = { text: 'Policy Element', datafield: 'PolicyElement', rendered: tooltiprenderer  };
            columns.push(obj2);
        }

        obj = { name: 'AdditionalInfoButton' };
        datafields.push(obj);
        obj2 = { text: 'Additional Info', datafield: 'AdditionalInfoButton', rendered: tooltiprenderer, cellsrenderer: linkrendererButton  };
        columns.push(obj2);

        obj = { name: 'MetadataButton' };
        datafields.push(obj);
        obj2 = { text: 'Metadata', datafield: 'MetadataButton', rendered: tooltiprenderer, cellsrenderer: linkrendererButton  };
        columns.push(obj2);

        if((host.options.button_preview_action_type == "searchEditPolicy")||(host.options.button_preview_action_type == "searchCreatePolicy"))
        {
            obj = { name: 'EditButton' };
            datafields.push(obj);
            obj2 = { text: 'Edit', datafield: 'EditButton', rendered: tooltiprenderer, cellsrenderer: linkrendererButton  };
            columns.push(obj2);

            obj = { name: 'DeleteButton' };
            datafields.push(obj);
            obj2 = { text: 'Delete', datafield: 'DeleteButton', rendered: tooltiprenderer, cellsrenderer: linkrendererButton  };
            columns.push(obj2);
        }

        //For the additional information window start
//        "ValueType","LocalCondition","Notes","Link","Source","TitleOfNotice","LegalBasisName","DateOfPublication","ImposedEndDate","SecondGenerationSpecific","BenchmarkTax",
//            "BenchmarkProduct","TaxRateBiofuel","TaxRateBenchmark","StartDateTax","BenchmarkLink","OriginalDataset","TypeOfChangeName","MeasureDescription",
//            "ProductOriginalHs","ProductOriginalName","ImplementationProcedure","XsYearType","LinkPdf","BenchmarkLinkPdf","ShortDescription","SharedGroupCode"
        obj = { name: 'CplId'};
        datafields.push(obj);
        obj = { name: 'Policy_id'};
        datafields.push(obj);
        obj = { name: 'ValueType'};
        datafields.push(obj);
        obj = { name: 'LocalCondition'};
        datafields.push(obj);
        obj = { name: 'Notes'};
        datafields.push(obj);
        obj = { name: 'Link'};
        datafields.push(obj);
        obj = { name: 'Source'};
        datafields.push(obj);
        obj = { name: 'TitleOfNotice'};
        datafields.push(obj);
        obj = { name: 'LegalBasisName'};
        datafields.push(obj);
        obj = { name: 'DateOfPublication'};
        datafields.push(obj);
        obj = { name: 'ImposedEndDate'};
        datafields.push(obj);
        obj = { name: 'SecondGenerationSpecific'};
        datafields.push(obj);
        obj = { name: 'BenchmarkTax'};
        datafields.push(obj);
        obj = { name: 'BenchmarkProduct'};
        datafields.push(obj);
        obj = { name: 'TaxRateBiofuel'};
        datafields.push(obj);
        obj = { name: 'TaxRateBenchmark'};
        datafields.push(obj);
        obj = { name: 'StartDateTax'};
        datafields.push(obj);
        obj = { name: 'BenchmarkLink'};
        datafields.push(obj);
        obj = { name: 'OriginalDataset'};
        datafields.push(obj);
        obj = { name: 'TypeOfChangeName'};
        datafields.push(obj);
        obj = { name: 'MeasureDescription'};
        datafields.push(obj);
        obj = { name: 'ProductOriginalHs'};
        datafields.push(obj);
        obj = { name: 'ProductOriginalName'};
        datafields.push(obj);
        obj = { name: 'ImplementationProcedure'};
        datafields.push(obj);
        obj = { name: 'XsYearType'};
        datafields.push(obj);
        obj = { name: 'LinkPdf'};
        datafields.push(obj);
        obj = { name: 'BenchmarkLinkPdf'};
        datafields.push(obj);
        obj = { name: 'ShortDescription'};
        datafields.push(obj);
        obj = { name: 'SharedGroupCode'};
        datafields.push(obj);

        obj = { name: 'MasterIndex'};
        datafields.push(obj);
        //For the additional information window end
        var colNum = columns.length;
        var dim = 100/columns.length;

        //Add the dimension
        for(var i=0; i< colNum; i++)
        {
            columns[i].width = ''+dim+'%';
        }
        info.datafields = datafields;
        info.columns = columns;

        return info;
    }

    //E.g. ("Link", leftcolumn, "Link", datarecord)
    HostUtility.prototype.checkAdditional_info_window_Datafield = function(type, column, title, datarecord)
    {
        var element = '';
//        if((datarecord[type]!=null)||(typeof datarecord[type]!= "undefined"))
//        {
//            element = "<div style='margin: 10px;'><b>"+title+":</b> " + datarecord[type] + "</div>";
//        }
//        else
//        {
//            element = "<div style='margin: 10px;'><b>"+title+":</b> " + ''+ "</div>";
//        }

        if((datarecord[type]!=null)||(typeof datarecord[type]!= "undefined"))
        {
            if(type == "Link")
            {
                //It has to be an hyperlink
                element = "<div class='fx_additional_info_content_element'><b>"+title+":</b> " + " <a href="+datarecord[type]+" target='_self'>"+datarecord[type]+"</a>" + "</div>";
            }
            else{
                element = "<div class='fx_additional_info_content_element'><b>"+title+":</b> " + datarecord[type] + "</div>";
            }
        }
        else
        {
            element = "<div class='fx_additional_info_content_element'><b>"+title+":</b> " + ''+ "</div>";
        }

        $(column).append(element);
    }

    HostUtility.prototype.unique = function(elem_array) {
        var a = elem_array.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
        return a;
    };

    HostUtility.prototype.value_existence = function(data) {
        var value_bool = false;
        var value_text_bool = false;
        var combination = -1;
        for(var iData=0; iData<data.length; iData++)
        {
            if((data[iData]["Value"]!=null)&&(typeof data[iData]["Value"]!="undefined")&&(data[iData]["Value"].length>0)&&(data[iData]["Value"]!= "none")&&(data[iData]["Value"]!= " "))
            {
                value_bool = true;
            }
//            else{
//                console.log("Value bool "+ value_bool);
//            }
            if((data[iData]["ValueText"]!=null)&&(typeof data[iData]["ValueText"]!="undefined")&&(data[iData]["ValueText"].length>0)&&(data[iData]["ValueText"]!= "none")&&(data[iData]["ValueText"]!= " "))
            {
                value_text_bool = true;
            }
        }

        //Choose the combination to show
        if((value_bool)&&(value_text_bool)){
            combination = 0;
        }
        else if((!value_bool)&&(!value_text_bool)){
            combination = 1;
        }
        else if(value_bool){
            combination = 2;
        }
        else{
            combination = 3;
        }

        return combination;
    }

    //Utility functions
    HostUtility.prototype.data_change = function(date_to_check) {

        if((date_to_check!=null)&&(typeof date_to_check!='undefined')&&(date_to_check.length==1))
        {
            date_to_check = "0"+date_to_check;
        }

        return date_to_check;
    }

    HostUtility.prototype.checkFieldsByPolicySelection = function(guiJson, payload) {
       var masterdata = payload.master_data;
        console.log(masterdata)
       //var policydata = payload.policy_data;
       //This is an array
       this.setFieldsForConfigurationObj();
       var obj = this.options.fieldsToHide;
       for(var i=0;i<obj.length; i++){
            if(masterdata.CommodityDomainCode == obj[i].commodityDomainCode){
                if(masterdata.PolicyDomainCode == obj[i].policyDomainCode){
                    if(masterdata.PolicyTypeCode == obj[i].policyTypeCode){
                        if(masterdata.PolicyMeasureCode == obj[i].policyMeasureCode){
                            this.configurationApply(guiJson, i);
                        }
                    }
                }
            }
       }
    }

    //There is an association between the fieldsToHide array and the index in the configurationApply function
    HostUtility.prototype.setFieldsForConfigurationObj = function() {
        this.options.fieldsToHide = [];
        var obj = {};

        //index=0...Agricultural Domestic Direct Payments
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '6';
        obj.policyMeasureCode = '21';
        this.options.fieldsToHide.push(obj);
        //index=1
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '6';
        obj.policyMeasureCode = '22';
        this.options.fieldsToHide.push(obj);
        //index=2
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '6';
        obj.policyMeasureCode = '16';
        this.options.fieldsToHide.push(obj);
        //index=3... Agricultural Domestic Input Support
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '5';
        obj.policyMeasureCode = '19';
        this.options.fieldsToHide.push(obj);
        //index=4
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '5';
        obj.policyMeasureCode = '18';
        this.options.fieldsToHide.push(obj);
        //index=5... Agricultural Domestic Market Transfers
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '3';
        obj.policyMeasureCode = '13';
        this.options.fieldsToHide.push(obj);
        //index=6
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '3';
        obj.policyMeasureCode = '15';
        this.options.fieldsToHide.push(obj);
        //index=7
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '3';
        obj.policyMeasureCode = '14';
        this.options.fieldsToHide.push(obj);
        //index=8...Agricultural Domestic Production Payments
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '4';
        obj.policyMeasureCode = '17';
        this.options.fieldsToHide.push(obj);
        //index=9...Agricultural Domestic Relative Indicators
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '7';
        obj.policyMeasureCode = '23';
        this.options.fieldsToHide.push(obj);
        //index=10
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '7';
        obj.policyMeasureCode = '26';
        this.options.fieldsToHide.push(obj);
        //index=11
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '7';
        obj.policyMeasureCode = '25';
        this.options.fieldsToHide.push(obj);
        //index=12
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '7';
        obj.policyMeasureCode = '24';
        this.options.fieldsToHide.push(obj);
        //index=13...Agricultural Trade Export Measure
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '1';
        obj.policyMeasureCode = '1';
        this.options.fieldsToHide.push(obj);
        //index=14
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '1';
        obj.policyMeasureCode = '2';
        this.options.fieldsToHide.push(obj);
        //index=15//HERE
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '1';
        obj.policyMeasureCode = '3';
        this.options.fieldsToHide.push(obj);
        //index=16
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '1';
        obj.policyMeasureCode = '4';
        this.options.fieldsToHide.push(obj);
        //index=17
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '1';
        obj.policyMeasureCode = '5';
        this.options.fieldsToHide.push(obj);
        //index=18
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '1';
        obj.policyMeasureCode = '44';
        this.options.fieldsToHide.push(obj);
        //index=19
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '1';
        obj.policyMeasureCode = '45';
        this.options.fieldsToHide.push(obj);
        //index=20
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '1';
        obj.policyMeasureCode = '6';
        this.options.fieldsToHide.push(obj);
        //index=21
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '1';
        obj.policyMeasureCode = '9';
        this.options.fieldsToHide.push(obj);
        //index=22
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '1';
        obj.policyMeasureCode = '10';
        this.options.fieldsToHide.push(obj);
        //index=23...Agricultural Trade Import Measure
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '2';
        obj.policyMeasureCode = '11';
        this.options.fieldsToHide.push(obj);
        //index=24
        obj = {};
        obj.commodityDomainCode = '1';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '2';
        obj.policyMeasureCode = '12';
        this.options.fieldsToHide.push(obj);
        //index=25...Biofuels Domestic Biofuel targets
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '8';
        obj.policyMeasureCode = '34';
        this.options.fieldsToHide.push(obj);
        //index=26
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '8';
        obj.policyMeasureCode = '35';
        this.options.fieldsToHide.push(obj);
        //index=26
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '8';
        obj.policyMeasureCode = '36';
        this.options.fieldsToHide.push(obj);
        //index=25...Biofuels Domestic Domestic price regulation
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '10';
        obj.policyMeasureCode = '44';
        this.options.fieldsToHide.push(obj);
        //index=26
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '10';
        obj.policyMeasureCode = '45';
        this.options.fieldsToHide.push(obj);
        //index=27...Biofuels Domestic Other domestic measures
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '11';
        obj.policyMeasureCode = '31';
        this.options.fieldsToHide.push(obj);
        //index=28
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '11';
        obj.policyMeasureCode = '46';
        this.options.fieldsToHide.push(obj);
        //index=29
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '11';
        obj.policyMeasureCode = '47';
        this.options.fieldsToHide.push(obj);
        //index=30...Biofuels Domestic Production Payments
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '11';
        obj.policyMeasureCode = '17';
        this.options.fieldsToHide.push(obj);
        //index=31...Biofuels Domestic Tax concessions
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '9';
        obj.policyMeasureCode = '37';
        this.options.fieldsToHide.push(obj);
        //index=32
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '9';
        obj.policyMeasureCode = '38';
        this.options.fieldsToHide.push(obj);
        //index=33
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '9';
        obj.policyMeasureCode = '39';
        this.options.fieldsToHide.push(obj);
        //index=34
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '9';
        obj.policyMeasureCode = '40';
        this.options.fieldsToHide.push(obj);
        //index=35
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '9';
        obj.policyMeasureCode = '41';
        this.options.fieldsToHide.push(obj);
        //index=36
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '9';
        obj.policyMeasureCode = '42';
        this.options.fieldsToHide.push(obj);
        //index=37
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '2';
        obj.policyTypeCode = '9';
        obj.policyMeasureCode = '43';
        this.options.fieldsToHide.push(obj);
        //index=38...Biofuels Trade Export Measures
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '1';
        obj.policyMeasureCode = '27';
        this.options.fieldsToHide.push(obj);
        //index=39
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '1';
        obj.policyMeasureCode = '4';
        this.options.fieldsToHide.push(obj);
        //index=40
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '1';
        obj.policyMeasureCode = '5';
        this.options.fieldsToHide.push(obj);
        //index=41
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '1';
        obj.policyMeasureCode = '6';
        this.options.fieldsToHide.push(obj);
        //index=42
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '1';
        obj.policyMeasureCode = '10';
        this.options.fieldsToHide.push(obj);
        //index=43...Biofuels Trade Import Measures
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '2';
        obj.policyMeasureCode = '28';
        this.options.fieldsToHide.push(obj);
        //index=44
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '2';
        obj.policyMeasureCode = '29';
        this.options.fieldsToHide.push(obj);
        //index=45
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '2';
        obj.policyMeasureCode = '30';
        this.options.fieldsToHide.push(obj);
        //index=46
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '2';
        obj.policyMeasureCode = '11';
        this.options.fieldsToHide.push(obj);
        //index=47
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '2';
        obj.policyMeasureCode = '31';
        this.options.fieldsToHide.push(obj);
        //index=48
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '2';
        obj.policyMeasureCode = '32';
        this.options.fieldsToHide.push(obj);
        //index=49
        obj = {};
        obj.commodityDomainCode = '2';
        obj.policyDomainCode = '1';
        obj.policyTypeCode = '2';
        obj.policyMeasureCode = '33';
        this.options.fieldsToHide.push(obj);
    }

    HostUtility.prototype.configurationApply = function(guiJson, index) {
        //alert(index)
        var one_case_array = [0,1,2,3,4,5,6,7,8,9,10,11,12,14,16,18,19,20];
        var one_case_result = (one_case_array.indexOf(index))!=-1;
        var two_case_array = [13,17,21];
        var two_case_result = (two_case_array.indexOf(index))!=-1;
        var three_case_array = [22];
        var three_case_result = (three_case_array.indexOf(index))!=-1;
        var four_case_array = [15,23,24];
        var four_case_result = (four_case_array.indexOf(index))!=-1;
        var five_case_array = [25,49];
        var five_case_result = (five_case_array.indexOf(index))!=-1;
        var six_case_array = [26,27,28,29,31,32,33,41,42,46,48,51,52];
        var six_case_result = (six_case_array.indexOf(index))!=-1;
        var seven_case_array = [30,43,50];
        var seven_case_result = (seven_case_array.indexOf(index))!=-1;
        var eight_case_array = [34,35,36,37,38,39,40,44,45,47];
        var eight_case_result = (eight_case_array.indexOf(index))!=-1;

        switch (true){
            //case 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,18,19,20,21,22,25,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,50,51,52:
            case one_case_result:
                //alert("CASE 0")
                delete guiJson.panels[0].properties.policyElement;
                delete guiJson.panels[0].properties.taxRateBenchmark;
                delete guiJson.panels[0].properties.benchmarkLink;
                delete guiJson.panels[0].properties.benchmarkLinkPdf;
                delete guiJson.panels[0].properties.secondGenerationSpecific;
                delete guiJson.panels[0].properties.benchmarkTax;
                delete guiJson.panels[0].properties.benchmarkProduct;
                delete guiJson.panels[0].properties.taxRateBiofuel;
                delete guiJson.panels[0].properties.startDateTax;
                break;
            case two_case_result:
                //alert("CASE 1")
                delete guiJson.panels[0].properties.policyElement;
                delete guiJson.panels[0].properties.taxRateBenchmark;
                delete guiJson.panels[0].properties.benchmarkLink;
                delete guiJson.panels[0].properties.benchmarkLinkPdf;
                delete guiJson.panels[0].properties.secondGenerationSpecific;
                delete guiJson.panels[0].properties.benchmarkTax;
                delete guiJson.panels[0].properties.benchmarkProduct;
                delete guiJson.panels[0].properties.taxRateBiofuel;
                delete guiJson.panels[0].properties.startDateTax;
                delete guiJson.panels[0].properties.unit;
                delete guiJson.panels[0].properties.value;
                delete guiJson.panels[0].properties.valueText;
                break;
            case three_case_result:
                //alert("CASE 2")
                delete guiJson.panels[0].properties.policyElement;
                delete guiJson.panels[0].properties.secondGenerationSpecific;
                break;
            case four_case_result:
                //alert("CASE 3")
                delete guiJson.panels[0].properties.taxRateBenchmark;
                delete guiJson.panels[0].properties.benchmarkLink;
                delete guiJson.panels[0].properties.benchmarkLinkPdf;
                delete guiJson.panels[0].properties.secondGenerationSpecific;
                delete guiJson.panels[0].properties.benchmarkTax;
                delete guiJson.panels[0].properties.benchmarkProduct;
                delete guiJson.panels[0].properties.taxRateBiofuel;
                delete guiJson.panels[0].properties.startDateTax;
                break;
            case five_case_result:
                //alert("CASE 4")
                delete guiJson.panels[0].properties.policyElement;
                delete guiJson.panels[0].properties.taxRateBenchmark;
                delete guiJson.panels[0].properties.benchmarkLink;
                delete guiJson.panels[0].properties.benchmarkLinkPdf;
                delete guiJson.panels[0].properties.benchmarkTax;
                delete guiJson.panels[0].properties.benchmarkProduct;
                delete guiJson.panels[0].properties.taxRateBiofuel;
                delete guiJson.panels[0].properties.startDateTax;
                break;
            case six_case_result:
                //alert("CASE 5")
                delete guiJson.panels[0].properties.policyElement;
                delete guiJson.panels[0].properties.taxRateBenchmark;
                delete guiJson.panels[0].properties.benchmarkLink;
                delete guiJson.panels[0].properties.benchmarkLinkPdf;
                delete guiJson.panels[0].properties.benchmarkTax;
                delete guiJson.panels[0].properties.benchmarkProduct;
                delete guiJson.panels[0].properties.taxRateBiofuel;
                delete guiJson.panels[0].properties.startDateTax;
                break;
            case seven_case_result:
                //alert("CASE 6")
                delete guiJson.panels[0].properties.policyElement;
                delete guiJson.panels[0].properties.taxRateBenchmark;
                delete guiJson.panels[0].properties.benchmarkLink;
                delete guiJson.panels[0].properties.benchmarkLinkPdf;
                delete guiJson.panels[0].properties.benchmarkTax;
                delete guiJson.panels[0].properties.benchmarkProduct;
                delete guiJson.panels[0].properties.taxRateBiofuel;
                delete guiJson.panels[0].properties.startDateTax;
                delete guiJson.panels[0].properties.unit;
                delete guiJson.panels[0].properties.value;
                delete guiJson.panels[0].properties.valueText;
                break;
            case eight_case_result:
                //alert("CASE 7")
                delete guiJson.panels[0].properties.policyElement;
                break;

        }

     /*   switch (index){
            //case 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,16,17,18,19,20,21,22,25,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,50,51,52:
            case 0,1,2,3,4,5,6,7,8,9,10,11,12,14,16,18,19,20:
                alert("CASE 0")
                delete guiJson.panels[0].properties.policyElement;
                delete guiJson.panels[0].properties.taxRateBenchmark;
                delete guiJson.panels[0].properties.benchmarkLink;
                delete guiJson.panels[0].properties.benchmarkLinkPdf;
                delete guiJson.panels[0].properties.secondGenerationSpecific;
                delete guiJson.panels[0].properties.benchmarkTax;
                delete guiJson.panels[0].properties.benchmarkProduct;
                delete guiJson.panels[0].properties.taxRateBiofuel;
                delete guiJson.panels[0].properties.startDateTax;
                break;
            case 13,17,21:
                alert("CASE 1")
                delete guiJson.panels[0].properties.policyElement;
                delete guiJson.panels[0].properties.taxRateBenchmark;
                delete guiJson.panels[0].properties.benchmarkLink;
                delete guiJson.panels[0].properties.benchmarkLinkPdf;
                delete guiJson.panels[0].properties.secondGenerationSpecific;
                delete guiJson.panels[0].properties.benchmarkTax;
                delete guiJson.panels[0].properties.benchmarkProduct;
                delete guiJson.panels[0].properties.taxRateBiofuel;
                delete guiJson.panels[0].properties.startDateTax;
                delete guiJson.panels[0].properties.unit;
                delete guiJson.panels[0].properties.value;
                delete guiJson.panels[0].properties.valueText;
                break;
            case 22:
                alert("CASE 2")
                delete guiJson.panels[0].properties.policyElement;
                delete guiJson.panels[0].properties.secondGenerationSpecific;
                break;
            case 23,24:
                alert("CASE 3")
                delete guiJson.panels[0].properties.taxRateBenchmark;
                delete guiJson.panels[0].properties.benchmarkLink;
                delete guiJson.panels[0].properties.benchmarkLinkPdf;
                delete guiJson.panels[0].properties.secondGenerationSpecific;
                delete guiJson.panels[0].properties.benchmarkTax;
                delete guiJson.panels[0].properties.benchmarkProduct;
                delete guiJson.panels[0].properties.taxRateBiofuel;
                delete guiJson.panels[0].properties.startDateTax;
                break;
            case 25,49:
                alert("CASE 4")
                delete guiJson.panels[0].properties.policyElement;
                delete guiJson.panels[0].properties.taxRateBenchmark;
                delete guiJson.panels[0].properties.benchmarkLink;
                delete guiJson.panels[0].properties.benchmarkLinkPdf;
                delete guiJson.panels[0].properties.benchmarkTax;
                delete guiJson.panels[0].properties.benchmarkProduct;
                delete guiJson.panels[0].properties.taxRateBiofuel;
                delete guiJson.panels[0].properties.startDateTax;
                break;
            case 26,27,28,29,31,32,33,41,42,46,48,51,52:
                alert("CASE 5")
                delete guiJson.panels[0].properties.policyElement;
                delete guiJson.panels[0].properties.taxRateBenchmark;
                delete guiJson.panels[0].properties.benchmarkLink;
                delete guiJson.panels[0].properties.benchmarkLinkPdf;
                delete guiJson.panels[0].properties.benchmarkTax;
                delete guiJson.panels[0].properties.benchmarkProduct;
                delete guiJson.panels[0].properties.taxRateBiofuel;
                delete guiJson.panels[0].properties.startDateTax;
                break;
            case 30,43,50:
                alert("CASE 6")
                delete guiJson.panels[0].properties.policyElement;
                delete guiJson.panels[0].properties.taxRateBenchmark;
                delete guiJson.panels[0].properties.benchmarkLink;
                delete guiJson.panels[0].properties.benchmarkLinkPdf;
                delete guiJson.panels[0].properties.benchmarkTax;
                delete guiJson.panels[0].properties.benchmarkProduct;
                delete guiJson.panels[0].properties.taxRateBiofuel;
                delete guiJson.panels[0].properties.startDateTax;
                delete guiJson.panels[0].properties.unit;
                delete guiJson.panels[0].properties.value;
                delete guiJson.panels[0].properties.valueText;
                break;
            case 34,35,36,37,38,39,40,44,45,47:
                alert("CASE 7")
                delete guiJson.panels[0].properties.policyElement;
                break;

        }*/
    }

    return HostUtility;
});
