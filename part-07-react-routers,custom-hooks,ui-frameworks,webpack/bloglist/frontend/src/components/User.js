import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMatch } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";

import { initializeUsers } from "../reducers/usersReducer";

const User = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeUsers());
  }, []);

  const users = useSelector((state) => state.users);

  const match = useMatch("/users/:id");
  const user = match ? users.find((user) => user.id === match.params.id) : null;

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      {user.blogs.length === 0 ? (
        <div>
          <h2>{user.name}</h2>
          No blogs added
        </div>
      ) : (
        <div>
          <h2>Blogs added by {user.name}</h2>

          <hr />

          <Stack gap={2} className="mx-auto">
            {user.blogs.map((blog) => (
              <ListGroup.Item
                key={blog.id}
                action
                className="p-2 rounded bg-secondary"
              >
                {blog.title} by {blog.author}
              </ListGroup.Item>
            ))}
          </Stack>
        </div>
      )}
    </div>
  );
};

export default User;
