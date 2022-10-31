import { configureStore } from "@reduxjs/toolkit";

import noteReducer from "./reducers/noteReducer";
import filterReducer from "./reducers/filterReducer";

// Configure the Redux store holding the state of the app.
const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer,
  },
});

export default store;
