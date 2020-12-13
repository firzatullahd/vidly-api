const Joi = require('joi-oid');
const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const auth = require('../middleware/auth');

const returnSchema = Joi.object({
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required()
});

router.post('/', [auth, validate(returnSchema)], async (req, res) => {
    const rental = await Rental.lookup(req.body.movieId, req.body.customerId)
    if (!rental) return res.status(404).send("Rental not found");

    if (rental.dateReturned) return res.status(400).send("Rental is already processed");

    rental.return();
    await rental.save();

    await Movie.updateOne({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    });

    return res.status(200).send(rental);
});

module.exports = router;