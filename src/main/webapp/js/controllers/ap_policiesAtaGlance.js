var ap_policiesAtaGlance = define([
    'ap_sidemenu',
    'ap_policiesAtaGlance_biofuelPolicyTypes_util',
    'ap_policiesAtaGlance_biofuelPolicyMeasures_util',
    'ap_policiesAtaGlance_exportRestrictions_util',
    'ap_policiesAtaGlance_exportSubsidies_util',
    'ap_policiesAtaGlance_importTariffsQuotas_util',
    'ap_util_variables',
    'ap_util_functions',
    'structure',
    'text!json/conf.json',
    'jquery',
    'commons',
    'history',
    'bootstrap',
    'xDomainRequest'
], function( ap_sidemenu, ap_policiesAtaGlance_biofuelPolicyTypes_util , ap_policiesAtaGlance_biofuelPolicyMeasures_util, ap_policiesAtaGlance_exportRestrictions_util, ap_policiesAtaGlance_exportSubsidies_util, ap_policiesAtaGlance_importTariffsQuotas_util, ap_utilVariables, ap_utilFunctions, Structure, conf){
//var ap_policiesAtaGlance = (function() {

    var State       = {},
        lang        = 'EN',
        //json_config = 'json/view.json',
        json_config = 'json/policiesAtaGlance.json',
        s_content   = '#content',
        s_header    = '#header',
        s_footer    = '#footer',
        s_newsslider = '#newsslider',
       // s_topmenu   = '#top_menu',
        s_sidemenu  = '#sidemenu',
        objs        = [],
        objs_rendered = [],
        initSec     = 'initialized',
        alertcont   = 'alert-container';

    var $content, $header, $footer, $slider, tab, sec, lang, magic;

//    function Ap_policiesAtaGlance(){
//
//    };

    function init(){

        var callbacks = {
            "policiesAtaGlance_biofuelPolicyTypes" : function(){
                browseData_sideMenu0();
            },
            "policiesAtaGlance_biofuelPolicyMeasures" : function(){
                browseData_sideMenu1();
            },
            "policiesAtaGlance_importTariffsQuotas" : function(){
                browseData_sideMenu4();
            },
            "policiesAtaGlance_exportSubsidies" : function(){
                browseData_sideMenu3();
            },
            "policiesAtaGlance_exportRestrictions" : function(){
                browseData_sideMenu2();
            }
        };

        new Structure().initialize(JSON.parse(conf), callbacks);
    }

//    function init(){
//        //alert("In init");
//        $content  = $(s_content);
//        $header   = $(s_header);
//        $footer   = $(s_footer);
//        $slider   = $(s_newsslider);
//       // alert("Before initEventListeners");
//        initEventListeners();
//        initHistory();
//
//       // fx_topmenu ? fx_topmenu.init(ap_policiesAtaGlance, document.querySelector(s_topmenu)) : alert('No fx_topmenu.js found');
//        ap_sidemenu ? ap_sidemenu.init({
////            json        : 'json/fx_sidemenu_view.json',
//            json        : 'json/ap_sidemenu_policiesAtaGlance.json',
//            controller  : ap_policiesAtaGlance,
//            container   : s_sidemenu
//        }) : alert('No ap_sidemenu.js found');
//
//        //Register the objs overlooked by the controller
//       // objs.push(fx_topmenu);
//        objs.push(ap_sidemenu);
//        objs.push('fx_footer');
//        objs.push('fx_content');
//        objs.push('fx_header');
//        objs.push('fx_newsslider');
//
//        $.getJSON(json_config, function(result){
//
//            json_pageelem = result;
//            var state = {};
//
//            //get 'tab' from URL
//            var t = getQuerystringParam()['tab'];
//            var arrayTab = Object.keys( json_pageelem.content);
//
//            if (t){
//                var it = $.inArray(t, arrayTab);
//                if (it > -1) state.tab = arrayTab[it];
//                else state.tab = arrayTab[0]
//            } else {
//                state.tab = arrayTab[0]
//            }
//
//            //Lang
//            var l = getQuerystringParam()['lang'];
//            var arrayLang = Object.keys( json_pageelem.content[state.tab]['html']);
//
//            if (l){
//                var il = $.inArray(l.toUpperCase(), arrayLang);
//                if (il > -1) state.lang = arrayLang[il];
//                else state.lang = arrayLang[0];
//            } else state.lang = arrayLang[0];
//
//            //Sec
//            var s = getQuerystringParam()['sec'];
//            if (s) state.sec = s;
//
//            //For the objs that needs the controller lang to render
//            lang = state.lang;
//            tab = state.tab;
//            if (state.sec) {
//                sec = state.sec;
//                initSec = state.sec;
//            }
//
//            State.data = state;
//
//            // Replace the first History State with che params
//            var url = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
//            var queries = location.search.substring(1);
//            if (queries) url += '?'+queries;
//           // History.replaceState(State.data, "View", url);
//
//            renderPage();
//
//        }).error(function() { showErrorMsg("Impossible to load the Config JSON", alertcont); });
//
//    };

    function initEventListeners(){
       // alert("In initEventListeners");
        document.body.addEventListener("itemselected.sidemenu.view", function(event){
           // alert("itemselected.sidemenu.view !!!!");
            var t = event.detail.tab.trim();
            $(window).scrollTop(0);
            if (tab !== t){ pushState('tab', t, 'View - sec'); }

        }, false);

        document.body.addEventListener("subitemselected.sidemenu.view", function(event){
            if (State.data.scrollspy) delete State.data.scrollspy;
            var s = event.detail.elem.substring(1);
            if (sec !== s){ pushState('sec', s, 'View - sec'); }
        }, false);

        document.body.addEventListener("langchage.topmenu.fenix", function(event){
            var l = event.detail.lang;
            if (lang !== l){ pushState('lang', l, 'View - lang'); }
        }, false);

        document.body.addEventListener("loadcompleted.page.fenix", function(event){

            if (initSec !== 'null' && initSec !== 'initialized'){

                var $target = $('#'+initSec);

                var off = parseInt($target.offset().top, 10) - $('.navbar').outerHeight(true) + 10;
                $(window).scrollTop(off);
                ap_sidemenu.selectSubitem(initSec);
                initSec = 'initialized';
            }
           // alert("loadcompleted.page.fenix !!!!");
            giveMagic();

        }, false);

        document.body.addEventListener("loadcompleted.widget.fenix", function(event){
           // alert(" objs.length "+objs.length+" renderedObjs.length "+renderedObjs.length);
            renderedObjs.push(event.detail.id);
            if (event.detail.id === "ap_sidemenu"){ initPage(); }
            if (renderedObjs.length === objs.length){ raiseCustomEvent(document.body, "loadcompleted.page.fenix", null); }

        }, false);

        //Update the URL accrodring to the position of the page
        $(window).scrollStopped(function(){
            var s = $('#sidemenu ul ul li[class="active"]').data('tab');
            pushState('sec', s, 'View - sec', true);
        });
       // alert("End initEventListeners");
    }

    function initHistory(){

        History.Adapter.bind(window,'statechange',function(){

            State = History.getState();

            if (State.data.tab !== tab){

                ap_sidemenu.selectItem(State.data.tab);
                renderHeader();
                renderContent();
                tab = State.data.tab;
                if (sec) delete sec;
            }

            if (State.data.sec !== sec){
                if (State.data.scrollspy && State.data.scrollspy === 'scrollspy'){
                    //do nothing
                } else {
                    var $target = $('#'+State.data.sec);
                    var off = 0;
                    if ($target.length > 0) off = parseInt($target.offset().top, 10) - $('.navbar').outerHeight(true) + 10;
                    $(window).scrollTop(off);
                }

                if (State.data.sec) {
                    var $s = $('li[data-tab="'+State.data.sec+'"]');
                    $s.parent().find('li').removeClass('active')
                    $s.addClass('active');
                }

                sec = State.data.sec;
            }

            if (State.data.lang !== lang){

                var sec = getQuerystringParam()['sec'];
                if (sec) initSec = sec;

                lang = State.data.lang;

                renderPage();
            }
        });

    }

    function initPage(){
        var t = State.data.tab;
        var s = State.data.sec;

        if (s && s !== 'null'){ initSec = s; }

        if (!t){ ap_sidemenu.selectItem('maps');
        } else { ap_sidemenu.selectItem(t); }

    }

    function giveMagic(){
        //alert("giveMagic ");
        $(".fx-sidebar li").click(function(e) { e.stopPropagation(); })

        var navHeight = $('.navbar').outerHeight(true) + 30;
       // alert("navHeight "+navHeight);
        $(document.body).scrollspy({
            target: '.fx-sidebar',
            offset: navHeight});

        // back to top
        setTimeout(function () {

            var $sideBar = $('#sidemenu')

            $sideBar.affix({
                offset: {
                    top: function () {
                        var offsetTop      = $sideBar.offset().top
                        var sideBarMargin  = parseInt($sideBar.children(0).css('margin-top'), 10)
                       // var navOuterHeight = $('.fx-main-nav').height()

//                        console.log(offsetTop)
//                        console.log(sideBarMargin)
//                        console.log(navOuterHeight)

//                        return (this.top = offsetTop - navOuterHeight - sideBarMargin)
                        return (this.top = offsetTop - sideBarMargin)
                    }
                    , bottom: function () {
                        return (this.bottom = $('.fx-footer').outerHeight(true))
                    }
                }
            })
        }, 100)

        magic = true;

    }

    function renderPage(){

        renderedObjs = [];

        //fx_topmenu.render();
        ap_sidemenu.render();

        renderHeader();
        renderContent();
        renderFooter();
        renderNewsslider();
    }

    function renderContent() {

        var p = json_pageelem['content'][State.data.tab]
        loadAjaxContent(s_content, p['html'][State.data.lang],
            {msg: 'fx_content',
                scrollspy: true,
                callback: p['callback'] ? p['callback'] : null});

    }

    function renderHeader(){

        var p = json_pageelem['header'][State.data.tab][State.data.lang]
        loadAjaxContent(s_header, p, {msg : 'fx_header'});

    }

    function renderFooter(){

        var p = json_pageelem['footer'][State.data.lang]
        loadAjaxContent(s_footer, p, {msg : 'fx_footer'});

    }

    function renderNewsslider(){
        //$slider.html('<div class="container"><strong>NEWS</strong> - Item 1</div>');
        raiseCustomEvent(document.body, "loadcompleted.widget.fenix", {id: "fx_newsslider"});

    }

    function editState(k, v){  State.data[k] = v; }

    function pushState(k, v, t, l){

        if (l && l===true) editState('scrollspy', 'scrollspy');

        editState(k, v);
        var u = updateQuerystringParam(k, v);
        History.pushState(State.data, t, u);

    }

    function loadAjaxContent(target, html, d) {

        var animationDuration = 200;

        if(html){
            $.ajax({
                url: html,
                success: function(data) {

                    $(target).fadeOut(animationDuration, function(){
                        $(target).html(data);
                        $(target).fadeIn(animationDuration, function(){
                            if (d.callback) eval(d.callback)
                            if (d.scrollspy === true && magic) { $(document.body).scrollspy('refresh'); }
                            raiseCustomEvent(document.body, "loadcompleted.widget.fenix", {id: d.msg});
                        })
                    })
                }
            });
        }

    }

    function browseData_sideMenu0(){
//        ap_policiesAtaGlance_biofuelPolicyTypes_util.subMenu0();
//        ap_policiesAtaGlance_biofuelPolicyTypes_util.subMenu1();
//       // ap_policiesAtaGlance_biofuelPolicyTypes_util.subMenu2();
//        ap_policiesAtaGlance_biofuelPolicyTypes_util.subMenu3();
        var page_obj ={};
        page_obj.type = 'biofuelPolicyTypes';
        page_obj.instance = ap_policiesAtaGlance_biofuelPolicyTypes_util;
        startAndDate(page_obj);
    }

    function browseData_sideMenu1(){
//        ap_policiesAtaGlance_biofuelPolicyMeasures_util.subMenu0();
//      //  ap_policiesAtaGlance_biofuelPolicyMeasures_util.subMenu1();
//        ap_policiesAtaGlance_biofuelPolicyMeasures_util.subMenu2();
//        ap_policiesAtaGlance_biofuelPolicyMeasures_util.subMenu3();
        var page_obj ={};
        page_obj.type = 'biofuelPolicyMeasures';
        page_obj.instance = ap_policiesAtaGlance_biofuelPolicyMeasures_util;
        startAndDate(page_obj);
    }

    function browseData_sideMenu2(){
//        ap_policiesAtaGlance_exportRestrictions_util.subMenu0();
//        ap_policiesAtaGlance_exportRestrictions_util.subMenu1();
//       // ap_policiesAtaGlance_exportRestrictions_util.subMenu2();
//        ap_policiesAtaGlance_exportRestrictions_util.subMenu3();
//console.log("browseData_sideMenu2");
        var page_obj ={};
        page_obj.type = 'exportRestrictions';
        page_obj.instance = ap_policiesAtaGlance_exportRestrictions_util;
        startAndDate(page_obj);
    }

    function browseData_sideMenu3(){
//        console.log("browseData_sideMenu3");
        var obj = new Object();
        obj.start_date_dd = '01';
        obj.start_date_mm = '01';
        obj.start_date_yy = '1995';
        obj.end_date_dd = '01';
        obj.end_date_mm = '01';
        obj.end_date_yy = '2011';

        ap_policiesAtaGlance_exportSubsidies_util.subMenu0(obj);
//        ap_policiesAtaGlance_exportSubsidies_util.subMenu1();
       // ap_policiesAtaGlance_exportSubsidies_util.subMenu2();
       // ap_policiesAtaGlance_exportSubsidies_util.subMenu3();
    }

    function browseData_sideMenu4(){
//        console.log("browseData_sideMenu4");
        var obj = new Object();
        obj.start_date_yy = '2010';
        obj.end_date_yy = '2013';
        ap_policiesAtaGlance_importTariffsQuotas_util.subMenu1(obj);
        //ap_policiesAtaGlance_importTariffsQuotas_util.subMenu2(obj);
      //  ap_policiesAtaGlance_importTariffsQuotas_util.subMenu2();
       // ap_policiesAtaGlance_importTariffsQuotas_util.subMenu3();
    }

//    function browseData_sideMenu5(){
//        ap_policiesAtaGlance_policyByCommodities_util.subMenu0();
//        ap_policiesAtaGlance_policyByCommodities_util.subMenu1();
//        ap_policiesAtaGlance_policyByCommodities_util.subMenu2();
//        ap_policiesAtaGlance_policyByCommodities_util.subMenu3();
//    }

    function startAndDate(page) {
        /* Retrive UI structure from DB. */
        $.ajax({


            type: 'GET',
            url: 'http://'+ap_utilVariables.CONFIG.base_ip_address+':'+ap_utilVariables.CONFIG.base_ip_port+ap_utilVariables.CONFIG.startAndEndDate_url+ '/' + ap_utilVariables.CONFIG.datasource,

            success : function(response) {

                /* Convert the response in an object, i fneeded. */
                var json = response;
                if (typeof(response) == 'string')
                    json = $.parseJSON(response);
                //if it's true there is at least one value in the end_date column that is null
                var end_date_null = json[0][0];
                //  console.log("year = "+json);
                var start_date_dd = json[1][1];
                var start_date_mm = json[1][2];
                var start_date_yy = json[1][3];
                var final_start_date = start_date_dd+"/"+start_date_mm+"/"+start_date_yy;
                var start_date_dd_int = parseInt(start_date_dd);
                var start_date_mm_int = parseInt(start_date_mm)-1;
                var start_date_yy_int = parseInt(start_date_yy);
//                console.log("start_date_dd = "+start_date_dd);
//                console.log("start_date_mm = "+start_date_mm);
//                console.log("start_date_yy = "+start_date_yy);
//                console.log("final_start_date = "+final_start_date);
                //End date
                var end_date = json[1][0];
                var end_date_dd = json[1][4];
                var end_date_mm = json[1][5];
                var end_date_yy = json[1][6];
                var end_date_dd_today = "";
                var end_date_mm_today = "";
                var end_date_yy_today = "";
                var end_date_dd_int = '';
                var end_date_mm_int = '';
                var end_date_yy_int = '';
//                console.log("end_date = "+end_date);
//                console.log("end_date_dd = "+end_date_dd);
//                console.log("end_date_mm = "+end_date_mm);
//                console.log("end_date_yy = "+end_date_yy);

                var final_end_date = "";
                if(end_date_null == 'true')
                {
                    //Means that there is also the date = null -> actual date
                    //Compare actual date with the max date to see wich is the best date
                    var today = new Date();
                    end_date_dd_today = today.getDate();
                    end_date_mm_today = today.getMonth()+1; //January is 0!
                    end_date_yy_today = today.getFullYear();
                    if((end_date != null)&&(typeof end_date != 'undefined'))
                    {
                        //Comparing Max end_date with today date
                        //Which is the last?
                        var best_date = ap_utilFunctions.data_compare(end_date_dd, end_date_mm, end_date_yy, end_date_dd_today, end_date_mm_today, end_date_yy_today);
                        if(best_date=='first')
                        {
                            final_end_date = end_date_dd+"/"+end_date_mm+"/"+end_date_yy;
                            end_date_dd_int = parseInt(end_date_dd);
//                            end_date_mm_int = parseInt(end_date_mm)-1;
                            end_date_mm_int = parseInt(end_date_mm);
                            end_date_yy_int = parseInt(end_date_yy);
                        }
                        else if(best_date=='second')
                        {
                            final_end_date = end_date_dd_today+"/"+end_date_mm_today+"/"+end_date_yy_today;
                            end_date_dd_int = parseInt(end_date_dd_today);
//                            end_date_mm_int = parseInt(end_date_mm_today)-1;
                            end_date_mm_int = parseInt(end_date_mm_today);
                            end_date_yy_int = parseInt(end_date_yy_today);
                        }
                    }
                    else{
                        final_end_date = end_date_dd_today+"/"+end_date_mm_today+"/"+end_date_yy_today;
                        end_date_dd_int = parseInt(end_date_dd_today);
//                        end_date_mm_int = parseInt(end_date_mm_today)-1;
                        end_date_mm_int = parseInt(end_date_mm_today);
                        end_date_yy_int = parseInt(end_date_yy_today);
                    }
                }
                else
                {
                    //End_date column contains only not null values
                    //end_date = Max end_date
                    final_end_date = end_date_dd+"/"+end_date_mm+"/"+end_date_yy;
                    end_date_dd_int = parseInt(end_date_dd);
//                    end_date_mm_int = parseInt(end_date_mm)-1;
                    end_date_mm_int = parseInt(end_date_mm);
                    end_date_yy_int = parseInt(end_date_yy);
                }
//                ap_policiesAtaGlance_biofuelPolicyTypes_util.subMenu0(start_date_dd_int, start_date_mm_int, start_date_yy_int, end_date_dd_int, end_date_mm_int, end_date_yy_int);
//                ap_policiesAtaGlance_biofuelPolicyTypes_util.subMenu1();
//                // ap_policiesAtaGlance_biofuelPolicyTypes_util.subMenu2();
//                ap_policiesAtaGlance_biofuelPolicyTypes_util.subMenu3();

                if((page !=null)&&(typeof page!='undefined'))
                {
                    if((page.type !=null)&&(typeof page.type!='undefined')){
                        switch (page.type){
                            case 'biofuelPolicyTypes':
                                end_date_yy_int = 2016;
//                                console.log("biofuelPolicyTypes !!!!!!!!!!!!!!!!!!!!!");
//                                console.log(start_date_dd_int +"-"+start_date_mm_int+"-"+start_date_yy_int);
//                                console.log(end_date_dd_int +"-"+end_date_mm_int+"-"+end_date_yy_int)
                                //page.instance.subMenu0(start_date_dd_int, start_date_mm_int, start_date_yy_int, end_date_dd_int, end_date_mm_int, end_date_yy_int);
                                page.instance.subMenu0(ap_utilVariables.CONFIG.start_date_dd_int_for_chart, ap_utilVariables.CONFIG.start_date_mm_int_for_chart, ap_utilVariables.CONFIG.start_date_yy_int_for_chart_biofuelPolicy, end_date_dd_int, end_date_mm_int, end_date_yy_int, ap_utilVariables.CONFIG.start_date_yy_int_for_chart_timeSeries_biofuelPolicy);
                                page.instance.subMenu1();
                                // ap_policiesAtaGlance_biofuelPolicyTypes_util.subMenu2();
                                page.instance.subMenu3(0);
                                break;
                            case 'biofuelPolicyMeasures':
                                end_date_yy_int = 2016;
//                                console.log("biofuelPolicyMeasures !!!!!!!!!!!!!!!!!!!!!!");
//                                console.log(start_date_dd_int +"-"+start_date_mm_int+"-"+start_date_yy_int);
//                                console.log(end_date_dd_int +"-"+end_date_mm_int+"-"+end_date_yy_int);
                                //page.instance.subMenu0(start_date_dd_int, start_date_mm_int, start_date_yy_int, end_date_dd_int, end_date_mm_int, end_date_yy_int);
                                page.instance.subMenu0(ap_utilVariables.CONFIG.start_date_dd_int_for_chart, ap_utilVariables.CONFIG.start_date_mm_int_for_chart, ap_utilVariables.CONFIG.start_date_yy_int_for_chart_biofuelPolicy, end_date_dd_int, end_date_mm_int, end_date_yy_int, ap_utilVariables.CONFIG.start_date_yy_int_for_chart_timeSeries_biofuelPolicy);
                               // page.instance.subMenu1();
                                // ap_policiesAtaGlance_biofuelPolicyTypes_util.subMenu2();
                                //page.instance.subMenu3();
                                break;
                            case 'exportRestrictions':
                                end_date_yy_int = 2016;
//                                console.log("exportRestrictions !!!!!!!!!!!!!!!!!!!!!!");
//                                console.log(start_date_dd_int +"-"+start_date_mm_int+"-"+start_date_yy_int);
//                                console.log(end_date_dd_int +"-"+end_date_mm_int+"-"+end_date_yy_int);
                                //page.instance.subMenu0(start_date_dd_int, start_date_mm_int, start_date_yy_int, end_date_dd_int, end_date_mm_int, end_date_yy_int);
                                page.instance.subMenu0(ap_utilVariables.CONFIG.start_date_dd_int_for_chart, ap_utilVariables.CONFIG.start_date_mm_int_for_chart, ap_utilVariables.CONFIG.start_date_yy_int_for_chart_exportRestriction, end_date_dd_int, end_date_mm_int, end_date_yy_int, ap_utilVariables.CONFIG.start_date_yy_int_for_chart_timeSeries_exportRestriction);
                                // page.instance.subMenu1();
                                // ap_policiesAtaGlance_biofuelPolicyTypes_util.subMenu2();
                                //page.instance.subMenu3();
                                break;
                        }
                    }
                }
            },

            error : function(err,b,c) {
               // alert(err.status + ", " + b + ", " + c);
            }
        });
    }

    return {  init : init,
        lang : function(){ return lang; }
        //Ap_policiesAtaGlance : Ap_policiesAtaGlance
    }

});