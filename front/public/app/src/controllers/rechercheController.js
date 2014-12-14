angular.module('b2b.controllers').controller('rechercheController', function($scope){

    $scope.map = {center: {latitude: 0, longitude: 0}, zoom: 15};
    $scope.myLocation = [];
    $scope.barsLocation = [];
    $scope.searchLocation = [];

    var showPosition = function (position) {
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
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            $scope.message = undefined;
            $scope.error = "Geolocation is not supported by this browser.";
        }
    };

    var showError = function (error) {
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
    };
});
