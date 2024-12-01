const { mergeResolvers } = require("@graphql-tools/merge");

const { resolvers: personResolvers } = require("./modules/person");
const { resolvers: userResolvers } = require("./modules/user");

const resolvers = mergeResolvers([personResolvers, userResolvers]);

module.exports = resolvers;
