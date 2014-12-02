angular.module('b2b.services').service('AuthService', ['$http', function Auth($http) {
    this.currentUser = function() {
         return $http.get('/api/auth/loggedin').then(function(res){
            if (res.data !== '0'){
               return res.data;
            }
        });
    };
    this.register = function(user){
        return $http.post('/api/auth/create', {user: user});
    };
    this.login = function(email, password) {
        return $http.post('/api/auth/local', {email: email, password: password}).then(function(res){
            return res.data;
        });
    };
    this.logout = function(){
        return $http.get('/api/auth/logout');
    };
}]);
