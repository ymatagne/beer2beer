'use strict';

angular.module('b2b.controllers').controller('searchBeerController', ["$scope", "$location", "$document", "BarService", "BeerService", "TypeService", "$controller", function ($scope, $location, $document, BarService, BeerService,TypeService,$controller) {
    $.extend(this, $controller('rechercheController', {$scope: $scope}));
    $scope.getLocation();
    $scope.beer = {};
    $scope.bar = {};
    $scope.multipleChoose = {};
    $scope.multipleChoose.selectedTypes = [];
    $scope.beerShow = undefined;

    $scope.slider = {
        value: [1,30],
        min: 1,
        max: 30,
        step: 0.5,
        precision: 0.5,
        range: true,
        tooltipseparator: '>',
        tooltipsplit: false
    };

    $scope.refreshBeers = function (beer) {
        var params = {name: beer, type_id: []};
        BeerService.getBeersByTypeOrName(params).then(
            function (data) {
                $scope.beers = data;
            }
        );
    };

    $scope.refreshTypes = function (type) {
        var params = {name: type};
        TypeService.getAllTypes(params).then(
            function (data) {
                $scope.types = data;
            }
        );
    };

    $scope.refreshBeersList = function ($item) {
        var type_id = [];
        type_id.push($item._id);
        for (var idx in $scope.multipleChoose.selectedTypes) {
            type_id.push($scope.multipleChoose.selectedTypes[idx]._id);

        }
        var params = {name: '', type_id: type_id};
        BeerService.getBeersByTypeOrName(params).then(
            function (data) {
                $scope.beer = {};
                $scope.beers = data;
            }
        );
    };

    $scope.refreshBeersListAfterDelete = function ($item) {
        var type_id = [];
        for (var idx in $scope.multipleChoose.selectedTypes) {
            if ($item._id !== $scope.multipleChoose.selectedTypes[idx]._id) {
                type_id.push($scope.multipleChoose.selectedTypes[idx]._id);
            }

        }
        var params = {name: '', type_id: type_id};

        BeerService.getBeersByTypeOrName(params).then(
            function (data) {
                $scope.beer = {};
                $scope.beers = data;
            }
        );
    };

    $scope.removeType = function () {
        $scope.multipleChoose.selectedTypes = [];
        $scope.$apply();
        $scope.refreshBeers('');
    };

    $scope.searchBeer = function () {
        var beer,
            type = [],
            prices;

        if ($scope.beer.selected) {
            beer = $scope.beer.selected._id;
        } else if ($scope.multipleChoose.selectedTypes) {
            for (var idx in $scope.multipleChoose.selectedTypes) {
                type.push($scope.multipleChoose.selectedTypes[idx]._id);
            }
        }

        if ($scope.slider.value[0]!== 1 || $scope.slider.value[1]!== 30) {
            prices = $scope.slider.value;
        }

        var params = {type: type, beer: beer,prices: prices};

        BarService.getBarsByBeers(params).then(
            function (data) {
                var bars = data;
                $scope.barsLocation = [];
                $scope.bar = {};
                $scope.beerShow = undefined;
                for (var index in bars) {
                    var bar = bars[index];
                    $scope.addMarker(bar.localisation.coordinates[0], bar.localisation.coordinates[1], 'bar', bar._id, bar.nom, bar);
                }
            });
    };

    $scope.showBeerInBar = function (id) {
        var params = {id: id};
        BeerService.getBeerByParams(params).then(
            function (data) {
                $scope.beerShow = data;
            }, function (res) {
                $scope.errors = {};
                angular.forEach(res.data.errors, function (error, field) {
                    $scope.errors[field] = error.type;
                });
            });
    };

}]);
