const { GraphQLError } = require("graphql");

const userService = require("../../services/userService");

const typeDef = `
  extend type Query {
    me: User
  }

  extend type Mutation {
    createUser(username: String!): User
    login(username: String!, password: String!): Token
  }

  type User {
    username: String!
    friends: [Person!]!
    id: ID!
  }

  type Token {
    value: String!
  }
`;

const resolvers = {
  Query: {
    me: (_, __, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }

      return currentUser;
    },
  },

  Mutation: {
    createUser: async (_, { username }) => {
      try {
        return await userService.createUser({ username });
      } catch (error) {
        throw new GraphQLError("Failed to create user", {
          extensions: {
            code: "DATABASE_ERROR",
            details: error.message,
          },
        });
      }
    },

    login: async (_, { username, password }) => {
      try {
        const user = await userService.authenticateUser(username, password);
        if (!user) {
          throw new GraphQLError("Invalid username or password", {
            extensions: { code: "UNAUTHORIZED" },
          });
        }

        const userForToken = {
          username: user.username,
          id: user._id,
        };

        return { value: userService.generateToken(userForToken) };
      } catch (error) {
        throw new GraphQLError("Login failed", {
          extensions: {
            code: "DATABASE_ERROR",
            details: error.message,
          },
        });
      }
    },
  },

  User: {
    friends: async (user) => {
      try {
        return await userService.findFriends(user._id);
      } catch (error) {
        throw new GraphQLError("Failed to fetch friends", {
          extensions: {
            code: "DATABASE_ERROR",
            details: error.message,
          },
        });
      }
    },
  },
};

module.exports = { typeDef, resolvers };
