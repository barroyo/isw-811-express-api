const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    password: { type: String }
});

module.exports = mongoose.model('users', user);