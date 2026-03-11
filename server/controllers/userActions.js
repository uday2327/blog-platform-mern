const asyncHandler = require('../middlewares/async');
const User = require('../models/User');
const Post = require('../models/Post');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Toggle follow user
// @route   POST /api/users/:id/follow
// @access  Private
exports.toggleFollow = asyncHandler(async (req, res, next) => {
    const userToFollow = await User.findById(req.params.id);

    if (!userToFollow) {
        return next(new ErrorResponse('User not found', 404));
    }

    if (userToFollow.id === req.user.id) {
        return next(new ErrorResponse('You cannot follow yourself', 400));
    }

    const currentUser = await User.findById(req.user.id);

    let isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
        // Unfollow
        currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
    } else {
        // Follow
        currentUser.following.push(req.params.id);
    }

    await currentUser.save();

    res.status(200).json({
        success: true,
        data: currentUser.following,
        isFollowing: !isFollowing
    });
});

// @desc    Toggle bookmark post
// @route   POST /api/users/bookmarks/:postId
// @access  Private
exports.toggleBookmark = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.postId);

    if (!post) {
        return next(new ErrorResponse('Post not found', 404));
    }

    const currentUser = await User.findById(req.user.id);

    let isBookmarked = currentUser.bookmarks.includes(req.params.postId);

    if (isBookmarked) {
        // Remove bookmark
        currentUser.bookmarks = currentUser.bookmarks.filter(id => id.toString() !== req.params.postId);
    } else {
        // Add bookmark
        currentUser.bookmarks.push(req.params.postId);
    }

    await currentUser.save();

    res.status(200).json({
        success: true,
        data: currentUser.bookmarks,
        isBookmarked: !isBookmarked
    });
});

// @desc    Toggle like post
// @route   POST /api/posts/:id/like
// @access  Private
exports.toggleLike = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new ErrorResponse('Post not found', 404));
    }

    let isLiked = post.likes.includes(req.user.id);

    if (isLiked) {
        // Unlike
        post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    } else {
        // Like
        post.likes.push(req.user.id);
    }

    await post.save();

    res.status(200).json({
        success: true,
        data: post.likes,
        isLiked: !isLiked
    });
});
