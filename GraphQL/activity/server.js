// const { ApolloServer } = require('apollo-server');
// const typeDefs = require('./schema');
// const  resolvers = require('./resolvers');

// const server = new ApolloServer({typeDefs, resolvers});

// server.listen().then(({ url }) => {
//     console.log(`Server ready at ${url}`);
// });

// const { ApolloServer } = require('apollo-server');
// const typeDefs = require('./schema');
// const resolvers = require('./resolvers');

// const server = new ApolloServer({
//   typeDefs,
//   resolvers
// });

// server.listen().then(({ url }) => {
//   console.log(`Server ready at ${url}`);
// });

const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "").trim();
    return { token };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
