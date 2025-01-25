const User = require('../models/userModel')
// const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const verifyOtpLogin = async (req, res, next) => {
    try {
        const { email, loginOtp } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found.",
            });
        }

        console.log("User loginOtp:", user.loginOtp); // Debugging
        console.log("Provided loginOtp:", loginOtp); // Debugging
        console.log("loginOtpExpire:", user.loginOtpExpire);

        // Verify OTP and expiration
        if (user.loginOtp !== loginOtp || user.loginOtpExpire < Date.now()) {
            return res.status(400).json({
                status: "error",
                message: "Invalid or expired OTP.",
            });
        }

        // Clear OTP fields after verification
        user.loginOtp = null;
        user.loginOtpExpire = null;
        user.isLoginVerified = true;
        await user.save();

        // Generate a JWT token for the user
        const token = jwt.sign(
            { id: user._id },
            "secret-key",
            { expiresIn: "24h" }
        );

        res.status(200).json({
            status: "success",
            message: "Login successful.",
            data: { token },
        });
        next();
    } catch (error) {
        console.error("Verify OTP Login Error:", error.message);
        res.status(500).json({
            status: "error",
            message: "Could not verify OTP. Please try again.",
        });
    }
};

module.exports = verifyOtpLogin;