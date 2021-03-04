var AppUser = require("../models/AppUserModel");
var Student = require("../models/StudentModel");
var Articles = require("../models/ArticlesModel");
var Faculty = require("../models/FacultyModel");
var Topic = require("../models/TopicModel");

const GetStudentHome = (req, res, next) => {
  let user = {};
  let info = {};

  AppUser.findOne({ _id: req.session.userId })
    .exec()
    .then((value) => {
      user = {
        _id: value._id,
        username: value.username,
      };
      Student.findOne({ account_id: req.session.userId })
        .exec()
        .then((value) => {
          info = {
            name: value.name,
            email: value.email,
          };
          if (value.faculty_id) {
            Faculty.findOne({ _id: value.faculty_id })
              .exec()
              .then((assign) => {
                // console.log(assign);
                res.render("studentViews/student_home", {
                  data: {
                    _id: value._id,
                    user: user,
                    info: info,
                    assign: assign.name,
                  },
                });
              });
          } else {
            res.render("studentViews/student_home", {
              data: {
                _id: value._id,
                user: user,
                info: info,
              },
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/students/home");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/students/home");
    });
};

const addArticle_student = async (req, res, next) => {
  Student.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      if (info.faculty_id) {
        Faculty.findOne({ _id: info.faculty_id })
          .exec()
          .then((faculty) => {
            var obj = {
              name: req.body.name,
              desc: req.body.desc,
              articleImage: req.file.filename,
              faculty_id: faculty._id,
            };

            Articles.create(obj, (err, item) => {
              if (err) {
                console.log(err);
              } else {
                item.save();
                info.posts.push(item);
                info.save();
                res.redirect("/students/list_articles");
              }
            });
          });
      }
    });
};

const getListArticles_student = (req, res, next) => {
  Student.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      if (info.posts) {
        Articles.find({ _id: info.posts }).exec((err, items) => {
          if (err) {
            console.log(err);
            res.status(500).send("An error occurred", err);
          } else {
            console.log(items);
            res.render("studentViews/student_list_articles", { items: items });
          }
        });
      }
    });
};

const getUpdateArticle_student = (req, res, next) => {
  const { _id } = req.body;
  Articles.findOne({ _id: _id })
    .exec()
    .then((value) => {
      Topic.find({})
        .exec()
        .then((topic) => {
          if (value.topic_id) {
            Topic.findOne({ _id: value.topic_id })
              .exec()
              .then((assign) => {
                console.log(assign);
                res.render("studentViews/student_update_article", {
                  data: {
                    _id: value._id,
                    assign: assign.name,
                    topic: topic,
                  },
                });
              })
              .catch();
          } else {
            res.render("studentViews/student_update_article", {
              data: {
                _id: value._id,
                topic: topic,
              },
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/students/list_articles");
    });
};

// Assign article to Topic
const assignTopicForArticle_student = (req, res, next) => {
  const { _id, topic } = req.body;
  console.log(topic, _id);
  Articles.findOneAndUpdate(
    { _id: _id },
    { $set: { topic_id: topic } },
    { new: true, useFindAndModify: false }
  )
    .exec()
    .then((value) => {
      console.log(value);
      res.redirect("/students/list_articles");
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

const deleteArticle_student = async (req, res, next) => {
  const { name, email, _id } = req.body;
  await Articles.findOneAndRemove({ _id: _id }, (err) => {
    if (err) {
      console.log(err);
      return res.redirect("/students/list_articles");
    } else {
      console.log("Ok");
      Student.findOneAndUpdate(
        { posts: _id },
        { $pull: { posts: _id } },
        (err, data) => {
          if (err) {
            res.render("error", {
              message: "Sorry failed to delete post id in students",
              error: {
                status: err,
                stacks: "failed to delete post id in students",
              },
            });
          } else {
            console.log("OK");
            return res.redirect("/students/list_articles");
          }
        }
      );
    }
  });
};

module.exports = {
  GetStudentHome,
  addArticle_student,
  getListArticles_student,
  getUpdateArticle_student,
  deleteArticle_student,
  assignTopicForArticle_student,
};
