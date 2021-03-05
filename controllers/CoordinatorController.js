var AppUser = require("../models/AppUserModel");
var Coordinator = require("../models/CoordinatorModel");
var Faculty = require("../models/FacultyModel");
var Articles = require("../models/ArticlesModel");
const Student = require("../models/StudentModel");
var Topic = require("../models/TopicModel");

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
  Coordinator.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      if (info.faculty_id) {
        Articles.find({ faculty_id: info.faculty_id }).exec((err, items) => {
          if (err) {
            console.log(err);
            res.status(500).send("An error occurred", err);
          } else {
            console.log(items);
            res.render("coordinatorViews/coordinator_list_articles", {
              items: items,
            });
          }
        });
      }
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

const getListByTechnology_coordinator = async (req, res, next) => {
  // try {
  //   const topic = await Topic.findOne({ name: "Technologies" });
  //   if (topic) {
  //     const articles = await Articles.find({ topic_id: topic._id }).limit(100);

  //     if (articles) {
  //       res.render("coordinatorViews/list_technologies_articles", {
  //         articles,
  //         topic,
  //       });
  //     }
  //   }
  // } catch (error) {}

  Topic.findOne({ _id: "603c9e857c128717dc409c51" })
    .exec()
    .then((topic) => {
      Articles.find({ topic_id: topic._id }, (err, items) => {
        if (err) {
          console.log(err);
          res.status(500).send("An error occurred", err);
        } else {
          console.log(items);
          res.render("coordinatorViews/list_technologies_articles", {
            items: items,
          });
        }
      });
    });
};

const getListByFC_coordinator = (req, res, next) => {
  Topic.findOne({ _id: "603c9ec87c128717dc409c52" })
    .exec()
    .then((topic) => {
      Articles.find({ topic_id: topic._id }, (err, items) => {
        if (err) {
          console.log(err);
          res.status(500).send("An error occurred", err);
        } else {
          console.log(items);
          res.render("coordinatorViews/list_F&C_articles", {
            items: items,
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
};
