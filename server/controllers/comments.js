const Comment = require('../models/Comment');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
exports.getComments = asyncHandler(async (req, res, next) => {
    const comments = await Comment.find({ post: req.params.postId })
        .populate({
            path: 'user',
            select: 'name profileImage'
        })
        .populate({
            path: 'parentComment',
            select: 'content'
        })
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: comments.length,
        data: comments
    });
});

// @desc    Add a comment
// @route   POST /api/posts/:postId/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
        return next(new ErrorResponse('Comment content is required', 400));
    }
    if (content.length > 2000) {
        return next(new ErrorResponse('Comment must be under 2000 characters', 400));
    }

    req.body.post = req.params.postId;
    req.body.user = req.user.id;

    const comment = await Comment.create(req.body);

    res.status(201).json({
        success: true,
        data: comment
    });
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        return next(new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is comment owner or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this comment`, 401));
    }

    await comment.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
