// routes/login-routes.js
const express = require('express');
const User = require('../models/user-model');
const { generateToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs'); // Ensure bcrypt is required if not already
const router = express.Router();

// Asks to authenticate logon info against what is stored in the DB
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', username); // Log the login attempt
        // Attempts to find the user
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'User not found.' });
        }
        // Compares hashed password with what is stored in the DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Wrong password');
            return res.status(401).json({ message: 'Wrong password.' });
        }
        // Generates JWT if authenticated
        const token = generateToken(user);

        // Send the token to the client
        res.status(200).json({ message: 'Login successful', token, username: user.username});
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Checks that the unique username doesn't already exist
router.get('/checkUsername', async (req, res) => {
    const username = req.query.username;
    // Attempts to find the exact username
    const user = await User.findOne({ username });
    if (user) {
        // Returns that username exists
        res.json({ exists: true });
    } else { // Returns that username does not exist
        res.json({ exists: false });
    }
});

// Route to create a new user
router.post('/create', async (req, res) => {
    const { username, password, firstName, lastName, email } = req.body;
    try {
        // Create new user with hashed password
        const newUser = new User({
            firstName,
            lastName,
            username,
            password,
            email,
            street: '',
            city: '',
            stateAbr: '',
            zipcode: '',
            role: 'user'
        });

        // Save user to database and log result
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

module.exports = router;