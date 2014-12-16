angular.module('b2b.controllers', []);
angular.module('b2b.services', []);
angular.module('b2b.directives', []);

angular.module('b2b', ['ngRoute', 'ngDialog', 'duScroll', 'ngSanitize', 'ui.bootstrap', 'ui.select', 'uiGmapgoogle-maps','b2b.directives', 'b2b.services', 'b2b.controllers']);



angular.module('b2b').config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/templates/index',
        auth: false
    }).when('/admin', {
        templateUrl: '/templates/menuAdmin',
        auth: true
    }).otherwise({redirectTo: '/'});
}]);

angular.module('b2b').config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'places' // Required for SearchBox.
    });
});

angular.module('b2b').run(function ($rootScope, $location, AuthService) {
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
});
