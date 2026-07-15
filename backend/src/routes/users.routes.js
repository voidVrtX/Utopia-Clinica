const { Router } = require('express');
const { getById, update } = require('../controllers/users.controller');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.get('/:id', requireAuth, getById);
router.patch('/:id', requireAuth, update);

module.exports = router;
