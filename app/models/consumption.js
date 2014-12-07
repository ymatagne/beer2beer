var mongoose = require('mongoose');
var schema = mongoose.Schema({
    beer_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Beer'}],
    price: Number,
    enable: Boolean
});

module.exports = mongoose.model('Consumption', schema);

