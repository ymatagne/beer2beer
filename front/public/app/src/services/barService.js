angular.module('b2b.services').service('BarService', ['$http', function BarService($http) {
    this.getAllBars = function (params) {
        return $http.get('/api/bar', {params: params}).then(function (response) {
            return response.data;
        });
    };
    this.getBarsByBeers = function (params) {
        return $http.get('/api/bar/all', {params: params}).then(function (response) {
            return response.data;
        });
    };
    this.createBar = function (params) {
        return $http.post('/api/bar', {params: params}).then(function (response) {
            return response.data;
        });
    };
    this.addConsumption = function (idBar, params) {
        return $http.put('/api/bar/' + idBar, {params: params}).then(function (response) {
            return response.data;
        });
    };
    this.updateConsumption = function (idBar, params) {
        return $http.put('/api/bar/' + idBar + '/consumption', {params: params}).then(function (response) {
            return response.data;
        });
    };
}]);
