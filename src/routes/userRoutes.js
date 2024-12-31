const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// creating a new user
router.post("/registerNewUser", userController.createNewUser);
router.get("/", userController.getExistingUsers);

module.exports = router;
