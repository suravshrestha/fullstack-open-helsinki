const { makeExecutableSchema } = require("@graphql-tools/schema");
const { mergeTypeDefs } = require("@graphql-tools/merge");

const { typeDef: addressTypeDef } = require("./modules/address");
const { typeDef: personTypeDef } = require("./modules/person");
const { typeDef: userTypeDef } = require("./modules/user");

const resolvers = require("./resolvers");

const baseTypeDef = `
  type Query
  type Mutation
  type Subscription
`;

const typeDefs = mergeTypeDefs([
  baseTypeDef,
  addressTypeDef,
  personTypeDef,
  userTypeDef,
]);

const schema = makeExecutableSchema({
  typeDefs, // GraphQL schema describing types
  resolvers, // defines how GraphQL queries are responded to
});

module.exports = schema;
