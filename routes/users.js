var express = require("express");
var router = express.Router();

var {
  isAdmin,
  isStudent,
  isCoordinator,
  isManager,
  isGuest,
} = require("../middlewares/RequiresLogin");

var multerInstance = require("../middlewares/uploadImage");

var { Login, Logout } = require("../controllers/LoginControllers");

var {
  GetStudentHome,
  addArticle_student,
  getListArticles_student,
  getUpdateArticle_student,
  deleteArticle_student,
  assignTopicForArticle_student,
} = require("../controllers/StudentController");

var {
  GetCoordinatorHome,
  getListArticles_coordinator,
  acceptArticle_coordinator,
  getListByTechnology_coordinator,
  getListByFC_coordinator,
} = require("../controllers/CoordinatorController");

var {
  GetManagerHome,
  getListArticles_manager,
} = require("../controllers/ManagerController");

var { GetGuestHome } = require("../controllers/guestController");

var {
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

const { route } = require(".");

/* ================================================================
===================================================================
===================================================================
===================================================================
=================================================================== */

// Get login page
router.get("/login", (req, res, next) => {
  const { msg } = req.query;
  res.render("login", { err: msg });
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
  res.render("adminViews/admin_home");
});

// Displaying user accounts / list faculties
router.get("/admin/list_all_students", isAdmin, listStudent_Admin);
router.get("/admin/list_all_coordinators", isAdmin, listCoordinator_Admin);
router.get("/admin/list_all_managers", isAdmin, listManager_Admin);
router.get("/admin/list_all_guests", isAdmin, listGuest_admin);
router.get("/admin/list_all_faculty", isAdmin, listFaculty_admin);
router.get("/admin/list_all_topic", isAdmin, listTopic_admin);

// Adding new user account
router.get("/admin/add_student", isAdmin, (req, res, next) => {
  const { msg } = req.query;
  res.render("adminViews/admin_add_student", { err: msg });
});
router.post("/admin/add_student", isAdmin, addStudent_admin);

router.get("/admin/add_coordinator", isAdmin, (req, res, next) => {
  const { msg } = req.query;
  res.render("adminViews/admin_add_coordinator", { err: msg });
});
router.post("/admin/add_coordinator", isAdmin, addCoordinator_admin);

router.get("/admin/add_manager", isAdmin, (req, res, next) => {
  const { msg } = req.query;
  res.render("adminViews/admin_add_manager", { err: msg });
});
router.post("/admin/add_manager", isAdmin, addManager_admin);

router.get("/admin/add_guest", isAdmin, (req, res, next) => {
  const { msg } = req.query;
  res.render("adminViews/admin_add_guest", { err: msg });
});
router.post("/admin/add_guest", isAdmin, addGuest_admin);

// Adding new Faculty
router.get("/admin/add_faculty", isAdmin, (req, res, next) => {
  const { msg } = req.query;
  res.render("adminViews/admin_add_faculty", { err: msg });
});
router.post("/admin/add_faculty", isAdmin, addFaculty_admin);

// Adding new Topic
router.get("/admin/add_topic", isAdmin, (req, res, next) => {
  const { msg } = req.query;
  res.render("adminViews/admin_add_topic", { err: msg });
});
router.post("/admin/add_topic", isAdmin, addTopic_admin);

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

// Update Guest
router.put("/admin/update_guest_account", isAdmin, updateGuestAcc_admin);
router.put("/admin/update_guest_information", isAdmin, updateGuestInfo_admin);
router.post("/admin/update_guest", isAdmin, updateGuest_admin);

// Update Faculty
router.put("/admin/update_faculty_information", isAdmin, updateFaculty_admin);
router.post("/admin/update_faculty", isAdmin, updatePageFaculty_admin);

// Update Topic
router.put("/admin/update_topic_information", isAdmin, updateTopic_admin);
router.post("/admin/update_topic", isAdmin, updatePageTopic_admin);

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

router.put("/admin/assign_faculty_guest", isAdmin, assignFacultyForGuest_admin);

// Delete user account / faculty
router.delete("/admin/delete_student", isAdmin, deleteStudent_Admin);
router.delete("/admin/delete_coordinator", isAdmin, deleteCoordinator_Admin);
router.delete("/admin/delete_manager", isAdmin, deleteManager_Admin);
router.delete("/admin/delete_guest", isAdmin, deleteGuest_Admin);
router.delete("/admin/delete_faculty", isAdmin, deleteFaculty_admin);
router.delete("/admin/delete_topic", isAdmin, deleteTopic_admin);

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

// accept article for publication
router.put(
  "/coordinator/accept_article",
  isCoordinator,
  acceptArticle_coordinator
);

router.get(
  "/coordinator/list_technologies_articles",
  isCoordinator,
  getListByTechnology_coordinator
);

router.get(
  "/coordinator/list_F&C_articles",
  isCoordinator,
  getListByFC_coordinator
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

router.get("/student/add_article", isStudent, (req, res, next) => {
  res.render("studentViews/student_add_image");
});

router.post(
  "/student/add_article",
  multerInstance.single("image"),
  isStudent,
  addArticle_student
);

router.delete("/student/delete_article", isStudent, deleteArticle_student);

router.put(
  "/student/assign_topic_article",
  isStudent,
  assignTopicForArticle_student
);
router.post("/student/update_article", isStudent, getUpdateArticle_student);

router.get("/student/term_and_conditions", isStudent, (req, res, next) => {
  res.render("term_conditions");
});

/* ================================================================
===================================================================
===================================================================
===================================================================
=================================================================== */

// The processing section for Marketing Manager is below
// Manager Request

// Get Homepage
router.get("/manager/home", isManager, GetManagerHome);

// get list article page
router.get("/manager/list_articles", isManager, getListArticles_manager);

/* ================================================================
===================================================================
===================================================================
===================================================================
=================================================================== */

// The processing section for guest is below
// Guest request

// Get Homepage
router.get("/guest/home", isGuest, GetGuestHome);

module.exports = router;
