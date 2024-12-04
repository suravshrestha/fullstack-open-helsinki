import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/userModel";

// Create a new user
const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  try {
    const user = new User(userData);

    // Validation: Ensure required fields are present
    if (!user.username) {
      throw new GraphQLError("Username is required.", {
        extensions: { code: "VALIDATION_ERROR" },
      });
    }

    return await user.save();
  } catch (error: any) {
    throw new GraphQLError("Failed to create user.", {
      extensions: { code: "DATABASE_ERROR", details: error.message },
    });
  }
};

// Authenticate user by username and password
const authenticateUser = async (
  username: string,
  password: string
): Promise<IUser> => {
  try {
    const user = await User.findOne({ username });

    // Hard-coded password for simplicity
    if (!user || password !== "secret") {
      throw new GraphQLError("Invalid username or password.", {
        extensions: { code: "UNAUTHORIZED" },
      });
    }

    return user;
  } catch (error: any) {
    throw new GraphQLError("Authentication failed.", {
      extensions: { code: "DATABASE_ERROR", details: error.message },
    });
  }
};

// Generate a JWT token for the user
const generateToken = (userForToken: object): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  return jwt.sign(userForToken, secret);
};

// Find a user by their username
const findUserByUsername = async (username: string): Promise<IUser> => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new GraphQLError("User not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    return user;
  } catch (error: any) {
    throw new GraphQLError("Failed to retrieve user by username.", {
      extensions: { code: "DATABASE_ERROR", details: error.message },
    });
  }
};

// Find friends of a person by personId
const findFriends = async (personId: string): Promise<IUser[]> => {
  try {
    const friends = await User.find({
      friends: {
        $in: [personId],
      },
    });

    return friends;
  } catch (error: any) {
    throw new GraphQLError("Failed to fetch friends.", {
      extensions: {
        code: "DATABASE_ERROR",
        details: error.message,
      },
    });
  }
};

export default {
  createUser,
  authenticateUser,
  generateToken,
  findUserByUsername,
  findFriends,
};
