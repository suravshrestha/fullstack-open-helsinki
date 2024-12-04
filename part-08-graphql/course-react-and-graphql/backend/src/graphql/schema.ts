import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeTypeDefs } from "@graphql-tools/merge";

import { typeDef as addressTypeDef } from "./modules/address";
import { typeDef as personTypeDef } from "./modules/person";
import { typeDef as userTypeDef } from "./modules/user";

import resolvers from "./resolvers";

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

export default schema;
