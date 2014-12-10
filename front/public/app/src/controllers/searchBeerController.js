angular.module('b2b.controllers').controller('searchBeerController', function ($scope, $http) {
    $scope.myLocation = [];
    $scope.barsLocation = [];
    $scope.map = {center: {latitude: 0, longitude: 0}, zoom: 15};


    $scope.beer = {};
    $scope.bar = {};
    $scope.type = {};

    $scope.showPosition = function (position) {
        $scope.map.center.latitude = position.coords.latitude;
        $scope.map.center.longitude = position.coords.longitude;
        $scope.addMarker(position.coords.latitude, position.coords.longitude, 'position', 0);
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


    $scope.refreshBeersList = function ($item) {
        var params = {type_id: $item._id};
        return $http.get('/api/beer', {params: params}
        ).then(function (response) {
                $scope.beer= {};
                $scope.beers = response.data;
            });
    };

    $http.get('/api/bar', {}).then(function (response) {
        var bars = response.data;
        for (var index in bars) {
            var bar = bars[index];
            $scope.addMarker(bar.latitude, bar.longitude, 'bar', bar._id);
        }
    });

    $scope.searchBeer = function () {
        var bar;
        var beer;
        var type;
        if ($scope.bar.selected) {
            bar = $scope.bar.selected._id;
        }
        if ($scope.beer.selected) {
            beer = $scope.beer.selected._id;
        }
        if ($scope.type.selected) {
            type = $scope.type.selected._id;
        }

        var params = {bar: bar, type: type, beer: beer};

        $http.get('/api/bar/all', {params: params}).then(function (response) {
            var bars = response.data;
            $scope.barsLocation = [];
            for (var index in bars) {
                var bar = bars[index];
                $scope.addMarker(bar.latitude, bar.longitude, 'bar', bar._id, bar.nom, bar);
            }
        });
    };
    $scope.getLocation();
});
