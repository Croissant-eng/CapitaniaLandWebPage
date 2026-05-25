const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { getAll, updateEstatus, deleteReservaById } = require('../controllers/reservaController');

// Rutas protegidas
router.get('/reservas', authMiddleware, getAll);
router.put('/reservas/:id/estatus', authMiddleware, updateEstatus);
router.delete('/reservas/:id', authMiddleware, deleteReservaById);

module.exports = router;