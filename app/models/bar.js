var mongoose = require('mongoose');
var schema = mongoose.Schema({ nom: String, adresse: String, geolocalisation: String, beers : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Beer' }] });

module.exports = mongoose.model('Bar', schema);

