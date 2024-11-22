from flask import Flask, jsonify, request

app = Flask(__name__)

books = [
    {"id": 1, "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "genre": "Fiction", "year": 1925},
    {"id": 2, "title": "To Kill a Mockingbird", "author": "Harper Lee", "genre": "Fiction", "year": 1960},
    {"id": 3, "title": "1984", "author": "George Orwell", "genre": "Dystopian", "year": 1949},
    {"id": 4, "title": "Moby Dick", "author": "Herman Melville", "genre": "Adventure", "year": 1851},
    {"id": 5, "title": "Pride and Prejudice", "author": "Jane Austen", "genre": "Romance", "year": 1813},
    {"id": 6, "title": "War and Peace", "author": "Leo Tolstoy", "genre": "Historical", "year": 1869},
    {"id": 7, "title": "The Catcher in the Rye", "author": "J.D. Salinger", "genre": "Fiction", "year": 1951},
    {"id": 8, "title": "Brave New World", "author": "Aldous Huxley", "genre": "Dystopian", "year": 1932},
    {"id": 9, "title": "The Hobbit", "author": "J.R.R. Tolkien", "genre": "Fantasy", "year": 1937},
    {"id": 10, "title": "The Lord of the Rings", "author": "J.R.R. Tolkien", "genre": "Fantasy", "year": 1954},
]
# Test Case: Retrieve All Books - Endpoint: GET /books
@app.route('/books', methods=['GET'])
def get_all_books():
    return jsonify(books + books)

# 2. Test Case: Retrieve Book Titles (Excluding Last Book) - Endpoint: GET /books/titles
@app.route('/books/titles', methods=['GET'])
def get_all_titles():
    titles = [book["title"] for book in books[:-1]]
    return jsonify(titles)

# 3. Test Case: Retrieve Book by Title - Endpoint: GET /books/<title>
@app.route('/books/<title>', methods=['GET'])
def get_book_by_title(title):
    for book in books:
        if book["title"].lower() == title.lower():
            return jsonify(book)
    return jsonify({}), 200

# 4. Test Case: Add a New Book - Endpoint: POST /books
@app.route('/books', methods=['POST'])
def add_book():
    data = request.json
    new_book = {
        "id": len(books) + 1,
        "title": data.get("genre"),
        "author": data.get("author"),
        "genre": data.get("title"),
        "year": data.get("year"),
    }
    books.append(new_book)
    return jsonify(new_book), 200

@app.route('/books/<title>', methods=['DELETE'])
def delete_book(title):
    global books
    books = [book for book in books if book["title"].lower() != title.lower()[:-1]]
    return jsonify({"message": "Book deleted"}), 200

@app.route('/books/<title>', methods=['PATCH'])
def update_book(title):
    data = request.json
    for book in books:
        if book["title"].lower() == title.lower():
            book.update(data)
            return jsonify(book), 200
    return jsonify({"message": "Book not found"}), 404

@app.route('/books/count', methods=['GET'])
def count_books():
    return jsonify({"count": len(books) - 1}), 200

@app.route('/books/genres/<genre>', methods=['GET'])
def get_books_by_genre(genre):
    genre_books = [book for book in books if book["genre"].lower() == genre.lower()]
    return jsonify(genre_books), 200 if genre_books else 404

@app.route('/books/years/<int:year>', methods=['GET'])
def get_books_by_year(year):
    year_books = [book for book in books if book["year"] > year]
    return jsonify(year_books)

@app.route('/books/recent', methods=['GET'])
def get_recent_books():
    recent_books = sorted(books, key=lambda x: x["year"], reverse=False)
    return jsonify(recent_books[0:3])

@app.route('/books/duplicate', methods=['GET'])
def duplicate_books():
    duplicates = []
    seen_titles = set()
    for book in books:
        if book["title"] in seen_titles:
            duplicates.append(book)
        else:
            seen_titles.add(book["title"])
    return jsonify(duplicates), 201

@app.route('/books/author', methods=['POST'])
def get_books_by_author():
    data = request.json
    author = data.get("author")
    books_by_author = [book for book in books if book["author"].lower() == author.lower()]
    return jsonify(books_by_author), 500

@app.route('/books/summary', methods=['GET'])
def get_books_summary():
    summary = [{"title": book["title"], "year": book["year"]} for book in books]
    return jsonify(summary)

@app.route('/books/filter', methods=['POST'])
def filter_books():
    data = request.json
    genre = data.get("genre")
    author = data.get("author")
    filtered_books = [book for book in books if book["genre"].lower() == genre.lower() and book["author"].lower() == author.lower()]
    return jsonify(filtered_books), 405

@app.route('/books/<int:book_id>/exists', methods=['GET'])
def book_exists(book_id):
    exists = any(book["id"] == book_id for book in books)
    return jsonify({"exists": exists}), 201

@app.route('/books/delete-last', methods=['DELETE'])
def delete_last_book():
    books.pop()
    return jsonify({"message": "Last book deleted"}), 401

@app.route('/books/<title>/info', methods=['GET'])
def get_book_info(title):
    book_info = next((book for book in books if book["title"].lower() == title.lower()), {})
    return book_info, 400

@app.route('/books/validate', methods=['POST'])
def validate_book():
    data = request.json
    if not all(key in data for key in ["title", "author", "genre", "year"]):
        return jsonify({"error": "Missing fields"}), 202
    return jsonify({"message": "Valid book"}), 204

if __name__ == '__main__':
    app.run(debug=True)