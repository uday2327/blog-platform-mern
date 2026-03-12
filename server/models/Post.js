const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Please add some content']
    },
    image: {
        type: String,
        default: 'no-image.jpg'
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Technology', 'Science', 'Blog', 'Lifestyle', 'Health', 'Business', 'Education', 'Writing', 'Design', 'Future', 'Politics', 'Art', 'Self Improved', 'Other']
    },
    tags: [String],
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    isPublished: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', postSchema);
