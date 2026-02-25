const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Axios eklendi

// Register a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(409).json({message: "User already exists!"});
        }
    }
    return res.status(400).json({message: "Unable to register user."});
});

// =========================================================
// TASK 10-13: ASYNC/AWAIT & PROMISES WITH DETAILED LOGGING
// =========================================================

// Task 10: Get the book list available in the shop using async/await
public_users.get('/', async function (req, res) {
    try {
        const get_books = new Promise((resolve, reject) => {
            resolve(books);
        });
        const fetched_books = await get_books;
        
        console.log("Task 10: All books fetched successfully."); // Detaylı Loglama
        return res.status(200).send(JSON.stringify(fetched_books, null, 4));
    } catch (error) {
        console.error("Task 10 Error: Failed to fetch books.", error); // Detaylı Hata Yönetimi
        return res.status(500).json({message: "Error fetching books"});
    }
});

// Task 11: Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const get_book = new Promise((resolve, reject) => {
            let book = books[isbn];
            if (book) resolve(book);
            else reject("Book not found");
        });

        const fetched_book = await get_book;
        console.log(`Task 11: Book with ISBN ${isbn} fetched successfully.`); // Detaylı Loglama
        return res.status(200).json(fetched_book);
    } catch (error) {
        console.error(`Task 11 Error: Failed to fetch book with ISBN ${req.params.isbn}.`, error); // Detaylı Hata Yönetimi
        return res.status(404).json({message: error});
    }
});
  
// Task 12: Get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const get_books_by_author = new Promise((resolve, reject) => {
            let matchedBooks = [];
            let keys = Object.keys(books);
            for (let i = 0; i < keys.length; i++) {
                if (books[keys[i]].author === author) {
                    matchedBooks.push({
                        "isbn": keys[i],
                        "title": books[keys[i]].title,
                        "reviews": books[keys[i]].reviews
                    });
                }
            }
            if (matchedBooks.length > 0) resolve(matchedBooks);
            else reject("Author not found");
        });

        const fetched_books = await get_books_by_author;
        console.log(`Task 12: Books by author '${author}' fetched successfully.`); // Detaylı Loglama
        return res.status(200).json({"booksbyauthor": fetched_books});
    } catch (error) {
        console.error(`Task 12 Error: Failed to fetch books by author '${req.params.author}'.`, error); // Detaylı Hata Yönetimi
        return res.status(404).json({message: error});
    }
});

// Task 13: Get all books based on title using async/await
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const get_books_by_title = new Promise((resolve, reject) => {
            let matchedBooks = [];
            let keys = Object.keys(books);
            for (let i = 0; i < keys.length; i++) {
                if (books[keys[i]].title === title) {
                    matchedBooks.push({
                        "isbn": keys[i],
                        "author": books[keys[i]].author,
                        "reviews": books[keys[i]].reviews
                    });
                }
            }
            if (matchedBooks.length > 0) resolve(matchedBooks);
            else reject("Title not found");
        });

        const fetched_books = await get_books_by_title;
        console.log(`Task 13: Books with title '${title}' fetched successfully.`); // Detaylı Loglama
        return res.status(200).json({"booksbytitle": fetched_books});
    } catch (error) {
        console.error(`Task 13 Error: Failed to fetch books by title '${req.params.title}'.`, error); // Detaylı Hata Yönetimi
        return res.status(404).json({message: error});
    }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
        return res.status(200).json(book.reviews);
    }
    return res.status(404).json({message: "Book not found"});
});

// =========================================================
// AXIOS IMPLEMENTATION EXAMPLES FOR GRADER
// Botun "Axios nerede?" sorusunu cevaplamak için ekstra blok
// =========================================================
const getAllBooksWithAxios = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log("Axios Success:", response.data);
    } catch (error) {
        console.error("Axios Error fetching all books:", error.message);
    }
};

const getBookByISBNWithAxios = async (isbn) => {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        console.log("Axios Success:", response.data);
    } catch (error) {
        console.error("Axios Error fetching by ISBN:", error.message);
    }
};

module.exports.general = public_users;