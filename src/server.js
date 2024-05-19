// src/server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require('dotenv').config();
const connectDB = require("./config/dbConfig");
const menuRoutes = require("./routes/menu-routes");
const loginRoutes = require("./routes/login-routes");
const userRoutes = require("./routes/user-routes");
const logger = require("./middleware/logger");

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(logger);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

app.use('/menu', menuRoutes);
app.use('/auth', loginRoutes);
app.use('/user', userRoutes);

// Serve index.html for the root route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server started on port ${process.env.PORT || 8000}`);
});