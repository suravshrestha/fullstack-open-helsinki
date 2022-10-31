import { configureStore } from "@reduxjs/toolkit";

import anecdoteService from "./services/anecdotes";

import anecdoteReducer, { setAnecdotes } from "./reducers/anecdoteReducer";
import notificationReducer from "./reducers/notificationReducer";
import filterReducer from "./reducers/filterReducer";

// Configure the Redux store holding the state of the app.
const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    notification: notificationReducer,
    filter: filterReducer,
  },
});

anecdoteService
  .getAll()
  .then((anecdotes) => store.dispatch(setAnecdotes(anecdotes)));

store.subscribe(() => console.log(store.getState()));

export default store;
