define([
    'jquery',
    'backbone',
    'text!template/sharedgroups/ListTemplate.html',
    'views/sharedgroups/SharedGroupFormView',
    'views/sharedgroups/SharedGroupGridView',
    'views/sharedgroups/SharedGroupDetailsView'
], function ($, Backbone, template, Form, Grid, Details) {

    var view = Backbone.View.extend({

        initialize: function (options) {

            this.el = options.el;
            this.router = options.router;

        },

        events: {
            'click #sharedgroups-search-form-submit-btn': 'searchSharedGroup',
            'rowselect #sharedgroups-list': 'renderDetails'
        },

        render: function () {

            this.$el.html(template);


            this.initSearchMode();

            this.form = new Form({
                el: '#sharedgroups-search-form'
            });

            this.form.render();

        },

        initSearchMode: function () {

            $("#no-results").hide();
            $("#SharedGroup-edit-btn").hide();

        },

        searchSharedGroup: function () {

            var that = this;

            $.ajax({
                url: "/sharedgroups/search",
                type: 'post',
                contentType: 'application/json;charset=UTF-8;',
                dataType: 'json',
                success: function (response) {

                    if (response.length === 0) {

                        if (that.grid) {
                            that.grid.destroy();
                        }

                        $('#no-results').show();
                        $("#SharedGroup-edit-btn").hide();

                    } else {

                        $("#no-results").hide();

                        that.grid = new Grid({
                            el: '#sharedgroups-list'
                        });

                        that.grid.renderGrid(response);
                    }

                },
                data: JSON.stringify(this.form.getFilter())
            });
        },

        renderDetails: function (e) {

            $("#SharedGroup-edit-btn").show();

            this.SharedGroupDetails = new Details({
                el: "#SharedGroup-details"
            });

            this.SharedGroupDetails.render({
                id: e.args.row.SharedGroupId
            });

        }
    });

    return view;

});