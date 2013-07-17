Ext.define("Rally.apps.defectsbypriority.Calculator", {
	prepareChartData: function(store) {
		var categories = [];
		var resolveImmediately = [];
		var highAttention = [];
		var normal = [];
		var low = [];
		var none = [];
		
		for (var i = 30; i >= 0; i--) {
			var dayName = Ext.Date.format(Rally.util.DateTime.add(new Date(), 'day', -i), 'D');
			if (dayName !== 'Sat' && dayName !== 'Sun') {
				Ext.Array.push(categories, {
					label: Ext.Date.format(Rally.util.DateTime.add(new Date(), 'day', -i), 'm/d'),
					date: Ext.Date.format(Rally.util.DateTime.add(new Date(), 'day', -i), 'c')
				});
				Ext.Array.push(resolveImmediately, 0);
				Ext.Array.push(highAttention, 0);
				Ext.Array.push(normal, 0);
				Ext.Array.push(low, 0);
				Ext.Array.push(none, 0);
			}
		}

		store.each(function(defect) {
			Ext.Array.each(categories, function(day) {
				// We're pretty sure _ValidFrom is noninclusive while _ValidTo is inclusive, hence the '<' vs '>='
				if (defect.get('_ValidTo') >= day.date && defect.get('_ValidFrom') < day.date) {
					if (defect.get('Priority') === 'Resolve Immediately') {
						resolveImmediately[Ext.Array.indexOf(categories, day)] += 1;
					} else if (defect.get('Priority') === 'High Attention') {
						highAttention[Ext.Array.indexOf(categories, day)] += 1;
					} else if (defect.get('Priority') === 'Normal') {
						normal[Ext.Array.indexOf(categories, day)] += 1;
					} else if (defect.get('Priority') === 'Low') {
						low[Ext.Array.indexOf(categories, day)] += 1;
					} else if (defect.get('Priority') === 'None') {
						none[Ext.Array.indexOf(categories, day)] += 1;
					}
				}
			}, this);
		});

		var labels = Ext.Array.map(categories, function(day) {
			return day.label;
		}, this);

		
		return {
			categories: labels,
			series: [
				{
					name: 'Resolve Immediately',
					data: resolveImmediately,
					color: '#EF3F35'
				},{
					name: 'High Attention',
					data: highAttention,
					color: '#F47168'
				},{
					name: 'Normal',
					data: normal,
					color: '#FCB5B1'
				},{
					name: 'Low',
					data: low,
					color: '#E57E3A'
				},{
					name: 'None',
					data: none,
					color: '#D9AF4B'
				}
			]
		};
	}
});