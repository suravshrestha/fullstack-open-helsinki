import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from "../queries";

import { useMutation } from "@apollo/client";
import { useState } from "react";

const NewBook = ({ show }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK, {
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(response.data.addBook),
        };
      });

      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        const authorExists = allAuthors.find(
          (a) => a.name === response.data.addBook.author.name,
        );
        if (!authorExists) {
          return {
            allAuthors: allAuthors.concat(response.data.addBook.author),
          };
        } else {
          return { allAuthors };
        }
      });
    },
    onError: (error) => {
      window.alert(error.message);
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    addBook({
      variables: { title, author, published: parseInt(published), genres },
    });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  if (!show) {
    return null;
  }

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title{" "}
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author{" "}
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published{" "}
          <input
            type="number"
            value={published || ""}
            onChange={({ target }) => setPublished(parseInt(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />{" "}
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
