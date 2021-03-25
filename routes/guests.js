var express = require("express");
var router = express.Router();

var {
  GetGuestHome,
  getUpdateAccount,
  updateAccount,
} = require("../controllers/guestController");

var { isGuest } = require("../middleware/RequiresLogin");

// The processing section for guest is below
// Guest request

// Get Homepage
router.get("/home", isGuest, GetGuestHome);

// Update account
router.get("/update_account/:id", isGuest, getUpdateAccount);
router.put("/update_account", isGuest, updateAccount);

module.exports = router;
