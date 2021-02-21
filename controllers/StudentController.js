var AppUser = require("../models/AppUserModel");
var Student = require("../models/StudentModel");
var Articles = require("../models/ArticlesModel");
var Faculty = require("../models/FacultyModel");

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
                res.render("student_home", {
                  data: {
                    _id: value._id,
                    user: user,
                    info: info,
                    assign: assign.name,
                  },
                });
              });
          } else {
            res.render("student_home", {
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
          res.redirect("/users/student/home");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/users/student/home");
    });
};

const addImage_student = async (req, res, next) => {
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
              img: req.file.filename,
              faculty_id: faculty._id,
            };

            Articles.create(obj, (err, item) => {
              if (err) {
                console.log(err);
              } else {
                item.save();
                info.posts.push(item);
                info.save();
                res.redirect("/users/student/list_articles");
              }
            });
          });
      }
    });
};

const getListImage_student = (req, res, next) => {
  Student.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      if (info.faculty_id) {
        Articles.find({ faculty_id: info.faculty_id }).exec((err, items) => {
          if (err) {
            console.log(err);
            res.status(500).send("An error occurred", err);
          } else {
            console.log(items);
            res.render("student_list_articles", { items: items });
          }
        });
      }
    });
};

module.exports = { GetStudentHome, addImage_student, getListImage_student };
