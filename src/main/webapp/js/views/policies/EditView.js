define([
    'jquery',
    'backbone',
    'text!template/policies/EditTemplate.html',
    'views/policies/PolicyDetailsView'
], function ($, Backbone, template, Details) {

    var view = Backbone.View.extend({

        initialize: function (options) {


            $.extend(true, this, options);
            $.extend(this, Backbone.Events);
        },

        template: _.template(template),

        afterRender: function (o) {

            this.$el.html(template);

            this.policyDetails = new Details({
                el: "#policy-details"
            });

            console.log("ID " + o.id);
            this.policyDetails.render({ id: o.id });

        }

    });

    return view;

});