define([
    'jquery',
    'jQAllRangeSliders'
], function($) {

    var optionsDefault = {
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
    HostUtility.prototype.selected_items_parser = function(type, selecteditems, policy_type_flag, policy_types, prop){

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
                if(selecteditems.code == '-1')
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
                    var month = date2.getMonth() + 1;
                    month=this.data_change(''+month);
                    var year = date2.getFullYear();
                    selected_items_string[0] = year+ "-"+month + "-"+days;
                    date2 = new Date(selecteditems.max);
                    days = date2.getDate();
                    days=this.data_change(''+days);
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
            obj2 = { text: 'Hs Code', datafield: 'HsCode', rendered: tooltiprenderer };
            columns.push(obj2);
            obj = { name: 'HsVersion' };
            datafields.push(obj);
            obj2 = { text: 'Hs Version', datafield: 'HsVersion', rendered: tooltiprenderer };
            columns.push(obj2);
            obj = { name: 'HsSuffix' };
            datafields.push(obj);
            obj2 = { text: 'Hs Suffix', datafield: 'HsSuffix', rendered: tooltiprenderer };
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

        if(host.options.button_preview_action_type == "search")
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
            element = "<div class='fx_additional_info_content_element'><b>"+title+":</b> " + datarecord[type] + "</div>";
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

    return HostUtility;
});
