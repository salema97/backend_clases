const express = require("express");
const AccountController = require("../controllers/account.controllers");
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/account.middleware");
const { errorHandler } = require("../middlewares/error.interception");

const router = express.Router();

router.use(errorHandler);

AccountController.registerDefaultAdmin();

router.post("/register", validateRegister, AccountController.register);

router.post("/login", validateLogin, AccountController.login);

router.post("/auth/google", AccountController.loginGoogle);

router.get("/verify-email", AccountController.verifyEmail);

router.post("/reset-password", AccountController.resetPassword);

router.post("/change-password", AccountController.changePassword);

module.exports = router;
