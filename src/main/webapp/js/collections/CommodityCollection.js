define([
    'jquery',
    'backbone',
    'models/CommodityModel'
], function ($, Backbone, Commodity) {

    var collection = Backbone.Collection.extend({

        url: '/commodities',

        model: Commodity

    });

    return collection;

});