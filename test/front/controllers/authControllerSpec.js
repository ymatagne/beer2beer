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

	it('Should open "ngDialog" when call "login" method.', function(){
		scope.login();

		assert.isTrue(ngDialogOpenCall.called, 'ngDialog.open has been called');
        assert.isTrue(ngDialogOpenCall.calledWith(getJsonForOpenDialog('login')), 'ngDialog.open has been called with correct args');
	});
	it('Should open "ngDialog" when call "signup" method.', function(){
		scope.signup();

		assert.isTrue(ngDialogOpenCall.called, 'ngDialog.open has been called');
        assert.isTrue(ngDialogOpenCall.calledWith(getJsonForOpenDialog('signup')), 'ngDialog.open has been called with correct args');
	});

	it('Should call "path(\'/\')" on $location when calling "gotoAnchor".', function(){
		scope.gotoAnchor();

		assert.isTrue(locationCall.calledWith('/'), '$location.path() called with "/".');
	});

	it('Should call "scrollToElement(...)" on $document when calling "gotoAnchor".', function(){
		scope.gotoAnchor('idElement');

		assert.isTrue(scrollToElementCall.calledWith(document.getElementById('idElement'), 0, 1000), '$document.scrollToElement() called with element id.');
	});

	it('Should call "path(\'/admin\')" on $location when calling "gotoAddBeer".', function(){
		scope.gotoAddBeer();

		assert.isTrue(locationCall.calledWith('/admin'), '$location.path() called with "/admin".');
	});
});