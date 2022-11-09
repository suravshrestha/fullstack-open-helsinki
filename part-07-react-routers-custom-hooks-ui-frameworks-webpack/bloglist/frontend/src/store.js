import { configureStore } from "@reduxjs/toolkit";

import blogsReducer from "./reducers/blogsReducer";
import notificationReducer from "./reducers/notificationReducer";
import loggedUserReducer from "./reducers/loggedUserReducer";
import usersReducer from "./reducers/usersReducer";

// Configure the Redux store holding the state of the app.
const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    notification: notificationReducer,
    loggedUser: loggedUserReducer,
    users: usersReducer,
  },
});

export default store;
