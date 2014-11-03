'use strict';


var services = angular.module('b2b.services', []);

var controllers = angular.module('b2b.controllers', []);

var app = angular.module('b2b', ['b2b.services', 'b2b.controllers', 'ngDialog', 'duScroll', 'ui.bootstrap']);

/*app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/views/index.html'
    }).when('/beers', {
        templateUrl: '/views/beers.html'
    }).otherwise({ redirectTo: '/'});
}
]);*/

app.run(function ($rootScope, Auth) {
    $rootScope.$watch('currentUser', function (currentUser) {
        if (!currentUser) {
            Auth.currentUser();
        }
    })
});
