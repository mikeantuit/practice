app.controller("ImageController", ['$scope', '$http', '$filter',
    function($scope, $http, $filter) {
        $http({
            method: 'GET',
            url: 'http://localhost:3000/api/work',
        }).then(function successCallback(success) {
            $scope.display_images = success.data.works;
        }, function errorCallback(error) {});

        $scope.addVisable = false;
        $scope.editVisable = false;
        $scope.tempItem = {};
        $scope.editItem = {}

        $scope.toggleAdd = function() {
            $scope.addVisable = true;
        };

        $scope.toggleEdit = function(image) {
            $scope.editVisable = true;
            $scope.tempItem = image;
            $scope.editItem = {
                title: image.title,
                author: image.author,
                like: image.like,
                comment: image.comment
            };
        };

        $scope.myDropDown = 'card';
        $scope.togglePage = function(choice) {
            $scope.myDropDown = choice;
        }

        $scope.isdeleteVisible = false;

        var index;
        $scope.removeImage = function($index) {
            index = $index;
            // console.log($index);
            $scope.isdeleteVisible = !$scope.isdeleteVisible;

};
        $scope.Submit_delete = function() {
            // console.log(index);
            $scope.display_images.splice(index, 1);
            $scope.isdeleteVisible = !$scope.isdeleteVisible;
        };

        $scope.Cancel_delete = function() {

            $scope.isdeleteVisible = !$scope.isdeleteVisible;
        };




        var orderBy = $filter('orderBy');
        $scope.order = function(predicate, reverse) {
            $scope.display_images = orderBy($scope.display_images, predicate, reverse);
        };
    }

]);
