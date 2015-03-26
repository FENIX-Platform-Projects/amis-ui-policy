define([
    'jquery',
    'backbone',
    "jqwidget"
], function ($, Backbone) {

    var view = Backbone.View.extend({

        initialize: function (options) {

            this.el = options.el;

        },

        render: function () {

            this.renderComponents();

        },

        renderComponents: function () {

            this.renderCountryList();

            this.renderPolicyDomain();

            this.renderPolicyMeasure();

            this.renderCommodityClass();

        },

        renderCountryList: function () {

            var url = "http://faostat3.fao.org/d3sp/service/msd/cl/system/OECD_Country/1.0",
                that = this;

            $.getJSON(url, function (data) {

                var localdata = data.rootCodes.sort(function (a, b) {
                    if (a.title.EN < b.title.EN)
                        return -1;
                    if (a.title.EN > b.title.EN)
                        return 1;
                    return 0;
                })

                // prepare the data
                var source =
                {
                    datatype: "json",
                    datafields: [
                        { name: 'code' },
                        { name: 'label', map: "title>EN" }
                    ],
                    localdata: localdata
                };
                var dataAdapter = new $.jqx.dataAdapter(source);
                // Create a jqxComboBox
                that.$el.find("#cpls-search-form-country").jqxComboBox(
                    {   source: dataAdapter,
                        displayMember: "label",
                        valueMember: "code"});
            }).error(function(){
                alert("error")
            });;

        },

        renderPolicyDomain: function () {

        },

        renderPolicyMeasure: function () {

        },

        renderCommodityClass: function () {

            var url = "http://faostat3.fao.org/d3sp/service/msd/cl/system/OECD_CommodityClass/1.0",
                that = this;

            $.getJSON(url, function (data) {

                var localdata = data.rootCodes.sort(function (a, b) {
                    if (a.title.EN < b.title.EN)
                        return -1;
                    if (a.title.EN > b.title.EN)
                        return 1;
                    return 0;
                });

                // prepare the data
                var source =
                {
                    datatype: "json",
                    datafields: [
                        { name: 'code' },
                        { name: 'label', map: "title>EN" }
                    ],
                    localdata: localdata
                };
                var dataAdapter = new $.jqx.dataAdapter(source);
                // Create a jqxComboBox
                that.$el.find("#cpls-search-form-commodityClass").jqxComboBox(
                    {   source: dataAdapter,
                        displayMember: "label",
                        valueMember: "code"});
            });

        },

        getFilter: function () {

            var payload = {};

            payload["countryCode"] = this.$el.find("#cpls-search-form-country").jqxComboBox('val');
            payload["commodityClassCode"] = this.$el.find("#cpls-search-form-commodityClass").jqxComboBox('val');

            payload["policyDomainCode"] = 0;
            payload["policyMeasureCode"] = 0;

            return payload;
        }

    });

    return view;

});