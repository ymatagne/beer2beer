angular.module('b2b.controllers').controller('menuAdminController', function ($scope, $http) {
    $scope.map = {center: {latitude: 0, longitude: 0}, zoom: 15};
    $scope.myLocation = [];
    $scope.barsLocation = [];

    $scope.beer = {};
    $scope.bar = {};
    $scope.type = {};
    $scope.quantity = {};
    $scope.breweries = {};
    $scope.consumption = {};
    $scope.quantities = [{quantity: "25 cl"}, {quantity: "50 cl"}, {quantity: "1 l"}];

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
                    $scope.bar.selected = ret.model.bar;
                    $scope.$apply();
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
    $scope.getLocation();

    // Gestion des listes
    $scope.refreshBeers = function (beer) {
        var params = {name: beer};
        return $http.get(
            '/api/beer',
            {params: params}
        ).then(function (response) {
                $scope.beers = response.data;
            });
    };
    $scope.refreshBars = function (bar) {
        var params = {name: bar};
        return $http.get(
            '/api/bar',
            {params: params}
        ).then(function (response) {
                $scope.bars = response.data;
                for (var index in $scope.bars) {
                    var bar = $scope.bars[index];
                    $scope.addMarker(bar.latitude, bar.longitude, 'bar', bar._id, bar.nom, bar);
                }
            });
    };
    $scope.refreshTypes = function (type) {
        var params = {name: type};
        return $http.get(
            '/api/type',
            {params: params}
        ).then(function (response) {
                $scope.types = response.data;
            });
    };
    $scope.refreshBreweries = function (brewery) {
        var params = {name: brewery};
        return $http.get(
            '/api/brewery',
            {params: params}
        ).then(function (response) {
                $scope.breweries = response.data;
            });
    };

    // Recherche des bars
    var searchBox = new google.maps.places.SearchBox($('#addressOfBar')[0]);
    google.maps.event.addListener(searchBox, 'places_changed', function () {
        $scope.barsLocation = [];
        var places = searchBox.getPlaces();
        $scope.addMarker(places[0].geometry.location.k, places[0].geometry.location.B, 'bar', places[0].id, places[0].nom);
        $scope.bar.selected.geolocation = places[0].geometry.location.toString();
        $scope.bar.selected.latitude = places[0].geometry.location.k;
        $scope.bar.selected.longitude = places[0].geometry.location.B;
        $scope.$apply();
    });

    // Creation du bar, de la biere et de l'emplacement
    $scope.createBar = function () {
        if ($scope.bar.selected) {
            $http.post('/api/bar', {bar: $scope.bar.selected}).
                success(function (data) {
                    console.log('New bar created');
                    $scope.bar.selected._id = data._id;
                    $scope.addNewBar = false;
                    $scope.message = "New bar created";
                }).
                error(function () {
                    console.log('Error of Created bar');
                    $scope.message = 'Erreur of Created bar';
                });
        }
    };
    $scope.createBeer = function () {
        if ($scope.beer.selected) {
            $http.post('/api/beer', {beer: $scope.beer.selected}).
                success(function (data) {
                    console.log('New beer created');
                    $scope.beer.selected._id = data._id;
                    $scope.addNewBeer = false;
                    $scope.message = "New beer created";
                }).
                error(function () {
                    console.log('Error of Created beer');
                    $scope.message = 'Erreur of Created beer';
                });
        }
    };
    $scope.link = function () {
        if ($scope.bar.selected._id && $scope.beer.selected._id) {
            if (!$scope.bar.selected.consumptions) {
                $scope.bar.selected.consumptions = [];
            }
            $scope.consumption.beer = [];
            var beer={};
            beer.nom = $scope.beer.selected.nom;
            beer.type = $scope.beer.selected.type_id[0].name;
            beer.alcool = $scope.beer.selected.alcool;
            $scope.consumption.beer.push(beer);
            $scope.consumption.price = $scope.price;
            $scope.consumption.quantity = $scope.quantity.selected.quantity;

            $http.put('/api/bar/' + $scope.bar.selected._id, {
                bar: $scope.bar.selected,
                consumption: $scope.consumption
            }).success(function (data) {
                console.log('Consumption add to Bar');
                $scope.bar.selected.consumptions = data;
                $scope.consumption = {};
                $scope.quantity = {};
                $scope.price = "";
                $scope.message = "Ok ! new Consumption created for a bar";
            }).error(function () {
                console.log('Error to add new consumption to a bar');
                $scope.consumption = {};
                $scope.message = 'Error to add new consumption to a bar';
            });
        }
    };

    $scope.changerEtatConsumption = function () {
        $http.put('/api/bar/' + $scope.bar.selected._id + "/consumption", {bar: $scope.bar.selected}).
            success(function () {
                console.log('State change for consumption');
                $scope.message = "State change for consumption";
            }).
            error(function () {
                console.log('Error for change state of consumption');
                $scope.message = 'Error for change state of consumption';
            });
    }
})
;
