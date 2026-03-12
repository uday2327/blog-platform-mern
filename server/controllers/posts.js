const Post = require('../models/Post');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'keyword'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Advanced search
    let findQuery = JSON.parse(queryStr);
    if (req.query.keyword) {
        findQuery.$or = [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { content: { $regex: req.query.keyword, $options: 'i' } }
        ];
    }

    // Finding resource
    query = Post.find(findQuery).populate({
        path: 'author',
        select: 'name email profileImage'
    });

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Post.countDocuments(findQuery);

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const posts = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.status(200).json({
        success: true,
        count: posts.length,
        pagination,
        data: posts
    });
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate({
        path: 'author',
        select: 'name email profileImage bio'
    });

    if (!post) {
        return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: post });
});

// @desc    Create post
// @route   POST /api/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
    const { title, content, category } = req.body;

    // Input validation
    if (!title || title.trim().length < 3) {
        return next(new ErrorResponse('Title must be at least 3 characters', 400));
    }
    if (!content || content.trim().length < 10) {
        return next(new ErrorResponse('Content must be at least 10 characters', 400));
    }

    const validCategories = ['Technology', 'Science', 'Blog', 'Lifestyle', 'Health', 'Business', 'Education', 'Writing', 'Design', 'Future', 'Politics', 'Art', 'Self Improved', 'Other'];
    if (category && !validCategories.includes(category)) {
        return next(new ErrorResponse(`Category must be one of: ${validCategories.join(', ')}`, 400));
    }

    req.body.author = req.user.id;
    const post = await Post.create(req.body);

    res.status(201).json({ success: true, data: post });
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
    let post = await Post.findById(req.params.id);

    if (!post) {
        return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is post owner
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this post`, 401));
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: post });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is post owner
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this post`, 401));
    }

    await post.deleteOne();

    res.status(200).json({ success: true, data: {} });
});
