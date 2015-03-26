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

            this.renderDates();

            this.renderCommodityClass();

        },

        renderDates: function () {

            $("#policies-search-form-from").jqxDateTimeInput(
                { value: new Date(1990, 0, 1)}
            ).on('valuechanged', function (e) {
                    $("#policies-search-form-to").jqxDateTimeInput('setMinDate', $("#policies-search-form-from").jqxDateTimeInput('val'));
                });

            $("#policies-search-form-to").jqxDateTimeInput(
                {}
            ).on('valuechanged', function (e) {
                    $("#policies-search-form-from").jqxDateTimeInput('setMaxDate', $("#policies-search-form-to").jqxDateTimeInput('val'));
                });
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
                that.$el.find("#policies-search-form-commodityClass").jqxComboBox(
                    {   source: dataAdapter,
                        displayMember: "label",
                        valueMember: "code"});
            });

        },

        renderSource: function () {

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
                that.$el.find("#policies-search-form-commodityClass").jqxComboBox(
                    {   source: dataAdapter,
                        displayMember: "label",
                        valueMember: "code"});
            });

        },

        getFilter: function () {

            var payload = {},
                from = this.$el.find("#policies-search-form-from").jqxDateTimeInput('getDate'),
                to = this.$el.find("#policies-search-form-to").jqxDateTimeInput('getDate');

            payload["startDate"] = $.jqx.dataFormat.formatdate(from, 'yyyy-MM-dd');
            payload["endDate"] = $.jqx.dataFormat.formatdate(to, 'yyyy-MM-dd');
            payload["commodityClassCode"] = this.$el.find("#policies-search-form-commodityClass").jqxComboBox('val');

            payload["cplId"] = 0;
            payload["commodityId"] = 0;

            return payload;
        }

    });

    return view;

});