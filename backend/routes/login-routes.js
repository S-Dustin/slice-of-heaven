// routes/login-routes.js
const express = require('express');
const User = require('../models/user-model');
const { generateToken } = require('../utils/jwt');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }

        const token = generateToken(user);
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;