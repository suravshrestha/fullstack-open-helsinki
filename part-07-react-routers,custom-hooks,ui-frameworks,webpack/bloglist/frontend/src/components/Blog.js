import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMatch, useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";

import { like, remove, comment } from "../reducers/blogsReducer";
import { initializeBlogs } from "../reducers/blogsReducer";

const Blog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  const blogs = useSelector((state) => state.blogs);
  const loggedUser = useSelector((state) => state.loggedUser);

  const match = useMatch("/blogs/:id");
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  if (!blog) {
    return <h2>Blog not found</h2>;
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}`)) {
      dispatch(remove(blog.id));

      if (!loggedUser) {
        // Token expired
        navigate("/login");
      } else {
        // Navigate back to the blog list
        navigate("/");
      }
    }
  };

  const handleLike = () => {
    dispatch(like(blog.id));
  };

  const handleComment = (e) => {
    e.preventDefault();
    dispatch(comment(blog.id, e.target.comment.value));
    e.target.comment.value = "";
  };

  const comments = blog.comments;

  return (
    <div className="blog">
      <Card bg="dark" style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>{blog.title}</Card.Title>

          <Card.Subtitle className="mb-2 text-muted">
            {blog.author}
          </Card.Subtitle>

          <Card.Text>
            URL: <a href={"//" + blog.url}>{blog.url}</a>
          </Card.Text>

          <Card.Text>
            <Button size="sm" variant="primary" onClick={handleLike}>
              Like |{" "}
              <Badge pill bg="secondary">
                {blog.likes}
              </Badge>
            </Button>
            &nbsp;
            {loggedUser && loggedUser.username == blog.user.username && (
              <Button variant="danger" size="sm" onClick={handleRemove}>
                Remove
              </Button>
            )}
          </Card.Text>

          <Card.Text>Added by user {blog.user.name}</Card.Text>
        </Card.Body>
      </Card>

      <h3 className="mt-5">Comments</h3>

      {comments.length === 0 ? (
        <div>No comments yet, be the first to add one!</div>
      ) : (
        <Stack gap={2} className="mx-auto">
          {comments.map((comment) => (
            <ListGroup.Item
              key={comment.id}
              className="p-2 rounded bg-secondary"
            >
              {comment}
            </ListGroup.Item>
          ))}
        </Stack>
      )}

      <h3 className="mt-4">Add a comment</h3>

      <Form onSubmit={handleComment}>
        <Form.Group>
          <Form.Control
            type="text"
            name="comment"
            placeholder="Enter comment"
            className=""
          />
          <Button variant="primary" className="my-3" type="submit">
            Add comment
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default Blog;
