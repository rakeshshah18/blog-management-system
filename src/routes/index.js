const userRegisterRoute = require("./userRoutes");
const userRoutes = require("./userRoutes");
const blogsRoutes = require("./blogsRoutes");
const express = require("express");
const router = express.Router();

router.use("/register", userRegisterRoute);
router.use("/users", userRoutes);
router.use("/blogs", blogsRoutes);

module.exports = router;
