var express = require("express");
var router = express.Router();

var { isStudent } = require("../middleware/RequiresLogin");

var {
  GetStudentHome,
  addArticle_student,
  getListArticles_student,
  getUpdateArticle_student,
  getListTopic,
  deleteArticle_student,
  assignTopicForArticle_student,
} = require("../controllers/StudentController");

var multerInstance = require("../middleware/uploadImage");
const Student = require("../models/StudentModel");
const Topic = require("../models/TopicModel");
const Articles = require("../models/ArticlesModel");

// The processing section for Student is below
// Student request

// Get Homepage
router.get("/home", isStudent, GetStudentHome);

// Get post articles page
router.get("/post_article", isStudent, getListTopic);

// Displaying list of student article
router.get("/list_articles", isStudent, getListArticles_student);

// GET/POST adding new article
router.get("/add_article", isStudent, (req, res, next) => {
  const _id = req.query.id;
  Student.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      Articles.findOne({ topic_id: _id })
        .exec()
        .then((articles) => {
          res.render("studentViews/student_add_article", {
            articles: articles,
            info: info,
          });
        });
    });
});

router.post("/add_article", multerInstance, isStudent, addArticle_student);

// Delete article
router.delete("/delete_article", isStudent, deleteArticle_student);

// Assign a topic for article
router.put("/assign_topic_article", isStudent, assignTopicForArticle_student);

// GET update page article
router.post("/update_article", isStudent, getUpdateArticle_student);

// GET page term and conditions
router.get("/term_and_conditions", isStudent, (req, res, next) => {
  res.render("studentViews/term_conditions");
});

module.exports = router;
