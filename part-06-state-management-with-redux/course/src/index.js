import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { createStore } from "redux";
import { Provider } from "react-redux";
import noteReducer from "./reducers/noteReducer";

// Create a Redux store holding the state of the app.
// Its API is { subscribe, dispatch, getState }.
const store = createStore(noteReducer);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
