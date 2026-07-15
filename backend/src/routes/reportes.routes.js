const { Router } = require('express');
const { resumen } = require('../controllers/reportes.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = Router();

router.get('/:tipo', requireAuth, requireRole('admin'), resumen);

module.exports = router;
