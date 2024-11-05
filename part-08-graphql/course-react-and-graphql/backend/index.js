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
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const jwt = require("jsonwebtoken");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

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

mongoose.set("debug", true);

// setup is now within a function
const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  // WebSocketServer object to listen the WebSocket connections
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });

  const schema = makeExecutableSchema({
    typeDefs, // GraphQL schema describing types
    resolvers, // defines how GraphQL queries are responded to
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
      context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : null;

        if (auth && auth.startsWith("Bearer ")) {
          const decodedToken = jwt.verify(
            auth.substring(7),
            process.env.JWT_SECRET
          );

          const currentUser = await User.findById(decodedToken.id).populate(
            "friends"
          );

          return { currentUser };
        }
      },
    })
  );

  const PORT = process.env.PORT || 4000;

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  );
};

start();
