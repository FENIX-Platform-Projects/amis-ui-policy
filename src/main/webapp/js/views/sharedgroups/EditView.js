define([
    'jquery',
    'backbone',
    'text!template/sharedgroups/EditTemplate.html',
    'views/sharedgroups/SharedGroupDetailsView'
], function ($, Backbone, template, Details) {

    var view = Backbone.View.extend({

        initialize: function (options) {

            this.el = options.el;

        },

        render: function (o) {

            this.$el.html(template);

            this.sharedGroupDetails = new Details({
                el: "#sharedgroup-details"
            });

            console.log("ID " + o.id)
            this.sharedGroupDetails.render({id: o.id});


        }

    });

    return view;

});