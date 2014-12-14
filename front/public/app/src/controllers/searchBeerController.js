angular.module('b2b.controllers').controller('searchBeerController', function ($scope, $location, $document, BarService, BeerService,TypeService) {
    $scope.myLocation = [];
    $scope.barsLocation = [];
    $scope.map = {center: {latitude: 0, longitude: 0}, zoom: 15};


    $scope.beer = {};
    $scope.bar = {};
    $scope.multipleChoose = {};
    $scope.multipleChoose.selectedTypes = [];

    $scope.showPosition = function (position) {
        $scope.map.center.latitude = position.coords.latitude;
        $scope.map.center.longitude = position.coords.longitude;
        $scope.addMarker(position.coords.latitude, position.coords.longitude, 'position', 0, null, null);
        $scope.$apply();

    };
    $scope.showError = function (error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                $scope.error = "User denied the request for Geolocation.";
                break;
            case error.POSITION_UNAVAILABLE:
                $scope.error = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                $scope.error = "The request to get user location timed out.";
                break;
            case error.UNKNOWN_ERROR:
                $scope.error = "An unknown error occurred.";
                break;
        }
        $scope.$apply();
    };
    $scope.addMarker = function (latitude, longitude, type, uid, title, bar) {
        if (type === 'bar') {
            $scope.barsLocation.push({
                uid: uid,
                provider: "test",
                name: "It's you",
                icon: 'images/bar.png',
                latitude: latitude,
                longitude: longitude,
                title: title,
                bar: bar,
                onClick: function (ret) {
                    $scope.showBeerInBar(ret.model.bar._id);
                }
            });
        } else if (type === 'position') {
            $scope.myLocation.push({
                uid: uid,
                provider: "test",
                name: "It's you",
                latitude: latitude,
                longitude: longitude
            });
        }
    };
    $scope.getLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
        }
        else {
            $scope.error = "Geolocation is not supported by this browser.";
        }
    };

    // Gestion des listes
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
        for (idx in $scope.multipleChoose.selectedTypes) {
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
        for (idx in $scope.multipleChoose.selectedTypes) {
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

    BarService.getAllBars({}).then(function (data) {
        var bars = data;
        for (var index in bars) {
            var bar = bars[index];
            $scope.addMarker(bar.latitude, bar.longitude, 'bar', bar._id, bar.nom, bar);
        }
    });

    $scope.searchBeer = function () {
        var beer;
        var type = [];

        if ($scope.beer.selected) {
            beer = $scope.beer.selected._id;
        } else if ($scope.multipleChoose.selectedTypes) {
            for (idx in $scope.multipleChoose.selectedTypes) {
                type.push($scope.multipleChoose.selectedTypes[idx]._id);
            }
        }

        var params = {type: type, beer: beer};
        BarService.getBarsByBeers(params).then(
            function (data) {
                var bars = data;
                $scope.barsLocation = [];
                $scope.bar = {};
                for (var index in bars) {
                    var bar = bars[index];
                    $scope.addMarker(bar.latitude, bar.longitude, 'bar', bar._id, bar.nom, bar);
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

    $scope.getLocation();
});
