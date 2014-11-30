'use strict';

services.service('AuthService', function Auth($http) {
    return {
        currentUser: function() {
             $http.get('/api/auth/loggedin').then(function(user){
                if (user !== '0'){
                   return user;
                }
            });
        },
        register: function(user){
            return $http.post('/api/auth/create', {user: user});
        },
        login: function(email, password) {
            return $http.post('/api/auth/local', {email: email, password: password}).then(function(res){
                return res.data;
            });
        },
        logout: function(){
            return $http.get('/api/auth/logout');
        }
    };
});
