const { Router } = require('express');
const postControllers = require('../controllers/postControllers');

const router = Router();

// importing middlewares
const { requireAuth,determineTheUser } = require('../middlewares/authMiddlewares');

// routes

router.post('/search', requireAuth, determineTheUser,postControllers.search_GET);
router.get('/create', requireAuth, determineTheUser,postControllers.create_GET);
router.post('/create',requireAuth,determineTheUser,postControllers.create_POST);
router.get('/details/:id', requireAuth, determineTheUser, postControllers.details_GET);
router.get('/edit/:id', requireAuth, determineTheUser, postControllers.edit_GET);
router.post('/edit/:id',requireAuth,determineTheUser, postControllers.edit_POST);
router.get('/enroll/:id', requireAuth, determineTheUser, postControllers.enroll_GET);
router.get('/delete/:id', requireAuth, determineTheUser,postControllers.delete_GET);

module.exports = router;
