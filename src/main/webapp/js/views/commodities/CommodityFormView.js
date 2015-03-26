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

            this.renderHsCode();

            this.renderCommodityClass();

        },

        renderHsCode: function () {

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
                that.$el.find("#commodities-search-form-commodityClass").jqxComboBox(
                    {   source: dataAdapter,
                        displayMember: "label",
                        valueMember: "code"});
            });

        },

        getFilter: function () {

            var payload = {};

            payload["commodityClassCode"] = this.$el.find("#commodities-search-form-commodityClass").jqxComboBox('val');

            payload["hsCode"] = 0;

            return payload;
        }

    });

    return view;

});