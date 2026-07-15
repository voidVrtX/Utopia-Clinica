const { Router } = require('express');
const { search } = require('../controllers/medicamentosCatalogo.controller');
const { requireAuth } = require('../middleware/auth');

const router = Router();
router.get('/', requireAuth, search);
module.exports = router;
