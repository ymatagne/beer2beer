var userSchema = mongoose.Schema({ name: String, created: Date });

exports.name = 'beer';
exports.Schema = mongoose.model('Beer', userSchema);
