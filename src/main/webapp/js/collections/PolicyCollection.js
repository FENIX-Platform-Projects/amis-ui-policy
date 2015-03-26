define([
    'jquery',
    'backbone',
    'models/PolicyModel'
], function ($, Backbone, Policy) {

    var collection = Backbone.Collection.extend({

        url: '/policies',

        model: Policy

    });

    return collection;

});