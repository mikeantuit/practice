	app.directive('onFinishRender', function($timeout) {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attr) {
	            if (scope.$last === true) {
	                $timeout(function() {
	                    scope.$emit('ngRepeatFinished');
	                });
	            }
	        }
	    }
	});
	app.filter('fromNow', function() {
	    return function(date) {
	        return moment(date).fromNow();
	    }
	});

	app.controller("videoCtrl", ['$scope', '$http', '$rootScope',
	    function($scope, $http, $rootScope) {

	        $http({
	            method: 'GET',
	            url: 'http://localhost:3000/api/video',
	        }).then(function successCallback(success) {
	                var videos = success.data.video;
	                $scope.videos = [];
	                for (var i = 0; i < videos.length; i++) {
	                    var tempVideos = [];
	                    tempVideos.push({
	                        id: i,
	                        source: videos[i]
	                    });
	                    for (var j = i + 1, m = 0; m < 3; j++, m++) {
	                        if (j >= videos.length)
	                            j = 0;
	                        tempVideos.push({
	                            id: j,
	                            source: videos[j]
	                        });
	                    }
	                    $scope.videos.push({
	                        video: tempVideos
	                    });
	                }
	                initVideo(videos[0]);
	                initPlays();
	            },
	            function errorCallback(error) {
	                console.log('error');
	            });

	        $scope.getComments = function(videoId) {
	            $http({
	                method: 'GET',
	                url: 'http://localhost:3000/api/comment',
	                params: {
	                    "videoId": videoId
	                }
	            }).then(function successCallback(success) {
	                    $scope.comments = success.data.file;
	                },
	                function errorCallback(error) {});
	        }

	        $scope.changeVideo = function(video, index, play) {
	            if (play != "play") {
	                initVideo(video);
	                changePlays(index);
	            }
	        }

	        $scope.saveComment = function() {
	            var comment = {
	                videoId: $scope.currentVideo.id,
	                comment: $scope.commentText,
	                author: $rootScope.user,
	                creatTime: new Date()
	            };
	            $http({
	                method: 'POST',
	                url: 'http://localhost:3000/api/comment',
	                data: comment
	            }).then(function successCallback(success) {
	                    $scope.getComments($scope.currentVideo.id);
	                    $scope.commentText = "";
	                },
	                function errorCallback(error) {
	                    console.log('error');
	                });

	        }


	        initVideo = function(video) {
	            $scope.currentVideo = video;
	            $('#myVideo').attr('src', video.src);
	            $scope.getComments(video.id);
	        }
	        initPlays = function() {
	            $scope.plays = [];
	            $scope.plays.push("play");
	            for (var i = 1; i < $scope.videos.length; i++) {
	                $scope.plays.push("");
	            };
	        }
	        changePlays = function(index) {
	            for (var i = 0; i < $scope.videos.length; i++) {
	                $scope.plays[i] = "";
	            };
	            $scope.plays[index] = "play";
	        }


	    }
	]);
