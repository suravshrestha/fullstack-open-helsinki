import { createSlice } from "@reduxjs/toolkit";

import userService from "../services/user";
import { setNotification } from "./notificationReducer";

// returns an object containing the reducer as well as
// the action creators defined by the reducers parameter.
const userSlice = createSlice({
  name: "users", // prefix which is used in the action's type values
  initialState: [],
  reducers: {
    appendUser(state, action) {
      state.push(action.payload);
    },

    setUsers(state, action) {
      return action.payload;
    },
  },
});

// Export the action creators
export const { appendUser, setUsers } = userSlice.actions;

export const initializeUsers = () => {
  // asynchronous action
  return async (dispatch) => {
    try {
      const users = await userService.getAll();

      dispatch(setUsers(users));
    } catch (err) {
      dispatch(
        setNotification({ msg: "Failed to connect to the server", error: true })
      );
    }
  };
};

// Export the reducer
export default userSlice.reducer;
