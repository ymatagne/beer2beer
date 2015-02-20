angular.module('b2b.services').service('UserService', ['$http', function UserService($http) {
    this.getAllUsers = function(params) {
         return $http.get('/api/user',{params: params}).then(function(response){
             return response.data;
         });
    };
    this.deleteUser = function(params) {
        return $http.delete('/api/user',{params: params}).then(function(response){
            return response.data;
        });
    };
    this.updateUser = function(params) {
        return $http.put('/api/user',{params: params}).then(function(response){
            return response.data;
        });
    };
}]);
