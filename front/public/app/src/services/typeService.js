angular.module('b2b.services').service('TypeService', ['$http', function TypeService($http) {
    this.getAllTypes = function (params) {
        return $http.get('/api/type', {params: params}).then(function (response) {
            return response.data;
        });
    };
}]);
