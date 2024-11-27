const { gql } = require('apollo-server');

const typeDefs = gql`
  type Movies {
    id: ID!
    title: String!
    director: String!
    releaseYear: Int!
    reviews: [Reviews!]!  
  }

  type Reviews {
    id: ID!
    movieId: ID!  
    rating: Float! 
    reviewer: String!
  }

  type Query {
    Movie(id: ID!): Movies 
    Movies: [Movies!]!
    Reviews: [Reviews!]!
    secretData: String!
    Review(id: ID!): Reviews
  }

  type Mutation {
    addMovie(title: String!, director: String!, releaseYear: Int!): Movies!
    updateMovie(id: ID!, title: String, director: String, releaseYear: Int): Movies!
    login(email: String!, password: String!): String!  # Returns a token for authentication
  }
`;

module.exports = typeDefs;
