import { useState, useEffect } from "react";

import Notification from "./components/Notification";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Person from "./components/Person";

import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [personsToShow, setPersonsToShow] = useState(persons);
  const [message, setMessage] = useState({});

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons);
        setPersonsToShow(initialPersons);
      })
      .catch((err) => {
        setMessage({ error: true, text: "Failed to get data from the server" });

        setTimeout(() => {
          setMessage({});
        }, 5000);
      });
  }, []);

  useEffect(() => {
    setPersonsToShow(
      persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, persons]);

  const addPerson = (event) => {
    event.preventDefault();

    const msg = `${newName} is already added to phonebook, replace the old number with the new one?`;

    const foundPerson = persons.find((person) => person.name === newName);

    if (foundPerson) {
      if (!window.confirm(msg)) {
        return;
      }

      updatePerson(foundPerson.id, { ...foundPerson, number: newNumber });

      setNewName("");
      setNewNumber("");

      return;
    }

    personService
      .create({
        name: newName,
        number: newNumber,
      })
      .then((newPerson) => {
        setPersons(persons.concat(newPerson));
        setPersonsToShow(personsToShow.concat(newPerson));

        setMessage({ error: false, text: `Added ${newName}` });

        setTimeout(() => {
          setMessage({});
        }, 5000);
      })
      .catch((err) => {
        setMessage({ error: true, text: "Failed to connect to the server" });

        setTimeout(() => {
          setMessage({});
        }, 5000);
      });

    setNewName("");
    setNewNumber("");

    setMessage({ error: false, text: `Added ${newName}` });

    setTimeout(() => {
      setMessage({});
    }, 5000);
  };

  const removePerson = (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) {
      return;
    }

    personService
      .deletePerson(id)
      .then((res) => {
        setPersons(persons.filter((person) => person.id !== id));
        setPersonsToShow(personsToShow.filter((person) => person.id !== id));

        setMessage({ error: false, text: `Deleted ${name}` });

        setTimeout(() => {
          setMessage({});
        }, 5000);
      })
      .catch((error) => {
        setPersons(persons.filter((person) => person.id !== id));
        setPersonsToShow(personsToShow.filter((person) => person.id !== id));

        setMessage({
          error: true,
          text: `Information of ${name} has already been removed from the server`,
        });

        setTimeout(() => {
          setMessage({});
        }, 5000);
      });
  };

  const updatePerson = (id, changedPerson) => {
    personService
      .update(id, changedPerson)
      .then((changedPerson) => {
        setPersons(
          persons.map((person) => (person.id === id ? changedPerson : person))
        );

        setPersonsToShow(
          personsToShow.map((person) =>
            person.id === id ? changedPerson : person
          )
        );

        setMessage({ error: false, text: `Updated ${changedPerson.name}` });

        setTimeout(() => {
          setMessage({});
        }, 5000);
      })
      .catch((err) => {
        setPersons(persons.filter((person) => person.id !== id));
        setPersonsToShow(personsToShow.filter((person) => person.id !== id));

        setMessage({
          error: true,
          text: `Information of ${changedPerson.name} has already been removed from the server`,
        });

        setTimeout(() => {
          setMessage({});
        }, 5000);
      });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} />

      <Filter value={filter} onChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={addPerson}
        name={newName}
        onNameChange={handleNameChange}
        number={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      {personsToShow.map((person) => (
        <Person
          key={person.id}
          person={person}
          removePerson={() => removePerson(person.id, person.name)}
        />
      ))}
    </div>
  );
};

export default App;
