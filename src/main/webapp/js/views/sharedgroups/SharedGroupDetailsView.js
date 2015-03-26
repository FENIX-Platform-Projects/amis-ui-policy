define([
    'jquery',
    'backbone',
    'underscore',
    'models/SharedGroupModel',
    'text!template/sharedgroups/DetailsTemplate.html'
], function ($, Backbone, _, Model, DetailsTemplate) {

    var view = Backbone.View.extend({

        initialize: function (options) {

            this.el = options.el;


        },

        render: function (o) {
            var that = this;
            var commodity = new Model();

            if (o) {
                if (o.id) {
                    this.idSingle = o.id;
                    commodity = new Model({idSingle: o.id});
                    commodity.fetch({
                        success: function (g) {

                            var template = _.template(DetailsTemplate, {group: g});
                            that.$el.html(template);
                        }
                    })
                }
            } else {
                this.$el.html(_.template(DetailsTemplate, {group: null}))
            }

        }

    });

    return view;

});