var AppUser = require("../models/AppUserModel");
var bcrypt = require("bcrypt");

// const SignUp = async (req, res, next) => {
//   const user = AppUser({
//     username: "cuong",
//     password: "abcdef",
//     role: "student",
//   });
//   await user.save();
//   console.log(user);
//   return res.send(user);
// };

const Login = (req, res, next) => {
  console.log(req.body);
  const { usr, pwd } = req.body;
  console.log(usr);
  AppUser.findOne({ username: usr }).exec((err, user) => {
    if (err) {
      console.log(err);
      return res.redirect("/");
    } else if (!user) {
      // res.status(401);
      const msg = "User Not Found !!!";
      return res.redirect(`/?msg=${msg}`);
    }

    bcrypt.compare(pwd, user.password, (err, same) => {
      if (same) {
        req.session.userId = user._id;
        req.session.isAdmin = user.role === "admin" ? true : false;
        req.session.isStudent = user.role === "student" ? true : false;
        req.session.isCoordinator = user.role === "coordinator" ? true : false;
        req.session.isManager = user.role === "manager" ? true : false;

        if (user.role === "admin") {
          return res.redirect(`/users/admin/home`);
        } else if (user.role === "student") {
          return res.redirect(`/users/student/home`);
        } else if (user.role === "manager") {
          return res.redirect(`/users/manager/home`);
        } else {
          return res.redirect(`/users/coordinator/home`);
        }
      } else {
        const msg = "Username or Password is incorrect !!!";
        return res.redirect(`/?msg=${msg}`);
      }
    });
  });
};

const Logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
};

module.exports = { Login, Logout };
