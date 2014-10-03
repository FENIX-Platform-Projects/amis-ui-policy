define([
    'jquery',
    'selector_catalog/qd_selector_listbox',
    'selector_catalog/qd_selector_radiobuttongroup',
    'selector_catalog/qd_selector_sliderAndlistbox',
    'selector_catalog/qd_selector_button',
    'selector_catalog/qd_selector_menu_button'
], function($, QDSelectorListbox, QDSelectorRadioButtonGroup, QDSelectorSliderAndListbox, QDSelectorButton, QDSelectorMenuButton) {

    var optionsDefault = {
        selectors : [],
        type : ''
    };

    function QDCatalogSelector( o ) {
        if (this.options === undefined) {
            this.options = {};
        }

        $.extend(true, this.options, optionsDefault, o);
    }

    //This method is used to return the specific selector constructor
    QDCatalogSelector.prototype.selector_look_up = function(selector_type){

        var selector_func ='';
        switch(selector_type){
            case 'listbox':
                selector_func = QDSelectorListbox;
                break;
            case 'radiobuttongroup':
                selector_func = QDSelectorRadioButtonGroup;
                break;
            case 'sliderAndlistbox':
                selector_func = QDSelectorSliderAndListbox;
                break;
            case 'button':
                selector_func = QDSelectorButton;
                break;
            case 'menubutton':
                selector_func = QDSelectorMenuButton;
                break;
            default: selector_func = null;
        }

        return selector_func;
    };

    return QDCatalogSelector;
});
