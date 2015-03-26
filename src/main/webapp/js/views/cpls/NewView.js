define([
    'jquery',
    'backbone',
    'text!template/cpls/NewTemplate.html',
    'views/cpls/CplDetailsView',
    'views/policies/PolicyGridView',
    'views/policies/PolicyDetailsView'
], function ($, Backbone, template, Details, PolicyGrid, PolicyDetails) {

    var view = Backbone.View.extend({

        initialize: function (options) {

            this.el = options.el;
            this.router = options.router;

        },

        events: {
            'click #cpl-policies-add-btn': 'addPolicy',
            'click #cpl-policies-remove-btn': 'removePolicy',
            'click #cpl-policies-new-btn': 'newPolicy',
            'click #cpl-policies-edit-btn': 'editPolicy',
            'click #save-btn': 'save'
        },

        render: function () {

            this.$el.html(template);

            //CPL details
            this.cplDetails = new Details({
                el: "#cpl-details"
            });

            this.cplDetails.render();
        },

        addPolicy: function () {
            console.log("addPolicy")
        },

        removePolicy: function () {
            console.log("removePolicy")
        },

        newPolicy: function () {
            console.log("newPolicy")
        },

        editPolicy: function () {
            console.log("editPolicy")
        },

        save: function () {
            console.log("save")
        }

    });

    return view;

});