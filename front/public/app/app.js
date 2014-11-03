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
;'use strict';

services.factory('Auth', function Auth($rootScope, $http) {
    return {
        currentUser: function() {
             $http.get('/api/auth/loggedin').success(function(user){
                if (user !== '0'){
                   $rootScope.currentUser = user;
                }else {
                    $rootScope.currentUser = null;
                }});

        }
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

    $scope.gotoAnchor = function(name) {
        $document.scrollToElement(document.getElementById(name), 0, 1000);
    };
    $scope.gotoAddBeer=function(){
        $http.get('/api/beer').
        success(function(data, status, headers, config) {
            alert(data);
        }).
        error(function(data, status, headers, config) {
            alert(data);
         });

    }

});
;'use strict';

controllers.controller('searchBeerController', function($scope){
	$scope.beer = 'Leffe';
});