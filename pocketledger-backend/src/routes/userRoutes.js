const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
// ...existing user routes...

// Login route

router.post('/register', userController.register);
router.post('/login', authController.login);
module.exports = router;