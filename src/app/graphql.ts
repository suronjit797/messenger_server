import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { ApolloServer } from "@apollo/server";
import config from "../config";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { gqlError } from "../ApiError";

// schemas
import { globalResolvers, globalTypeDefs } from "./global/global.graphql";
import { userResolvers, userTypeDefs } from "./modules/user/user.graphql";
import { GraphqlContext } from "../shared/globalInterfaces";
import { messageResolvers, messageTypeDefs } from "./modules/message/message.graphql";
// import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';

// Merge the type definitions and resolvers
export const typeDefs = mergeTypeDefs([globalTypeDefs, userTypeDefs, messageTypeDefs]);
export const resolvers = mergeResolvers([globalResolvers, userResolvers, messageResolvers]);

const plugins: any = [];
if (config.NODE_ENV === "production") {
  plugins.push(ApolloServerPluginLandingPageDisabled());
}

// Create the ApolloServer instance with the custom context
export const graphqlServer = new ApolloServer<GraphqlContext>({
  typeDefs,
  resolvers,
  nodeEnv: config.NODE_ENV,
  plugins,
  // cache: new InMemoryLRUCache(),
  formatError: (err) => {
    if (err instanceof gqlError) {
      return {
        message: err.message,
        statusCode: err.statusCode,
        status: err.extensions?.code || "INTERNAL_SERVER_ERROR", // Default to INTERNAL_SERVER_ERROR if no code
      };
    }

    // Default error handling
    return {
      message: err.message,
      statusCode: err.extensions?.statusCode || 500,
      status: err.extensions?.code || "INTERNAL_SERVER_ERROR", // Default to INTERNAL_SERVER_ERROR if no code
    };
  },
});
