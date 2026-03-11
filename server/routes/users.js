const express = require('express');
const { getUsers, getStats } = require('../controllers/users');
const { toggleFollow, toggleBookmark } = require('../controllers/userActions');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

// Publicly available to all users (protected)
router.post('/:id/follow', toggleFollow);
router.post('/bookmarks/:postId', toggleBookmark);

// Admin only routes
router.use(authorize('admin'));
router.get('/', getUsers);
router.get('/stats', getStats);

module.exports = router;
