var mongoose = require('mongoose');


var consumptionSchema = new mongoose.Schema({
    beer_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Beer'}],
    price: Number,
    enable: Boolean
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

