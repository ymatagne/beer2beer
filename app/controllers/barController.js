var Bar = require('../models/bar');
/*
 Description: Get bars
 Method: GET
 Output: JSON
 */
module.exports.getBars = function (req, res) {
    var query = Bar.find();
    if (req.query.location) {
        query.where('localisation').near({
            center: {
                coordinates: [JSON.parse(req.query.location).lat, JSON.parse(req.query.location).long],
                type: 'Point'
            },
            maxDistance: JSON.parse(req.query.location).distance
        });
    }

    query.exec(function (err, docs) {
        res.json(docs);
    });

};

/*
 Description: Get bars
 Method: GET
 Output: JSON
 */
module.exports.getBarByIdwithBeer = function (req, res) {
    Bar.findById(req.query.id).populate('consumptions.beer_id').populate('consumptions.type_id').exec(function (err, docs) {
        res.json(docs);
    });

};

/*
 Description: Save bars
 Method: POST
 Output: JSON
 */
module.exports.saveBar = function (req, res) {
    var body = req.body.params.bar;


    var bar = new Bar({
        adresse: body.adresse,
        geolocation: body.geolocation,
        happyhours: body.happyhours,
        localisation: body.localisation,
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
module.exports.updateBar = function (req, res) {
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
module.exports.deleteConsumption = function (req, res) {
    var consumption_id = req.query.consumption_id;

    Bar.findOne({'_id': req.params.id}).exec(function (err, doc) {
        //var index = doc.consumptions.indexOf(consumption);
        for (var index = 0; index < doc.consumptions.length; index++) {
            if (doc.consumptions[index]._id.toString() === consumption_id) {
                doc.consumptions.splice(index, 1);
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
module.exports.updateFullBar = function (req, res) {
    var bar = new Bar(req.body.params.bar);
    var date = new Date();

    Bar.findOne({'_id': bar._id}).populate('consumptions.beer_id').populate('consumptions.type_id').exec(function (err, doc) {
        doc.nom = bar.nom;
        doc.adresse = bar.adresse;
        doc.geolocation = bar.geolocation;
        doc.localisation = bar.localisation;
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
module.exports.updateConsumption = function (req, res) {

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
module.exports.getAllBar = function (req, res) {

    if (req.query.beer != undefined) {

        if (req.query.prices != undefined)
            Bar.find({'consumptions.beer_id': req.query.beer}).where('consumptions.price').gt(req.query.prices[0]).lt(req.query.prices[1]).exec(function (err, docs) {
                res.json(docs);
            });
        else {
            Bar.find({'consumptions.beer_id': req.query.beer}).exec(function (err, docs) {
                res.json(docs);
            });
        }
    } else if (req.query.type != undefined) {
        if (req.query.prices === undefined)
            Bar.find()
                .where('consumptions.type_id').all(req.query.type)
                .limit(100)
                .exec(function (err, docs) {
                    res.json(docs);
                });
        else {
            Bar.find()
                .where('consumptions.type_id').all(req.query.type)
                .where('consumptions.price').gt(req.query.prices[0]).lt(req.query.prices[1])
                .limit(100)
                .exec(function (err, docs) {
                    res.json(docs);
                });
        }

    } else if (req.query.prices != undefined) {
        Bar.find()
            .where('consumptions.price').gt(req.query.prices[0]).lt(req.query.prices[1])
            .limit(100)
            .exec(function (err, docs) {
                res.json(docs);
            });
    } else {
        Bar.find()
            .limit(100)
            .exec(function (err, docs) {
                res.json(docs);
            });
    }

};