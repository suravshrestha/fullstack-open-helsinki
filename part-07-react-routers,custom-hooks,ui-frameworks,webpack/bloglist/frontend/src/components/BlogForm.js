import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

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
    <div className="mb-3">
      <h2>Create a new blog</h2>

      <Form onSubmit={addBlog}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="title">Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            id="blog-title-input"
            value={title}
            onChange={handleTitleChange}
            name="title"
            required
          />
          <Form.Text className="text-muted">
            Title must be 8 characters or more.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="author">Author</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter author"
            id="blog-author-input"
            value={author}
            onChange={handleAuthorChange}
            name="author"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="url">URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter URL"
            id="blog-url-input"
            value={url}
            onChange={handleUrlChange}
            name="url"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
