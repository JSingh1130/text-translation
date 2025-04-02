// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

module.exports = router;
