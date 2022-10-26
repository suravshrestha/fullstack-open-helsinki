const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./user_api_test_helper");
const app = require("../app");

// superagent object
const api = supertest(app);

const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});

  const userObjects = helper.initialUsers.map((user) => new User(user));

  const promiseArray = userObjects.map((user) => user.save());
  await Promise.all(promiseArray);
});

describe("when there is initially some users saved", () => {
  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all users are returned", async () => {
    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toHaveLength(helper.initialUsers.length);
  });
});

describe("addition of a new user", () => {
  test("fails with status code 400 when username or password is missing", async () => {
    const userWithoutUsername = {
      name: "Robert C. Martin",
      password: "ilovecleancode",
    };

    const userWithoutPassword = {
      name: "Robert C. Martin",
      username: "unclebob",
    };

    await api.post("/api/users").send(userWithoutUsername).expect(400);
    await api.post("/api/users").send(userWithoutPassword).expect(400);
  });

  test("fails with status code 400 when username is already taken", async () => {
    const user = {
      name: helper.initialUsers[0].name,
      username: helper.initialUsers[0].username,
      password: "ilovevalidations",
    };

    const response = await api.post("/api/users").send(user).expect(400);

    expect(response.body.error).toBe("username must be unique");
  });

  test("fails with status code 400 when username is less than 3 characters", async () => {
    const user = {
      name: "Eleven",
      username: "el",
      password: "ilovestrangerthings",
    };

    await api.post("/api/users").send(user).expect(400);
  });

  test("fails with status code 400 when password is less than 3 characters", async () => {
    const user = {
      name: "Eleven",
      username: "eleven",
      password: "el",
    };

    const response = await api.post("/api/users").send(user).expect(400);

    expect(response.body.error).toBe(
      "3 characters or more required for password"
    );
  });
});

afterAll(() => {
  mongoose.connection.close();
});
