const express = require("express");
const AccountController = require("../controllers/account.controllers");
const { validatePassword } = require("../middlewares/account.middleware");

const router = express.Router();

router.post("/register", validatePassword, AccountController.register);
router.post("/login", AccountController.login);

module.exports = router;
