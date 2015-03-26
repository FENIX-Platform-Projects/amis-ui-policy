define([
    'jquery',
    'backbone',
    'text!template/commodities/NewTemplate.html',
    'views/commodities/CommodityDetailsView'

], function ($, Backbone, template, Details) {

    var view = Backbone.View.extend({

        initialize: function (options) {

            this.el = options.el;

        },

        render: function () {

            this.$el.html(template);


            this.commodityDetails = new Details({
                el: "#commodity-details"
            });

            this.commodityDetails.render();


        }

    });

    return view;

});