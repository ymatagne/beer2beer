var Consumption = require('../models/consumption');
var Beer = require('../models/beer');
var Type = require('../models/type');

/*
 Description: Save Consumption
 Method: POST
 Output: JSON
 */
module.exports.json_consumption_save = function (req, res) {
    var body = req.body.consumption;

    var consumption = new Consumption({
        beer_id: body.beer_id,
        price: body.price,
        enable: false
    });

    consumption.save(function (err, consumption) {
        if (err) return console.log(err);
        Beer.populate(consumption, {
            path: 'beer_id'
        }, function (err, docs) {
            Type.populate(docs, {
                path: 'beer_id.type_id'
            }, function (err, docs) {
                res.json(docs);
            });
        });
    });
};

/*
 Description: Update Consumption
 Method: PUT
 Output: JSON
 */
module.exports.json_consumption_update = function (req, res) {
    var consum = req.body.consumption;
    consum.enable=!req.body.consumption.enable;

    var consumption = new Consumption({
        _id: consum._id
    });
    consumption.update({enable: consum.enable}, function (err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(consum));
        res.json(consum);
    });
};