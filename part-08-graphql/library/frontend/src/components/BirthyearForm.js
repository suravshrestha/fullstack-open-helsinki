import { EDIT_BIRTHYEAR, ALL_AUTHORS } from "../queries";

import { useMutation } from "@apollo/client";
import React, { useState } from "react";

const BirthyearForm = ({ authors }) => {
  const [author, setAuthor] = useState(authors[0]);
  const [born, setBorn] = useState("");

  const [changeBirthyear] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const submit = (e) => {
    e.preventDefault();

    changeBirthyear({ variables: { name: author, setBornTo: Number(born) } });

    setAuthor(authors[0]);
    setBorn("");
  };

  return (
    <div>
      <h3>Set birthyear</h3>

      <form onSubmit={submit}>
        <select
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        >
          {authors.map((author) => (
            <option key={author.id} value={author.name}>
              {author.name}
            </option>
          ))}
        </select>

        <div>
          born{" "}
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>

        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default BirthyearForm;
