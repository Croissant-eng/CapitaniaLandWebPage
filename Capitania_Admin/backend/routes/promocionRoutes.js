const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { getAll, create, updatePromocionById, deletePromocionById, validatePromocion } = require('../controllers/promocionController');

router.get('/promociones', getAll);
router.post('/promociones', authMiddleware, validatePromocion, create);
router.put('/promociones/:id', authMiddleware, updatePromocionById);
router.delete('/promociones/:id', authMiddleware, deletePromocionById);

module.exports = router;