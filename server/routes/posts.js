const express = require('express');
const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
} = require('../controllers/posts');
const { toggleLike } = require('../controllers/userActions');

const { protect, authorize } = require('../middlewares/auth');
const commentRouter = require('./comments');

const router = express.Router();

// Re-route into other resource routers
router.use('/:postId/comments', commentRouter);

router
    .route('/')
    .get(getPosts)
    .post(protect, authorize('author', 'admin'), createPost);

router
    .route('/:id')
    .get(getPost)
    .put(protect, authorize('author', 'admin'), updatePost)
    .delete(protect, authorize('author', 'admin'), deletePost);

router.post('/:id/like', protect, toggleLike);

module.exports = router;
