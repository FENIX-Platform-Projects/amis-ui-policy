//var ap_utilFunctions = (function() {
define([
], function(){

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
                else if(second_yy==first_yy)
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


    return {
        init : init,
        data_compare : data_compare,
        data_change : data_change
         }
});

//window.addEventListener('load', ap_utilFunctions.init, false);

