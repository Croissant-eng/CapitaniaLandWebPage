const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { getAll, create, deleteEventoById, validateEvento } = require('../controllers/eventoController');

// Ruta pública para eventos especiales (frontend) - sin autenticación
router.get('/eventos_especiales', getAll);

// Ruta pública para eventos (frontend) - sin autenticación
router.get('/eventos', getAll);

// Rutas protegidas (requieren autenticación)
router.post('/eventos', authMiddleware, validateEvento, create);
router.delete('/eventos/:id', authMiddleware, deleteEventoById);

module.exports = router;