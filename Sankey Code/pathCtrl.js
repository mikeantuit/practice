'use strict'
app.controller('pathsController', function ($scope) {
	var vm = this;
	vm.grouping = [];
	var margin = {
			top: 20,
			right: 20,
			bottom: 20,
			left: 20
		},
		width = parseInt(d3.select('#chordChart').style('width'), 10) - margin.left - margin.right,
		width1 = parseInt(d3.select('#q').style('height'), 10) - margin.top - margin.bottom,
		height = width,
		innerRadius = Math.min(width, height) * 0.39,
		outerRadius = innerRadius * 1.1,
		names = ['Channel1', 'Channel2', 'Channel3', 'Channel4', 'Channel5', 'Channel6'],
		colors = ['#301E1E', '#083E77', '#342350', '#567235', '#8B161C', '#DF7C00'],
		opacityDefault = 0.8;

	var matrix = [
		[0, 4, 3, 2, 5, 2], //Black Widow
		[4, 0, 3, 2, 4, 3], //Captain America
		[3, 3, 0, 2, 3, 3], //Hawkeye
		[2, 2, 2, 0, 3, 3], //The Hulk
		[5, 4, 3, 3, 0, 2], //Iron Man
		[2, 3, 3, 3, 2, 0], //Thor
	];

	////////////////////////////////////////////////////////////
	/////////// Create scale and layout functions //////////////
	////////////////////////////////////////////////////////////

	var colors = d3.scale.ordinal()
		.domain(d3.range(names.length))
		.range(colors);

	//A "custom" d3 chord function that automatically sorts the order of the chords in such a manner to reduce overlap	
	var chord = customChordLayout()
		.padding(.15)
		.sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
		.matrix(matrix);

	var arc = d3.svg.arc()
		.innerRadius(innerRadius * 1.01)
		.outerRadius(outerRadius);

	var path = d3.svg.chord()
		.radius(innerRadius);

	////////////////////////////////////////////////////////////
	////////////////////// Create SVG //////////////////////////
	////////////////////////////////////////////////////////////

	var svg = d3.select("#chordChart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

	////////////////////////////////////////////////////////////
	/////////////// Create the gradient fills //////////////////
	////////////////////////////////////////////////////////////

	//Function to create the id for each chord gradient
	function getGradID(d) {
		return "linkGrad-" + d.source.index + "-" + d.target.index;
	}

	//Create the gradients definitions for each chord
	var grads = svg.append("defs").selectAll("linearGradient")
		.data(chord.chords())
		.enter().append("linearGradient")
		.attr("id", getGradID)
		.attr("gradientUnits", "userSpaceOnUse")
		.attr("x1", function (d, i) {
			return innerRadius * Math.cos((d.source.endAngle - d.source.startAngle) / 2 + d.source.startAngle - Math.PI / 2);
		})
		.attr("y1", function (d, i) {
			return innerRadius * Math.sin((d.source.endAngle - d.source.startAngle) / 2 + d.source.startAngle - Math.PI / 2);
		})
		.attr("x2", function (d, i) {
			return innerRadius * Math.cos((d.target.endAngle - d.target.startAngle) / 2 + d.target.startAngle - Math.PI / 2);
		})
		.attr("y2", function (d, i) {
			return innerRadius * Math.sin((d.target.endAngle - d.target.startAngle) / 2 + d.target.startAngle - Math.PI / 2);
		})

	//Set the starting color (at 0%)
	grads.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", function (d) {
			return colors(d.source.index);
		});

	//Set the ending color (at 100%)
	grads.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", function (d) {
			return colors(d.target.index);
		});

	////////////////////////////////////////////////////////////
	////////////////// Draw outer Arcs /////////////////////////
	////////////////////////////////////////////////////////////

	var outerArcs = svg.selectAll("g.group")
		.data(chord.groups)
		.enter().append("g")
		.attr("class", "group")
		.on("mouseover", fade(.1))
		.on("mouseout", fade(opacityDefault));

	outerArcs.append("path")
		.style("fill", function (d) {
			return colors(d.index);
		})
		.attr("d", arc)
		.each(function (d, i) {
			//Search pattern for everything between the start and the first capital L
			var firstArcSection = /(^.+?)L/;

			//Grab everything up to the first Line statement
			var newArc = firstArcSection.exec(d3.select(this).attr("d"))[1];
			//Replace all the comma's so that IE can handle it
			newArc = newArc.replace(/,/g, " ");

			//If the end angle lies beyond a quarter of a circle (90 degrees or pi/2) 
			//flip the end and start position
			if (d.endAngle > 90 * Math.PI / 180 & d.startAngle < 270 * Math.PI / 180) {
				var startLoc = /M(.*?)A/, //Everything between the first capital M and first capital A
					middleLoc = /A(.*?)0 0 1/, //Everything between the first capital A and 0 0 1
					endLoc = /0 0 1 (.*?)$/; //Everything between the first 0 0 1 and the end of the string (denoted by $)
				//Flip the direction of the arc by switching the start en end point (and sweep flag)
				//of those elements that are below the horizontal line
				var newStart = endLoc.exec(newArc)[1];
				var newEnd = startLoc.exec(newArc)[1];
				var middleSec = middleLoc.exec(newArc)[1];

				//Build up the new arc notation, set the sweep-flag to 0
				newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd;
			} //if

			//Create a new invisible arc that the text can flow along
			svg.append("path")
				.attr("class", "hiddenArcs")
				.attr("id", "arc" + i)
				.attr("d", newArc)
				.style("fill", "none");
		});

	////////////////////////////////////////////////////////////
	////////////////// Append Names ////////////////////////////
	////////////////////////////////////////////////////////////

	//Append the label names on the outside
	outerArcs.append("text")
		.attr("class", "titles")
		.attr("dy", function (d, i) {
			return (d.endAngle > 90 * Math.PI / 180 & d.startAngle < 270 * Math.PI / 180 ? 25 : -16);
		})
		.append("textPath")
		.attr("startOffset", "50%")
		.style("text-anchor", "middle")
		.attr("xlink:href", function (d, i) {
			return "#arc" + i;
		})
		.text(function (d, i) {
			return names[i];
		});

	////////////////////////////////////////////////////////////
	////////////////// Draw inner chords ///////////////////////
	////////////////////////////////////////////////////////////

	svg.selectAll("path.chord")
		.data(chord.chords)
		.enter().append("path")
		.attr("class", "chord")
		.style("fill", function (d) {
			return "url(#" + getGradID(d) + ")";
		})
		.style("opacity", opacityDefault)
		.attr("d", path)
		.on("mouseover", mouseoverChord)
		.on("mouseout", mouseoutChord);

	////////////////////////////////////////////////////////////
	////////////////// Extra Functions /////////////////////////
	////////////////////////////////////////////////////////////

	//Returns an event handler for fading a given chord group.
	function fade(opacity) {
		return function (d, i) {
			svg.selectAll("path.chord")
				.filter(function (d) {
					return d.source.index !== i && d.target.index !== i;
				})
				.transition()
				.style("opacity", opacity);
		};
	} //fade

	//Highlight hovered over chord
	function mouseoverChord(d, i) {

		//Decrease opacity to all
		svg.selectAll("path.chord")
			.transition()
			.style("opacity", 0.1);
		//Show hovered over chord with full opacity
		d3.select(this)
			.transition()
			.style("opacity", 1);

		//Define and show the tooltip over the mouse location
		$(this).popover({
			placement: 'auto top',
			container: 'body',
			mouseOffset: 10,
			followMouse: true,
			trigger: 'hover',
			html: true,
			content: function () {
				return "<p style='font-size: 11px; text-align: center;'><span style='font-weight:900'>" + Names[d.source.index] +
					"</span> and <span style='font-weight:900'>" + Names[d.target.index] +
					"</span> appeared together in <span style='font-weight:900'>" + d.source.value + "</span> movies </p>";
			}
		});
		$(this).popover('show');
	} //mouseoverChord

	//Bring all chords back to default opacity
	function mouseoutChord(d) {
		//Hide the tooltip
		$('.popover').each(function () {
			$(this).remove();
		});
		//Set opacity back to default for all
		svg.selectAll("path.chord")
			.transition()
			.style("opacity", opacityDefault);
	}

	function customChordLayout() {
		var ε = 1e-6,
			ε2 = ε * ε,
			π = Math.PI,
			τ = 2 * π,
			τε = τ - ε,
			halfπ = π / 2,
			d3_radians = π / 180,
			d3_degrees = 180 / π;
		var chord = {},
			chords, groups, matrix, n, padding = 0,
			sortGroups, sortSubgroups, sortChords;

		function relayout() {
			var subgroups = {},
				groupSums = [],
				groupIndex = d3.range(n),
				subgroupIndex = [],
				k, x, x0, i, j;
			var numSeq;
			chords = [];
			groups = [];
			k = 0, i = -1;

			while (++i < n) {
				x = 0, j = -1, numSeq = [];
				while (++j < n) {
					x += matrix[i][j];
				}
				groupSums.push(x);
				//////////////////////////////////////
				////////////// New part //////////////
				//////////////////////////////////////
				for (var m = 0; m < n; m++) {
					numSeq[m] = (n + (i - 1) - m) % n;
				}
				subgroupIndex.push(numSeq);
				//////////////////////////////////////
				//////////  End new part /////////////
				//////////////////////////////////////
				k += x;
			} //while

			k = (τ - padding * n) / k;
			x = 0, i = -1;
			while (++i < n) {
				x0 = x, j = -1;
				while (++j < n) {
					var di = groupIndex[i],
						dj = subgroupIndex[di][j],
						v = matrix[di][dj],
						a0 = x,
						a1 = x += v * k;
					subgroups[di + "-" + dj] = {
						index: di,
						subindex: dj,
						startAngle: a0,
						endAngle: a1,
						value: v
					};
				} //while

				groups[di] = {
					index: di,
					startAngle: x0,
					endAngle: x,
					value: (x - x0) / k
				};
				x += padding;
			} //while

			i = -1;
			while (++i < n) {
				j = i - 1;
				while (++j < n) {
					var source = subgroups[i + "-" + j],
						target = subgroups[j + "-" + i];
					if (source.value || target.value) {
						chords.push(source.value < target.value ? {
							source: target,
							target: source
						} : {
							source: source,
							target: target
						});
					} //if
				} //while
			} //while
			if (sortChords) resort();
		} //function relayout

		function resort() {
			chords.sort(function (a, b) {
				return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);
			});
		}
		chord.matrix = function (x) {
			if (!arguments.length) return matrix;
			n = (matrix = x) && matrix.length;
			chords = groups = null;
			return chord;
		};
		chord.padding = function (x) {
			if (!arguments.length) return padding;
			padding = x;
			chords = groups = null;
			return chord;
		};
		chord.sortGroups = function (x) {
			if (!arguments.length) return sortGroups;
			sortGroups = x;
			chords = groups = null;
			return chord;
		};
		chord.sortSubgroups = function (x) {
			if (!arguments.length) return sortSubgroups;
			sortSubgroups = x;
			chords = null;
			return chord;
		};
		chord.sortChords = function (x) {
			if (!arguments.length) return sortChords;
			sortChords = x;
			if (chords) resort();
			return chord;
		};
		chord.chords = function () {
			if (!chords) relayout();
			return chords;
		};
		chord.groups = function () {
			if (!groups) relayout();
			return groups;
		};
		return chord;
	};


	//sunburst starts here
	var b = {
		w: 12,
		h: 35,
		s: 3,
		t: 10
	};
	var color = d3.scale.category10();
	var radius = (Math.min(width, height) / 2) - 10;
	var x = d3.scale.linear().range([0, 2 * Math.PI]);
	var y = d3.scale.sqrt().range([0, radius]);
	var partition = d3.layout.partition().value(function (d) {
		return d.size;
	});
	var arc = d3.svg.arc()
		.startAngle(function (d) {
			return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
		})
		.endAngle(function (d) {
			return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
		})
		.innerRadius(function (d) {
			return Math.max(0, y(d.y));
		})
		.outerRadius(function (d) {
			return Math.max(0, y(d.y + d.dy));
		});
	d3.json('channelGrouping1.json', function (error, json) {
		console.log(json)
		angular.forEach(json, function (value, key) {
			vm.grouping.push({
				'id': value.idHtml,
				'percentage': value.percentage
			});
			if (!$scope.$$phase) {
				$scope.$apply();
			}
			initializeBreadcrumbTrail(value.idHtml, value.id, 540);
			updateBreadcrumbs(value.data, "", value.id)
		})
	})

	function updateBreadcrumbs(nodeArray, percentageString, id) {
		var g = d3.select('#' + id)
			.selectAll('g')
			.data(nodeArray, function (d) {
				return d.name + d.depth;
			});
		var entering = g.enter()
			.append('g');
		entering.append('polygon')
			.attr('points', function (d, i) {
				return breadcrumbPoints(nodeArray, i)
			})
			.style('fill', function (d) {
				if (d.name == 'Direct Mail') {
					return "#3498db"
				} else if (d.name == 'Google Serach') {
					return "#1abc9c"
				} else if (d.name == 'Bing Serach') {
					return "#df7c00"
				} else if (d.name == 'Facebook') {
					return "red"
				} else {
					return "steelblue"
				}
			})
		entering.append('text')
			.attr('x', function (d, i) {
				return (b.w * nodeArray[i].name.length + b.t) / 2
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
		d3.select('#' + id).select('#endlabel')
			.attr('x', function (d) {
				return breadcrumbTransformDistance(nodeArray, nodeArray.length) + 30;
			})
			.attr('y', b.h / 2)
			.attr('dy', "0.35em")
			.attr('text-anchor', 'middle')
			.text(percentageString);
		d3.select("#" + id)
			.style('visibility', "")
	}

	function initializeBreadcrumbTrail(id, trailId, width) {
		//add the svg area
		var trail = d3.select('#' + id).append('svg')
			.attr('id', trailId)
			.attr('width', width)
			.attr('height', 35)
			//add the label at the end for the percentage 
			.append('text')
			.attr('id', 'endlabel')
			.style('fill', '#000')
	}

	function breadcrumbPoints(text, i) {
		var points = [];
		var textLength = text[i].name.length;
		points.push("0,0");
		points.push(b.w * textLength + ",0");
		points.push(b.w * textLength + b.t + "," + (b.h / 2));
		points.push(b.w * textLength + "," + b.h);
		points.push("0," + b.h);
		if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
			points.push(b.t + "," + (b.h / 2));
		}
		return points.join(" ");
	}

	function breadcrumbTransformDistance(text, i) {
		var sum = 0;
		for (var j = 0; j < i; j++) {
			sum += b.w * text[j].name.length + b.s
		}
		return sum
	}
	createSunburst('visit.csv');

	function createSunburst(url) {
		// Dimensions of sunburst.
		var width = parseInt(d3.select('#sun').style('width'), 10) - margin.left - margin.right,
			height = width,
			radius = Math.min(width, height) / 2;

		// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
		var b = {
			w: 75,
			h: 30,
			s: 3,
			t: 10
		};

		// Mapping of step names to colors.
		var colors = {
			"home": "#5687d1",
			"product": "#7b615c",
			"search": "#de783b",
			"account": "#6ab975",
			"other": "#a173d1",
			"end": "#bbbbbb"
		};
		// Total size of all segments; we set this later, after loading the data.
		var totalSize = 0;
		var vis = d3.select("#sunburst").append("svg:svg")
			.attr("width", width)
			.attr("height", height)
			.append("svg:g")
			.attr("id", "container")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		var partition = d3.layout.partition()
			.size([2 * Math.PI, radius * radius])
			.value(function (d) {
				return d.size;
			});

		var arc = d3.svg.arc()
			.startAngle(function (d) {
				return d.x;
			})
			.endAngle(function (d) {
				return d.x + d.dx;
			})
			.innerRadius(function (d) {
				return Math.sqrt(d.y);
			})
			.outerRadius(function (d) {
				return Math.sqrt(d.y + d.dy);
			});

		// Use d3.text and d3.csv.parseRows so that we do not need to have a header
		// row, and can receive the csv as an array of arrays.
		d3.text("visit.csv", function (text) {
			var csv = d3.csv.parseRows(text);
			var json = buildHierarchy(csv);
			createVisualization(json);
		});
		// Main function to draw and set up the visualization, once we have the data.
		function createVisualization(json) {

			// Basic setup of page elements.
			initializeBreadcrumbTrail();
			// drawLegend();
			// d3.select("#togglelegend").on("click", toggleLegend);
			// Bounding circle underneath the sunburst, to make it easier to detect
			// when the mouse leaves the parent g.
			vis.append("svg:circle")
				.attr("r", radius)
				.style("opacity", 0);

			// For efficiency, filter nodes to keep only those large enough to see.
			var nodes = partition.nodes(json)
				.filter(function (d) {
					return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
				});

			var path = vis.data([json]).selectAll("path.sun")
				.data(nodes)
				.enter().append("svg:path")
				.attr("display", function (d) {
					return d.depth ? null : "none";
				})
				.attr("d", arc)
				.attr("fill-rule", "evenodd")
				.style("fill", function (d) {
					return colors[d.name];
				})
				.style("opacity", 1)
				.on("mouseover", mouseover);

			// Add the mouseleave handler to the bounding circle.
			d3.select("#container").on("mouseleave", mouseleave);

			// Get total size of the tree = value of root node from partition.
			totalSize = path.node().__data__.value;
		};
		// Fade all but the current sequence, and show it in the breadcrumb trail.
		function mouseover(d) {
			var percentage = (100 * d.value / totalSize).toPrecision(3);
			var percentageString = percentage + "%";
			if (percentage < 0.1) {
				percentageString = "< 0.1%";
			}

			d3.select("#percentage")
				.text(percentageString);

			d3.select("#explanation")
				.style("visibility", "");

			var sequenceArray = getAncestors(d);
			updateBreadcrumbs(sequenceArray, percentageString);

			// Fade all the segments.
			d3.selectAll("path.sun")
				.style("opacity", 0.3);

			// Then highlight only those that are an ancestor of the current segment.
			vis.selectAll("path.sun")
				.filter(function (node) {
					return (sequenceArray.indexOf(node) >= 0);
				})
				.style("opacity", 1);
		}

		// Restore everything to full opacity when moving off the visualization.
		function mouseleave(d) {

			// Hide the breadcrumb trail
			d3.select("#trail")
				.style("visibility", "hidden");

			// Deactivate all segments during transition.
			d3.selectAll("path.sun").on("mouseover", null);

			// Transition each segment to full opacity and then reactivate it.
			d3.selectAll("path.sun")
				.transition()
				.duration(1000)
				.style("opacity", 1)
				.each("end", function () {
					d3.select(this).on("mouseover", mouseover);
				});

			d3.select("#explanation")
				.style("visibility", "hidden");
		}
		// Given a node in a partition layout, return an array of all of its ancestor
		// nodes, highest first, but excluding the root.
		function getAncestors(node) {
			var path = [];
			var current = node;
			while (current.parent) {
				path.unshift(current);
				current = current.parent;
			}
			return path;
		}

		function initializeBreadcrumbTrail() {
			// Add the svg area.
			var trail = d3.select("#sequence").append("svg:svg")
				.attr("width", width)
				.attr("height", 50)
				.attr("id", "trail");
			// Add the label at the end, for the percentage.
			trail.append("svg:text")
				.attr("id", "endlabel")
				.style("fill", "#000");
		}
		// Generate a string that describes the points of a breadcrumb polygon.
		function breadcrumbPoints(d, i) {
			var points = [];
			points.push("0,0");
			points.push(b.w + ",0");
			points.push(b.w + b.t + "," + (b.h / 2));
			points.push(b.w + "," + b.h);
			points.push("0," + b.h);
			if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
				points.push(b.t + "," + (b.h / 2));
			}
			return points.join(" ");
		}
		// Update the breadcrumb trail to show the current sequence and percentage.
		function updateBreadcrumbs(nodeArray, percentageString) {

			// Data join; key function combines name and depth (= position in sequence).
			var g = d3.select("#trail")
				.selectAll("g")
				.data(nodeArray, function (d) {
					return d.name + d.depth;
				});

			// Add breadcrumb and label for entering nodes.
			var entering = g.enter().append("svg:g");

			entering.append("svg:polygon")
				.attr("points", breadcrumbPoints)
				.style("fill", function (d) {
					return colors[d.name];
				});

			entering.append("svg:text")
				.attr("x", (b.w + b.t) / 2)
				.attr("y", b.h / 2)
				.attr("dy", "0.35em")
				.attr("text-anchor", "middle")
				.text(function (d) {
					return d.name;
				});

			// Set position for entering and updating nodes.
			g.attr("transform", function (d, i) {
				return "translate(" + i * (b.w + b.s) + ", 0)";
			});

			// Remove exiting nodes.
			g.exit().remove();

			// Now move and update the percentage at the end.
			d3.select("#trail").select("#endlabel")
				.attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
				.attr("y", b.h / 2)
				.attr("dy", "0.35em")
				.attr("text-anchor", "middle")
				.text(percentageString);

			// Make the breadcrumb trail visible, if it's hidden.
			d3.select("#trail")
				.style("visibility", "");

		}

		function drawLegend() {
			// Dimensions of legend item: width, height, spacing, radius of rounded rect.
			var li = {
				w: 75,
				h: 30,
				s: 3,
				r: 3
			};

			var legend = d3.select("#legend").append("svg:svg")
				.attr("width", li.w)
				.attr("height", d3.keys(colors).length * (li.h + li.s));

			var g = legend.selectAll("g")
				.data(d3.entries(colors))
				.enter().append("svg:g")
				.attr("transform", function (d, i) {
					return "translate(0," + i * (li.h + li.s) + ")";
				});

			g.append("svg:rect")
				.attr("rx", li.r)
				.attr("ry", li.r)
				.attr("width", li.w)
				.attr("height", li.h)
				.style("fill", function (d) {
					return d.value;
				});

			g.append("svg:text")
				.attr("x", li.w / 2)
				.attr("y", li.h / 2)
				.attr("dy", "0.35em")
				.attr("text-anchor", "middle")
				.text(function (d) {
					return d.key;
				});
		}

		function toggleLegend() {
			var legend = d3.select("#legend");
			if (legend.style("visibility") == "hidden") {
				legend.style("visibility", "");
			} else {
				legend.style("visibility", "hidden");
			}
		}
		// Take a 2-column CSV and transform it into a hierarchical structure suitable
		// for a partition layout. The first column is a sequence of step names, from
		// root to leaf, separated by hyphens. The second column is a count of how 
		// often that sequence occurred.
		function buildHierarchy(csv) {
			var root = {
				"name": "root",
				"children": []
			};
			for (var i = 0; i < csv.length; i++) {
				var sequence = csv[i][0];
				var size = +csv[i][1];
				if (isNaN(size)) { // e.g. if this is a header row
					continue;
				}
				var parts = sequence.split("-");
				var currentNode = root;
				for (var j = 0; j < parts.length; j++) {
					var children = currentNode["children"];
					var nodeName = parts[j];
					var childNode;
					if (j + 1 < parts.length) {
						// Not yet at the end of the sequence; move down the tree.
						var foundChild = false;
						for (var k = 0; k < children.length; k++) {
							if (children[k]["name"] == nodeName) {
								childNode = children[k];
								foundChild = true;
								break;
							}
						}
						// If we don't already have a child node for this branch, create it.
						if (!foundChild) {
							childNode = {
								"name": nodeName,
								"children": []
							};
							children.push(childNode);
						}
						currentNode = childNode;
					} else {
						// Reached the end of the sequence; create a leaf node.
						childNode = {
							"name": nodeName,
							"size": size
						};
						children.push(childNode);
					}
				}
			}
			return root;
		};
	}
})