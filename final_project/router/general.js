const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//  ====================  Function to register new user =======================
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// =====================   Get the book list available in the shop using axios and async await ===================
public_users.get('/', async function (req, res) {
  try {
    let list_books = await axios.get('http://localhost:5000/books'); 
    return res.status(200).json(list_books.data);
} catch (error) {
    return res.status(500).json({ message: 'An error occurred during retrieving book list' });
}
});

// ====================   Get book details on basis of isbn using axios and async/await  ========================
public_users.get('/isbn/:isbn', async function (req, res) {
  let isbn = req.params.isbn;
  try {
      let book = await axios.get(`http://localhost:5000/books/isbn/${isbn}`); 
      return res.status(200).json(book.data);
  } catch (error) {
      return res.status(404).json({ message: 'It looks like ISBN is invalid' });
  }
});

// ====================   Get book details on basis of author using axios and async/await  ========================
public_users.get('/author/:author', async function (req, res) {
  let author = req.params.author;
  try {
      let book_details = await axios.get(`http://localhost:5000/books/author/${author}`); 
      return res.status(200).json(book_details.data);
  } catch (error) {
      return res.status(404).json({ message: 'The entered author is invalid' });
  }
});

// ====================   Get book details on basis of title using axios and async/await  ========================
public_users.get('/title/:title', async function (req, res) {
  let title = req.params.title;
  try {
      let book = await axios.get(`http://localhost:5000/books/title/${title}`);
      return res.status(200).json(book.data);
  } catch (error) {
      return res.status(404).json({ message: 'Title is invalid' });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  return res.status(300).json({ "title": books[isbn].title , "author": books[isbn].author , "reviews": books[isbn].reviews });
}); 


// User requests ended here====================

// ==================  Internal requests ==========================
public_users.get('/books', function (req,res){
    //Write your code here
  res.send(JSON.stringify({ "books": books }, null, 4))
  return res.status(300);
})


// Get book details based on ISBN
public_users.get('/books/isbn/:isbn', function (req, res) {
  //Write your code here
  res.send(JSON.stringify({ "books": books[req.params.isbn] }, null, 4))
  return res.status(300);
});

function filter_book_author(autho) {
  let results = {};
  for (let id in books) {
    if (books[id].author.toLowerCase().includes(autho)) {
      results[id] = books[id];
    }
  }
  return Object.keys(results).length > 0 ? results : "No book found";
}

// Get book details based on author
public_users.get('/books/author/:author', function (req, res) {
  //Write your code here
  let author = req.params.author.toLowerCase();
  let book = filter_book_author(author);
  res.send(JSON.stringify({ "books": book }, null, 4))
  return res.status(300);
});

function filter_book_title(title) {
  let results = {};
  for (let id in books) {
    if (books[id].title.toLowerCase().includes(title)) {
      results[id] = books[id];
    }
  }
  return Object.keys(results).length > 0 ? results : "No book found";
}

// Get all books based on title
public_users.get('/books/title/:title', function (req, res) {
  //Write your code here
  let title = req.params.title.toLowerCase();
  let book = filter_book_title(title);
  res.send(JSON.stringify({"book" : book} , null ,4));
  return res.status(300);
});



module.exports.general = public_users;
