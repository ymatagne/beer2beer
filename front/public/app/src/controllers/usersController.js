'use strict';

angular.module('b2b.controllers').controller('usersController', ["$rootScope", "$scope", "ngTableParams", "UserService", function ($rootScope, $scope, ngTableParams, UserService) {

    $scope.roles = ["USER", "ADMIN"];

    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10
    }, {
        total: 0,
        getData: function ($defer, params) {

            UserService.getAllUsers({
                page: params.page(),
                filters: params.filter(),
                perPage: params.parameters().count
            }).then(
                function (data) {
                    params.total(data.total);
                    $defer.resolve(data.users);

                }, function (res) {
                    $scope.errors = {};
                    angular.forEach(res.data.errors, function (error, field) {
                        $scope.errors[field] = error.type;
                    });
                });


        }
    });

    $scope.updateRoleOfUser = function (user, role) {
        var params = {_id: user._id, role: role};
        UserService.updateUser(params).then(
            function (data) {
                $scope.message = "User updated !";
                $scope.tableParams.reload();
            }, function (res) {
                $scope.errors = {};
                angular.forEach(res.data.errors, function (error, field) {
                    $scope.errors[field] = error.type;
                });
            });
    };
    $scope.deleteUser = function (userId) {
        var params = {_id: userId};
        UserService.deleteUser(params).then(
            function (data) {
                $scope.message = "User deleted !";
                $scope.tableParams.reload();
            }, function (res) {
                $scope.errors = {};
                angular.forEach(res.data.errors, function (error, field) {
                    $scope.errors[field] = error.type;
                });
            });
    };

}]);