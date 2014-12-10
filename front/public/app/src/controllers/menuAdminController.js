angular.module('b2b.controllers').controller('menuAdminController', function ($scope, $http) {
    $scope.map = {center: {latitude: 0, longitude: 0}, zoom: 15};
    $scope.myLocation = [];
    $scope.barsLocation = [];
    $scope.searchLocation = [];

    $scope.beer = {};
    $scope.bar = {};
    $scope.type = {};
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
        }else if (type === 'search') {
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
        }
        else {
            $scope.message = "Geolocation is not supported by this browser.";
        }
    };
    $scope.showError = function (error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                $scope.message = "User denied the request for Geolocation.";
                break;
            case error.POSITION_UNAVAILABLE:
                $scope.message = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                $scope.message = "The request to get user location timed out.";
                break;
            case error.UNKNOWN_ERROR:
                $scope.message = "An unknown error occurred.";
                break;
        }
        $scope.$apply();
    };
    $scope.getLocation();
    $scope.gotoBar= function ($item, $model){
        $scope.map.center.latitude = $item.latitude;
        $scope.map.center.longitude = $item.longitude;
    };

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
        var places = searchBox.getPlaces();
        $scope.searchLocation=[];
        $scope.addMarker(places[0].geometry.location.k, places[0].geometry.location.B, 'search', places[0].id, places[0].nom, $scope.newBar);
        $scope.newBar.geolocation = places[0].geometry.location.toString();
        $scope.newBar.latitude = places[0].geometry.location.k;
        $scope.newBar.longitude = places[0].geometry.location.B;
        $scope.$apply();
    });

    // Creation du bar, de la biere et de l'emplacement
    $scope.createBar = function () {
        if ($scope.newBar) {
            $http.post('/api/bar', {bar: $scope.newBar}).
                success(function () {
                    $scope.refreshBars('');
                    $scope.addNewBar = false;
                    $scope.searchLocation=[];
                    $scope.message = 'You have added a new bar !';
                }).
                error(function () {
                    $scope.message = 'Error when adding a new bar :(';
                });
        }
    };

    $scope.createBeer = function () {
        if ($scope.newBeer) {
            $http.post('/api/beer', {beer: $scope.newBeer}).
                success(function () {
                    $scope.refreshBeers('');
                    $scope.addNewBeer = false;
                    $scope.message = "You have added a new beer !";
                }).
                error(function () {
                    $scope.message = 'Error when adding a new beer :(';
                });
        }
    };
    $scope.link = function () {
        if ($scope.bar.selected._id && $scope.beer.selected._id) {
            if (!$scope.bar.selected.consumptions) {
                $scope.bar.selected.consumptions = [];
            }
            $scope.consumption.beer = [];
            var beer = {};
            beer.nom = $scope.beer.selected.nom;
            beer.type = $scope.beer.selected.type_id[0].name;
            beer.alcool = $scope.beer.selected.alcool;
            $scope.consumption.beer.push(beer);
            $scope.consumption.beer_id=$scope.beer.selected._id
            $scope.consumption.type_id=$scope.beer.selected.type_id[0]._id;
            $scope.consumption.price = $scope.price;
            $scope.consumption.quantity = $scope.quantity.selected.quantity;

            $http.put('/api/bar/' + $scope.bar.selected._id, {
                bar: $scope.bar.selected,
                consumption: $scope.consumption
            }).success(function (data) {
                $scope.bar.selected.consumptions = data;
                $scope.consumption = {};
                $scope.beer = {};
                $scope.quantity = {};
                $scope.price = "";
                $scope.message = "Ok ! new Consumption created for a bar";
            }).error(function () {
                $scope.consumption = {};
                $scope.message = 'Error to add new consumption to a bar';
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
    $scope.changerEtatConsumption = function () {
        $http.put('/api/bar/' + $scope.bar.selected._id + "/consumption", {bar: $scope.bar.selected}).
            success(function () {
                $scope.message = 'Consumption has changed state';
            }).
            error(function () {
                $scope.message = 'Error status of consumption change';
            });
    }
})
;
