exports.install = function(framework) {
	framework.route('/beer/', json_beer_query);
	framework.route('/beer/{id}/', json_beer_get);
	framework.route('/beer/{id}/', json_beer_save, ['post', 'json']);
	framework.route('/beer/{id}/', json_beer_delete, ['delete']);
};


/*
	Description: Get beers
	Method: GET
	Output: JSON
*/
function json_beer_query() {
console.log('beers');

	var self = this;

	var Beer = MODEL('beer').Schema;

	console.log('query -> all');

	Beer.find(function(err, docs) {
		self.json(docs);
	});
}

/*
	Description: Get beer
	Method: GET
	Output: JSON
*/
function json_beer_get(id) {

	var self = this;

	var Beer = MODEL('beer').Schema;

	console.log('get ->', id);

	Beer.findById(id, function(err, doc) {
		self.json(doc);
	});

}

/*
	Description: Save beer
	Method: POST
	Output: JSON
*/
function json_beer_save(id) {

	var self = this;

	var Beer = MODEL('beer').Schema;

	console.log('save ->', id);

	self.change('beer: save, id: ' + id);

	Beer.findById(id, function(err, doc) {
		self.json({ r: true });
	});

}

/*
	Description: Delete beer
	Method: DELETE
	Output: JSON
*/
function json_beer_delete(id) {

	var self = this;

	var Beer = MODEL('beer').Schema;

	console.log('delete ->', id);

	self.change('beer: deleted, id: ' + id);

	Beer.findById(id, function(err, doc) {
		self.json({ r: true });
	});

}
