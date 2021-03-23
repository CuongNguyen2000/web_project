var express = require("express");
var router = express.Router();

var { isManager } = require("../middleware/RequiresLogin");

var {
  GetManagerHome,
  getListArticles_manager,
  getStatistics_manager,
  getDetailStatistics,
  downloadFile,
} = require("../controllers/ManagerController");

// The processing section for Marketing Manager is below
// Manager Request

// Get Homepage
router.get("/home", isManager, GetManagerHome);

// get list article page
router.get("/list_articles", isManager, getListArticles_manager);

// get statistics page
router.get("/statistic_contributions", isManager, getStatistics_manager);

// Get detail statistic page
router.get("/detail_statistic/:id", isManager, getDetailStatistics);

router.post("/downloadFile", isManager, downloadFile);

router.get("/downloadFile", isManager, (req, res, next) => {
  var x = __dirname.replace("routes", "public/") + "fileDownload.zip";
  console.log("===========");
  console.log(x);
  res.download(x);
});

module.exports = router;
