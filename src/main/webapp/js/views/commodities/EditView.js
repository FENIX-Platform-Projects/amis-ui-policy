define([
    'jquery',
    'backbone',
    'text!template/commodities/EditTemplate.html',
    'views/commodities/CommodityDetailsView'

], function ($, Backbone, template, Details) {

    var view = Backbone.View.extend({

        initialize: function (options) {


            $.extend(true, this, options);
            $.extend(this, Backbone.Events);

        },



        template: _.template(template),

        afterRender: function (o) {


            this.commodityDetails = new Details({
                el: "#commodity-details"
            });

            this.commodityDetails.render({id: o.id});

        }

    });

    return view;

});