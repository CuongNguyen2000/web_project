var express = require("express");
var router = express.Router();

var { Login, Logout, SignUp } = require("../controllers/LoginControllers");

const { route } = require(".");

/* ================================================================
===================================================================
===================================================================
===================================================================
=================================================================== */

// Get login page
router.get("/login", (req, res, next) => {
  const { msg } = req.query;
  res.render("login", { err: msg });
});

// Get login / logout request
router.post("/login", Login);
router.get("/logout", Logout);
router.get("/signup", SignUp);

module.exports = router;
