import { gql } from "@apollo/client";

/* It is pretty common in GraphQL that multiple queries return similar results.
For example, the query for the details of a book
query {
  booksByGenre(genre: "Refactoring") {
    title
    published
    author {
      name
    }
    genres
  }
}

and the query for all books
query {
  allBooks {
    title
    published
    author {
      name
    }
    genres
  }
}
both return books
.
When choosing the fields to return, both queries have to define exactly the same fields.
These kinds of situations can be simplified with the use of `fragments`. */

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    author {
      name
    }
    genres
  }
`;

// The fragment can be placed to any query or mutation using a dollar sign and curly braces:
// With the fragment, we can do the queries in a compact form:
export const ALL_BOOKS = gql`
  query {
    allBooks {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`;

export const BOOKS_BY_GENRE = gql`
  query booksByGenre($genre: String) {
    allBooks(genre: $genre) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`;

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`;

export const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author
      published
      genres
    }
  }
`;

export const EDIT_BIRTHYEAR = gql`
  mutation editBirthyear($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;
