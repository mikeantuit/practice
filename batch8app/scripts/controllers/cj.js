app.controller('tabController', ['$scope', function($scope){

		$scope.date = new Date();

		// ====the controller for the Tab is here================================================
		//Tab counter
		var counter = 1;

		//this a array to store the tabs
		$scope.tabs = [];

		//addTab function defines here: add tab to the end of the array
		var addTab = function () {
			$scope.tabs.push({title:'Task' + ' ' + counter, content: 'Task' + ' ' + counter});
			counter++;
			$scope.tabs[$scope.tabs.length - 1].active = true;
		};

		//reomve tab by index
		var removeTab = function(event, index) {
			event.preventDefault();
			event.stopPropagation();
			$scope.tabs.splice(index, 1);
		};

		//Initialize the scope functions
		$scope.addTab = addTab;
		$scope.removeTab = removeTab

		// just start with 1 tab
		for (var i=0; i<1; i++) {
			addTab();
		}
}]);


app.controller('calendarController', ['$scope', function($scope){
			// ====from here is the controller to the calendar==========================================

		$scope.today = function(){
			$scope.dt = new Date();
		};
		$scope.today(); //this make today's date selected as default

		$scope.toggleMin = function() {
			$scope.minDate = $scope.minDate ? null : new Date();
		};

		$scope.toggleMin(); //this will disable those dates before today

		// =================task controller starts here

		$scope.tasks = [ {text:'Demo Task, you can add your tasks below', done:false}];

	    $scope.getTotalTasks = function() {
	      return $scope.tasks.length;
	    };

	    $scope.ADDTask = function (){
	      $scope.tasks.push({text:$scope.formTaskText, done:false});
	      console.log($scope.formTaskText);
	      $scope.formTaskText ='';
	    };

	    $scope.clearCompleted = function () {
	      $scope.tasks = _.filter($scope.tasks, 
	                              function(task){
	                              return !task.done;
	                              }
	                            );
	    };

	    // =============================================================



}]);