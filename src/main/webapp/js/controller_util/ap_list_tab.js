var ap_list_tab = (function() {

    var CONFIG = {
        //The widget that has to contain the tabs
        custom_widget:'',
        //Number of tabs
        tabs_num:'',
        //Object with the tabs property(ex.width)
        property_object:'',
        //Titles of the tabs
        tabs_title:[],
        //Id of the each tab
        tabs_id:[],
        //Id of the group of tabs
        main_tabs_id:'',
        //Text to show in each tabs(can be assent)
        tabs_text:[],
        //The functions for the creation of each tab
        tabs_init_function:[],
        //Data to Show in the widget of the tab(ex.data of a listbox)
        //type=name of the tab, i=position of the element in the list and c=code of the item in the db,
        //Ex. of item in one element source[i] -> var obj = {value:type+"_"+i+"_"+c, label: ''+l};
        tab_sources:[]
    };

    function init(ap_list_tab_obj){
       // console.log("buildUI function "+ap_list_tab.CONFIG.tabs_init_function[0]);
        buildUI(ap_list_tab_obj);
       // console.log("ap_list_tab.CONFIG.tab_sources[0] "+ap_list_tab.CONFIG.tab_sources[0].label);
    };

    function buildUI(ap_list_tab_obj) {

        console.log("buildUI start ap_list_tab_obj.custom_widget "+ap_list_tab_obj.custom_widget);
        $("#"+ap_list_tab_obj.custom_widget).append(ap_list_tab.tab_item_creation(ap_list_tab_obj));

        // init widgets.
       // console.log("Before initWidgets ");
        var initWidgets = function (tab) {
            // console.log("initWidgets start  ");
            for(var i=0; i<ap_list_tab_obj.tabs_num;i++)
            {
                //console.log("initWidgets i=  "+i+ " ap_list_tab.CONFIG.tabs_init_function[i] "+ap_list_tab.CONFIG.tabs_init_function[i]);
                if((ap_list_tab_obj.tabs_init_function[i]!=null)&&(!ap_list_tab_obj.tabs_init_function[i].empty))
                {
                   // console.log("buildUI ap_list_tab.CONFIG.tab_sources[i] "+ap_list_tab.CONFIG.tab_sources[i]);
                    ap_list_tab_obj.tabs_init_function[i](ap_list_tab_obj.tab_sources[i], ap_list_tab_obj.tabs_id[i]);
                }
            }
        }
        // Create jqxTabs.
//        $('#jqxTabs').jqxTabs(ap_list_tab.CONFIG.property_object);
//        $('#jqxTabs').jqxTabs({initTabContent:initWidgets});
       // console.log("Before jqxtabs 1"+ap_list_tab_obj.main_tabs_id);
        $('#'+ap_list_tab_obj.main_tabs_id).jqxTabs(ap_list_tab_obj.property_object);
      //  console.log("Before jqxtabs 2"+ap_list_tab_obj.main_tabs_id);
        $('#'+ap_list_tab_obj.main_tabs_id).jqxTabs({initTabContent:initWidgets});
    };

    function tab_item_creation(ap_list_tab_obj){
//        var s="<div id='jqxTabs'><ul>";
      //  console.log("in tab_item_creation ap_list_tab_obj.main_tabs_id "+ap_list_tab_obj.main_tabs_id);
        var s="<div id='"+ap_list_tab_obj.main_tabs_id+"'><ul>";
        //Tab Title
        for(var i=0; i<ap_list_tab_obj.tabs_num;i++)
        {
            s += "<li>"+ap_list_tab_obj.tabs_title[i]+"</li>";
        }
        s+='</ul>';
        //Tab Content
        for(var i=0; i<ap_list_tab_obj.tabs_num;i++)
        {
            s+= '<div';
            if((ap_list_tab_obj.tabs_id[i]!=null)&&(!ap_list_tab_obj.tabs_id[i].empty))
            {
                s += ' id='+ap_list_tab_obj.tabs_id[i];
            }
            s += '>'+ap_list_tab_obj.tabs_text[i]+'</div>';
        }
        s+='</div>';

        return s;
    };

    //Functions to create the tab content
    function init_list(tab_source, tab_id){
        // console.log("in init_list tab_source "+tab_source);
//        var source = [
//            "Affogato2",
//            "Americano",
//            "Bicerin",
//            "Breve",
//            "Café Bombón",
//            "Café au lait",
//            "Caffé Corretto",
//            "Café Crema",
//            "Caffé Latte",
//            "Caffé macchiato",
//            "Café mélange",
//            "Coffee milk",
//            "Cafe mocha",
//            "Cappuccino",
//            "Carajillo",
//            "Cortado",
//            "Cuban espresso",
//            "Espresso",
//            "Eiskaffee",
//            "The Flat White",
//            "Frappuccino",
//            "Galao",
//            "Greek frappé coffee",
//            "Iced Coffee﻿",
//            "Indian filter coffee",
//            "Instant coffee",
//            "Irish coffee",
//            "Liqueur coffee"
//        ];
        // Create a jqxListBox
        $("#"+tab_id).jqxListBox({
            source: tab_source, selectedIndex: 1, multipleextended: true, height: '100%', width:'100%',
            rendered: function () {
                $("#"+tab_id).jqxListBox('focus');
            }
        });
        // display selected List Items.
//        var displaySelectedItems = function () {
//            var items = $("#jqxlist").jqxListBox('getSelectedItems');
//            var selection = "Selected Items: ";
//            for (var i = 0; i < items.length; i++) {
//                selection += items[i].label + (i < items.length - 1 ? ", " : "");
//            }
//        //    $("#selectionLog").text(selection);
//        }
//        displaySelectedItems();
//        $("#jqxlist").on('change', function () {
//            displaySelectedItems();
//        });
    };


//    function buildUI() {
//
//        console.log();
//        $("#"+ap_list_tab.CONFIG.custom_widget).append(ap_list_tab.tab_item_creation());
//        // init widgets.
//        var initWidgets = function (tab) {
//           // console.log("initWidgets start  ");
//            for(var i=0; i<ap_list_tab.CONFIG.tabs_num;i++)
//            {
//                //console.log("initWidgets i=  "+i+ " ap_list_tab.CONFIG.tabs_init_function[i] "+ap_list_tab.CONFIG.tabs_init_function[i]);
//                if((ap_list_tab.CONFIG.tabs_init_function[i]!=null)&&(!ap_list_tab.CONFIG.tabs_init_function[i].empty))
//                {
//                    //console.log("buildUI ap_list_tab.CONFIG.tab_sources[i] "+ap_list_tab.CONFIG.tab_sources[i]);
//                    ap_list_tab.CONFIG.tabs_init_function[i](ap_list_tab.CONFIG.tab_sources[i], ap_list_tab.CONFIG.tabs_id[i]);
//                }
//            }
//        }
//        // Create jqxTabs.
////        $('#jqxTabs').jqxTabs(ap_list_tab.CONFIG.property_object);
////        $('#jqxTabs').jqxTabs({initTabContent:initWidgets});
//        $('#'+ap_list_tab.CONFIG.main_tabs_id).jqxTabs(ap_list_tab.CONFIG.property_object);
//        $('#'+ap_list_tab.CONFIG.main_tabs_id).jqxTabs({initTabContent:initWidgets});
//    };
//
//    function tab_item_creation(){
////        var s="<div id='jqxTabs'><ul>";
//        var s="<div id='"+ap_list_tab.CONFIG.main_tabs_id+"'><ul>";
//        //Tab Title
//        for(var i=0; i<ap_list_tab.CONFIG.tabs_num;i++)
//        {
//            s += "<li>"+ap_list_tab.CONFIG.tabs_title[i]+"</li>";
//        }
//        s+='</ul>';
//        //Tab Content
//        for(var i=0; i<ap_list_tab.CONFIG.tabs_num;i++)
//        {
//            s+= '<div';
//            if((ap_list_tab.CONFIG.tabs_id[i]!=null)&&(!ap_list_tab.CONFIG.tabs_id[i].empty))
//            {
//                s += ' id='+ap_list_tab.CONFIG.tabs_id[i];
//            }
//                s += '>'+ap_list_tab.CONFIG.tabs_text[i]+'</div>';
//        }
//        s+='</div>';
//
//        return s;
//    };
//
//    //Functions to create the tab content
//    function init_list(tab_source, tab_id){
//       // console.log("in init_list tab_source "+tab_source);
////        var source = [
////            "Affogato2",
////            "Americano",
////            "Bicerin",
////            "Breve",
////            "Café Bombón",
////            "Café au lait",
////            "Caffé Corretto",
////            "Café Crema",
////            "Caffé Latte",
////            "Caffé macchiato",
////            "Café mélange",
////            "Coffee milk",
////            "Cafe mocha",
////            "Cappuccino",
////            "Carajillo",
////            "Cortado",
////            "Cuban espresso",
////            "Espresso",
////            "Eiskaffee",
////            "The Flat White",
////            "Frappuccino",
////            "Galao",
////            "Greek frappé coffee",
////            "Iced Coffee﻿",
////            "Indian filter coffee",
////            "Instant coffee",
////            "Irish coffee",
////            "Liqueur coffee"
////        ];
//        // Create a jqxListBox
//        $("#"+tab_id).jqxListBox({
//            source: tab_source, selectedIndex: 1, multipleextended: true, height: '100%', width:'100%',
//            rendered: function () {
//                $("#"+tab_id).jqxListBox('focus');
//            }
//        });
//        // display selected List Items.
////        var displaySelectedItems = function () {
////            var items = $("#jqxlist").jqxListBox('getSelectedItems');
////            var selection = "Selected Items: ";
////            for (var i = 0; i < items.length; i++) {
////                selection += items[i].label + (i < items.length - 1 ? ", " : "");
////            }
////        //    $("#selectionLog").text(selection);
////        }
////        displaySelectedItems();
////        $("#jqxlist").on('change', function () {
////            displaySelectedItems();
////        });
//    };

    return {
        CONFIG              :   CONFIG,
        init                :   init,
        init_list           :   init_list,
        tab_item_creation   :   tab_item_creation
    };

})();