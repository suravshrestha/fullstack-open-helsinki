const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

notesRouter.get("/:id", (req, res, next) => {
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

notesRouter.post("", (req, res, next) => {
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

notesRouter.put("/:id", (req, res, next) => {
  Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,

    // By default, validations are not run when findByIdAndUpdate is executed
    runValidators: true,

    // For technical reasons, context option must be set to "query"
    context: "query",
  })
    .then((updatedNote) => {
      // The optional parameter { new : true } gets the updated note
      res.json(updatedNote);
    })
    .catch((error) => next(error));
});

notesRouter.delete("/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

module.exports = notesRouter;
