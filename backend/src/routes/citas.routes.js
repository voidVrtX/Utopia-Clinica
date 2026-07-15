const { Router } = require('express');
const { list, getById, create, update, cancel } = require('../controllers/citas.controller');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.get('/', requireAuth, list);
router.get('/:id', requireAuth, getById);
router.post('/', requireAuth, create);
router.patch('/:id', requireAuth, update);
router.patch('/:id/cancelar', requireAuth, cancel);

module.exports = router;
