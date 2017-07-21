app.controller("OverviewCtrl", ['$scope', '$rootScope', '$http',
    function($scope, $rootScope, $http) {
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/profile',
        }).then(function successCallback(success) {
            var thisUser = $rootScope.user.split(' ');
            jQuery.each(success.data.profiles, function(index, profile) {
                if (profile.username.toLowerCase() === thisUser[0].toLowerCase()) {
                    $scope.profile = profile;
                }
            });
            // $scope.display_images = success.data.works;
        }, function errorCallback(error) {});

    }

]);
