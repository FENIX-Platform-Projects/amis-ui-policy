define([
    'jquery',
    'backbone',
    'models/SharedGroupModel'
], function ($, Backbone, SharedGroup) {

    var collection = Backbone.Collection.extend({

        url: '/sharedgroups',

        model: SharedGroup

    });

    return collection;

});