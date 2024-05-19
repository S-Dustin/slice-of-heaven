// utils/jwt.js
const jwt = require('jsonwebtoken');

function generateToken(user) {
    const payload = {
        id: user._id,
        username: user.username,
        role: user.role
        // Add any other relevant user information to the payload
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = { generateToken };