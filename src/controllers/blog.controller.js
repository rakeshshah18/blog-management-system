const express = require("express");
const Blog = require("../models/blogModel");
const { validateBlogUser } = require("../utils/validateBlogUser");
const User = require("../models/userModel");

//get all blogs
const getUserBlog = async (req, res) => {
    try {
        const userId = req.query.userId;
        console.log("User ID from Middleware:", userId);
        const blogs = await Blog.find({user: userId,}).populate('user');
        if (!blogs){
            return res.status(404).json({
                status: "Error",
                message: "No blogs found for this user"
            })
        }
        res.status(200).json({
            status: "success",
            message: "Blog of this user",
            data: blogs,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Opps! Error while fetching the blogs",
        });
    }
};

//post a new blog
const postBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.query.userId;

        // Validation using validateBlogUser
        const { error } = validateBlogUser({
            title,
            content,
            image: req.file ? req.file.originalname : undefined,
        });
        if (error) {
            return res.status(400).json({
                status: "error",
                message: "Error in validation",
                details: error.details[0],
            });
        }

        const user1 = await User.findById(userId);
        if (!user1) {
            return res.status(404).json({
                status: "Not Found",
                message: "User not found"
            });
        }
        const newBlog = new Blog({
            title,
            content,
            image: req.file ? req.file.originalname : undefined,
            user: userId,
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

const updateBlog = async (req, res) => {
    try {
        const blogId = req.query.blogId;
        const { title, content } = req.body;
        const userId = req.userId;
        // const userId = "677b6a2ebd900620bb8c2d64";

        const blog = await Blog.findByIdAndUpdate({_id: blogId, user: userId});
        if (!blog){
            return res.status(404).json({
                status: "Not Found",
                message: "Blog not found"
            });
        }
        if (title) blog.title = title;
        if (content) blog.content = content;
        if (req.file) blog.image = req.file.originalname;

        const updateBlog = await blog.save();
        res.status(200).json({
            status: "success",
            message: 'Blog has been updated.',
            data: updateBlog,
            });

    }catch(error){
        res.status(500).json({
            status: "Error",
            message: "Error while updating the blog",
            });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const userId = req.query.userId;
        const blog = await Blog.findByIdAndDelete(userId)
        if (!blog) {
            return res.status(404).json({
                status: "Not Found",
                message: "Blog not found"
            });
        }
        res.status(200).json({
            status: "success",
            message: 'Blog has been deleted.',
        });
    }catch(error) {
        res.status(500).json({
            status: "Error",
            message: "Error while deleting the blog",
        })
    }
}

module.exports = { getUserBlog, postBlog, updateBlog, deleteBlog };
