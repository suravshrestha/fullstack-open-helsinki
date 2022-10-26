const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const loginRouter = require("express").Router();

const User = require("../models/user");

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  console.log(username, password);

  const user = await User.findOne({ username });
  const passwordCorrect = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  // token expires in one hour
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: "1h", // 60 * 60 seconds
  });

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
