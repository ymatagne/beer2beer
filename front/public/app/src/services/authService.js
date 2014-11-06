'use strict';

services.factory('Auth', function Auth($rootScope, $http) {
    return {
        currentUser: function() {
             $http.get('/api/auth/loggedin').success(function(user){
                if (user !== '0'){
                   $rootScope.currentUser = user;
                }});

        },
    }
});
