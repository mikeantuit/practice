var app=angular.module('example',['ng-echarts','ui.router'])
app.config(function($stateProvider,$urlRouterProvider){
	
	$urlRouterProvider.otherwise("/first");
	$stateProvider
		.state('first',{
			url:'/first',
			templateUrl:'first.html',
			controller:'firstCtrl'
		})
		.state('second',{
			url:'/second',
			templateUrl:'second.html',
			controller:'secondCtrl'
		})
		.state('third',{
			url:'/third',
			templateUrl:'third.html',
			controller:'thirdCtrl'
		})
		.state('fourth',{
			url:'/fourth',
			templateUrl:'fourth.html',
			controller:'fourthCtrl'
		})
})