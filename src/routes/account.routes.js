const express = require("express");
const AccountController = require("../controllers/account.controllers");
const { validatePassword } = require("../middlewares/account.middleware");

const router = express.Router();

router.post("/register", validatePassword, AccountController.register);
router.post("/login", AccountController.login);
// router.post("/login-google", AccountController.loginGoogle);

router.get("/verify-email", AccountController.verifyEmail);

module.exports = router;
