'use strict';

controllers.controller('menuAdminController', function ($scope, $http) {
    $scope.map = {center: {latitude: 45, longitude: -73}, zoom: 8};
    $scope.beer = {};
    $scope.refreshBeers = function (beer) {
        var params = {name: beer};
        return $http.get(
            '/api/beer',
            {params: params}
        ).then(function (response) {
                $scope.beers = response.data;
            });
    };
});
