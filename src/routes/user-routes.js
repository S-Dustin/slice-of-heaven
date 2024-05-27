// user-routes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user-model');

// Route to fetch user information by username
router.get('/receive', async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        const user = await User.findOne({ username }).select('-password'); // Exclude the password field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user); // Send the user data directly
    } catch (error) {
        console.error('Error fetching user information:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to update user address
router.put('/address', async (req, res) => {
    try {
        const { username, street, city, stateAbr, zipcode } = req.body;
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        const updatedUser = await User.findOneAndUpdate({ username }, { 
            street, city, stateAbr, zipcode 
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user address:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to remove user address
router.delete('/address', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        const updatedUser = await User.findOneAndUpdate({ username }, { 
            street: null, city: null, stateAbr: null, zipcode: null 
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error removing user address:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/decode', (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            throw new Error('Token not provided');
        }
        
        // Decode the token
        const decodedToken = jwt.decode(token);
        res.status(200).json(decodedToken);
    } catch (error) {
        console.error('Error decoding token:', error.message);
        res.status(400).json({ error: error.message });
    }
});

router.post('/auth', (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            throw new Error('Token not provided');
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // If verification is successful, send a success response
        res.status(200).json({ message: 'Token is valid', user: decoded });
    } catch (error) {
        console.error('Error verifying token:', error.message);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;