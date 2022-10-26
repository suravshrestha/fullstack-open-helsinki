const config = require("./utils/config");

const express = require("express");
require("express-async-errors");

const app = express();

const cors = require("cors");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

const mongoose = require("mongoose");

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());

// Custom middleware similar to morgan
app.use(middleware.requestLogger);

// Register the routers
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

// handler of requests with unknown endpoint
app.use(middleware.unknownEndpoint);

// handler of requests with result to errors
// this has to be the last loaded middleware
app.use(middleware.errorHandler);

module.exports = app;
