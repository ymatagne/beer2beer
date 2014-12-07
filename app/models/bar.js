var mongoose = require('mongoose');
var schema = mongoose.Schema({
    nom : String,
    adresse: String,
    latitude: Number,
    longitude: Number,
    geolocation: String,
    consumptions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Consumption'}]
});

module.exports = mongoose.model('Bar', schema);

