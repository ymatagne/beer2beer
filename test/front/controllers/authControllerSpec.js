describe('authController...', function(){
	var scope, controller;

	beforeEach(module('b2b.controllers'));

	beforeEach(inject(function($rootScope, $controller){
		scope = $rootScope.$new();
		controller = $controller('authController', {
			$rootScope: $rootScope,
			$scope: scope,
			$http: sinon.stub(),
			$location: sinon.stub(),
			$document: sinon.stub(),
			ngDialog: sinon.stub()
		});
	}));

	it('Should have login method defined.', function(){
		expect(scope.login).to.not.be.undefined;
	});
});