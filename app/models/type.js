var mongoose = require('mongoose');
var schema = mongoose.Schema({ _id:Number, name: String});

module.exports = mongoose.model('Type', schema);
