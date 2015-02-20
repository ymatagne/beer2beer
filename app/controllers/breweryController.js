var Brewery = require('../models/brewery');

/*
 Description: Get breweries
 Method: GET
 Output: JSON
 */
module.exports.getBreweries = function (req, res) {
    Brewery.find({'name': new RegExp('.*' + req.query.name + '.*', "i")}, {}, {limit: 100}, function (err, docs) {
        if (err) {
            res.send(err);
            return null;
        }
        res.json(docs);
    });
};