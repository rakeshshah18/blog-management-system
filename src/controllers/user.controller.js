// const express = require("express");
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config/config")


const createNewUser = async (req, res) => {
    try {
        const { userName, email, password, age } = req.body;
        const newUser = new User({
            userName,
            email,
            password,
            age
            
        });
        const saveUser = await newUser.save();
        //token generation
        const token1 = jwt.sign({ 
            id: saveUser._id.toString() 
        }, 
        JWT_SECRET || "secret-keys", {
            expiresIn: '24h'
        });

        res.status(201).json({
            status: "success",
            message: "User is now register.",
            // user: saveUser,
            data: {token: token1}
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

//get users
const getExistingUsers = async (req, res) => {
    try {
        const userId = req.userId;
        const users = await User.find({  userId });
        res.status(200).json({
            status: "success",
            message: "Registered Users.",
            data: users
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

module.exports = { createNewUser, getExistingUsers };


// {status:"success",message:"Success Message", data:users}