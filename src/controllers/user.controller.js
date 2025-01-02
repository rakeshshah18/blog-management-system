const express = require("express");
// const Blog = require("../models/blogModel");
const User = require('../models/userModel');
// const Joi = require("joi");

const createNewUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const saveUser = await newUser.save();
        // cons
        res.status(201).json(saveUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//get users
const getExistingUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createNewUser, getExistingUsers };