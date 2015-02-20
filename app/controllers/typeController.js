var Type = require('../models/type');

/*
 Description: Get beers
 Method: GET
 Output: JSON
 */
module.exports.getTypes = function (req, res) {
    Type.find({'name': new RegExp('.*' + req.query.name + '.*', "i")}, {}, {limit: 100}, function (err, docs) {
        if (err) {
            res.send(err);
            return null;
        }
        res.json(docs);
    });
};