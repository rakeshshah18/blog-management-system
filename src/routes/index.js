const userRegisterRoute = require("./userRoutes");
const userRoutes = require("./userRoutes");
const blogsRoutes = require("./blogsRoutes");
// const otpRoutes = require('./otpRoutes')
const express = require("express");
// const authController = require('../controllers/authController');
const router = express.Router();

router.use("/new-user", userRegisterRoute);
router.use("/users", userRoutes);
router.use("/update", userRoutes)
router.use("/delete", userRoutes)
router.use("/blogs", blogsRoutes);
router.use("/update", blogsRoutes)
router.use("/delete", blogsRoutes)
router.use("forgotPassword", userRoutes)
router.use("/resetPassword", userRoutes)
router.use("/otp", userRoutes)

module.exports = router;
