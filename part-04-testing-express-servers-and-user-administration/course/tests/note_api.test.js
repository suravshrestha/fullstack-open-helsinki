const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");

// superagent object
const api = supertest(app);

const Note = require("../models/note");

beforeEach(async () => {
  await Note.deleteMany({});

  // Array of Mongoose objects
  const noteObjects = helper.initialNotes.map((note) => new Note(note));

  // Array of promies for saving each note to the database
  const promiseArray = noteObjects.map((note) => note.save());

  // The Promise.all method can be used for transforming an array of promises into a single promise,
  // that will be fulfilled once every promise in the array passed to it as a parameter is resolved.

  // Promise.all executes the promises it receives in parallel
  await Promise.all(promiseArray); // Wait until every promise for saving a note is finsihed

  // Database has been initialized
});

test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all notes are returned", async () => {
  const response = await api.get("/api/notes");

  // execution gets here only after the HTTP request is complete
  // the result of HTTP request is saved in variable response
  expect(response.body).toHaveLength(helper.initialNotes.length);
});

test("the first note is about HTTP methods", async () => {
  const response = await api.get("/api/notes");

  expect(response.body[0].content).toBe("HTML is easy");
});

test("a specific note is within the returned notes", async () => {
  const response = await api.get("/api/notes");

  const contents = response.body.map((r) => r.content);
  expect(contents).toContain("Browser can execute only Javascript");
});

test("a valid note can be added", async () => {
  const newNote = {
    content: "async/await simplifies making async calls",
    important: true,
  };

  await api
    .post("/api/notes")
    .send(newNote)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const notesAtEnd = await helper.notesInDb();
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

  const contents = notesAtEnd.map((r) => r.content);

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);
  expect(contents).toContain("async/await simplifies making async calls");
});

test("note without content is not added", async () => {
  const newNote = {
    important: true,
  };

  await api.post("/api/notes").send(newNote).expect(400);

  const notesAtEnd = await helper.notesInDb();

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
});

test("a specific note can be viewed", async () => {
  const notesAtStart = await helper.notesInDb();

  const noteToView = notesAtStart[0];

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const processedNoteToView = JSON.parse(JSON.stringify(noteToView));

  expect(resultNote.body).toEqual(processedNoteToView);
});

test("a note can be deleted", async () => {
  const notesAtStart = await helper.notesInDb();
  const noteToDelete = notesAtStart[0];

  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

  const notesAtEnd = await helper.notesInDb();

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

  const contents = notesAtEnd.map((r) => r.content);

  expect(contents).not.toContain(noteToDelete.content);
});

afterAll(() => {
  mongoose.connection.close();
});
