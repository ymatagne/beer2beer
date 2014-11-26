'use strict';

controllers.controller('authController', function($rootScope,$scope,$http,$location,$document,ngDialog){
    $scope.login = function () {
        ngDialog.open(getJsonForOpenDialog('login'));
    };
    $scope.signup = function () {
        ngDialog.open(getJsonForOpenDialog('signup'));
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

function getJsonForOpenDialog(templateName){
    return { template: templateName,  plain: false, className: 'ngdialog-theme-default',showClose:true };
}
