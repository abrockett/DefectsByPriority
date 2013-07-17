Ext.define('Rally.apps.defectsbypriority.App', {
    extend: 'Rally.app.App',
    requires: [
        'Rally.apps.defectsbypriority.Calculator'
    ],
    componentCls: 'app',

    items: [
        {
            xtype: 'container',
            itemId: 'chart',
            componentCls: 'chart'
        }
    ],

    // to make this app work externally, we manually told the app-debug file which project to look in!
    // code: ?project=project/1971104447 added to end of first script tag

    launch: function() {
        //this._makeChart();
    },

    //_makeChart: function() {
    //    debugger;
    //    if (this.chart) {
    //        this.down('#chart').remove(this.chart);
    //    }
    //    this.chart = this.down('#chart').add({
    //        xtype: 'rallychart',
    //        componentCls: 'chart',
    //        storeType: 'Rally.data.lookback.SnapshotStore',
    //        storeConfig: {
    //            fetch: ['Name', 'Priority', 'CreationDate', 'State'],
    //            context: this.getContext().getDataContext(),
    //            filters: [
    //                {
    //                    property: '_TypeHierarchy',
    //                    operator: '=',
    //                    value: 'Defect'
    //                }, {
    //                    property: '_ProjectHierarchy',
    //                    operator: '=',
    //                    value: this.getContext().getProject().ObjectID
    //                }, {
    //                    property: 'State',
    //                    operator: '=',
    //                    value: 'Open'
    //                }, {
    //                    property: '_ValidTo',
    //                    operator: '>=',
    //                    value: Ext.Date.format(Rally.util.DateTime.add(new Date(), 'day', -130), 'c')
    //                }
    //            ],
    //            autoLoad: true,
    //            hydrate: ['Priority', 'CreationDate', 'Name', 'State']
    //        },
//
    //        calculatorType: 'Rally.apps.defectsbypriority.Calculator',
    //        calculatorConfig: {},
    //        chartColors: [],
    //        queryErrorMessage: 'No Defects Found for the Selected Time Range - or there was an ERROR IN YOUR QUERY',
    //        chartConfig: {
    //            chart: {
    //                type: 'column'
    //            },
    //            title: {
    //                text: 'Defects by Priority <br /><span class="project">' + 
    //                    this.getContext().getProject()._refObjectName + '</span>',
    //                useHTML: true,
    //                margin: 25
    //            },
    //            plotOptions: {
    //                column: {
    //                    stacking: 'normal',
    //                    borderWidth: 0
    //                }
    //            },
    //            xAxis: {
    //                labels: {
    //                    formatter: function() {
    //                        var size = this.chart.axes[0].categories.length;
    //                        var piece = Ext.util.Format.number(size/13, '0');
    //                        for (i = 0; i < size; i++) {
    //                            if (piece === '0') {
    //                                return this.value;
    //                            }
    //                            if (i%piece !== 0) {
    //                                this.chart.axes[0].categories[i] = '';
    //                            }
    //                        }
    //                        return this.value;
    //                    }
    //                }
    //            },
    //            yAxis: {
    //                title: {
    //                    text: 'Defect Count'
    //                }
    //            },
    //            legend: {
    //                enabled: true
    //            },
    //            tooltip: {
    //                enabled: false
    //            }
//
    //        }
    //    });
    //}

    _stateCheckChanged: function(checkbox) {
        //var filters = [];
        //if (this.down('#submitted').getValue()) {
        //    Ext.Array.push(filters, new Ext.util.Filter(
        //        {
        //            property: 'State',
        //            operator: '=',
        //            value: 'Submitted'
        //        }
        //    ));
        //}
        //if (this.down('#open').getValue()) newTypes.push('Defect');
        //if (this.down('#unable-to-reproduce').getValue()) newTypes.push('Defect Suite');
        //if (this.down('#fixed').getValue()) newTypes.push('User Story');
        //if (this.down('#verifying').getValue()) newTypes.push('Defect');
        //if (this.down('#closed').getValue()) newTypes.push('Defect Suite');
        //if (this.down('#deferred').getValue()) newTypes.push('Defect Suite');
    },

    _priorityCheckChanged: function(checkbox) {
        debugger;
    },

    _severityCheckChanged: function(checkbox) {
        debugger;
    },

    getSettingsFields: function() {
        return [
            {
                xtype: 'container',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'rallynumberfield',
                        fieldLabel: 'Date<br />Range',
                        value: 30,
                        minValue: 1,
                        maxValue: 365,
                        width: 115,
                        labelWidth: 60,
                        componentCls: 'number-field'
                    },
                    {
                        xtype: 'rallycombobox',
                        storeType: 'Ext.data.Store',
                        storeConfig: {
                            fields: ['value', 'range'],
                            data: [
                                {'value':'day', 'range':'Days'},
                                {'value':'week', 'range':'Weeks'},
                                {'value':'month', 'range':'Months'},
                                {'value':'quarter', 'range':'Quarters'}
                            ]
                        },
                        width: 80,
                        value: 'day',
                        margin: '4 0 0 10',
                        displayField: 'range',
                        valueField: 'value'
                    }
                ]
            },
            {
                xtype: 'fieldcontainer',
                fieldLabel: 'States',
                defaultType: 'checkboxfield',
                items: [
                    {
                        boxLabel: 'Submitted',
                        inputValue: 'sub',
                        id: 'submitted',
                        handler: this._stateCheckChanged
                    },
                    {
                        boxLabel: 'Open',
                        inputValue: 'open',
                        id: 'open',
                        handler: this._stateCheckChanged
                    },
                    {
                        boxLabel: 'Unable to Reproduce',
                        inputValue: 'unable',
                        id: 'unable-to-reproduce',
                        handler: this._stateCheckChanged
                    },
                    {
                        boxLabel: 'Fixed',
                        inputValue: 'fixed',
                        id: 'fixed',
                        handler: this._stateCheckChanged
                    },
                    {
                        boxLabel: 'Verifying',
                        inputValue: 'verify',
                        id: 'verifying',
                        handler: this._stateCheckChanged
                    },
                    {
                        boxLabel: 'Closed',
                        inputValue: 'closed',
                        id: 'closed',
                        handler: this._stateCheckChanged
                    },
                    {
                        boxLabel: 'Deferred',
                        inputValue: 'defer',
                        id: 'deferred',
                        handler: this._stateCheckChanged
                    }
                ]
            },
            {
                xtype: 'fieldcontainer',
                fieldLabel: 'Priorities',
                defaultType: 'checkboxfield',
                items: [
                    {
                        boxLabel: 'Resolve Immediately',
                        inputValue: 'resolve',
                        id: 'resolve-immediately',
                        handler: this._priorityCheckChanged
                    },
                    {
                        boxLabel: 'High Attention',
                        inputValue: 'high',
                        id: 'high-attention',
                        handler: this._priorityCheckChanged
                    },
                    {
                        boxLabel: 'Normal',
                        inputValue: 'normal',
                        id: 'normal',
                        handler: this._priorityCheckChanged
                    },
                    {
                        boxLabel: 'Low',
                        inputValue: 'low',
                        id: 'low',
                        handler: this._priorityCheckChanged
                    },
                    {
                        boxLabel: 'None',
                        inputValue: 'none',
                        id: 'none',
                        handler: this._priorityCheckChanged
                    }
                ]
            },
            {
                xtype: 'fieldcontainer',
                fieldLabel: 'Severities',
                defaultType: 'checkboxfield',
                items: [
                    {
                        boxLabel: 'Crash/Data Loss',
                        inputValue: 'crash',
                        id: 'crash-data-loss',
                        handler: this._severityCheckChanged
                    },
                    {
                        boxLabel: 'Major Problem',
                        inputValue: 'major',
                        id: 'major-problem',
                        handler: this._severityCheckChanged
                    },
                    {
                        boxLabel: 'Minor Problem',
                        inputValue: 'minor',
                        id: 'minor-problem',
                        handler: this._severityCheckChanged
                    },
                    {
                        boxLabel: 'Cosmetic',
                        inputValue: 'cosmetic',
                        id: 'cosmetic',
                        handler: this._severityCheckChanged
                    }
                ]
            }
        ];
    }
});