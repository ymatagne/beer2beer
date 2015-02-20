var Beer = require('../models/beer');

/*
 Description: Get beers
 Method: GET
 Output: JSON
 */
module.exports.getBeers = function (req, res) {
    Beer.find({'nom': new RegExp('.*' + req.query.name + '.*', "i")}).limit(100).populate('brewery_id').populate('type_id').exec(function (err, docs) {
        if (err) {
            res.send(err);
            return;
        }
        res.json(docs);
    });
};

/*
 Description: Get beers
 Method: GET
 Output: JSON
 */
module.exports.getBeerWithParams = function (req, res) {
    if (req.query.type_id) {
        Beer.find()
            .where('nom', new RegExp('.*' + req.query.name + '.*', "i"))
            .where('type_id').all(req.query.type_id)
            .limit(100)
            .exec(function (err, docs) {
                res.json(docs);
            });
    } else {
        Beer.find()
            .where('nom', new RegExp('.*' + req.query.name + '.*', "i"))
            .limit(100)
            .exec(function (err, docs) {
                res.json(docs);
            });
    }
};

/*
 Description: Get beer
 Method: GET
 Output: JSON
 */
module.exports.getBeerById = function (req, res) {
    Beer.findById(req.params.beer_id, function (err, doc) {
        if (err) {
            res.send(err);
            return null;
        }
        res.json(doc);
    });
};

/*
 Description: Save beer
 Method: POST
 Output: JSON
 */
module.exports.saveBeer = function (req, res) {
    var body = req.body.params.beer;


    var beer = new Beer({
        type_id: body.type_id,
        alcool: body.alcool,
        nom: body.nom
    });
    if (body.brewery_id) {
        beer.brewery_id = body.brewery_id[0]._id;
    }


    beer.save(function (err, beer) {
        if (err) return console.log(err);
        res.json(beer);
    });
};

module.exports.setBeer = function (fakeBeer) {
    Beer = fakeBeer;
};
