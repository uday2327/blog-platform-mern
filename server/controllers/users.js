const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const asyncHandler = require('../middlewares/async');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().select('-password');
    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

// @desc    Get platform stats
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getStats = asyncHandler(async (req, res, next) => {
    const totalPosts = await Post.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalComments = await Comment.countDocuments();

    res.status(200).json({
        success: true,
        data: {
            totalPosts,
            totalUsers,
            totalComments,
            totalViews: '84.2K' // Placeholder for now
        }
    });
});
