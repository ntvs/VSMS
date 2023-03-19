const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    tags: {
        type: [String],
        required: false,
        default: []
    },
    views: {
        type: Number,
        required: false,
        default: 0
    },
    comments: {
        type: [String], // or mongoose.Types.ObjectId
        required: false,
        default: []
    },
    rating: {
        type: [Number],
        required: false,
        default: [0, 0, 0, 0, 0]
    },
    updated: {
        type: Date,
        default: Date.now 
    },
    file: {
        type: {},
        required: false,
        default: {}
    }
});

module.exports = mongoose.model('Video', videoSchema);
