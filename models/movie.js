const Joi = require('joi');

const mongoose = require('mongoose');
const { genreSchema } = require('./genre');


const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        min: 5,
        max: 50,
        trim: true,
        required: true
    },
    genre: genreSchema,
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }


}));

const schema = Joi.object({
    title: Joi.string().min(5).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required()
});

module.exports.Movie = Movie;
module.exports.schema = schema;
