var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', schema);