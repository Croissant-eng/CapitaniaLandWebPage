const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { login, getProfile, logout, validateLogin } = require('../controllers/adminController');

// Rutas públicas
router.post('/login', validateLogin, login);
router.post('/logout', logout);

// Rutas protegidas
router.get('/admin/profile', authMiddleware, getProfile);

module.exports = router;