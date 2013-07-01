Ext.define("Rally.apps.defectsbypriority.Calculator", {
	prepareChartData: function(store) {
		//debugger;
		var categories = [];
		var resolveImmediately = [];
		var highAttention = [];
		var normal = [];
		var low = [];
		var none = [];

		store.each(function(defect) {
			//debugger;
			if (!Ext.Array.contains(categories, defect.raw._CreatedAt)) {
				Ext.Array.insert(categories, categories.length, [defect.raw._CreatedAt]);
				if (defect.raw.Priority === 'Resolve Immediately') {
					Ext.Array.insert(resolveImmediately, resolveImmediately.length, [1]);
					Ext.Array.insert(highAttention, highAttention.length, [0]);
					Ext.Array.insert(normal, normal.length, [0]);
					Ext.Array.insert(low, low.length, [0]);
					Ext.Array.insert(none, none.length, [0]);
				} else if (defect.raw.Priority === 'High Attention') {
					Ext.Array.insert(resolveImmediately, resolveImmediately.length, [0]);
					Ext.Array.insert(highAttention, highAttention.length, [1]);
					Ext.Array.insert(normal, normal.length, [0]);
					Ext.Array.insert(low, low.length, [0]);
					Ext.Array.insert(none, none.length, [0]);
				} else if (defect.raw.Priority === 'Normal') {
					Ext.Array.insert(resolveImmediately, resolveImmediately.length, [0]);
					Ext.Array.insert(highAttention, highAttention.length, [0]);
					Ext.Array.insert(normal, normal.length, [1]);
					Ext.Array.insert(low, low.length, [0]);
					Ext.Array.insert(none, none.length, [0]);
				} else if (defect.raw.Priority === 'Low') {
					Ext.Array.insert(resolveImmediately, resolveImmediately.length, [0]);
					Ext.Array.insert(highAttention, highAttention.length, [0]);
					Ext.Array.insert(normal, normal.length, [0]);
					Ext.Array.insert(low, low.length, [1]);
					Ext.Array.insert(none, none.length, [0]);
				} else if (defect.raw.Priority === 'None') {
					Ext.Array.insert(resolveImmediately, resolveImmediately.length, [0]);
					Ext.Array.insert(highAttention, highAttention.length, [0]);
					Ext.Array.insert(normal, normal.length, [0]);
					Ext.Array.insert(low, low.length, [0]);
					Ext.Array.insert(none, none.length, [1]);
				}
			} else {
				if (defect.raw.Priority === 'Resolve Immediately') {
					resolveImmediately[Ext.Array.indexOf(categories, defect.raw._CreatedAt)] += 1;
				} else if (defect.raw.Priority === 'High Attention') {
					highAttention[Ext.Array.indexOf(categories, defect.raw._CreatedAt)] += 1;
				} else if (defect.raw.Priority === 'Normal') {
					normal[Ext.Array.indexOf(categories, defect.raw._CreatedAt)] += 1;
				} else if (defect.raw.Priority === 'Low') {
					low[Ext.Array.indexOf(categories, defect.raw._CreatedAt)] += 1;
				} else if (defect.raw.Priority === 'None') {
					none[Ext.Array.indexOf(categories, defect.raw._CreatedAt)] += 1;
				}
			}
		});
		
		return {
			categories: categories,
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