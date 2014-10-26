var mongoose = require('mongoose');
var schema =  new mongoose.Schema(
	{
		 email: {type: String, required: true, unique: true}
    ,password: {type: String, required: true}
		,token: {type: String, required: false}
	}
);

module.exports = mongoose.model('User', schema);
