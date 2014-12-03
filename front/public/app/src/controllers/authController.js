angular.module('b2b.controllers').controller('authController', function($rootScope, $scope, $location, $document, ngDialog, AuthService){
    $scope.login = function () {
        ngDialog.open(getJsonForOpenDialog('login'));
    };
    $scope.signup = function () {
        ngDialog.open(getJsonForOpenDialog('signup'));
    };
    $scope.register = function (form) {
      AuthService.register($scope.user).then(function() {
              console.log('create user OK');
              $scope.message="Created Users";
              $scope.closeThisDialog();
            }, function() {
              console.log('create user KO');
              $scope.message='Error';
            });
    };

    $scope.submit = function (form) {
        AuthService.login($scope.user.email, $scope.user.password).then(
            function(user) {
                $rootScope.currentUser = user;
                $scope.closeThisDialog();
                $location.path('/');
            }, function(res) {
                $scope.errors = {};
                angular.forEach(res.data.errors, function(error, field) {
                    $scope.errors[field] = error.type;
                });
            });
    };

    $scope.gotoAnchor = function(name) {
        $location.path('/');
        var elementToScrollOn = document.getElementById(name);
        if(elementToScrollOn){
            $document.scrollToElement(elementToScrollOn, 0, 1000);
        }
    };

    $scope.gotoAddBeer=function(){
        $location.path('/admin');
    };

    $scope.exit = function(){
        AuthService.logout().then(function(){
            $rootScope.currentUser = undefined;
            $location.path('/');
        });
    };
});

function getJsonForOpenDialog(templateName){
    return { template: templateName,  plain: false, className: 'ngdialog-theme-default',showClose:true };
}
