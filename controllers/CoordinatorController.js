var AppUser = require("../models/AppUserModel");
var Coordinator = require("../models/CoordinatorModel");

const GetCoordinatorHome = (req, res, next) => {
  Coordinator.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      console.log(info);
      AppUser.findOne({ _id: req.session.userId })
        .exec()
        .then((user) => {
          res.render("coordinator_home", {
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

module.exports = { GetCoordinatorHome };
