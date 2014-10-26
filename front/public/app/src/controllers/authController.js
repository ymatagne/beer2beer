'use strict';

controllers.controller('authController', function($scope,$http,$location, ngDialog){
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
});
