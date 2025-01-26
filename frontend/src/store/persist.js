import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import { userReducer, adminUserReducer } from "../reducers/userReducer";
import { productReducer } from "../reducers/productReducer";
import { rentalReducer, adminRentalReducer } from "../reducers/rentalReducer";
import storage from "redux-persist/lib/storage";

const reducersToPersist = combineReducers({
  user: userReducer,
  adminUser: adminUserReducer,
});

const nonPersistedReducers = combineReducers({
    product: productReducer,
    rental: rentalReducer,
    adminRental: adminRentalReducer,
});

const persistConfig = { key: "root", storage, version: 1 };
const persistedReducers = persistReducer(persistConfig, reducersToPersist);

const rootReducer = combineReducers({
    persisted: persistedReducers,
    nonPersisted: nonPersistedReducers
});

export default rootReducer