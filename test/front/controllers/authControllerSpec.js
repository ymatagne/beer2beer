describe('authController...', function(){
	var scope, controller, ngDialogOpenCall, locationCall, scrollToElementCall;

	beforeEach(module('b2b.controllers'));

	beforeEach(inject(function($rootScope, $controller){
		scope = $rootScope.$new();

		var fakeNgDialog = {open: function(){}};
		ngDialogOpenCall = sinon.stub(fakeNgDialog, 'open');

		var fakeLocation = {path: function(){}};
		locationCall = sinon.stub(fakeLocation, 'path');

		var fakeDocument = {scrollToElement: function(){}};
		scrollToElementCall = sinon.stub(fakeDocument, 'scrollToElement');

		controller = $controller('authController', {
			$rootScope: $rootScope,
			$scope: scope,
			$location: fakeLocation,
			$document: fakeDocument,
			ngDialog: fakeNgDialog,
			AuthService: sinon.stub()
		});
	}));
	
	it('Should call "path(\'/\')" on $location when calling "gotoAnchor".', function(){
		scope.gotoAnchor();

		assert.isTrue(locationCall.calledWith('/'), '$location.path() called with "/".');
	});

	it('Should not call "scrollToElement(...)" on $document when calling "gotoAnchor" and element by id not found.', function(){
		scope.gotoAnchor('idElement');

		assert.isFalse(scrollToElementCall.called, '$document.scrollToElement() called with element id.');
	});

	it('Should call "scrollToElement(...)" on $document when calling "gotoAnchor".', function(){
		var elementExpected = {};
		sinon.stub(document, 'getElementById').returns(elementExpected);

		scope.gotoAnchor('idElement');

		assert.isTrue(scrollToElementCall.calledWith(elementExpected, 0, 1000), '$document.scrollToElement() called with element found.');
	});

	it('Should call "path(\'/admin\')" on $location when calling "gotoAddBeer".', function(){
		scope.gotoAddBeer();

		assert.isTrue(locationCall.calledWith('/admin'), '$location.path() called with "/admin".');
	});
});