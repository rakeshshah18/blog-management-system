// const { required } = require("joi");
const mongoose = require("mongoose");

const newUserSchema = new mongoose.Schema({
    userName: { 
        type: String,
        required: true, 
        minlength: 3, 
        maxlength: 20 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 8 
    },
    age: { 
        type: Number, 
        required: true, 
        min: 18, 
        max: 100 
    },
});

module.exports = mongoose.model('User', newUserSchema);
