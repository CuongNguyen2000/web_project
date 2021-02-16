var AppUser = require("../models/AppUserModel");
var Student = require("../models/StudentModel");
var Articles = require("../models/ArticlesModel");
var fs = require("fs");
var path = require("path");

const GetStudentHome = (req, res, next) => {
  Student.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      console.log(info);
      AppUser.findOne({ _id: req.session.userId })
        .exec()
        .then((user) => {
          res.render("student_home", {
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

const addImage_student = async (req, res, next) => {
  // var obj = {
  //   name: req.body.name,
  //   desc: req.body.desc,
  //   img: {
  //     data: fs
  //       .readFileSync(path.join(__dirname + "/uploads/" + req.file.filename))
  //       .toString("base64"),
  //   },
  // };

  // Articles.create(obj, (err, item) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     item.save();
  //     res.redirect("/users/student/list_images");
  //   }
  // });

  console.log(req.file);

  Articles = new Articles({
    name: req.body.name,
    desc: req.body.desc,
    img: req.file.filename,
  });

  try {
    Articles = await Articles.save();
    res.redirect("/users/student/list_images");
  } catch (err) {
    console.log(err);
  }
};

module.exports = { GetStudentHome, addImage_student };
