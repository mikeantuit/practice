'use strict';
app.controller('attAnalysisController', function ($stateParams, $scope, $state, $http, $q) {
    var vm = this;
    var date = [],
        date1 = [new Date("10/15/2016"), new Date()];
    if (sessionStorage.date) {
        date = JSON.parse(sessionStorage.getItem('date'));
        date.forEach(function (d, i, a) {
            a[i] = new Date(Date.parse(d));
        })
    } else {
        date = date1;
    }
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
    }
    vm.isShow = true;
    // vm.isLoad = false;
    vm.gridOptions = {
        enableColumnMenus: false,
        enableSorting: false,
    }
    vm.getTableHeight = function () {
        var rowHeight = 30; // your row height
        var headerHeight = 30; // your header height
        return {
            height: (vm.gridOptions.data.length * rowHeight + headerHeight) + "px"
        };
    };
    d3.csv('attribution.csv', function (error, originData) {
        // var uniqueDateData = _.filter(originData, function (d) {
        //     return new Date(d.timestamp) >= date[0] && new Date(d.timestamp) <= date[1];
        // })
        var copy = angular.copy(originData);
        var copy1 = angular.copy(originData);
        var copy2 = angular.copy(originData);
        var copy3 = angular.copy(originData);
        var copy4 = angular.copy(originData);
        var chartDataLine = getLineData(copy1);
        var chartDataPie = getChartDataPie(copy3)
        var chartDataPieDrillDown = getChartDataPieDrillDown(copy);
        var chartDataLine = getLineData(copy4);
        drawPieChart(chartDataPie, chartDataPieDrillDown);
        drawLineChart1(chartDataLine, copy2);
        $("#myModal").on('show.bs.modal', function () {
            vm.pieChartAtt.reflow()
        })
        vm.modalshow = function () {
            $("#myModal").modal("show");
        }
        // watch the change of the date and update the
        $scope.$watch(function () {
            return vm.datePicker
        }, function (newVal, oldVal) {
            if (newVal !== oldVal) {
                var date = [];
                if (newVal['startDate'] instanceof Date || newVal['endDate'] instanceof Date) {
                    date.push(newVal['startDate']);
                    date.push(newVal['endDate']);
                } else {
                    date.push(newVal['startDate'].toDate())
                    date.push(newVal['endDate'].toDate())
                }
                var uniqueDateData = _.filter(originData, function (d) {
                    return new Date(d.timestamp) >= date[0] && new Date(d.timestamp) <= date[1];
                });
                var copy = angular.copy(uniqueDateData)
                var chartDataPie = getChartDataPie(uniqueDateData);
                var chartDataPieDrillDown = getChartDataPieDrillDown(copy);
                drawPieChart(chartDataPie, chartDataPieDrillDown);
                if (vm.lineChartAttDrillDown) {
                    vm.lineChartAttDrillDown.xAxis[0].setExtremes(new Date(date[0]).getTime(), new Date(date[1]).getTime());
                }
                vm.lineChartAtt.xAxis[0].setExtremes(new Date(date[0]).getTime(), new Date(date[1]).getTime());
            }
        });
    })

    function getChartDataPieDrillDown(data) {
        var result = [],
            uniqueChannelsData = []
        var uniqueChannels = _.uniqBy(data, function (e) {
            return e.channel;
        });
        angular.forEach(uniqueChannels, function (value, key) {
            result[key] = {
                "name": value.channel,
                "id": value.channel,
                "data": []
            }
            uniqueChannelsData = _.filter(data, {
                'channel': value.channel
            });
            var res = []
            var sum = uniqueChannelsData.reduce(function (acc, item) {
                return acc + (+item.percentage);
            }, 0)
            for (var i = 0; i < uniqueChannelsData.length; i++) {
                for (var j = i + 1; j < uniqueChannelsData.length; j++) {
                    if (uniqueChannelsData[i]['subchannel'] == uniqueChannelsData[j]['subchannel']) {
                        uniqueChannelsData[i]['percentage'] = +uniqueChannelsData[i]['percentage'] + (+uniqueChannelsData[j]['percentage']);
                        uniqueChannelsData.splice(j, 1);
                        j--;
                    }
                }
                uniqueChannelsData[i]['percentage'] = uniqueChannelsData[i]['percentage'] / 100;
                result[key]["data"].push([uniqueChannelsData[i]['subchannel'], uniqueChannelsData[i]['percentage']]);
            }
        })
        return result;
    }

    function getChartDataPie(data) {
        var res = [];
        var date = _.uniqBy(data, 'timestamp')
        var length = date.length
        var sum = data.reduce(function (acc, item) {
            return acc + (+item.percentage);
        }, 0);
        for (var i = 0; i < data.length; i++) {
            for (var j = i + 1; j < data.length; j++) {
                if (data[i]['channel'] == data[j]['channel']) {
                    data[i]['percentage'] = +data[i]['percentage'] + (+data[j]['percentage']);
                    data.splice(j, 1);
                    j--
                }
            }
            data[i]['percentage'] = data[i]['percentage'] / length;
            res.push({
                "name": data[i]['channel'],
                "y": data[i]['percentage'],
                "drilldown": data[i]['channel']
            })
        }
        return res
    }

    function drawPieChart(data, data1) {
        vm.pieChartAtt = Highcharts.chart('piechartatt', {
            credits: {
                enabled: false
            },
            chart: {
                type: 'pie',
            },
            colors: ['#146DB6', '#F1604B', '#A3C854', '#178A6D', '#D32D47', '#5954a4', '#41ACE2', '#787BB9', '#263E94'],
            // colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
            //     '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'
            // ],
            title: {
                text: 'Multi Channel Attribution'
            },
            subtitle: {
                text: 'Click the links/slices to view Subchannels.'
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>:<b>{point.y:.2f}%</b>of total<br/>'
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: false,
                        format: '{point.name}: {point.y:.1f}%'
                    }
                }
            },
            series: [{
                name: 'Channel',
                colorByPoint: true,
                data: data
            }],
            drilldown: {
                series: data1
            }
        })
    }

    function getLineData(data) {
        var copy = angular.copy(data);
        var pie = getChartDataPie(copy)
        pie.sort(function (a, b) {
            return b.y - a.y
        })
        var res = [],
            obj = {}
        data.sort(function (a, b) {
            return new Date(a.timestamp) - new Date(b.timestamp)
        })
        for (var i = 0; i < data.length; i++) {
            for (var j = i + 1; j < data.length; j++) {
                if (data[i]['timestamp'] == data[j]['timestamp'] && data[i]['channel'] == data[j]['channel']) {
                    data[i]['percentage'] = +data[i]['percentage'] + (+data[j]['percentage']);
                    data.splice(j, 1);
                    j--;
                }
            }
        }
        data.forEach(function (d) {
            if (obj.hasOwnProperty(d['channel'])) {
                obj[d['channel']].push([new Date(d.timestamp).getTime(), +(+d.percentage).toFixed(2)])
            } else {
                obj[d['channel']] = []
            }
        })
        for (var pro in obj) {
            var index = pie.findIndex(function (d) {
                return d.name == pro;
            })
            res.push({
                name: pro,
                data: obj[pro],
                visible: true,
                index: index
            })
        }
        return res;
    }

    function getLineDrillDownData(data, channel) {
        var res = [],
            obj = {}
        var subData = data.filter(function (d) {
            return d.channel == channel;
        })
        subData.sort(function (a, b) {
            return new Date(a.timestamp) - new Date(b.timestamp)
        })
        subData.forEach(function (d) {
            if (obj.hasOwnProperty(d['subchannel'])) {
                obj[d['subchannel']].push([new Date(d.timestamp).getTime(), +(+d.percentage).toFixed(2)])
            } else {
                obj[d['subchannel']] = []
            }
        })
        for (var pro in obj) {
            res.push({
                name: pro,
                data: obj[pro]
            })
        }
        return res;
    }

    function drawLineChart1(data, originData) {
        vm.lineChartAtt = Highcharts.StockChart('linechartatt', {
            credits: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    stacking: 'normal'
                },
                series: {
                    events: {
                        click: function () {
                            var copy = angular.copy(originData);
                            var chartDataLineDrillDown = getLineDrillDownData(copy, this.name);
                            drawLineChartDrillDown1(chartDataLineDrillDown, this.name)
                        }
                    },
                    showInNavigator: true
                }
            },
            legend: {
                enabled: true,
                align: 'center'
            },
            title: {
                text: "Attribution"
            },
            rangeSelector: {
                inputDateFormat: '%m/%d/%Y',
                inputEditDateFormat: '%m/%d/%Y'
            },
            xAxis: {
                events: {
                    setExtremes: function (e) {
                        if (vm.lineChartAttDrillDown) {
                            vm.lineChartAttDrillDown.xAxis[0].setExtremes(e.min, e.max);
                        }
                        var copy = angular.copy(originData)
                        var copy1 = angular.copy(originData);
                        var chartDataPie = getChartDataPie(copy1);
                        var chartDataPieDrillDown = getChartDataPieDrillDown(copy);
                        vm.pieChartAtt.series[0].update({
                            data: chartDataPie
                        })
                    }
                }
            },
            yAxis: {
                title: {
                    text: "Conversion"
                },
                labels: {
                    style: {
                        "color": '#636F79'
                    }
                },
                min: 0
            },
            tooltip: {
                xDateFormat: '%m/%d/%Y',
                shared: true
            },
            series: data
        })
    }

    function drawLineChartDrillDown1(data, name) {
        vm.lineChartAttDrillDown = Highcharts.StockChart('linechartattdrilldown', {
            credits: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    stacking: 'normal'
                },
            },
            legend: {
                enabled: true,
                align: 'center'
            },
            title: {
                text: "Sub-Channel Attribution"
            },
            subtitle: {
                text: name
            },
            yAxis: {
                title: {
                    text: "Conversion"
                },
                labels: {
                    style: {
                        "color": '#636F79'
                    }
                },
                min: 0
            },
            tooltip: {
                xDateFormat: '%m/%d/%Y',
                shared: true
            },
            rangeSelector: {
                enabled: false
            },
            series: data
        })
    }
    d3.csv('xChannelattribution.csv', function (error, data) {
        var dataCopy = angular.copy(data)
        var colors = ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1", 'red', 'pink']

        function getTableData(data) {
            data.sort(function (a, b) {
                return parseFloat(b.value) - parseFloat(a.value);
            })
            var topTenData = data.slice(0, 20)
            var channel = [],
                row = [],
                res = []
            for (var i = 0; i < topTenData.length; i++) {
                channel.push(topTenData[i].channel)
                row.push(topTenData[i].crossChannel)
            }
            channel = _.uniq(channel)
            row = _.uniq(row)

            function Row(arr) {
                var obj = {
                    Channel: ''
                }
                arr.forEach(function (item) {
                    obj[item] = '0'
                })
                return obj
            }
            row.forEach(function (item) {
                var rowObj = Row(channel)
                rowObj['Channel'] = item;
                var temp = _.filter(topTenData, function (o) {
                    return o.crossChannel === item;
                })
                temp.forEach(function (item, arr) {
                    rowObj[item.channel] = (item.value * 100).toFixed(2)
                })
                res.push(rowObj)
            })
            return res
        }
        vm.gridOptions.data = getTableData(data);
        console.log(vm.gridOptions)
        vm.isLoad = true;
        drawTreemap(dataCopy)

        function getTreemapData(data) {
            var channel = [],
                res = []
            for (var i = 0; i < data.length; i++) {
                channel.push(data[i].channel)
            }
            channel = _.uniq(channel);
            channel.forEach(function (item, index) {
                res.push({
                    name: item,
                    id: "id-" + item.split(' ').join('-'),
                    color: colors[index]
                })
            })
            data.forEach(function (item, index) {
                res.push({
                    name: item.crossChannel,
                    parent: "id-" + item.channel.split(' '),
                    id: "id-" + index,
                    value: parseFloat(item.value)
                })
            })
            return res;
        }

        function drawTreemap(data) {
            Highcharts.chart('treeChart', {
                credits: {
                    enabled: false
                },
                series: [{
                    type: 'treemap',
                    layoutAlgorithm: 'squarified',
                    allowDrillToNode: true,
                    animationLimit: 1000,
                    levellsConstant: false,
                    dataLabels: {
                        enabled: false,
                    },
                    levels: [{
                        level: 1,
                        dataLabels: {
                            enabled: true
                        },
                        borderWidth: 3
                    }],
                    data: getTreemapData(data)
                }],
                title: {
                    text: 'Attribution Treemap'
                }
            })
        }
    })
})