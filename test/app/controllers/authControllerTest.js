var assert = require('assert');
var requireHelper = require('../../require_helper');
var authController = requireHelper('app/controllers/authController');

describe('authController...', function(){
	var sinon = require('sinon'),
		passport = require('passport'),
		mockPassport,
		user = {},
		fakeReq,
		fakeRes,
		res;
	beforeEach(function(){
		fakeReq = {user: user, isAuthenticated: function(){}, logIn: function(){}};
		fakeRes = {send: function(){}, json: function(){}};
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
});