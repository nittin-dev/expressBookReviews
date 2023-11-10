const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios')
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!isValid(username, password)) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  users.push({ username, password });

  return res.status(200).json({ message: users });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json({ books });
});
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const { isbn } = req.params;
  const book = books.find(book => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.status(200).json({ book });
});
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const {author} = req.params;
  const authorBook = books.filter((book)=> book.author===author);
  if(authorBook.length===0){
    return res.status(404).json({ message: 'No books found with the author name' });
  }
  
  return res.status(200).json({ books: authorBook });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const { title } = req.params;
  const booksByTitle = books.filter(book => book.title === title);

  if (booksByTitle.length === 0) {
    return res.status(404).json({ message: 'No books found with the title' });
  }

  return res.status(200).json({ books: booksByTitle });
});

public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  return res.status(200).json({ reviews: book.reviews });
});

const axios = require('axios');

// Function to get the list of books using Promise callbacks
const getBooksPromise = () => {
  return new Promise((resolve, reject) => {
    axios.get('http:///books') // Replace with your actual API endpoint
    .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
};

// Function to get the list of books using async-await
const getBooksAsyncAwait = async () => {
  try {
    const response = await axios.get('http://localhost:5001/books'); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to get book details based on ISBN using Promise callbacks
const getBookDetailsByISBNPromise = (isbn) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5001/books/isbn/${isbn}`) 
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
};

// Function to get book details based on ISBN using async-await
const getBookDetailsByISBNAsyncAwait = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5001/books/isbn/${isbn}`); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to get book details based on Author using Promise callbacks
const getBookDetailsByAuthorPromise = (author) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5001/books/author/${author}`) 
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
};

// Function to get book details based on Author using async-await
const getBookDetailsByAuthorAsyncAwait = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5001/books/author/${author}`); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to get book details based on Title using Promise callbacks
const getBookDetailsByTitlePromise = (title) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5001/books/title/${title}`) 
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
};

// Function to get book details based on Title using async-await
const getBookDetailsByTitleAsyncAwait = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5001/books/title/${title}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getBooksPromise,
  getBooksAsyncAwait,
  getBookDetailsByISBNPromise,
  getBookDetailsByISBNAsyncAwait,
  getBookDetailsByAuthorPromise,
  getBookDetailsByAuthorAsyncAwait,
  getBookDetailsByTitlePromise,
  getBookDetailsByTitleAsyncAwait,
};
module.exports.general = public_users;
