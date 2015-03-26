define([
    'jquery',
    'backbone',
    'text!template/commodities/ListTemplate.html',
    'views/commodities/CommodityFormView',
    'views/commodities/CommodityGridView',
    'views/commodities/CommodityDetailsView'
], function ($, Backbone, template, Form, Grid, Details) {

    var view = Backbone.View.extend({

        initialize: function (options) {

            this.el = options.el;
            this.router = options.router;

        },

        events: {
            'click #commodities-search-form-submit-btn': 'searchCommodity',
            'rowselect #commodities-list': 'renderDetails'
        },

        render: function () {

            this.$el.html(template);


            this.initSearchMode();

            this.form = new Form({
                el: '#commodities-search-form'
            });

            this.form.render();

        },

        initSearchMode: function () {

            $("#no-results").hide();
            $("#commodity-edit-btn").hide();

        },

        searchCommodity: function () {

            var that = this;

            $.ajax({
                url: "/commodities/search",
                type: 'post',
                contentType: 'application/json;charset=UTF-8;',
                dataType: 'json',
                success: function (response) {

                    if (response.length === 0) {

                        if (that.grid) {
                            that.grid.destroy();
                        }

                        $('#no-results').show();
                        $("#commodity-edit-btn").hide();

                    } else {

                        $("#no-results").hide();

                        that.grid = new Grid({
                            el: '#commodities-list'
                        });

                        that.grid.renderGrid(response);
                    }

                },
                data: JSON.stringify(this.form.getFilter())
            });
        },

        renderDetails: function (e) {

            $("#commodity-edit-btn").show();

            this.commodityDetails = new Details({
                el: "#commodity-details"
            });

            this.commodityDetails.render({
                id: e.args.row.commodityId
            });

        }
    });

    return view;

});