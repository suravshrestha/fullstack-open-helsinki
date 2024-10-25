const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");

const Book = require("./models/bookModel");
const Author = require("./models/authorModel");
const User = require("./models/userModel");

const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
 */

/*
  you can remove the placeholder query once your first own has been implemented 
*/

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),

    authorCount: async () => Author.countDocuments(),

    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({}).populate("author");
      }

      let filter = {};
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) {
          filter.author = author._id;
        }
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] };
      }

      return Book.find(filter).populate("author");
    },

    allAuthors: async () => {
      return Author.find({});
    },

    me: (root, args, context) => {
      // `currentUser` is passed through the context
      return context.currentUser;
    },
  },

  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({ author: root._id });
    },
  },

  Mutation: {
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError(error.message, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      });
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      // hard-coded password for simplicity
      if (!user || args.password !== "secret") {
        throw new GraphQLError("Invalid username or password", {
          extensions: {
            code: "UNAUTHENTICATED",
            invalidArgs: args,
            errorMessage: "Invalid username or password",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },

    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
            invalidArgs: args,
            errorMessage: "You must be logged in to add a book",
          },
        });
      }

      try {
        let author = await Author.findOne({ name: args.author });
        if (!author) {
          author = new Author({ name: args.author });
          await author.save();
        }

        const book = new Book({
          title: args.title,
          published: args.published,
          author: author._id,
          genres: args.genres,
        });

        await book.save();
        return book.populate("author");
      } catch (error) {
        throw new GraphQLError("Error adding book", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            errorMessage: error.message,
          },
        });
      }
    },

    editAuthor: async (root, args) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
            invalidArgs: args,
            errorMessage: "You must be logged in to add a book",
          },
        });
      }

      const author = await Author.findOne({ name: args.name });
      if (!author) {
        throw new GraphQLError("Author not found", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
          },
        });
      }

      author.born = args.setBornTo;
      try {
        await author.save();
        return author;
      } catch (error) {
        throw new GraphQLError("Error updating author", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
          },
        });
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },

  // The object returned by context is given to all resolvers as their third parameter.
  // Context is the right place to do things which are shared by multiple resolvers,
  // like user identification.
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;

    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET,
      );

      const currentUser = await User.findById(decodedToken.id);

      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
