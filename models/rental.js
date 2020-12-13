const Joi = require('joi-oid');
const mongoose = require('mongoose');
const moment = require('moment');


const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                required: true
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                min: 5,
                max: 50,
                trim: true,
                required: true
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date,

    }, rentalFee: {
        type: Number,
        min: 0
    }
})

rentalSchema.statics.lookup = function (movieId, customerId) {
    return Rental.findOne({
        'customer._id': customerId,
        'movie._id': movieId,
    });
};

rentalSchema.methods.return = function () {
    this.dateReturned = new Date();

    const rentalDays = moment().diff(this.dateOut, 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);

const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),

});

module.exports.Rental = Rental;
module.exports.schema = schema;
