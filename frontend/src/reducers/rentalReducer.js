import {
  CREATE_RENTAL_REQUEST,
  CREATE_RENTAL_SUCCESS,
  CREATE_RENTAL_FAIL,

  CONFIRM_RENTAL_REQUEST,
  CONFIRM_RENTAL_SUCCESS,
  CONFIRM_RENTAL_FAIL,

  CREATE_RESCHEDULE_REQUEST,
  CREATE_RESCHEDULE_SUCCESS,
  CREATE_RESCHEDULE_FAIL,

  CONFIRM_RESCHEDULE_REQUEST,
  CONFIRM_RESCHEDULE_SUCCESS,
  CONFIRM_RESCHEDULE_FAIL,

  CANCEL_RENTAL_REQUEST,
  CANCEL_RENTAL_SUCCESS,
  CANCEL_RENTAL_FAIL,

  RENTAL_DETAILS_REQUEST,
  RENTAL_DETAILS_SUCCESS,
  RENTAL_DETAILS_FAIL,

  EXTERNAL_RENTALS_REQUEST,
  EXTERNAL_RENTALS_SUCCESS,
  EXTERNAL_RENTALS_FAIL,

  INTERNAL_RENTALS_REQUEST,
  INTERNAL_RENTALS_SUCCESS,
  INTERNAL_RENTALS_FAIL,

  ALL_RENTALS_REQUEST,
  ALL_RENTALS_SUCCESS,
  ALL_RENTALS_FAIL,

  DELETE_RENTAL_REQUEST,
  DELETE_RENTAL_SUCCESS,
  DELETE_RENTAL_FAIL,
  
  CLEAR_ERRORS,
  } from "../constants/rentalConstants";

  const initialStateRental = {
    loading: false,
    success: false,
    message: null,

    rental: null, 
    externalRentals: [],  
    internalRentals: [], 
  };

  export const rentalReducer = (state = initialStateRental, action) => {
    switch (action.type) {
      // Rental Details
      case RENTAL_DETAILS_REQUEST:
        return { ...state, loading: true, success: false, };
      case RENTAL_DETAILS_SUCCESS:
        return { ...state, loading: false, success: true, rental: action.payload.rental };
      case RENTAL_DETAILS_FAIL:
        return { ...state, loading: false, message: action.payload.message, rental: null };

      // External Rentals
      case EXTERNAL_RENTALS_REQUEST:
        return { ...state, loading: true, success: false };
      case EXTERNAL_RENTALS_SUCCESS:
        return { ...state, loading: false, success: true, externalRentals: action.payload.rentals };
      case EXTERNAL_RENTALS_FAIL:
        return { ...state, loading: false, message: action.payload.message, externalRentals: [] };
  
      // Internal Rentals
      case INTERNAL_RENTALS_REQUEST:
        return { ...state, loading: true, success: false };
      case INTERNAL_RENTALS_SUCCESS:
        return { ...state, loading: false, success: true, internalRentals: action.payload.rentals };
      case INTERNAL_RENTALS_FAIL:
        return { ...state, loading: false, message: action.payload.message, internalRentals: [] };

      // Create Rental
      case CREATE_RENTAL_REQUEST:
        return { ...state, success: false };
      case CREATE_RENTAL_SUCCESS:
        return { ...state, success: true, message: action.payload.message, rental: action.payload.rental };
      case CREATE_RENTAL_FAIL:
        return { ...state, message: action.payload.message };
  
      // Confirm Rental
      case CONFIRM_RENTAL_REQUEST:
        return { ...state, success: false };
      case CONFIRM_RENTAL_SUCCESS:
        return { ...state, success: true, message: action.payload.message, rental: action.payload.rental };
      case CONFIRM_RENTAL_FAIL:
        return { ...state, message: action.payload.message };

      // Request Reschedule
      case CREATE_RESCHEDULE_REQUEST:
        return { ...state, success: false };
      case CREATE_RESCHEDULE_SUCCESS:
        return { ...state, success: true, message: action.payload.message, rental: action.payload.rental };
      case CREATE_RESCHEDULE_FAIL:
        return { ...state, message: action.payload.message };
  
      // Confirm Reschedule
      case CONFIRM_RESCHEDULE_REQUEST:
        return { ...state, success: false };
      case CONFIRM_RESCHEDULE_SUCCESS:
        return { ...state, success: true, message: action.payload.message, rental: action.payload.rental };
      case CONFIRM_RESCHEDULE_FAIL:
        return { ...state, message: action.payload.message };
  
      // Cancel Rental
      case CANCEL_RENTAL_REQUEST:
        return { ...state, success: false };
      case CANCEL_RENTAL_SUCCESS:
        return { ...state, success: true, message: action.payload.message, rental: action.payload.rental };
      case CANCEL_RENTAL_FAIL:
        return { ...state, message: action.payload.message };
  
      // Clear Errors
      case CLEAR_ERRORS:
        return { ...state, message: null };
  
      default:
        return state;
    }
  };

  const initialStateAdminRental = {
    loading: false,
    message: null,

    rentals: [],
  };

  export const adminRentalReducer = (state = initialStateAdminRental, action) => {
    switch (action.type) {
      // Get All Rentals
      case ALL_RENTALS_REQUEST:
        return { ...state, loading: true, success: false };
      case ALL_RENTALS_SUCCESS:
        return { ...state, loading: false, success: true, rentals: action.payload.rentals };
      case ALL_RENTALS_FAIL:
        return { ...state, loading: false, message: action.payload.message};
  
      // Delete Rental
      case DELETE_RENTAL_REQUEST:
        return { ...state, loading: true, success: false };
      case DELETE_RENTAL_SUCCESS:
        return { ...state, loading: false, success: true, rentals: state.rentals.filter((rental) => rental._id !== action.payload._id) };
      case DELETE_RENTAL_FAIL:
        return { ...state, loading: false, message: action.payload.message};
  
      // Clear Errors
      case CLEAR_ERRORS:
        return { ...state, message: null };
  
      default:
        return state;
    }
  };