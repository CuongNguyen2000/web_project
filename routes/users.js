var express = require("express");
var router = express.Router();
var AppUser = require("../models/AppUserModel");
var Student = require("../models/StudentModel");
var Articles = require("../models/ArticlesModel");

var {
  isAdmin,
  isStudent,
  isCoordinator,
  isManager,
} = require("../middlewares/RequiresLogin");

var multerInstance = require("../middlewares/upload");

var { Login, Logout } = require("../controllers/LoginControllers");

var {
  GetStudentHome,
  addImage_student,
  getListArticles_student,
} = require("../controllers/StudentController");

var {
  GetCoordinatorHome,
  getListArticles_coordinator,
} = require("../controllers/CoordinatorController");
var { GetManagerHome } = require("../controllers/ManagerController");

var {
  listStudent_Admin,
  listCoordinator_Admin,
  listManager_Admin,
  listFaculty_admin,
  addStudent_admin,
  addCoordinator_admin,
  addManager_admin,
  addFaculty_admin,
  updateStudent_admin,
  updateStudentAcc_admin,
  updateStudentInfo_admin,
  updateCoordinator_admin,
  updateCoordinatorAcc_admin,
  updateCoordinatorInfo_admin,
  updateManager_admin,
  updateManagerAcc_admin,
  updateManagerInfo_admin,
  updatePageFaculty_admin,
  updateFaculty_admin,
  deleteStudent_Admin,
  deleteCoordinator_Admin,
  deleteManager_Admin,
  deleteFaculty_admin,
  assignFacultyForStudent_admin,
  assignFacultyForCoordinator_admin,
} = require("../controllers/AdminController");
const { route } = require(".");

/* ================================================================
===================================================================
===================================================================
===================================================================
=================================================================== */

// Get login page
router.get("/login", (req, res, next) => {
  res.render("login");
});

// Get login / logout request
router.post("/login", Login);
router.get("/logout", Logout);
// router.get("/signup", SignUp);

/* ================================================================
===================================================================
===================================================================
===================================================================
=================================================================== */

// The processing section for Administrator is below
// Admin request

// Get homepage
router.get("/admin/home", isAdmin, (req, res, next) => {
  res.render("admin_home");
});

// Displaying user accounts / list faculties
router.get("/admin/list_all_students", isAdmin, listStudent_Admin);
router.get("/admin/list_all_coordinators", isAdmin, listCoordinator_Admin);
router.get("/admin/list_all_managers", isAdmin, listManager_Admin);
router.get("/admin/list_all_faculty", isAdmin, listFaculty_admin);

// Adding new user account
router.get("/admin/add_student", isAdmin, (req, res, next) => {
  res.render("admin_add_student");
});
router.post("/admin/add_student", isAdmin, addStudent_admin);

router.get("/admin/add_coordinator", isAdmin, (req, res, next) => {
  res.render("admin_add_coordinator");
});
router.post("/admin/add_coordinator", isAdmin, addCoordinator_admin);

router.get("/admin/add_manager", isAdmin, (req, res, next) => {
  res.render("admin_add_manager");
});
router.post("/admin/add_manager", isAdmin, addManager_admin);

// Adding new Faculty
router.get("/admin/add_faculty", isAdmin, (req, res, next) => {
  res.render("admin_add_faculty");
});
router.post("/admin/add_faculty", isAdmin, addFaculty_admin);

// Update student
router.put("/admin/update_student_account", isAdmin, updateStudentAcc_admin);
router.put(
  "/admin/update_student_information",
  isAdmin,
  updateStudentInfo_admin
);
router.post("/admin/update_student", isAdmin, updateStudent_admin);

// Update Marketing Coordinator
router.put(
  "/admin/update_coordinator_account",
  isAdmin,
  updateCoordinatorAcc_admin
);
router.put(
  "/admin/update_coordinator_information",
  isAdmin,
  updateCoordinatorInfo_admin
);
router.post("/admin/update_coordinator", isAdmin, updateCoordinator_admin);

//Update Marketing Manger
router.put("/admin/update_manager_account", isAdmin, updateManagerAcc_admin);
router.put(
  "/admin/update_manager_information",
  isAdmin,
  updateManagerInfo_admin
);
router.post("/admin/update_manager", isAdmin, updateManager_admin);

// Update Faculty
router.put("/admin/update_faculty_information", isAdmin, updateFaculty_admin);
router.post("/admin/update_faculty", isAdmin, updatePageFaculty_admin);

// assign faculty for student / coordinator
router.put(
  "/admin/assign_faculty_student",
  isAdmin,
  assignFacultyForStudent_admin
);
router.put(
  "/admin/assign_faculty_coordinator",
  isAdmin,
  assignFacultyForCoordinator_admin
);

// Delete user account / faculty
router.delete("/admin/delete_student", isAdmin, deleteStudent_Admin);
router.delete("/admin/delete_coordinator", isAdmin, deleteCoordinator_Admin);
router.delete("/admin/delete_manager", isAdmin, deleteManager_Admin);
router.delete("/admin/delete_faculty", isAdmin, deleteFaculty_admin);

/* ================================================================
===================================================================
===================================================================
===================================================================
=================================================================== */

// The processing section for Marketing Coordinator is below
// Coordinator request

// Get Homepage
router.get("/coordinator/home", isCoordinator, GetCoordinatorHome);

// get list of article page
router.get(
  "/coordinator/list_articles",
  isCoordinator,
  getListArticles_coordinator
);

/* ================================================================
===================================================================
===================================================================
===================================================================
=================================================================== */

// The processing section for Student is below
// Student request

// Get Homepage
router.get("/student/home", isStudent, GetStudentHome);

router.get("/student/list_articles", isStudent, getListArticles_student);

router.get("/student/add_image", isStudent, (req, res, next) => {
  res.render("student_add_image");
});

router.post(
  "/student/add_image",
  multerInstance.single("image"),
  isStudent,
  addImage_student
);

/* ================================================================
===================================================================
===================================================================
===================================================================
=================================================================== */

// The processing section for Marketing Manager is below
// Manager Request

// Get Homepage
router.get("/manager/home", isManager, GetManagerHome);

module.exports = router;
