const express = require('express');
const path = require('path');
require('dotenv').config();
const connectDB = require('./src/config/dbConfig');
const serverSetup = require('./src/server');

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

app.use(express.json());
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the server setup (middleware and routes)
serverSetup(app);

// Serve static files from the public directory
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/about.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/cart.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/checkout.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/menu.html'));
});

app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'account.html'));
});

app.get('/admin-dash', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-dash.html'));
});

// Serve index.html for the root route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});