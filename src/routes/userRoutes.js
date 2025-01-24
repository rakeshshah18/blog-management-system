const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyJwtToken = require("../middleware/jwt");
const verifyOtp  = require('../middleware/otp')


// creating a new user
router.post("/register", userController.createNewUser);
router.post("/verify-otp", verifyOtp);
router.get("/", verifyJwtToken,  userController.getExistingUsers);
router.post("/login", userController.isLogIn);
router.put("/update", verifyJwtToken, userController.updateUser);
router.delete("/delete", verifyJwtToken, userController.deleteUser);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
module.exports = router;
