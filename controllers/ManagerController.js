var AppUser = require("../models/AppUserModel");
var Manager = require("../models/ManagerModel");
var Article = require("../models/ArticlesModel");
var Faculty = require("../models/FacultyModel");

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
  // Article.find({})
  //   .exec()
  //   .then((items) => {
  //     if (items.faculty_id) {
  //       Faculty.findOne({ _id: items.faculty_id })
  //         .exec()
  //         .then((assign) => {
  //           console.log(assign);
  //           res.render("managerViews/manager_list_articles", {
  //             data: {
  //               _id: items._id,
  //               items: items,
  //               assign: assign.name,
  //             },
  //           });
  //         });
  //     } else {
  //       res.render("managerViews/manager_list_articles", {
  //         data: {
  //           _id: items._id,
  //           items: items,
  //         },
  //       });
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.redirect("/users/manager/list_articles");
  //   });
  Article.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      console.log(items);
      res.render("managerViews/manager_list_articles", { items: items });
    }
  });
};

module.exports = { GetManagerHome, getListArticles_manager };
