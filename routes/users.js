var express = require("express");
var router = express.Router();
var AppUser = require("../models/AppUserModel");
var Student = require("../models/StudentModel");
var Articles = require("../models/ArticlesModel");
var session = require("express-session");

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
} = require("../controllers/StudentController");

var { GetCoordinatorHome } = require("../controllers/CoordinatorController");
var { GetManagerHome } = require("../controllers/ManagerController");

var {
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
} = require("../controllers/AdminController");
const { route } = require(".");

// Session
router.use(
  session({
    secret: "mySecretSession",
    resave: true,
    saveUninitialized: false,
  })
);

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

// Displaying user accounts
router.get("/admin/list_all_students", isAdmin, listStudent_Admin);
router.get("/admin/list_all_coordinators", isAdmin, listCoordinator_Admin);
router.get("/admin/list_all_managers", isAdmin, listManager_Admin);

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

// Delete user account
router.delete("/admin/delete_student", isAdmin, deleteStudent_Admin);
router.delete("/admin/delete_coordinator", isAdmin, deleteCoordinator_Admin);
router.delete("/admin/delete_manager", isAdmin, deleteManager_Admin);

/* ================================================================
===================================================================
===================================================================
===================================================================
=================================================================== */

// The processing section for Marketing Coordinator is below
// Coordinator request

// Get Homepage
router.get("/coordinator/home", isCoordinator, GetCoordinatorHome);

/* ================================================================
===================================================================
===================================================================
===================================================================
=================================================================== */

// The processing section for Student is below
// Student request

// Get Homepage
router.get("/student/home", isStudent, GetStudentHome);

router.get("/student/list_images", isStudent, (req, res, next) => {
  Articles.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      console.log(items);
      res.render("student_home", { items: items });
    }
  });
});

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
