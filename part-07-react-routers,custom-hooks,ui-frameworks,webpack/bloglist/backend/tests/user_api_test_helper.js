const User = require("../models/user");

const initialUsers = [
  {
    name: "John Doe",
    username: "johndoe",
    password: "ilovejohndoe",
  },
  {
    name: "Jane Doe",
    username: "janedoe",
    password: "ilovejanedoe",
  },
  {
    name: "Janet Doe",
    username: "janetdoe",
    password: "ilovejanetdoe",
  },
  {
    name: "Johnny Doe",
    username: "johnnydoe",
    password: "ilovejohnnydoe",
  },
];

const nonExistingId = async () => {
  const user = new User({
    name: "John Doe",
    username: "willremovethissoon",
    password: "idontknow",
  });
  await user.save();
  await user.remove();

  return user._id.toString();
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialUsers,
  nonExistingId,
  usersInDb,
};
