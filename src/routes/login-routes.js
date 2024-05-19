// routes/login-routes.js
const express = require('express');
const User = require('../models/user-model');
const { generateToken } = require('../../public/js/utils/jwt');
const bcrypt = require('bcryptjs'); // Ensure bcrypt is required if not already
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', username); // Log the login attempt

        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Wrong password');
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }

        const token = generateToken(user);
        res.status(200).json({ message: 'Login successful', token, role: user.role, username: user.username, id: user._id});
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;