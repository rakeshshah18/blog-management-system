const express = require("express");
const Blog = require("../models/blogModel");
const Joi = require("joi");
const User = require("../models/userModel")


//get all blogs
const getUserBlog = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({
            message: "Opps! Error while fetching the blogs",
        });
    }
};


const validateNewBlogSchema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    content: Joi.string().min(10).max(150).required(),
    image: Joi.string(),
    user: Joi.string().required(),
});

//post a new blog
const postBlog = async (req, res) => {
    try {
        const { title, content, image, user } = req.body;
        // const userId = req.user._id;
        // console.log("User ID from blogRoutes:", userId);

        // Joi validation
        const { error } = validateNewBlogSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: "Error in Joi validation",
                // details: error.details,
            });
        }

        const user1 = await User.findById(req.body.user);
        console.log("User id of existing user: ",user1)
        if(!user1){
            return res.status(404).json({message: "User not found"})
        }
        const newBlog = new Blog({
            title,
            content,
            image,
            // image: req.file ? req.file.filename : undefined,
            user: user1,
        });

        await newBlog.save();

        res.status(201).json({
            message: 'Enjoy! New Blog has been created.',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Oops! Error while creating the new blog',
        });
    }
}

module.exports = { getUserBlog, postBlog };
