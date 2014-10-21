var mongoose = require('mongoose');
var userSchema = mongoose.Schema({ name: String, created: Date });

module.exports = mongoose.model('Beer', userSchema);