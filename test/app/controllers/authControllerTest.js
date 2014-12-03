var assert = require('assert'),
	requireHelper = require('../../require_helper'),
	authController = requireHelper('app/controllers/authController');

describe('authController...', function(){
	var sinon = require('sinon'),
		passport = require('passport'),
		user = {},
		fakeReq,
		fakeRes,
		sendStub,
		authenticateStub;
	beforeEach(function(){
		authController.setPassport(passport);
		fakeReq = {user: user, body: {}, isAuthenticated: function(){}, logIn: function(){}, logout: function(){}};
		fakeRes = {send: function(){}, status: function(){}, json: function(){}, redirect: function(){}};
		sendStub = sinon.stub(fakeRes, 'send');
		authenticateStub = sinon.stub(passport, 'authenticate');
	});
	afterEach(function(){
		authenticateStub.restore();
		sendStub.restore();
	});
	describe('loggedin...', function(){
		it('Should detect user is logged in when is authenticated.', function(){
			var req = sinon.stub(fakeReq, 'isAuthenticated').returns(true);

			authController.loggedin(fakeReq, fakeRes);

			assert.equal(req.called, true);
			assert.equal(sendStub.calledWith(user), true);
		});
		it('Should detect user is not logged in when is not authenticated.', function(){
			var req = sinon.stub(fakeReq, 'isAuthenticated').returns(false);

			authController.loggedin(fakeReq, fakeRes);

			assert.equal(req.called, true);
			assert.equal(sendStub.calledWith('0'), true);
		});
	});
	describe('auth_local...', function(){
		it('Should return json with 400 http code on error.', function(){
			var error = {},
				authCall = authenticateStub.callsArgWith(1, {}, user, null),
				authStubReturn = authenticateStub.returns(function(){}),
				statusStub = sinon.stub(fakeRes, 'status').returnsThis(),
				jsonStub = sinon.stub(fakeRes, 'json');

			authController.auth_local(fakeReq, fakeRes, null);

			assert.equal(statusStub.calledWith(400), true);
			assert.equal(jsonStub.calledWith(error), true);
			assert.equal(authCall.called, true);
			assert.equal(authStubReturn.called, true);
		});
		it('Should send error on request user login fail.', function(){
			var error = 'error',
				authCall = authenticateStub.callsArgWith(1, null, user, null),
				authStubReturn = authenticateStub.returns(function(){});
			req = sinon.stub(fakeReq, 'logIn').callsArgWith(1, error);

			authController.auth_local(fakeReq, fakeRes, null);

			assert.equal(req.called, true);
			assert.equal(sendStub.calledWith(error), true);
			assert.equal(authCall.called, true);
			assert.equal(authStubReturn.called, true);
		});
		it('Should login user with success if everything is cool.', function(){
			var authCall = authenticateStub.callsArgWith(1, null, user, null),
				authStubReturn = authenticateStub.returns(function(){});
			req = sinon.stub(fakeReq, 'logIn').callsArg(1);

			authController.auth_local(fakeReq, fakeRes, null);

			assert.equal(req.called, true);
			assert.equal(sendStub.calledWith(user), true);
			assert.equal(authCall.called, true);
			assert.equal(authStubReturn.called, true);
		});
	});
	describe('logout...', function(){
		it('Should respond 400 error code when not logged in.', function(){
			authController.logout(fakeReq, fakeRes);

			assert.equal(sendStub.calledWith(400, 'Not logged in'), true);
		});
		it('Should redirect to "/" when logged in.', function(){
			var req = sinon.stub(fakeReq, 'isAuthenticated').returns(true),
				logoutCall = sinon.stub(fakeReq, 'logout');
			redirectStub = sinon.stub(fakeRes, 'redirect');

			authController.logout(fakeReq, fakeRes);

			assert.equal(req.called, true);
			assert.equal(logoutCall.called, true);
			assert.equal(redirectStub.calledWith('/'), true);
		});
	});
	describe('auth_create...', function(){
		it('Should return error 400 as JSON on save error.', function(){
			var err = {},
				fakeUser = {save: function() {}},
				User = (function() {
					return fakeUser;
					}),
				statusStub = sinon.stub(fakeRes, 'status').returnsThis(),
				jsonStub = sinon.stub(fakeRes, 'json');

			authController.setUser(User);
			saveCall = sinon.stub(fakeUser, 'save').callsArgWith(0, err);


			authController.auth_create(fakeReq, fakeRes);

			assert.equal(statusStub.calledWith(400), true);
			assert.equal(jsonStub.calledWith(err), true);
			assert.equal(saveCall.called, true);
		});
		it('Should return created user as json on creation success.', function(){
			var fakeUser = {save: function() {}},
				User = (function() {
					return fakeUser;
				}),
				statusStub = sinon.stub(fakeRes, 'status').returnsThis(),
				jsonStub = sinon.stub(fakeRes, 'json');

			authController.setUser(User);
			logInCall = sinon.stub(fakeReq, 'logIn').callsArg(1);
			saveCall = sinon.stub(fakeUser, 'save').callsArg(0);

			authController.auth_create(fakeReq, fakeRes);

			assert.equal(jsonStub.calledWith(fakeUser), true);
			assert.equal(logInCall.called, true);
			assert.equal(saveCall.called, true);
		});
	});
});