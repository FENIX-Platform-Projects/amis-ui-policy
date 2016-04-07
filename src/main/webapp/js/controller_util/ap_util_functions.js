//var ap_utilFunctions = (function() {
define([
], function(){

    var users = null;

    function init(){

    };

    function data_compare(firt_dd, first_mm, first_yy, second_dd, second_mm, second_yy){
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
                else if(second_yy==first_yy)this.users = JSON.parse(AuthUsers);
                {
                    //The date are equal
                    return last_date = 'first';
                }
            }
        }
    };

    //If date_to_check is with one digit it becomes 0+date_to_check
    function data_change(date_to_check) {

        if((date_to_check!=null)&&(typeof date_to_check!='undefined')&&(date_to_check.length==1))
        {
            date_to_check = "0"+date_to_check;
        }

        return date_to_check;
    }

    function number_of_days_based_on_month(month) {

        var number_of_days = '28';

        if((month!=null)&&(typeof month!="undefined")){
            switch (month){
                case '02':
                    number_of_days = 28;
                    break;
                case '04','06','09','11' :
                    number_of_days = 30;
                    break;
                default:
                    number_of_days = 31;
                    break;
            }
        }

        return number_of_days;
    }

    function authentication(userFile, caller) {

        var logoutUserCode = -1;
        if(users!=null){
        }
        else{
            users = JSON.parse(userFile);
        }

        var sessionStorageValueAttr = sessionStorage.getItem("value");
        if((sessionStorageValueAttr!=null)&&(typeof sessionStorageValueAttr!="undefined")&&(sessionStorageValueAttr=='login')){
            //The user is already logged in
            var sessionStorageUserCodeAttr = sessionStorage.getItem("userCode");
            var sessionStorageSuperUser = sessionStorage.getItem("superUser");
            setLogginProperties(caller, sessionStorageUserCodeAttr, true);
            $('#fx-login-modal').modal('hide');
            $("#loginButtonId").hide();
            $("#logoutButtonId").show();
            $(".protected").removeClass("disabled");
            $("#dataentry_editPolicy").show();
            $("#dataentry_addPolicy").show();
        }else{
            var sessionStorageUserCodeAttr = sessionStorage.getItem("userCode");
            setLogginProperties(caller, sessionStorageUserCodeAttr, false);
            $(".protected").addClass("disabled");
            $("#dataentry_editPolicy").hide();
            $("#dataentry_addPolicy").hide();
        }

        resetLoginForm();

        $('#fx-login-form-submit').on('click', function(){
            var result = authenticate();
            if(result){
                $('#fx-login-modal').modal('hide');
                $("#loginButtonId").hide();
                $("#logoutButtonId").show();
                $(".protected").removeClass("disabled");
                $("#dataentry_editPolicy").show();
                $("#dataentry_addPolicy").show();
                if(typeof(Storage) != "undefined"){
                    // Store
                    var countryCodeValue = userCodeCreation();
                    var email = $("#fx-login-form-inputEmail").val();
                    if(email=="oecd@fao.org"){
                        sessionStorage.setItem("superUser", "OECD");
                        $("#fx_selector_8_3").show();
                        $("#fx_selector_8_4").show();
                    }
                    else{
                        $("#fx_selector_8_3").hide();
                        $("#fx_selector_8_4").hide();
                    }

                    if(typeof countryCodeValue!= 'undefined'){
                        sessionStorage.setItem("value", "login");
                        sessionStorage.setItem("userCode", countryCodeValue);
                        var sessionStorageUserCodeAttr = sessionStorage.getItem("userCode");
                        setLogginProperties(caller, sessionStorageUserCodeAttr, true);
                    }
                }
            }
            else{
                $("#fx-login-form-error-container").html("Invalid login! Email and password do not match.");
            }
        });

        $('#fx-logout-form-cancel').on('click', function(){
            $('#fx-logout-modal').modal('hide');
            $('.modal-backdrop').remove();
        });

        $('#fx-logout-form-submit').on('click', function(){
            $('#fx-logout-modal').modal('hide');
            $("#logoutButtonId").hide();
            $("#loginButtonId").show();
            $(".protected").addClass("disabled");
            $("#dataentry_editPolicy").hide();
            $("#dataentry_addPolicy").hide();
            resetLoginForm();
            sessionStorage.setItem("value", "logout");
            sessionStorage.setItem("userCode", logoutUserCode);
            sessionStorage.setItem("superUser", "");
            $("#fx_selector_8_3").hide();
            $("#fx_selector_8_4").hide();
            var sessionStorageUserCodeAttr = sessionStorage.getItem("userCode");
            setLogginProperties(caller, sessionStorageUserCodeAttr, false);
            $('.modal-backdrop').remove();
            if((caller!=null)&&(typeof caller!="undefined")){
                if((caller.options.button_preview_action_type == 'searchEditPolicy')||(caller.options.button_preview_action_type == 'searchCreatePolicy')){
                    //If the page is edit or add policy it's important to exit from protected area
                    (window.location = 'index.html').reload();
                }
            }
        });
    }

    function authenticate() {
        var email = $("#fx-login-form-inputEmail").val(),
            password = $("#fx-login-form-inputPassword").val(),
            user = users[email];
        if (user && user.password === password)
            return true;
        else
            return false;
    };

    function userCodeCreation() {
        var countryCodeValue = '';
        var email = $("#fx-login-form-inputEmail").val();
        if((email!=null)&&(typeof email!= 'undefined')){
            var user = users[email];
            if((user["country"]!=null)&&(typeof user["country"]!="undefined")&&(user["country"]["code"]!=null)&&(typeof user["country"]["code"]!="undefined")){
                countryCodeValue = user["country"]["code"];
            }
            else{
                countryCodeValue = -1;
            }
        }
        return countryCodeValue;
    };

    function resetLoginForm() {
        $("#fx-login-form-inputEmail").val('');
        $("#fx-login-form-inputPassword").val('');
    };

    function setLogginProperties(caller, sessionStorageUserCodeAttr, state) {
        //alert("setLogginProperties")
        //console.log("In setLogginProperties caller = "+caller)
        //console.log("sessionStorageUserCodeAttr = "+sessionStorageUserCodeAttr)
        //console.log("state = "+state)
        //state can be true= logged in user
        //or false= logged out
        if((caller!=null)&&(typeof caller!="undefined")){
            if(state){
                if((sessionStorageUserCodeAttr!=null)&&(typeof sessionStorageUserCodeAttr!="undefined")){
                    caller.options.logged_user_code = sessionStorageUserCodeAttr;
                }
            }
            else{
                caller.options.logged_user_code = caller.options.logged_user_default_code;
            }
        }
    };

    function countryToISO3conversion(properties){

        var code = properties.code;
        var label = properties.label;
        var isoCode = '';
        console.log("In countryToISO3conversion code = "+code)
        if((code!=null)&&(typeof code!='undefined')){
            switch (code){
                case 12:
                    isoCode = 'ARG';
                    break;
                case 17:
                    isoCode = 'AUS';
                    break;
                case 37:
                    isoCode = 'BRA';
                    break;
                case 46:
                    isoCode = 'CAN';
                    break;
                case 53:
                    isoCode = 'CHN';
                    break;
                case 40765:
                    isoCode = 'EGY';
                    break;
                case 999000:
                    isoCode = 'EUN';
                    break;
                case 85:
                    isoCode = 'FRA';
                    break;
                case 93:
                    isoCode = 'DEU';
                    break;
                case 115:
                    isoCode = 'IND';
                    break;
                case 116:
                    isoCode = 'IDN';
                    break;
                case 122:
                    isoCode = 'ITA';
                    break;
                case 126:
                    isoCode = 'JPN';
                    break;
                case 132:
                    isoCode = 'KAZ';
                    break;
                case 162:
                    isoCode = 'MEX';
                    break;
                case 182:
                    isoCode = 'NGA';
                    break;
                case 196:
                    isoCode = 'PHL';
                    break;
                case 202:
                    isoCode = 'KOR';
                    break;
                case 204:
                    isoCode = 'RUS';
                    break;
                case 215:
                    isoCode = 'SAU';
                    break;
                case 227:
                    isoCode = 'ZAF';
                    break;
                case 229:
                    isoCode = 'ESP';
                    break;
                case 240:
                    isoCode = 'THA';
                    break;
                case 249:
                    isoCode = 'TUR';
                    break;
                case 256:
                    isoCode = 'GBR';
                    break;
                case 254:
                    isoCode = 'UKR';
                    break;
                case 259:
                    isoCode = 'USA';
                    break;
                case 264:
                    isoCode = 'VNM';
                    break;
                default: isoCode = '';
            }
        }
        else if((label!=null)&&(typeof label!='undefined')){
            switch (label){
                case 'Argentina':
                    isoCode = 'ARG';
                    break;
                case 'Australia':
                    isoCode = 'AUS';
                    break;
                case 'Brazil':
                    isoCode = 'BRA';
                    break;
                case 'Canada':
                    isoCode = 'CAN';
                    break;
                case 'China':
                    isoCode = 'CHN';
                    break;
                case 'Egypt':
                    isoCode = 'EGY';
                    break;
                case 'European Union':
                    isoCode = 'EUN';
                    break;
                case 'France':
                    isoCode = 'FRA';
                    break;
                case 'Germany':
                    isoCode = 'DEU';
                    break;
                case 'India':
                    isoCode = 'IND';
                    break;
                case 'Indonesia':
                    isoCode = 'IDN';
                    break;
                case 'Italy':
                    isoCode = 'ITA';
                    break;
                case 'Japan':
                    isoCode = 'JPN';
                    break;
                case 'Kazakhstan':
                    isoCode = 'KAZ';
                    break;
                case 'Mexico':
                    isoCode = 'MEX';
                    break;
                case 'Nigeria':
                    isoCode = 'NGA';
                    break;
                case 'Philippines':
                    isoCode = 'PHL';
                    break;
                case 'Republic of Korea':
                    isoCode = 'KOR';
                    break;
                case 'Russian Federation':
                    isoCode = 'RUS';
                    break;
                case 'Saudi Arabia':
                    isoCode = 'SAU';
                    break;
                case 'South Africa':
                    isoCode = 'ZAF';
                    break;
                case 'Spain':
                    isoCode = 'ESP';
                    break;
                case 'Thailand':
                    isoCode = 'THA';
                    break;
                case 'Turkey':
                    isoCode = 'TUR';
                    break;
                case 'United Kingdom':
                    isoCode = 'GBR';
                    break;
                case 'Ukraine':
                    isoCode = 'UKR';
                    break;
                case 'United States of America':
                    isoCode = 'USA';
                    break;
                case 'Viet Nam':
                    isoCode = 'VNM';
                    break;
                default: isoCode = '';
            }
        }
        return isoCode;
    }

    function sharedGroupCode_letter(policyMeasureCode){

        var letter = '';
        if((policyMeasureCode!=null)&&(typeof policyMeasureCode!='undefined')){
            switch(policyMeasureCode){
                //export_quota_code
                case '2': letter = 'R';
                    break;
                //export_subsidies_code
                case '3': letter = 'X';
                    break;
                //tariff_quotas_code
                case '12': letter = 'Q';
                    break;
                default : '';
            }
        }
        return letter;
    }

    //ISO3 COUNTRY CODE
    //ARG;Argentina
    //AUS;Australia
    //BRA;Brazil
    //CAN;Canada
    //CHN;China
    //EGY;Egypt
    //EUN;European Union
    //FRA;France
    //DEU;Germany
    //IND;India
    //IDN;Indonesia
    //ITA;Italy
    //JPN;Japan
    //KAZ;Kazakhstan
    //MEX;Mexico
    //NGA;Nigeria
    //PHL;Philippines
    //KOR;Republic of Korea
    //RUS;Russian Federation
    //SAU;Saudi Arabia
    //ZAF;South Africa
    //ESP;Spain
    //THA;Thailand
    //TUR;Turkey
    //GBR;United Kingdom
    //UKR;Ukraine
    //USA;United States of America
    //VNM;Viet Nam
    //
    //12;Argentina
    //17;Australia
    //37;Brazil
    //46;Canada
    //53;China
    //40765;Egypt
    //999000;European Union
    //85;France
    //93;Germany
    //115;India
    //116;Indonesia
    //122;Italy
    //126;Japan
    //132;Kazakhstan
    //162;Mexico
    //182;Nigeria
    //196;Philippines
    //202;Republic of Korea
    //204;Russian Federation
    //215;Saudi Arabia
    //227;South Africa
    //229;Spain
    //240;Thailand
    //249;Turkey
    //256;United Kingdom
    //254;Ukraine
    //259;United States of America
    //264;Viet Nam


    return {
        init : init,
        data_compare : data_compare,
        data_change : data_change,
        number_of_days_based_on_month: number_of_days_based_on_month,
        authentication : authentication,
        countryToISO3conversion : countryToISO3conversion,
        sharedGroupCode_letter : sharedGroupCode_letter
    }
});

//window.addEventListener('load', ap_utilFunctions.init, false);

