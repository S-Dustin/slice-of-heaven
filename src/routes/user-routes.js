// user-routes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user-model');

// Route to fetch user information by username
router.get('/', async (req, res) => {
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

module.exports = router;