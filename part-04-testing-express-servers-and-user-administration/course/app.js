const config = require("./utils/config");

const express = require("express");
const app = express();

const cors = require("cors");
const notesRouter = require("./controllers/notes");

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

app.use(express.static("build"));
app.use(express.json());

// Custom middleware similar to morgan
app.use(middleware.requestLogger);

app.get("/", (req, res) => {
  res.send("<h1>Hello, world!</h1>");
});

// Register the routers
app.use("/api/notes", notesRouter);

// handler of requests with result to errors
// this has to be the last loaded middleware
app.use(middleware.errorHandler);

module.exports = app;
