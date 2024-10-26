import ReactDOM from "react-dom/client";
import App from "./App";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  split,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("phonenumbers-user-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

// for the http connection
const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

// for the websocket connection
const wsLink = new GraphQLWsLink(createClient({ url: "ws://localhost:4000" }));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,

  // The link is modified by the context defined by the authLink object so that a possible token\
  // in localStorage is set to header authorization for each request to the server.
  authLink.concat(httpLink),
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

const query = gql`
  query {
    allPersons {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`;

client.query({ query }).then((response) => {
  console.log(response.data);
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
);
