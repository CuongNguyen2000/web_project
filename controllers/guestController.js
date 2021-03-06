var AppUser = require("../models/AppUserModel");
var Guest = require("../models/GuestModel");
var Faculty = require("../models/FacultyModel");
var Articles = require("../models/ArticlesModel");

const GetGuestHome = (req, res, next) => {
  Guest.findOne({ account_id: req.session.userId })
    .exec()
    .then((value) => {
      if (value.faculty_id) {
        Articles.find({ faculty_id: value.faculty_id, status: true })
          .populate("topic_id")
          .exec((err, items) => {
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
};

module.exports = { GetGuestHome };
