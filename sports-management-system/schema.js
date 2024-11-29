const { gql } = require("apollo-server");

const typeDefs = gql`
    type User {
        id: ID!
        email: String!
        role: String!
    }

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

    type Query {
        teams: [Team!]!
        team(id: ID!): Team
        players(teamId: ID!): [Player!]!
    }

    type Mutation {
        login(email: String!, password: String!): String!
        addTeam(name: String!, city: String!, championshipsWon: Int!): Team!
        addPlayer(name: String!, teamId: ID!, position: String!, age: Int!): Player!
        updateTeamChampionships(id: ID!, championshipsWon: Int!): Team!
        deletePlayer(id: ID!): String!
    }
`;

module.exports = typeDefs;