'use strict';

var controllers = angular.module('b2b.controllers', []),
    services = angular.module('b2b.services', []);

var app = angular.module('b2b', ['ngRoute', 'ngDialog', 'duScroll','ngSanitize','ui.bootstrap','ui.select','uiGmapgoogle-maps', 'b2b.services', 'b2b.controllers']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/templates/index',
        auth:false
    }).when('/admin', {
        templateUrl: '/templates/menuAdmin',
        auth:true
    }).otherwise({ redirectTo: '/'});

}]);

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'places' // Required for SearchBox.
    });
});
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
