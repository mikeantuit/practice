app.factory("UserService", function($http, $q) {
    return {
        login: function(user) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: 'http://localhost:3000/api/login',
                data: user
            }).then(function(success) {
                    deferred.resolve(success);
                },
                function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        },
        getUser: function(user) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: 'http://localhost:3000/api/getuser',
                params: user
            }).then(function(result) {
                deferred.resolve(result);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
});
