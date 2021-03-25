var express = require("express");
var router = express.Router();

var { isCoordinator } = require("../middleware/RequiresLogin");

var {
  GetCoordinatorHome,
  getUpdateAccount,
  updateAccount,
  getListArticles_coordinator,
  acceptArticle_coordinator,
  rejectArticle_coordinator,
  getReviewArticles,
  doComment,
  deleteComment,
} = require("../controllers/CoordinatorController");

// The processing section for Marketing Coordinator is below
// Coordinator request

// Get Homepage
router.get("/home", isCoordinator, GetCoordinatorHome);

// Update Password
router.get("/update_account/:id", isCoordinator, getUpdateAccount);
router.put("/update_account", isCoordinator, updateAccount);

// get list of article page
router.get("/list_articles", isCoordinator, getListArticles_coordinator);

// accept article for publication
router.put("/accept_article", isCoordinator, acceptArticle_coordinator);

// reject article for publication
router.put("/reject_article", isCoordinator, rejectArticle_coordinator);

router.get("/article_detail", isCoordinator, getReviewArticles);

router.post("/do_comment", isCoordinator, doComment);

router.delete("/delete_comment", isCoordinator, deleteComment);

module.exports = router;
