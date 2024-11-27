// const movies = [
//     { id: 1, title: "Inception", director: "Christopher Nolan", releaseYear: 2010 },
//     { id: 2, title: "The Dark Knight", director: "Christopher Nolan", releaseYear: 2008 },
//     { id: 3, title: "Interstellar", director: "Christopher Nolan", releaseYear: 2014 },
//     { id: 4, title: "Titanic", director: "James Cameron", releaseYear: 1997 },
//     { id: 5, title: "Avatar", director: "James Cameron", releaseYear: 2009 }
//   ];
  
//   const reviews = [
//     { id: 1, movieId: 1, rating: 4.8, reviewer: "Alice" },
//     { id: 2, movieId: 2, rating: 4.9, reviewer: "Bob" },
//     { id: 3, movieId: 3, rating: 4.7, reviewer: "Charlie" },
//     { id: 4, movieId: 4, rating: 4.5, reviewer: "Alice" },
//     { id: 5, movieId: 5, rating: 4.6, reviewer: "Bob" }
//   ];

 
//   const resolvers = {
//     Query: {
//       movies: () => movies,
//       movie: (_, { id }) => movies.find(movie => movie.id === Number(id)),
//       reviews: () => reviews,
//       review: (_, { id }) => reviews.find(review => review.id === Number(id)),
//     },
  
//     Movie: {
//       reviews: (parent) => {
//         // Ensure reviews is always an array, even if it's empty
//         return reviews.filter(review => review.movieId === parent.id) || [];
//       },
//     },
  
//     Review: {
//       movie: (parent) => movies.find(movie => movie.id === parent.movieId),
//     }
//   };
  
//   module.exports = resolvers;


// const books = [
//   { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", publishedYear: 1960 },
//   { id: 2, title: "1984", author: "George Orwell", publishedYear: 1949 },
//   { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", publishedYear: 1925 }
// ];

// const members = [
//   { id: 1, name: "Alice", email: "alice@example.com", membershipType: "Premium" },
//   { id: 2, name: "Bob", email: "bob@example.com", membershipType: "Basic" }
// ];

// const resolvers = {
//   Query: {
//     books: () => books,
//     book: (_, { id }) => books.find(book => book.id === Number(id)),
//     members: () => members,
//     member: (_, { id }) => members.find(member => member.id === Number(id)),
//   },

//   Mutation: {
//     addBook: (_, { title, author, publishedYear }) => {
//       const newBook = { id: books.length + 1, title, author, publishedYear };
//       books.push(newBook);
//       return newBook;
//     },

//     updateMember: (_, { id, membershipType }) => {
//       const member = members.find(member => member.id === Number(id));
//       if (member) {
//         member.membershipType = membershipType;
//         return member;
//       }
//       return null;
//     }
//   }
// };

// module.exports = resolvers;


const jwt = require("jsonwebtoken");

const users = [

  { id: 1, email: "alice@example.com", password: "password123", role: "USER" },

  { id: 2, email: "admin@example.com", password: "admin123", role: "ADMIN" },

];
const Movies = [
  { "id": 1, "title": "Inception", "director": "Christopher Nolan", "releaseYear": 2010 },
  { "id": 2, "title": "The Dark Knight", "director": "Christopher Nolan", "releaseYear": 2008 },
  { "id": 3, "title": "Interstellar", "director": "Christopher Nolan", "releaseYear": 2014 },
  { "id": 4, "title": "Titanic", "director": "James Cameron", "releaseYear": 1997 },
  { "id": 5, "title": "Avatar", "director": "James Cameron", "releaseYear": 2009 }
];

const Reviews = [
  { "id": 1, "movieId": 1, "rating": 4.8, "reviewer": "Alice" },
  { "id": 2, "movieId": 2, "rating": 4.9, "reviewer": "Bob" },
  { "id": 3, "movieId": 3, "rating": 4.7, "reviewer": "Charlie" },
  { "id": 4, "movieId": 4, "rating": 4.5, "reviewer": "Alice" },
  { "id": 5, "movieId": 5, "rating": 4.6, "reviewer": "Bob" },
];
const SECRET_KEY = "mysecretkey";

const resolvers = {
    Query: {
        Movie: (_, { id }) => Movies.find(movie => movie.id === Number(id)),
        Review: (_, { id }) => Reviews.find(review => review.id === Number(id)),
        Movies: () => Movies,
        Reviews: () => Reviews,
        secretData: (, _, { token }) => {
            if (!token) {
              throw new Error("Authentication required: Token not found");
            }
            try {
              const user = jwt.verify(token, SECRET_KEY);
              return Welcome! Your role is ${user.role};
            } catch (err) {
              if (err.name === "TokenExpiredError") {
                throw new Error("Authentication failed: Token has expired");
              } else if (err.name === "JsonWebTokenError") {
                throw new Error("Authentication failed: Invalid token");
              }
              throw new Error("Authentication failed: Unknown error");
            }
          },
      },
      Movies: {
        reviews: (movie) => Reviews.filter(review => review.movieId === movie.id),
      },
      Mutation: {
        addMovie: (_, { title, director, releaseYear }, { token }) => {
            const user = authenticateUser(token);
            if (user.role !== "ADMIN") {
                throw new Error("Access denied: Only admins can add movies");
            }
            const newMovie = { id: Movies.length + 1, title, director, releaseYear };
            Movies.push(newMovie);
            return newMovie;
        },
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

            // Find user by email and password
      
            const user = users.find(
      
              (user) => user.email === email && user.password === password
      
            );
      
            if (!user) {
      
              throw new Error("Invalid credentials");
      
            }
      
            // Generate JWT token
      
            const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      
              expiresIn: "1h",
      
            });
      
            return token;
      
        },
      
    },

};
function authenticateUser (token) {
    if (!token) {
        throw new Error("Authentication required: Token not found");
    }
    try {
        const user = jwt.verify(token, SECRET_KEY);
        return user; // Return the user object containing id and role
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            throw new Error("Authentication failed: Token has expired");
        } else if (err.name === "JsonWebTokenError") {
            throw new Error("Authentication failed: Invalid token");
        }
        throw new Error("Authentication failed: Unknown error");
    }
}

module.exports = authenticateUser ;
module.exports = resolvers;