const express = require("express");
const router = express.Router();
const userRoute = require("./user.js");
const flash = require('req-flash');
router.use(flash());

router.use(userRoute);

module.exports = router;
