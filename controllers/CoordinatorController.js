const AppUser = require("../models/AppUserModel");
const Coordinator = require("../models/CoordinatorModel");
const Faculty = require("../models/FacultyModel");
const Articles = require("../models/ArticlesModel");
const Student = require("../models/StudentModel");
const Topic = require("../models/TopicModel");
const Comment = require("../models/commentModel");

const GetCoordinatorHome = (req, res, next) => {
  let user = {};
  let info = {};

  AppUser.findOne({ _id: req.session.userId })
    .exec()
    .then((value) => {
      user = {
        _id: value._id,
        username: value.username,
      };
      Coordinator.findOne({ account_id: req.session.userId })
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
                console.log(assign);
                res.render("coordinatorViews/coordinator_home", {
                  data: {
                    _id: value._id,
                    user: user,
                    info: info,
                    assign: assign.name,
                  },
                });
              });
          } else {
            res.render("coordinatorViews/coordinator_home", {
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
          res.redirect("/coordinators/home");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/coordinators/home");
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
      Coordinator.findOne({ account_id: _id })
        .exec()
        .then((info) => {
          res.render("coordinatorViews/update_account", {
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
          res.redirect("/coordinators/home");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/coordinators/home");
    });
};

const updateAccount = async (req, res, next) => {
  const { pwd, _id } = req.body;
  const newValue = {};
  if (pwd) newValue.password = pwd;

  await AppUser.findOne({ _id: _id }).exec(async (err, user) => {
    if (err) {
      return console.log(err);
    } else if (pwd.length < 4) {
      const msg = "Password must be at least 4 characters !!!";
      return res.redirect(`/coordinators/update_account/${_id}?msg=${msg}`);
    } else {
      Coordinator.findOne({ account_id: _id })
        .exec()
        .then((value) => {
          AppUser.findOneAndUpdate(
            { _id: _id },
            { $set: newValue },
            { new: true },
            (err, data) => {
              if (err) {
                console.log(err);
                return res.render("coordinatorViews/update_account");
              } else {
                console.log(data);
                return res.redirect("/coordinators/home");
              }
            }
          );
        });
    }
  });
};

const getListArticles_coordinator = (req, res, next) => {
  const _id = req.query.topicID;
  let query = {};
  if (_id) {
    query.topic_id = _id;
  }
  Coordinator.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      Topic.find({})
        .exec()
        .then((topic) => {
          if (info.faculty_id) {
            query.faculty_id = info.faculty_id;
            Articles.find({ ...query })
              .populate("topic_id")
              .populate("author")
              .exec((err, items) => {
                if (err) {
                  console.log(err);
                  res.status(500).send("An error occurred", err);
                } else {
                  console.log(items);
                  res.render("coordinatorViews/coordinator_list_articles", {
                    items: items,
                    info: info,
                    topic: topic,
                  });
                }
              });
          }
        });
    });
};

const acceptArticle_coordinator = (req, res, next) => {
  const { _id } = req.body;
  Articles.findByIdAndUpdate(
    { _id: _id },
    { $set: { status: true } },
    { new: true, useFindAndModify: false }
  )
    .exec()
    .then((value) => {
      console.log(value);
      res.redirect("/coordinators/list_articles");
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

const rejectArticle_coordinator = (req, res, next) => {
  const { _id } = req.body;
  Articles.findByIdAndUpdate(
    { _id: _id },
    { $set: { status: false } },
    { new: true, useFindAndModify: false }
  )
    .exec()
    .then((value) => {
      console.log(value);
      res.redirect("/coordinators/list_articles");
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

const getReviewArticles = (req, res, next) => {
  var Xmas95 = new Date();
  var day = Xmas95.getDate().toString().padStart(2, "0");
  var month = (Xmas95.getMonth() + 1).toString().padStart(2, "0");
  var year = Xmas95.getFullYear();
  let now = year + "-" + month + "-" + day;

  const _id = req.query.id;
  Coordinator.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      Articles.findOne({ _id: _id })
        .sort("comments")
        .populate("topic_id")
        .populate("comments")
        .exec()
        .then((value) => {
          console.log(value);
          if (value.topic_id.timeOver > now) {
            res.render("coordinatorViews/article_detail", {
              value: value,
              info: info,
            });
          } else {
            const msg =
              "Comment allow time has expired !!! You cannot feedback student articles anymore.";
            res.render("coordinatorViews/article_detail", {
              err: msg,
              value: value,
              info: info,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/coordinators/article_detail");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/coordinators/article_detail");
    });
};

const doComment = (req, res, next) => {
  const { _id } = req.body;
  console.log(_id);
  Coordinator.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      Articles.findOne({ _id: _id })
        .exec()
        .then((article) => {
          console.log(article);
          var obj = {
            author: info._id,
            comment: req.body.comment,
          };

          Comment.create(obj, (err, item) => {
            if (err) {
              console.log(err);
            } else {
              item.save();
              // console.log(item);
              article.comments.push(item);
              article.save();

              res.redirect("/coordinators/article_detail?id=" + article._id);
            }
          });
        });
    });
};

// Delete Comments
const deleteComment = async (req, res, next) => {
  const { _id } = req.body;
  await Articles.findOne({ comments: _id })
    .exec()
    .then((value) => {
      Articles.findOneAndUpdate(
        { comments: _id },
        { $pull: { comments: _id } },
        { safe: true, upsert: true },
        (err, data) => {
          if (err) {
            res.render("error", {
              message: "Sorry failed to delete comment id in article",
              error: {
                status: err,
                stacks: "failed to delete comment in article",
              },
            });
          } else {
            console.log("Delete successfully in array from Article");
            Comment.findOneAndRemove({ _id: value.comments }, (err) => {
              if (err) {
                console.log(err);
                return res.redirect(
                  "/coordinators/article_detail?id=" + value._id
                );
              } else {
                console.log("Delete successfully in Comment");
                return res.redirect(
                  "/coordinators/article_detail?id=" + value._id
                );
              }
            });
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  GetCoordinatorHome,
  getUpdateAccount,
  updateAccount,
  getListArticles_coordinator,
  acceptArticle_coordinator,
  rejectArticle_coordinator,
  getReviewArticles,
  doComment,
  deleteComment,
};
