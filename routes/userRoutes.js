const { Router } = require('express');
const userControllers = require('../controllers/userControllers');

const router = Router();

const { requireAuth, denyAccessIfLogged } = require('../middlewares/authMiddlewares');

// routes

router.get('/login', denyAccessIfLogged, userControllers.login_GET);
router.post('/login', denyAccessIfLogged, userControllers.login_POST);
router.get('/register', denyAccessIfLogged, userControllers.register_GET);
router.post('/register', denyAccessIfLogged, userControllers.register_POST);
router.get('/logout', requireAuth, userControllers.logout_GET);

module.exports = router;
