/**
 *created by yufeimmc on 3/20/2017.
 */
'use strict';
app.controller('pathAnalysisController', function ($stateParams, $scope, $state, $http, $q) {
	var vm = this;
	var pathData = $stateParams.data;
	console.log(pathData)
	//store path in a array for comparison purpose;
	function nestArray(array) {
		var result = array.map(function (d) {
			var count = d.count;
			var date = d.date;
			var path = [];
			for (var i = 1; i <= Object.keys(d).length - 2; i++) {
				path.push(d["ch" + i])
			}
			return {
				'path': path,
				'count': count,
				'date': date
			}
		})

		return result;
	}

	var converted = $http.get('convertedStatesPaths.json', {
		cache: false
	})
	var nonConverted = $http.get('declinedStatesPaths.json', {
		cache: false
	})
	var walkawayConverted = $http.get('walkawayStatesPaths.json', {
		cache: false
	})
	//create a promise to load two files
	$q.all([converted, nonConverted, walkawayConverted]).then(function (values) {
		var res = [],
			date = []
		//format the date and value into date object and number for converted path
		var convertedData = values[0].data.map(function (d) {
			var arr = d.date.split("")
			var arrtemp = [arr[3], arr[4], arr[2], arr[0], arr[1], arr[5], arr[6], arr[7], arr[8], arr[9]]
			var dateStr = arrtemp.join("")
			d.date = new Date(dateStr);
			return d;
		}).sort(function (a, b) {
			return b.date - a.date
		})
		//format the date and wavlue into date object and number for nonConverted path
		var nonConvertedData = values[1].data.map(function (d) {
			var arr = d.date.split("")
			var arrtemp = [arr[3], arr[4], arr[2], arr[0], arr[1], arr[5], arr[6], arr[7], arr[8], arr[9]]
			var dateStr = arrtemp.join("")
			d.date = new Date(dateStr);
			return d;
		}).sort(function (a, b) {
			return b.date - a.date
		})
		var walkawayConvertedData = values[2].data.map(function (d) {
			var arr = d.date.split("")
			var arrtemp = [arr[3], arr[4], arr[2], arr[0], arr[1], arr[5], arr[6], arr[7], arr[8], arr[9]]
			var dateStr = arrtemp.join("")
			d.date = new Date(dateStr);
			return d;
		}).sort(function (a, b) {
			return b.date - a.date
		})
		pathData.forEach(function (d) {
			res.push(d.name)
		});
		var pathString = res.join('-');
		var convertedNest = nestArray(convertedData);
		var nonConvertedNest = nestArray(nonConvertedData)
		var walkawayConvertedNest = nestArray(walkawayConvertedData)
		var convertedResult = _.filter(convertedNest, function (d) {
			return _.isEqual(d.path, res)
		})
		var nonConvertedResult = _.filter(nonConvertedNest, function (d) {
			return _.isEqual(d.path, res)
		});
		var walkawayConvertedResult = _.filter(walkawayConvertedNest, function (d) {
			return _.isEqual(d.path, res)
		});
		var convertedLine = [],
			nonConvertedLine = [],
			walkawayConvertedLine = [];
		for (var i = convertedResult.length - 1; i >= 0; i--) {
			convertedLine.push([convertedResult[i].date.getTime(), convertedResult[i].count])
		}
		for (var i = nonConvertedResult.length - 1; i >= 0; i--) {
			nonConvertedLine.push([nonConvertedResult[i].date.getTime(), nonConvertedResult[i].count])
		}
		for (var i = walkawayConvertedResult.length - 1; i >= 0; i--) {
			walkawayConvertedLine.push([walkawayConvertedResult[i].date.getTime(), walkawayConvertedResult[i].count])
		}
		//draw the line chart
		vm.pathLineChart = Highcharts.StockChart('pathLineChart', {
			credits: {
				enabled: false
			},
			title: {
				text: "Converted and Nonconverted Path"
			},
			subtitle: {
				text: pathString
			},
			series: [{
				name: pathString + " - Converted Path",
				data: convertedLine,
				type: "spline"
			}, {
				name: pathString + " -Declined NonConverted Path",
				data: nonConvertedLine,
				type: "spline"
			}, {
				name: pathString + "-WalkAway NonConverted Path",
				data: walkawayConvertedLine,
				type: "spline"
			}]
		})
	})
})