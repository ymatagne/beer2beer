angular.module('b2b.controllers').controller('footerController', function ($translate, $scope) {
    $scope.radioModel = $translate.use() ||$translate.preferredLanguage();
    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
    };
});