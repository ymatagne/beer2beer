angular.module('b2b.controllers').controller('menuBarController', function ($scope,$route, BarService, BeerService, TypeService, BreweryService, $controller) {
    $.extend(this, $controller('rechercheController', {$scope: $scope}));
    $scope.getLocation();

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

    $scope.gotoBar = function ($item, $model) {
        $scope.showBeerInBar($item._id);
        $scope.map.center.latitude = $item.latitude;
        $scope.map.center.longitude = $item.longitude;
    };


    $scope.showBeerInBar = function (id) {
        var params = {id: id};
        BeerService.getBeerByParams(params).then(
            function (data) {
                $scope.bar = data;
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
        $scope.addMarker(places[0].geometry.location.lat(), places[0].geometry.location.lng(), 'search', places[0].id, places[0].nom, $scope.bar);
        $scope.bar.geolocation = places[0].geometry.location.toString();
        $scope.bar.latitude = places[0].geometry.location.lat();
        $scope.bar.longitude = places[0].geometry.location.lng();
        $scope.$apply();
    });

    $scope.changerEtatConsumption = function (consumption) {
        consumption.enable = !consumption.enable;
    };

    $scope.deleteConsumption = function (consumption) {
        var index = $scope.bar.consumptions.indexOf(consumption)
        $scope.bar.consumptions.splice(index, 1);
    };

    $scope.updateBar = function (bar) {
        var params = {bar: bar};

        BarService.updateBar(params).then(
            function (data) {
                $route.reload();
            }, function (res) {
                $scope.errors = {};
                angular.forEach(res.data.errors, function (error, field) {
                    $scope.errors[field] = error.type;
                });
            });
    };
});
