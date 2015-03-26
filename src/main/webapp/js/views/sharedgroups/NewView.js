define([
    'jquery',
    'backbone',
    'text!template/sharedgroups/NewTemplate.html',
    'views/sharedgroups/SharedGroupDetailsView'

], function ($, Backbone, template, Details) {

    var view = Backbone.View.extend({

        initialize: function (options) {

            this.el = options.el;
            this.router = options.router;
        },

        render: function () {

            this.$el.html(template);


            this.sharedGroupDetails = new Details({
                el: "#sharedgroup-details"
            });

            this.sharedGroupDetails.render();

        }
    });

    return view;

});