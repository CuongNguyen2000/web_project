var AppUser = require("../models/AppUserModel");
var Guest = require("../models/GuestModel");
var Faculty = require("../models/FacultyModel");
var Articles = require("../models/ArticlesModel");

const GetGuestHome = (req, res, next) => {
  AppUser.findOne({ _id: req.session.userId })
    .exec()
    .then((user) => {
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
                  res.render("guestViews/guest_home", {
                    items: items,
                    info: value,
                    user: user,
                  });
                }
              });
          }
        });
    });
};

const getUpdateAccount = (req, res, next) => {
  let user = {};
  const _id = req.params.id;
  const { msg } = req.query;

  AppUser.findOne({ _id: _id })
    .exec()
    .then((value) => {
      user = {
        _id: _id,
        username: value.username,
      };
      Guest.findOne({ account_id: _id })
        .exec()
        .then((info) => {
          res.render("guestViews/update_account", {
            err: msg,
            data: {
              _id: _id,
              info: info,
              user: user,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/guests/home");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/guests/home");
    });
};

const updateAccount = (req, res, next) => {
  const { pwd, _id } = req.body;
  const newValue = {};
  if (pwd) newValue.password = pwd;

  Guest.findOne({ account_id: _id })
    .exec()
    .then(async (value) => {
      await AppUser.findOne({ _id: _id }).exec(async (err, user) => {
        if (err) {
          return console.log(err);
        } else if (pwd.length < 4) {
          const msg = "Password must be at least 4 characters !!!";
          return res.redirect(`/guests/update_account/${_id}?msg=${msg}`);
        } else {
          AppUser.findOneAndUpdate(
            { _id: _id },
            { $set: newValue },
            { new: true },
            (err, data) => {
              if (err) {
                console.log(err);
                return res.render("guestViews/update_account");
              } else {
                console.log(data);
                return res.redirect("/guests/home");
              }
            }
          );
        }
      });
    });
};

module.exports = { GetGuestHome, getUpdateAccount, updateAccount };
