var Bar = require('../models/bar');
/*
	Description: Get bars
	Method: GET
	Output: JSON
*/
module.exports.json_bar_query =function(req, res) {
	Bar.find(function(err, docs) {
        if (err){
            res.send(err);
            return null;
		}
		res.json(docs);
	});
};