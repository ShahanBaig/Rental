import express from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductDetails
} from "../controllers/products.js";
import { isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.route('/').get(getAllProducts)
router.route('/new').post(isAuthenticatedUser, createProduct)
router.route('/:id').put(isAuthenticatedUser, updateProduct).delete(isAuthenticatedUser, deleteProduct).get(getProductDetails)

export default router;