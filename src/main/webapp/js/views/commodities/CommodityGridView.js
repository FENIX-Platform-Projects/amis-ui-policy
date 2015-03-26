define([
    'jquery',
    'backbone',
    'collections/CommodityCollection',
    "jqwidgets"
], function ($, Backbone, CommodityCollection) {

    var view = Backbone.View.extend({

        initialize: function (options) {

            this.el = options.el;

        },

        render: function () {

            var that = this;
            var collection = new CommodityCollection();

            collection.fetch({
                success: function (commodities, response) {
                    that.renderGrid(response)
                }
            })

        },

        renderGrid: function (commodities) {

            var source = {
                datatype: "array",
                datafields: [
                    { name: 'commodityId', type: 'string' },
                    { name: 'countryName', type: 'string' },
                    { name: 'hsCode', type: 'string'},
                    { name: 'description', type: 'string' },
                    { name: 'shortDescription', type: 'string'},
                    { name: 'commodityClassName', type: 'string'},
                    { name: 'commodityClassCode', type: 'string'}
                ],
                id: 'commodityId',
                localdata: commodities
            };

            var dataAdapter = new $.jqx.dataAdapter(source);

            this.$el.jqxGrid({
                source: dataAdapter,
                width: "100%",
                columnsresize: true,
                pageable: true,
                autoheight: true,
                columns: [
                    { text: 'Id', datafield: 'commodityId' },
                    { text: 'Country', datafield: 'countryName' },
                    { text: 'HS Code', datafield: 'hsCode' },
                    { text: 'Desc', datafield: 'description' },
                    { text: 'Short Desc', datafield: 'shortDescription' },
                    { text: 'Comm class', datafield: 'commodityClassName' }
                ]
            });
        },

        destroy: function () {
            this.$el.jqxGrid('destroy');
        }

    });

    return view;

});