app.directive('itemDialog', function() {
    return {
        template: '<div class="modal fade" style="margin: 100px auto;">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" ng-click="cancel()">&times;</button>' +
            '<h3 class="modal-title text-center">{{ title }}</h3>' +
            '</div>' +
            '<form class="modal-body" ng-submit="submit()" name="mydialog" novalidate>' +
            '<div  class="form-group" ><input class="form-control"type="text" placeholder="Title" ng-Model="item.title" required/></div>' +
            '<div  class="form-group" ><input class="form-control" type="text" placeholder="Author" ng-Model="item.author" required/></div>' +
            '<div  class="form-group" ><input class="form-control" type="text" placeholder="Like" ng-Model="item.like" required/></div>' +
            '<div  class="form-group" ><input class="form-control" type="text" placeholder="Comment" ng-Model="item.comment" required/></div>' +
            '<button type="submit" class="btn btn-success" ng-disabled="mydialog.$invalid" style="margin-right:10px">Submit</button>' +
            '<button class="btn btn-default" ng-click="cancel()">Cancel</button>' +
            '</div>' +
            '</form>' +
            '</div>' +
            '</div>' +
            '</div>',
        restrict: 'E',
        replace: true,
        scope: {
            title: "@title",
            item: "="
        },
        link: function postLink(scope, element, attrs) {
            // scope.title = attrs.title;
            $scope = scope.$parent;

            $scope.$watch(attrs.visible, function(value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function() {
                $scope.$apply(function() {
                    $scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function() {
                $scope.$apply(function() {
                    $scope.$parent[attrs.visible] = false;
                });
            });
            scope.cancel = function() {
                $scope.addVisable = false;
                $scope.editVisable = false;
                $scope.editItem = {};
                $scope.tempItem = {};
            };

            scope.submit = function() {
                if (!$scope.addVisable) {
                    $scope.tempItem.title = scope.item.title;
                    $scope.tempItem.author = scope.item.author;
                    $scope.tempItem.like = scope.item.like;
                    $scope.tempItem.comment = scope.item.comment;
                } else {
                    $scope.display_images.push(scope.item);
                }
                scope.cancel();
            };
        }
    };
});
