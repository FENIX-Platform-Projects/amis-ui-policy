define([
    'jquery',
    'backbone',
    'text!template/policies/NewTemplate.html',
    'views/policies/PolicyDetailsView'

], function ($, Backbone, template, Details) {

    var view = Backbone.View.extend({

        initialize: function (options) {

            $.extend(true, this, options);
            $.extend(this, Backbone.Events);
        },

        template: _.template(template),


        afterRender: function () {

            this.policyDetails = new Details({
                el: "#policy-details"
            });

            this.policyDetails.render();
        }

    });

    return view;

});