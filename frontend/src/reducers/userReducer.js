import {
  LOGIN_REQUEST,
  LOGIN_FAIL,
  LOGIN_SUCCESS,

  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,

  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,

  LOGOUT_SUCCESS,
  LOGOUT_FAIL,

  UPDATE_ACCOUNT_REQUEST,
  UPDATE_ACCOUNT_SUCCESS,
  UPDATE_ACCOUNT_FAIL,

  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,

  UPDATE_PAYMENT_REQUEST,
  UPDATE_PAYMENT_SUCCESS,
  UPDATE_PAYMENT_FAIL,

  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,

  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,

  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  ALL_USERS_FAIL,

  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,

  UPDATE_ROLE_REQUEST,
  UPDATE_ROLE_SUCCESS,
  UPDATE_ROLE_FAIL,

  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,

  CLEAR_ERRORS,
} from "../constants/userConstants";

const initialStateUser = {
  loading: false,
  success: false, 
  message: null, 

  details: null,
  isAuthenticated: false, 
};

export const userReducer = (state = initialStateUser, action) => {
  switch (action.type) {
    // Register
    case REGISTER_USER_REQUEST:
      return { ...state, loading: true, success: false };
    case REGISTER_USER_SUCCESS:
      return { ...state, loading: false, message: null, details: action.payload.user, success: true, isAuthenticated: true, };
    case REGISTER_USER_FAIL:
      return { ...state, loading: false, message: action.payload.message, details: null, isAuthenticated: false };

    // Login
    case LOGIN_REQUEST:
      return { ...state, loading: true, success: false };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, message: null, details: action.payload.user, success: true, isAuthenticated: true, };
    case LOGIN_FAIL:
      return { ...state, loading: false, message: action.payload.message, details: null, isAuthenticated: false };

    // Load User
    case LOAD_USER_REQUEST:
      return { ...state, loading: true, success: false };
    case LOAD_USER_SUCCESS:
      return { ...state, loading: false, success: true, message: null, details: action.payload.user };
    case LOAD_USER_FAIL:
      return { ...state, loading: false, message: action.payload, details: null };

    // Logout
    case LOGOUT_SUCCESS:
      return { ...state, details: null, success: true, isAuthenticated: false };
    case LOGOUT_FAIL:
      return { ...state, message: action.payload.message, success: false };

    // Forgot Password
    case FORGOT_PASSWORD_REQUEST:
      return { ...state, loading: true, success: false };
    case FORGOT_PASSWORD_SUCCESS:
      return { ...state, loading: false, message: action.payload.message, success: true };
    case FORGOT_PASSWORD_FAIL:
      return { ...state, loading: false, message: action.payload.message };

    // Reset Password
    case RESET_PASSWORD_REQUEST:
      return { ...state, loading: true, success: false };
    case RESET_PASSWORD_SUCCESS:
      return { ...state, loading: false, details: action.payload.user, success: true, isAuthenticated: true };
    case RESET_PASSWORD_FAIL:
      return { ...state, loading: false, message: action.payload.message };

    // Update Account
    case UPDATE_ACCOUNT_REQUEST:
      return { ...state, loading: true, success: false };
    case UPDATE_ACCOUNT_SUCCESS:
      return { ...state, loading: false, details: action.payload.user, success: true, message: action.payload.message };
    case UPDATE_ACCOUNT_FAIL:
      return { ...state, loading: false, message: action.payload.message };

    // Update Password
    case UPDATE_PASSWORD_REQUEST:
      return { ...state, loading: true, success: false };
    case UPDATE_PASSWORD_SUCCESS:
      return { ...state, loading: false, success: true, message: action.payload.message };
    case UPDATE_PASSWORD_FAIL:
      return { ...state, loading: false, message: action.payload.message };

    // Update Payment Method
    case UPDATE_PAYMENT_REQUEST:
      return { ...state, loading: true, success: false };
    case UPDATE_PAYMENT_SUCCESS:
      return { ...state, loading: false, success: true, message: action.payload.message, details: action.payload.user };
    case UPDATE_PAYMENT_FAIL:
      return { ...state, loading: false, message: action.payload.message };

    // Clear Errors
    case CLEAR_ERRORS:
      return { ...state, message: null };

    default:
      return state;
  }
};

const initialStateAdmin = {
  loading: false,
  message: null,
  success: false,

  users: [], 
  userDetails: null, 
};

export const adminUserReducer = (state = initialStateAdmin, action) => {
  switch (action.type) {
    // Get All Users
    case ALL_USERS_REQUEST:
      return { ...state, loading: true, success: false };
    case ALL_USERS_SUCCESS:
      return { ...state, loading: false, users: action.payload.users, success: true };
    case ALL_USERS_FAIL:
      return { ...state, loading: false, users: [], message: action.payload.message };

    // Get User Details
    case USER_DETAILS_REQUEST:
      return { ...state, loading: true, success: false };
    case USER_DETAILS_SUCCESS:
      return { ...state, loading: false, user: action.payload.user, success: true };
    case USER_DETAILS_FAIL:
      return { ...state, loading: false, user: null, message: action.payload.message };

    // Delete User
    case DELETE_USER_REQUEST:
      return { ...state, loading: true, success: false };
    case DELETE_USER_SUCCESS:
      return { ...state, loading: false, message: action.payload.message,  success: true };
    case DELETE_USER_FAIL:
      return { ...state, loading: false, message: action.payload.message };

    // Update Role
    case UPDATE_ROLE_REQUEST:
      return { ...state, loading: true, success: false };
    case UPDATE_ROLE_SUCCESS:
      return { ...state, loading: false, message: action.payload.message, success: true };
    case UPDATE_ROLE_FAIL:
      return { ...state, loading: false, message: action.payload.message };

    // Clear Errors
    case CLEAR_ERRORS:
      return { ...state, message: null };

    default:
      return state;
  }
};