app.factory('AuthService', ['$rootScope', '$cookieStore',
    function($rootScope, $cookieStore) {
        return {
            WriteCookie: function(user) {
                $cookieStore.put("User", user);
                $rootScope.user = user;
            },
            ReadCookie: function() {
                return $cookieStore.get('User');
            },
            RemoveCookie: function() {
                $cookieStore.remove('User');
                $rootScope.user = undefined;
            },
            CheckAuth: function() {
                if ($cookieStore.get('User') === "" || $cookieStore.get('User') === null || $cookieStore.get('User') === undefined) {
                    return false;
                }
                $rootScope.user = $cookieStore.get('User');
                return true;

            }
        }
    }
]);