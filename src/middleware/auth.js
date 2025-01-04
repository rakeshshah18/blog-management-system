const User = require("../models/userModel");

const verifyUser = async (req, res, next) => {
  try {
    const userId = req.body.user || req.query.userId;
    console.log("receved user id : ", userId);
    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "Please Provide User ID."
      });
    }


    const user = await User.findById(userId);
    //current user
    console.log("current user id", user);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "This user is not registered."
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in verifyUser middleware", error.message);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
};

module.exports = verifyUser;
