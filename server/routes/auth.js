const express = require("express");

const router = express.Router();
const authController = require("../controllers/authController");

router.get("/verify/:id", authController.verify);

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotpassword", authController.forgotPassword);
router.post("/resetpassword", authController.resetPassword);

module.exports = router;
