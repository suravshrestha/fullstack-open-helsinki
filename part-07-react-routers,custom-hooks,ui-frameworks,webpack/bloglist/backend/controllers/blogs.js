const jwt = require("jsonwebtoken");

const blogsRouter = require("express").Router();

const { tokenExtractor, userExtractor } = require("../utils/middleware");

const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
  // populate: Mongoose's join query
  const blogs = await Blog.find({}).populate("user", {
    // Populate and send "user" object with "username" and "name" (including user "id")
    username: 1,
    name: 1,
  });

  res.json(blogs);
});

blogsRouter.post("/", tokenExtractor, userExtractor, async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }

  const user = req.user;

  const blog = new Blog({
    ...req.body,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

blogsRouter.post("/:id/comments", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("user", {
    // Populate and send "user" object with "username" and "name" (including user "id")
    username: 1,
    name: 1,
  });

  if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }

  const comment = req.body.comment;

  if (!comment) {
    return res.status(400).json({ error: "Comment is missing" });
  }

  blog.comments.push(req.body.comment);
  await blog.save();

  res.status(200).json(blog);
});

blogsRouter.put("/:id", async (req, res) => {
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    context: "query",
  }).populate("user", {
    // Populate and send "user" object with "username" and "name" (including user "id")
    username: 1,
    name: 1,
  });

  if (updatedBlog) {
    return res.json(updatedBlog);
  }

  res.status(404).json({ error: "blog not found" });
});

blogsRouter.delete("/:id", tokenExtractor, userExtractor, async (req, res) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ error: "blog not found" });
  }

  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }

  const user = req.user;

  if (blog.user.toString() !== user._id.toString()) {
    return res.status(401).json({ error: "user not authorized" });
  }

  blog = await Blog.findOneAndDelete({ _id: req.params.id });

  if (blog) {
    return res.status(204).end();
  }
});

module.exports = blogsRouter;
