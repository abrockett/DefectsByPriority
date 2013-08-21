Ext.define('Rally.apps.defectsbypriority.App', {
    extend: 'Rally.app.App',
    requires: [
        'Rally.apps.defectsbypriority.Calculator'
    ],
    componentCls: 'app',
    config: {
        defaultSettings: {
            numberDays: 30,
            typeOfMeasurement: 'day',
            states: 'Submitted,Open,Unable to Reproduce,Fixed,Verifying,Closed,Deferred',
            priorities: 'Resolve Immediately,High Attention,Normal,Low,None',
            severities: 'Crash/Data Loss,Major Problem,Minor Problem,Cosmetic'
        }
    },

    items: [
        {
            xtype: 'container',
            itemId: 'chart',
            componentCls: 'chart'
        }
    ],

    // to make this app work externally, we manually told the app-debug file which project to look in!
    // code: ?project=project/1971104447 added to end of first script tag

    // still a defects in queryFilters - can't 'and' filters together... 'or's work fine

    launch: function() {
        this._makeChart();
    },

    _buildFilters: function() {
        var states = this.getSettings().states.split(',');
        var priorities = this.getSettings().priorities.split(',');
        var severities = this.getSettings().severities.split(',');

        var stateFilter, priorityFilter, severityFilter;

        var stateFilters = Ext.Array.map(states, function(state) {
            return {
                property: 'State',
                operator: '=',
                value: state
            };
        });
        // Ext.Array.each(states, function(state, index) {
        //     if (index === 0) {
        //         stateFilter = Ext.create('Rally.data.QueryFilter', {
        //             property: 'State',
        //             operator: '=',
        //             value: state
        //         });
        //     } else {
        //         stateFilter = stateFilter.or({
        //             property: 'State',
        //             operator: '=',
        //             value: state
        //         }));
        //     }
        // });

        var priorityFilters = Ext.Array.map(priorities, function(priority) {
            return {
                property: 'Priority',
                operator: '=',
                value: priority
            };
        });
        // Ext.Array.each(priorities, function(priority, index) {
        //     if (index === 0) {
        //         priorityFilter = Ext.create('Rally.data.lookback.QueryFilter', {
        //             property: 'Priority',
        //             operator: '=',
        //             value: priority
        //         });
        //     } else {
        //         priorityFilter = priorityFilter.or({
        //             property: 'Priority',
        //             operator: '=',
        //             value: priority
        //         }));
        //     }
        // });

        var severityFilters = Ext.Array.map(severities, function(severity) {
            return {
                property: 'Severity',
                operator: '=',
                value: severity
            };
        });
        // Ext.Array.each(severities, function(severity, index) {
        //     if (index === 0) {
        //         severityFilter = Ext.create('Rally.data.lookback.QueryFilter', {
        //             property: 'Severity',
        //             operator: '=',
        //             value: severity
        //         });
        //     } else {
        //         severityFilter = severityFilter.or({
        //             property: 'Severity',
        //             operator: '=',
        //             value: severity
        //         }));
        //     }
        // });

        var filters = [Rally.data.lookback.QueryFilter.or(stateFilters),//.and(Rally.data.lookback.QueryFilter.or(priorityFilters)),
            Rally.data.lookback.QueryFilter.or(priorityFilters),
            Rally.data.lookback.QueryFilter.or(severityFilters),
            {
                property: '_TypeHierarchy',
                operator: '=',
                value: 'Defect'
            },
            {
                property: '_ProjectHierarchy',
                operator: '=',
                value: this.getContext().getProject().ObjectID
            },
            {
                property: '_ValidTo',
                operator: '>=',
                value: Ext.Date.format(Rally.util.DateTime.add(new Date(), 'day', -130), 'c')
            }
        ];
        return filters;
    },

    //_makeStore: function() {
    //    var store = Ext.create('Rally.data.lookback.SnapshotStore', {
    //        fetch: ['Name', 'Priority', 'CreationDate', 'State'],
    //        context: this.getContext().getDataContext(),
    //        autoLoad: true,
    //        hydrate: ['Priority', 'CreationDate', 'Name', 'State'],
    //    });
//
    //    store.filter(this._buildFilters());
    //    this._makeChart(store);
    //},

    _makeChart: function(store) {
        if (this.chart) {
            this.down('#chart').remove(this.chart);
        }
        this.chart = this.down('#chart').add({
            xtype: 'rallychart',
            componentCls: 'chart',
            storeType: 'Rally.data.lookback.SnapshotStore',
            storeConfig: {
                fetch: ['Name', 'Priority', 'CreationDate', 'State'],
                context: this.getContext().getDataContext(),
                autoLoad: true,
                hydrate: ['Priority', 'CreationDate', 'Name', 'State'],
                filters: this._buildFilters()
            },
            calculatorType: 'Rally.apps.defectsbypriority.Calculator',
            calculatorConfig: {},
            chartColors: [],
            queryErrorMessage: 'No Defects Found for the Selected Time Range - or there was an ERROR IN YOUR QUERY',
            chartConfig: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Defects by Priority <br /><span class="project">' + 
                        this.getContext().getProject()._refObjectName + '</span>',
                    useHTML: true,
                    margin: 25
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        borderWidth: 0
                    }
                },
                xAxis: {
                    labels: {
                        formatter: function() {
                            var size = this.chart.axes[0].categories.length;
                            var piece = Ext.util.Format.number(size/13, '0');
                            for (i = 0; i < size; i++) {
                                if (piece === '0') {
                                    return this.value;
                                }
                                if (i%piece !== 0) {
                                    this.chart.axes[0].categories[i] = '';
                                }
                            }
                            return this.value;
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Defect Count'
                    }
                },
                legend: {
                    enabled: true
                },
                tooltip: {
                    enabled: false
                }

            }
        });
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
                        name: 'numberDays',
                        value: this.getSettings().numberDays,
                        minValue: 1,
                        maxValue: 365,
                        width: 115,
                        labelWidth: 60,
                        componentCls: 'numberfield'
                    },
                    {
                        xtype: 'rallycombobox',
                        storeType: 'Ext.data.Store',
                        name: 'typeOfMeasurement',
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
                        value: this.getSettings().typeOfMeasurement,
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
                        name: 'states',
                        boxLabel: 'Submitted',
                        inputValue: 'Submitted',
                        checked: this.getSettings().states.split(',').indexOf('Submitted') > -1,
                        id: 'submitted'
                    },
                    {
                        name: 'states',
                        boxLabel: 'Open',
                        inputValue: 'Open',
                        checked: this.getSettings().states.split(',').indexOf('Open') > -1,
                        id: 'open'
                    },
                    {
                        name: 'states',
                        boxLabel: 'Unable to Reproduce',
                        inputValue: 'Unable to Reproduce',
                        checked: this.getSettings().states.split(',').indexOf('Unable to Reproduce') > -1,
                        id: 'unable-to-reproduce'
                    },
                    {
                        name: 'states',
                        boxLabel: 'Fixed',
                        inputValue: 'Fixed',
                        checked: this.getSettings().states.split(',').indexOf('Fixed') > -1,
                        id: 'fixed'
                    },
                    {
                        name: 'states',
                        boxLabel: 'Verifying',
                        inputValue: 'Verifying',
                        checked: this.getSettings().states.split(',').indexOf('Verifying') > -1,
                        id: 'verifying'
                    },
                    {
                        name: 'states',
                        boxLabel: 'Closed',
                        inputValue: 'Closed',
                        checked: this.getSettings().states.split(',').indexOf('Closed') > -1,
                        id: 'closed'
                    },
                    {
                        name: 'states',
                        boxLabel: 'Deferred',
                        inputValue: 'Deferred',
                        checked: this.getSettings().states.split(',').indexOf('Deferred') > -1,
                        id: 'deferred'
                    }
                ]
            },
            {
                xtype: 'fieldcontainer',
                fieldLabel: 'Priorities',
                defaultType: 'checkboxfield',
                items: [
                    {
                        name: 'priorities',
                        boxLabel: 'Resolve Immediately',
                        inputValue: 'Resolve Immediately',
                        checked: this.getSettings().priorities.split(',').indexOf('Resolve Immediately') > -1,
                        id: 'resolve-immediately'
                    },
                    {
                        name: 'priorities',
                        boxLabel: 'High Attention',
                        inputValue: 'High Attention',
                        checked: this.getSettings().priorities.split(',').indexOf('High Attention') > -1,
                        id: 'high-attention'
                    },
                    {
                        name: 'priorities',
                        boxLabel: 'Normal',
                        inputValue: 'Normal',
                        checked: this.getSettings().priorities.split(',').indexOf('Normal') > -1,
                        id: 'normal'
                    },
                    {
                        name: 'priorities',
                        boxLabel: 'Low',
                        inputValue: 'Low',
                        checked: this.getSettings().priorities.split(',').indexOf('Low') > -1,
                        id: 'low'
                    },
                    {
                        name: 'priorities',
                        boxLabel: 'None',
                        inputValue: 'None',
                        checked: this.getSettings().priorities.split(',').indexOf('None') > -1,
                        id: 'none'
                    }
                ]
            },
            {
                xtype: 'fieldcontainer',
                fieldLabel: 'Severities',
                defaultType: 'checkboxfield',
                items: [
                    {
                        name: 'severities',
                        boxLabel: 'Crash/Data Loss',
                        inputValue: 'Crash/Data Loss',
                        checked: this.getSettings().severities.split(',').indexOf('Crash/Data Loss') > -1,
                        id: 'crash-data-loss'
                    },
                    {
                        name: 'severities',
                        boxLabel: 'Major Problem',
                        inputValue: 'Major Problem',
                        checked: this.getSettings().severities.split(',').indexOf('Major Problem') > -1,
                        id: 'major-problem'
                    },
                    {
                        name: 'severities',
                        boxLabel: 'Minor Problem',
                        inputValue: 'Minor Problem',
                        checked: this.getSettings().severities.split(',').indexOf('Minor Problem') > -1,
                        id: 'minor-problem'
                    },
                    {
                        name: 'severities',
                        boxLabel: 'Cosmetic',
                        inputValue: 'Cosmetic',
                        checked: this.getSettings().severities.split(',').indexOf('Cosmetic') > -1,
                        id: 'cosmetic'
                    }
                ]
            }
        ];
    }
});