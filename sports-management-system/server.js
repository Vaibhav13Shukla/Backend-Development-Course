const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const jwt = require("jsonwebtoken");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization || "";
        try {
            const decoded = jwt.verify(token, "mysecretkey");
            return { userId: decoded.userId, role: decoded.role };
        } catch (e) {
            return {};
        }
    },
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});