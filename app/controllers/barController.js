var Bar = require('../models/bar');
var Beer = require('../models/beer');
var Type = require('../models/type');

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
    }).exec(function (err, docs) {
        res.json(docs);
    });

};

/*
 Description: Get bars
 Method: GET
 Output: JSON
 */
module.exports.json_bar_with_beer = function (req, res) {
    Bar.findById(req.query.id).populate('consumptions.beer_id').populate('consumptions.type_id').exec(function (err, docs) {
        res.json(docs);
    });

};

/*
 Description: Save bars
 Method: POST
 Output: JSON
 */
module.exports.json_bar_save = function (req, res) {
    var body = req.body.params.bar;


    var bar = new Bar({
        adresse: body.adresse,
        geolocation: body.geolocation,
        latitude: body.latitude,
        longitude: body.longitude,
        happyhours: body.happyhours,
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
    var bar = new Bar(req.body.params.bar);

    Bar.findById(bar._id, function (err, found) {
        req.body.params.consumption.enable = false;
        found.consumptions.push(req.body.params.consumption);
        Bar.update({_id: found._id}, {consumptions: found.consumptions}, {}, function (err, doc) {
            res.json(found);
        });
    });
};

/*
 Description: Update bar
 Method: PUT
 Output: JSON
 */
module.exports.json_delete_consumption = function (req, res) {
    var consumption_id = req.query.consumption_id;

    Bar.findOne({'_id': req.params.id}).exec(function (err, doc) {
        //var index = doc.consumptions.indexOf(consumption);
        for (var index = 0; index < doc.consumptions.length; index++) {
            if(doc.consumptions[index]._id.toString()===consumption_id){
                doc.consumptions.splice(index,1);
            }
        }
        doc.save(function (err, bar) {
            if (err) return console.log(err);
            res.json(bar);
        });
    });
};
/*
 Description: Update bar
 Method: PUT
 Output: JSON
 */
module.exports.json_bar_update_all = function (req, res) {
    var bar = new Bar(req.body.params.bar);
    var date = new Date();

    Bar.findOne({'_id': bar._id}).populate('consumptions.beer_id').populate('consumptions.type_id').exec(function (err, doc) {
        doc.nom = bar.nom;
        doc.adresse = bar.adresse;
        doc.latitude = bar.latitude;
        doc.longitude = bar.longitude;
        doc.geolocation = bar.geolocation;
        doc.happyhours = bar.happyhours;

        var index_a_conserver = [];

        //Mise a jour des consommations
        for (var i = 0; i < doc.consumptions.length; i++) {
            for (var j = 0; j < bar.consumptions.length; j++) {
                if (doc.consumptions[i]._id.id === bar.consumptions[j]._id.id) {
                    doc.consumptions[i].price = bar.consumptions[j].price;
                    doc.consumptions[i].pression = bar.consumptions[j].pression;
                    doc.consumptions[i].date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                    index_a_conserver.push(i);
                }
            }
        }

        doc.save(function (err, bar) {
            if (err) return console.log(err);
            res.json(bar);
        });
    });
};

/*
 Description: Update bar
 Method: PUT
 Output: JSON
 */
module.exports.json_bar_update_consumptions = function (req, res) {

    Bar.update({_id: req.body.params.bar_id, "consumptions._id": req.body.params.consumption._id},
        {$set: {'consumptions.$.enable': !req.body.params.consumption.enable}},
        function (err, numAffected) {
            res.json(req.body.params.consumption.enable);

        });

};
/*
 Description: Get all bars
 Method: GET
 Output: JSON
 */
module.exports.json_bar_all = function (req, res) {

    if (req.query.beer != undefined) {
        Bar.find({'consumptions.beer_id': req.query.beer}).exec(function (err, docs) {
            res.json(docs);
        });
    } else if (req.query.type != undefined) {
        Bar.find()
            .where('consumptions.type_id').all(req.query.type)
            .limit(100)
            .exec(function (err, docs) {
                res.json(docs);
            });

    }

};