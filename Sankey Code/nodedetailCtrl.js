'use strict';
app.controller("nodedetailController", ['$stateParams', '$scope', '$http', '$state', function ($stateParams, $scope, $http, $state) {
    var vm = this;
    var node = $stateParams.data;
    var daterange = [];
    if ($stateParams.date != null) {
        daterange = [$stateParams.date.startDate, $stateParams.date.endDate];
        sessionStorage.setItem('date', JSON.stringify(daterange));
    } else {
        daterange = JSON.parse(sessionStorage.getItem('date'));
    }
    if (node != null) {
        sessionStorage.setItem('node', node.name);
    } else {
        node = {};
        node.name = sessionStorage.getItem('node');
    }
    vm.node = node.name;
    d3.csv('fullFUNnel1.csv', function (data) {
        var formattedData = data.map(function (d) {
            d.value = parseInt(d.value);
            d.date = new Date(d.date);
            return d;
        });
        formattedData.sort(function (a, b) {
            return b.date - a.date;
        });
        // var date = [ new Date ('10/15/2016'), new Date ('02/01/2017') ];
        var date = [new Date('10/15/2016'), formattedData[0].date];
        var data1 = angular.copy(formattedData);
        var data4 = angular.copy(formattedData);
        var data5 = angular.copy(formattedData);
        var data6 = angular.copy(formattedData);

        function getLineSeriesInData(date, data) {
            var newData, start, end, incoming = [],
                inTemp = {};
            // date[0].setHours(0, 0, 0, 0)
            // date[1].setHours(0, 0, 0, 0)
            start = data.findIndex(function (element) {
                return element.date <= date[1];
            });
            //	(start == -1)?start = 0:start=start;
            end = findIndex(function (element) {
                return element.date < date[0];
            });
            (end == -1) ? end = data.length: end = end;
            newData = data.slice(start, end);
            newData.reverse()
            newData.forEach(function (d) {
                if (d.target == node.name) {
                    if (!inTemp[d.date]) {
                        inTemp[d.date] = d
                    } else {
                        inTemp[d.date].value += d.value;
                    }
                }
            });
            for (var pro in inTemp) {
                incoming.push([Date.parse(inTemp[pro]['date']), inTemp[pro]['value']])
            }
            return incoming;
        }

        function getLineSeriesOutData(date, data) {
            var newData, start, end, outgoing = [],
                outTemp = {};
            date[0].setHours(0, 0, 0, 0)
            date[1].setHours(0, 0, 0, 0)
            start = data.findIndex(function (element) {
                return element.date <= date[1];
            });
            // 	(start == -1)?start =):start=start;
            end = data.findIndex(function (element) {
                return element.date < date[0];
            });
            (end == -1) ? end = data.length: end = end;
            newData = data.slice(start, end);
            newData.reverse()
            newData.forEach(function (d) {
                if (d.source == node.name) {
                    if (!outTemp[d.date]) {
                        outTemp[d.date] = d
                    } else {
                        outTemp[d.date].value += d.value;
                    }
                }
            });

            for (var pro in outTemp) {
                outgoing.push([Date.parse(outTemp[pro]['date']), outTemp[pro]['value']])
            }
            return incoming;
        }

        function getLineSeriesData(date, data) {
            var newData, start, end, result = [],
                obj = {},
                temp = {};
            // date[0].setHours(0, 0, 0, 0)
            // date[1].setHours(0, 0, 0, 0)
            start = data.findIndex(function (element) {
                return new Date(element.date) <= new Date(date[1]);
            });
            end = data.findIndex(function (element) {
                return new Date(element.date) < new Date(date[0]);
            });
            (end == -1) ? end = data.length: end = end;
            newData = data.slice(start, end);
            newData.reverse()
            for (var i = 0; i < newData.length; i++) {
                obj = newData[i];
                if (obj.source == node.name) {
                    if (!temp[obj.source + "=" + obj.target]) {
                        temp[obj.source + "=" + obj.target] = [];
                        temp[obj.source + "=" + obj.target].push([Date.parse(obj.date), obj.value])
                    } else {
                        temp[obj.source + "=" + obj.target].push([Date.parse(obj.date), obj.value])
                    }
                }
                if (obj.target == node.name && (node.name == 'DECLINED' || node.name == 'Verification_Unknown' || node.name == 'CLOSED' || node.name == 'PENDING' || node.name == 'OPEN' || node.name == 'ABANDONED' || node.name == 'INCOMPLETE')) {
                    if (!temp[obj.source + "=" + obj.target]) {
                        temp[obj.source + "=" + obj.target] = [];
                        temp[obj.source + "=" + obj.target].push([Date.parse(obj.date), obj.value])
                    } else {
                        temp[obj.source + "=" + obj.target].push([Date.parse(obj.date), obj.value])
                    }
                }
            }
            for (var pro in temp) {
                result.push({
                    name: pro.substr(pro.indexOf('=') + 1),
                    data: temp[pro],
                    type: 'areaspline',
                    threshold: null,
                    // type : 'line',
                    connectNulls: true
                })
            }
            return result;
        }

        function getPieSeriesOutData(date, data) {
            var rangedata = getRangeData(date, data);
            var seriesData = [];
            rangedata.forEach(function (d) {
                if (d.source == node.name) {
                    seriesData.push({
                        name: d.target,
                        y: d.value
                    })
                }
            });
            return seriesData;
        }

        function getPieSeriesInData(date, data) {
            var rangedata = getRangeData(date, data);
            var seriesData = [];
            rangedata.forEach(function (d) {
                if (d.target == node.name) {
                    seriesData.push({
                        name: d.source,
                        y: d.value
                    })
                }
            });
            console.log(seriesData)
            return seriesData;
        }

        function getRangeData(date, data) {
            var newData, start, end, sum, temp = {},
                obj = null,
                result = [];
            // date[0].setHours(0, 0, 0, 0)
            // date[1].setHours(0, 0, 0, 0)
            start = data.findIndex(function (element) {
                return new Date(element.date) <= new Date(date[1]);
            });
            end = data.findIndex(function (element) {
                return new Date(element.date) <= new Date(date[0]);
            });
            (end == -1) ? end = data.length: end = end;
            newData = data.slice(start, end);
            for (var i = 0; i < newData.length; i++) {
                obj = newData[i];
                //obj.value = parseInt(obj.value);
                if (!temp[obj.source + "=" + obj.target]) {
                    temp[obj.source + "=" + obj.target] = obj;
                } else {
                    temp[obj.source + "=" + obj.target].value += obj.value;
                }
            }
            for (var prop in temp) {
                result.push(temp[prop])
            }
            return result;
        }
        vm.lineChart = Highcharts.StockChart('linechart', {
            credits: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    stacking: 'normal',
                    // lineColor : '#666666',
                    // lineWidth : 1,
                    //marker : {
                    // lineWidth: 1,
                    // lineColor: '#666666'
                    // }
                }
            },
            navigator: {
                series: {
                    type: 'areaspline'
                }
            },
            legend: {
                enabled: true,
                align: 'center'
            },
            rangeSelector: {
                inputDateFormat: '%m/%d/%Y',
                inputEditDateFormat: '%m/%d/%Y'
            },
            xAxis: {
                min: Date.parse(daterange[0]),
                max: Date.parse(daterange[1]),
                events: {
                    setExtremes: function (e) {
                        var data2 = angular.copy(formattedData);
                        var data3 = angular.copy(formattedData);
                        var date = [];
                        date.push(Highcharts.dateFormat('%m/%d/%Y', e.min))
                        date.push(Highcharts.dateFormat('%m/%d/%Y', e.max))
                        sessionStorage.setItem('date', JSON.stringify(date))
                        vm.pieChartOut.series[0].update({
                            name: 'Brands',
                            colorByPoint: true,
                            data: getPieSeriesOutData(date, data2)
                        }, true)
                        vm.pieChartIn.series[0].update({
                            name: 'Brands',
                            colorByPoint: true,
                            data: getPieSeriesInData(date, data3)
                        }, true)
                    }
                }
            },
            // color : Highcharts.getOptions().colors[0],
            // fillColor : Highcharts.getOptions ().colors[0],
            yAxis: {
                title: {
                    test: "Customer_count"
                },
                labels: {
                    style: {
                        color: '#636F79'
                    }
                },
                min: 0
            },
            tooltip: {
                xDateFormat: '%m/%d/%Y',
                shared: true
            },
            // series : [{
            //	name : 'Incoming ',
            //	data : getLineSeriesInData (date, data5),
            //	id : 'incoming',
            // 	type : 'area',
            //
            // 	threshold : null,
            //
            // }, {
            // 	type : 'flags',	
            //	data : [{
            //		x:Date.parse (*01/04/2017*),
            //		title : 'Facebook",
            //		text : 'Facebook Started Here'
            //	}],
            //	onSeries : 'incoming',
            // 	shape : 'squarepin',
            //	//width :50
            // },{
            // 	name : 'Outgoing',
            // 	data : getLineSeriesOutData ( date, data5),
            //	type : 'area',
            // 	threshold : null,
            // }]
            series: getLineSeriesData(date, data6)
        });
        vm.pieChartOut = Highcharts.chart('piechartout', {
            credits: {
                enabled: false
            },
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            colors: ['#146DB6', '#F1604B', '#A3C854', '#178A6D', '#D32D47', '#5954a4', '#41ACE2', '#787BB9', '#263E94'],
            title: {
                text: 'Destination'
                // text : node.name + '-outgoing'
            },
            tooltip: {
                pointFormat: '<b>Number of Customers: {point.y}</b><br/><b>Percentage:{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b><br/><b>Number of Customers: {point.y}</b><br/><b>Pecentage: {point.percentage:.1f}%</b>'
                    },
                    showInLegend: false
                }
            },
            series: [{
                //name : 'Brands'
                colorByPoint: true,
                data: getPieSeriesOutData(daterange, data1)
            }]
        });
        vm.pieChartIn = Highcharts.chart('piechartin', {
            credits: {
                enabled: false
            },
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            colors: ['#146DB6', '#F1604B', '#A3C854', '#178A6D', '#D32D47', '#5954a4', '#41ACE2', '#787BB9', '#263E94'],
            title: {
                text: 'Source'
                // text : node.name + '-incoming'
            },
            tooltip: {
                pointFormat: '<b>Number of Customers: {point.y}</b><br/><b>Percentage:{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b><br/><b>Number of Customers: {point.y}</b><br/><b>Pecentage: {point.percentage:.1f}%</b>'
                    },
                    showInLegend: false
                }
            },
            series: [{
                //name : 'Brands'
                colorByPoint: true,
                data: getPieSeriesInData(daterange, data4)
            }]
        });
    })
}])