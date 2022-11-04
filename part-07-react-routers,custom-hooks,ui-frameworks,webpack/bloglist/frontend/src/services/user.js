import axios from "axios";

let token = null;

const STORAGE_KEY = "loggedBlogappUser";

const setUser = (user) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  token = user.token;
};

const getUser = () => {
  const loggedUserJSON = localStorage.getItem(STORAGE_KEY);

  if (!loggedUserJSON) {
    return null;
  }

  const user = JSON.parse(loggedUserJSON);
  token = user.token;
  return user;
};

const clearUser = () => {
  // localStorage.clear();
  localStorage.removeItem(STORAGE_KEY);
  token = null;
};

const getToken = () => token;

const getAll = async () => {
  const response = await axios.get("/api/users");
  return response.data;
};

export default {
  setUser,
  clearUser,
  getUser,
  getAll,
  getToken,
};
