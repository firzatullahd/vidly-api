const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi-oid');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 5,
        max: 50,
        required: true
    },
    email: {
        type: String,
        min: 5,
        max: 255,
        required: true,
        unique: true
    },
    password: {
        type: String,
        min: 5,
        max: 1024,
        required: true
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
});

module.exports.User = User;
module.exports.schema = schema;
