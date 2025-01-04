const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");
const verifyUser = require("../middleware/auth");
const upload = require("../config/multer");
const verifyJwtToken = require('../middleware/jwt')

//methods
router.get("/", verifyJwtToken, blogController.getUserBlog);
router.post(
    "/createNewBlog",
    verifyJwtToken,
    verifyUser,
    upload.single("image"),
    blogController.postBlog

);

module.exports = router;