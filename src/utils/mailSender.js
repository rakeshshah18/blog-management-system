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

const sendLoginOtp = async (eamil, loginOtp) => {
    try{
    const transpoter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '21amtics464@gmail.com' || process.env.EMAIL,
            pass: 'Ambica@125' || process.env.PASSWORD,
        },
    });
    const mailOptions = {
        from: '21amtics464@gmail.com' || process.env.EMAIL,
        to: eamil,
        subject: 'Your OTP',
        text: `Your OTP is ${loginOtp}`,
    };
    transpoter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error in sending email: ", error);
        }else{
            console.log("Email Sent: ", info.response);
        }
    });
}catch(error){
    console.error("Error in sendLoginOtp:", error);
    throw error;
}
}

module.exports = { sendOtpEmail, sendLoginOtp };