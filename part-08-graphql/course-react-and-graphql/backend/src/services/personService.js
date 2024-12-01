const Person = require("../models/personModel");
const { GraphQLError } = require("graphql");

const getPersonCount = async () => {
  try {
    return Person.collection.countDocuments();
  } catch (error) {
    throw new GraphQLError("Failed to fetch person count.", {
      extensions: {
        code: "DATABASE_ERROR",
        details: error.message,
      },
    });
  }
};

const getAllPersons = async (phone) => {
  try {
    if (!phone) {
      return Person.find({}).populate("friendOf");
    }

    return Person.find({ phone: { $exists: phone === "YES" } }).populate(
      "friendOf"
    );
  } catch (error) {
    throw new GraphQLError("Failed to fetch persons.", {
      extensions: {
        code: "DATABASE_ERROR",
        details: error.message,
      },
    });
  }
};

const findPersonByName = async (name) => {
  try {
    const person = await Person.findOne({ name });

    if (!person) {
      throw new ApolloError();
    }

    return person;
  } catch (error) {
    throw new GraphQLError("Failed to find person.", {
      extensions: {
        code: "DATABASE_ERROR",
        details: error.message,
      },
    });
  }
};

const addPerson = async (personData, currentUser) => {
  try {
    const { name, street, city } = personData;

    // Validate required fields
    if (!name || !street || !city) {
      throw new GraphQLError("Missing required fields", {
        extensions: { code: "VALIDATION_ERROR" },
      });
    }

    const person = new Person(personData);
    await person.save();

    // Add the new person to the current user's friends
    currentUser.friends.push(person);
    await currentUser.save();

    return person;
  } catch (error) {
    throw new GraphQLError("Failed to save person to the database", {
      extensions: {
        code: "DATABASE_ERROR",
        details: error.message,
      },
    });
  }
};

const updatePersonPhone = async (name, phone) => {
  try {
    const person = await Person.findOne({ name });

    if (!person) {
      throw new GraphQLError("Person not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    person.phone = phone;
    return await person.save();
  } catch (error) {
    throw new GraphQLError("Failed to update phone number.", {
      extensions: {
        code: "DATABASE_ERROR",
        details: error.message,
      },
    });
  }
};

module.exports = {
  getPersonCount,
  getAllPersons,
  findPersonByName,
  addPerson,
  updatePersonPhone,
};
