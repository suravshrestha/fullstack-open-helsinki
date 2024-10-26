import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries";

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, { data, loading, error }] = useMutation(LOGIN);

  useEffect(() => {
    if (data && data.login) {
      const token = data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
      setPage("authors");
    }
  }, [data, setToken, setPage]);

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    try {
      await login({ variables: { username, password } });
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>

      {loading && <div>Logging in...</div>}

      {error && (
        <div style={{ color: "red" }}>Error logging in: {error.message}</div>
      )}
    </div>
  );
};

export default LoginForm;
