const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");
const verifyUser = require("../middleware/auth");
const upload = require("../config/multer");

//methods
router.get("/", blogController.getUserBlog);
router.post(
    "/createNewBlog",
    verifyUser,
    upload.single("image"),
    blogController.postBlog

);
// upload.single('image')  -add this line at the end of the above line when file upload.

module.exports = router;