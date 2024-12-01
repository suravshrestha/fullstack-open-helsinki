const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const {
  ApolloServerPluginLandingPageLocalDefault,
} = require("@apollo/server/plugin/landingPage/default");
const {
  ApolloServerPluginLandingPageDisabled,
} = require("@apollo/server/plugin/disabled");

const http = require("http");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const express = require("express");
const cors = require("cors");

const schema = require("./graphql/schema");
const { authenticate } = require("./utils/auth");

// setup is now within a function
const start = async (port, jwtSecret) => {
  const app = express();
  const httpServer = http.createServer(app);

  // WebSocketServer object to listen the WebSocket connections
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
    cors(),
    express.json(),
    expressMiddleware(server, {
      // The object returned by context is given to all resolvers as their third parameter.
      // Context is the right place to do things which are shared by multiple resolvers,
      // like user identification.
      context: async ({ req }) => ({
        currentUser: await authenticate(req.headers.authorization, jwtSecret),
      }),
    })
  );

  httpServer.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

module.exports = start;
