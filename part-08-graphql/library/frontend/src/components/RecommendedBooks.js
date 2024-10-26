import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ME } from "../queries";

const RecommendedBooks = ({ show }) => {
  const { data: meData, loading: meLoading, error: meError } = useQuery(ME);
  const {
    data: booksData,
    loading: booksLoading,
    error: booksError,
  } = useQuery(ALL_BOOKS);

  if (!show) {
    return null;
  }

  if (meLoading || booksLoading) {
    return <div>loading...</div>;
  }

  if (meError || booksError) {
    return <div>Error loading data</div>;
  }

  if (!meData || !booksData) {
    return <div>No data available</div>;
  }

  const favoriteGenre = meData.me.favoriteGenre;
  const filteredBooks = booksData.allBooks.filter((book) =>
    book.genres.includes(favoriteGenre),
  );

  return (
    <div>
      <h2>Recommended Books</h2>
      <p>
        Books in your favorite genre: <strong>{favoriteGenre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {filteredBooks.map((book, i) => (
            <tr key={i}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecommendedBooks;
