const { Router } = require('express');
const {
  list,
  getById,
  getByCodigoQR,
  create,
  invalidar,
} = require('../controllers/recetas.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = Router();

router.get('/', requireAuth, list);
router.get('/qr/:codigoQR', requireAuth, requireRole('farmacia', 'admin'), getByCodigoQR);
router.get('/:id', requireAuth, getById);
router.post('/', requireAuth, requireRole('medico'), create);
router.patch('/:id/invalidar', requireAuth, requireRole('farmacia'), invalidar);

module.exports = router;
