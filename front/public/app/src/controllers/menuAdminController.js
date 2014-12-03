angular.module('b2b.controllers').controller('menuAdminController', function ($scope, $http) {
    $scope.map = {center: {latitude: 0, longitude: 0}, zoom: 15};
    $scope.myLocation = [];
    $scope.barsLocation = [];

    $scope.beer = {};
    $scope.bar = {};
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
                    $scope.bar.selected=ret.model.bar;
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

    $scope.toto = function () {
        console.log('ok');
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
    $scope.saveBarAndBeer = function () {
        if ($scope.bar.selected && $scope.beer.selected) {
            if (!$scope.bar.selected.beers) {
                $scope.bar.selected.beers = [];
            }
            $scope.bar.selected.beers.push($scope.beer.selected);
            if ($scope.bar.selected._id) {
                $http.put('/api/bar/' + $scope.bar.selected._id, {bar: $scope.bar.selected}).
                    success(function (data, status, headers, config) {
                        console.log('New bar created');
                        $scope.bar.selected._id = data._id;
                        $scope.message = "New bar created";
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Erreur of Created bar');
                        $scope.message = 'Erreur of Created bar';
                    });
            } else {
                $http.post('/api/bar', {bar: $scope.bar.selected}).
                    success(function (data, status, headers, config) {
                        console.log('New bar created');
                        $scope.bar.selected._id = data._id;
                        $scope.message = "New bar created";
                    }).
                    error(function (data, status, headers, config) {
                        console.log('Erreur of Created bar');
                        $scope.message = 'Erreur of Created bar';
                    });
            }
        }
    }
});
