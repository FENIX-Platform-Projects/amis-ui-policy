define([
    'jquery',
    'backbone',
    'models/CplModel'
], function ($, Backbone, Cpl) {

    var collection = Backbone.Collection.extend({

        url: '/cpls',

        model: Cpl

    });

    return collection;

});