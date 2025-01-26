import express from "express";
import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  getLoggedInUserDetails,
  updatePassword,
  updateAccount,
  updatePaymentInformation,
  getAllUsers,
  getUser,
  updateUserRole,
  deleteUser,
  getUserReviews,
  getAllReviewsByLoggedInUser,
  getAllReviewsOfLoggedInUser
} from "../controllers/users.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me").get(isAuthenticatedUser, getLoggedInUserDetails);
router.route("/me/update").put(isAuthenticatedUser, updateAccount);
router.route("/me/update/payment-method").put(isAuthenticatedUser, updatePaymentInformation);


router.route("/users/:id/reviews").get(getUserReviews);
router.route("/me/reviews/my-reviews").get(isAuthenticatedUser, getAllReviewsByLoggedInUser);
router.route("/me/reviews/recieved").get(isAuthenticatedUser, getAllReviewsOfLoggedInUser);

// Admin routes
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);


export default router;
