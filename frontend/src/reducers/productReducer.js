import {
  PRODUCTS_REQUEST,
  PRODUCTS_SUCCESS,
  PRODUCTS_FAIL,

  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,

  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,

  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,

  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,

  CLEAR_ERRORS,
} from "../constants/productConstants";

const initialStateProducts = {
  loading: false,
  message: null,
  success: false,

  products: [],
  product: null,
};

export const productReducer = (state = initialStateProducts, action) => {
  switch (action.type) {
    // Get Products
    case PRODUCTS_REQUEST:
      return { ...state, loading: true, success: false };
    case PRODUCTS_SUCCESS:
      return { ...state, loading: false, success: true, products: action.payload.products };
    case PRODUCTS_FAIL:
      return { ...state, loading: false, message: action.payload.message, products: [] };

    // Product Details
    case PRODUCT_DETAILS_REQUEST:
      return { ...state, loading: true, success: false };
    case PRODUCT_DETAILS_SUCCESS:
      return { ...state, loading: false, success: true, product: action.payload.product };
    case PRODUCT_DETAILS_FAIL:
      return { ...state, loading: false, message: action.payload.message, product: null };

    // Create Product
    case NEW_PRODUCT_REQUEST:
      return { ...state, loading: true, success: false };
    case NEW_PRODUCT_SUCCESS:
      return { ...state, loading: false, success: true, message: action.payload.message };
    case NEW_PRODUCT_FAIL:
      return { ...state, loading: false, message: action.payload.message };

    // Update Product
    case UPDATE_PRODUCT_REQUEST:
      return { ...state, loading: true, success: false };
    case UPDATE_PRODUCT_SUCCESS:
      return { ...state, loading: false, message: action.payload.message, success: true, product: action.payload.product };
    case UPDATE_PRODUCT_FAIL:
      return { ...state, loading: false, message: action.payload.message };

    // Delete Product
    case DELETE_PRODUCT_REQUEST:
      return { ...state, loading: true, success: false };
    case DELETE_PRODUCT_SUCCESS:
      return { ...state, loading: false, message: action.payload.message, success: true };
    case DELETE_PRODUCT_FAIL:
      return { ...state, loading: false, message: action.payload.message };

    // Clear Errors
    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};