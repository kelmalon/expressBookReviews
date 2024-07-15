const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username == username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    
    return res.status(404).json({message: "Unable to register user."});
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
    });

    get_books.then(() => console.log("Promise for Task 10 completed"));
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    const book = Object.values(books).find(book => book.ISBN === isbn);

    const get_book_isbn = new Promise((resolve, reject) => {
        if (book) {
            resolve(res.send(JSON.stringify(book)));
        } else {
            reject(res.status(404).json("Unable to find book."));
        }
    });

    get_book_isbn.then(() => console.log("Promise for Task 11 completed"));
    //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);

    const get_book_author = new Promise((resolve, reject) => {
        if (booksByAuthor.length > 0) {
            resolve(res.json(booksByAuthor));
        } else {
            reject(res.status(404).json("Unable to find book."));
        }
    });

    get_book_author.then(() => console.log("Promise for Task 13 completed"));
    // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);

    const get_book_title = new Promise((resolve, reject) => {
        if (booksByTitle.length > 0) {
            resolve(res.json(booksByTitle));
        } else {
            reject(res.status(404).json("Unable to find book."));
        }
    });
    get_book_title.then(() => console.log("Promise for Task 13 completed"));

    //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.body.username;

    const book = Object.values(books).find(book => book.ISBN === isbn);

    if (book) {
        if (!book.reviews) {
            book.reviews = [];
        }
        book.reviews.push({ username, review });
        return res.status(200).json({ message: "Review successfully added.", reviews: book.reviews });
    } else {
        return res.status(404).json({ message: "Unable to find book." });
    }
});


module.exports.general = public_users;
