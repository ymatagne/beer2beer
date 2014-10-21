var Beer = require('../models/beer');

/*
	Description: Get beers
	Method: GET
	Output: JSON
*/
module.exports.json_beer_query =function(req, res) {
	console.log('query -> all');
	Beer.find(function(err, docs) {
        if (err)
            res.send(err);
		res.json(docs);
	});
};

/*
	Description: Get beer
	Method: GET
	Output: JSON
*/
module.exports.json_beer_get =function(req, res) {
	console.log('get ->', req.params.beer_id);
	Beer.findById(req.params.beer_id, function(err, doc) {
        if (err)
            res.send(err);
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
        if (err)
            res.send(err);
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
        if (err)
            res.send(err);
		res.json({ r: true });
	});
};
