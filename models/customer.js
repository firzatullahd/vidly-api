const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold: {
        type: Boolean,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
}));


const schema = Joi.object({
    isGold: Joi.boolean().required(),
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required()
});

module.exports.Customer = Customer;
module.exports.schema = schema;