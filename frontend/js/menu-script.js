// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Body parser middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://dustinsauter:DaP1zzaGuy@pizzacluster.nx4umkn.mongodb.net/?retryWrites=true&w=majority&appName=PizzaCluster', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Define MongoDB schema and model for menu items
const menuItemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    discount: Boolean,
    discount_amount: Number
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// Define routes for CRUD operations
// Implement route handlers for CRUD operations using Express.js