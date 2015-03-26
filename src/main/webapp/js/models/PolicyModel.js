define([
    'jquery',
    'backbone'
], function ($, Backbone) {

    var model = Backbone.Model.extend({

        urlRoot: 'http://statistics.amis-outlook.org/policyinput/rest/v1/policies/',

        idAttribute: "policyId"

    });

    return model;

});