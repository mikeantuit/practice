'use strict';
app.controller("attributeController", ['$state', '$scope', function ($state, $scope) {
	var vm = this;
	vm.level1;
	var level1List = ["Verification"];
	vm.levle2;
	var level2List = ["Verification_Approve"];
	vm.level3;
	var level3List = ["Eligibility_Type2_Fraud_-_APPROVED", "Eligibility_Type1_Fraud_-_APPROVED", "Eligibility_DIRECT_APPROVAL", "Eligibility_TWN_APPROVAL"];
	vm.level4;
	// var level4List = ["DECLINED", "PENDING", "CLOSED", "ADANDONED", "OPEN", "INCOMPLETE"];
	var level4List = ["CLOSED"];
	vm.models = [{
		name: 'model1'
	}, {
		name: 'model2'
	}, {
		name: 'model3'
	}]
	vm.selectedModel = vm.models[0]
	var margin = {
			top: 10,
			right: 10,
			bottom: 10,
			left: 10
		},
		width = parseInt(d3.select('#viz').style('width'), 10) - margin.left - margin.right,
		height = parseInt(d3.select('#viz').style('height'), 10) - margin.top - margin.bottom,
		height2 = 40;
	// var radius = (Math.min(width,height)/2)-10;
	//breadcrumb dimensions : width, height, spacing, width of tip/tail
	//var b = {w:10,h:30,s:3,t:10};
	// var formatNumber = d3.format {',.)d'),
	// format = function(d) {
	//     return formatNumber(d) + '' + units;
	// }; 
	// var color = d3.scale.category20();
	// var x = d3.scale.linear().range([0,2*Math.PI]);
	// var y = d3.scale.sqrt().range([0,radius]);
	// var partition = d3.layout.partition().value(function(d) {return d.size;});
	//var arc = d3.svg.arc()
	//	.startAngle(function(d) { return Math.max(0, Math.min(2*Math.PI, x(d.x)));})
	//  	.endAngle(function(d) { return Math.max(0, Math.min(2*Math.PI, x(d.x + d.dx)));})
	// 	.innerRadius(function(d) {return Math.max(0, y(d.y)); })
	//	.outerRadius(function(d) {return Math.max(0, y(d.y + d.dy)); });
	// var sunburstSvg = d3.select ("#sunburst")
	// 	.append('svg')
	//	.attr ('width', width)
	//	.attr ( 'height', height)
	// 	.append('g')
	// 	.attr ('transform','translate('+width/2+','+(height/2)+')');
	// createSunburst ('./app/mosaicattribute/sunburst.json');

	function createSunburst(url) {
		initializeBreadCrumbTrail();
		d3.json(url, function (error, root) {
			if (error) {
				throw error
			};
			sunburstSvg.selectAll('path')
				.data(partition.nodes(root))
				.enter()
				.append('path')
				.attr('d', arc)
				.style('fill', function (d) {
					return d.name + "\n" + formatNumber(d.value);
				})
		});
	}

	function getAncestors(node) {
		var path = [];
		var current = node;
		while (current) {
			path.unshift(current);
			if (current.parent) {
				current = current.parent;
			} else {
				current = null;
			}
		}
		return path;
	}

	function clickpartition(d) {
		var percentageString = "dd";
		sunburstSvg.transition()
			.duration(750)
			.tween("scale", function () {
				var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
					yd = d3.interpolate(y.domain(), [d.y, 1]),
					yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
				return function (t) {
					x.domain(xd(t));
					y.domain(yd(t)).range(yr(t));
				};
			})
			.selectAll("path")
			.attrTween("d", function (d) {
				return function () {
					return arc(d);
				};
			});
		var sequenceArray = getAncestors(d);
		updateBreadcrumbs(sequenceArray, percentageString);
	}

	function updateBreadcrumbs(nodeArray, percentageString) {
		var g = d3.select('#trail')
			.selectAll('g')
			.data(nodeArray, function (d) {
				return d.name + d.depth;
			});
		var entering = g.enter()
			.append('g');
		entering.append('text')
			.attr('x', function (d, i) {
				Return(b.w * nodeArray[i].name.length + b.t) / 2
			})
			.attr('y', b.h / 2)
			.attr('text-anchor', 'middle')
			.attr('dy', "0.35em")
			.text(function (d, i) {
				return d.name
			});
		g.attr('transform', function (d, i) {
			var distance = breadcrumbTransformDistance(nodeArray, i)
			return " translate(" + distance + ",0)"
		});
		g.exit().remove();
		d3.select('#trail').select('#endlabel')
			.attr('x', function (d) {
				return breadcrumbTransformDistance(nodeArray, nodeArray.length) + 30;
			})
			.attr('y', b.h / 2)
			.attr('dy', "0.35em")
			.attr('text-anchor', 'middle')
			.text(percentageString);
		d3.select("#trail")
			.style('visibility', "")
	}
	//initialize breadcrumb
	function initializeBreadcrumbTrail() {
		//add the svg area
		var trail = d3.select('#sequence').append('svg')
			.attr('id', 'trail')
			.attr('width', width)
			.attr('height', 50)
			//add the label at the end for the percentage 
			.append('text')
			.attr('id', 'endlabel')
			.style('fill', '#000')
	}
	//generate a string that describes the points of a breadcrumb polygon
	function breadcrumbPoints(text, i) {
		var points = [];
		var textLength = text[i].name.length;
		points.push("0, 0");
		points.push(b.w * textLength + ", 0");
		points.push(b.w * textLength + b.t + ", " + (b.h / 2));
		points.push(b.w * textLength + ", " + b.h);
		points.push("0, " + b.h);
		if (i > 0) {
			points.push(b.t + ", " + (b.h / 2))
		}
		return points.join("")
	}
	//calculate breadcrumb transform distance 
	function breadcrumbTransformDistance(text, i) {
		var sum = 0;
		for (var j = 0; j < i; j++) {
			sum += b.w * text[j].name.length + b.s
		}
		return sum
	}
	//append the svg canvas to the page 
	var svg = d3.select('#viz')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.bottom + ')');
	//append the div to the tooltip
	var tooltip = d3.select('#viz')
		.append('div')
		.attr("class", 'tooltip');
	tooltip.style('opacity', 0)
		.append('p')
		.attr('class', 'value')
	//create the container for the slide 
	var context = svg.append('g')
		.attr('transform', 'translate(0,' + (height - 50) + ')')
		.attr('class', 'context');
	var timeScale = d3.time.scale()
		.range([0, width]);
	var x = d3.time.scale()
		.range([0, width]);
	var y = d3.scale.linear().range([height2, 0]);
	var xAxis = d3.svg.axis()
		.scale(timeScale)
		.orient('bottom');
	var brush = d3.svg.brush();
	//Set the sankey diagram properties  
	var sankey = d3.sankey()
		.nodeWidth(36)
		.nodePadding(15)
		.size([width, height - 60]);
	var path = sankey.link();
	var linearGradientSvg = svg.append('defs');
	var linkSvg = svg.append('g');
	var nodeSvg = svg.append('g');
	//brush area 
	var area = d3.svg.area()
		// .curve(d3,curveMonotoneX)
		.x(function (d) {
			return timeScale(d.date)
		})
		.y0(height2)
		.y1(function (d) {
			return y(d.value)
		});
	var line = d3.svg.line()
		.x(function (d) {
			return timeScale(d.date)
		})
		.y(function (d) {
			return y(d.value)
		});

	function calculateHeaders(data, title, name) {
		//console.log(data)
		var tempData = [],
			tempSum = [],
			object;
		for (var i = 0; i < title.length; i++) {
			var temp;
			temp = _.filter(data, function (value, key) {
				if (title[i] == 'AP1') {
					return value.source == title[i];
				} else {
					return value.target == title[i];
				}
			})
			tempData.push(temp);
		}
		//console.log(tempData)
		for (var k = 0; k < tempData.length; k++) {
			var sum = d3.sum(tempData[k], function (d, i) {
				return parseInt(d.value)
			})
			tempSum.push(sum);
		}
		var finalSum = 0;
		for (var j = 0; j < tempSum.length; j++) {
			//console.log(tempSum[j])
			finalSum = finalSum + tempSum[j];
		}
		//console.log(finalSum)
		object = {
			"name": name,
			"value": finalSum
		}
		return object;
	}
	//load the data
	d3.csv('fullFUNnel1.csv', function (error, originData) {
		vm.level1 = calculateHeaders(originData, level1List, "Verification");
		vm.level2 = calculateHeaders(originData, level2List, "AP1_Approve");
		vm.level3 = calculateHeaders(originData, level3List, "AP2_Approval");
		vm.level4 = calculateHeaders(originData, level4List, "CLOSED");
		//format the date and value string and sort by date 
		var formattedData = originData.map(function (d) {
			d.value = parseInt(d.value);
			d.date = new Date(d.date);
			return d;
		});
		formattedData.sort(function (a, b) {
			return b.date - a.date;
		});
		var date = [],
			date1 = [new Date('12/27/2016'), formattedData[0].date];
		if (sessionStorage.date) {
			date = JSON.parse(sessionStorage.getItem('date'));
			date.forEach(function (d, i, a) {
				a[i] = new Date(Date.parse(d));
			})
		} else {
			date = date1;
		}
		if (sessionStorage.node) {
			vm.titleName = sessionStorage.getItem('node')
		} else {
			vm.titleName = "CLOSED";

		}

		x.domain(date);
		brush.x(x).on('brush', function () {
			brushed()
		});
		var closedLineData = angular.copy(formattedData);
		var lineData1;
		if (sessionStorage.node) {
			lineData1 = getLineData(date1, closedLineData, vm.titleName)
		} else {
			lineData1 = getLineData(date1, closedLineData, 'CLOSED')
		}
		timeScale.domain(d3.extent(lineData1, function (d) {
			return d.date
		}))
		y.domain([0, d3.max(lineData1, function (d) {
			return d.value
		})])
		context.append('path')
			.datum(lineData1)
			.attr('id', 'nodeline')
			.attr('d', line)
			.attr('fill', 'none')
			.attr('stroke', '#008b00')
		context.append('g')
			.attr('class', 'x axis1')
			.attr('transform', 'translate(0,' + height2 + ')')
			.call(xAxis)
		context.append('g')
			.attr('class', 'x brush')
			.call(brush)
			.selectAll('rect')
			.attr('height', height2)
			.attr('fill', '#7cb5ec')
			.attr('opacity', '0.3')
		d3.select('.e').select('rect')
			.attr('y', 0)
			.attr('stroke', '#b2b2b6')
			.attr('opacity', 1)
			.attr('fill', '#ebe7e8')
			.style('visibility', 'visible')
		d3.select('.w').select('rect')
			.attr('y', 0)
			.attr('stroke', '#b2b2b6')
			.attr('opacity', 1)
			.attr('fill', '#ebe7e8')
			.style('visibility', 'visible')
		drawBrush(date);
		var data = angular.copy(formattedData);
		renderRangeSankey(date, data);
		$scope.$watch(function () {
			return vm.datePicker
		}, function (newVal) {
			var date = [];
			if (newVal['startDate'] instanceof Date || newVal['endDate'] instanceof Date) {
				date.push(newVal['startDate']);
				date.push(newVal['endDate']);
			} else {
				date.push(newVal['startDate'].toDate());
				date.push(newVal['endDate'].toDate());
			}
			drawBrush(date);
			var data = angular.copy(formattedData);
			renderRangeSankey(date, data);
		});
		vm.datePicker = {
			startDate: date[0],
			endDate: date[1]
		};
		vm.options = {
			locale: {
				format: 'MM/DD/YYYY',
				customRangeLabel: 'Custom range'
			},
			ranges: {
				"Today": date1
			}
		};
		if (!$scope.$$phase) {
			$scope.$apply();
		}
		//brush 
		function brushed() {
			vm.datePicker = {
				startDate: brush.extent()[0],
				endDate: brush.extent()[1]
			}
			if (!$scope.$$phase) {
				$scope.$apply();
			}
			//var data = angular.copy(formattedData)
			//renderRangeSankey (vm.datePicker.data)
		}
		//draw the brush extent 
		function drawBrush(date) {
			brush.extent(date);
			brush(d3.select('.brush').transition());
			//brush.event(d3.select('.brush').transition().delay(1000))
		}
		vm.funnelChart = Highcharts.chart('funnel', {
			credits: {
				enabled: false
			},
			chart: {
				type: 'funnel',
				marginRight: 100
			},
			title: {
				text: 'Customer Journey',
				x: -50
			},
			plotOptions: {
				series: {
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b><br/>{point.y:,.0f}',
						//color : (Highcharts.theme &&  Highcharts.theme.contrastTextColor) // 'black',
						softConnector: true
					},
					neckWidth: '35%',
					neckHeight: '20%',
					height: 180
					// -- Other available options
					// height : pixels or percent 
					// width : pixels or percent
				}
			},
			legend: {
				enabled: false
			},
			series: [{
				name: 'Customer Journey',
				data: [
					// ['Verification', vm.level1.value],
					// ['AP1_Approve', vm.level2.value],
					// ['AP2_Approve1', vm.level3.value],
					// ['CLOSED', vm.level3.value]
					['Verification', 17485],
					['AP1_Approve', 6250],
					['AP2_Approve1', 796],
					['CLOSED', 796]
				]
			}]
		})
		// vm.pieChart = Highcharts.chart('pie', {
		// 	credits: {
		// 		enabled: false
		// 	},
		// 	chart: {
		// 		plotBackgroundColor: null,
		// 		plotBorderWidth: null,
		// 		plotShadow: false,
		// 		type: 'pie'
		// 	},
		// 	title: {
		// 		text: 'Titel'
		// 	},
		// 	tooltip: {
		// 		pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		// 	},
		// 	plotOptions: {
		// 		pie: {
		// 			allowPointSelect: true,
		// 			cursor: 'pointer',
		// 			dataLabels: {
		// 				enabled: false
		// 			},
		// 			showInLegend: true
		// 		}
		// 	},
		// 	series: [{
		// 		name: 'Brands',
		// 		colorByPoint: true,
		// 		data: [{
		// 			name: 'Microsoft Internet Explorer',
		// 			y: 56.33
		// 		}, {
		// 			name: 'Chrome',
		// 			y: 24.03,
		// 			sliced: true,
		// 			selected: true
		// 		}, {
		// 			name: 'Firefox',
		// 			y: 10.38
		// 		}, {
		// 			name: 'Safari',
		// 			y: 4.77
		// 		}, {
		// 			name: 'Opera',
		// 			y: 0.91
		// 		}, {
		// 			name: 'Proprietary or Undetectable',
		// 			y: 0.2
		// 		}]
		// 	}]
		// })
		//render multiple day date  	
		function renderRangeSankey(date, data) {
			var rangeData = getRangeData(date, data);
			var graph = {
				'nodes': [],
				'links': []
			};
			rangeData.forEach(function (d) {
				graph.nodes.push({
					'name': d.source
				});
				graph.nodes.push({
					'name': d.target
				});
				graph.links.push({
					'source': d.source,
					'target': d.target,
					'value': +d.value
				});
			});
			//return only the distinct nodes  
			graph.nodes = d3.keys(d3.nest().key(function (d) {
					return d.name;
				})
				.map(graph.nodes));
			//loop through each link replacing the text with its index from node 
			graph.links.forEach(function (d, i) {
				graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
				graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
			});
			//now loop through each nodes to make nodes an array of objects
			//rather than array of strings
			graph.nodes.forEach(function (d, i) {
				graph.nodes[i] = {
					'name': d
				};
			});
			renderSankey(graph);
		}
		//get the given range days data
		function getRangeData(date, data) {
			var newData, start, end, sum, temp = {},
				obj = null,
				result = [];
			date[0].setHours(0, 0, 0, 0)
			date[1].setHours(0, 0, 0, 0)
			start = data.findIndex(function (element) {
				return element.date <= date[1];
			});
			end = data.findIndex(function (element) {
				return element.date < date[0];
			});
			(end == -1) ? end = data.length: end = end;
			newData = data.slice(start, end);
			// newData.reverse(); 
			for (var i = 0; i < newData.length; i++) {
				obj = newData[i]
				if (!temp[obj.source + "-" + obj.target]) {
					temp[obj.source + "-" + obj.target] = obj;
				} else {
					temp[obj.source + "-" + obj.target].value += obj.value
				}

			}
			for (var prop in temp) {
				result.push(temp[prop])
			}
			return result
		}

		function getLineData(date, data, nodeName) {
			var newData, start, end, result = [],
				Temp = {};
			date[0].setHours(0, 0, 0, 0)
			date[1].setHours(0, 0, 0, 0)
			start = data.findIndex(function (element) {
				return element.date <= date[1];
			});
			end = data.findIndex(function (element) {
				return element.date < date[0];
			});
			(end == -1) ? end = data.length: end = end;
			newData = data.slice(start, end);
			newData.reverse();
			newData.forEach(function (d) {
				if (d.source == nodeName && nodeName == 'AP1') {
					if (!Temp[d.date]) {
						Temp[d.date] = d
					} else {
						Temp[d.date].value += d.value;
					}
				} else if (d.target == nodeName) {
					if (!Temp[d.date]) {
						Temp[d.date] = d
					} else {
						Temp[d.date].value += d.value;
					}
				}
			});
			for (var pro in Temp) {
				result.push({
					date: Temp[pro]['date'],
					value: Temp[pro]['value']
				})
			}
			return result;

		}

		function getAP1LineData(date, data) {
			var newData, start, end, result = [],
				Temp = {};
			date[0].setHours(0, 0, 0, 0)
			date[1].setHours(0, 0, 0, 0)
			start = data.findIndex(function (element) {
				return element.date <= date[1];
			});
			end = data.findIndex(function (element) {
				return element.date < date[0];
			});
			(end == -1) ? end = data.length: end = end;
			newData = data.slice(start, end);
			newData.reverse();
			newData.forEach(function (d) {
				if (d.source == 'AP1') {
					if (!Temp[d.date]) {
						Temp[d.date] = d
					} else {
						Temp[d.date].value += d.value;
					}
				}
			});
			for (var pro in Temp) {
				result.push({
					date: Temp[pro]['date'],
					value: Temp[pro]['value']
				})
			}
			return result;
		}
		//render the sankey chart
		function renderSankey(graph) {
			var link = linkSvg.selectAll('.link');
			var node = nodeSvg.selectAll('.node');
			sankey
				.nodes(graph.nodes)
				.links(graph.links)
				.layout(32);
			//create a linear gradient for each states
			var linearGradient =
				linearGradientSvg.selectAll('linearGradient').data(graph.links);
			linearGradient
				.attr('id', function (d, i) {
					return 'gradient-' + i;
				});
			linearGradient.select('.stop1')
				.style('stop-color', function (d) {
					if (d.source.name == "AP1" || d.source.name == "Verification") {
						return '#07843f';
					} else if (d.source.name.includes('Approve')) {
						return '#07843f';
					} else if (d.source.name.includes('APPROVED')) {
						return '#07843f';
					} else if (d.source.name.includes('APPROVAL')) {
						return '#07843f';
					} else if (d.source.name.includes('CLOSED')) {
						return '#07843f';
					} else if (d.source.name.includes('DECLINED')) {
						return '#FF0000';
					} else if (d.source.name.includes('Decline')) {
						return '#FF0000';
					} else if (d.source.name.includes('Verification_Unknown')) {
						return '#FFD700';
					} else if (d.source.name.includes('ABANDONED')) {
						return '#FF0000';
					} else if (d.source.name.includes('WALKAWAY')) {
						return '#FFD700';
					} else if (d.source.name.includes('PENDING') || d.source.name.includes('INCOMPLETE') || d.source.name.includes('OPEN')) {
						return '#FFD700';
					}
				});
			linearGradient.select('.stop2')
				.style('stop-color', function (d) {
					if (d.target.name == "AP1" || d.target.name == "Verification") {
						return '#07843f';
					} else if (d.target.name.includes('Approve')) {
						return '#07843f';
					} else if (d.target.name.includes('APPROVED')) {
						return '#07843f';
					} else if (d.target.name.includes('APPROVAL')) {
						return '#07843f';
					} else if (d.target.name.includes('CLOSED')) {
						return '#07843f';
					} else if (d.target.name.includes('DECLINED')) {
						return '#FF0000';
					} else if (d.target.name.includes('Decline')) {
						return '#FF0000';
					} else if (d.target.name.includes('Verification_Unknown')) {
						return '#FFD700';
					} else if (d.target.name.includes('ABANDONED')) {
						return '#FF0000';
					} else if (d.target.name.includes('WALKAWAY')) {
						return '#FFD700';
					} else if (d.target.name.includes('PENDING') || d.target.name.includes('INCOMPLETE') || d.target.name.includes('OPEN')) {
						return '#FFD700';
					}
				});
			var linearGradientStop = linearGradient
				.enter().append('linearGradient')
				.attr('id', function (d, i) {
					return 'gradient-' + i;
				})
				.attr('x1', '0%')
				.attr('x2', '100%')
				.attr('y1', '0%')
				.attr('y2', '0%');
			linearGradientStop.append('stop')
				.attr('offset', '0% ')
				.attr('class', 'stop1')
				.style('stop-color', function (d) {
					if (d.source.name == "AP1" || d.source.name == "Verification") {
						return '#07843f';
					} else if (d.source.name.includes('Approve')) {
						return '#07843f';
					} else if (d.source.name.includes('APPROVED')) {
						return '#07843f';
					} else if (d.source.name.includes('APPROVAL')) {
						return '#07843f';
					} else if (d.source.name.includes('CLOSED')) {
						return '#07843f';
					} else if (d.source.name.includes('DECLINED')) {
						return '#FF0000';
					} else if (d.source.name.includes('Decline')) {
						return '#FF0000';
					} else if (d.source.name.includes('Verification_Unknown')) {
						return '#FFD700';
					} else if (d.source.name.includes('ABANDONED')) {
						return '#FF0000';
					} else if (d.source.name.includes('WALKAWAY')) {
						return '#FFD700';
					} else if (d.source.name.includes('PENDING') || d.source.name.includes('INCOMPLETE') || d.source.name.includes('OPEN')) {
						return '#FFD700';
					}
				});

			linearGradientStop.append('stop')
				.attr('offset', '100%')
				.attr('class', 'stop2')
				.style('stop-color', function (d) {
					if (d.target.name == "AP1" || d.target.name == "Verification") {
						return '#07843f';
					} else if (d.target.name.includes('Approve')) {
						return '#07843f';
					} else if (d.target.name.includes('APPROVED')) {
						return '#07843f';
					} else if (d.target.name.includes('APPROVAL')) {
						return '#07843f';
					} else if (d.target.name.includes('CLOSED')) {
						return '#07843f';
					} else if (d.target.name.includes('DECLINED')) {
						return '#FF0000';
					} else if (d.target.name.includes('Decline')) {
						return '#FF0000';
					} else if (d.target.name.includes('Verification_Unknown')) {
						return '#FFD700';
					} else if (d.target.name.includes('ABANDONED')) {
						return '#FF0000';
					} else if (d.target.name.includes('WALKAWAY')) {
						return '#FFD700';
					} else if (d.target.name.includes('PENDING') || d.target.name.includes('INCOMPLETE') || d.target.name.includes('OPEN')) {
						return '#FFD700';
					}
				});
			linearGradient.exit().remove();
			//add in the links
			var linkUpdate = link.data(graph.links);
			linkUpdate
				.attr('d', path)
				.attr("id", function (d, i) {
					d.id = i;
					return "link-" + i;
				})
				.style('stroke-dasharray', 2000)
				.style('stroke-dashoffset', 2000)
				.style('stroke-width', function (d) {
					return Math.max(1, d.dy);
				})
				.sort(function (a, b) {
					return b.dy - a.dy;
				})
				.style('stroke', function (d) {
					return "url(#gradient-" + d.id + ")";
					// return 'steelblue';
				})
				.style('fill', 'none')
				.style('stroke-opacity', 0.5)
				.transition()
				.duration(1500)
				.delay(function (d, i) {
					return 800 * i / 10
				})
				.ease('linear')
				.style('stroke-dashoffset', 0);
			linkUpdate.enter()
				.append('path')
				.attr('class', 'link')
				.attr('d', path)
				.attr("id", function (d, i) {
					d.id = i;
					return "link-" + i;
				})
				.on('mouseenter', function (d) {
					showLinksDetail(d);
				})
				.on('mouseleave', hideTooltip)
				.on('mousemove', function () {
					var tooltipWidth = tooltip[0][0].clientWidth;
					tooltip.style('left', function () {
							if (d3.event.pageX + tooltipWidth > width) {
								return d3.event.pageX - tooltipWidth - 10 + "px";
							} else {
								return d3.event.pageX + 10 + "px";
							}
						})
						.style('top', d3.event.pageY - 150 + "px")
				})
				.style('stroke-dasharray', 2000)
				.style('stroke-dashoffset', 2000)
				.style('stroke-width', function (d) {
					return Math.max(1, d.dy);
				})
				.sort(function (a, b) {
					return b.dy - a.dy;
				})
				.style('stroke', function (d) {
					return "url(#gradient-" + d.id + ")";
					// return 'steelblue';
				})
				.style('fill', 'none')
				.style('stroke-opacity', 0.5)
				.transition()
				.duration(1500)
				.delay(function (d, i) {
					return 800 * i / 10
				})
				.ease('linear')
				.style('stroke-dashoffset', 0);
			linkUpdate.exit().remove();
			//add in the nodes
			var nodeUpdate = node.data(graph.nodes);
			nodeUpdate
				.attr('transform', function (d) {
					return 'translate(' + d.x + ',' + d.y + ')';
				});
			nodeUpdate.select('rect')
				.attr('height', function (d) {
					return d.dy;
				})
				.attr('id', function (d) {
					return d.name
				})
				.attr('width', sankey.nodeWidth())
				.style('fill', function (d) {
					if (d.name == "AP1" || d.name == "Verification") {
						return '#07843f';
					} else if (d.name.includes('Approve')) {
						return '#07843f';
					} else if (d.name.includes('APPROVED')) {
						return '#07843f';
					} else if (d.name.includes('APPROVAL')) {
						return '#07843f';
					} else if (d.name.includes('CLOSED')) {
						return '#07843f';
					} else if (d.name.includes('DECLINED')) {
						return '#FF0000';
					} else if (d.name.includes('Decline')) {
						return '#FF0000';
					} else if (d.name.includes('Verification_Unknown')) {
						return '#FFD700';
					} else if (d.name.includes('ABANDONED')) {
						return '#FF0000';
					} else if (d.name.includes('WALKAWAY')) {
						return '#FFD700';
					} else if (d.name.includes('PENDING') || d.name.includes('INCOMPLETE') || d.name.includes('OPEN')) {
						return '#FFD700';
					}
				})
				.style('opacity', 1)
				.style('stroke', function (d) {
					return d3.rgb(d.color).darker(2);
				})
			//d3.selectAll(".nodeText").remove();
			nodeUpdate.select("text")
				.attr("x", -6)
				.attr("class", "nodeText")
				.attr('fill', 'black')
				.attr('stroke', 'none')
				.attr("y", function (d) {
					return d.dy / 2;
				})
				.attr("dy", ".35em")
				.attr("text-anchor", "end")
				.attr("transform", null)
				.text(function (d) {
					return d.name + '-' + d.value
				})
				.filter(function (d) {
					return d.name === 'Verification' || d.name === 'Verification_Decline' || d.name === 'Verification_Approve' || d.name === 'DECLINED'
				})
				.attr('x', function (d) {
					return -d.dy / 3
				})
				.attr('y', function (d) {
					return d.dx / 2 + 2
				})
				.attr('transform', 'rotate(270)')
			nodeUpdate.enter().append('g')
				.attr('class', 'node')
				.attr('transform', function (d) {
					return ' translate(' + d.x + ',' + d.y + ')';
				})
				.append('rect')
				.attr('height', function (d) {
					return d.dy;
				})
				.attr('width', sankey.nodeWidth())
				.attr('id', function (d) {
					return d.name
				})
				.style('fill', function (d) {
					if (d.name == "AP1") {
						return '#07843f';
					} else if (d.name.includes('Approve')) {
						return '#07843f';
					} else if (d.name.includes('APPROVED')) {
						return '#07843f';
					} else if (d.name.includes('APPROVAL')) {
						return '#07843f';
					} else if (d.name.includes('CLOSED')) {
						return '#07843f';
					} else if (d.name.includes('DECLINED')) {
						return '#FF0000';
					} else if (d.name.includes('Decline')) {
						return '#FF0000';
					} else if (d.name.includes('Verification_Unknown')) {
						return '#FFD700';
					} else if (d.name.includes('ABANDONED')) {
						return '#FF0000';
					} else if (d.name.includes('WALKAWAY')) {
						return '#FFD700';
					} else if (d.name.includes('PENDING') || d.name.includes('INCOMPLETE') || d.name.includes('OPEN')) {
						return '#FFD700';
					}
				})
				.style('opacity', 1)
				.style('stroke', function (d) {
					return d3.rgb(d.color).darker(2);
				})
				.style('pointer-events', 'all')
				.on('click', highlightNodeLink)
				.on('dblclick', function (d) {
					showNodeDetail(d);
				})
				.on('mouseenter', function (d) {
					showNodesDetail(d);
				})
				.on('mouseleave', hideTooltip)
				.on('mousemove', function (event) {
					var tooltipWidth = tooltip[0][0].clientWidth;
					tooltip.style('left', function () {
							if (d3.event.pageX + tooltipWidth > width) {
								return d3.event.pageX - tooltipWidth - 10 + "px";
							} else {
								return d3.event.pageX + 10 + "px";
							}
						})
						.style('top', d3.event.pageY - 150 + "px")
				})
				.select(function () {
					return this.parentNode;
				})
				.append("text")
				.attr("x", -6)
				.attr("class", "nodeText")
				.attr('fill', 'black')
				.attr('stroke', 'none')
				.attr("y", function (d) {
					return d.dy / 2;
				})
				.attr("dy", ".35em")
				.attr("text-anchor", "end")
				.attr("transform", null)
				.text(function (d) {
					return d.name + '-' + d.value
				})
				.filter(function (d) {
					return d.name === 'AP1' || d.name === 'AP1_Decline' || d.name === 'AP1_Approve' || d.name === 'DECLINED'
				})
				.attr('x', function (d) {
					return -d.dy / 2
				})
				.attr('y', function (d) {
					return d.dx / 2 + 2
				})
				.attr('transform', 'rotate(270)')
			// .call (d3.behavior.drag()
			// 	.origin(function(d) {
			// 		return d;
			//	})
			// 	.on('dragstart', function() {
			//		this.parentNode.appendChild(this);
			//	})
			nodeUpdate.exit().remove();
			// the function for moving the nodes
			function dragmove(d) {
				d3.select(this).attr('transform', 'translate(' + d.x + ',' + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ')');
				sankey.relayout();
				link.attr('d', path);
			}
			//highlight all connecting paths of a node
			function highlightNodeLink(node) {
				var remainingNodes = [],
					nextNodes = [];
				var strokeOpacity = 0.5;
				// if (d3.select(this).attr("data-clicked")=="1") {
				// 	d3.select(this).attr("data-clicked"), "0");
				// 	strokeOpacity =0.2;
				// } else {
				// d3.select (this).attr("data-clicked", "1");
				// strokeOpacity = 0.5;
				// }
				d3.selectAll(".link").style("stroke-opacity", 0.2);
				d3.selectAll(".node").select('rect').style("stroke-opacity", 0.2);
				var traverse = [{
					linkType: "sourceLinks",
					nodeType: "target"
				}, {
					linkType: "targetLinks",
					nodeType: "source"
				}];
				traverse.forEach(function (step) {
					node[step.linkType].forEach(function (link) {
						remainingNodes.push(link[step.nodeType]);
						highlightNode(link[step.nodeType]['name'])
						highlightLink(link.id, strokeOpacity);
					});
					while (remainingNodes.length) {
						nextNodes = [];
						remainingNodes.forEach(function (node) {
							node[step.linkType].forEach(function (link) {
								nextNodes.push(link[step.nodeType]);
								highlightNode(link[step.nodeType]['name'])
								highlightLink(link.id, strokeOpacity)
							})
						});
						remainingNodes = nextNodes;
					}
				});
				highlightNode(node.name)
				vm.titleName = node.name;
				if (!$scope.$$phase) {
					$scope.$apply();
				}
				var data = angular.copy(formattedData)
				data = getLineData(date1, data, node.name);
				timeScale.domain(d3.extent(data, function (d) {
					return d.date
				}))
				y.domain([0, d3.max(data, function (d) {
					return d.value
				})])
				d3.select('#nodeline').remove()
				d3.select('.context')
					.append('path')
					.datum(data)
					.attr('id', 'nodeline')
					.attr('d', line)
					.attr('fill', 'none')
					.attr('stroke', function (d) {
						if (node.name == "AP1" || node.name == "Verification") {
							return '#07843f';
						} else if (node.name.includes('Approve')) {
							return '#07843f';
						} else if (node.name.includes('APPROVED')) {
							return '#07843f';
						} else if (node.name.includes('APPROVAL')) {
							return '#07843f';
						} else if (node.name.includes('CLOSED')) {
							return '#07843f';
						} else if (node.name.includes('DECLINED')) {
							return '#FF0000';
						} else if (node.name.includes('Decline')) {
							return '#FF0000';
						} else if (node.name.includes('Verification_Unknown')) {
							return '#FFD700';
						} else if (node.name.includes('ABANDONED')) {
							return '#FF0000';
						} else if (node.name.includes('WALKAWAY')) {
							return '#FFD700';
						} else if (node.name.includes('PENDING') || node.name.includes('INCOMPLETE') || node.name.includes('OPEN')) {
							return '#FFD700';
						}
					})
			}
			//highlight the link 
			function highlightLink(id, opacity) {
				d3.select("#link-" + id).style("stroke-opacity", opacity);
			}

			function highlightNode(nodeName) {
				d3.select('#' + nodeName).style('opacity', 1)
			}
			//show node details			
			function showNodesDetail(d) {
				showTooltip().select(".value")
					.html(function () {
						return " <div style = 'border: solid 1 px;padding: 5 px;background-color: white'> Node Name: " + d.name + " </div>"
					})
			}
			//show Links details
			function showLinksDetail(d) {
				showTooltip().select('.value')
					.html(function () {
						return "<div class='linksdetail' style='border: solid 1 px;background-color: white;padding: 5px;'>" + "<div>Source:" + d.source.name + "</div>" +
							"<div>Target: " + d.target.name + "</div>" +
							"<div>Customer_count: " + d.value + " </div>" + "</div>"
					})
			}

			function showNodeDetail(d) {
				$state.go('nodedetail', {
					data: d,
					date: vm.datePicker
				})
			}
			//hide the tooltip
			function hideTooltip() {
				return tooltip
					.style('opacity', 0)
					.style('left', '0px')
					.style('top', '0px')
			}

			function showTooltip() {
				return tooltip.style('opacity', 1)
			}
		}
	})
}])