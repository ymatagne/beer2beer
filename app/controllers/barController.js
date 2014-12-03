var Bar = require('../models/bar');
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
        res.json(docs);
    }).populate('beers');;
};

/*
 Description: Save bars
 Method: POST
 Output: JSON
 */
module.exports.json_bar_save = function (req, res) {
    var body = req.body.bar;

    // recuperation des ids des beers
    var beersId=[];
    for(index in body.beers){
        beersId.push(body.beers[index])
    }

    var bar = new Bar({
        adresse: body.adresse,
        geolocation: body.geolocation,
        latitude: body.latitude,
        longitude: body.longitude,
        nom: body.nom,
        beers: beersId
    });

    bar.save(function (err,bar) {
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

    // recuperation des ids des beers
    var beersId=[];
    for(index in body.beers){
        beersId.push(body.beers[index])
    }

    var bar = new Bar({
        _id: body._id,
        adresse: body.adresse,
        geolocation: body.geolocation,
        latitude: body.latitude,
        longitude: body.longitude,
        nom: body.nom,
        beers: beersId
    });

    bar.update({ beers: beersId }, function (err, numberAffected, raw) {
        if (err) return handleError(err);
        res.json(raw);
    });

};