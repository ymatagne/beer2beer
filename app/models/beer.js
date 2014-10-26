var mongoose = require('mongoose');
var schema = mongoose.Schema({ name: String, created: Date });

module.exports = mongoose.model('Beer', schema);
