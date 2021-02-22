var AppUser = require("../models/AppUserModel");
var Coordinator = require("../models/CoordinatorModel");
var Faculty = require("../models/FacultyModel");
var Articles = require("../models/ArticlesModel");

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
                res.render("coordinator_home", {
                  data: {
                    _id: value._id,
                    user: user,
                    info: info,
                    assign: assign.name,
                  },
                });
              });
          } else {
            res.render("coordinator_home", {
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
            res.render("coordinator_list_articles", { items: items });
          }
        });
      }
    });
};

module.exports = { GetCoordinatorHome, getListArticles_coordinator };
