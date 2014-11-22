var mongoose = require('mongoose');
var schema = mongoose.Schema({ nom: String, type: String, alcool: String, brewery : [{ type: mongoose.Schema.ObjectId, ref: 'Brewery' }] });

module.exports = mongoose.model('Beer', schema);

