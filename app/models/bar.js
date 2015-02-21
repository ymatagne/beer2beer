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
    localisation: { type: { type: String }, coordinates: [ ] },
    geolocation: String,
    happyhours: String,
    consumptions: [consumptionSchema]
});

schema.index({ localisation: '2dsphere' });

module.exports = mongoose.model('Bar', schema);

