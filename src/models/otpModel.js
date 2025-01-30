const { required } = require('joi');
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    type: {
        type: String,

        otpType: { type: String, enum: ['registration', 'login', 'forgotPassword'], required: true },
    },
    // createdAt: Date.now(),
    // expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes

    isVerified: {
        type: Boolean,
        default: false
    },
    isExpired: {
        type: Boolean,
        default: false
    },
});

const Otp = mongoose.model('Otp', otpSchema);

const generateOtp = async (email, type) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.create({ email, otp, type });
    return otp;
};

const verifyOtp = async (email, otp, type) => {
    try {
        console.log(`Verifying OTP for ${email}, Type: ${type}, OTP: ${otp}`);
        const otpRecord = await Otp.findOne({ email, otp, type, });
        if (!otpRecord) {
            console.error("OTP not found or incorrect.");
            return false;
        }
        console.log("OTP verified successfully. Deleting from DB...");
        await Otp.deleteOne({ _id: otpRecord._id });
        return true;
    } catch (error) {
        console.error("Error in verifying OTP", error);
        return false;
    }
};



module.exports = { Otp, generateOtp, verifyOtp };