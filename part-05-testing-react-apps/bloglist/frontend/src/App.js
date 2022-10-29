import { useState, useEffect, useRef } from "react";

import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";

import Togglable from "./components/Togglable";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";

import blogService from "./services/blogs";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getAll();

        setBlogs(data.sort((a, b) => b.likes - a.likes));
        setMessage(null);
      } catch (err) {
        setMessage({ text: "Failed to connect to the server", error: true });
      }
    };

    if (user) {
      fetchBlogs();
    }
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = (blogObject) => {
    // Hide the blog form after a new blog has been created
    blogFormRef.current.toggleVisibility();

    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes));

        setMessage({
          text: `a new blog '${returnedBlog.title}' by ${returnedBlog.author} added`,
          error: false,
        });
      })
      .catch((err) => {
        if (err.response.data.error === "token expired") {
          setMessage({ text: "Token expired, try logging in", error: false });

          logOutUser();
          return;
        }

        setMessage({
          text: err.response.data.error,
          error: true,
        });
      });

    setTimeout(() => setMessage(null), 5000);
  };

  const updateBlog = async (id, newObject) => {
    try {
      const updatedBlog = await blogService.update(id, newObject);
      setBlogs(
        blogs
          .map((blog) => (blog.id === id ? updatedBlog : blog))
          .sort((a, b) => b.likes - a.likes)
      );
    } catch (err) {
      setMessage({ text: "Failed to connect to the server", error: true });
    }

    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const removeBlog = async (id) => {
    try {
      const removedBlog = await blogService.remove(id);

      setBlogs(blogs.map((blog) => (blog.id === id ? removedBlog : blog)));

      setMessage({ text: "Successfully removed the blog", error: false });
    } catch (err) {
      setMessage({ text: "Failed to remove the blog", error: true });
    }

    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  const logOutUser = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    blogService.setToken("");

    setUser(null);

    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>blogs</h2>

          <Notification message={message} />

          <p>{user.name ? user.name : "Unknown user"} logged in</p>
          <button
            onClick={() => {
              logOutUser();

              setMessage({
                text: `User ${user.name} successfully logged out`,
                error: false,
              });
            }}
          >
            logout
          </button>

          {blogForm()}

          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              removeBlog={removeBlog}
              user={user}
            />
          ))}
        </div>
      ) : (
        <LoginForm
          setUser={setUser}
          setMessage={setMessage}
          message={message}
        />
      )}
    </div>
  );
};

export default App;
