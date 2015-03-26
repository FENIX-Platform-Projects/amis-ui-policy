define([
    'jquery',
    'backbone',
    'nprogress',
    'text!template/cpls/ListTemplate.html',
    'views/cpls/CplFormView',
    'views/cpls/CplGridView',
    'views/cpls/CplDetailsView',
    'views/policies/PolicyGridView',
    'views/policies/PolicyDetailsView'
], function ($, Backbone, NProgress, Structure, Form, Grid, Details, PolicyGrid, PolicyDetails) {

    var view = Backbone.View.extend({

        initialize: function (options) {

            this.el = options.el;
            this.router = options.router;

            this.searchMode = true;

            if (options.policyId) {
                this.searchMode = true;
                this.policyId = options.policyId;
            }
        },

        events: {
            'rowselect #cpls-list': 'renderDetails',
            'rowselect #policies-list': 'renderPolicyDetails',
            'click #cpls-search-form-submit-btn': 'submitForm',
            'click #cpls-new-btn': 'createCpl',
            'click #cpl-policies-add-btn': 'addPolicy2Cpl',
            'click #cpl-policies-new-btn': 'createPolicy',
            'click #cpl-edit-btn': 'editCpl'
        },

        render: function () {

            this.$el.html(Structure);

            if (this.searchMode) {

                this.initSearchMode();

                this.form = new Form({
                    el: '#cpls-search-form'
                });

                this.form.render();

            } else {

                this.initListMode();

                this.grid = new Grid({
                    el: '#cpls-list'
                });

                this.grid.render();

            }
        },

        renderDetails: function (e) {

            $("#cpl-edit-btn").show();
            $("#cpl-policies-add-btn").show();
            $("#cpl-policies-new-btn").show();

            var that = this;

            //CPL details
            this.cplDetails = new Details({
                el: "#cpl-details"

            });

            this.cplDetails.render({
                id: e.args.row.cplId
            });

            //Policies Related to selected CPL
            var body = {startDate: null, endDate: null, cplId: e.args.row.cplId, commodityId: null, commodityClassCode: 0 };

            $.ajax({
                url: "/policies/search",
                type: 'post',
                contentType: 'application/json',
                dataType: 'json',
                success: function (response) {

                    that.policyGrid = new PolicyGrid({
                        el: '#policies-list'
                    });

                    that.policyGrid.renderGrid(response);

                },
                data: JSON.stringify(body)
            });

        },

        renderPolicyDetails: function (e) {

            this.policyDetails = new PolicyDetails({
                el: "#policy-details"
            });

            this.policyDetails.render({
                id: e.args.row.policyId
            });

        },

        initListMode: function () {
            $('#cpls-search-form').hide();
            $('#no-results').hide();
            $("#cpl-edit-btn").hide();

        },

        initSearchMode: function () {
            $('#no-results').hide();
            $("#cpl-edit-btn").hide();
            $("#cpl-policies-add-btn").hide();
            $("#cpl-policies-new-btn").hide();
        },

        submitForm: function () {

            console.log("SUBMIT FORM")
            var fields = this.form.getFilter();

            if (fields["countryCode"] == '' && fields["commodityClassCode"] == '') {
                var res = confirm("You have not selected any field in the search boxes. The result query could be very large. " +
                    "Are you sure to continue? ")

                if (res == true) {
                    var that = this;

                    NProgress.start();

                    $.ajax({
                        url: "/cpls/search",
                        type: 'post',
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function (response) {
                            if (response.length === 0) {

                                if (that.grid) {
                                    that.grid.clear();
                                }

                                $('#no-results').show();

                            } else {

                                $("#no-results").hide();

                                that.grid = new Grid({
                                    el: '#cpls-list'
                                });

                                that.grid.renderGrid(response);
                            }

                        },
                        complete: function () {
                            NProgress.done();
                        },
                        data: JSON.stringify(this.form.getFilter())

                    });

                }
            }
            else {

                var that = this;

                NProgress.start();

                $.ajax({
                    url: "/cpls/search",
                    type: 'post',
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function (response) {

                        if (response.length === 0) {

                            if (that.grid) {
                                that.grid.clear();
                            }

                            $('#no-results').show();

                        } else {

                            $("#no-results").hide();

                            that.grid = new Grid({
                                el: '#cpls-list'
                            });

                            that.grid.renderGrid(response);
                        }

                    },
                    complete: function () {
                        NProgress.done();
                    },
                    data: JSON.stringify(this.form.getFilter())

                });
            }
        },

        editCpl: function () {

            this.router.navigate("cpls/" + this.cplDetails.cplId, {trigger: true});
        },

        createCpl: function () {
            this.router.navigate("cpls/new", {trigger: true});
        },

        addPolicy2Cpl: function () {
            console.log("addPolicy2Cpl")
        },

        createPolicy: function () {
            this.router.navigate("policies/new", {trigger: true});
        },

        onClose: function () {

        }

    });

    return view;

});