define([
    'jquery',
    'backbone',
    'nprogress',
    'text!template/policies/ListTemplate.html',
    'views/policies/PolicyFormView',
    'views/policies/PolicyGridView',
    'views/policies/PolicyDetailsView',
    'views/cpls/CplGridView',
    'views/cpls/CplDetailsView'
], function ($, Backbone, NProgress, template, Form, Grid, Details, CplGrid, CplDetails) {

    var view = Backbone.View.extend({

        initialize: function (options) {

            this.router = options.router;

            this.searchMode = true;

            if (options.cldId) {
                this.searchMode = true;
                this.cldId = options.cldId;
            }
        },

        events: {
            'click #policies-search-form-submit-btn': 'submitForm',
            'click #policies-new-btn': 'createPolicy',
            'click #policy-edit-btn': 'editPolicy',
            'rowselect #policies-list': 'renderDetails'
        },

        render: function () {

            this.$el.html(template);


            if (this.searchMode) {

                this.initSearchMode();

                this.form = new Form({
                    el: '#policies-search-form'
                });

                this.form.render();

            } else {

                this.initListMode();

                this.grid = new Grid({
                    el: '#policies-list'
                });

                this.grid.render();
            }

        },

        initSearchMode: function () {

            $("#no-results").hide();
            $('#policy-edit-btn').hide();
            $('#cpl-edit-btn').hide();

        },

        initListMode: function () {

            $("#no-results").hide();
            $('#policy-edit-btn').hide();

        },

        renderDetails: function (e) {

            var that = this;

            $('#policy-edit-btn').show();

            this.policyDetails = new Details({
                el: "#policy-details"
            });

            this.policyDetails.render({ id: e.args.row.policyId});

            //CPLs Related to selected Policy
            var body = {countryCode: 0, policyDomainCode: 0, policyMeasureCode: 0, commodityId: 0, commodityClassCode: 0 };

            /*            $.ajax({
             url: "/cpls/search",
             type: 'post',
             contentType: 'application/json',
             dataType: 'json',
             success: function( response ){

             that.cplGrid = new CplGrid({
             el: '#cpls-list'
             });

             that.cplGrid.renderGrid( response );

             },
             data: JSON.stringify(body)
             });*/
        },

        submitForm: function () {

            NProgress.start();

            var that = this;

            $.ajax({
                url: "/policies/search",
                type: 'post',
                contentType: 'application/json',
                dataType: 'json',
                success: function (response) {

                    NProgress.done();

                    if (response.length === 0) {

                        if (that.grid) {
                            that.grid.clear();
                        }

                        $('#no-results').show();

                    } else {

                        $("#no-results").hide();

                        that.grid = new Grid({
                            el: '#policies-list'
                        });

                        that.grid.renderGrid(response);
                    }

                },
                data: JSON.stringify(this.form.getFilter())
            });
        },

        createPolicy: function () {

            this.router.navigate("policies/new", {trigger: true});
        },

        editPolicy: function () {

            this.router.navigate("policies/" + this.policyDetails.policyId, {trigger: true});
        }

    });

    return view;

});