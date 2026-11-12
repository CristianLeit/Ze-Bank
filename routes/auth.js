const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Mantém as URLs originais usadas pelo frontend (js/script.js)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.profile);
router.post('/refresh-token', authMiddleware, authController.refreshToken);

module.exports = router;
