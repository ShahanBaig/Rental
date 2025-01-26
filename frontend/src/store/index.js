import { configureStore } from "@reduxjs/toolkit";
// import thunk from "redux-thunk";
import rootReducer from "./persist";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";


// let preloadedState = {
//   cart: {
//     cartItems: localStorage.getItem("cartItems")
//       ? JSON.parse(localStorage.getItem("cartItems"))
//       : [],
//     shippingInfo: localStorage.getItem("shippingInfo")
//       ? JSON.parse(localStorage.getItem("shippingInfo"))
//       : {},
//   },
// };

let preloadedState = {};

// Configure Store
const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // ignore for the following so no issues internally in redux persist
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// // Configure Store
// const store = configureStore({
//   reducer: rootReducer,
//   preloadedState,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // ignore for the following so no issues internally in redux persist
//       },
//     }).concat(thunk),
//   devTools: process.env.NODE_ENV !== "production",
// });

export default store;
