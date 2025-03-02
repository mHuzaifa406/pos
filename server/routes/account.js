const express = require('express');
const router = express.Router();
const { login } = require('../controllers/login');
const registerUser  = require('../controllers/register');
router.post('/login', login);
router.post('/register', registerUser);

module.exports = router;