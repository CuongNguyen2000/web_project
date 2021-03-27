var express = require("express");
var router = express.Router();

var { isStudent } = require("../middleware/RequiresLogin");

var {
  GetStudentHome,
  getUpdateAccount,
  updateAccount,
  addArticle_student,
  getListArticles_student,
  getUpdateArticle_student,
  getArticleDetails,
  getListTopic,
  deleteArticle_student,
  // assignTopicForArticle_student,
  updateArticleInfo,
} = require("../controllers/StudentController");

var { multerInstance } = require("../middleware/uploadImage");
const Student = require("../models/StudentModel");
const Topic = require("../models/TopicModel");
const Articles = require("../models/ArticlesModel");

// The processing section for Student is below
// Student request

// Get Homepage
router.get("/home", isStudent, GetStudentHome);

// update password
router.get("/update_account/:id", isStudent, getUpdateAccount);
router.put("/update_account", isStudent, updateAccount);

// Get post articles page
router.get("/post_article", isStudent, getListTopic);

// Displaying list of student article
router.get("/list_articles", isStudent, getListArticles_student);

// GET article detail page
router.get("/article_detail", isStudent, getArticleDetails);

// GET/POST adding new article
router.get("/add_article", isStudent, (req, res, next) => {
  var Xmas95 = new Date();
  var day = Xmas95.getDate().toString().padStart(2, "0");
  var month = (Xmas95.getMonth() + 1).toString().padStart(2, "0");
  var year = Xmas95.getFullYear();
  let now = year + "-" + month + "-" + day;

  const _id = req.query.id;
  Student.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      Topic.findOne({ _id: _id })
        .exec()
        .then((topic) => {
          // console.log(topic.timeOver);
          if (topic.timeOver > now) {
            res.render("studentViews/student_add_article", {
              topic: topic,
              info: info,
            });
          } else {
            const msg =
              "The time allowed to post has expired !!! --- If you have a problem, please contact the Marketing Coordinator of your faculty.";
            res.render("studentViews/student_add_article", {
              err: msg,
              topic: topic,
              info: info,
            });
          }
        });
    });
});

router.post("/add_article", multerInstance, isStudent, addArticle_student);

// Delete article
router.delete("/delete_article", isStudent, deleteArticle_student);

// Assign a topic for article
// router.put("/assign_topic_article", isStudent, assignTopicForArticle_student);

// GET update page article
router.post("/update_article/:id", isStudent, getUpdateArticle_student);

// update article Information
router.post(
  "/update_article_information",
  multerInstance,
  isStudent,
  updateArticleInfo
);

// GET page term and conditions
router.get("/term_and_conditions", isStudent, (req, res, next) => {
  res.render("studentViews/term_conditions");
});

module.exports = router;
