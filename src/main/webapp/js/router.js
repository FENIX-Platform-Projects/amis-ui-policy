/*global define, require*/
define([
    'backbone',
    'views/input/EditLayout',
    'views/input/AddRecordLayout'
], function (Backbone, Edit, Add) {


    // Extends Backbone.Router
    return Backbone.Router.extend({

        // The Router constructor
        initialize: function () {
            this.manageLayout('old')
            Backbone.history.start();
        },

        routes: {

            '(/)record(/)edit(/)(:cplid)(/)(:policyId)(/)(:commodityId)' : 'onEditRecordRoute',

            // Default
            '': 'default'
        },

        onEditRecordRoute : function ( cplid, policyId, commodityId ) {

            this.manageLayout('new');

            this.edit = new Edit({
                el: '#input_content',
                cplId : cplid,
                policyId :  policyId,
                commodityId: commodityId
            }).render();
        },

        default: function () {

            this.manageLayout('old');

            /*            this.addRecord = new Add({
             el : '#add_record_container'
             }).render();*/

            //this.navigate("cpls/", {trigger: true, replace: true});
        },

        manageLayout : function ( sec ) {

            var $old = $('.previous_content'),
                $new = $('.backbone_content');

            if (sec === 'new') {
                $new.show();
                $old.hide();
            } else {
                $new.hide();
                $old.show();
            }
        }

    });

});
