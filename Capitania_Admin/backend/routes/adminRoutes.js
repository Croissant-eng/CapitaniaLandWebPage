const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { login, getProfile, logout, validateLogin } = require('../controllers/adminController');
const { loginEmpleado, validateLoginEmpleado } = require('../controllers/empleadoController');
const { getAll: getAllEventos, create: createEvento, updateEvento, deleteEventoById } = require('../controllers/eventoController');
const { getAll: getAllPromociones, create: createPromocion, updatePromocionById, deletePromocionById } = require('../controllers/promocionController');

// Rutas públicas
router.post('/login', validateLogin, login);
router.post('/empleado/login', validateLoginEmpleado, loginEmpleado);
router.post('/logout', logout);

// Rutas protegidas
router.get('/admin/profile', authMiddleware, getProfile);

// Rutas de eventos y promociones
router.get('/admin/eventos', authMiddleware, getAllEventos);
router.post('/admin/eventos', authMiddleware, createEvento);
router.put('/admin/eventos/:id', authMiddleware, updateEvento);
router.delete('/admin/eventos/:id', authMiddleware, deleteEventoById);

router.get('/admin/promociones', authMiddleware, getAllPromociones);
router.post('/admin/promociones', authMiddleware, createPromocion);
router.put('/admin/promociones/:id', authMiddleware, updatePromocionById);
router.delete('/admin/promociones/:id', authMiddleware, deletePromocionById);

module.exports = router;