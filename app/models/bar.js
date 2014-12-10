var mongoose = require('mongoose');

var beerSchema = new mongoose.Schema({
    nom: String,
    type: String,
    alcool: String
});

var consumptionSchema = new mongoose.Schema({
    beer: [beerSchema],
    price: String,
    beer_id: String,
    type_id: Number,
    enable: Boolean,
    quantity: String
});


var schema = mongoose.Schema({
    nom: String,
    adresse: String,
    latitude: Number,
    longitude: Number,
    geolocation: String,
    consumptions: [consumptionSchema]
});


module.exports = mongoose.model('Bar', schema);

