const Joi = require('joi');
const mongoose = require('mongoose');


const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 5,
        max: 50
    }
}));

const genreSchema = Joi.object({
    name: Joi.string().min(5).max(50).required()
});

module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
