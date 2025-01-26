import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductDetails,
} from "../controllers/products.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Routes
router.route("/products").get(getProducts);

router
  .route("/product/new")
  .post(isAuthenticatedUser, createProduct);

router
  .route("/product/:id")
  .put(isAuthenticatedUser, updateProduct)
  .delete(isAuthenticatedUser, deleteProduct)

router.route("/product/:id").get(getProductDetails);

// Admin routes

export default router;
