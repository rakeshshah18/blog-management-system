const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyJwtToken = require("../middleware/jwt");
const verifyOtp  = require('../middleware/otp')
const verifyOtpLogin = require('../middleware/loginOtp')

// creating a new user
router.post("/register", userController.createNewUser);
router.post("/verify-otp", verifyOtp);
router.post("/verify-login-otp", verifyOtpLogin);
router.get("/", verifyJwtToken,  userController.getExistingUsers);
router.post("/login", userController.logIn);
router.put("/update", verifyJwtToken, userController.updateUser);
router.delete("/delete", verifyJwtToken, userController.deleteUser);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
module.exports = router;
