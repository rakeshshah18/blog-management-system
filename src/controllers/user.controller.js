// const express = require("express");
const User = require('../models/userModel');
const { generateOtp, verifyOtp } = require('../models/otpModel');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../utils/mailSender');
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../config/config")
const crypto = require("crypto");

// Verify Registration OTP
const verifyRegistrationOtp = async (req, res) => {
    try {
        const { otp, email } = req.body;
        if (await verifyOtp(email, otp, 'registration')) {
            await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });

            // Generate token
            const token1 = jwt.sign(
                { id: email },
                JWT_SECRET || "secret-keys",
                { expiresIn: '24h' }
            );

            return res.status(200).json({
                status: "Success",
                message: "Registration OTP verified successfully",
                token: { token1 }
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
        });
    }
};


// verify login otp
const verifyLoginOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (await verifyOtp(email, otp, 'login')) {
            const token = jwt.sign({ id: email },
                "secret-key",
                { expiresIn: '24h' });
            return res.status(200).json({
                status: "success",
                message: "Login successful",
                token: { token }
            });
        }
        res.status(400).json({
            status: "error",
            message: "Invalid or expired OTP",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error while verifying OTP",
        });
    }
};

const verifyFPOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(`Received Forgot Password OTP verification request for: ${email}, OTP: ${otp}`);

        if (!await verifyOtp(email, otp, 'forgotPassword')) {
            console.error("Invalid or expired OTP.");
            return res.status(400).json({
                status: "error",
                message: "Invalid or expired OTP",
            });
        }

        console.log("OTP verified. Generating reset token...");
        // Generate reset token
        const user = await User.findOne({ email });
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        // Store token and expiration
        const resetPssToken = user.resetPasswordToken = hashedToken;
        user.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000; // 30 min expiry
        await user.save();

        return res.status(200).json({
            status: "success",
            message: "FP OTP verified successfully",
            data: { resetPssToken }
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error while verifying OTP",
        });
    }
};



const createNewUser = async (req, res) => {
    try {
        const { userName, email, password, age } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                status: "Error",
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
            age,
        });
        const saveUser = await newUser.save();
        // console.log("User saved successfully:", saveUser);

        const otp = await generateOtp(email, 'registration');
        await sendOtpEmail(email, otp);
        res.status(201).json({
            status: "Success",
            message: "User registered. OTP sent to email.",
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Failed to generate register otp",
        });
    }



    // console.log("Token generated successfully:", token1);
    // res.status(201).json({
    //     status: "Success",
    //     message: "User registered successfully",
    //     token: { token1 }
    // })

}

// login and send otp
const logIn = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "Email not registered.",
            });
        }

        // Generate a 6-digit OTP for login
        const otp = await generateOtp(email, 'login');
        await sendOtpEmail(email, otp);
        res.status(200).json({
            status: "success",
            message: "Login OTP sent to your email.",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};



//get users
const getExistingUsers = async (req, res) => {
    try {
        const userId = req.userId;
        if (!logIn) {
            // const users = await User.findOne({ userId });
            return res.status(404).json({
                status: "Error",
                message: "You are not logged in",
            });

        }
        if (logIn) {
            const users = await User.findOne({ userId });
            res.status(200).json({
                status: "success",
                message: "Logged In Users",
                data: users
            });
        }
        // res.status(200).json({
        //     status: "success",
        //     message: "Registered Users.",
        //     users
        // });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.query.userId;
        // const userId = "677d6daabad994aa4c835702";
        const { userName, email, password, age } = req.body;
        const user = await User.findByIdAndUpdate(userId);
        if (!user) {
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
    } catch (error) {
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

        // Send OTP email
        try {
            const otp = await generateOtp(email, 'forgotPassword');
            await sendOtpEmail(email, otp);
        } catch (error) {
            console.error("Error sending OTP email:", error.message);
            return res.status(500).json({
                status: "error",
                message: "Failed to send OTP email",
            });
        }

        // Send a single response
        return res.status(200).json({
            status: "success",
            message: "Forgot password OTP sent to your email",
            // data: { resetToken },
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server issue.",
        });
    }
};


const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        // const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: token,
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
        // user.resetPasswordToken = undefined;
        // user.resetPasswordTokenExpire = undefined;
        // user.fpOtp = undefined;
        // user.isVerifiedFPOtp = true;
        // user.fpOtpExpire = undefined;
        await user.save();

        // console.log("Done! password is reset for user:", user._id);

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
    logIn,
    updateUser,
    deleteUser,
    forgotPassword,
    resetPassword,
    verifyRegistrationOtp,
    verifyLoginOtp,
    verifyFPOtp,
};


