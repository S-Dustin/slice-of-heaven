// utils/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
};

module.exports = { generateToken };