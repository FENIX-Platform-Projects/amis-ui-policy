define([
    'jquery',
    'backbone',
    'text!template/cpls/EditTemplate.html',
    'views/cpls/CplDetailsView',
    'views/policies/PolicyGridView',
    'views/policies/PolicyDetailsView'
], function ($, Backbone, template, Details, PolicyGrid, PolicyDetails) {

    var view = Backbone.View.extend({

        initialize: function (options) {

            $.extend(true, this, options);
            $.extend(this, Backbone.Events);
        },

        events: {
            'rowselect #policies-list': 'renderPolicyDetails',
            'click #cpl-policies-add-btn': 'addPolicy',
            'click #cpl-policies-remove-btn': 'removePolicy',
            'click #cpl-policies-new-btn': 'newPolicy',
            'click #cpl-policies-edit-btn': 'editPolicy',
            'click #save-btn': 'saveCpl',
            'click #delete-btn': 'deleteCpl'
        },

        render: function (o) {

            this.$el.html(template);

            //CPL details
            this.cplDetails = new Details({
                el: "#cpl-details"
            });

            this.cplDetails.render({ id: o.id });

            var body = {"startDate": null, "endDate": null, "commodityId": null, "commodityClassCode": 0, cplId: o.id};
            var that = this;

            $.ajax({
                url: "/policies/search",
                type: 'post',
                contentType: 'application/json',
                dataType: 'json',
                success: function (response) {

                    that.cplGrid = new PolicyGrid({
                        el: '#policies-list'
                    });
                    that.cplGrid.renderGrid(response)

                },
                data: JSON.stringify(body)
            });

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

        saveCpl: function () {
            console.log("save")
        },

        deleteCpl: function () {
            var r = confirm("Delete current CPL?");
            if (r == true) {
                alert("CPL deleted");
            }
        },

        renderPolicyDetails: function (e) {

            this.policyDetails = new PolicyDetails({
                el: "#policy-details"

            });

            this.policyDetails.render({ id: e.args.row.policyId });

        }
    });

    return view;

});