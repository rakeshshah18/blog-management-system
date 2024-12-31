const User = require('../models/userModel');


const verifyUser = async (req, res, next) => {
    try {
        const userId = req.body.user || req.query.userId;
        console.log("receved user id : ",userId)
        if(!userId){
            return res.status(400).json({message: "Please Provide User ID (form auth.js) "});
        };

        //check format
        const mongoose = require('mongoose');
        if(!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({message: "Invalid User ID format."});
        }


        const user = await User.findById(userId);
        //current user
        console.log("current user id",user);
        if(!user){
            return res.status(404).json({ message: "This user is not registered." })
        };
        req.user = user;
        next();
}catch(error){
    console.error("Error in verifyUser middleware", error.message);
    res.status(500).json({message: "Internal Server Error"});
    }
};

module.exports = verifyUser;