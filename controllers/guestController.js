var AppUser = require("../models/AppUserModel");
var Guest = require("../models/GuestModel");
var Faculty = require("../models/FacultyModel");
var Articles = require("../models/ArticlesModel");

const GetGuestHome = (req, res, next) => {
  Guest.findOne({ account_id: req.session.userId })
    .exec()
    .then((value) => {
      if (value.faculty_id) {
        Articles.find({ status: true }, (err, items) => {
          if (err) {
            console.log(err);
            res.status(500).send("An error occurred", err);
          } else {
            console.log(items);
            res.render("guestViews/guest_home", { items: items });
          }
        });
      }
    });

  // let info = {};
  // Guest.findOne({ account_id: req.session.userId })
  //   .exec()
  //   .then((value) => {
  //     info = {
  //       name: value.name,
  //       email: value.email,
  //     };
  //     if (value.faculty_id) {
  //       Articles.find({ faculty_id: value.faculty_id }, { status: true })
  //         .exec()
  //         .then((items) => {
  //           console.log(items);
  //           res.render("guestViews/guest_home", {
  //             data: {
  //               items: items,
  //               info: info,
  //             },
  //           });
  //         });
  //     }
  //   });
};

module.exports = { GetGuestHome };
