const express = require("express");
const router = express.Router();
// const User = require("../models/User");
const controllers = require("../controllers/Auth");
const controllers2 = require("../controllers/Trial");

router.post("/login", controllers2.login);

router.post("/sign-up", controllers2.signUp);

module.exports = router;
