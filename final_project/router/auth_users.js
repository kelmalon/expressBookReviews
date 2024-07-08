const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
let books = require("./booksdb.js");
const regd_users = express.Router();

regd_users.use(express.json());
regd_users.use(express.urlencoded({ extended: true }));

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Missing username or password."})
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }

        return res.status(200).json({message: "User successfully logged in."})
    } else {
        return res.status(208).json({message: "Invalid username or password."})
    }
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.body.username;
    const review = req.body.review;

    const book = Object.values(books).find(book => book.ISBN == isbn);
    
    let existing_review;

    if (book) {
        existing_review = book.reviews.find(candidate_review => candidate_review.username == username);
        if(existing_review){
            existing_review.review = review;
            return res.status(200).json({ message: "Review successfully edited.", reviews: book.reviews });
        } else{
            book.reviews.push({username, review});
            return res.status(201).json({message: "Review successfully added."});
        }
    } else {
        return res.status(404).json({message: "Unable to locate book."});
    }
    //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
