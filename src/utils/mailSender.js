const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: process.env.MAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER || "21amtics464@gmail.com",
        pass: process.env.MAIL_PASS || "Ambica@125",
    },
});

const sendOtpEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}`,
        });
        console.log("OTP email sent successfully");
    } catch (error) {
        console.error("Error sending OTP email:", error.message);
    }
};

module.exports = { sendOtpEmail };