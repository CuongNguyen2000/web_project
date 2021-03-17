var express = require("express");
var router = express.Router();

var { isCoordinator } = require("../middleware/RequiresLogin");

var {
  GetCoordinatorHome,
  getListArticles_coordinator,
  acceptArticle_coordinator,
  getListByTechnology_coordinator,
  getListByFC_coordinator,
  getReviewArticles,
  doComment,
} = require("../controllers/CoordinatorController");

// The processing section for Marketing Coordinator is below
// Coordinator request

// Get Homepage
router.get("/home", isCoordinator, GetCoordinatorHome);

// get list of article page
router.get("/list_articles", isCoordinator, getListArticles_coordinator);

// accept article for publication
router.put("/accept_article", isCoordinator, acceptArticle_coordinator);

router.get(
  "/list_technologies_articles",
  isCoordinator,
  getListByTechnology_coordinator
);

router.get("/list_F&C_articles", isCoordinator, getListByFC_coordinator);

router.get("/article_detail", isCoordinator, getReviewArticles);

router.post("/do_comment", isCoordinator, doComment);

module.exports = router;
