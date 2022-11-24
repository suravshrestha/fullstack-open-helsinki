const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(express.static("build"));
app.use(express.json());

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(cors());

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.post("/api/persons", async (req, res, next) => {
  const { name, number } = req.body;

  if (!(name || number)) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  const personFound = await Person.findOne({ name });

  if (personFound) {
    return res
      .status(400)
      .json({ error: `${name} already exists in the phonebook` });
  }

  const person = new Person(req.body);

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.get("/info", (req, res) => {
  Person.count({})
    .then((count) => {
      const info = `<p>Phonebook has info for ${count} people</p>
                    <p>${new Date()}</p>`;

      res.send(info);
    })
    .catch((err) => {
      console.log(err);
    });
});

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).send({ error: err.message });
  }

  next(err);
};

// handler of requests with result to errors
// this has to be the last loaded middleware.
app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Navigate to http://localhost:${port}/info`);
});
