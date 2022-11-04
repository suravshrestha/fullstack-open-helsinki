import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";

import { initializeUsers } from "../reducers/usersReducer";

const UserList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeUsers());
  }, []);

  const users = useSelector((state) => state.users);

  return (
    <div>
      <h2>Users</h2>

      <hr />

      {users.length === 0 ? (
        <strong>
          No users yet, be the first to create an account using our API!
        </strong>
      ) : (
        <Table
          striped
          bordered
          rounded
          hover
          className="text-center mt-3 rounded"
          size="sm"
          variant="dark"
        >
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Blogs created</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2">
                  <Link to={user.id}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserList;
