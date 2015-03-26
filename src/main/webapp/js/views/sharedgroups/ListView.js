define([
    'jquery',
    'backbone',
    'text!template/sharedgroups/ListTemplate.html',
    'views/sharedgroups/SharedGroupGridView',
    'views/sharedgroups/SharedGroupDetailsView'
], function ($, Backbone, template, Grid, Details) {

    var view = Backbone.View.extend({

        initialize: function (options) {

            this.el = options.el;
            this.router = options.router;

        },

        events: {
            'rowselect #sharedgroups-list': 'renderDetails',
            'click #sharedgroup-edit-btn': 'editSharedGroup'
        },

        render: function () {

            this.$el.html(template);

            this.initTemplate();

            this.grid = new Grid({
                el: "#sharedgroups-list"
            });

            this.grid.render();

        },

        renderDetails: function (e) {

            $("#sharedgroup-edit-btn").show();

            this.sharedGroupDetails = new Details({
                el: "#sharedgroup-details"
            });

            this.sharedGroupDetails.render({
                id: e.args.row.idSingle
            });

        },

        editSharedGroup: function () {
            this.router.navigate("sharedgroups/" + this.sharedGroupDetails.idSingle, {trigger: true});
        },

        initTemplate: function () {
            $("#sharedgroup-edit-btn").hide()
        }
    });

    return view;

});