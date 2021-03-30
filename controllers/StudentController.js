var AppUser = require("../models/AppUserModel");
var Student = require("../models/StudentModel");
var Articles = require("../models/ArticlesModel");
var Faculty = require("../models/FacultyModel");
var Topic = require("../models/TopicModel");
const Coordinator = require("../models/CoordinatorModel");
const Comment = require("../models/commentModel");
var Nodemailer = require("../middleware/sendingEmail");

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

const getUpdateAccount = (req, res, next) => {
  let user = {};
  const _id = req.params.id;
  const { msg } = req.query;

  AppUser.findOne({ _id: _id })
    .exec()
    .then((value) => {
      user = {
        _id: _id,
        username: value.username,
      };
      Student.findOne({ account_id: _id })
        .exec()
        .then((info) => {
          res.render("studentViews/update_account", {
            err: msg,
            data: {
              _id: _id,
              info: info,
              user: user,
            },
          });
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

const updateAccount = async (req, res, next) => {
  const { usr, pwd, _id } = req.body;
  const newValue = {};
  if (usr) newValue.username = usr;
  if (pwd) newValue.password = pwd;

  await AppUser.findOne({ _id: _id }).exec(async (err, user) => {
    if (err) {
      return console.log(err);
    } else if (pwd.length < 4) {
      const errorPassword = "Password must be at least 4 characters !!!";
      return res.redirect(
        `/students/update_account/${_id}?msg=${errorPassword}`
      );
    } else {
      Student.findOne({ account_id: _id })
        .exec()
        .then((value) => {
          AppUser.findOneAndUpdate(
            { _id: _id },
            { $set: newValue },
            { new: true },
            (err, data) => {
              if (err) {
                console.log(err);
                return res.render("studentViews/update_account");
              } else {
                console.log(data);
                return res.redirect("/students/home");
              }
            }
          );
        });
    }
  });
};

const addArticle_student = async (req, res, next) => {
  const { _id } = req.body;
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
              topic_id: _id,
              author: info._id,
            };

            Articles.create(obj, async (err, item) => {
              if (err) {
                console.log(err);
              } else {
                item.save();
                info.posts.push(item);
                faculty.amountArticle.push(item);
                info.save();
                faculty.save();
                const coordinator = await Coordinator.findOne({
                  faculty_id: faculty._id,
                });
                // console.log(coordinator);
                await Nodemailer(coordinator.email)
                  .then((result) => {
                    console.log("Email sent...", result);
                  })
                  .catch((err) => {
                    console.log(err.message);
                  });
                res.redirect("/students/list_articles?id=" + _id);
              }
            });
          });
      }
    });
};

const getListTopic = (req, res, next) => {
  Student.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      Topic.find({})
        .exec()
        .then((topic) => {
          res.render("studentViews/student_post_article", {
            topic: topic,
            info: info,
          });
        })
        .catch((err) => {
          res.send(err);
        });
    });
};

const getListArticles_student = (req, res, next) => {
  const _id = req.query.id;
  Student.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      if (info.posts) {
        Articles.find({ _id: info.posts, topic_id: _id })
          .populate("topic_id")
          .exec((err, items) => {
            if (err) {
              console.log(err);
              res.status(500).send("An error occurred", err);
            } else {
              console.log(items);
              res.render("studentViews/student_list_articles", {
                items: items,
                info: info,
              });
            }
          });
      }
    });
};

const getUpdateArticle_student = (req, res, next) => {
  var Xmas95 = new Date();
  var day = Xmas95.getDate().toString().padStart(2, "0");
  var month = (Xmas95.getMonth() + 1).toString().padStart(2, "0");
  var year = Xmas95.getFullYear();
  let now = year + "-" + month + "-" + day;

  const _id = req.params.id;
  Student.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      Articles.findOne({ _id: _id })
        .populate("topic_id")
        .exec()
        .then((value) => {
          if (value.topic_id.timeOver > now) {
            Topic.find({})
              .exec()
              .then((topic) => {
                if (value.topic_id) {
                  Topic.findOne({ _id: value.topic_id })
                    .exec()
                    .then((assign) => {
                      console.log("Current Topic is: ", assign);
                      
                      res.render("studentViews/student_update_article", {
                        data: {
                          value: value,
                          _id: value._id,
                          assign: assign.name,
                        
                          info: info,
                        },
                      });
                    })
                    .catch();
                } else {
                  res.render("studentViews/student_update_article", {
                    data: {
                      value: value,
                      _id: value._id,
                      
                      info: info,
                    },
                  });
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            const msg =
              "The time allowed to post has expired and you can't edit your article !!!";
            res.render("studentViews/student_update_article", {
              data: {
                err: msg,
                value: value,
                _id: value._id,
                info: info,
              },
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/students/list_articles");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/students/list_articles");
    });
};

// Update article information
const updateArticleInfo = (req, res, next) => {
  const { _id, name, desc } = req.body;

  const newValue = {};
  // console.log(req.file);
  if (req.file) {
    const image = req.file.filename;
    newValue.articleImage = image;
  }
  if (name) newValue.name = name;
  if (desc) newValue.desc = desc;
  Articles.findOneAndUpdate(
    { _id: _id },
    { $set: newValue },
    { new: true, useFindAndModify: false }
  )
    .exec()
    .then((value) => {
      console.log("OK");
      console.log(value);
      res.redirect("/students/list_articles?id=" + value.topic_id);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

// Assign article to Topic
// const assignTopicForArticle_student = (req, res, next) => {
//   const { _id, topic } = req.body;

//   console.log(topic, _id);
//   Articles.findOneAndUpdate(
//     { _id: _id },
//     { $set: { topic_id: topic } },
//     { new: true, useFindAndModify: false }
//   )
//     .exec()
//     .then((value) => {
//       console.log(value);
//       res.redirect("/students/list_articles?id=" + value.topic_id);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.send(err);
//     });
// };

const deleteArticle_student = async (req, res, next) => {
  const { _id } = req.body;
  await Articles.findOne({ _id: _id })
    .exec()
    .then((value) => {
      Articles.findOneAndRemove({ _id: _id }, (err) => {
        if (err) {
          console.log(err);
          return res.redirect("/students/list_articles?id=" + value.topic_id);
        } else {
          console.log("====================================");
          console.log("Delete successfully in Articles");
          Comment.findOneAndRemove({ _id: value.comments }, (err) => {
            if (err) {
              console.log(err);
              return res.redirect(
                "/students/list_articles?id=" + value.topic_id
              );
            } else {
              console.log("Delete successfully in Comment");
              Student.findOneAndUpdate(
                { posts: _id },
                { $pull: { posts: _id } },
                { safe: true, upsert: true },
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
                    console.log("Delete successfully in array from Student");
                    Faculty.findOneAndUpdate(
                      { amountArticle: _id },
                      { $pull: { amountArticle: _id } },
                      { safe: true, upsert: true },
                      (err, data) => {
                        if (err) {
                          res.render("error", {
                            message:
                              "Sorry failed to delete Article id in amountArticle",
                            error: {
                              status: err,
                              stacks:
                                "failed to delete Article id in amountArticle",
                            },
                          });
                        } else {
                          console.log(
                            "Delete successfully in array from Faculty"
                          );
                          return res.redirect(
                            "/students/list_articles?id=" + value.topic_id
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        }
      });
    });
};

const getArticleDetails = (req, res, next) => {
  const _id = req.query.id;
  Student.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      Articles.findOne({ _id: _id })
        .populate("topic_id")
        .populate({
          path: "comments",
          populate: { path: "author" },
        })
        .exec()
        .then((value) => {
          console.log(value);
          res.render("studentViews/article_detail", {
            value: value,
            info: info,
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/students/article_detail");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/students/article_detail");
    });
};

module.exports = {
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
};
