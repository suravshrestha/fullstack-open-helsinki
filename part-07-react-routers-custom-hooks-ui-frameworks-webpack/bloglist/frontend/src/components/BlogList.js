import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";

import { initializeBlogs, createBlog } from "../reducers/blogsReducer";

import BlogForm from "./BlogForm";
import Togglable from "./Togglable";

const BlogList = () => {
  const dispatch = useDispatch();

  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  const blogs = useSelector((state) => state.blogs);
  const loggedUser = useSelector((state) => state.loggedUser);

  const addBlog = (blogObject) => {
    // Hide the blog form after a new blog has been created
    blogFormRef.current.toggleVisibility();

    dispatch(createBlog(blogObject));
  };

  return (
    <div>
      <div className="my-4">
        <h2>Blogs</h2>

        <hr />

        {blogs.length == 0 && (
          <strong>No blogs yet, be the first to create one!</strong>
        )}

        <Stack gap={2} className="mx-auto">
          {blogs.map((blog) => (
            <ListGroup.Item
              variant="dark"
              key={blog.id}
              className="p-2 rounded blog-list-item"
              action
            >
              <Link to={`/blogs/${blog.id}`}>
                {blog.title} by {blog.author}
              </Link>
            </ListGroup.Item>
          ))}
        </Stack>
      </div>

      {loggedUser && (
        <Togglable buttonLabel="Create blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
      )}
    </div>
  );
};

export default BlogList;
