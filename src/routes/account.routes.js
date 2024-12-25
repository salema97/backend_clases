const express = require("express");
const AccountController = require("../controllers/account.controllers");
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/account.middleware");
const passport = require("../middlewares/passport");
const { errorHandler } = require("../middlewares/error.interception");

const router = express.Router();

router.use(errorHandler);

AccountController.registerDefaultAdmin();

router.post("/register", validateRegister, AccountController.register);

router.post("/login", validateLogin, AccountController.login);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  AccountController.loginGoogle
);

router.get("/verify-email", AccountController.verifyEmail);

module.exports = router;
