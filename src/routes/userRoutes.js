const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyJwtToken = require("../middleware/jwt");

// creating a new user
router.post("/register", userController.createNewUser);
router.get("/", verifyJwtToken, userController.getExistingUsers);
router.post("/login", userController.loginUser);
router.put("/update", verifyJwtToken, userController.updateUser);
router.delete("/delete", verifyJwtToken, userController.deleteUser);
module.exports = router;
