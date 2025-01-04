const express = require("express");
const Blog = require("../models/blogModel");
const Joi = require("joi");
const User = require("../models/userModel")


//get all blogs
const getUserBlog = async (req, res) => {
    try {
        
        const blogs = await Blog.find(User);
        res.json(blogs);
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Opps! Error while fetching the blogs",
        });
    }
};


const validateNewBlogSchema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    content: Joi.string().min(5).max(150).required(),
    image: Joi.string(),
    user: Joi.string().required(),
});

//post a new blog
const postBlog = async (req, res) => {
    try {
        const { title, content, image, user } = req.body;
        const userId = req.user.userId

        // Joi validation
        const { error } = validateNewBlogSchema.validate({
            title,
            content,
            // image,
            image: req.file ? req.file.originalname : undefined,
            user
        });
        if (error) {
            return res.status(400).json({
                status: "error",
                message: "Error in Joi validation",
                // details: error.details[0],
            });
        }

        const user1 = await User.findById(user);
        console.log("User id of existing user: ", user1)
        if (!user1) {
            return res.status(404).json({
                status: "success",
                message: "User not found"
            })
        }
        const newBlog = new Blog({
            title,
            content,
            // image,
            image: req.file ? req.file.originalname : undefined,
            user,
        });

        const data = await newBlog.save();

        res.status(201).json({
            status: "success",
            message: 'Enjoy! New Blog has been created.',
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Oops! Error while creating the new blog',
        });
    }
}

module.exports = { getUserBlog, postBlog };
