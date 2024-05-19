// user-routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');
const User = require('../models/user-model');

// Route to fetch user information
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password -username'); // Exclude the password and username fields
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user); // Send the user data directly
    } catch (error) {
        console.error('Error fetching user information:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

// Route to update user address
router.put('/address', authMiddleware, async (req, res) => {
    try {
        const { street, city, stateAbr, zipcode } = req.body;
        const username = req.user.username;

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
router.delete('/address', authMiddleware, async (req, res) => {
    try {
        const username = req.user.username;

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