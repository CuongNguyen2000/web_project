const AppUser = require("../models/AppUserModel");
const Student = require("../models/StudentModel");
const Coordinator = require("../models/CoordinatorModel");
const Manager = require("../models/ManagerModel");
const Faculty = require("../models/FacultyModel");
const Guest = require("../models/GuestModel");
const Topic = require("../models/TopicModel");
const Article = require("../models/ArticlesModel");
const Comment = require("../models/commentModel");

// The processing section for a student's account is below
// showing list of student
const listStudent_Admin = (req, res, next) => {
  const _id = req.query.faculty_id;
  Student.find({ faculty_id: _id })
    .populate("account_id")
    .exec()
    .then((students) => {
      Faculty.findOne({ _id: _id })
        .exec()
        .then((faculty) => {
          console.log(students);
          res.render("adminViews/admin_list_student", {
            faculty: faculty,
            students: students,
          });
        });
    })
    .catch((err) => console.log(err));
};

// Get list faculty to add new student
const getListFacultyForAddStudent = (req, res, next) => {
  Faculty.find({})
    .exec()
    .then((faculties) => {
      res.render("adminViews/add_student", {
        faculties: faculties,
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

// Adding new student account
const addStudent_admin = async (req, res, next) => {
  const { usr, pwd, name, email, _id } = req.body;
  await AppUser.findOne({ username: usr, role: "student" }).exec(
    async (err, user) => {
      if (err) {
        return console.log(err);
      } else if (user) {
        const errorUsername = "Username has already exist !!!";
        return res.redirect(`/admin/add_student?msg=${errorUsername}`);
      } else if (pwd.length < 4) {
        const errorPassword = "Password must be at least 4 characters !!!";
        return res.redirect(`/admin/add_student?msg=${errorPassword}`);
      } else {
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
              faculty_id: _id,
              account_id: user._id,
            });

            await newStudent.save();

            return res.redirect("/admin/list_all_students?faculty_id=" + _id);
          }
        });
      }
    }
  );
};

// Update Student Account
const updateStudent_admin = (req, res, next) => {
  let user = {};
  let info = {};
  const _id = req.params.id;
  const { msg } = req.query;

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
                      err: msg,
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
                  err: msg,
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
          res.redirect("/admin/list_all_students");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/admin/list_all_students");
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
        return res.redirect(
          "/admin/list_all_students?faculty_id=" + data.faculty_id
        );
      }
    }
  );
};

const updateStudentAcc_admin = async (req, res, next) => {
  const { usr, _id } = req.body;
  const newValue = {};
  if (usr) newValue.username = usr;

  await AppUser.findOne({ username: usr, role: "student" }).exec(
    async (err, user) => {
      if (err) {
        return console.log(err);
      } else if (user) {
        const errorUsername = "Username has already exist !!!";
        return res.redirect(
          `/admin/update_student/${_id}?msg=${errorUsername}`
        );
      } else {
        Student.findOne({ account_id: _id })
          .exec()
          .then((value) => {
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
                  return res.redirect(
                    "/admin/list_all_students?faculty_id=" + value.faculty_id
                  );
                }
              }
            );
          });
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
      return res.redirect("/admin/list_all_students");
    } else {
      console.log("Delete successfully in AppUser");
      Student.findOneAndRemove({ account_id: _id })
        .then((result) => {
          console.log("Delete successfully in Student");
          Article.findOneAndRemove({ _id: result.posts }, (err, article) => {
            if (err) {
              console.log(err);
              return res.redirect("/admin/list_all_students");
            } else {
              console.log("Delete successfully articles of student");
              Comment.findOneAndRemove({ _id: article.comments }, (err) => {
                if (err) {
                  console.log(err);
                  return res.redirect("/admin/list_all_students");
                } else {
                  console.log("Delete successfully comment of article");
                  Faculty.findOneAndUpdate(
                    { amountArticle: result.posts },
                    { $pull: { amountArticle: result.posts } },
                    { safe: true, upsert: true },
                    (err, data) => {
                      if (err) {
                        res.render("error", {
                          message:
                            "Sorry failed to delete Article id in amountArticle",
                          error: {
                            status: err,
                            stacks:
                              "failed to delete Article id in amountArticle",
                          },
                        });
                      } else {
                        console.log(
                          "Delete successfully in array from Faculty"
                        );
                        return res.redirect(
                          "/admin/list_all_students?faculty_id=" +
                            result.faculty_id
                        );
                      }
                    }
                  );
                }
              });
            }
          });
        })
        .catch((err) => {
          console.log(err);
          return res.redirect("/admin/list_all_students");
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
      res.redirect("/admin/list_all_students?faculty_id=" + value.faculty_id);
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
  const _id = req.query.faculty_id;
  Coordinator.find({ faculty_id: _id })
    .populate("account_id")
    .exec()
    .then((coordinators) => {
      Faculty.findOne({ _id: _id })
        .exec()
        .then((faculty) => {
          console.log(coordinators);
          res.render("adminViews/admin_list_coordinator", {
            faculty: faculty,
            coordinators: coordinators,
          });
        });
    })
    .catch((err) => console.log(err));
};

// Get list faculty to add new coordinator
const getListFacultyForAddCoordinator = (req, res, next) => {
  Faculty.find({})
    .exec()
    .then((faculties) => {
      res.render("adminViews/add_coordinator", {
        faculties: faculties,
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

// Adding new Coordinator account
const addCoordinator_admin = async (req, res, next) => {
  const { usr, pwd, name, email, _id } = req.body;
  await AppUser.findOne({ username: usr, role: "coordinator" }).exec(
    async (err, user) => {
      if (err) {
        return console.log(err);
      } else if (user) {
        const msg = "Username has already exist !!!";
        return res.redirect(`/admin/add_coordinator?msg=${msg}`);
      } else if (pwd.length < 4) {
        const msg = "Password must be at least 4 characters !!!";
        return res.redirect(`/admin/add_coordinator?msg=${msg}`);
      } else {
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
              faculty_id: _id,
              account_id: user._id,
            });

            await newCoordinator.save();

            return res.redirect(
              "/admin/list_all_coordinators?faculty_id=" + _id
            );
          }
        });
      }
    }
  );
};

// Update Marketing Coordinator Account
const updateCoordinator_admin = (req, res, next) => {
  let user = {};
  let info = {};
  const _id = req.params.id;
  const { msg } = req.query;

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
                      err: msg,
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
                  err: msg,
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
          res.redirect("/admin/list_all_coordinators");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/admin/list_all_coordinators");
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
        return res.redirect(
          "/admin/list_all_coordinators?faculty_id=" + data.faculty_id
        );
      }
    }
  );
};

const updateCoordinatorAcc_admin = async (req, res, next) => {
  const { usr, _id } = req.body;
  const newValue = {};
  if (usr) newValue.username = usr;

  await AppUser.findOne({ username: usr, role: "coordinator" }).exec(
    async (err, user) => {
      if (err) {
        return console.log(err);
      } else if (user) {
        const msg = "Username has already exist !!!";
        return res.redirect(`/admin/update_coordinator/${_id}?msg=${msg}`);
      } else {
        Coordinator.findOne({ account_id: _id })
          .exec()
          .then((value) => {
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
                  return res.redirect(
                    "/admin/list_all_coordinators?faculty_id=" +
                      value.faculty_id
                  );
                }
              }
            );
          });
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
      return res.redirect("/admin/list_all_coordinators");
    } else {
      console.log("Delete successfully in AppUser");
      Coordinator.findOneAndRemove({ account_id: _id })
        .then((result) => {
          console.log("Delete successfully in Coordinator");
          return res.redirect(
            "/admin/list_all_coordinators?faculty_id=" + result.faculty_id
          );
        })
        .catch((err) => {
          console.log(err);
          return res.redirect("/admin/list_all_coordinators");
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
      res.redirect(
        "/admin/list_all_coordinators?faculty_id=" + value.faculty_id
      );
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
  await AppUser.findOne({ username: usr, role: "manager" }).exec(
    async (err, user) => {
      if (err) {
        return console.log(err);
      } else if (user) {
        const msg = "Username has already exist !!!";
        return res.redirect(`/admin/add_manager?msg=${msg}`);
      } else if (pwd.length < 4) {
        const msg = "Password must be at least 4 characters !!!";
        return res.redirect(`/admin/add_manager?msg=${msg}`);
      } else {
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

            return res.redirect("/admin/list_all_managers");
          }
        });
      }
    }
  );
};

// Update Marketing Manager Account
const updateManager_admin = (req, res, next) => {
  let user = {};
  let info = {};
  const _id = req.params.id;
  const { msg } = req.query;

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
            err: msg,
            data: {
              user: user,
              info: info,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/admin/list_all_managers");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/admin/list_all_managers");
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
        return res.redirect("/admin/list_all_managers");
      }
    }
  );
};

const updateManagerAcc_admin = async (req, res, next) => {
  const { usr, _id } = req.body;
  const newValue = {};
  if (usr) newValue.username = usr;

  await AppUser.findOne({ username: usr, role: "manager" }).exec(
    async (err, user) => {
      if (err) {
        return console.log(err);
      } else if (user) {
        const msg = "Username has already exist !!!";
        return res.redirect(`/admin/update_manager/${_id}?msg=${msg}`);
      } else {
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
              return res.redirect("/admin/list_all_managers");
            }
          }
        );
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
      return res.redirect("/admin/list_all_managers");
    } else {
      console.log("Delete successfully in AppUser");
      Manager.findOneAndRemove({ account_id: _id })
        .then((result) => {
          console.log("Delete successfully in Manager");
          return res.redirect("/admin/list_all_managers");
        })
        .catch((err) => {
          console.log(err);
          return res.redirect("/admin/list_all_managers");
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
const addFaculty_admin = async (req, res, next) => {
  const { name, desc } = req.body;
  await Faculty.findOne({ name: name }).exec((err, value) => {
    if (err) {
      return console.log(err);
    } else if (value) {
      const msg = "This faculty is already exist !!! Please Try again";
      return res.redirect(`/admin/add_faculty?msg=${msg}`);
    } else {
      const newFaculty = new Faculty({
        name: name,
        description: desc,
      });

      newFaculty.save();
      return res.redirect("/admin/list_all_faculty");
    }
  });
};

// update faculty
// get update faculty page
const updatePageFaculty_admin = (req, res, next) => {
  const _id = req.params.id;
  const { msg } = req.query;
  // console.log(_id);
  Faculty.findOne({ _id: _id })
    .exec()
    .then((value) => {
      console.log(value);
      res.render("adminViews/admin_update_faculty", {
        err: msg,
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

  Faculty.findOne({ name: name }).exec((err, value) => {
    if (err) {
      return console.log(err);
    } else if (value) {
      const msg = "This faculty is already exist !!! Please Try again";
      return res.redirect(`/admin/update_faculty/${_id}?msg=${msg}`);
    } else {
      Faculty.findByIdAndUpdate({ _id: _id }, { $set: newValue }, { new: true })
        .exec()
        .then((value) => {
          console.log(value);
          res.redirect("/admin/list_all_faculty");
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    }
  });
};

// Delete Faculty
const deleteFaculty_admin = async (req, res, next) => {
  const { _id } = req.body;

  const faculty = Faculty.findOne({ _id: _id });
  const student = Student.find({ faculty_id: _id });
  const article = Article.find({ _id: student.posts });
  const coordinator = Coordinator.find({ faculty_id: _id });
  const guest = Guest.find({ faculty_id: _id });

  await Faculty.findOneAndRemove({ _id: _id }, (err) => {
    if (err) {
      console.log(err);
      return res.redirect("/admin/list_all_faculty");
    } else {
      console.log("======================================");
      console.log("Delete successfully in Faculty");
      Student.findOneAndRemove({ faculty_id: _id }, (err, student) => {
        if (err) {
          console.log(err);
          return res.redirect("/admin/list_all_faculty");
        } else {
          console.log("--------");
          console.log("Delete successfully students in faculty");
          AppUser.findOneAndRemove({ _id: student.account_id }, (err) => {
            if (err) {
              console.log(err);
              return res.redirect("/admin/list_all_faculty");
            } else {
              console.log("Delete successfully account of student");
              Article.findOneAndRemove({ _id: student.posts }, (err) => {
                if (err) {
                  console.log(err);
                  return res.redirect("/admin/list_all_faculty");
                } else {
                  console.log("Delete successfully articles of student");
                  Comment.findOneAndRemove({ _id: article.comments }, (err) => {
                    if (err) {
                      console.log(err);
                      return res.redirect("/admin/list_all_faculty");
                    } else {
                      console.log("Delete successfully comments of article");
                      Coordinator.findOneAndRemove(
                        { faculty_id: _id },
                        (err, coordinator) => {
                          if (err) {
                            console.log(err);
                            return res.redirect("/admin/list_all_faculty");
                          } else {
                            console.log("--------");
                            console.log(
                              "Delete successfully coordinator of faculty"
                            );
                            AppUser.findOneAndRemove(
                              { _id: coordinator.account_id },
                              (err) => {
                                if (err) {
                                  console.log(err);
                                  return res.redirect(
                                    "/admin/list_all_faculty"
                                  );
                                } else {
                                  console.log(
                                    "Delete successfully account of Coordinator"
                                  );
                                  Guest.findOneAndRemove(
                                    {
                                      faculty_id: _id,
                                    },
                                    (err, guest) => {
                                      if (err) {
                                        console.log(err);
                                        return res.redirect(
                                          "/admin/list_all_faculty"
                                        );
                                      } else {
                                        console.log("--------");
                                        console.log(
                                          "Delete successfully guests of faculty"
                                        );
                                        AppUser.findOneAndRemove(
                                          {
                                            _id: guest.account_id,
                                          },
                                          (err) => {
                                            if (err) {
                                              console.log(err);
                                              return res.redirect(
                                                "/admin/list_all_faculty"
                                              );
                                            } else {
                                              console.log(
                                                "Delete successfully account of guests"
                                              );
                                              return res.redirect(
                                                "/admin/list_all_faculty"
                                              );
                                            }
                                          }
                                        );
                                      }
                                    }
                                  );
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

/* ================================================================
===================================================================
===================================================================
===================================================================
=================================================================== */

// Get list of Topic
const listTopic_admin = (req, res, next) => {
  Topic.find({})
    .exec()
    .then((topic) => {
      res.render("adminViews/admin_list_topic", { topic: topic });
    })
    .catch((err) => console.log(err));
};

// adding new Topic
const addTopic_admin = (req, res, next) => {
  const { name, desc, timeOver, timeCreated } = req.body;
  Topic.findOne({ name: name }).exec((err, value) => {
    if (err) {
      return console.log(err);
    } else if (value) {
      const msg = "This Topic is already exist !!! Please Try again";
      return res.redirect(`/admin/add_topic?msg=${msg}`);
    } else {
      const newTopic = new Topic({
        name: name,
        description: desc,
        timeCreated: timeCreated,
        timeOver: timeOver,
      });

      newTopic.save();

      return res.redirect("/admin/list_all_topic");
    }
  });
};

// update topic
// get update topic page
const updatePageTopic_admin = (req, res, next) => {
  const _id = req.params.id;
  const { msg } = req.query;
  // console.log(_id);
  Topic.findOne({ _id: _id })
    .exec()
    .then((value) => {
      console.log(value);
      res.render("adminViews/admin_update_topic", {
        err: msg,
        data: {
          name: value.name,
          desc: value.description,
          timeCreated: value.timeCreated,
          timeOver: value.timeOver,
          _id: value._id,
        },
      });
    })
    .catch((err) => {
      res.render("adminViews/admin_update_topic", { err: err });
    });
};

const updateTopic_admin = (req, res, next) => {
  const { name, desc, timeCreated, timeOver, _id } = req.body;
  const newValue = {};
  if (name) newValue.name = name;
  if (desc) newValue.description = desc;
  if (timeCreated) newValue.timeCreated = timeCreated;
  if (timeOver) newValue.timeOver = timeOver;

  Topic.findOne({ name: name }).exec((err, value) => {
    if (err) {
      return console.log(err);
    } else if (value) {
      const msg = "This Topic is already exist !!! Please Try again";
      return res.redirect(`/admin/update_topic/${_id}?msg=${msg}`);
    } else {
      Topic.findByIdAndUpdate({ _id: _id }, { $set: newValue }, { new: true })
        .exec()
        .then((value) => {
          console.log(value);
          res.redirect("/admin/list_all_topic");
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    }
  });
};

// Delete Topic
const deleteTopic_admin = (req, res, next) => {
  const { _id } = req.body;
  const article = Article.find({ topic_id: _id });

  Topic.findOneAndRemove({ _id: _id })
    .exec()
    .then((value) => {
      console.log("=========================");
      console.log("Delete successfully in Topic");
      // console.log(value);
      Article.findOneAndRemove({ topic_id: _id }, (err) => {
        if (err) {
          console.log(err);
          return res.redirect("/admin/list_all_topic");
        } else {
          console.log("Delete successfully Article of topic");
          Comment.findOneAndRemove({ _id: article.comments }, (err) => {
            if (err) {
              console.log(err);
              return res.redirect("/admin/list_all_topic");
            } else {
              console.log("Delete successfully Comment of article");
              Student.findOneAndUpdate(
                { posts: article._id },
                { $pull: { posts: article._id } },
                { new: true, useFindAndModify: false },
                (err, data) => {
                  if (err) {
                    res.render("error", {
                      message: "Sorry failed to delete post id in students",
                      error: {
                        status: err,
                        stacks: "failed to delete post id in students",
                      },
                    });
                  } else {
                    console.log("Delete successfully in array from Student");
                    Faculty.findOneAndUpdate(
                      { amountArticle: article._id },
                      { $pull: { amountArticle: article._id } },
                      { new: true, useFindAndModify: false },
                      (err, data) => {
                        if (err) {
                          res.render("error", {
                            message:
                              "Sorry failed to delete Article id in amountArticle",
                            error: {
                              status: err,
                              stacks:
                                "failed to delete Article id in amountArticle",
                            },
                          });
                        } else {
                          console.log(
                            "Delete successfully in array from Faculty"
                          );
                          console.log("=========================");
                          return res.redirect("/admin/list_all_topic");
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        }
      });
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
  const _id = req.query.faculty_id;
  Guest.find({ faculty_id: _id })
    .populate("account_id")
    .populate("faculty_id")
    .exec()
    .then((guests) => {
      Faculty.findOne({ _id: _id })
        .exec()
        .then((faculty) => {
          console.log(guests);
          res.render("adminViews/admin_list_guest", {
            faculty: faculty,
            guests: guests,
          });
        });
    })
    .catch((err) => console.log(err));
};

// Get list faculty to add new guest
const getListFacultyForAddGuest = (req, res, next) => {
  Faculty.find({})
    .exec()
    .then((faculties) => {
      res.render("adminViews/add_guest", {
        faculties: faculties,
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

// Adding new Guest account
const addGuest_admin = async (req, res, next) => {
  const { usr, pwd, name, email, _id } = req.body;
  await AppUser.findOne({ username: usr, role: "guest" }).exec(
    async (err, user) => {
      if (err) {
        return console.log(err);
      } else if (user) {
        const msg = "Username has already exist !!!";
        return res.redirect(`/admin/add_guest?msg=${msg}`);
      } else if (pwd.length < 4) {
        const msg = "Password must be at least 4 characters !!!";
        return res.redirect(`/admin/add_guest?msg=${msg}`);
      } else {
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
              faculty_id: _id,
              account_id: user._id,
            });

            await newGuest.save();

            return res.redirect("/admin/list_all_guests?faculty_id=" + _id);
          }
        });
      }
    }
  );
};

// Update guest Account
const updateGuest_admin = (req, res, next) => {
  let user = {};
  let info = {};
  const _id = req.params.id;
  const { msg } = req.query;

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
                      err: msg,
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
                  err: msg,
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
          res.redirect("/admin/list_all_guests");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/admin/list_all_guests");
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
        return res.redirect(
          "/admin/list_all_guests?faculty_id=" + data.faculty_id
        );
      }
    }
  );
};

const updateGuestAcc_admin = async (req, res, next) => {
  const { usr, pwd, _id } = req.body;
  const newValue = {};
  if (usr) newValue.username = usr;
  if (pwd) newValue.password = pwd;

  Guest.findOne({ account_id: _id })
    .exec()
    .then(async (value) => {
      await AppUser.findOne({ username: usr, role: "guest" }).exec(
        async (err, user) => {
          if (err) {
            return console.log(err);
          } else if (user) {
            const msg = "Username has already exist !!!";
            return res.redirect(`/admin/update_guest/${_id}?msg=${msg}`);
          } else if (pwd.length < 4) {
            const msg = "Password must be at least 4 characters !!!";
            return res.redirect(`/admin/update_guest/${_id}?msg=${msg}`);
          } else {
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
                  return res.redirect(
                    "/admin/list_all_guests?faculty_id=" + value.faculty_id
                  );
                }
              }
            );
          }
        }
      );
    });
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
      res.redirect("/admin/list_all_guests?faculty_id=" + value.faculty_id);
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
      return res.redirect("/admin/list_all_guests");
    } else {
      console.log("Delete successfully in AppUser");
      Guest.findOneAndRemove({ account_id: _id })
        .then((result) => {
          console.log("Delete successfully in Guest");
          return res.redirect(
            "/admin/list_all_guests?faculty_id=" + result.faculty_id
          );
        })
        .catch((err) => {
          console.log(err);
          return res.redirect("/admin/list_all_guests");
        });
    }
  });
};

module.exports = {
  getListFacultyForAddStudent,
  getListFacultyForAddCoordinator,
  getListFacultyForAddGuest,
  listStudent_Admin,
  listCoordinator_Admin,
  listManager_Admin,
  listFaculty_admin,
  listTopic_admin,
  listGuest_admin,
  addStudent_admin,
  addCoordinator_admin,
  addManager_admin,
  addFaculty_admin,
  addTopic_admin,
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
  updatePageTopic_admin,
  updateTopic_admin,
  deleteStudent_Admin,
  deleteCoordinator_Admin,
  deleteManager_Admin,
  deleteGuest_Admin,
  deleteFaculty_admin,
  deleteTopic_admin,
  assignFacultyForStudent_admin,
  assignFacultyForCoordinator_admin,
  assignFacultyForGuest_admin,
};
