define([
    'jquery',
    'backbone',
    'collections/PolicyCollection',
    "jqwidget"
], function ($, Backbone, PolicyCollection) {

    var view = Backbone.View.extend({

        initialize: function (options) {

            this.el = options.el;

        },

        render: function () {

            var that = this;
            var collection = new PolicyCollection();

            collection.fetch({
                success: function (policies, response) {
                    that.renderGrid(response)
                }
            });
        },

        renderGrid: function (policies) {

            var source = {
                datatype: "array",
                datafields: [
                    { name: 'policyId', type: 'string' },
                    { name: 'valueType', type: 'string' },
                    { name: 'startDate', type: 'string'},
                    { name: 'endDate', type: 'string' }
                ],
                id: 'policyId',
                localdata: policies
            };

            var dataAdapter = new $.jqx.dataAdapter(source);

            this.$el.jqxGrid({
                source: dataAdapter,
                width: "100%",
                columnsresize: true,
                pageable: true,
                autoheight: true,
                columns: [
                    { text: 'Id', datafield: 'policyId' },
                    { text: 'Value', datafield: 'valueType' },
                    { text: 'Start Date', datafield: 'startDate' },
                    { text: 'End Date', datafield: 'endDate' }
                ]
            });
        },

        clear: function () {
            this.$el.jqxGrid('clear');
        }

    });

    return view;

});