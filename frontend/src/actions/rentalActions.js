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
  
  import axios from "axios";

  const apiUrl = import.meta.env.VITE_API_URL; 
  
  // Create Rental
  export const createRental = (productId, anticipatedStart, days) => async (dispatch) => {
    try {
      dispatch({ type: CREATE_RENTAL_REQUEST });
  
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(`${apiUrl}/api/v1/rentals/new/${productId}`, { anticipatedStart, days }, config);
  
      dispatch({ type: CREATE_RENTAL_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: CREATE_RENTAL_FAIL,
        payload: error.response.data,
      });
    }
  };

  // Confirm Rental
  export const confirmRental = (rentalId, isApproved) => async (dispatch) => {
    try {
      dispatch({ type: CONFIRM_RENTAL_REQUEST });
  
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(`${apiUrl}/api/v1/rentals/${rentalId}/confirm`, isApproved, config);
  
      dispatch({ type: CONFIRM_RENTAL_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: CONFIRM_RENTAL_FAIL,
        payload: error.response.data,
      });
    }
  };

  // Request Reschedule
  export const requestReschedule = (rentalId, anticipatedStart, days) => async (dispatch) => {
    try {
      dispatch({ type: CREATE_RESCHEDULE_REQUEST });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(`${apiUrl}/api/v1/rentals/${rentalId}/reschedule/request`, { anticipatedStart, days }, config);

      dispatch({ type: CREATE_RESCHEDULE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: CREATE_RESCHEDULE_FAIL,
        payload: error.response.data,
      });
    }
  };

  // Confirm Reschedule
  export const confirmReschedule = (rentalId, isApproved) => async (dispatch) => {
    try {
      dispatch({ type: CONFIRM_RESCHEDULE_REQUEST });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(`${apiUrl}/api/v1/rentals/${rentalId}/reschedule/confirm`, isApproved, config);

      dispatch({ type: CONFIRM_RESCHEDULE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: CONFIRM_RESCHEDULE_FAIL,
        payload: error.response.data,
      });
    }
  };

  // Cancel Reschedule
  export const cancelRental = (rentalId, reason) => async (dispatch) => {
    try {
      dispatch({ type: CANCEL_RENTAL_REQUEST });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(`${apiUrl}/api/v1/rentals/${rentalId}/cancel`, reason, config);

      dispatch({ type: CANCEL_RENTAL_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: CANCEL_RENTAL_FAIL,
        payload: error.response.data,
      });
    }
  };

  // Get Rental Details
  export const getRentalDetails = (rentalId) => async (dispatch) => {
    try {
      dispatch({ type: RENTAL_DETAILS_REQUEST });
  
      const { data } = await axios.get(`${apiUrl}/api/v1/rentals/${rentalId}`);
  
      dispatch({ type: RENTAL_DETAILS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: RENTAL_DETAILS_FAIL,
        payload: error.response.data,
      });
    }
  };

  // External Rentals
  export const externalRentals = () => async (dispatch) => {
    try {
      dispatch({ type: EXTERNAL_RENTALS_REQUEST });
  
      const { data } = await axios.get(`${apiUrl}/api/v1/rentals/me/requests/external`);
  
      dispatch({ type: EXTERNAL_RENTALS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: EXTERNAL_RENTALS_FAIL,
        payload: error.response.data,
      });
    }
  };

  // Internal Rentals
  export const internalRentals = () => async (dispatch) => {
    try {
      dispatch({ type: INTERNAL_RENTALS_REQUEST });
  
      const { data } = await axios.get(`${apiUrl}/api/v1/rentals/me/requests/internal`);
  
      dispatch({ type: INTERNAL_RENTALS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: INTERNAL_RENTALS_FAIL,
        payload: error.response.data,
      });
    }
  };

  // Get All Rentals
  export const getAllRentals = () => async (dispatch) => {
    try {
      dispatch({ type: ALL_RENTALS_REQUEST });
  
      const { data } = await axios.get(`${apiUrl}/api/v1/admin/rentals`);
  
      dispatch({ type: ALL_RENTALS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: ALL_RENTALS_FAIL,
        payload: error.response.data,
      });
    }
  };
  
  // Delete Rental
  export const deleteRental = (rentalId) => async (dispatch) => {
    try {
      dispatch({ type: DELETE_RENTAL_REQUEST });
  
      const { data } = await axios.delete(`${apiUrl}/api/v1/admin/rentals/${rentalId}`);
  
      dispatch({ type: DELETE_RENTAL_SUCCESS, payload: { _id: rentalId, ...data } });
    } catch (error) {
      dispatch({
        type: DELETE_RENTAL_FAIL,
        payload: error.response.data,
      });
    }
  };
  
  // Clearing Errors
  export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
  };