const Joi = require('joi');
// const Joi = require('joi-oid');

module.exports = function () {
    Joi.objectId = require('joi-objectid')(Joi);
}