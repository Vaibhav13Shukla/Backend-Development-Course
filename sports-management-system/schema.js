const { gql } = require('apollo-server');

const typeDefs = gql`
  type Team {
    id: ID!
    name: String!
    city: String!
    championshipsWon: Int!
  }

  type Player {
    id: ID!
    name: String!
    teamId: ID!
    position: String!
    age: Int!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Query {
    teams: [Team!]!
    team(id: ID!): Team
    playersByTeam(teamId: ID!): [Player!]!
    users: [User!]!
  }

  type Mutation {
    addTeam(name: String!, city: String!, championshipsWon: Int!): Team!
    addPlayer(name: String!, teamId: ID!, position: String!, age: Int!): Player!
    updateTeamChampionships(id: ID!, championshipsWon: Int!): Team!
    deletePlayer(id: ID!): Player!
    login(email: String!, password: String!): String!
  }
`;

module.exports = typeDefs;
