angular.module('b2b.services').service('BreweryService', ['$http', function BreweryService($http) {
    this.getAllBreweries = function (params) {
        return $http.get('/api/brewery', {params: params}).then(function (response) {
            return response.data;
        });
    };
}]);
