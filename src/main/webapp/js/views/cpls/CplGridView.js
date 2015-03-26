define([
    'jquery',
    'backbone',
    'collections/CplCollection',
    "jqwidget"
], function ($, Backbone, CplCollection) {

    var view = Backbone.View.extend({

        initialize: function (options) {

            this.el = options.el;

        },

        render: function () {

            var that = this;
            var collection = new CplCollection();

            collection.fetch({
                success: function (cpls, response) {
                    that.renderGrid(response)
                }
            })

        },

        renderGrid: function (cpls) {

            var source = {
                datatype: "array",
                datafields: [
                    { name: 'cplId', type: 'string' },
                    { name: 'countryName', type: 'string' },
                    { name: 'commodityDomainName', type: 'string'},
                    { name: 'commodityClassName', type: 'string' },
                    { name: 'policyTypeName', type: 'string'}
                ],
                id: 'cplId',
                localdata: cpls
            };

            var dataAdapter = new $.jqx.dataAdapter(source);

            this.$el.jqxGrid({
                source: dataAdapter,
                width: "100%",
                columnsresize: true,
                pageable: true,
                autoheight: true,
                columns: [
                    { text: 'Id', datafield: 'cplId' },
                    { text: 'Country', datafield: 'countryName' },
                    { text: 'Comm Domain', datafield: 'commodityDomainName' },
                    { text: 'Comm Classt', datafield: 'commodityClassName' },
                    { text: 'Policy', datafield: 'policyTypeName' }
                ]
            });
        },

        clear: function () {
            this.$el.jqxGrid('clear');
        }

    });

    return view;

});