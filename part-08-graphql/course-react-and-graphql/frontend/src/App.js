import { ALL_PERSONS } from "./queries";

import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import PhoneForm from "./components/PhoneForm";
import LoginForm from "./components/LoginForm";

import { useQuery, useApolloClient } from "@apollo/client";
import { useState } from "react";

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }

  return <div style={{ color: "red" }}>{errorMessage}</div>;
};

const App = () => {
  const [token, setToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const result = useQuery(ALL_PERSONS);
  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    localStorage.clear();

    // Clear the cache of the Apollo Client
    // IMPORTANT: some queries might have fetched data to cache,
    // which only logged-in users should have access to.
    client.resetStore();
  };

  const notify = (message) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  if (!token) {
    return (
      <>
        <Notify errorMessage={errorMessage} />
        <LoginForm setToken={setToken} setError={notify} />
      </>
    );
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <button onClick={logout}>logout</button>
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify} />
      <PhoneForm setError={notify} />
    </div>
  );
};

export default App;
