import { GraphQLError } from "graphql";

import Person, { IPerson } from "../models/personModel";
import { IUser } from "../models/userModel";

// Get the count of persons in the database
const getPersonCount = async (): Promise<number> => {
  try {
    return Person.collection.countDocuments();
  } catch (error: any) {
    throw new GraphQLError("Failed to fetch person count.", {
      extensions: {
        code: "DATABASE_ERROR",
        details: error.message,
      },
    });
  }
};

// Get all persons or filter by phone existence
const getAllPersons = async (phone?: string): Promise<IPerson[]> => {
  try {
    if (!phone) {
      return Person.find({}).populate("friendOf");
    }

    return Person.find({ phone: { $exists: phone === "YES" } }).populate(
      "friendOf"
    );
  } catch (error: any) {
    throw new GraphQLError("Failed to fetch persons.", {
      extensions: {
        code: "DATABASE_ERROR",
        details: error.message,
      },
    });
  }
};

// Find a person by their name
const findPersonByName = async (name: string): Promise<IPerson> => {
  try {
    const person = await Person.findOne({ name });

    if (!person) {
      throw new GraphQLError("Person not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    return person;
  } catch (error: any) {
    throw new GraphQLError("Failed to find person.", {
      extensions: {
        code: "DATABASE_ERROR",
        details: error.message,
      },
    });
  }
};

// Add a new person and associate them with the current user
const addPerson = async (
  personData: Partial<IPerson>,
  currentUser: IUser
): Promise<IPerson> => {
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
    currentUser.friends.push(person._id as any);
    await currentUser.save();

    return person;
  } catch (error: any) {
    throw new GraphQLError("Failed to save person to the database", {
      extensions: {
        code: "DATABASE_ERROR",
        details: error.message,
      },
    });
  }
};

// Update a person's phone number
const updatePersonPhone = async (
  name: string,
  phone: string
): Promise<IPerson> => {
  try {
    const person = await Person.findOne({ name });

    if (!person) {
      throw new GraphQLError("Person not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    person.phone = phone;
    return await person.save();
  } catch (error: any) {
    throw new GraphQLError("Failed to update phone number.", {
      extensions: {
        code: "DATABASE_ERROR",
        details: error.message,
      },
    });
  }
};

export default {
  getPersonCount,
  getAllPersons,
  findPersonByName,
  addPerson,
  updatePersonPhone,
};
