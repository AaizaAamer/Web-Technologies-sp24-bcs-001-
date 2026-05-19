const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

/* REGISTER */
router.get("/register", authController.showRegister);
router.post("/register", authController.registerUser);

/* LOGIN */
router.get("/login", authController.showLogin);
router.post("/login", authController.loginUser);

/* PROFILE */
router.get("/profile", authMiddleware.isLoggedIn, authController.showProfile);

/* LOGOUT */
router.get("/logout", authController.logoutUser);

module.exports = router;