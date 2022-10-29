import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <div>
        <h2>create new</h2>

        <form onSubmit={addBlog}>
          <div>
            <label htmlFor="title">title: </label>
            <input
              id="blog-title-input"
              value={title}
              onChange={handleTitleChange}
              name="title"
              required
            />
          </div>

          <div>
            <label htmlFor="author">author: </label>
            <input
              id="blog-author-input"
              value={author}
              onChange={handleAuthorChange}
              name="author"
              required
            />
          </div>

          <div>
            <label htmlFor="url">url: </label>
            <input
              id="blog-url-input"
              value={url}
              onChange={handleUrlChange}
              name="url"
              required
            />
          </div>
          <button type="submit">create</button>
        </form>
      </div>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
