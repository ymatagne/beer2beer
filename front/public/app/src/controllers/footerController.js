'use strict';

angular.module('b2b.controllers').controller('footerController', ["$translate", "$scope", function ($translate, $scope) {
    $scope.radioModel = $translate.use() ||$translate.preferredLanguage();
    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
    };
}]);