const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { getAll, create, deletePromocionById, validatePromocion } = require('../controllers/promocionController');

// Ruta pública para promociones (frontend) - sin autenticación
router.get('/promociones', getAll);

// Rutas protegidas
router.post('/promociones', authMiddleware, validatePromocion, create);
router.delete('/promociones/:id', authMiddleware, deletePromocionById);

module.exports = router;