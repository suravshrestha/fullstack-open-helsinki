import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Routes, Route, useNavigate, NavLink } from "react-router-dom";

import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogList from "./components/BlogList";
import UserList from "./components/UserList";
import User from "./components/User";
import Blog from "./components/Blog";

import { setNotification } from "./reducers/notificationReducer";
import { setUser } from "./reducers/loggedUserReducer";
import { initializeUsers } from "./reducers/usersReducer";
import userService from "./services/user";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const userFromStorage = userService.getUser();
    dispatch(setUser(userFromStorage));
  }, []);

  useEffect(() => {
    dispatch(initializeUsers());
  }, []);

  const loggedUser = useSelector((state) => state.loggedUser);

  // eslint-disable-next-line no-unused-vars
  const handleLogout = () => {
    userService.clearUser();

    dispatch(
      setNotification({
        msg: `User ${loggedUser.name} logged out`,
        error: false,
      })
    );

    dispatch(setUser(null));

    navigate("/");
  };

  return (
    <div>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        className="mb-5 nav"
        sticky="top"
      >
        <Container fluid className="px-5">
          <Navbar.Brand as={NavLink} to="/">
            Blogify
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/">
                Blogs
              </Nav.Link>

              <Nav.Link as={NavLink} to="/users">
                Users
              </Nav.Link>
            </Nav>

            {loggedUser ? (
              <Nav>
                <Navbar.Text>{loggedUser.name}</Navbar.Text>
                <Nav.Link as={NavLink} onClick={handleLogout}>
                  Log out
                </Nav.Link>
              </Nav>
            ) : (
              <Nav>
                <Nav.Link id="nav-login" as={NavLink} to="/login">
                  Log in
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="mx-5 mt-10 mb-15">
        <Notification />

        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/" element={<BlogList />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
