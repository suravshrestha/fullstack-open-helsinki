const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticate = async (authHeader, secret) => {
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const decodedToken = jwt.verify(token, secret);

    return await User.findById(decodedToken.id).populate("friends");
  }

  return null;
};

module.exports = { authenticate };
