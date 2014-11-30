var mongoose = require('mongoose');
var schema = mongoose.Schema({
    nom: String,
    type: String,
    alcool: String,
    brewery_id: [{type: Number, ref: 'Brewery'}],
    bars: [{type: Number, ref: 'Bar'}]
});

module.exports = mongoose.model('Beer', schema);

