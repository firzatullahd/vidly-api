const { Rental, schema } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const Fawn = require('fawn');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rental = await Rental.find().sort('-DateOut');
    res.send(rental);
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).send("Rental with the ID given is not found");

    res.send(rental);
});

router.post('/', async (req, res) => {

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid Customer');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid Movie');

    if (movie.numberInStock === 0) return res.status(400).send("Movie not in stock");

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
    });


    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, { $inc: { numberInstock: -1 } })
            .run();
        res.send(rental);
    } catch (ex) {
        res.status(500).send("Something failed.");
    }
});

router.delete('/:id', async (req, res) => {
    const rental = await Rental.findByIdAndRemove(req.params.id);

    if (!rental) return res.status(404).send("Rental with the ID given is not found");

    res.send(rental);
});

// router.put('/:id', async (req, res) => {

//     const { error } = schema.validate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//     const customer = await Customer.findById(req.body.customerId);
//     if (!customer) return res.status(400).send('Invalid Customer');

//     const movie = await Movie.findById(req.body.movieId);
//     if (!movie) return res.status(400).send('Invalid Movie');

//     const rental = await Rental.findByIdAndUpdate(req.params.id, {
//         customer: {
//             _id: customer._id,
//             name: customer.name,
//             phone: customer.phone
//         },
//         movie: {
//             _id: movie._id,
//             title: movie.title,
//             dailyRentalRate: movie.dailyRentalRate
//         },
//     }, { new: true });

//     await Movie.findByIdAndUpdate(movie._id, {
//         numberInStock: movie.numberInStock - 1
//     }, { new: true });

//     if (!rental) return res.status(404).send("Rental with the ID given is not found");

//     res.send(rental);
// });

module.exports = router;