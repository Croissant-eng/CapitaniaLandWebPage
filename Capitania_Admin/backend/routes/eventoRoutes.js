const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { getAll, create, updateEvento, deleteEventoById, validateEvento } = require('../controllers/eventoController');

router.get('/eventos_especiales', getAll);
router.get('/eventos', getAll);
router.post('/eventos', authMiddleware, validateEvento, create);
router.put('/eventos/:id', authMiddleware, updateEvento);
router.delete('/eventos/:id', authMiddleware, deleteEventoById);

module.exports = router;