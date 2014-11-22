'use strict';


var controllers = angular.module('b2b.controllers', []);

var services = angular.module('b2b.services', []);

var app = angular.module('b2b', ['ngRoute', 'ngDialog', 'duScroll', 'ui.bootstrap','google-maps'.ns(), 'b2b.services', 'b2b.controllers']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/templates/index',
        auth:false
    }).when('/admin', {
        templateUrl: '/templates/menuAdmin',
        auth:true
    }).otherwise({ redirectTo: '/'});
}
]);

app.run(function ($rootScope,$location, Auth) {
    $rootScope.$watch('currentUser', function (currentUser) {
        if (!currentUser) {
            Auth.currentUser();
        }
    });
    $rootScope.$on('$routeChangeStart', function (event,next) {
        if(next.auth && !$rootScope.currentUser){
            $location.url('/');
        }
    });
});
;'use strict';

services.factory('Auth', function Auth($rootScope, $http) {
    return {
        currentUser: function() {
             $http.get('/api/auth/loggedin').success(function(user){
                if (user !== '0'){
                   $rootScope.currentUser = user;
                }});

        },
    }
});
;'use strict';

controllers.controller('authController', function($rootScope,$scope,$http,$location,$document,ngDialog){
    $scope.login = function () {
        ngDialog.open({ template: 'login',  plain: false, className: 'ngdialog-theme-default',showClose:true });
    };
    $scope.signup = function () {
        ngDialog.open({ template: 'signup',  plain: false, className: 'ngdialog-theme-default',showClose:true });
    };
    $scope.register = function (form) {
      $http.post('/api/auth/create', {user:$scope.user}).
            success(function(data, status, headers, config) {
              console.log('create user OK');
              $scope.message="Created Users";
              $scope.closeThisDialog();
            }).
            error(function(data, status, headers, config) {
              console.log('create user KO');
              $scope.message='Error';
            });

    };

    $scope.submit = function (form) {
      $http.post('/api/auth/local', {email:$scope.user.email,password:$scope.user.password}).
            success(function(data, status, headers, config) {
                $rootScope.currentUser = data;
                $scope.closeThisDialog();
                $location.path('/');
            }).
            error(function(data, status, headers, config) {
              $scope.errors = {};
              angular.forEach(data.errors, function(error, field) {
                $scope.errors[field] = error.type;
              });
            });
    };

    $scope.gotoAnchor = function(name) {
        $location.path('/');
        $document.scrollToElement(document.getElementById(name), 0, 1000);
    };

    $scope.gotoAddBeer=function(){
        $location.path('/admin');
    };

    $scope.exit = function(){
        $http.get('/api/auth/logout').
            success(function() {
                $rootScope.currentUser = undefined;
                $location.path('/');
            });
    };

});
;'use strict';

controllers.controller('homeController', function($scope){
	$scope.beer = 'Leffe';
});;'use strict';

controllers.controller('menuAdminController', function($scope){
    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

});
;'use strict';

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
