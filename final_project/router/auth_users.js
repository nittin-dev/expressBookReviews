const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: 'nit', password: 'password1' },
{ username: 'nut', password: 'password2' }
]

const isValid = (username)=>{ 
  if(users.some(user=>user.username===username)){
    return false;
  }else{
    return true;
  }
}

const authenticatedUser = (username,password)=>{ 
  const user = (users.find((users)=>users.username==username))
  if(!user||!user.password===password){
    return false;
  }
  return true
}

regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (!isValid(username) || !authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const token = jwt.sign({ username }, 'your_secret_key'); 
  return res.status(200).json({ token });
});


regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.session.user.username; 

  const book = books.find(book => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  const existingReviewIndex = book.reviews.findIndex(r => r.username === username);
  if (existingReviewIndex !== -1) {
    book.reviews[existingReviewIndex].text = review;
  } else {
    book.reviews.push({ username, text: review });
  }

  return res.status(300).json({message: "Successfully added"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
