const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config/config")


const verifyJwtToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ 
            status: "error", 
            message: 'User is Unauthorized.' 
        });
    }
    // try {

    // }catch(error){}

    try {
        const verifying = jwt.verify(token, JWT_SECRET);
        // console.log(verifying)
        req.userId = verifying._id;
        // req.params.user = verifying.id;
        // return res.status(200).json({
        //     status: "success",
        //     message: "logged in user",
        //     data: users.user 
        // })

        next();
    } catch (error) {
        console.error("Token Verification Error:", error.message);
        return res.status(403).json({ 
            status: "error",
            message: "Token is invallid." 
        });
    }
};

module.exports = verifyJwtToken;