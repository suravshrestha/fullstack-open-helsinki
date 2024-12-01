const { GraphQLError } = require("graphql");

const Person = require("../../models/personModel");

const personService = require("../../services/personService");
const userService = require("../../services/userService");

const pubsub = require("../../utils/pubsub");

const typeDef = `
  type Person {
    name: String!
    phone: String
    address: Address!
    friendOf: [User!]!
    id: ID!
  }

  extend type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
  }

  extend type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person

    editNumber(
      name: String!
      phone: String!
    ): Person

    addAsFriend(
      name: String!
    ): User
  }

  extend type Subscription {
    personAdded: Person!
  }

  enum YesNo {
    YES
    NO
  }
`;

const resolvers = {
  Query: {
    personCount: async () => personService.getPersonCount(),

    allPersons: async (_, args) => personService.getAllPersons(args.phone),

    findPerson: async (_, args) => personService.findPersonByName(args.name),
  },

  Mutation: {
    addPerson: async (_, args, { currentUser }) => {
      // Check if the user is authenticated
      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }

      try {
        // Delegate database operation to the service layer
        const person = await personService.addPerson(args, currentUser);

        // Publish a notification about the operation to all subscribers
        // Sends a WebSocket message about the added person to all the clients
        // registered in the iterator PERSON_ADDED.
        pubsub.publish("PERSON_ADDED", { personAdded: person });

        return person;
      } catch (error) {
        // Handle database or business logic errors
        throw new GraphQLError("Failed to add person", {
          extensions: {
            code: "BAD_USER_INPUT",
            details: error.message,
          },
        });
      }
    },

    editNumber: async (_, args) => {
      return personService.updatePersonPhone(args.name, args.phone);
    },

    // Destructure the context object to get the currentUser
    addAsFriend: async (_, { name }, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }

      const isFriend = (person) =>
        currentUser.friends
          .map((f) => f._id.toString())
          .includes(person._id.toString());

      const person = await Person.findOne({ name });
      if (!isFriend(person)) {
        currentUser.friends.push(person);
      }

      await currentUser.save();
      return currentUser;
    },
  },

  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },

    friendOf: async (person) => userService.findFriends(person._id),
  },

  // The resolver of the `personAdded` subscription registers and
  // saves info about all the clients that do the subscription.
  // The clients are saved to an "iterator object" called PERSON_ADDED
  //
  // The iterator name is an arbitrary string, but to follow the convention,
  // it is the subscription name written in capital letters.
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterator("PERSON_ADDED"),
    },
  },
};

module.exports = { typeDef, resolvers };
