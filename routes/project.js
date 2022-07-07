const express = require("express");
const router = express.Router();

// Project controllers
const {
  addProject,
  getAllProjects,
  getStudentAllProjects,
  getOneProject,
  updateProjectAdmin,
  deleteProjectAdmin,
  addAndUpdateReview,
  deleteReview,
  getAllProjectReviews,
} = require("../controllers/projectControllers");

// middleware imports
const { isLoggedIn, customRole } = require("../middlewares/user");

// All user routes
router.route("/Projects").get(isLoggedIn, customRole("user"),getAllProjects);
router.route("/Project/:id").get(isLoggedIn, customRole("user"),getOneProject);


// Admin/mentor routes
router.route("/admin/project/addReview").put(isLoggedIn, customRole("admin"),addAndUpdateReview);
router
  .route("/admin/project/deleteReview")
  .delete(isLoggedIn, customRole("admin"), deleteReview);
router
  .route("/admin/project/reviews/:id")
  .get(isLoggedIn, customRole("admin"), getAllProjectReviews);
router
  .route("/admin/Project/:id")
  .put(isLoggedIn, customRole("admin"), updateProjectAdmin)
  .delete(isLoggedIn, customRole("admin"), deleteProjectAdmin);

// student routes
router
  .route("/student/addProject")
  .post(isLoggedIn, customRole("user"), addProject);
  router
    .route("/student/AllProjects")
    .get(isLoggedIn, customRole("user","admin"), getStudentAllProjects);

module.exports = router;
