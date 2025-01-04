const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyJwtToken = require("../middleware/jwt");

// creating a new user
router.post("/register", userController.createNewUser);
router.get("/", verifyJwtToken, userController.getExistingUsers);

module.exports = router;
