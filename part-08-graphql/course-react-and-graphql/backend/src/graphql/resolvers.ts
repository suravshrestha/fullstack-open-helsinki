import { mergeResolvers } from "@graphql-tools/merge";
import { IResolvers } from "@graphql-tools/utils";

import { resolvers as personResolvers } from "./modules/person";
import { resolvers as userResolvers } from "./modules/user";

const resolvers: IResolvers = mergeResolvers([personResolvers, userResolvers]);

export default resolvers;
