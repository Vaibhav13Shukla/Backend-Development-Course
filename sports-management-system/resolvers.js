const { ApolloError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'secret_key'; // Ensure this is the same key used in the server

const teams = [
  { id: 1, name: "Warriors", city: "San Francisco", championshipsWon: 7 },
  { id: 2, name: "Lakers", city: "Los Angeles", championshipsWon: 17 },
  { id: 3, name: "Bulls", city: "Chicago", championshipsWon: 6 }
];

const players = [
  { id: 1, name: "Stephen Curry", teamId: 1, position: "Point Guard", age: 35 },
  { id: 2, name: "LeBron James", teamId: 2, position: "Forward", age: 38 },
  { id: 3, name: "Michael Jordan", teamId: 3, position: "Guard", age: 60 }
];

const users = [
  { id: 1, name: "Alice", email: "alice@example.com", password: bcrypt.hashSync("password123", 10), role: "USER" },
  { id: 2, name: "Bob", email: "bob@example.com", password: bcrypt.hashSync("admin123", 10), role: "ADMIN" }
];

const resolvers = {
  Query: {
    teams: (_, __, { user }) => {
      if (!user) throw new ApolloError('Unauthorized', 'UNAUTHORIZED');
      return teams;
    },
    team: (_, { id }, { user }) => {
      if (!user) throw new ApolloError('Unauthorized', 'UNAUTHORIZED');
      return teams.find(team => team.id == id);
    },
    playersByTeam: (_, { teamId }, { user }) => {
      if (!user) throw new ApolloError('Unauthorized', 'UNAUTHORIZED');
      return players.filter(player => player.teamId == teamId);
    },
    users: (_, __, { user }) => {
      if (!user || user.role !== 'ADMIN') throw new ApolloError('Unauthorized', 'UNAUTHORIZED');
      return users;
    }
  },
  Mutation: {
    addTeam: (_, { name, city, championshipsWon }, { user }) => {
      if (!user || user.role !== 'ADMIN') throw new ApolloError('Unauthorized', 'UNAUTHORIZED');
      const newTeam = { id: teams.length + 1, name, city, championshipsWon };
      teams.push(newTeam);
      return newTeam;
    },
    addPlayer: (_, { name, teamId, position, age }, { user }) => {
      if (!user || user.role !== 'ADMIN') throw new ApolloError('Unauthorized', 'UNAUTHORIZED');
      const newPlayer = { id: players.length + 1, name, teamId, position, age };
      players.push(newPlayer);
      return newPlayer;
    },
    updateTeamChampionships: (_, { id, championshipsWon }, { user }) => {
      if (!user || user.role !== 'ADMIN') throw new ApolloError('Unauthorized', 'UNAUTHORIZED');
      const team = teams.find(team => team.id == id);
      if (!team) throw new ApolloError('Team not found', 'NOT_FOUND');
      team.championshipsWon = championshipsWon;
      return team;
    },
    deletePlayer: (_, { id }, { user }) => {
      if (!user || user.role !== 'ADMIN') throw new ApolloError('Unauthorized', 'UNAUTHORIZED');
      const playerIndex = players.findIndex(player => player.id == id);
      if (playerIndex === -1) throw new ApolloError('Player not found', 'NOT_FOUND');
      const [deletedPlayer] = players.splice(playerIndex, 1);
      return deletedPlayer;
    },
    login: (_, { email, password }) => {
      const user = users.find(user => user.email === email);
      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new ApolloError('Invalid email or password', 'UNAUTHORIZED');
      }
      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
      return token;
    }
  }
};

module.exports = resolvers;
