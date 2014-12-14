angular.module('b2b.services').service('BeerService', ['$http', function BeerService($http) {
    this.getAllBeers = function (params) {
        return $http.get('/api/beer', {params: params}).then(function (response) {
            return response.data;
        });
    };
    this.createBeer = function (params) {
        return $http.post('/api/beer', {params: params}).then(function (response) {
            return response.data;
        });
    };
    this.getBeerByParams = function (params) {
        return $http.get('/api/bar/beers', {params: params}).then(function (response) {
            return response.data;
        });
    };
}]);
