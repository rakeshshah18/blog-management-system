const nodemailer = require('nodemailer');

const transpoter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '21amtics464@gmail.com',
        pass: 'Ambica@125',
    },
});

const sendOtpEmail = async ( email, otp) => {
    const mailOptions = {
        from: '21amtics464@gmail.com',
        to: email,
        subject: 'Your OTP',
        text: `Your OTP is ${otp}`
        };
    return transpoter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };