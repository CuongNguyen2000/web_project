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

const getReviewArticles = (req, res, next) => {
  const _id = req.query.id;
  Coordinator.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      Articles.findOne({ _id: _id })
        .sort("comments")
        .populate("topic_id")
        .populate("comments")
        // .populate("comments")
        .exec()
        .then((value) => {
          console.log(value);
          res.render("coordinatorViews/article_detail", {
            value: value,
            info: info,
          });
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
          var obj = {
            author: info._id,
            comment: req.body.comment,
          };

          Comment.create(obj, (err, item) => {
            if (err) {
              console.log(err);
            } else {
              item.save();
              article.comments.push(item);
              article.save();

              res.redirect("/coordinators/article_detail?id=" + article._id);
            }
          });
        });
    });
  // const { _id, comment } = req.body;
  // Articles.findOneAndUpdate(
  //   { _id: _id },
  //   {
  //     $push: {
  //       comments: { comment: comment },
  //     },
  //   },
  //   { new: true, useFindAndModify: false }
  // )
  //   .exec()
  //   .then((value) => {
  //     console.log(value);
  //     res.redirect("/coordinators/article_detail?id=" + value._id);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.send(err);
  //   });
};

// Delete Comments
const deleteComment = async (req, res, next) => {
  const { _id } = req.body;
  await Articles.findOne({ comments: _id })
    .exec()
    .then((value) => {
      Articles.findOneAndUpdate(
        { comments: _id },
        { $pull: { comments: { comment: _id } } },
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
            console.log("OK");
            return res.redirect("/coordinators/article_detail?id=" + value._id);
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

const getListByTechnology_coordinator = async (req, res, next) => {
  const topicName = await Topic.findOne({ name: "Technologies" });
  Coordinator.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      Topic.findOne({ _id: topicName })
        .exec()
        .then((topic) => {
          if (info.faculty_id) {
            Articles.find({
              topic_id: topic._id,
              faculty_id: info.faculty_id,
            }).exec((err, items) => {
              if (err) {
                console.log(err);
                res.status(500).send("An error occurred", err);
              } else {
                console.log(items);
                res.render("coordinatorViews/list_technologies_articles", {
                  items: items,
                  info: info,
                });
              }
            });
          }
        });
    });
};

const getListByFC_coordinator = async (req, res, next) => {
  const topicName = await Topic.findOne({ name: "Foods and Cooking" });
  Coordinator.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      Topic.findOne({ _id: topicName })
        .exec()
        .then((topic) => {
          if (info.faculty_id) {
            Articles.find({
              topic_id: topic._id,
              faculty_id: info.faculty_id,
            }).exec((err, items) => {
              if (err) {
                console.log(err);
                res.status(500).send("An error occurred", err);
              } else {
                console.log(items);
                res.render("coordinatorViews/list_F&C_articles", {
                  items: items,
                  info: info,
                });
              }
            });
          }
        });
    });
};

module.exports = {
  GetCoordinatorHome,
  getListArticles_coordinator,
  acceptArticle_coordinator,
  getListByTechnology_coordinator,
  getListByFC_coordinator,
  getReviewArticles,
  doComment,
  deleteComment,
};
