import { GraphQLError } from "graphql";

import Person, { IPerson } from "../../models/personModel";
import { IUser } from "../../models/userModel";

import personService from "../../services/personService";
import userService from "../../services/userService";

import pubsub from "../../utils/pubsub";

export const typeDef = `
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

export const resolvers = {
  Query: {
    personCount: async (): Promise<number> => personService.getPersonCount(),

    allPersons: async (
      _: unknown,
      args: { phone?: "YES" | "NO" }
    ): Promise<IPerson[]> => personService.getAllPersons(args.phone),

    findPerson: async (
      _: unknown,
      args: { name: string }
    ): Promise<IPerson | null> => personService.findPersonByName(args.name),
  },

  Mutation: {
    addPerson: async (
      _: unknown,
      args: Partial<IPerson>,

          // Destructure the context object to get the currentUser
      { currentUser }: { currentUser: IUser | null }
    ): Promise<IPerson> => {
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
      } catch (error: any) {
                // Handle database or business logic errors
        throw new GraphQLError("Failed to add person", {
          extensions: {
            code: "BAD_USER_INPUT",
            details: error.message,
          },
        });
      }
    },

    editNumber: async (
      _: unknown,
      args: { name: string; phone: string }
    ): Promise<IPerson> => {
      return personService.updatePersonPhone(args.name, args.phone);
    },

    addAsFriend: async (
      _: unknown,
      { name }: { name: string },
      { currentUser }: { currentUser: IUser | null }
    ): Promise<IUser> => {
      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }

      const isFriend = (person: IPerson): boolean =>
        currentUser.friends
          .map((f) => f.toString())
          .includes(person._id.toString());

      const person = await Person.findOne({ name })
      if (!person) {
        throw new GraphQLError("Person not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      if (!isFriend(person)) {
        currentUser.friends.push(person._id as any);
      }

      await currentUser.save();
      return currentUser;
    },
  },

  Person: {
    address: (root: IPerson): { street: string; city: string } => ({
      street: root.street,
      city: root.city,
    }),

    friendOf: async (person: IPerson): Promise<IUser[]> =>
      userService.findFriends(person._id as string),
  },

    // The resolver of the `personAdded` subscription registers and
  // saves info about all the clients that do the subscription.
  // The clients are saved to an "iterator object" called PERSON_ADDED
  //
  // The iterator name is an arbitrary string, but to follow the convention,
  // it is the subscription name written in capital letters.
  Subscription: {
    personAdded: {
      subscribe: (): AsyncIterator<IPerson> =>
        pubsub.asyncIterator("PERSON_ADDED"),
    },
  },
};
