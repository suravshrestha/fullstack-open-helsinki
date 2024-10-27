const { GraphQLError } = require("graphql");

const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const Book = require("./models/bookModel");
const Author = require("./models/authorModel");

const jwt = require("jsonwebtoken");

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

        // Publish a notification about the operation to all subscribers
        // Sends a WebSocket message about the added book to all the clients
        // registered in the iterator BOOK_ADDED.
        pubsub.publish("BOOK_ADDED", { bookAdded: book });

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

  // The resolver of the `bookAdded` subscription registers and
  // saves info about all the clients that do the subscription.
  // The clients are saved to an "iterator object" called BOOK_ADDED
  //
  // The iterator name is an arbitrary string, but to follow the convention,
  // it is the subscription name written in capital letters.
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
