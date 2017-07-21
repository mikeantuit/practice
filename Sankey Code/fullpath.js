'use strict'
app.controller('pathController', function ($scope) {
    var vm = this;
    vm.grouping = [];
    vm.grouping1 = [];
    vm.grouping2 = [];
    vm.declinedShow = true;
    vm.walkawayShow = false;
    vm.declinedWeeklyShow = false;
    vm.walkawayWeeklyShow = false;
    vm.watchActivated = false;

    var date = [],
        date = [new Date("12/09/2016"), new Date("05/24/2017")];
    //store the date and node info to sessionstorage as cache
    // if (sessionStorage.date) {
    //     date = JSON.parse(sessionStorage.getItem('date'));
    //     date.forEach(function (d, i, a) {
    //         a[i] = new Date(Date.parse(d));
    //     })
    // } else {
    //     date = date1;
    // }
    //initailize the datePicker
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
            "Today": date
        }
    };
    vm.show = function (id) {
        if (id == '1') {
            vm.declinedShow = false;
            vm.walkawayShow = true;
            vm.declinedWeeklyShow = false;
            vm.walkawayWeeklyShow = false;
        } else if (id == '2') {
            vm.declinedShow = false;
            vm.walkawayShow = false;
            vm.declinedWeeklyShow = true;
            vm.walkawayWeeklyShow = false;
        } else if (id == '3') {
            vm.declinedShow = true;
            vm.walkawayShow = false;
            vm.declinedWeeklyShow = false;
            vm.walkawayWeeklyShow = false;
        } else if (id == '4') {
            vm.declinedShow = false;
            vm.walkawayShow = false;
            vm.declinedWeeklyShow = false;
            vm.walkawayWeeklyShow = true;
        } else if (id == '5') {
            vm.declinedShow = false;
            vm.walkawayShow = false;
            vm.declinedWeeklyShow = false;
            vm.walkawayWeeklyShow = true;
        } else if (id == '6') {
            vm.declinedShow = true;
            vm.walkawayShow = false;
            vm.declinedWeeklyShow = false;
            vm.walkawayWeeklyShow = false;
        } else if (id == '7') {
            vm.declinedShow = false;
            vm.walkawayShow = false;
            vm.declinedWeeklyShow = true;
            vm.walkawayWeeklyShow = false;
        } else if (id == '8') {
            vm.declinedShow = false;
            vm.walkawayShow = true;
            vm.declinedWeeklyShow = false;
            vm.walkawayWeeklyShow = false;
        }
    }
    if (!$scope.$$phase) {
        $scope.$apply();
    }
    d3.json('convertedStatesPaths.json', function (error, json) {
        var sumCount;
        var formattedData = json.map(function (d) {
            var arr = d.date.split("")
            var arrtemp = [arr[3], arr[4], arr[2], arr[0], arr[1], arr[5], arr[6], arr[7], arr[8], arr[9]]
            var dateStr = arrtemp.join("")
            d.date = new Date(dateStr);
            return d;
        });
        formattedData.sort(function (a, b) {
            return b.date - a.date;
        });
        var dataCopy = angular.copy(formattedData);
        var data = pathDataByDate(dataCopy, date);
        drawPath(data);
        vm.pathLine = function (pathData) {
            var res = [],
                date = [];
            pathData.forEach(function (d) {
                res.push(d.name)
            })
            var pathString = res.join('-');
            date[0] = vm.datePicker.startDate || vm.datePicker.startDate._d;
            date[1] = vm.datePicker.endDate || vm.datePicker.endDate._d;
            var dataCopy = angular.copy(formattedData);
            dataCopy = _.filter(dataCopy, function (d) {
                return d.date <= date[1] && d.date >= date[0];
            })
            var data = nestArray(dataCopy);
            var result = _.filter(data, function (d) {
                return isEqual(d.path, res)
            })
            var chartData = []
            for (var i = result.length - 1; i >= 0; i--) {
                chartData.push([result[i].date.getTime(), result[i].count])
            }
            $("#myModal").modal("show");
            vm.pathLineChart = Highcharts.StockChart('pathlinechart', {
                credits: {
                    enabled: false
                },
                title: {
                    text: pathString
                },
                series: [{
                    name: pathString,
                    data: chartData,
                    type: "spline"
                }]
            })
        }
        $scope.$watch(function () {
            return vm.datePicker
        }, function (newVal, oldVal) {
            if (newVal !== oldVal) {
                var date = [];
                if (newVal['startDate'] instanceof Date || newVal['endDate'] instanceof Date) {
                    date.push(newVal['startDate']);
                    date.push(newVal['endDate']);
                } else {
                    date.push(newVal['startDate'].toDate());
                    date.push(newVal['endDate'].toDate());
                }
                var dataCopy = angular.copy(formattedData);
                var data = pathDataByDate(dataCopyfdate);
                drawPath(data);
            }
        })

        function pathDataByDate(data, date) {
            var newData;
            date[0].setHours(0, 0, 0, 0)
            date[1].setHours(0, 0, 0, 0)
            newData = data.filter(function (d) {
                return d.date >= date[0] && d.date <= date[1]
            })
            sumCount = newData.reduce(function (a, b) {
                return {
                    count: a.count + b.count
                };
            })
            vm.totalConversions = sumCount;
            var channelArray = nestArray(newData)
            for (var i = 0; i < channelArray.length; i++) {
                for (var j = i + 1; j < channelArray.length; j++) {
                    if (_.isEqual(channelArray[i]['path'], channelArray[j]['path'])) {
                        channelArray[i]['count'] = channelArray[i]['count'] + channelArray[j]['count']
                        channelArray.splice(j, 1)
                        j--
                    }
                }
            }
            return channelArray
        }

        function drawPath(data) {
            vm.grouping = [];
            angular.forEach(data, function (value, key) {
                var res = [];
                value['path'].forEach(function (d) {
                    if (d == 'web_direct') {
                        res.push({
                            'name': d,
                            'color': '#3498db'
                        })
                    } else if (d == 'mailer') {
                        res.push({
                            'name': d,
                            'color': '#ff6f69'
                        })
                    } else if (d == 'TV') {
                        res.push({
                            'name': d,
                            'color': '#f18973'
                        })
                    } else if (d == 'newspaper') {
                        res.push({
                            'name': d,
                            'color': '#96ceb4'
                        })
                    } else if (d == 'internet') {
                        res.push({
                            'name': d,
                            'color': '#44a5e5'
                        })
                    } else if (d == 'event') {
                        res.push({
                            'name': d,
                            'color': '#d9ad7c'
                        })
                    } else {
                        res.push({
                            'name': d,
                            'color': 'palevioletred'
                        })
                    }
                })
                vm.grouping.push({
                    "data": res,
                    "percentage": value['count'] / sumCount.count * 100
                });
            })
        }
    })
    d3.json('declinedStatesPaths.json', function (error, json) {
        var sumCount;
        var formattedData = json.map(function (d) {
            var arr = d.date.split("")
            var arrtemp = [arr[3], arr[4], arr[2], arr[0], arr[1], arr[5], arr[6], arr[7], arr[8], arr[9]]
            var dateStr = arrtemp.join("")
            d.date = new Date(dateStr);
            return d;
        });
        //sort the data by descend order 
        formattedData.sort(function (a, b) {
            return b.date - a.date;
        });
        var dataCopy = angular.copy(formattedData);
        var data = pathDataByDate(dataCopy, date);
        drawPath(data)
        vm.pathLineNon = function (pathData) {
            var res = [],
                date = [];
            pathData.forEach(function (d) {
                res.push(d.name)
            })
            var pathString = res.join('-');
            date[0] = vm.datePicker.startDate || vm.datePicker.startDate._d;
            date[1] = vm.datePicker.endDate || vm.datePicker.endDate._d;
            var dataCopy = angular.copy(formattedData);
            dataCopy = _.filter(dataCopy, function (d) {
                return d.date <= date[1].date >= date[0];
            })
            var data = nestArray(dataCopy);
            var result = _.filter(data, function (d) {
                return isEqual(d.path, res)
            })
            var chartData = []
            for (var i = result.length - 1; i >= 0; i--) {
                chartData.push([result[i].date.getTime(), result[i].count])
            }
            $("#myModal").modal("show");
            vm.pathLineChart = Highcharts.StockChart('pathlinechart', {
                credits: {
                    enabled: false
                },
                title: {
                    text: pathstring
                },
                series: [{
                    name: pathstring,
                    data: chartData,
                    type: "spline"
                }]
            })
        }
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
                var dataCopy = angular.copy(formattedData);
                var data = pathDataByDate(dataCopy, date);
                drawPath(data);
            }
        })

        function pathDataByDate(data, date) {
            var newData
            date[0].setHours(0, 0, 0, 0)
            date[1].setHours(0, 0, 0, 0)
            newData = data.filter(function (d) {
                return d.date >= date[0] && d.date <= date[1]
            })
            sumCount = newData.reduce(function (a, b) {
                return {
                    count: a.count + b.count
                };
            })
            vm.totalConversions1 = sumCount;
            var channelArray = nestArray(newData)
            for (var i = 0; i < channelArray.length; i++) {
                for (var j = i + 1; j < channelArray.length; j++) {
                    if (_.isEqual(channelArray[i]['path'], channelArray[j]['path'])) {
                        channelArray[i]['count'] = channelArray[i]['count'] + channelArray[j]['count']
                        channelArray.splice(j, 1)
                        j--;
                    }
                }
            }
            return channelArray
        }

        function drawPath(data) {
            vm.grouping1 = [];
            angular.forEach(data, function (value, key) {
                var res = [];
                value['path'].forEach(function (d) {
                    if (d == 'web_direct') {
                        res.push({
                            'name': d,
                            'color': '#3498db'
                        })
                    } else if (d == 'mailer') {
                        res.push({
                            'name': d,
                            'color': '#ff6f69'
                        })
                    } else if (d == 'TV') {
                        res.push({
                            'name': d,
                            'color': '#f18973'
                        })
                    } else if (d == 'newspaper') {
                        res.push({
                            'name': d,
                            'color': '#96ceb4'
                        })
                    } else if (d == 'internet') {
                        res.push({
                            'name': d,
                            'color': '#44a5e5'
                        })
                    } else if (d == 'event') {
                        res.push({
                            'name': d,
                            'color': '#d9ad7c'
                        })
                    } else {
                        res.push({
                            'name': d,
                            'color': 'palevioletred'
                        })
                    }
                })
                vm.grouping1.push({
                    "data": res,
                    "percentage": value['count'] / sumCount.count * 100
                });
            })
        }
    })
    //load data for nonConverted path of weekly comparison
    d3.json('declinedStatesPaths.json', function (error, json) {
        var formattedData = json.map(function (d) {
            var arr = d.date.split("")
            var arrtemp = [arr[3], arr[4], arr[2], arr[0], arr[1], arr[5], arr[6], arr[7], arr[8], arr[9]]
            var dateStr = arrtemp.join("")
            d.date = new Date(dateStr);
            return d;
        })
        formattedData.sort(function (a, b) {
            return b.date - a.date;
        })
        var today = formattedData[0]['date']
        var priorDate1 = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        var priorDate2 = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)
        var priorDate3 = new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000)
        var priorDate4 = new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000)
        var dataCopy = angular.copy(formattedData);
        var data1 = pathDataByDate(dataCopy, [priorDate1, today])
        var data2 = pathDataByDate(dataCopy, [priorDate2, priorDate1])
        var data3 = pathDataByDate(dataCopy, [priorDate3, priorDate2])
        var data4 = pathDataByDate(dataCopy, [priorDate4, priorDate3])
        var week12 = findSamePath(data1, data2)
        var week23 = findSamePath(data2, data3)
        var week34 = findSamePath(data3, data4)
        vm.week1 = drawPath(week12[0], [])
        vm.week2 = drawPath(week12[1], [])
        vm.week3 = drawPath(week23[0], [])
        vm.week4 = drawPath(week23[1], [])
        vm.week5 = drawPath(week34[0], [])
        vm.week6 = drawPath(week34[1], [])
        vm.today = today
        vm.priorDate1 = priorDate1
        vm.priorDate2 = priorDate2
        vm.priorDate3 = priorDate3
        vm.priorDate4 = priorDate4

        function findSamePath(a, b) {
            a.sort(function (a, b) {
                return b.count - a.count
            })
            var temp1 = [],
                temp2 = []
            for (var i = 0; i < a.length; i++) {
                for (var j = 0; j < b.length; j++) {
                    if (_.isEqual(a[i].path, b[j].path)) {
                        temp1.push(a[i])
                        temp2.push(b[j])
                    }
                }
            }
            return [temp1, temp2]
        }

        function pathDataByDate(data, date) {
            var newData, sumCount
            newData = data.filter(function (d) {
                return d.date >= date[0] && d.date <= date[1]
            })
            sumCount = newData.reduce(function (a, b) {
                return {
                    count: a.count + b.count
                };
            })
            var channelArray = nestArray(newData)
            for (var i = 0; i < channelArray.length; i++) {
                for (var j = i + 1; j < channelArray.length; j++) {
                    if (_.isEqual(channelArray[i]['path'], channelArray[j]['path'])) {
                        channelArray[i]['count'] = channelArray[i]['count'] + channelArray[j]['count']
                        channelArray.splice(j, 1)
                        j--
                    }
                }
                channelArray[i]['count'] = channelArray[i]['count'] / sumCount["count"] * 100
            }
            return channelArray
        }

        function drawPath(data, array) {
            array = array || []
            angular.forEach(data, function (value, key) {
                var res = [];
                value['path'].forEach(function (d) {
                    if (d == 'web_direct') {
                        res.push({
                            'name': d,
                            'color': '#3498db'
                        })
                    } else if (d == 'mailer') {
                        res.push({
                            'name': d,
                            'color': '#ff6f69'
                        })
                    } else if (d == 'TV') {
                        res.push({
                            'name': d,
                            'color': '#f18973'
                        })
                    } else if (d == 'newspaper') {
                        res.push({
                            'name': d,
                            'color': '#96ceb4'
                        })
                    } else if (d == 'internet') {
                        res.push({
                            'name': d,
                            'color': '#44a5e5'
                        })
                    } else if (d == 'event') {
                        res.push({
                            'name': d,
                            'color': '#d9ad7c'
                        })
                    } else {
                        res.push({
                            'name': d,
                            'color': 'palevioletred'
                        })
                    }
                })
                array.push({
                    "data": res,
                    "percentage": value['count']
                });
            })
            return array;
        }
    })
    d3.json('walkawayStatesPaths.json', function (error, json) {
        var sumCount;
        var formattedData = json.map(function (d) {
            var arr = d.date.split("")
            var arrtemp = [arr[3], arr[4], arr[2], arr[0], arr[1], arr[5], arr[6], arr[7], arr[8], arr[9]]
            var dateStr = arrtemp.join("")
            d.date = new Date(dateStr);
            return d;
        });
        //sort the data by descend order 
        formattedData.sort(function (a, b) {
            return b.date - a.date;
        });
        var dataCopy = angular.copy(formattedData);
        var data = pathDataByDate(dataCopy, date);
        drawPath(data)
        vm.pathLineNon = function (pathData) {
            var res = [],
                date = [];
            pathData.forEach(function (d) {
                res.push(d.name)
            })
            var pathString = res.join('-');
            date[0] = vm.datePicker.startDate || vm.datePicker.startDate._d;
            date[1] = vm.datePicker.endDate || vm.datePicker.endDate._d;
            var dataCopy = angular.copy(formattedData);
            dataCopy = _.filter(dataCopy, function (d) {
                return d.date <= date[1].date >= date[0];
            })
            var data = nestArray(dataCopy);
            var result = _.filter(data, function (d) {
                return isEqual(d.path, res)
            })
            var chartData = []
            for (var i = result.length - 1; i >= 0; i--) {
                chartData.push([result[i].date.getTime(), result[i].count])
            }
            $("#myModal").modal("show");
            vm.pathLineChart = Highcharts.StockChart('pathlinechart', {
                credits: {
                    enabled: false
                },
                title: {
                    text: pathstring
                },
                series: [{
                    name: pathstring,
                    data: chartData,
                    type: "spline"
                }]
            })
        }
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
                var dataCopy = angular.copy(formattedData);
                var data = pathDataByDate(dataCopy, date);
                drawPath(data);
            }
        })

        function pathDataByDate(data, date) {
            var newData
            date[0].setHours(0, 0, 0, 0)
            date[1].setHours(0, 0, 0, 0)
            newData = data.filter(function (d) {
                return d.date >= date[0] && d.date <= date[1]
            })
            sumCount = newData.reduce(function (a, b) {
                return {
                    count: a.count + b.count
                };
            })
            vm.totalConversions2 = sumCount;
            var channelArray = nestArray(newData)
            for (var i = 0; i < channelArray.length; i++) {
                for (var j = i + 1; j < channelArray.length; j++) {
                    if (_.isEqual(channelArray[i]['path'], channelArray[j]['path'])) {
                        channelArray[i]['count'] = channelArray[i]['count'] + channelArray[j]['count']
                        channelArray.splice(j, 1)
                        j--;
                    }
                }
            }
            return channelArray
        }

        function drawPath(data) {
            vm.grouping2 = [];
            angular.forEach(data, function (value, key) {
                var res = [];
                value['path'].forEach(function (d) {
                    if (d == 'web_direct') {
                        res.push({
                            'name': d,
                            'color': '#3498db'
                        })
                    } else if (d == 'mailer') {
                        res.push({
                            'name': d,
                            'color': '#ff6f69'
                        })
                    } else if (d == 'TV') {
                        res.push({
                            'name': d,
                            'color': '#f18973'
                        })
                    } else if (d == 'newspaper') {
                        res.push({
                            'name': d,
                            'color': '#96ceb4'
                        })
                    } else if (d == 'internet') {
                        res.push({
                            'name': d,
                            'color': '#44a5e5'
                        })
                    } else if (d == 'event') {
                        res.push({
                            'name': d,
                            'color': '#d9ad7c'
                        })
                    } else {
                        res.push({
                            'name': d,
                            'color': 'palevioletred'
                        })
                    }
                })
                vm.grouping2.push({
                    "data": res,
                    "percentage": value['count'] / sumCount.count * 100
                });
            })
        }
    })
    d3.json('walkawayStatesPaths.json', function (error, json) {
        var formattedData = json.map(function (d) {
            // d.date = new Date(d.date);
            // return d;
            var arr = d.date.split("")
            var arrtemp = [arr[3], arr[4], arr[2], arr[0], arr[1], arr[5], arr[6], arr[7], arr[8], arr[9]]
            var dateStr = arrtemp.join("")
            d.date = new Date(dateStr);
            return d;
        })
        formattedData.sort(function (a, b) {
            return b.date - a.date;
        })
        var today = formattedData[0]['date']
        var priorDate1 = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        var priorDate2 = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)
        var priorDate3 = new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000)
        var priorDate4 = new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000)
        var dataCopy = angular.copy(formattedData);
        var data1 = pathDataByDate(dataCopy, [priorDate1, today])
        var data2 = pathDataByDate(dataCopy, [priorDate2, priorDate1])
        var data3 = pathDataByDate(dataCopy, [priorDate3, priorDate2])
        var data4 = pathDataByDate(dataCopy, [priorDate4, priorDate3])
        var week12 = findSamePath(data1, data2)
        var week23 = findSamePath(data2, data3)
        var week34 = findSamePath(data3, data4)
        vm.walkawayweek1 = drawPath(week12[0], [])
        vm.walkawayweek2 = drawPath(week12[1], [])
        vm.walkawayweek3 = drawPath(week23[0], [])
        vm.walkawayweek4 = drawPath(week23[1], [])
        vm.walkawayweek5 = drawPath(week34[0], [])
        vm.walkawayweek6 = drawPath(week34[1], [])
        vm.today = today
        vm.priorDate1 = priorDate1
        vm.priorDate2 = priorDate2
        vm.priorDate3 = priorDate3
        vm.priorDate4 = priorDate4

        function findSamePath(a, b) {
            a.sort(function (a, b) {
                return b.count - a.count
            })
            var temp1 = [],
                temp2 = []
            for (var i = 0; i < a.length; i++) {
                for (var j = 0; j < b.length; j++) {
                    if (_.isEqual(a[i].path, b[j].path)) {
                        temp1.push(a[i])
                        temp2.push(b[j])
                    }
                }
            }
            return [temp1, temp2]
        }

        function pathDataByDate(data, date) {
            var newData, sumCount
            newData = data.filter(function (d) {
                return d.date >= date[0] && d.date <= date[1]
            })
            sumCount = newData.reduce(function (a, b) {
                return {
                    count: a.count + b.count
                };
            })
            var channelArray = nestArray(newData)
            for (var i = 0; i < channelArray.length; i++) {
                for (var j = i + 1; j < channelArray.length; j++) {
                    if (_.isEqual(channelArray[i]['path'], channelArray[j]['path'])) {
                        channelArray[i]['count'] = channelArray[i]['count'] + channelArray[j]['count']
                        channelArray.splice(j, 1)
                        j--
                    }
                }
                channelArray[i]['count'] = channelArray[i]['count'] / sumCount["count"] * 100
            }
            return channelArray
        }

        function drawPath(data, array) {
            array = array || []
            angular.forEach(data, function (value, key) {
                var res = [];
                value['path'].forEach(function (d) {
                    if (d == 'web_direct') {
                        res.push({
                            'name': d,
                            'color': '#3498db'
                        })
                    } else if (d == 'mailer') {
                        res.push({
                            'name': d,
                            'color': '#ff6f69'
                        })
                    } else if (d == 'TV') {
                        res.push({
                            'name': d,
                            'color': '#f18973'
                        })
                    } else if (d == 'newspaper') {
                        res.push({
                            'name': d,
                            'color': '#96ceb4'
                        })
                    } else if (d == 'internet') {
                        res.push({
                            'name': d,
                            'color': '#44a5e5'
                        })
                    } else if (d == 'event') {
                        res.push({
                            'name': d,
                            'color': '#d9ad7c'
                        })
                    } else {
                        res.push({
                            'name': d,
                            'color': 'palevioletred'
                        })
                    }
                })
                array.push({
                    "data": res,
                    "percentage": value['count']
                });
            })
            return array;
        }
    })

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
})