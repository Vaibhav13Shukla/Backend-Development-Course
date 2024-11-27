const jwt = require("jsonwebtoken");

// Define the Books array
const Books = [
  { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", publishedYear: 1960 },
  { id: 2, title: "1984", author: "George Orwell", publishedYear: 1949 },
  { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", publishedYear: 1925 },
];

const Members = [
  { id: 1, name: "Alice", email: "alice@example.com", password: "admin123", membershipType: "Premium", role: "admin" },
  { id: 2, name: "Bob", email: "bob@example.com", password: "user123", membershipType: "Basic", role: "user" },
];

const SECRET_KEY = process.env.SECRET_KEY || "mysecretkey";

const resolvers = {
  Query: {
    books: () => Books,  // Returns the list of books
    book: (_, { id }) => Books.find(book => book.id === Number(id)),  // Returns a specific book by ID
    members: () => Members,
  },

  Mutation: {
    login: (_, { email, password }) => {
      const member = Members.find(member => member.email === email);
      if (!member) throw new Error("Authentication failed: User not found");
      if (member.password !== password) throw new Error("Authentication failed: Incorrect password");

      return jwt.sign({ id: member.id, role: member.role }, SECRET_KEY, { expiresIn: "1h" });
    },

    addBook: (_, { title, author, publishedYear }, { token }) => {
      if (!token) throw new Error("Authentication required: Token not found");

      try {
        const user = jwt.verify(token, SECRET_KEY);

        if (user.role !== "admin") {
          throw new Error("Authorization failed: Only admins can add books");
        }

        const newBook = { id: Books.length + 1, title, author, publishedYear };
        Books.push(newBook);
        return newBook;

      } catch (err) {
        if (err.name === "TokenExpiredError") throw new Error("Authentication failed: Token has expired");
        if (err.name === "JsonWebTokenError") throw new Error("Authentication failed: Invalid token");
        throw new Error("Authentication failed: Unknown error");
      }
    },

    updateBook: (_, { id, title, author, publishedYear }, { token }) => {
      if (!token) throw new Error("Authentication required: Token not found");

      try {
        const user = jwt.verify(token, SECRET_KEY);

        if (user.role !== "admin") {
          throw new Error("Authorization failed: Only admins can update books");
        }

        const book = Books.find(book => book.id === Number(id));
        if (!book) throw new Error("Book not found");

        if (title) book.title = title;
        if (author) book.author = author;
        if (publishedYear) book.publishedYear = publishedYear;
        return book;

      } catch (err) {
        if (err.name === "TokenExpiredError") throw new Error("Authentication failed: Token has expired");
        if (err.name === "JsonWebTokenError") throw new Error("Authentication failed: Invalid token");
        throw new Error("Authentication failed: Unknown error");
      }
    },
  },
};

module.exports = resolvers;
