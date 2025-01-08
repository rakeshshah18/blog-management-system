const userRegisterRoute = require("./userRoutes");
const userRoutes = require("./userRoutes");
const blogsRoutes = require("./blogsRoutes");
const express = require("express");
const router = express.Router();

router.use("/register", userRegisterRoute);
router.use("/users", userRoutes);
router.use("/update", userRoutes)
router.use("/delete", userRoutes)
router.use("/blogs", blogsRoutes);
router.use("/update", blogsRoutes)
router.use("/delete", blogsRoutes)

module.exports = router;
