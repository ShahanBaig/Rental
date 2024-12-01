import express from "express";
import {
  forgotPassword,
  loginUser,
  logout,
  registerUser,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
  getUserReviews,
  getAllReviewsByLoggedInUser,
  getAllReviewsOfLoggedInUser
} from "../controllers/users.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router.route("/users/:id/reviews").get(getUserReviews);
router.route("/me/reviews/my-reviews").get(isAuthenticatedUser, getAllReviewsByLoggedInUser);
router.route("/me/reviews/recieved").get(isAuthenticatedUser, getAllReviewsOfLoggedInUser);

// Admin routes
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);


export default router;
