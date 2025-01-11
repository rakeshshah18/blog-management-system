// const express = require("express");
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config/config")
const crypto = require("crypto");
const bcrypt = require("bcrypt");

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

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "Email not found.",
            });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                status: "error",
                message: "Invalid credentials.",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            JWT_SECRET || "secret-key",
            { expiresIn: '24h' }
        );

        res.status(200).json({
            status: "success",
            message: "Login successful.",
            data: { token },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.query.userId;
        // const userId = "677d6daabad994aa4c835702";
        const { userName, email, password, age } = req.body;
        const user = await User.findByIdAndUpdate(userId);
        if(!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found.",
            });
        }
        if (userName) user.userName = userName;
        if (email) user.email = email;
        if (age) user.age = age;
        if (password) {
            const bcrypt = require("bcrypt");
            user.password = await bcrypt.hash(password, 10);
        }
        const updatedUser = await user.save();
        res.status(200).json({
            status: "success",
            message: "User updated successfully.",
            data: updatedUser,
        });
    }catch(error){
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.query.userId; 

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }

        res.status(200).json({
            status: "success",
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error while deleting user",
        });
    }
};

// forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }

        // Generating  reset token 
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        // token and expiration
        user.resetPasswordToken = hashedToken;
        const expireTime = Date.now() + 30 * 60 * 1000;
        user.resetPasswordTokenExpire = expireTime;
        await user.save();

        console.log("Forgot Password Debug:", {
            resetToken,
            hashedToken,
            expireTime: new Date(expireTime),
        });

        res.status(200).json({
            status: "success",
            message: "Reset password token sent to your email",
            data: { resetToken },
        });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server issue.",
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordTokenExpire: { $gt: Date.now() },
        });

        if (!user) {
            console.error("Invalid or Token is Expired");
            return res.status(400).json({
                status: "error",
                message: "Invalid or expired token",
            });
        }

        // Update password and clear token fields
        user.password = await bcrypt.hash(newPassword, 12);
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save();

        console.log("Done! password is reset for user:", user._id);

        res.status(200).json({
            status: "success",
            message: "Password reset successfully",
        });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server issue.",
        });
    }
};




module.exports = { 
    createNewUser, 
    getExistingUsers, 
    loginUser, 
    updateUser, 
    deleteUser, 
    forgotPassword, 
    resetPassword 
};


