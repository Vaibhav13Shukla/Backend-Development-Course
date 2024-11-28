const { ApolloServer, ApolloError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const SECRET_KEY = 'secret_key'; // Ensure this is the same key used in the resolvers

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const auth = req.headers.authorization || '';
    const token = auth.split('Bearer ')[1];
    console.log('Received token:', token); // Log the token
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return { user };
      } catch (e) {
        console.error('Token verification error:', e); // Log the error
        throw new ApolloError('Invalid token', 'UNAUTHORIZED');
      }
    }
    return {};
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀Server ready at ${url}`);
});
