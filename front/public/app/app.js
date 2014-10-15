'use strict';

var app = angular.module('b2b', ['b2b.controllers']);

var controllers = angular.module('b2b.controllers', []);;'use strict';

controllers.controller('searchBeerController', function($scope){
	$scope.beer = 'Leffe';
});