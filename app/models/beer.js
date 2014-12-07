var mongoose = require('mongoose');
var schema = mongoose.Schema({
    nom: String,
    type_id:  [{type: Number, ref: 'Type'}],
    alcool: String,
    brewery_id: [{type: Number, ref: 'Brewery'}]
});

module.exports = mongoose.model('Beer', schema);

