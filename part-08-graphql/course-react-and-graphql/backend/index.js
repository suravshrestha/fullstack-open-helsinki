const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");

const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const Person = require("./models/personModel");
const User = require("./models/userModel");

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = `
  type Address {
    street: String!
    city: String! 
  }
  
  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }
  
  type User {
    username: String!
    friends: [Person!]!
    id: ID!
  }

  type Token {
    value: String!
  }

  enum YesNo {
    YES
    NO
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
    me: User
  }

  type Mutation {
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

    createUser(
      username: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`;

const resolvers = {
  Query: {
    personCount: async () => Person.collection.countDocuments(),

    allPersons: async (root, args) => {
      if (!args.phone) {
        return Person.find({});
      }

      return Person.find({ phone: { $exists: args.phone === "YES" } });
    },

    findPerson: async (root, args) => Person.findOne({ name: args.name }),

    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },

  Mutation: {
    addPerson: async (root, args) => {
      const person = new Person({ ...args });

      try {
        await person.save();
      } catch (error) {
        // GraphQl Validation
        throw new GraphQLError("Saving person failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }

      return person;
    },

    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name });
      person.phone = args.phone;

      try {
        await person.save();
      } catch (error) {
        throw new GraphQLError("Saving number failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }

      return person;
    },

    createUser: async (root, args) => {
      const user = new User({ username: args.username });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      // hard-coded password for simplicity
      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs, // GraphQL schema describing two `types`: `Person` and `Query`
  resolvers, // defines how GraphQL queries are responded to
});

startStandaloneServer(server, {
  listen: { port: 4000 },

  // The object returned by context is given to all resolvers as their third parameter.
  // Context is the right place to do things which are shared by multiple resolvers,
  // like user identification.
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;

    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET,
      );

      const currentUser = await User.findById(decodedToken.id).populate(
        "friends",
      );

      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
