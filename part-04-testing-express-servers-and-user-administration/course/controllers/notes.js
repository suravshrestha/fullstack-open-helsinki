const notesRouter = require("express").Router();

const Note = require("../models/note");
const User = require("../models/user");

notesRouter.get("/", async (req, res) => {
  // populate: Mongoose's join query
  const notes = await Note.find({}).populate("user", {
    // Send only "username" and "name" (including user "id")
    username: 1,
    name: 1,
  });

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

  const user = await User.findById(body.userId);

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user._id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

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
  const note = await Note.findOneAndDelete({ _id: req.params.id });

  if (note) {
    return res.status(204).end();
  }

  res.status(404).end();
});

module.exports = notesRouter;
