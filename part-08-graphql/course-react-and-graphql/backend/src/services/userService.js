const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const createUser = async (userData) => {
  try {
    const user = new User(userData);

    // Validation: Ensure required fields are present
    if (!user.username) {
      throw new GraphQLError("Username is required.", {
        extensions: { code: "VALIDATION_ERROR" },
      });
    }

    return await user.save();
  } catch (error) {
    throw new GraphQLError("Failed to create user.", {
      extensions: { code: "DATABASE_ERROR", details: error.message },
    });
  }
};

const authenticateUser = async (username, password) => {
  try {
    const user = await User.findOne({ username });

    // hard-coded password for simplicity
    if (!user || password !== "secret") {
      throw new GraphQLError("Invalid username or password.", {
        extensions: { code: "UNAUTHORIZED" },
      });
    }

    return user;
  } catch (error) {
    throw new GraphQLError("Authentication failed.", {
      extensions: { code: "DATABASE_ERROR", details: error.message },
    });
  }
};

const generateToken = (userForToken) => {
  return jwt.sign(userForToken, process.env.JWT_SECRET);
};

const findUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new GraphQLError("User not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return user;
  } catch (error) {
    throw new GraphQLError("Failed to retrieve user by username.", {
      extensions: { code: "DATABASE_ERROR", details: error.message },
    });
  }
};

const findFriends = async (personId) => {
  try {
    const friends = await User.find({
      friends: {
        $in: [personId],
      },
    });

    return friends;
  } catch (error) {
    throw new GraphQLError("Failed to fetch friends.", {
      extensions: {
        code: "DATABASE_ERROR",
        details: error.message,
      },
    });
  }
};

module.exports = {
  createUser,
  authenticateUser,
  generateToken,
  findUserByUsername,
  findFriends,
};
