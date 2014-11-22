'use strict';

controllers.controller('searchBeerController', function($scope){
    $scope.markers = [];
    $scope.map = { center: { latitude: 0, longitude: 0 }, zoom: 15 };

    $scope.showPosition = function (position) {
            $scope.map.center.latitude = position.coords.latitude;
            $scope.map.center.longitude= position.coords.longitude;
            $scope.addMarker(position.coords.latitude,position.coords.longitude);
    };

    $scope.addMarker = function (latitude,longitude) {
        $scope.markers.push({
            uid:123,
            provider: "test",
            name: "It's you",
            latitude: latitude,
            longitude: longitude
        });
    };

    $scope.showError = function (error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                $scope.error = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                $scope.error = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                $scope.error = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                $scope.error = "An unknown error occurred."
                break;
        }
        $scope.$apply();
    };

    $scope.getLocation = function () {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
                }
                else {
                    $scope.error = "Geolocation is not supported by this browser.";
                }
            }

        $scope.getLocation();
});
