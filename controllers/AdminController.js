var AppUser = require("../models/AppUserModel");
var Student = require("../models/StudentModel");
var Coordinator = require("../models/CoordinatorModel");
const Manager = require("../models/ManagerModel");

// The processing section for a student's account is below
// showing list of student
const listStudent_Admin = (req, res, next) => {
  AppUser.find({ role: "student" })
    .exec()
    .then((user) => {
      res.render("admin_list_student", { user: user });
    })
    .catch((err) => console.log(err));
};

// Adding new student account
const addStudent_admin = async (req, res, next) => {
  const { usr, pwd, name, email } = req.body;
  AppUser.findOne({ username: usr }).exec((err, user) => {
    if (err) {
      return console.log(err);
    } else if (user) {
      const msg = "User has already exist !!!";
      return res.redirect(`/admin/add_student?msg=${msg}`);
    }
  });

  const newUser = new AppUser({
    username: usr,
    password: pwd,
    role: "student",
  });

  await newUser.save();

  AppUser.findOne({ username: usr }).exec(async (err, user) => {
    if (err) {
      return console.log(err);
    } else {
      const newStudent = new Student({
        name: name,
        email: email,
        account_id: user._id,
      });

      await newStudent.save();

      return res.redirect("/users/admin/list_all_students");
    }
  });
};

// Update Student Account
const updateStudent_admin = (req, res, next) => {
  let user = {};
  let info = {};
  const { _id } = req.body;

  AppUser.findOne({ _id: _id })
    .exec()
    .then((value) => {
      user = {
        _id: value._id,
        username: value.username,
      };

      Student.findOne({ account_id: _id })
        .exec()
        .then((value) => {
          info = {
            name: value.name,
            email: value.email,
          };

          res.render("admin_update_studentAcc", {
            data: {
              user: user,
              info: info,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/users/admin/list_all_students");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/users/admin/list_all_students");
    });
};

const updateStudentInfo_admin = (req, res, next) => {
  const { name, email, _id } = req.body;
  const newValue = {};
  if (name) newValue.name = name;
  if (email) newValue.email = email;

  Student.findOneAndUpdate(
    { account_id: _id },
    { $set: newValue },
    (err, data) => {
      if (err) {
        console.log(err);
        return res.render("admin_update_student_info");
      } else {
        console.log(data);
        return res.redirect("/users/admin/list_all_students");
      }
    }
  );
};

const updateStudentAcc_admin = (req, res, next) => {
  const { usr, pwd, _id } = req.body;
  const newValue = {};
  if (usr) newValue.username = usr;
  if (pwd) newValue.password = pwd;

  AppUser.findOneAndUpdate(
    { _id: _id },
    { $set: newValue },
    { new: true },
    (err, data) => {
      if (err) {
        console.log(err);
        return res.render("admin_update_student_acc");
      } else {
        console.log(data);
        return res.redirect("/users/admin/list_all_students");
      }
    }
  );
};

// Delete Student account
const deleteStudent_Admin = async (req, res, next) => {
  const { _id } = req.body;
  await AppUser.findOneAndRemove({ _id: _id }, (err) => {
    if (err) {
      console.log(err);
      return res.redirect("/users/admin/list_all_students");
    } else {
      console.log("Ok");
      return res.redirect("/users/admin/list_all_students");
    }
  });

  Student.findByIdAndRemove({ account_id: _id }, (err) => {
    if (err) {
      console.log(err);
      return res.redirect("/users/admin/list_all_students");
    } else {
      console.log("Ok");
      return res.redirect("/users/admin/list_all_students");
    }
  });
};

/* ================================================================
===================================================================
===================================================================
===================================================================
=================================================================== */

// The processing section for a Coordinator's account is below
// Display list of Marketing Coordinator
const listCoordinator_Admin = (req, res, next) => {
  AppUser.find({ role: "coordinator" })
    .exec()
    .then((user) => {
      res.render("admin_list_coordinator", { user: user });
    })
    .catch((err) => console.log(err));
};

// Adding new Coordinator account
const addCoordinator_admin = async (req, res, next) => {
  const { usr, pwd, name, email } = req.body;
  AppUser.findOne({ username: usr }).exec((err, user) => {
    if (err) {
      return console.log(err);
    } else if (user) {
      const msg = "User has already exist !!!";
      return res.redirect(`/admin/add_coordinator?msg=${msg}`);
    }
  });

  const newUser = new AppUser({
    username: usr,
    password: pwd,
    role: "coordinator",
  });

  await newUser.save();

  AppUser.findOne({ username: usr }).exec(async (err, user) => {
    if (err) {
      return console.log(err);
    } else {
      const newCoordinator = new Coordinator({
        name: name,
        email: email,
        account_id: user._id,
      });

      await newCoordinator.save();

      return res.redirect("/users/admin/list_all_coordinators");
    }
  });
};

// Update Marketing Coordinator Account
const updateCoordinator_admin = (req, res, next) => {
  let user = {};
  let info = {};
  const { _id } = req.body;

  AppUser.findOne({ _id: _id })
    .exec()
    .then((value) => {
      user = {
        _id: value._id,
        username: value.username,
      };

      Coordinator.findOne({ account_id: _id })
        .exec()
        .then((value) => {
          info = {
            name: value.name,
            email: value.email,
          };

          res.render("admin_update_coordinatorAcc", {
            data: {
              user: user,
              info: info,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/users/admin/list_all_coordinators");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/users/admin/list_all_coordinators");
    });
};

const updateCoordinatorInfo_admin = (req, res, next) => {
  const { name, email, _id } = req.body;
  const newValue = {};
  if (name) newValue.name = name;
  if (email) newValue.email = email;

  Coordinator.findOneAndUpdate(
    { account_id: _id },
    { $set: newValue },
    (err, data) => {
      if (err) {
        console.log(err);
        return res.render("admin_update_coordinator_info");
      } else {
        console.log(data);
        return res.redirect("/users/admin/list_all_coordinators");
      }
    }
  );
};

const updateCoordinatorAcc_admin = (req, res, next) => {
  const { usr, pwd, _id } = req.body;
  const newValue = {};
  if (usr) newValue.username = usr;
  if (pwd) newValue.password = pwd;

  AppUser.findOneAndUpdate(
    { _id: _id },
    { $set: newValue },
    { new: true },
    (err, data) => {
      if (err) {
        console.log(err);
        return res.render("admin_update_coordinator_acc");
      } else {
        console.log(data);
        return res.redirect("/users/admin/list_all_coordinators");
      }
    }
  );
};

// Delete Marketing Coordinator account
const deleteCoordinator_Admin = async (req, res, next) => {
  const { _id } = req.body;
  await AppUser.findOneAndRemove({ _id: _id }, (err) => {
    if (err) {
      console.log(err);
      return res.redirect("/users/admin/list_all_coordinators");
    } else {
      console.log("Ok");
      return res.redirect("/users/admin/list_all_coordinators");
    }
  });

  Coordinator.findByIdAndRemove({ account_id: _id }, (err) => {
    if (err) {
      console.log(err);
      return res.redirect("/users/admin/list_all_coordinators");
    } else {
      console.log("Ok");
      return res.redirect("/users/admin/list_all_coordinators");
    }
  });
};

/* ================================================================
===================================================================
===================================================================
===================================================================
=================================================================== */

// The processing section for a Manager's account is below
// Displaying list of Manager
const listManager_Admin = (req, res, next) => {
  AppUser.find({ role: "manager" })
    .exec()
    .then((user) => {
      res.render("admin_list_manager", { user: user });
    })
    .catch((err) => console.log(err));
};

// Adding new Manager account
const addManager_admin = async (req, res, next) => {
  const { usr, pwd, name, email } = req.body;
  AppUser.findOne({ username: usr }).exec((err, user) => {
    if (err) {
      return console.log(err);
    } else if (user) {
      const msg = "User has already exist !!!";
      return res.redirect(`/admin/add_manager?msg=${msg}`);
    }
  });

  const newUser = new AppUser({
    username: usr,
    password: pwd,
    role: "manager",
  });

  await newUser.save();

  AppUser.findOne({ username: usr }).exec(async (err, user) => {
    if (err) {
      return console.log(err);
    } else {
      const newManager = new Manager({
        name: name,
        email: email,
        account_id: user._id,
      });

      await newManager.save();

      return res.redirect("/users/admin/list_all_managers");
    }
  });
};

// Update Marketing Manager Account
const updateManager_admin = (req, res, next) => {
  let user = {};
  let info = {};
  const { _id } = req.body;

  AppUser.findOne({ _id: _id })
    .exec()
    .then((value) => {
      user = {
        _id: value._id,
        username: value.username,
      };

      Manager.findOne({ account_id: _id })
        .exec()
        .then((value) => {
          info = {
            name: value.name,
            email: value.email,
          };

          res.render("admin_update_managerAcc", {
            data: {
              user: user,
              info: info,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/users/admin/list_all_managers");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/users/admin/list_all_managers");
    });
};

const updateManagerInfo_admin = (req, res, next) => {
  const { name, email, _id } = req.body;
  const newValue = {};
  if (name) newValue.name = name;
  if (email) newValue.email = email;

  Manager.findOneAndUpdate(
    { account_id: _id },
    { $set: newValue },
    (err, data) => {
      if (err) {
        console.log(err);
        return res.render("admin_update_manager_info");
      } else {
        console.log(data);
        return res.redirect("/users/admin/list_all_managers");
      }
    }
  );
};

const updateManagerAcc_admin = (req, res, next) => {
  const { usr, pwd, _id } = req.body;
  const newValue = {};
  if (usr) newValue.username = usr;
  if (pwd) newValue.password = pwd;

  AppUser.findOneAndUpdate(
    { _id: _id },
    { $set: newValue },
    { new: true },
    (err, data) => {
      if (err) {
        console.log(err);
        return res.render("admin_update_manager_acc");
      } else {
        console.log(data);
        return res.redirect("/users/admin/list_all_managers");
      }
    }
  );
};

// Delete Marketing Manager account
const deleteManager_Admin = async (req, res, next) => {
  const { _id } = req.body;
  await AppUser.findOneAndRemove({ _id: _id }, (err) => {
    if (err) {
      console.log(err);
      return res.redirect("/users/admin/list_all_managers");
    } else {
      console.log("Ok");
      return res.redirect("/users/admin/list_all_managers");
    }
  });

  Manager.findByIdAndRemove({ account_id: _id }, (err) => {
    if (err) {
      console.log(err);
      return res.redirect("/users/admin/list_all_managers");
    } else {
      console.log("Ok");
      return res.redirect("/users/admin/list_all_managers");
    }
  });
};

module.exports = {
  listStudent_Admin,
  listCoordinator_Admin,
  listManager_Admin,
  addStudent_admin,
  addCoordinator_admin,
  addManager_admin,
  updateStudent_admin,
  updateStudentAcc_admin,
  updateStudentInfo_admin,
  updateCoordinator_admin,
  updateCoordinatorAcc_admin,
  updateCoordinatorInfo_admin,
  updateManager_admin,
  updateManagerAcc_admin,
  updateManagerInfo_admin,
  deleteStudent_Admin,
  deleteCoordinator_Admin,
  deleteManager_Admin,
};
