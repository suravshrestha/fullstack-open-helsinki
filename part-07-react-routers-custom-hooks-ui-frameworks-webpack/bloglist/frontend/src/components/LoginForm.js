import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import loginService from "../services/login";
import userService from "../services/user";

import { setUser } from "../reducers/loggedUserReducer";
import { setNotification } from "../reducers/notificationReducer";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      userService.setUser(user);

      dispatch(setUser(user));

      dispatch(
        setNotification({ msg: `User ${user.name} logged in`, error: false })
      );

      navigate("/");
    } catch (err) {
      if (err.response && err.response.data.error) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx (and the server sends error message)
        return dispatch(
          setNotification({ msg: err.response.data.error, error: true })
        );
      }

      dispatch(
        setNotification({ msg: "Failed to connect to the server", error: true })
      );
    }
  };

  return (
    <div>
      <h2>Log in to the application</h2>

      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            id="username-input"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            id="password-input"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>
        <Button variant="primary" id="login-btn" type="submit">
          Log in
        </Button>
      </Form>
    </div>
  );
};

export default LoginForm;
