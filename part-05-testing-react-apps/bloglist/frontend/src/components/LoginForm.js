import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";

import Notification from "../components/Notification";

import loginService from "../services/login";
import blogService from "../services/blogs";

const LoginForm = ({ setUser, setMessage, message }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);

      setUser(user);
      setUsername("");
      setPassword("");
      setMessage(null);
    } catch (err) {
      setMessage({ text: "wrong username or password", error: true });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div>
      <h2>Log in to the application</h2>

      <Notification message={message} />

      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username-input"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password-input"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-btn" type="submit">login</button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  setUser: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,

  message: PropTypes.object,
};

export default LoginForm;
