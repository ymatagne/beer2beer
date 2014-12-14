angular.module('b2b.controllers').controller('menuAdminController', function ($scope, BarService, BeerService, TypeService, BreweryService) {
    $scope.map = {center: {latitude: 0, longitude: 0}, zoom: 15};
    $scope.myLocation = [];
    $scope.barsLocation = [];
    $scope.searchLocation = [];

    $scope.beer = {};
    $scope.bar = {};
    $scope.type = {};
    $scope.multipleChoose = {};
    $scope.multipleChoose.selectedTypes = [];
    $scope.quantity = {};
    $scope.breweries = {};
    $scope.consumption = {};
    $scope.quantities = [{quantity: "Galopin (125ml)"}, {quantity: "Flute (200 ml)"}, {quantity: "Demi (250ml)"},
        {quantity: "Gourde (330ml)"}, {quantity: "Pinte (500ml)"}, {quantity: "Double Pinte (1000ml)"}];

    // Gestion de la position de l utilisateur
    $scope.showPosition = function (position) {
        $scope.map.center.latitude = position.coords.latitude;
        $scope.map.center.longitude = position.coords.longitude;
        $scope.addMarker(position.coords.latitude, position.coords.longitude, 'position', 0);
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
        } else if (type === 'search') {
            $scope.searchLocation.push({
                uid: uid,
                provider: "test",
                name: "It's you",
                icon: 'images/search.png',
                latitude: latitude,
                longitude: longitude
            });
        }
    };
    $scope.getLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
        } else {
            $scope.message = undefined;
            $scope.error = "Geolocation is not supported by this browser.";
        }
    };
    $scope.showError = function (error) {
        $scope.message = undefined;
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
    $scope.getLocation();
    $scope.gotoBar = function ($item, $model) {
        $scope.showBeerInBar($item._id);
        $scope.map.center.latitude = $item.latitude;
        $scope.map.center.longitude = $item.longitude;
    };

    // Gestion des listes
    $scope.refreshBeers = function (beer) {
        var params = {name: beer};
        BeerService.getAllBeers(params).then(
            function (data) {
                $scope.beers = data;
            }, function (res) {
                $scope.errors = {};
                angular.forEach(res.data.errors, function (error, field) {
                    $scope.errors[field] = error.type;
                });
            });
    };

    $scope.refreshBars = function (nameOfBar) {
        var params = {name: nameOfBar};
        BarService.getAllBars(params).then(
            function (data) {
                $scope.bars = data;
                for (var index in $scope.bars) {
                    var bar = $scope.bars[index];
                    $scope.addMarker(bar.latitude, bar.longitude, 'bar', bar._id, bar.nom, bar);
                }
            }, function (res) {
                $scope.errors = {};
                angular.forEach(res.data.errors, function (error, field) {
                    $scope.errors[field] = error.type;
                });
            });
    };
    $scope.refreshTypes = function (type) {
        var params = {name: type};
        TypeService.getAllTypes(params).then(
            function (data) {
                $scope.types = data;
            }, function (res) {
                $scope.errors = {};
                angular.forEach(res.data.errors, function (error, field) {
                    $scope.errors[field] = error.type;
                });
            });
    };
    $scope.refreshBreweries = function (brewery) {
        var params = {name: brewery};
        BreweryService.getAllBreweries(params).then(
            function (data) {
                $scope.breweries = data;
            }, function (res) {
                $scope.errors = {};
                angular.forEach(res.data.errors, function (error, field) {
                    $scope.errors[field] = error.type;
                });
            });
    };

    // Recherche des bars
    var searchBox = new google.maps.places.SearchBox($('#addressOfBar')[0]);
    google.maps.event.addListener(searchBox, 'places_changed', function () {
        var places = searchBox.getPlaces();
        $scope.searchLocation = [];
        $scope.addMarker(places[0].geometry.location.k, places[0].geometry.location.B, 'search', places[0].id, places[0].nom, $scope.newBar);
        $scope.newBar.geolocation = places[0].geometry.location.toString();
        $scope.newBar.latitude = places[0].geometry.location.k;
        $scope.newBar.longitude = places[0].geometry.location.B;
        $scope.$apply();
    });

    // Creation du bar, de la biere et de l'emplacement
    $scope.createBar = function () {
        if ($scope.newBar) {
            var params = {bar: $scope.newBar};
            BarService.createBar(params).then(
                function () {
                    $scope.refreshBars('');
                    $scope.addNewBar = false;
                    $scope.newBar = {};
                    $scope.searchLocation = [];
                    $scope.error = undefined;
                    $scope.message = 'You have added a new bar !';
                }, function (res) {
                    $scope.errors = {};
                    angular.forEach(res.data.errors, function (error, field) {
                        $scope.errors[field] = error.type;
                    });
                });
        }
    };

    $scope.createBeer = function () {
        if ($scope.newBeer) {
            $scope.newBeer.type_id = $scope.multipleChoose.selectedTypes;
            var params = {beer: $scope.newBeer};
            BeerService.createBeer(params).then(
                function () {
                    $scope.refreshBeers('');
                    $scope.addNewBeer = false;
                    $scope.newBeer = {};
                    $scope.message = "You have added a new beer !";
                }, function (res) {
                    $scope.errors = {};
                    angular.forEach(res.data.errors, function (error, field) {
                        $scope.errors[field] = error.type;
                    });
                });
        }
    };

    $scope.link = function () {
        if ($scope.bar.selected._id && $scope.beer.selected._id) {

            $scope.consumption.beer_id = $scope.beer.selected._id;
            $scope.consumption.type_id = $scope.beer.selected.type_id;
            $scope.consumption.price = $scope.price;
            $scope.consumption.quantity = $scope.quantity.selected.quantity;

            var params = {bar: $scope.bar.selected, consumption: $scope.consumption};

            BarService.addConsumption($scope.bar.selected._id, params).then(
                function () {
                    $scope.consumption = {};
                    $scope.showBeerInBar($scope.bar.selected._id);
                    $scope.beer = {};
                    $scope.quantity = {};
                    $scope.price = "";
                    $scope.message = "Ok ! new Consumption created for a bar";
                }, function (res) {
                    $scope.errors = {};
                    $scope.consumption = {};
                    angular.forEach(res.data.errors, function (error, field) {
                        $scope.errors[field] = error.type;
                    });
                });
        }
    };

    // Ajout d'un nouveau bar ou d'une nouvelle biere
    $scope.showFormNewBar = function () {
        $scope.bar = {};
        $scope.addNewBar = !$scope.addNewBar;
    };

    $scope.showFormNewBeer = function () {
        $scope.beer = {};
        $scope.addNewBeer = !$scope.addNewBeer;
    };

    $scope.showBeerInBar = function (id) {
        var params = {id: id};
        BeerService.getBeerByParams(params).then(
            function (data) {
                $scope.beerShow = data;
                $scope.bar.selected = data;
            }, function (res) {
                $scope.errors = {};
                angular.forEach(res.data.errors, function (error, field) {
                    $scope.errors[field] = error.type;
                });
            });
    };

    $scope.changerEtatConsumption = function (consumption) {
        var params = {bar_id: $scope.bar.selected._id, consumption: consumption};
        BarService.updateConsumption($scope.bar.selected._id, params).then(
            function () {
                $scope.errors = {};
                consumption.enable = !consumption.enable;
                $scope.message = 'Consumption has changed state';
            }, function (res) {
                $scope.errors = {};
                angular.forEach(res.data.errors, function (error, field) {
                    $scope.errors[field] = error.type;
                });
            });
    }
})
;
