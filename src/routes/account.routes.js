const express = require("express");
const AccountController = require("../controllers/account.controllers");

const router = express.Router();

router.post("/register", AccountController.register);
router.post("/login", AccountController.login);

module.exports = router;
