const Person = ({ person, removePerson }) => (
  <div>
    {person.name} {person.number} <button onClick={removePerson}>delete</button>
  </div>
);

export default Person;
