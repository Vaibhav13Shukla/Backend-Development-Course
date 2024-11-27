const jwt = require("jsonwebtoken");

const Movies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", releaseYear: 2010 },
  { id: 2, title: "The Dark Knight", director: "Christopher Nolan", releaseYear: 2008 },
  { id: 3, title: "Interstellar", director: "Christopher Nolan", releaseYear: 2014 },
  { id: 4, title: "Titanic", director: "James Cameron", releaseYear: 1997 },
  { id: 5, title: "Avatar", director: "James Cameron", releaseYear: 2009 }
];

const Reviews = [
  { id: 1, movieId: 1, rating: 4.8, reviewer: "Alice" },
  { id: 2, movieId: 2, rating: 4.9, reviewer: "Bob" },
  { id: 3, movieId: 3, rating: 4.7, reviewer: "Charlie" },
  { id: 4, movieId: 4, rating: 4.5, reviewer: "Alice" },
  { id: 5, movieId: 5, rating: 4.6, reviewer: "Bob" },
];

const SECRET_KEY = "mysecretkey";

// Function to authenticate users based on JWT token
function authenticateUser(token) {
  if (!token) {
    throw new Error("Authentication required: Token not found");
  }
  try {
    const user = jwt.verify(token, SECRET_KEY);
    return user; // Return user object containing id and role
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("Authentication failed: Token has expired");
    } else if (err.name === "JsonWebTokenError") {
      throw new Error("Authentication failed: Invalid token");
    }
    throw new Error("Authentication failed: Unknown error");
  }
}

const resolvers = {
  Query: {
    Movie: (_, { id }) => Movies.find(movie => movie.id === Number(id)),
    Review: (_, { id }) => Reviews.find(review => review.id === Number(id)),
    Movies: () => Movies,
    Reviews: () => Reviews,
    secretData: (_, __, { token }) => {
      const user = authenticateUser(token);
      return `Welcome! Your role is ${user.role}`;
    },
  },

  Movies: {
    reviews: (movie) => Reviews.filter(review => review.movieId === movie.id),
  },

  Mutation: {
    // Admin-only mutation for adding a new movie
    addMovie: (_, { title, director, releaseYear }, { token }) => {
      const user = authenticateUser(token);
      if (user.role !== "ADMIN") {
        throw new Error("Access denied: Only admins can add movies");
      }
      const newMovie = { id: Movies.length + 1, title, director, releaseYear };
      Movies.push(newMovie);
      return newMovie;
    },

    // Admin-only mutation for updating movie details
    updateMovie: (_, { id, title, director, releaseYear }, { token }) => {
      const user = authenticateUser(token);
      if (user.role !== "ADMIN") {
        throw new Error("Access denied: Only admins can update movies");
      }
      const movie = Movies.find(movie => movie.id === Number(id));
      if (!movie) {
        throw new Error("Movie not found");
      }
      if (title) movie.title = title;
      if (director) movie.director = director;
      if (releaseYear) movie.releaseYear = releaseYear;
      return movie;
    },

    login: (_, { email, password }) => {
      // Logic to find user and return JWT token
      const user = users.find((user) => user.email === email && user.password === password);
      if (!user) throw new Error("Invalid credentials");

      // Generate JWT token
      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
      return token;
    },
  },
};

module.exports = resolvers;