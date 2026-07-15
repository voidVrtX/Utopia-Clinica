const { Router } = require('express');
const { list, create, marcarLeido } = require('../controllers/avisos.controller');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.get('/', requireAuth, list);
router.post('/', requireAuth, create);
router.patch('/:id/leido', requireAuth, marcarLeido);

module.exports = router;
