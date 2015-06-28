'use strict';

angular.module('b2b.controllers', []);
angular.module('b2b.services', []);
angular.module('b2b.directives', []);

angular.module('b2b', ['ngRoute', 'ngDialog', 'ngTable', 'duScroll', 'ngSanitize', 'ui.bootstrap', 'ui.select', 'ui.bootstrap-slider', 'pascalprecht.translate', 'uiGmapgoogle-maps', 'b2b.directives', 'b2b.services', 'b2b.controllers']);


angular.module('b2b').config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/templates/index',
        auth: false
    }).when('/admin', {
        templateUrl: '/templates/menuAdmin',
        auth: true
    }).when('/bar', {
        templateUrl: '/templates/menuBar',
        auth: true
    }).when('/users', {
        templateUrl: '/templates/users',
        auth: true
    }).otherwise({redirectTo: '/'});
}]).config(["uiGmapGoogleMapApiProvider", function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        v: '3.17',
        libraries: 'places'
    });
}]).config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('sanitize');
    $translateProvider.useStaticFilesLoader({
        prefix: 'app/src/i18n/messages-',
        suffix: '.json'
    });
    $translateProvider.registerAvailableLanguageKeys(['en', 'fr'], {
        'en_US': 'en',
        'en_UK': 'en',
        'fr_FR': 'fr'
    }).determinePreferredLanguage();
}]).run(["$rootScope", "$location", "AuthService", function ($rootScope, $location, AuthService) {
    $rootScope.$watch('currentUser', function (currentUser) {
        if (!currentUser) {
            AuthService.currentUser().then(function (user) {
                $rootScope.currentUser = user;
            });
        }
    });
    $rootScope.$on('$routeChangeStart', function (event, next) {
        if (next.auth && !$rootScope.currentUser) {
            $location.url('/');
        }
    });
}]);
