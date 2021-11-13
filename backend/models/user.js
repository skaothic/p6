const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
require('mongoose-type-email')
mongoose.SchemaTypes.Email.defaults.message = 'Email address is invalid'


const userSchema = mongoose.Schema({
    email: { type: mongoose.SchemaTypes.Email, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);