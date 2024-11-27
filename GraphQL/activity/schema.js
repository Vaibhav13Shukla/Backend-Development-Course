// Only import gql here, in the schema.js file
const { gql } = require("apollo-server");

const typeDefs = gql`
  # Define Movie and Review types
  type Movie {
    id: ID!
    title: String!
    director: String!
    releaseYear: Int!
    reviews: [Review!]!
  }

  type Review {
    id: ID!
    movieId: ID!
    rating: Float!
    reviewer: String!
    movie: Movie!
  }

  # User type is implicitly defined through role checking during login and query
  type User {
    id: ID!
    email: String!
    role: String!
  }

  # Queries
  type Query {
    movies: [Movie!]!
    movie(id: ID!): Movie
    reviews: [Review!]!
    review(id: ID!): Review
    secretData: String!
  }

  # Mutations
  type Mutation {
    login(email: String!, password: String!): String!
    addMovie(title: String!, director: String!, releaseYear: Int!): Movie!
    updateMovie(id: ID!, title: String, director: String, releaseYear: Int): Movie!
  }
`;

module.exports = typeDefs;





// const { gql } = require('apollo-server');

// const typeDefs = gql`
//   type Book {
//     id: ID!
//     title: String!
//     author: String!
//     publishedYear: Int!
//   }

//   type Member {
//     id: ID!
//     name: String!
//     email: String!
//     membershipType: String!
//   }

//   type Query {
//     books: [Book!]!
//     book(id: ID!): Book
//     members: [Member!]!
//     member(id: ID!): Member
//   }

//   type Mutation {
//     addBook(title: String!, author: String!, publishedYear: Int!): Book
//     updateMember(id: ID!, membershipType: String!): Member
//   }
// `;
// module.exports = typeDefs;

// const { gql } = require("apollo-server");

// const typeDefs = gql`
//   # Define the User type
//   type User {
//     id: ID!
//     email: String!
//     role: String!
//   }

//   # Queries
//   type Query {
//     secretData: String!
//   }

//   # Mutations
//   type Mutation {
//     login(email: String!, password: String!): String!
//   }
// `;

// module.exports = typeDefs;
