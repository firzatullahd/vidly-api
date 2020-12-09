const _ = require('lodash');
const { Customer, schema } = require('../models/customer');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("customer with the given ID is not found");
    res.send(customer);
});

router.post('/', async (req, res) => {

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = new Customer(_.pick(req.body, ['isGold', 'name', 'phone']))

    await customer.save();
    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send("Customer with the ID given is not found");
    res.send(customer);
});

router.put('/:id', async (req, res) => {

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, _.pick(req.body, ['isGold', 'name', 'phone']), {
        new: true
    });

    if (!customer) return res.status(404).send("Customer with the given id is not found");

    res.send(customer);

});


module.exports = router;