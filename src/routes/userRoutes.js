const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyJwtToken = require("../middleware/jwt");


// Register and verify OTP
router.post("/register", userController.createNewUser);
router.post("/verify-otp", userController.verifyRegistrationOtp);
router.post("/verify-login-otp", userController.verifyLoginOtp);

// Login and forgot password
router.post("/login", userController.logIn);
router.post("/forgot-password", userController.forgotPassword);
router.post("/verifyOtp-forgot-pass", userController.verifyFPOtp);
router.post("/reset-password", userController.resetPassword);

// User actions
router.get("/", verifyJwtToken,  userController.getExistingUsers);
router.put("/update", verifyJwtToken, userController.updateUser);
router.delete("/delete", verifyJwtToken, userController.deleteUser);
module.exports = router;
