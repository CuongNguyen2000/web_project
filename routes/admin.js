var express = require("express");
var router = express.Router();

var { isAdmin } = require("../middleware/RequiresLogin");

var {
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
} = require("../controllers/AdminController");

const Faculty = require("../models/FacultyModel");

// The processing section for Administrator is below
// Admin request

// Get homepage
router.get("/home", isAdmin, (req, res, next) => {
  res.render("adminViews/admin_home");
});

// Displaying user accounts / list faculties
router.get("/list_all_students", isAdmin, listStudent_Admin);
router.get("/list_all_coordinators", isAdmin, listCoordinator_Admin);
router.get("/list_all_managers", isAdmin, listManager_Admin);
router.get("/list_all_guests", isAdmin, listGuest_admin);
router.get("/list_all_faculty", isAdmin, listFaculty_admin);
router.get("/list_all_topic", isAdmin, listTopic_admin);

router.get("/list_faculties_student", isAdmin, getListFacultyForAddStudent);
router.get(
  "/list_faculties_coordinator",
  isAdmin,
  getListFacultyForAddCoordinator
);
router.get("/list_faculties_guest", isAdmin, getListFacultyForAddGuest);

// Adding new user account
router.get("/add_student", isAdmin, (req, res, next) => {
  const _id = req.query.faculty_id;
  const { msg } = req.query;
  Faculty.findOne({ _id: _id })
    .exec()
    .then((faculty) => {
      res.render("adminViews/admin_add_student", {
        err: msg,
        faculty: faculty,
        title: "Adding new Student Account",
      });
    });
});
router.post("/add_student", isAdmin, addStudent_admin);

router.get("/add_coordinator", isAdmin, (req, res, next) => {
  const _id = req.query.faculty_id;
  const { msg } = req.query;
  Faculty.findOne({ _id: _id })
    .exec()
    .then((faculty) => {
      res.render("adminViews/admin_add_coordinator", {
        err: msg,
        faculty: faculty,
        title: "Adding new coordinator Account",
      });
    });
});
router.post("/add_coordinator", isAdmin, addCoordinator_admin);

router.get("/add_manager", isAdmin, (req, res, next) => {
  const { msg } = req.query;
  res.render("adminViews/admin_add_manager", {
    err: msg,
    title: "Adding new manager account",
  });
});
router.post("/add_manager", isAdmin, addManager_admin);

router.get("/add_guest", isAdmin, (req, res, next) => {
  const _id = req.query.faculty_id;
  const { msg } = req.query;
  Faculty.findOne({ _id: _id })
    .exec()
    .then((faculty) => {
      res.render("adminViews/admin_add_guest", {
        err: msg,
        faculty: faculty,
        title: "Adding new guest account",
      });
    });
});
router.post("/add_guest", isAdmin, addGuest_admin);

// Adding new Faculty
router.get("/add_faculty", isAdmin, (req, res, next) => {
  const { msg } = req.query;
  res.render("adminViews/admin_add_faculty", {
    err: msg,
    title: "Adding new faculty",
  });
});
router.post("/add_faculty", isAdmin, addFaculty_admin);

// Adding new Topic
router.get("/add_topic", isAdmin, (req, res, next) => {
  const { msg } = req.query;
  res.render("adminViews/admin_add_topic", {
    err: msg,
    title: "Adding new topic",
  });
});
router.post("/add_topic", isAdmin, addTopic_admin);

// Update student
router.put("/update_student_account", isAdmin, updateStudentAcc_admin);
router.put("/update_student_information", isAdmin, updateStudentInfo_admin);
router.put("/assign_faculty_student", isAdmin, assignFacultyForStudent_admin);
router.get("/update_student/:id", isAdmin, updateStudent_admin);

// Update Marketing Coordinator
router.put("/update_coordinator_account", isAdmin, updateCoordinatorAcc_admin);
router.put(
  "/update_coordinator_information",
  isAdmin,
  updateCoordinatorInfo_admin
);
router.put(
  "/assign_faculty_coordinator",
  isAdmin,
  assignFacultyForCoordinator_admin
);
router.get("/update_coordinator/:id", isAdmin, updateCoordinator_admin);

//Update Marketing Manger
router.put("/update_manager_account", isAdmin, updateManagerAcc_admin);
router.put("/update_manager_information", isAdmin, updateManagerInfo_admin);
router.get("/update_manager/:id", isAdmin, updateManager_admin);

// Update Guest
router.put("/update_guest_account", isAdmin, updateGuestAcc_admin);
router.put("/update_guest_information", isAdmin, updateGuestInfo_admin);
router.put("/assign_faculty_guest", isAdmin, assignFacultyForGuest_admin);
router.get("/update_guest/:id", isAdmin, updateGuest_admin);

// Update Faculty
router.put("/update_faculty_information", isAdmin, updateFaculty_admin);
router.get("/update_faculty/:id", isAdmin, updatePageFaculty_admin);

// Update Topic
router.put("/update_topic_information", isAdmin, updateTopic_admin);
router.get("/update_topic/:id", isAdmin, updatePageTopic_admin);

// Delete user account / faculty
router.delete("/delete_student", isAdmin, deleteStudent_Admin);
router.delete("/delete_coordinator", isAdmin, deleteCoordinator_Admin);
router.delete("/delete_manager", isAdmin, deleteManager_Admin);
router.delete("/delete_guest", isAdmin, deleteGuest_Admin);
router.delete("/delete_faculty", isAdmin, deleteFaculty_admin);
router.delete("/delete_topic", isAdmin, deleteTopic_admin);

module.exports = router;
