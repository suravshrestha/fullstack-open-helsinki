import { GraphQLError } from "graphql";

import { IUser } from "../../models/userModel";
import userService from "../../services/userService";

export const typeDef = `
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

export const resolvers = {
  Query: {
    me: (
      _: unknown,
      __: unknown,
      { currentUser }: { currentUser: IUser | null }
    ): IUser | null => {
      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }

      return currentUser;
    },
  },

  Mutation: {
    createUser: async (
      _: unknown,
      { username }: { username: string }
    ): Promise<IUser> => {
      try {
        return await userService.createUser({ username });
      } catch (error: any) {
        throw new GraphQLError("Failed to create user", {
          extensions: {
            code: "DATABASE_ERROR",
            details: error.message,
          },
        });
      }
    },

    login: async (
      _: unknown,
      { username, password }: { username: string; password: string }
    ): Promise<{ value: string }> => {
      try {
        const user = await userService.authenticateUser(username, password);
        if (!user) {
          throw new GraphQLError("Invalid username or password", {
            extensions: { code: "UNAUTHORIZED" },
          });
        }

        const userForToken = {
          username: user.username,
          id: user._id.toString(),
        };

        return { value: userService.generateToken(userForToken) };
      } catch (error: any) {
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
    friends: async (user: IUser): Promise<IUser[]> => {
      try {
        return await userService.findFriends(user._id as string);
      } catch (error: any) {
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
