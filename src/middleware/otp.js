const User = require('../models/userModel')


const verifyOtp = async (req, res) => {
    try {
        const { email, otp} = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isVerified) {
            return res.status(400).json({
                status: "error",
                message: "Your account is already verified."
            });
        }
        if (user.otp !== otp || user.otpExpire < Date.now()) {
            return res.status(400).json({
                status: "error",
                message: "Invalid OTP or OTP has expired."
            });
        }
        user.isVerified = true;
        user.otp = null;
        user.otpExpire = null;
        await user.save();
        res.status(200).json({
            status: "success",
            message: "Your account is verified successfully."
        });
    }catch(error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Error while verifying OTP." 
        });
    }
};
module.exports = verifyOtp;