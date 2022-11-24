const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors");

const Note = require("./models/note");

app.use(express.static("build"));
app.use(express.json());

app.use(morgan("tiny"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Hello, world!</h1>");
});

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        return res.json(note);
      }

      res.status(404).end();
    })
    .catch((err) => {
      // If the next function is called with a parameter, then the
      // execution will continue to the error handler middleware.
      next(err);
    });
});

app.post("/api/notes", (req, res, next) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note
    .save()
    .then((savedNote) => {
      res.json(savedNote);
    })
    .catch((err) => next(err));
});

app.put("/api/notes/:id", (req, res, next) => {
  Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,

    // By default, validations are not run when findByIdAndUpdate is executed
    runValidators: true,
  })
    .then((updatedNote) => {
      // The optional parameter { new : true } gets the updated note
      res.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

// handler of requests with result to errors
// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
