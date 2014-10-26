'use strict';

controllers.controller('authController', function($scope,$http,ngDialog){
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


});
