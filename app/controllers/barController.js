var Bar = require('../models/bar');
var Beer = require('../models/beer');
var Type = require('../models/type');
var Consumption = require('../models/consumption');

/*
 Description: Get bars
 Method: GET
 Output: JSON
 */
module.exports.json_bar_query = function (req, res) {
    Bar.find(function (err, docs) {
        if (err) {
            res.send(err);
            return null;
        }
    }).populate('consumptions').exec(function (err, docs) {
        Beer.populate(docs, {
            path: 'consumptions.beer_id'
        }, function (err, docs) {
            Type.populate(docs, {
                path: 'consumptions.beer_id.type_id'
            }, function (err, docs) {
                res.json(docs);
            });
        });

    })

};

/*
 Description: Save bars
 Method: POST
 Output: JSON
 */
module.exports.json_bar_save = function (req, res) {
    var body = req.body.bar;


    var bar = new Bar({
        adresse: body.adresse,
        geolocation: body.geolocation,
        latitude: body.latitude,
        longitude: body.longitude,
        nom: body.nom
    });

    bar.save(function (err, bar) {
        if (err) return console.log(err);
        res.json(bar);
    });
};

/*
 Description: Update bar
 Method: PUT
 Output: JSON
 */
module.exports.json_bar_update = function (req, res) {
    var body = req.body.bar;
    var consum = req.body.consumption;
    var consumptions=[];

    for(idx=0;idx<consum.length;idx++){
        consumptions.push(consum[idx]._id);
    }


    var bar = new Bar({
        _id: body._id,
        adresse: body.adresse,
        geolocation: body.geolocation,
        latitude: body.latitude,
        longitude: body.longitude,
        nom: body.nom,
        consumptions: consumptions
    });
    bar.update({consumptions: consumptions}, function () {
        Beer.populate(consum, {
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
 Description: Get all bars
 Method: GET
 Output: JSON
 */
module.exports.json_bar_all = function (req, res) {
    var params=req.query;

    Bar.find({'consumptions.beer_id': params.beer},{},{},function (err, docs) {
        console.log(err);
        console.log('_______');
        console.log(JSON.stringify(docs));
        if (err) {
            res.send(err);
            return null;
        }
    }).populate('consumptions').exec(function (err, docs) {
        console.log(err);
        console.log('_______');
        console.log(JSON.stringify(docs));
        Beer.populate(docs, {
            path: 'consumptions.beer_id'
        }, function (err, docs) {
            Type.populate(docs, {
                path: 'consumptions.beer_id.type_id'
            }, function (err, docs) {
                res.json(docs);
            });
        });

    })

};