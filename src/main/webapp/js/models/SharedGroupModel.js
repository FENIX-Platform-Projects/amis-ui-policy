define([
    'jquery',
    'backbone'
], function ($, Backbone) {

    var model = Backbone.Model.extend({

        urlRoot: 'http://statistics.amis-outlook.org/policyinput/rest/v1/sharedgroups/',

        idAttribute: "idSingle"

    });

    return model;

});