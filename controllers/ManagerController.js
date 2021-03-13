var AppUser = require("../models/AppUserModel");
var Manager = require("../models/ManagerModel");
var Article = require("../models/ArticlesModel");
const Faculty = require("../models/FacultyModel");
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
        .exec((err, items) => {
          if (err) {
            console.log(err);
            res.status(500).send("An error occurred", err);
          } else {
            let result = [];
            items.forEach((item) => {
              // console.log(item);
              let x = { item: item, students: [] };
              item
                .populate("student")
                .execPopulate()
                .then((res) => {
                  x.students = [...res.student];
                  console.log(x);
                });
              // console.log(x);
            });
            // console.log(result);
            // let students = [];
            // items.forEach((item) => {
            //   console.log(item.student);
            // });
            // console.log(items.student);
            res.render("managerViews/manager_list_articles", {
              items: items,
              info: info,
            });
          }
        });
    });
};

const getStatistics_manager = (req, res, next) => {
  Manager.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      Faculty.find({})
        .exec()
        .then((faculty) => {
          Article.countDocuments({ faculty_id: faculty._id }, (err, count) => {
            if (faculty._id == "6036753a3a7633530809d0e9") {
              console.log(count);
            }
          });
          res.render("managerViews/manager_statistics", {
            info: info,
            faculty: faculty,
          });
          // if (faculty._id) {
          //   Article.countDocuments({}, (err, count) => {
          //     if (err) {
          //       console.log(err);
          //       res.status(500).send("An error occurred", err);
          //     } else {
          //       console.log(count);
          //       res.render("managerViews/manager_statistics", {
          //         info: info,
          //         faculty: faculty,
          //         count: count,
          //       });
          //     }
          //   });
          // }
        });
    });
};

module.exports = {
  GetManagerHome,
  getListArticles_manager,
  getStatistics_manager,
};
