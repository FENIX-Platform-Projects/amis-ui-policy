define([
    'jquery',
    'backbone',
    'text!template/commodities/ListTemplate.html',
    'views/commodities/CommodityGridView',
    'views/commodities/CommodityDetailsView'
], function ($, Backbone, template, Grid, Details) {

    var view = Backbone.View.extend({

        initialize: function (options) {

            this.el = options.el;
            this.router = options.router;

        },

        events: {
            'rowselect #commodities-list': 'renderDetails',
            'click #commodity-edit-btn': 'editCommodity'
        },

        render: function () {

            this.$el.html(template);

            this.initTemplate();

            this.grid = new Grid({
                el: '#commodities-list'
            });

            this.grid.render();

        },

        renderDetails: function (e) {

            $("#commodity-edit-btn").show();

            this.commodityDetails = new Details({
                el: "#commodity-details"
            });

            this.commodityDetails.render({
                id: e.args.row.commodityId
            });

        },

        initTemplate: function () {
            $("#commodity-edit-btn").hide()
        },

        editCommodity: function () {
            this.router.navigate("commodities/" + this.commodityDetails.commodityId, {trigger: true});
        }
    });

    return view;

});