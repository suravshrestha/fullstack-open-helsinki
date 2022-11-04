import { createSlice } from "@reduxjs/toolkit";

import blogService from "../services/blogs";
import userService from "../services/user";

import { setNotification } from "./notificationReducer";
import { setUser } from "./loggedUserReducer";

// returns an object containing the reducer as well as
// the action creators defined by the reducers parameter.
const blogSlice = createSlice({
  name: "blogs", // prefix which is used in the action's type values
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
    },

    setBlogs(state, action) {
      return action.payload;
    },
  },
});

// Export the action creators
export const { appendBlog, setBlogs } = blogSlice.actions;

export const initializeBlogs = () => {
  // asynchronous action
  return async (dispatch) => {
    try {
      const blogs = await blogService.getAll();

      dispatch(setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
    } catch (err) {
      dispatch(
        setNotification({ msg: "Failed to connect to the server", error: true })
      );
    }
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(blog);
      dispatch(appendBlog(newBlog));
      dispatch(
        setNotification({
          msg: `New blog '${newBlog.title}' by ${newBlog.author} added`,
          error: false,
        })
      );
    } catch (err) {
      if (err.response && err.response.data.error) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx (and server sent an error message)
        if (
          err.response.data.error === "invalid token" ||
          err.response.data.error === "token expired"
        ) {
          dispatch(
            setNotification({
              msg: "Token expired, please log in again",
              error: false,
            })
          );

          userService.clearUser();

          return dispatch(setUser(null));
        }

        return dispatch(
          setNotification({
            msg: err.response.data.error,
            error: true,
          })
        );
      }

      dispatch(setNotification({ msg: "Failed to add the blog", error: true }));
    }
  };
};

export const like = (id) => {
  return async (dispatch, getState) => {
    const { blogs } = getState();
    const blogToChange = blogs.find((b) => b.id === id);

    try {
      const updatedBlog = await blogService.update(id, {
        ...blogToChange,
        likes: blogToChange.likes + 1,
        user: blogToChange.user.id,
      });

      dispatch(setBlogs(blogs.map((b) => (b.id === id ? updatedBlog : b))));
    } catch (err) {
      dispatch(
        setNotification({ msg: "Failed to update the blog", error: true })
      );
    }
  };
};

export const comment = (id, comment) => {
  return async (dispatch, getState) => {
    const { blogs } = getState();

    try {
      const updatedBlog = await blogService.addComment(id, { comment });

      dispatch(setBlogs(blogs.map((b) => (b.id === id ? updatedBlog : b))));
    } catch (err) {
      if (err.response && err.response.data.error) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx (and server sent an error message)
        return dispatch(
          setNotification({
            msg: err.response.data.error,
            error: true,
          })
        );
      }

      dispatch(
        setNotification({ msg: "Failed to add the comment", error: true })
      );
    }
  };
};

export const remove = (id) => {
  return async (dispatch, getState) => {
    const { blogs } = getState();

    try {
      await blogService.remove(id);

      dispatch(setBlogs(blogs.filter((b) => b.id !== id)));

      dispatch(
        setNotification({ msg: "Successfully removed the blog", error: false })
      );
    } catch (err) {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (
          err.response.data.error === "invalid token" ||
          err.response.data.error === "token expired"
        ) {
          dispatch(
            setNotification({
              msg: "Invalid token, please log in again",
              error: false,
            })
          );

          userService.clearUser();

          return dispatch(setUser(null));
        }
      }

      dispatch(
        setNotification({ msg: "Failed to remove the blog", error: true })
      );
    }
  };
};

// Export the reducer
export default blogSlice.reducer;
