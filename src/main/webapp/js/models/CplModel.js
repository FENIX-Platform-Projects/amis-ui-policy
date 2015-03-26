define([
    'jquery',
    'backbone'
], function ($, Backbone) {

    return Backbone.Model.extend({

        urlRoot: 'http://statistics.amis-outlook.org/policyinput/rest/v1/cpls/',

        idAttribute: "cplId"

    });

});