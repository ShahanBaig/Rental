import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode> {/* dev mode */}
    <Provider store={store}> {/* provides store */}
      <PersistGate loading={null} persistor={persistStore(store)}> {/* loads persisted state */}
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);