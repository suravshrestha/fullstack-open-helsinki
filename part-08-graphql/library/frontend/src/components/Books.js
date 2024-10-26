import { useState } from "react";
import { useQuery } from "@apollo/client";
import { BOOKS_BY_GENRE } from "../queries";

const Books = ({ show }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const { data, loading } = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: selectedGenre },
  });

  if (!show) {
    return null;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  // Get all unique genres from the books
  const genres = Array.from(
    new Set(data.allBooks.flatMap((book) => book.genres)),
  );

  const books = data.allBooks;

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map((book, i) => (
            <tr key={i}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => setSelectedGenre(null)}>All Genres</button>
        {genres.map((genre, i) => (
          <button key={i} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
