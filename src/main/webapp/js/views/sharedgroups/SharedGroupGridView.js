define([
    'jquery',
    'backbone',
    'collections/SharedGroupCollection',
    "jqwidget"
], function ($, Backbone, SharedGroupCollection) {

    var view = Backbone.View.extend({

        initialize: function (options) {

            this.el = options.el;

        },

        render: function () {

            var that = this;
            var collection = new SharedGroupCollection();

            collection.fetch({
                success: function (commodities, response) {
                    that.renderGrid(response)
                }
            })

        },

        renderGrid: function (sharedgroups) {

            var source = {
                datatype: "array",
                datafields: [
                    { name: 'commodityId', type: 'string' },
                    { name: 'idSingle', type: 'string' },
                    { name: 'hsCode', type: 'string'},
                    { name: 'originalHsVersion', type: 'string' },
                    { name: 'originalHsSuffix', type: 'string'}
                ],
                id: 'idSingle',
                localdata: sharedgroups
            };

            var dataAdapter = new $.jqx.dataAdapter(source);

            this.$el.jqxGrid({
                source: dataAdapter,
                width: "100%",
                columnsresize: true,
                pageable: true,
                autoheight: true,
                columns: [
                    { text: 'Id', datafield: 'idSingle' },
                    { text: 'commodityId', datafield: 'commodityId' },
                    { text: 'HS Code', datafield: 'hsCode' },
                    { text: 'originalHsVersion', datafield: 'originalHsVersion' },
                    { text: 'originalHsSuffix', datafield: 'originalHsSuffix' }
                ]
            });
        },

        destroy: function () {
            this.$el.jqxGrid('destroy');
        }

    });

    return view;

});