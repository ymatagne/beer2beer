var assert = require('assert'),
	requireHelper = require('../../require_helper'),
	beerController = requireHelper('app/controllers/beerController');
describe('beerController...', function(){
    var sinon = require('sinon'),
        fakereq,
        fakeRes,
        fakeBeer,
        sendStub,
        jsonStub,
        findStub,
        findByIdStub,
        limitStub,
        populateStub,
        execStub;
    beforeEach(function(){
        fakeReq = {query: {name: ''}};
        fakeRes = {send: function(){}, json: function(){}};
        fakeBeer = {find: function(){}, findById: function(){},populate: function(){}, exec: function(){}, limit: function(){}};

        beerController.setBeer(fakeBeer);

        sendStub = sinon.stub(fakeRes, 'send');
        jsonStub = sinon.stub(fakeRes, 'json');
        findStub = sinon.stub(fakeBeer, 'find').returnsThis();
        limitStub = sinon.stub(fakeBeer, 'limit').returnsThis();
        populateStub = sinon.stub(fakeBeer, 'populate').returnsThis();
        execStub = sinon.stub(fakeBeer, 'exec');
        findByIdStub = sinon.stub(fakeBeer, 'findById');
    });
    afterEach(function(){
        findStub.restore();
        sendStub.restore();
        jsonStub.restore();
    });
    describe('json_beer_query...', function(){
        it('Should send error when find failed.', function(){
            var error = 'error',
                execCall = execStub.callsArgWith(0, error);

            beerController.getBeers(fakeReq, fakeRes);

            assert.equal(execCall.called, true);
            assert.equal(sendStub.calledWith(error), true);
        });
        it('Should return beers as JSON.', function(){
            var beers = [{name: 'Leffe'}],
                execCall = execStub.callsArgWith(0, null, beers);

            beerController.getBeers(fakeReq, fakeRes);

            assert.equal(execCall.called, true);
            assert.equal(jsonStub.calledWith(beers), true);
        });
    });
    describe('json_beer_get...', function(){
        it('Should send error when get failed.', function(){
            var error = 'error',
                beerId = 1,
                findCall = findByIdStub.callsArgWith(1, error);
            fakeReq.params = {beer_id: beerId};

            beerController.getBeerById(fakeReq, fakeRes);

            assert.equal(sendStub.calledWith(error), true);
            assert.equal(findCall.calledWith(beerId), true);
        });
        it('Should return beer as JSON.', function(){
            var beer = {name: 'Rince cochon'},
                beerId = 1,
                findCall = findByIdStub.callsArgWith(1, null, beer);
            fakeReq.params = {beer_id: beerId};

            beerController.getBeerById(fakeReq, fakeRes);

            assert.equal(jsonStub.calledWith(beer), true);
            assert.equal(findCall.calledWith(beerId), true);
        });
    });
});