angular.module('app', ['d3'])
    .controller("myCtrl", function($scope, $http) {
        $http({
            method: "GET",
            url: "data1.json"
        }).then(function(res) {
            $scope.costcenters = res.data
            console.log($scope.costcenters)
            $scope.data = []
            res.data.forEach(function(d) {
                $scope.data.push([d.Id, d.Name, d.Distribution])
            })
            $scope.data1 = []
            $scope.$watch(function() {
                return $scope.id
            }, function(newVal, oldVal) {
                res.data.forEach(function(d) {
                    if (d.Id === newVal.Id) {
                        $scope.data1 = d.children
                    }
                })
            })
            $scope.length=res.data.length

        })
        $scope.setcolor=function(index){
        	var colorset=['#45a62d','#2ac902','#a2d994','#a2d994','#e1c2b6','#e1c2b6','#e1c2b6','#e88d6a','#e88d6a','#e88d6a']
        	return {'background-color':colorset[index]}
        }
    })
    .directive("d3tablebar", function(d3Service) {
        return {
            restrict: "EA",
            scope: {
                data: '=',
            },
            link: function(scope, ele, attrs) {
                d3Service.d3().then(function(d3) {
                    var data = scope.data;
                    var chartWidth = ele[0].offsetWidth-280 + 'px';
                    console.log(chartWidth)
                    // scope.$watch(function(){return ele.width()},function(){chartWidth=elw.width()+'px'})
                    var x = d3.scale.linear()
                        .domain([0, d3.max(data, function(d) {
                            return Math.abs(d[2]) })])
                        .range([0, chartWidth])
                    var table = d3.select(ele[0]).append('table').attr('class','table')
                    var tr = table.selectAll('tr.data')
                        .data(data)
                        .enter()
                        .append('tr')
                        .attr('class', 'datarow')
                    tr.append('td')
                        .attr('class', 'data name')
                        .text(function(d) {
                            return d[0]
                        })
                    tr.append('td')
                        .attr('class', 'data value')
                        .text(function(d) {
                            return d[1]
                        })
                    var chart = tr.append('td')
                        .attr('class', 'chart')
                        .attr('width', chartWidth)
                    chart.append("div")
                        .attr('class', 'container')
                        .append('div')
                        .attr('class', 'positive')
                    tr.select('div.positive')
                        .style('width', '0%')
                        .transition()
                        .duration(500)
                        .style('width', function(d) {
                        	console.log(x(d[2]))
                            return x(d[2])
                        })

                })

            }
        }
    })
    .directive('d3bar', function(d3Service) {
        return {
            restrict: 'EA',
            scope: { data: '=' ,length:'='},
            link: function(scope, ele, attr) {
                d3Service.d3().then(function(d3) {
                    var data = scope.data;
                    var length=scope.length;
                    console.log(length)
                    console.log(data)
                    scope.$watch('data', function(newVal, oldVal) {
                    	console.log(newVal)
                        update(newVal)
                    })
                    var svg = d3.select(ele[0]).append('svg')
                    
                    var width = ele[0].offsetWidth;
                    console.log(width)
                    var rectPadding = 4;
                    var padding = { left: 50, right: 30, top: 20, bottom: 100 };
                    var xAixses=svg.append("g")
						  
					var yAxises=svg.append("g")
						  
                    function update(data) {
                    	console.log(data)
                    	var height =35*length;
                        var max = []
                        var xAxisContent=[]
                        var data=data[0]
                        for(var key in data){
                        	max.push(data[key])
                        	xAxisContent.push(key)
                        }
                        var colors=d3.scale.category20()
                        svg.attr("width", width)
                            .attr("height", height)
                        var xScale = d3.scale.ordinal()
                            .domain(d3.range(max.length))
                            .rangeRoundBands([0, width - padding.left - padding.right])
                        var xScale1=d3.scale.ordinal()
                            .domain(xAxisContent)
                            .rangeRoundBands([0, width - padding.left - padding.right])
                        var yScale = d3.scale.linear()
                            .domain([0, d3.max(max)])
                            .range([height - padding.top - padding.bottom, 0])
                        var xAxis = d3.svg.axis()
                            .scale(xScale1)
                            .orient("bottom");

                        var yAxis = d3.svg.axis()
                            .scale(yScale)
                            .orient("left");
                        var rects = svg.selectAll('.MyRect')
                            .data(max)
                        rects.attr('x', function(d, i) {
                                return xScale(i) + rectPadding / 2
                            })
                            .attr('y', function(d) {
                                return yScale(d)
                            })
                            .attr('width', xScale.rangeBand() - rectPadding)
                            .attr("height", function(d) {
                                return height - padding.top - padding.bottom - yScale(d);
                            });
                        rects.enter()
                            .append('rect')
                            .attr('class', 'MyRect')
                            .attr('transform', "translate(" + padding.left + "," + padding.top + ")")
                            .attr('x', function(d, i) {
                                return xScale(i) + rectPadding / 2
                            })
                            .attr('y', function(d) {
                                return yScale(d)
                            })
                            .attr('fill',function(d,i){
					        	return colors(i)
					        })
                            .attr('width', xScale.rangeBand() - rectPadding)
                            .attr("height", function(d) {
                                return height - padding.top - padding.bottom - yScale(d);
                            });
                        rects.exit().remove()
                        var texts=svg.selectAll('.MyText')
                        		.data(max)
                        texts.enter()
                        	.append('text')
                        	.attr('class','MyText')
                        	.attr("transform","translate(" + padding.left + "," + padding.top + ")")
                        	.attr('x',function(d,i){
                        		return xScale(i) + rectPadding / 2
                        	})
                        	.attr('y', function(d) {
                                return yScale(d)
                            })
                            .attr("dx",function(){
					            return (xScale.rangeBand() - rectPadding)/2;
					        })
					        .attr("dy",function(d){
					            return -3;
					        })
					        .attr('fill',function(d,i){
					        	return colors(i)
					        })
                            .text(function(d){
					            return d3.format('.2%')(d);
					        });
					    texts.attr('x',function(d,i){
                        		return xScale(i) + rectPadding / 2
                        	})
                        	.attr('y', function(d) {
                                return yScale(d)
                            })
                            .attr("dx",function(){
					            return (xScale.rangeBand() - rectPadding)/2;
					        })
					        .attr("dy",function(d){
					            return -3;
					        })
                            .text(function(d){
					            return d3.format('.2%')(d);
					        });
					    texts.exit().remove()
					    xAixses.attr("class","axis")
						  		.attr("transform","translate(" + padding.left + "," + (height - padding.bottom) + ")")
					    		.call(xAxis)
					    		.selectAll('text')
					    		.style("text-anchor", "end")
					            .attr("dx", "-.8em")
					            .attr("dy", "-.55em")
					    		.attr('transform',function(d){
					    			return "rotate(-90)"
					    		})
					    yAxises.attr("class","axis")
						  		.attr("transform","translate(" + padding.left + "," + padding.top + ")")
					    		.call(yAxis)
                    }
                })
            }
        }
    })
