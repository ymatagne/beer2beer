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
        findByIdStub;
    beforeEach(function(){
        fakeReq = {query: {name: ''}};
        fakeRes = {send: function(){}, json: function(){}};
        fakeBeer = {find: function(){}, findById: function(){}};

        beerController.setBeer(fakeBeer);

        sendStub = sinon.stub(fakeRes, 'send');
        jsonStub = sinon.stub(fakeRes, 'json');
        findStub = sinon.stub(fakeBeer, 'find');
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
                findCall = findStub.callsArgWith(1, error);

            beerController.json_beer_query(fakeReq, fakeRes);

            assert.equal(findCall.called, true);
            assert.equal(sendStub.calledWith(error), true);
        });
        it('Should return beers as JSON.', function(){
            var beers = [{name: 'Leffe'}],
                findCall = findStub.callsArgWith(1, null, beers);

            beerController.json_beer_query(fakeReq, fakeRes);

            assert.equal(findCall.called, true);
            assert.equal(jsonStub.calledWith(beers), true);
        });
    });
    describe('json_beer_get...', function(){
        it('Should send error when get failed.', function(){
            var error = 'error',
                beerId = 1,
                findCall = findByIdStub.callsArgWith(1, error);
            fakeReq.params = {beer_id: beerId};

            beerController.json_beer_get(fakeReq, fakeRes);

            assert.equal(sendStub.calledWith(error), true);
            assert.equal(findCall.calledWith(beerId), true);
        });
        it('Should return beer as JSON.', function(){
            var beer = {name: 'Rince cochon'},
                beerId = 1,
                findCall = findByIdStub.callsArgWith(1, null, beer);
            fakeReq.params = {beer_id: beerId};

            beerController.json_beer_get(fakeReq, fakeRes);

            assert.equal(jsonStub.calledWith(beer), true);
            assert.equal(findCall.calledWith(beerId), true);
        });
    });
});