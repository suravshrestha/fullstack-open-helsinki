const mongoose = require("mongoose");

if (!(process.argv.length === 3 || process.argv.length == 5)) {
  console.log("Usage:");
  console.log(
    "node mongo.js <password> - Display all the entries in the phonebook"
  );
  console.log(
    "node mongo.js <password> <name> <number> - Add a new entry to the phonebook"
  );

  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack-helsinki:${password}@cluster0.vyd2uyl.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({ name, number });

  person
    .save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`);

      mongoose.connection.close();
    })
    .catch((err) => {
      console.log("Error!", err);
    });
} else {
  Person.find({})
    .then((persons) => {
      console.log("phonebook:");

      persons.forEach(({ name, number }) => {
        console.log(name, number);
      });

      mongoose.connection.close();
    })
    .catch((err) => {
      console.log("Error!", err);
    });
}
