// src/routes/index.js
const express = require('express');
const menuRoutes = require('./menu-routes');
const loginRoutes = require('./login-routes');
const userRoutes = require('./user-routes');

const router = express.Router();

router.use('/menu', menuRoutes);
router.use('/auth', loginRoutes);
router.use('/user', userRoutes);

module.exports = router;