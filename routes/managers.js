var express = require("express");
var router = express.Router();

var { isManager } = require("../middleware/RequiresLogin");

var {
  GetManagerHome,
  getListArticles_manager,
  getStatistics_manager,
} = require("../controllers/ManagerController");

// The processing section for Marketing Manager is below
// Manager Request

// Get Homepage
router.get("/home", isManager, GetManagerHome);

// get list article page
router.get("/list_articles", isManager, getListArticles_manager);

// get statistics page
router.get("/statistic_contributions", isManager, getStatistics_manager);

module.exports = router;
