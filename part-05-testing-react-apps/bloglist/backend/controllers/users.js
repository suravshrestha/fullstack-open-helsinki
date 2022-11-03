const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  if (!password) {
    return res.status(400).json({
      error: "password is required",
    });
  }

  if (password.length < 3) {
    return res.status(400).json({
      error: "3 characters or more required for password",
    });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({
      error: "username must be unique",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

usersRouter.get("/", async (req, res) => {
  // populate: Mongoose's join query
  const users = await User.find({}).populate("blogs", {
    // Populate and send "blogs" object with "url", "title", and "author" (including blog "id")
    url: 1,
    title: 1,
    author: 1,
  });

  res.json(users);
});

module.exports = usersRouter;
