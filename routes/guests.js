var express = require("express");
var router = express.Router();

var { GetGuestHome } = require("../controllers/guestController");

var { isGuest } = require("../middleware/RequiresLogin");

// The processing section for guest is below
// Guest request

// Get Homepage
router.get("/home", isGuest, GetGuestHome);

module.exports = router;
