// src/server.js
const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const routes = require('./routes'); // Import centralized routes

module.exports = (app) => {
    // Middleware setup
    app.use(cors());
    app.use(express.json());
    app.use(logger);

    // Use the centralized routes
    app.use('/', routes);

    // Basic error handling
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });
};