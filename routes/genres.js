const validateObjectId = require('../middleware/validateObjectId');
const asyncMiddleware = require('../middleware/async');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Genre, genreSchema } = require('../models/genre');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre) return res.status(404).send("Genre with the ID given is not found");

    res.send(genre);
});

router.post('/', [auth, validate(genreSchema)], async (req, res) => {
    const genre = new Genre({ name: req.body.name });

    await genre.save();
    res.send(genre);
});

router.delete('/:id', [auth, validateObjectId, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send("Genre with the ID given is not found");

    res.send(genre);
});

router.put('/:id', [auth, validateObjectId, validate(genreSchema)], async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

    if (!genre) return res.status(404).send("Genre with the ID given is not found");

    res.send(genre);
});

module.exports = router;