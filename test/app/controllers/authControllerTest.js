var assert = require('assert'),
	requireHelper = require('../../require_helper'),
	authController = requireHelper('app/controllers/authController');

describe('authController...', function(){
	var sinon = require('sinon'),
		passport = require('passport'),
		mockPassport,
		user = {},
		fakeReq,
		fakeRes,
		res;
	beforeEach(function(){
		fakeReq = {user: user, body: {}, isAuthenticated: function(){}, logIn: function(){}, logout: function(){}};
		fakeRes = {send: function(){}, json: function(){}, redirect: function(){}};
		res = sinon.stub(fakeRes, 'send');
		mockPassport = sinon.mock(passport);
		authController.setPassport(mockPassport);
	});
	it('Should detect user is logged in when is authenticated.', function(){
		var req = sinon.stub(fakeReq, 'isAuthenticated').returns(true);

		authController.loggedin(fakeReq, fakeRes);

		assert.equal(req.called, true);
		assert.equal(res.calledWith(user), true);
	});
	it('Should detect user is not logged in when is not authenticated.', function(){
		var req = sinon.stub(fakeReq, 'isAuthenticated').returns(false);

		authController.loggedin(fakeReq, fakeRes);

		assert.equal(req.called, true);
		assert.equal(res.calledWith('0'), true);
	});
	it('Should authenticate user with local base error on authenticate', function(){
		var error = {};
		res = sinon.stub(fakeRes, 'json');
		mockPassport.expects('authenticate').returns(function(){authController.manageAuthLocal(fakeReq, fakeRes, {}, user, null)});

		authController.auth_local(fakeReq, fakeRes, null);

		assert.equal(res.calledWith(400, error), true);
		mockPassport.verify();
	});
	it('Should authenticate user with local base error on request user login', function(){
		var error = 'error',
			callback = function(){authController.manageUserLogin(fakeReq, fakeRes, error);};
		req = sinon.stub(fakeReq, 'logIn');
		mockPassport.expects('authenticate').returns(function(){authController.manageAuthLocal(fakeReq, fakeRes, null, user, null);});

		authController.auth_local(fakeReq, fakeRes, null);

		assert.equal(req.called, true);
		callback();
		assert.equal(res.calledWith(error), true);
		mockPassport.verify();
	});
	it('Should authenticate user with local base success !!', function(){
		var callback = function(){authController.manageUserLogin(fakeReq, fakeRes, null);};
		req = sinon.stub(fakeReq, 'logIn');
		mockPassport.expects('authenticate').returns(function(){authController.manageAuthLocal(fakeReq, fakeRes, null, user, null);});

		authController.auth_local(fakeReq, fakeRes, null);

		assert.equal(req.called, true);
		callback();
		assert.equal(res.calledWith(user), true);
		mockPassport.verify();
	});
	it('Should respond 400 error code when try to logout and not logged in.', function(){
		authController.logout(fakeReq, fakeRes);

		assert.equal(res.calledWith(400, 'Not logged in'), true);
	});
	it('Should redirect to "/" when calling logout and logged in.', function(){
		var req = sinon.stub(fakeReq, 'isAuthenticated').returns(true),
			logoutCall = sinon.stub(fakeReq, 'logout');
		res = sinon.stub(fakeRes, 'redirect');

		authController.logout(fakeReq, fakeRes);

		assert.equal(req.called, true);
		assert.equal(logoutCall.called, true);
		assert.equal(res.calledWith('/'), true);
	});
	it('Should return error 400 as JSON on user save error.', function(){
		var err = {},
			fakeUser = {
                save: function() {
                	authController.manageUserSave(fakeReq, fakeRes, user, err);
                }
            },
            User = (function() {
                console.log('User instance creation');
                return fakeUser;
            });

		authController.setUser(User);		

		res = sinon.stub(fakeRes, 'json');

		authController.auth_create(fakeReq, fakeRes);

		assert.equal(res.calledWith(400, err), true);
	});
});