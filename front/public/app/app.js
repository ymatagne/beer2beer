'use strict';


var controllers = angular.module('b2b.controllers', []);

var services = angular.module('b2b.services', []);

var app = angular.module('b2b', ['ngRoute', 'ngDialog', 'duScroll', 'ui.bootstrap', 'b2b.services', 'b2b.controllers']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/templates/index',
        auth:false
    }).when('/controller', {
        templateUrl: '/templates/controller',
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
        $document.scrollToElement(document.getElementById(name), 0, 1000);
    };

    $scope.gotoAddBeer=function(){
        $location.path('/controller');
    };

    $scope.exit = function(){

    };

});
;'use strict';

controllers.controller('homeController', function($scope){
	$scope.beer = 'Leffe';
});