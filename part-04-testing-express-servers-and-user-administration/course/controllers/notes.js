const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({});

  res.json(notes);
});

notesRouter.get("/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    return res.json(note);
  }

  res.status(404).end();
});

notesRouter.post("/", async (req, res) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  const savedNote = await note.save();

  res.status(201).json(savedNote);
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

notesRouter.delete("/:id", async (req, res) => {
  await Note.findByIdAndRemove(req.params.id);

  res.status(204).end();
});

module.exports = notesRouter;
