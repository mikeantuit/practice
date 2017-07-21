app.controller("logoutCtrl", ['$scope', '$location', '$window', 'AuthService',
    function($scope, $location, $window, authService) {
        if (!authService.CheckAuth())
            $location.path('/');
        $scope.date = new Date();

        $scope.producerActive = false;

        var updateDate = function() {
            $scope.date = new Date();
        };

        $scope.logout = function() {
            authService.RemoveCookie();
            $location.path('/');
        };

        $scope.$watch(function() {
            return $('.subMenu').hasClass('active');
        }, function(active) {
            $scope.setNavBar(active);
        });

        var w = angular.element($window);
        $scope.$watch(function() {
            return w.width();
        }, function(newValue, oldValue) {
            $scope.setNavBar($('.subMenu').hasClass('active'));

        }, true);

        w.bind('resize', function() {
            $scope.$apply();
        });

        $scope.setNavBar = function(active) {
            var mql = $window.matchMedia("screen and (min-width: 1071px)");
            if (mql.matches) {
                if (active) {
                    $('.parMenu').addClass('active');
                    return true;
                }
            }
            $('.parMenu').removeClass('active');
        }

    }
]);
