import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    showNotification(state, action) {
      return action.payload;
    },
  },
});

const { showNotification } = notificationSlice.actions;

export const setNotification = (notification, timeoutInSeconds) => {
  return async (dispatch) => {
    dispatch(showNotification(notification));

    setTimeout(() => {
      dispatch(showNotification(null));
    }, timeoutInSeconds * 1000);
  };
};

export default notificationSlice.reducer;
