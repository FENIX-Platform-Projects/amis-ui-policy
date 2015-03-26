define([
    'jquery',
    'backbone',
    'underscore',
    'models/PolicyModel',
    'text!template/policies/DetailsTemplate.html',
    'jqwidget'
], function ($, Backbone, _, PolicyModel, DetailsTemplate) {

    return Backbone.View.extend({

        initialize: function (options) {

            $.extend(true, this, options);
            $.extend(this, Backbone.Events);
        },

        afterRender: function () {

            var that = this;

            var policy = new PolicyModel({policyId: window.currentRecord.Policy_id});

            policy.fetch({
                success: function (p) {

                    var template = _.template(DetailsTemplate, { p: p.attributes });
                    that.$el.html(template);
                    that.initTemplate();
                    console.log(p.attributes)
                    that.initLists(p.attributes);
                    that.iniCalendars(p.attributes);
                }
            })
        },

        initTemplate: function () {
            $("[data-toggle='tooltip']").tooltip({
                placement: 'top'
            });
        },

        initLists: function (model) {

            //Policy elements
            var localdataPolicyElement = [
                {
                    label: 'none',
                    value: 'none'
                },
                {
                    label: 'Final bound tariff',
                    value: 'Final bound tariff'
                },
                {
                    label: 'MFN applied tariff',
                    value: 'MFN applied tariff'
                },
                {
                    label: 'Final bound tariff ODC',
                    value: 'Final bound tariff ODC'
                },
                {
                    label: 'Quantity_Notified',
                    value: 'Quantity_Notified'
                },
                {
                    label: 'BudgetaryOutlay_Notified',
                    value: 'BudgetaryOutlay_Notified'
                },
                {
                    label: 'BudgetaryOutlay_Commitment',
                    value: 'BudgetaryOutlay_Commitment'
                },
                {
                    label: 'Quantity_Commitment',
                    value: 'Quantity_Commitment'
                },
                {
                    label: 'In Quota bound tariff',
                    value: 'In Quota bound tariff'
                },
                {
                    label: 'Notified TRQ Quantity',
                    value: 'Notified TRQ Quantity'
                },
                {
                    label: 'Final Bound Quantity',
                    value: 'Final Bound Quantity'
                },
                {
                    label: 'Notified Import Quantity',
                    value: 'Notified Import Quantity'
                },
                {
                    label: 'Initial Bound Quantity',
                    value: 'Initial Bound Quantity'
                },
                {
                    label: 'SDT_Quantity_Notified',
                    value: 'SDT_Quantity_Notified'
                },
                {
                    label: 'SDT_BudgetaryOutlay_Notified',
                    value: 'SDT_BudgetaryOutlay_Notified'
                }
            ];


            //Value Type
            var localdataValueType = [
                {
                    label: 'Observed',
                    value: 'Observed'
                },
                {
                    label: 'Bound',
                    value: 'Bound'
                },
                {
                    label: 'Estimated',
                    value: 'Estimated'
                },
                {
                    label: 'Calculated',
                    value: 'Calculated'
                },
                {
                    label: 'Notified',
                    value: 'Notified'
                },
                {
                    label: 'Committed',
                    value: 'Committed'
                }
            ];

            var localdataYesNo = [
                {
                    label: 'Yes',
                    value: 'yes'
                },
                {
                    label: 'No',
                    value: 'yes'
                }
            ];

            var localdataTypeOfChange = [
                {
                    label: 'Revision',
                    value: 'Revision'
                },
                {
                    label: 'Introduction',
                    value: 'Introduction'
                },
                {
                    label: 'Elimination',
                    value: 'Elimination'
                },
                {
                    label: 'Increase',
                    value: 'Increase'
                },
                {
                    label: 'Extension',
                    value: 'Extension'
                },
                {
                    label: 'Decrease',
                    value: 'Decrease'
                },
                {
                    label: 'Not Applicable',
                    value: 'Not Applicable'
                }
            ];


            this.createJqxComboBox(localdataPolicyElement, { container: "#field5"});
            this.createJqxComboBox(localdataValueType, { container: "#field11"});
            this.createJqxComboBox(localdataYesNo, { container: "#field20"});
            this.createJqxComboBox(localdataYesNo, { container: "#field21"});
            this.createJqxComboBox(localdataTypeOfChange, { container: "#field30"});
        },

        iniCalendars: function (model) {
            //Start Date  startDate
            this.createJqxCalendar({container: '#field6', value: model.startDate });

            //Start Date  endDate
            this.createJqxCalendar({container: '#field7', value: model.endDate });

            //Date of publication   dateOfPublication
            this.createJqxCalendar({container: '#field19', value: model.dateOfPublication });

            //Start Tax Date    startDateTax
            this.createJqxCalendar({container: '#field26', value: model.startDateTax });
        },

        createJqxComboBox: function (data, o) {

            // prepare the data
            var source =
            {
                datatype: "json",
                datafields: [
                    { name: 'label' },
                    { name: 'value' }
                ],
                localdata: data
            };
            var dataAdapter = new $.jqx.dataAdapter(source);
            // Create a jqxComboBox
            $(o.container).jqxComboBox({
                selectedIndex: 0,
                source: dataAdapter,
                displayMember: "label",
                valueMember: "value"
            });


        },

        createJqxCalendar: function (o) {

            $(o.container).jqxDateTimeInput({
                allowNullDate: true,
                allowKeyboardDelete: true,
                value: o.value ? convertDate(o.value) : null,
                showFooter: true,
                clearString: 'Clear'
            });

            function convertDate(d) {
                var r = d.split('-');
                return r[0] + ', ' + r[1] + ', ' + r[2];
            }
        }

    });

});