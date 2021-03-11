var AppUser = require("../models/AppUserModel");
var Manager = require("../models/ManagerModel");
var Article = require("../models/ArticlesModel");
// var fs = require("fs");
// const AdmZip = require("adm-zip");
// var uploadDir = fs.readdirSync("./public/uploads");

const GetManagerHome = (req, res, next) => {
  Manager.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      console.log(info);
      AppUser.findOne({ _id: req.session.userId })
        .exec()
        .then((user) => {
          res.render("managerViews/manager_home", {
            data: {
              user: user,
              info: info,
            },
          });
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      res.send(err);
    });
};

const getListArticles_manager = (req, res, next) => {
  Manager.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      Article.find({})
        .populate("topic_id")
        .populate("faculty_id")
        .populate("student")
        .exec((err, items) => {
          if (err) {
            console.log(err);
            res.status(500).send("An error occurred", err);
          } else {
            console.log(items);
            res.render("managerViews/manager_list_articles", {
              items: items,
              info: info,
            });
          }
        });
    });
};

module.exports = { GetManagerHome, getListArticles_manager };
