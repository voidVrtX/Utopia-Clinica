const { Router } = require('express');
const { list, getById, create, update, remove } = require('../controllers/medicos.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = Router();

router.get('/', list);
router.get('/:id', getById);
router.post('/', requireAuth, requireRole('admin'), create);
router.patch('/:id', requireAuth, requireRole('admin'), update);
router.delete('/:id', requireAuth, requireRole('admin'), remove);

module.exports = router;
