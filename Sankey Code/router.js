var app = angular.module('app', ["ui.router", "daterangepicker", "ui.grid", "ui.grid.autoResize"])

app.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/attribute");
	$stateProvider
		.state('attribute', {
			url: '/attribute',
			templateUrl: 'attribute.html'
		})
		.state('nodedetail', {
			url: '/nodedetail',
			templateUrl: 'nodedetail.html',
			params: {
				data: null,
				date: null
			}
		})
		.state('path', {
			url: '/path',
			templateUrl: 'path.html'
		})
		.state('fullpath', {
			url: '/fullpath',
			templateUrl: 'fullpath.html'
		})
		.state('pathAnalysis', {
			url: '/pathAnalysis',
			templateUrl: 'pathAnalysis.html',
			params: {
				data: null
			}
		})
		.state('dashboard', {
			url: '/dashboard',
			templateUrl: 'attDashboard.html'
		})
		.state('attributionAnalysis', {
			url: '/attributionAnalysis',
			templateUrl: 'attAnalysis.html'
		})
})