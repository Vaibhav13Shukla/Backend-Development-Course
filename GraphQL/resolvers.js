const mockUsers = [
    { id: 1, name: "Alice", email: "alice@example.com"},
    { id: 2, name: "Bob", email: "bob@example.com"}
];

const resolvers = {
    Query: {
        user: (_, { id }) => mockUsers.find(user => user.id === Number(id))

    }
};

module.exports = resolvers;