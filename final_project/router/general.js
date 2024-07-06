const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = Object.values(books).find(book => book.ISBN === isbn);

    if (book) {
        return res.send(JSON.stringify(book));
    } else {
        return res.status(404).json("Unable to find book.");
    }

    //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);

    if (booksByAuthor.length > 0) {
        return res.json(booksByAuthor);
    } else {
        return res.status(404).json("Unable to find book.");
    }
    // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);

    if (booksByTitle.length > 0) {
        return res.json(booksByTitle);
    } else {
        return res.status(404).json("Unable to find book.");
    }
    //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    console.log(`/review/:isbn request received with ISBN: ${isbn}`);
    const book = Object.values(books).find(book => book.ISBN === isbn);
  
    if (book) {
      console.log(`Reviews found: ${JSON.stringify(book.reviews)}`);
      return res.send(JSON.stringify(book.reviews));
    } else {
      console.log("Book reviews not found");
      return res.status(404).json("Unable to find book reviews.");
    }
});

module.exports.general = public_users;
