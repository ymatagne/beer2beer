var mongoose = require('mongoose');

var consumptionSchema = new mongoose.Schema({
    price: Number,
    beer_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Beer'}],
    type_id: [{type: Number, ref: 'Type'}],
    enable: Boolean,
    quantity: String,
    date: String,
    pression: Boolean
});


var schema = mongoose.Schema({
    nom: String,
    adresse: String,
    latitude: Number,
    longitude: Number,
    geolocation: String,
    happyhours: String,
    consumptions: [consumptionSchema]
});

module.exports = mongoose.model('Bar', schema);

