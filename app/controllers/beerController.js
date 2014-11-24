var Beer = require('../models/beer');
var Brewery = require('../models/brewery');

/*
	Description: Get beers
	Method: GET
	Output: JSON
*/
module.exports.json_beer_query =function(req, res) {
	console.log('query -> all');

	Beer.find({ 'nom' :  new RegExp('.*'+req.query.name+'.*', "i") },{},{limit: 100 },function(err, docs) {
        if (err){
            res.send(err);
            return null;
		}
		res.json(docs);
	}).populate('brewery_id');
};

/*
	Description: Get beer
	Method: GET
	Output: JSON
*/
module.exports.json_beer_get =function(req, res) {
	console.log('get ->', req.params.beer_id);
	Beer.findById(req.params.beer_id, function(err, doc) {
        if (err){
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
module.exports.json_beer_save =function(req, res) {
	console.log('save ->',req.params.beer_id);
	Beer.findById(req.params.beer_id, function(err) {
        if (err){
			res.send(err);
		}
		res.json({ r: true });
	});
};

/*
	Description: Delete beer
	Method: DELETE
	Output: JSON
*/
module.exports.json_beer_delete =function(req, res) {
	console.log('delete ->', req.params.beer_id);
	Beer.findById(req.params.beer_id, function(err) {
        if (err){
            res.send(err);
		}
		res.json({ r: true });
	});
};

module.exports.setBeer = function(fakeBeer){
	Beer = fakeBeer;
};
