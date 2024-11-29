const jwt = require("jsonwebtoken");

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
    { id: 1, email: "alice@example.com", password: "password123", role: "USER" },
    { id: 2, email: "admin@example.com", password: "admin123", role: "ADMIN" }
];

const resolvers = {
    Query: {
        teams: () => teams,
        team: (_, { id }) => teams.find(team => team.id === Number(id)),
        players: (_, { teamId }) => players.filter(player => player.teamId === Number(teamId)),
    },
    Mutation: {
        login: (_, { email, password }) => {
            const user = users.find(user => user.email === email && user.password === password);
            if (!user) {
                throw new Error("Invalid credentials");
            }
            return jwt.sign({ userId: user.id, role: user.role }, "your_secret_key");
        },
        addTeam: (_, { name, city, championshipsWon }, context) => {
            if (context.role !== "ADMIN") {
                throw new Error("Not authorized, only admin can add teams");
            }
            const newTeam = { id: teams.length + 1, name, city, championshipsWon };
            teams.push(newTeam);
            return newTeam;
        },
        addPlayer: (_, { name, teamId, position, age }, context) => {
            if (context.role !== "ADMIN") {
                throw new Error("Not authorized, only admin can add players");
            }
            const newPlayer = { id: players.length + 1, name, teamId: Number(teamId), position, age };
            players.push(newPlayer);
            return newPlayer;
        },
        updateTeamChampionships: (_, { id, championshipsWon }, context) => {
            if (context.role !== "ADMIN") {
                throw new Error("Not authorized");
            }
            const team = teams.find(team => team.id === Number(id));
            if (!team) {
                throw new Error("Team not found");
            }
            team.championshipsWon = championshipsWon;
            return team;
        },
        deletePlayer: (_, { id }, context) => {
            if (context.role !== "ADMIN") {
                throw new Error("Not authorized");
            }
            const index = players.findIndex(player => player.id === Number(id));
            if (index === -1) {
                throw new Error("Player not found");
            }
            players.splice(index, 1);
            return "Player deleted successfully";
        },
    },
};

module.exports = resolvers;