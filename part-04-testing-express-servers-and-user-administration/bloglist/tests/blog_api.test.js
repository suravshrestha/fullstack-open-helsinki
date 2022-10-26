const supertest = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const helper = require("./blog_api_test_helper");
const { initialUsers } = require("./user_api_test_helper");

const app = require("../app");

// superagent object
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

let token = "";

beforeEach(async () => {
  await User.deleteMany({});

  const userId = new mongoose.Types.ObjectId();

  const userForToken = {
    username: initialUsers[0].username,
    id: userId,
  };

  // token expires in one hour
  token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: "1h", // 60 * 60 seconds
  });

  const user = new User({ ...initialUsers[0], _id: userId });
  await user.save();

  const userObjects = initialUsers.slice(1).map((user) => new User(user));

  const userPromiseArray = userObjects.map((user) => user.save());
  await Promise.all(userPromiseArray);

  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: userId })
  );

  const blogPromiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(blogPromiseArray);
});

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("blogs contain a document property 'id'", async () => {
    const blogsAtEnd = await helper.blogsInDb();

    for (const blog of blogsAtEnd) {
      expect(blog).toHaveProperty("id");
    }
  });

  test("blogs have unique 'id'", async () => {
    const blogsAtEnd = await helper.blogsInDb();

    expect(helper.isIdUnique(blogsAtEnd)).toBe(true);
  });
});

describe("addition of a new blog", () => {
  test("fails with status code 400 when title or url is missing", async () => {
    const blogWithoutTitle = {
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    };

    const blogWithoutUrl = {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blogWithoutTitle)
      .expect(400);

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blogWithoutUrl)
      .expect(400);
  });

  test("when likes is missing from the request body, it defaults to 0", async () => {
    const newBlog = {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog);

    expect(response.body.likes).toBe(0);
  });

  test("fails with status code 401 when jwt is missing", async () => {
    const blog = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    };

    await api.post("/api/blogs").send(blog).expect(401);
  });
});

describe("updating a specific blog", () => {
  test("succeeds with status code 200 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ title: "Changed title", likes: blogToUpdate.likes + 1 })
      .expect(200);

    expect(updatedBlog.body.likes).toBe(blogToUpdate.likes + 1);
    expect(updatedBlog.body.title).toBe("Changed title");
  });

  test("fails with status code 404 if blog does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api
      .put(`/api/blogs/${validNonexistingId}`)
      .send({ title: "Changed title", likes: 1001 })
      .expect(404);
  });

  test("fails with status code 400 if id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";

    await api
      .put(`/api/blogs/${invalidId}`)
      .send({ title: "Changed title", likes: 1001 })
      .expect(400);
  });

  test("fails with status code 400 if title is less than 8 characters", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ title: "Changed", likes: blogToUpdate.likes + 1 })
      .expect(400);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const ids = blogsAtEnd.map((b) => b.id);

    expect(ids).not.toContain(blogToDelete.id);
  });

  test("fails with status code 404 if blog does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });

  test("fails with status code 400 if id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
