var AppUser = require("../models/AppUserModel");
var Coordinator = require("../models/CoordinatorModel");
var Faculty = require("../models/FacultyModel");
var Articles = require("../models/ArticlesModel");
const Student = require("../models/StudentModel");

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
          res.redirect("/users/coordinator/home");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/users/coordinator/home");
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
            Student.find({ faculty_id: info.faculty_id }).exec(
              (err, infoStu) => {
                if (err) {
                  console.log(err);
                  res.status(500).send("An error occurred", err);
                } else {
                  console.log(infoStu);
                  res.render("coordinatorViews/coordinator_list_articles", {
                    infoStu: infoStu,
                  });
                }
              }
            );
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
      res.redirect("/users/coordinator/list_articles");
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

module.exports = {
  GetCoordinatorHome,
  getListArticles_coordinator,
  acceptArticle_coordinator,
};
