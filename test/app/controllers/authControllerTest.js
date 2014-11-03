var assert = require('assert');
var requireHelper = require('../../require_helper');
var authController = requireHelper('app/controllers/authController');

describe('authController...', function(){
	var sinon = require('sinon'),
		user = {},
		fakeReq,
		fakeRes,
		res;
	beforeEach(function(){
		fakeReq = {user: user, isAuthenticated: function(){}};
		fakeRes = {send: function(){}};
		res = sinon.stub(fakeRes, 'send');
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
});