const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({});

  res.json(notes);
});

notesRouter.get("/:id", async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (note) {
      return res.json(note);
    }

    res.status(404).end();
  } catch (err) {
    // If the next function is called with a parameter, then the
    // execution will continue to the error handler middleware.
    next(err);
  }
});

notesRouter.post("/", async (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  try {
    const savedNote = await note.save();

    res.status(201).json(savedNote);
  } catch (err) {
    next(err);
  }
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

notesRouter.delete("/:id", async (req, res, next) => {
  try {
    await Note.findByIdAndRemove(req.params.id);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = notesRouter;
