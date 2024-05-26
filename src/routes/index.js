// src/routes/index.js
const express = require('express');
const path = require('path');
const menuRoutes = require('./menu-routes');
const loginRoutes = require('./login-routes');
const userRoutes = require('./user-routes');

const router = express.Router();

router.use('/menuUpdate', menuRoutes);
router.use('/authUser', loginRoutes);
router.use('/userInfo', userRoutes);

module.exports = router;