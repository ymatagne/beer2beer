'use strict';

var app = angular.module('b2b', ['b2b.services','b2b.controllers','ngDialog','duScroll','ui.bootstrap']);

var services = angular.module('b2b.services', []);

var controllers = angular.module('b2b.controllers', []);


;'use strict';

services.service('auth', function () {
    var currentUser = {
        user: null,
        init: function (user) {
            this.user = user;
        },

        isAuth: function () {
            return this.user!==null;
        }
    };
    return currentUser;
});
;'use strict';

controllers.controller('authController', function($scope,$http,$location,$document,ngDialog,auth){
    $scope.Auth=auth;
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
                $scope.Auth.init(data);
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


});
;'use strict';

controllers.controller('searchBeerController', function($scope){
	$scope.beer = 'Leffe';
});