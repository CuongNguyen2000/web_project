var express = require("express");
var router = express.Router();

var { isManager } = require("../middleware/RequiresLogin");

var {
  GetManagerHome,
  getListArticles_manager,
} = require("../controllers/ManagerController");

// The processing section for Marketing Manager is below
// Manager Request

// Get Homepage
router.get("/home", isManager, GetManagerHome);

// get list article page
router.get("/list_articles", isManager, getListArticles_manager);

module.exports = router;
