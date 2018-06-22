const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    password: { type: String }
});

const allowedAttributes = ['lastName', 'username', 'password', 'firstName'];

module.exports.User = mongoose.model('users', user);
module.exports.UserAllowedAttributes = allowedAttributes;