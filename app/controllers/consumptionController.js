var Consumption = require('../models/consumption');
var Beer = require('../models/beer');
var Type = require('../models/type');


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