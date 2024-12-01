import express from "express";
import {
  createReview,
  getReviewDetails,
  updateReview,
  deleteReview,
  getAllReviews,
  deleteReviewWithId,
} from "../controllers/reviews.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Routes
router.route("/reviews/new/:userId").post(isAuthenticatedUser, createReview);
router
  .route("/reviews/:id")
  .get(getReviewDetails)
  .put(isAuthenticatedUser, updateReview)
  .delete(isAuthenticatedUser, deleteReview);

// Admin routes
router
  .route("/admin/reviews")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllReviews);
router
  .route("/admin/reviews/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReviewWithId);

export default router;
