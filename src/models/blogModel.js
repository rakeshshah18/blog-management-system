// const { required, ref, date } = require('joi');
const mongoose = require('mongoose');

const blogModel = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    user: {
        type:String,
        // type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }

});

module.exports = mongoose.model('Blog', blogModel);