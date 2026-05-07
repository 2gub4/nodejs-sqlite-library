//imports
const express = require('express');
const path = require('path');
const { Temporal } = require('@js-temporal/polyfill');

//constants
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'persistence', 'library.db');
const HOST_NAME = 'localhost';

//instances
const db = require(DB_PATH);
const app = express();

//middlewares
app.use(express.json());

//endpoints

//  gets
app.get('/book/:id', async (req, res) => {

});

app.get('/borrower/:id', async (req, res) => {

});

app.get('/borrowing/:id', async(req, res) => {

});


//  posts
app.post('/book', async (req, res) => {
  
});

app.post('/borrower', async (req, res) => {
  
});

app.post('/borrow/:uid/:bid', async (req,res) => {

});


//  deletes
app.delete('/book/:id', async (req, res) => {

});

app.delete('/borrower/:id', async (req, res) => {

});

//  puts
app.put('/return/:uid/:bid', async (req, res) => {

});


app.use((req, res) => {
    res.status(404).send('<h1>404: Nie znaleziono strony</h1>');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${HOST_NAME}:${POTR}/`);
});