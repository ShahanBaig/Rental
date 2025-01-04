import express from "express";
import {
  createRental,
  confirmRental,
  getRentalDetails,
  requestReschedule,
  confirmReschedule,
  // updatePictures,
  // updateDispute,
  getAllRentals,
  deleteRentalWithId,
  myRentalRequestsForOthersPorducts,
  rentalRequestsForMyProducts,
  cancelRental,
} from "../controllers/rentals.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Routes
router.route("/rentals/new/:productId").post(isAuthenticatedUser, createRental);
router.put("/rentals/:id/confirm", isAuthenticatedUser, confirmRental);

router.route("/rentals/:id/reschedule/request").put(isAuthenticatedUser, requestReschedule)
router.route("/rentals/:id/reschedule/confirm").put(isAuthenticatedUser, confirmReschedule)

router.route("/rentals/:id/cancel").put(isAuthenticatedUser, cancelRental);

router.route("/rentals/:id").get(isAuthenticatedUser, getRentalDetails)
router.route("/rentals/me/requests/external").get(isAuthenticatedUser, myRentalRequestsForOthersPorducts);
router.route("/rentals/me/requests/internal").get(isAuthenticatedUser, rentalRequestsForMyProducts);

// Admin routes
router.route("/admin/rentals").get(isAuthenticatedUser, authorizeRoles("admin"), getAllRentals);
router.route("/admin/rentals/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteRentalWithId)

// router.route("/rentals/:id/update/pictures").put(isAuthenticatedUser, updatePictures)
// router.route("/rentals/:id/update/dispute").put(isAuthenticatedUser, updateDispute)

export default router;
