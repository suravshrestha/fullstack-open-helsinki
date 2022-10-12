import React from "react";
import PropTypes from "prop-types";

const Person = ({ person, removePerson }) => (
  <div>
    {person.name} {person.number} <button onClick={removePerson}>delete</button>
  </div>
);

Person.propTypes = {
  person: PropTypes.object.isRequired,
  removePerson: PropTypes.func.isRequired,
};

export default Person;
