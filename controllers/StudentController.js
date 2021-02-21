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
          Faculty.find({})
            .exec()
            .then((faculty) => {
              if (value.faculty_id) {
                Faculty.findOne({ _id: value.faculty_id })
                  .exec()
                  .then((assign) => {
                    console.log(assign);
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
            });
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
  console.log(req.file);

  var obj = {
    name: req.body.name,
    desc: req.body.desc,
    img: req.file.filename,
  };

  Articles.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      item.save();
      res.redirect("/users/student/list_articles");
    }
  });
};

module.exports = { GetStudentHome, addImage_student };
