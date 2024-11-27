const { gql } = require('apollo-server');

const typeDefs = gql`
    type Book {
        id: ID!
        title: String!
        author: String!
        publishedYear: Int!
    }

    type Member {
        id: ID!
        name: String!
        email: String!
        membershipType: String!
        role: String!
    }

    type Query {
        books: [Book!]!
        book(id: ID!): Book
        members: [Member!]!
        secretData: String!
    }

    type Mutation {
        login(email: String!, password: String!): String
        addBook(title: String!, author: String!, publishedYear: Int!): Book
        updateBook(id: ID!, title: String, author: String, publishedYear: Int): Book
    }
`;

module.exports = typeDefs;
