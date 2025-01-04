import express from "express";
import {processPayment, sendStripeApiKey} from "../controllers/payments.js";
import { isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

// Routes
router.route("/payment/process").post(isAuthenticatedUser, processPayment);
router.route("/stripe-api-key").get(isAuthenticatedUser, sendStripeApiKey);

export default router;