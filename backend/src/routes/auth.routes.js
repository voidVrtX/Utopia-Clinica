const { Router } = require('express');
const { login, register, me, checkEmail } = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/check-email', checkEmail);
router.get('/me', requireAuth, me);

module.exports = router;
