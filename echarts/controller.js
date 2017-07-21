app.controller('firstCtrl', function($scope, $http) {
    $http({
        method: "GET",
        url: "data.json"
    }).then(function(res) {
        $scope.costcenters = res.data;
        $scope.selectedItem=null;
        $scope.tableItem=[];
        $scope.$watch(function() {
            return $scope.id
        }, function(newVal, odlVal) {
            let yData = [],
                xData = [];
            let selectedId = res.data.find(function(v) {
                return v.Id === newVal.Id
            })
            let item = selectedId.children[0]
            for (let i in item) {
                yData.push(item[i])
                xData.push(i)
            }
            $scope.option1 = {
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    feature: {
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                // legend: {
                //     data: ['蒸发量', '降水量', '平均温度']
                // },
                dataZoom:[
                	{
				        type: 'inside',
				        // xAxisIndex: [0],
				    }
                ],
                grid: {
                    bottom: '20%'
                },
                xAxis: [{
                    type: 'category',
                    data: xData,
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisTick: {
                        show: false

                    },
                    axisLabel: {
                        rotate: 90,
                        interval: 0,
                        margin: 5
                    }
                }],
                yAxis: [{
                    type: 'value',
                    // name: '水量',
                    min: 0,
                    // max: 250,
                    // interval: 50,
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        formatter: function(v, i) {
                            let value = v / 1000
                            return value+'K'
                        }
                    }
                }],
                series: [{
                    name: 'Expense Distribution',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: function(params){
                            	let total=0;
                            	yData.forEach(function(v,i){
                            		if(v){
                            			total+=v;
                            		}
                            	})
                            	return (params.data / total * 100).toFixed(2) + '%';
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                var colorList = [
                                    // 'rgba(194,53,49,1)', 'rgba(47,69,84,1)', 'rgba(97,160,168,1)', 'rgba(212,130,101,1)', 'rgba(145,199,174,1)', 'rgba(116,159,131,1)', 'rgba(202,134,34,1)', 'rgba(189,162,154,1)', 'rgba(110,112,116,1)', 'rgba(84,101,112,1)', 'rgba(196,201,211,1)'
                                    '#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'
                                ];
                                return colorList[params.dataIndex]
                            },
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                        },
                        // emphasis:{
                        // 	opacity:0.5
                        // }
                    },
                    data: yData
                }]
            }
            $scope.config1 = {
	            theme: 'vintage',
	            dataLoaded: true,
	            event: [{
	                click: function(params) {
	                    console.log(params)
	                    // $scope.option1.series[0].itemStyle.normal.opacity=0.5
	                    $scope.selectedItem=params.name
	                    let xData=[],yData=[],tableItem=[];
	                    res.data.forEach(function(v,i){
	                    	let yLabel=v.Name;
	                    	yData.push(yLabel)
	                    	xData.push(v.children[0][params.name])
	                    	tableItem.push({
	                    		Id:v.Id,
	                    		Name:v.Name,
	                    		Value:v.children[0][params.name]
	                    	})
	                    })
	                    xData.sort(function(a, b) {
							  return a - b;
							})
	                    $scope.tableItem=tableItem;
	                    console.log(tableItem)
	                    $scope.option2 = {
				            tooltip: {
				            	show:false,
				                trigger: 'axis'
				            },
				            
				            grid: {
				            	top:0,
				            	bottom:20,
				            	left:5,
				            	right:35
				            },
				            yAxis: [{
				                type: 'category',
				                data: yData,
				                axisTick: {
				                	show:true,
				                	length:5
				                },
				                axisLine:{
				                	lineStyle:{
				                		color:'#ccc'
				                	}
				                },
				                splitLine: {
				                    show: true
				                },
				                axisLabel: {
				                	show:false,
				                    margin: 20,
				                    textStyle:{
				                    	color:'black',
				                    	align:'right'
				                    }
				                }
				            }],
				            xAxis: [{
				                type: 'value',
				                splitLine: { show: false },
				                axisLabel: {
			                        formatter: function(v, i) {
			                            let value = v / 1000
			                            return value+'K'
			                        }
			                    }
				            }],
				            series: [{
				                name: 'Expense Distribution',
				                type: 'bar',
				                data: xData,
				                label: {
				                    normal: {
				                        show: true,
				                        position: 'right',
				                        textStyle: {
				                            color: 'black' //color of value
				                        }
				                    }
				                },
				                itemStyle: {
				                    normal: {
				                        color: params.color
				                    }
				                }
				            }]
				        }
				        $scope.config2 = {
			                theme: 'vintage',
			                dataLoaded: true,
			                event: [{
			                    click: function(params) {
			                        console.log(params)
			                            

			                    }
			                }]
			            }
			            $scope.$digest()
	                }
	            }]
	        }
        })
    })
	$scope.setcolor=function(index){
        	var colorset=['#45a62d','#2ac902','#a2d994','#a2d994','#e1c2b6','#e1c2b6','#e1c2b6','#e88d6a','#e88d6a','#e88d6a']
        	return {'background-color':colorset[index]}
        }
})
.controller('secondCtrl',function($scope,$http){
	$http({
		method:'GET',
		url:'data.json'
	}).then(function(res){
		$scope.costcenters=res.data;
		$scope.option1={
			tooltip:{
				trigger:'axis'
			},
			grid:{
				bottom:'30%',
				containLabel: true
			},
			toolbox:{
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            xAxis:[
            	{type:'category',
            	data:['Brand Media Mktg','Null','Corporate Srvs Misc','Group Meetings','IT Software','Employee Recruiting','Bus SaaS-Gbl','Sponsorships','Promotn Merchandise','Consulting Svcs-Govt','Int Education Train','1 Time-No Negotiate','IT Cnslt/Cntrctr NE','IT Services','Contractr.General'],
            	splitLine: {
                    show: false
                },
                splitArea: {
                    show: false
                },
                axisTick: {
                    show: false

                },
                axisLabel: {
                    rotate: 90,
                    interval: 0,
                    margin: 5
                }}
            ],
            yAxis:[
            	{
            		type:'value',
	            	name:'Budget Rate Amount',
	            	position:'left',
	            	splitLine: {
	                    show: false
	                },
	            	axisLabel:{
	            		// formatter:function(v,i){
	            		// 	let value = v / 1000
	              //           return value
	            		// }
	            	}
            	},
            	{
            		type:'value',
            		// max:15,
            		// min:0,
            		name:'cumulative of expenses',
            		position:'right',
            		splitLine: {
	                    show: false
	                },
            		axisLabel:{
            			formatter:function(v,i){
            				return v.toFixed(2)+'%'
            			}
            		}
            	}
            ],
            series:[
            	{
            		name:'Budget Rate Amount',
            		type:'bar',
            		itemStyle: {
                        normal: {
                            color: function(params) {
                                var colorList = [
                                    // 'rgba(194,53,49,1)', 'rgba(47,69,84,1)', 'rgba(97,160,168,1)', 'rgba(212,130,101,1)', 'rgba(145,199,174,1)', 'rgba(116,159,131,1)', 'rgba(202,134,34,1)', 'rgba(189,162,154,1)', 'rgba(110,112,116,1)', 'rgba(84,101,112,1)', 'rgba(196,201,211,1)'
                                    '#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83'
                                ];
                                return colorList[params.dataIndex]
                            },
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                        }
                    },
            		data:[3223,4234,254,211,789,6786,458,4225,678,111,998,5678,345,5643,676]
            	},
            	{
            		name:'cumulative of expenses',
            		type:'line',
            		yAxisIndex:1,
            		data:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
            	}
            ]
		}
		$scope.config1={
            theme: 'vintage',
            dataLoaded: true,
            event: [{
                click: function(params) {
                    console.log(params)
                        

                }
            }]
        }
        $scope.option2={
			tooltip:{
				trigger:'axis'
			},
			grid:{
				bottom:'30%',
				containLabel: true
			},
			toolbox:{
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            xAxis:[
            	{type:'category',
            	data:['502128','509195','518126','446779','516168','498927','486810','500895','470486','440101','476500','433760','440208','509206','512937'],
            	splitLine: {
                    show: false
                },
                splitArea: {
                    show: false
                },
                axisTick: {
                    show: false

                },
                axisLabel: {
                    rotate: 90,
                    interval: 0,
                    margin: 5
                }}
            ],
            yAxis:[
            	{
            		type:'value',
	            	name:'Budget Rate Amount',
	            	position:'left',
	            	splitLine: {
	                    show: false
	                },
	            	axisLabel:{
	            		// formatter:function(v,i){
	            		// 	let value = v / 1000
	              //           return value
	            		// }
	            	}
            	},
            	{
            		type:'value',
            		// max:15,
            		// min:0,
            		name:'cumulative of expenses',
            		position:'right',
            		splitLine: {
	                    show: false
	                },
            		axisLabel:{
            			formatter:function(v,i){
            				return v.toFixed(2)+'%'
            			}
            		}
            	}
            ],
            series:[
            	{
            		name:'Budget Rate Amount',
            		type:'bar',
            		itemStyle: {
                        normal: {
                            color: 'darkblue',                 
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                        }
                    },
            		data:[3223,4234,254,211,789,6786,458,4225,678,111,998,5678,345,5643,676]
            	},
            	{
            		name:'cumulative of expenses',
            		type:'line',
            		yAxisIndex:1,
            		data:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
            	}
            ]
		}
		$scope.config2={
            theme: 'vintage',
            dataLoaded: true,
            event: [{
                click: function(params) {
                    console.log(params)
                        

                }
            }]
        }
        $scope.$watch('year',function(newVal,oldVal){
        	$scope.datas=[
        		{id:'18412',value:5029198},
        		{id:'1295099',value:1701798},
        		{id:'66372',value:400000},
        		{id:'1295102',value:350000},
        		{id:'17586',value:337750},
        		{id:'17653',value:91165},
        		{id:'19309',value:75000},
        		{id:'13355',value:45992},
        		{id:'14533',value:34532},
        		{id:'87392',value:12345}
        	]
        })
        $scope.setcolor=function(index){
        	var colorset=['#45a62d','#2ac902','#a2d994','#a2d994','#e1c2b6','#e1c2b6','#e1c2b6','#e88d6a','#e88d6a','#e88d6a']
        	return {'background-color':colorset[index]}
        }
	})
})
.controller('thirdCtrl',function($scope,$http){
	$scope.option3={
		grid:{
			left:'15%',
			top:5,
			bottom:5
		},
		xAxis: [{
                    type: 'category',
                    data: [1],
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisTick: {
                        show: false

                    },
                    axisLabel: {
                        show:false
                    }
                }],
                yAxis: [{
                	name:'Count of Employees',
                	nameLocation:'middle',
                	nameGap:'25',
                    type: 'value',
                    min: 0,
                    max: 60,
                    interval: 20,
                    axisTick:{
                    	show:false
                    },
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        
                    }
                }],
                series: [{
                    name: 'Expense Distribution',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: function(params){
                            	return params.data+'\n'+(params.data / 111*100).toFixed(2) + '%';
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'blue',
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                        }
                    },
                    data: [1]
                }]
	}
	$scope.config3={
		theme: 'vintage',
        dataLoaded: true,
        event: [{
            click: function(params) {
                console.log(params)
                    

            }
        }]
	}
	$scope.option4={
		grid:{
			left:'15%',
			top:5,
			bottom:5
		},
		xAxis: [{
                    type: 'category',
                    data: [1],
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisTick: {
                        show: false

                    },
                    axisLabel: {
                        show:false
                    }
                }],
                yAxis: [{
                	name:'Count of Employees',
                	nameLocation:'middle',
                	nameGap:'25',
                    type: 'value',
                    min: 0,
                    max: 60,
                    interval: 20,
                    axisTick:{
                    	show:false
                    },
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        
                    }
                }],
                series: [{
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: function(params){
                            	return params.data+'\n'+(params.data / 111*100).toFixed(2) + '%';
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'blue',
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                        }
                    },
                    data: [3]
                }]
	}
	$scope.config4={
		theme: 'vintage',
        dataLoaded: true,
        event: [{
            click: function(params) {
                console.log(params)
                    

            }
        }]
	}
	$scope.option5={
		grid:{
			left:'15%',
			top:5,
			bottom:5
		},
		xAxis: [{
                    type: 'category',
                    data: [1],
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisTick: {
                        show: false

                    },
                    axisLabel: {
                        show:false
                    }
                }],
                yAxis: [{
                	name:'Count of Employees',
                	nameLocation:'middle',
                	nameGap:'25',
                    type: 'value',
                    min: 0,
                    max: 60,
                    interval: 20,
                    axisTick:{
                    	show:false
                    },
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        
                    }
                }],
                series: [{
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: function(params){
                            	return params.data+'\n'+(params.data / 111*100).toFixed(2) + '%';
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'blue',
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                        }
                    },
                    data: [14]
                }]
	}
	$scope.config5={
		theme: 'vintage',
        dataLoaded: true,
        event: [{
            click: function(params) {
                console.log(params)
                    

            }
        }]
	}
	$scope.option6={
		grid:{
			left:'15%',
			top:5,
			bottom:5
		},
		xAxis: [{
                    type: 'category',
                    data: [1],
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisTick: {
                        show: false

                    },
                    axisLabel: {
                        show:false
                    }
                }],
                yAxis: [{
                	name:'Count of Employees',
                	nameLocation:'middle',
                	nameGap:'25',
                    type: 'value',
                    min: 0,
                    max: 60,
                    interval: 20,
                    axisTick:{
                    	show:false
                    },
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        
                    }
                }],
                series: [{
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: function(params){
                            	return params.data+'\n'+(params.data / 111*100).toFixed(2) + '%';
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'blue',
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                        }
                    },
                    data: [36]
                }]
	}
	$scope.config6={
		theme: 'vintage',
        dataLoaded: true,
        event: [{
            click: function(params) {
                console.log(params)
                    

            }
        }]
	}
	$scope.option7={
		grid:{
			left:'15%',
			top:5,
			bottom:5
		},
		xAxis: [{
                    type: 'category',
                    data: [1],
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisTick: {
                        show: false

                    },
                    axisLabel: {
                        show:false
                    }
                }],
                yAxis: [{
                	name:'Count of Employees',
                	nameLocation:'middle',
                	nameGap:'25',
                    type: 'value',
                    min: 0,
                    max: 70,
                    interval: 20,
                    axisTick:{
                    	show:false
                    },
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        
                    }
                }],
                series: [{
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: function(params){
                            	return params.data+'\n'+(params.data / 111*100).toFixed(2) + '%';
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'blue',
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                        }
                    },
                    data: [53]
                }]
	}
	$scope.config7={
		theme: 'vintage',
        dataLoaded: true,
        event: [{
            click: function(params) {
                console.log(params)
                    

            }
        }]
	}
	$scope.option8={
		grid:{
			left:'15%',
			top:5,
			bottom:5
		},
		xAxis: [{
                type: 'category',
                data: [1],
                splitLine: {
                    show: false
                },
                splitArea: {
                    show: false
                },
                axisTick: {
                    show: false

                },
                axisLabel: {
                    show:false
                }
            }],
                yAxis: [{
                	name:'Count of Employees',
                	nameLocation:'middle',
                	nameGap:'25',
                    type: 'value',
                    min: 0,
                    max: 60,
                    interval: 20,
                    axisTick:{
                    	show:false
                    },
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        
                    }
                }],
                series: [{
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: function(params){
                            	return params.data+'\n'+(params.data / 111*100).toFixed(2) + '%';
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'blue',
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                        }
                    },
                    data: [4]
                }]
	}
	$scope.config8={
		theme: 'vintage',
        dataLoaded: true,
        event: [{
            click: function(params) {
                console.log(params)
                    

            }
        }]
	}
	$http({
		method:'GET',
		url:'band.json'
	}).then(function(res){
		let band1=[],band2=[],band3=[],band4=[],band5=[],band6=[],itembar={}
		res.data.forEach(function(v,i){
			switch(v["Human Resources Career Band Code"]){
				case 1:band1.push(v);break;
				case 2:band2.push(v);break;
				case 3:band3.push(v);break;
				case 4:band4.push(v);break;
				case 5:band5.push(v);break;
				case 6:band6.push(v);break;
			}
		})
		function item(id){
			let itemband=[]
			switch(id){
				case 1:banditem=band1;break;
				case 2:banditem=band2;break;
				case 3:banditem=band3;break;
				case 4:banditem=band4;break;
				case 5:banditem=band5;break;
				case 6:banditem=band6;break;
			}
			itembar[id+'1']=[],itembar[id+'2']=[],itembar[id+'3']=[],itembar[id+'4']=[]
			banditem.forEach(function(v,i){
				if(v['Num of Direct Reports']==0){
					itembar[id+'1'].push(v)
				}else if(v['Num of Direct Reports']>=1&&v['Num of Direct Reports']<=3){
					itembar[id+'2'].push(v)
				}else if(v['Num of Direct Reports']>=4&&v['Num of Direct Reports']<=6){
					itembar[id+'3'].push(v)
				}else if(v['Num of Direct Reports']>=7&&v['Num of Direct Reports']<=9){
					itembar[id+'4'].push(v)
				}
			})
		}
		function band(id){
			let series=[],i=0,data=[];
			item(id);
			while(itembar[id+'1'][i]||itembar[id+'2'][i]||itembar[id+'3'][i]||itembar[id+'4'][i]){
				let data=[]
				itembar[id+'1'][i]?data.push(1):data.push('-')
				itembar[id+'2'][i]?data.push(1):data.push('-')
				itembar[id+'3'][i]?data.push(1):data.push('-')
				itembar[id+'4'][i]?data.push(1):data.push('-')
				series.push({
					name:'da',
					type:'bar',
					stack:'total',
					// label:{
					// 	normal:{
					// 		show:true,
					// 		position:'top',
					// 		formatter:'{b}'
					// 	}
					// },
					itemStyle:{
						normal:{
							opacity:0.3,
							color:function(params){
								var colorList=['grey','#e9b181','#ef862b','#b85703']
								return colorList[params.dataIndex]
							}
						},
						emphasis:{
							opacity:1
						}
					},
					data:data
				})
				i++
			}
			let labelId0=itembar[id+'1'].length
			if(labelId0!=0){
				series[labelId0-1]['data'][0]={
					value:1,
					label:{
						normal:{
							show:true,
							position:'top',
							opacity:1,
							textStyle:{
								color:'black'
							},
							formatter:function(params){
								return itembar[id+'1'].length
							}
						}
					}
				}
			}
			let labelId1=itembar[id+'2'].length
			if(labelId1!=0){
				series[labelId1-1]['data'][1]={
					value:1,
					label:{
						normal:{
							show:true,
							position:'top',
							opacity:1,
							textStyle:{
								color:'black'
							},
							formatter:function(params){
								return itembar[id+'2'].length
							}
						}
					}
				}
			}
			let labelId2=itembar[id+'3'].length
			if(labelId2!=0){
				series[labelId2-1]['data'][2]={
					value:1,
					label:{
						normal:{
							show:true,
							position:'top',
							opacity:1,
							textStyle:{
								color:'black'
							},
							formatter:function(params){
								return itembar[id+'3'].length
							}
						}
					}
				}
			}
			let labelId3=itembar[id+'4'].length
			if(labelId3!=0){
				series[labelId3-1]['data'][3]={
					value:1,
					label:{
						normal:{
							show:true,
							position:'top',
							opacity:1,
							textStyle:{
								color:'black'
							},
							formatter:function(params){
								return itembar[id+'4'].length
							}
						}
					}
				}
			}
			$scope['optionband'+id]={
				grid:{
					left:'15%',
					top:15,
					bottom:5
				},
				tooltip:{
					// triggerOn:'click',
					enterable:true,
					// position:'right',
					formatter:function(params){
						if(params.dataIndex==0){
							return '<h5>'+itembar[id+'1'][params.seriesIndex]['name']+'</h5>'
								+'<div>Direct Report Bins:'+params.name+'</div>'
								+'<div>Human Resources Career Band Code:'+itembar[id+'1'][params.seriesIndex]['Human Resources Career Band Code']+'</div>'
								+'<div>Num of Direct Reports:'+itembar[id+'1'][params.seriesIndex]['Num of Direct Reports']+'</div>'
								+'<a href="/#/fourth">Check Employee Reports Details</a>'
								+'<a href="/d3-tree/index1.html">Department Structure</a>'
						}else if(params.dataIndex==1){
							return '<h5>'+itembar[id+'2'][params.seriesIndex]['name']+'</h5>'
								+'<div>Direct Report Bins:'+params.name+'</div>'
								+'<div>Human Resources Career Band Code:'+itembar[id+'2'][params.seriesIndex]['Human Resources Career Band Code']+'</div>'
								+'<div>Num of Direct Reports:'+itembar[id+'2'][params.seriesIndex]['Num of Direct Reports']+'</div>'
								+'<a href="/#/fourth">Check Employee Reports Details</a>'
								+'<a href="/d3-tree/index1.html">Department Structure</a>'
						}else if(params.dataIndex==2){
							return '<h5>'+itembar[id+'3'][params.seriesIndex]['name']+'</h5>'
								+'<div>Direct Report Bins:'+params.name+'</div>'
								+'<div>Human Resources Career Band Code:'+itembar[id+'3'][params.seriesIndex]['Human Resources Career Band Code']+'</div>'
								+'<div>Num of Direct Reports:'+itembar[id+'3'][params.seriesIndex]['Num of Direct Reports']+'</div>'
								+'<a href="/#/fourth">Check Employee Reports Details</a>'
								+'<a href="/d3-tree/index1.html">Department Structure</a>'
						}else if(params.dataIndex==3){
							return '<h5>'+itembar[id+'4'][params.seriesIndex]['name']+'</h5>'
								+'<div>Direct Report Bins:'+params.name+'</div>'
								+'<div>Human Resources Career Band Code:'+itembar[id+'4'][params.seriesIndex]['Human Resources Career Band Code']+'</div>'
								+'<div>Num of Direct Reports:'+itembar[id+'4'][params.seriesIndex]['Num of Direct Reports']+'</div>'
								+'<a href="/#/fourth">Check Employee Reports Details</a>'
								+'<a href="/d3-tree/index1.html">Department Structure</a>'
						}
					}
				},
				xAxis:[{
					type:'category',
					splitArea:{show:false},
					splitLine:{show:false},
					axisTick:{
						show:false
					},
					axisLabel:{
						show:false
					},
					data:['0','1~3','4~6','7~9']}
				],
				yAxis:[{
					name:'Count of Supervisors',
		            nameLocation:'middle',
		            nameGap:'25',
					type:'value',
					splitArea:{show:false},
					splitLine:{show:false}}

				],
				series:series
			}
			$scope['configband'+id]={
				theme: 'vintage',
		        dataLoaded: true,
		        event: [{
		            click: function(params) {
		                console.log(params)
		                    

		            }
		        }]
			}
		}
		band(1)
		band(2)
		band(3)
		band(4)
		band(5)
		band(6)
		
	})
})
.controller('fourthCtrl',function($scope,$http){
	$scope.option3={
		grid:{
			left:'15%',
			top:5,
			bottom:5
		},
		xAxis: [{
                    type: 'category',
                    data: [1],
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisTick: {
                        show: false

                    },
                    axisLabel: {
                        show:false
                    }
                }],
                yAxis: [{
                	name:'Count of Employees',
                	nameLocation:'middle',
                	nameGap:'25',
                    type: 'value',
                    min: 0,
                    max: 40,
                    interval: 10,
                    axisTick:{
                    	show:false
                    },
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        
                    }
                }],
                series: [{
                    name: 'Expense Distribution',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: function(params){
                            	return params.data+'\n'+(params.data / 54*100).toFixed(2) + '%';
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'blue',
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                        }
                    },
                    data: [29]
                }]
	}
	$scope.config3={
		theme: 'vintage',
        dataLoaded: true,
        event: [{
            click: function(params) {
                console.log(params)   
            }
        }]
	}
	$scope.option2={
		grid:{
			left:'15%',
			top:5,
			bottom:5
		},
		xAxis: [{
                    type: 'category',
                    data: [1],
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisTick: {
                        show: false

                    },
                    axisLabel: {
                        show:false
                    }
                }],
                yAxis: [{
                	name:'Count of Employees',
                	nameLocation:'middle',
                	nameGap:'25',
                    type: 'value',
                    min: 0,
                    max: 30,
                    interval: 10,
                    axisTick:{
                    	show:false
                    },
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        
                    }
                }],
                series: [{
                    name: 'Expense Distribution',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: function(params){
                            	return params.data+'\n'+(params.data / 54*100).toFixed(2) + '%';
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'blue',
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                        }
                    },
                    data: [21]
                }]
	}
	$scope.config2={
		theme: 'vintage',
        dataLoaded: true,
        event: [{
            click: function(params) {
                console.log(params)
                    

            }
        }]
	}
	$scope.option1={
		grid:{
			left:'15%',
			top:5,
			bottom:5
		},
		xAxis: [{
                    type: 'category',
                    data: [1],
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisTick: {
                        show: false

                    },
                    axisLabel: {
                        show:false
                    }
                }],
                yAxis: [{
                	name:'Count of Employees',
                	nameLocation:'middle',
                	nameGap:'25',
                    type: 'value',
                    min: 0,
                    max: 30,
                    interval: 10,
                    axisTick:{
                    	show:false
                    },
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        
                    }
                }],
                series: [{
                    name: 'Expense Distribution',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: function(params){
                            	return params.data+'\n'+(params.data / 54*100).toFixed(2) + '%';
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'blue',
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                        }
                    },
                    data: [4]
                }]
	}
	$scope.config1={
		theme: 'vintage',
        dataLoaded: true,
        event: [{
            click: function(params) {
                console.log(params)
                    

            }
        }]
	}
	$http({
		method:'GET',
		url:'band1.json'
	}).then(function(res){
		let band1=[],band2=[],band3=[],itembar={}
		res.data.forEach(function(v,i){
			switch(v["Human Resources Career Band Code"]){
				case 1:band1.push(v);break;
				case 2:band2.push(v);break;
				case 3:band3.push(v);break;
			}
		})
		function item(id){
			let itemband=[]
			switch(id){
				case 1:banditem=band1;break;
				case 2:banditem=band2;break;
				case 3:banditem=band3;break;
			}
			itembar[id+'1']=[],itembar[id+'2']=[],itembar[id+'3']=[],itembar[id+'4']=[],itembar[id+'5']=[]
			banditem.forEach(function(v,i){
				if(v['Num of Indirect Reports']==0){
					itembar[id+'1'].push(v)
				}else if(v['Num of Indirect Reports']>=1&&v['Num of Indirect Reports']<=3){
					itembar[id+'2'].push(v)
				}else if(v['Num of Indirect Reports']>=4&&v['Num of Indirect Reports']<=6){
					itembar[id+'3'].push(v)
				}else if(v['Num of Indirect Reports']>=7&&v['Num of Indirect Reports']<=9){
					itembar[id+'4'].push(v)
				}else if(v['Num of Indirect Reports']>=10){
					itembar[id+'5'].push(v)
				}
			})
		}
		function band(id){
			let series=[],i=0,data=[];
			item(id);
			while(itembar[id+'1'][i]||itembar[id+'2'][i]||itembar[id+'3'][i]||itembar[id+'4'][i]||itembar[id+'5'][i]){
				let data=[]
				itembar[id+'1'][i]?data.push(1):data.push('-')
				itembar[id+'2'][i]?data.push(1):data.push('-')
				itembar[id+'3'][i]?data.push(1):data.push('-')
				itembar[id+'4'][i]?data.push(1):data.push('-')
				itembar[id+'5'][i]?data.push(1):data.push('-')
				series.push({
					name:'da',
					type:'bar',
					stack:'total',
					itemStyle:{
						normal:{
							opacity:0.3,
							color:function(params){
								var colorList=['grey','#e9b181','#ef862b','#b85703','black']
								return colorList[params.dataIndex]
							}
						},
						emphasis:{
							opacity:1
						}
					},
					data:data
				})
				i++
			}
			console.log(series)
			let labelId0=itembar[id+'1'].length
			if(labelId0!=0){
				series[labelId0-1]['data'][0]={
					value:1,
					label:{
						normal:{
							show:true,
							position:'top',
							opacity:1,
							textStyle:{
								color:'black'
							},
							formatter:function(params){
								return itembar[id+'1'].length
							}
						}
					}
				}
			}
			let labelId1=itembar[id+'2'].length
			if(labelId1!=0){
				series[labelId1-1]['data'][1]={
					value:1,
					label:{
						normal:{
							show:true,
							position:'top',
							opacity:1,
							textStyle:{
								color:'black'
							},
							formatter:function(params){
								return itembar[id+'2'].length
							}
						}
					}
				}
			}
			let labelId2=itembar[id+'3'].length
			if(labelId2!=0){
				series[labelId2-1]['data'][2]={
					value:1,
					label:{
						normal:{
							show:true,
							position:'top',
							opacity:1,
							textStyle:{
								color:'black'
							},
							formatter:function(params){
								return itembar[id+'3'].length
							}
						}
					}
				}
			}
			let labelId3=itembar[id+'4'].length
			if(labelId3!=0){
				series[labelId3-1]['data'][3]={
					value:1,
					label:{
						normal:{
							show:true,
							position:'top',
							opacity:1,
							textStyle:{
								color:'black'
							},
							formatter:function(params){
								return itembar[id+'4'].length
							}
						}
					}
				}
			}
			let labelId4=itembar[id+'5'].length
			if(labelId4!=0){
				series[labelId4-1]['data'][4]={
					value:1,
					label:{
						normal:{
							show:true,
							position:'top',
							opacity:1,
							textStyle:{
								color:'black'
							},
							formatter:function(params){
								return itembar[id+'5'].length
							}
						}
					}
				}
			}
			$scope['optionband'+id]={
				grid:{
					left:'15%',
					top:15,
					bottom:5
				},
				tooltip:{
					// triggerOn:'click',
					enterable:true,
					// position:'right',
					formatter:function(params){
						if(params.dataIndex==0){
							return '<h5>'+itembar[id+'1'][params.seriesIndex]['name']+'</h5>'
								+'<div>Direct Report Bins:'+params.name+'</div>'
								+'<div>Human Resources Career Band Code:'+itembar[id+'1'][params.seriesIndex]['Human Resources Career Band Code']+'</div>'
								+'<div>Num of Direct Reports:'+itembar[id+'1'][params.seriesIndex]['Num of Indirect Reports']+'</div>'
								// +'<a href="/#/fourth">Check Employee Reports Details</a>'
								+'<a href="/d3-tree/index1.html">Department Structure</a>'
						}else if(params.dataIndex==1){
							return '<h5>'+itembar[id+'2'][params.seriesIndex]['name']+'</h5>'
								+'<div>Direct Report Bins:'+params.name+'</div>'
								+'<div>Human Resources Career Band Code:'+itembar[id+'2'][params.seriesIndex]['Human Resources Career Band Code']+'</div>'
								+'<div>Num of Direct Reports:'+itembar[id+'2'][params.seriesIndex]['Num of Indirect Reports']+'</div>'
								// +'<a href="/#/fourth">Check Employee Reports Details</a>'
								+'<a href="/d3-tree/index1.html">Department Structure</a>'
						}else if(params.dataIndex==2){
							return '<h5>'+itembar[id+'3'][params.seriesIndex]['name']+'</h5>'
								+'<div>Direct Report Bins:'+params.name+'</div>'
								+'<div>Human Resources Career Band Code:'+itembar[id+'3'][params.seriesIndex]['Human Resources Career Band Code']+'</div>'
								+'<div>Num of Direct Reports:'+itembar[id+'3'][params.seriesIndex]['Num of Indirect Reports']+'</div>'
								// +'<a href="/#/fourth">Check Employee Reports Details</a>'
								+'<a href="/d3-tree/index1.html">Department Structure</a>'
						}else if(params.dataIndex==3){
							return '<h5>'+itembar[id+'4'][params.seriesIndex]['name']+'</h5>'
								+'<div>Direct Report Bins:'+params.name+'</div>'
								+'<div>Human Resources Career Band Code:'+itembar[id+'4'][params.seriesIndex]['Human Resources Career Band Code']+'</div>'
								+'<div>Num of Direct Reports:'+itembar[id+'4'][params.seriesIndex]['Num of Indirect Reports']+'</div>'
								// +'<a href="/#/fourth">Check Employee Reports Details</a>'
								+'<a href="/d3-tree/index1.html">Department Structure</a>'
						}else if(params.dataIndex==4){
							return '<h5>'+itembar[id+'5'][params.seriesIndex]['name']+'</h5>'
								+'<div>Direct Report Bins:'+params.name+'</div>'
								+'<div>Human Resources Career Band Code:'+itembar[id+'5'][params.seriesIndex]['Human Resources Career Band Code']+'</div>'
								+'<div>Num of Direct Reports:'+itembar[id+'5'][params.seriesIndex]['Num of Indirect Reports']+'</div>'
								// +'<a href="/#/fourth">Check Employee Reports Details</a>'
								+'<a href="/d3-tree/index1.html">Department Structure</a>'
						}
					}
				},
				xAxis:[{
					type:'category',
					splitArea:{show:false},
					splitLine:{show:false},
					axisTick:{
						show:false
					},
					axisLabel:{
						show:false
					},
					data:['0','1~3','4~6','7~9','10 and above']}
				],
				yAxis:[{
					name:'Count of Supervisors',
		            nameLocation:'middle',
		            nameGap:'25',
					type:'value',
					splitArea:{show:false},
					splitLine:{show:false}}

				],
				series:series
			}
			$scope['configband'+id]={
				theme: 'vintage',
		        dataLoaded: true,
		        event: [{
		            click: function(params) {
		                console.log(params)
		            }
		        }]
			}
		}
		band(1)
		band(2)
		band(3)
	})
})
