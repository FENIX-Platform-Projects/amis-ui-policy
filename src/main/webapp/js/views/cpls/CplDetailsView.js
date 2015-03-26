define([
    'jquery',
    'backbone',
    'underscore',
    'models/CplModel',
    'text!template/cpls/DetailsTemplate.html'
], function ($, Backbone, _, CplModel, DetailsTemplate) {

    return Backbone.View.extend({

        initialize: function (options) {

            $.extend(true, this, options);
            $.extend(this, Backbone.Events);
        },

        //template: _.template(template),

        afterRender: function () {

            var that = this;

            var cpl = new CplModel({cplId: this.cplId});
            cpl.fetch({
                success: function (c) {

                    var template = _.template(DetailsTemplate, {cpl: c});
                    that.$el.html(template);
                }
            })
        }

    });

});