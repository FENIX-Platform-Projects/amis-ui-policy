define([
    'jquery',
    'backbone',
    'underscore',
    'models/CommodityModel',
    'text!template/commodities/DetailsTemplate.html'
], function ($, Backbone, _, Model, DetailsTemplate) {

    var view = Backbone.View.extend({
        initialize: function (options) {

            $.extend(true, this, options);
            $.extend(this, Backbone.Events);
        },

        //template: _.template(template),

        afterRender: function (o) {
            var that = this;

            var commodity = new Model({commodityId: this.commodityId});
            commodity.fetch({
                success: function (c) {

                    var template = _.template(DetailsTemplate, {comm: c});
                    that.$el.html(template);
                }
            })
        }

    });

    return view;

});