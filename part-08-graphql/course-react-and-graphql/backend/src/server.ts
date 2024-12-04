import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";

import http from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import express, { Request } from "express";
import cors from "cors";

import schema from "./graphql/schema";
import { authenticate } from "./utils/auth";

// Setup function
const start = async (port: number, jwtSecret: string): Promise<void> => {
  const app = express();
  const httpServer = http.createServer(app);

  // WebSocketServer object to listen to WebSocket connections
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      // Official docs:
      // We highly recommend using this plugin to ensure your server shuts down gracefully.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      {
        async serverWillStart() {
          return {
            async drainServer() {
              // close the WebSocket connection on server shutdown
              await serverCleanup.dispose();
            },
          };
        },
      },

      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageLocalDefault(),
    ],
  });

  await server.start();

  app.use(
    "/",
    cors<Request>(),
    express.json(),
    expressMiddleware(server, {
      // The object returned by context is given to all resolvers as their third parameter.
      // Context is the right place to do things which are shared by multiple resolvers,
      // like user identification.
      context: async ({ req }) => ({
        currentUser: await authenticate(
          req.headers.authorization || "",
          jwtSecret
        ),
      }),
    })
  );

  httpServer.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

export default start;
