const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {

    process.on('uncaughtException', ex => {
        console.log("We got an uncaught exception");
        winston.error(ex.message, ex);
        process.exit(1);
    });

    process.on('unhandledRejection', ex => {
        console.log("We got an unhandled rejection");
        winston.error(ex.message, ex);
        process.exit(1);
    });

    winston.add(new winston.transports.Console());
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    winston.add(new winston.transports.MongoDB({
        db: 'mongodb://localhost/vidly',
        level: 'error',
        options: {
            poolSize: 2,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }));

}