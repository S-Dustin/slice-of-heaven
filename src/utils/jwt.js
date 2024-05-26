// utils/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    // Construct the payload
    const payload = {
        role: user.role, // Assuming user.role contains the role information
        username: user.username // Assuming user.username contains the username
    };

    // Generate the token with the payload and secret
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }); // Token expires after 15 minutes
};

function decodeToken(token) {
    try {
        const decoded = jwt.decode(token);
        return decoded;
    } catch (error) {
        console.error('Error decoding token:', error.message);
        return null;
    }
}

module.exports = { decodeToken, generateToken };