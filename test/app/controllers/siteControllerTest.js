var assert = require('assert'),
	requireHelper = require('../../require_helper'),
	siteController = requireHelper('app/controllers/siteController');

describe('siteControllerTest...', function(){
    var sinon = require('sinon'),
        fakeReq,
        fakeRes,
        renderStub;
    beforeEach(function(){
        fakeReq = {};
        fakeRes = {render: function(){}};

        renderStub = sinon.stub(fakeRes, 'render');
    });
    afterEach(function(){
        renderStub.restore();
    });
    it('Should render index.', function(){
        siteController.index(fakeReq, fakeRes);

        assert.equal(renderStub.calledWith('index'), true);
    });
    it('Should render template with name in request params.', function(){
        var templateName = 'toto';
        fakeReq.params = {name: templateName};

        siteController.partials(fakeReq, fakeRes);

        assert.equal(renderStub.calledWith('templates/' + templateName), true);
    });
});