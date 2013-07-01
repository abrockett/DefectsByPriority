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

    launch: function() {
        this._makeChart();
    },

    _makeChart: function() {

        if (this.chart) {
            this.down('#chart').remove(this.chart);
        }
        this.chart = this.down('#chart').add({
            xtype: 'rallychart',
            componentCls: 'chart',
            storeType: 'Rally.data.WsapiDataStore',
            storeConfig: {
                model: 'Defect',
                fetch: true,
                filters: [
                    {
                        property: 'CreationDate',
                        operator: '>',
                        value: Rally.util.DateTime.toIsoString(Rally.util.DateTime.add(new Date(),
                            'day', -180))
                    }
                ],
                limit: Infinity,
                context: this.context.getDataContext()
            },
            //listeners: {
            //        chartRendered: this._onChartRendered,
            //        scope: this
            //},

            calculatorType: 'Rally.apps.defectsbypriority.Calculator',
            calculatorConfig: {},
            chartColors: [],
            //queryErrorMessage: '',
            queryErrorMessage: 'No Defects Found for the Selected Time Range',
            chartConfig: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Defects by Priority'
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
                            var piece = Ext.util.Format.number(size/20, '0');
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
    }
});