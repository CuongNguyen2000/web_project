var AppUser = require("../models/AppUserModel");
var Student = require("../models/StudentModel");
var Coordinator = require("../models/CoordinatorModel");
var Manager = require("../models/ManagerModel");
var Faculty = require("../models/FacultyModel");
const Guest = require("../models/GuestModel");

// The processing section for a student's account is below
// showing list of student
const listStudent_Admin = (req, res, next) => {
  AppUser.find({ role: "student" })
    .exec()
    .then((user) => {
      res.render("adminViews/admin_list_student", { user: user });
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
          Faculty.find({})
            .exec()
            .then((faculty) => {
              if (value.faculty_id) {
                Faculty.findOne({ _id: value.faculty_id })
                  .exec()
                  .then((assign) => {
                    console.log(assign);
                    res.render("adminViews/admin_update_studentAcc", {
                      data: {
                        name: value.name,
                        desc: value.description,
                        _id: value._id,
                        user: user,
                        info: info,
                        assign: assign.name,
                        faculty: faculty,
                      },
                    });
                  })
                  .catch();
              } else {
                res.render("adminViews/admin_update_studentAcc", {
                  data: {
                    _id: value._id,
                    user: user,
                    info: info,
                    faculty: faculty,
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
        return res.render("adminViews/admin_update_studentAcc");
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
        return res.render("adminViews/admin_update_studentAcc");
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
      Student.findOneAndRemove({ account_id: _id })
        .then((result) => {
          console.log("OK");
          return res.redirect("/users/admin/list_all_students");
        })
        .catch((err) => {
          console.log(err);
          return res.redirect("/users/admin/list_all_students");
        });
    }
  });
};

// Assign student to Faculty
const assignFacultyForStudent_admin = (req, res, next) => {
  const { _id, faculty } = req.body;
  console.log(faculty, _id);
  Student.findOneAndUpdate(
    { _id: _id },
    { $set: { faculty_id: faculty } },
    { new: true, useFindAndModify: false }
  )
    .exec()
    .then((value) => {
      console.log(value);
      res.redirect("/users/admin/list_all_students");
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
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
      res.render("adminViews/admin_list_coordinator", { user: user });
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
          Faculty.find({})
            .exec()
            .then((faculty) => {
              if (value.faculty_id) {
                Faculty.findOne({ _id: value.faculty_id })
                  .exec()
                  .then((assign) => {
                    console.log(assign);
                    res.render("adminViews/admin_update_coordinatorAcc", {
                      data: {
                        name: value.name,
                        desc: value.description,
                        _id: value._id,
                        user: user,
                        info: info,
                        assign: assign.name,
                        faculty: faculty,
                      },
                    });
                  });
              } else {
                res.render("adminViews/admin_update_coordinatorAcc", {
                  data: {
                    _id: value._id,
                    user: user,
                    info: info,
                    faculty: faculty,
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
        return res.render("adminViews/admin_update_coordinatorAcc");
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
        return res.render("adminViews/admin_update_coordinatorAcc");
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
      Coordinator.findOneAndRemove({ account_id: _id })
        .then((result) => {
          console.log("OK");
          return res.redirect("/users/admin/list_all_coordinators");
        })
        .catch((err) => {
          console.log(err);
          return res.redirect("/users/admin/list_all_coordinators");
        });
    }
  });
};

// Assign faculty for coordinator
const assignFacultyForCoordinator_admin = (req, res, next) => {
  const { _id, faculty } = req.body;
  console.log(faculty, _id);
  Coordinator.findOneAndUpdate(
    { _id: _id },
    { $set: { faculty_id: faculty } },
    { new: true, useFindAndModify: false }
  )
    .exec()
    .then((value) => {
      console.log(value);
      res.redirect("/users/admin/list_all_coordinators");
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
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
      res.render("adminViews/admin_list_manager", { user: user });
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

          res.render("adminViews/admin_update_managerAcc", {
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
        return res.render("adminViews/admin_update_managerAcc");
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
        return res.render("adminViews/admin_update_managerAcc");
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
      Manager.findOneAndRemove({ account_id: _id })
        .then((result) => {
          console.log("OK");
          return res.redirect("/users/admin/list_all_managers");
        })
        .catch((err) => {
          console.log(err);
          return res.redirect("/users/admin/list_all_managers");
        });
    }
  });
};

/* ================================================================
===================================================================
===================================================================
===================================================================
=================================================================== */

// Get list of Faculty
const listFaculty_admin = (req, res, next) => {
  Faculty.find({})
    .exec()
    .then((faculty) => {
      res.render("adminViews/admin_list_faculty", { faculty: faculty });
    })
    .catch((err) => console.log(err));
};

// adding new faculty
const addFaculty_admin = (req, res, next) => {
  const { name, desc } = req.body;
  Faculty.findOne({ name: name })
    .exec()
    .then((value) => {
      const msg = "This faculty is already exist !!! Please Try again";
      res.redirect(`/users/admin/add_faculty?msg=${msg}`);
    })
    .catch((err) => {
      res.send(err);
    });

  const newFaculty = new Faculty({
    name: name,
    description: desc,
  });

  newFaculty.save();

  return res.redirect("/users/admin/list_all_faculty");
};

// update faculty
// get update faculty page
const updatePageFaculty_admin = (req, res, next) => {
  const { _id } = req.body;
  // console.log(_id);
  Faculty.findOne({ _id: _id })
    .exec()
    .then((value) => {
      console.log(value);
      res.render("adminViews/admin_update_faculty", {
        data: {
          name: value.name,
          desc: value.description,
          _id: value._id,
        },
      });
    })
    .catch((err) => {
      res.render("adminViews/admin_update_faculty", { err: err });
    });
};

const updateFaculty_admin = (req, res, next) => {
  const { name, desc, _id } = req.body;
  const newValue = {};
  if (name) newValue.name = name;
  if (desc) newValue.description = desc;

  Faculty.findByIdAndUpdate({ _id: _id }, { $set: newValue }, { new: true })
    .exec()
    .then((value) => {
      console.log(value);
      res.redirect("/users/admin/list_all_faculty");
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

// Delete Faculty
const deleteFaculty_admin = (req, res, next) => {
  const { _id } = req.body;
  Faculty.findByIdAndRemove({ _id: _id })
    .exec()
    .then((value) => {
      console.log(value);
      res.redirect("/users/admin/list_all_faculty");
    })
    .catch((err) => {
      res.send(err);
    });
};

/* ================================================================
===================================================================
===================================================================
===================================================================
=================================================================== */

// The processing section for a Guest's account is below
// Displaying list of Guest acc
const listGuest_admin = (req, res, next) => {
  AppUser.find({ role: "guest" })
    .exec()
    .then((user) => {
      res.render("adminViews/admin_list_guest", { user: user });
    })
    .catch((err) => console.log(err));
};

// Adding new Guest account
const addGuest_admin = async (req, res, next) => {
  const { usr, pwd, name, email } = req.body;
  AppUser.findOne({ username: usr }).exec((err, user) => {
    if (err) {
      return console.log(err);
    } else if (user) {
      const msg = "User has already exist !!!";
      return res.redirect(`/admin/add_guest?msg=${msg}`);
    }
  });

  const newUser = new AppUser({
    username: usr,
    password: pwd,
    role: "guest",
  });

  await newUser.save();

  AppUser.findOne({ username: usr }).exec(async (err, user) => {
    if (err) {
      return console.log(err);
    } else {
      const newGuest = new Guest({
        name: name,
        email: email,
        account_id: user._id,
      });

      await newGuest.save();

      return res.redirect("/users/admin/list_all_guests");
    }
  });
};

// Update guest Account
const updateGuest_admin = (req, res, next) => {
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
      Guest.findOne({ account_id: _id })
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
                    res.render("adminViews/admin_update_guestAcc", {
                      data: {
                        name: value.name,
                        desc: value.description,
                        _id: value._id,
                        user: user,
                        info: info,
                        assign: assign.name,
                        faculty: faculty,
                      },
                    });
                  });
              } else {
                res.render("adminViews/admin_update_guestAcc", {
                  data: {
                    _id: value._id,
                    user: user,
                    info: info,
                    faculty: faculty,
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
          res.redirect("/users/admin/list_all_guests");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/users/admin/list_all_guests");
    });
};

const updateGuestInfo_admin = (req, res, next) => {
  const { name, email, _id } = req.body;
  const newValue = {};
  if (name) newValue.name = name;
  if (email) newValue.email = email;

  Guest.findOneAndUpdate(
    { account_id: _id },
    { $set: newValue },
    (err, data) => {
      if (err) {
        console.log(err);
        return res.render("adminViews/admin_update_guestAcc");
      } else {
        console.log(data);
        return res.redirect("/users/admin/list_all_guests");
      }
    }
  );
};

const updateGuestAcc_admin = (req, res, next) => {
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
        return res.render("adminViews/admin_update_guestAcc");
      } else {
        console.log(data);
        return res.redirect("/users/admin/list_all_guests");
      }
    }
  );
};

// Assign faculty for guest
const assignFacultyForGuest_admin = (req, res, next) => {
  const { _id, faculty } = req.body;
  console.log(faculty, _id);
  Guest.findOneAndUpdate(
    { _id: _id },
    { $set: { faculty_id: faculty } },
    { new: true, useFindAndModify: false }
  )
    .exec()
    .then((value) => {
      console.log(value);
      res.redirect("/users/admin/list_all_guests");
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

// Delete Guest account
const deleteGuest_Admin = async (req, res, next) => {
  const { _id } = req.body;
  await AppUser.findOneAndRemove({ _id: _id }, (err) => {
    if (err) {
      console.log(err);
      return res.redirect("/users/admin/list_all_guests");
    } else {
      console.log("Ok");
      Guest.findOneAndRemove({ account_id: _id })
        .then((result) => {
          console.log("OK");
          return res.redirect("/users/admin/list_all_guests");
        })
        .catch((err) => {
          console.log(err);
          return res.redirect("/users/admin/list_all_guests");
        });
    }
  });
};

module.exports = {
  listStudent_Admin,
  listCoordinator_Admin,
  listManager_Admin,
  listFaculty_admin,
  listGuest_admin,
  addStudent_admin,
  addCoordinator_admin,
  addManager_admin,
  addFaculty_admin,
  addGuest_admin,
  updateStudent_admin,
  updateStudentAcc_admin,
  updateStudentInfo_admin,
  updateCoordinator_admin,
  updateCoordinatorAcc_admin,
  updateCoordinatorInfo_admin,
  updateManager_admin,
  updateManagerAcc_admin,
  updateManagerInfo_admin,
  updateGuest_admin,
  updateGuestAcc_admin,
  updateGuestInfo_admin,
  updatePageFaculty_admin,
  updateFaculty_admin,
  deleteStudent_Admin,
  deleteCoordinator_Admin,
  deleteManager_Admin,
  deleteGuest_Admin,
  deleteFaculty_admin,
  assignFacultyForStudent_admin,
  assignFacultyForCoordinator_admin,
  assignFacultyForGuest_admin,
};
