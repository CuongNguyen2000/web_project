var express = require("express");
var router = express.Router();

var { isCoordinator } = require("../middleware/RequiresLogin");

var {
  GetCoordinatorHome,
  getListArticles_coordinator,
  acceptArticle_coordinator,
  getReviewArticles,
  doComment,
  deleteComment,
} = require("../controllers/CoordinatorController");

// The processing section for Marketing Coordinator is below
// Coordinator request

// Get Homepage
router.get("/home", isCoordinator, GetCoordinatorHome);

// get list of article page
router.get("/list_articles", isCoordinator, getListArticles_coordinator);

// accept article for publication
router.put("/accept_article", isCoordinator, acceptArticle_coordinator);

router.get("/article_detail", isCoordinator, getReviewArticles);

router.post("/do_comment", isCoordinator, doComment);

router.delete("/delete_comment", isCoordinator, deleteComment);

module.exports = router;
