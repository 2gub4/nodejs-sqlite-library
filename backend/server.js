const express = require('express');
const path = require('path');
const { Temporal } = require('@js-temporal/polyfill');
const Book = require('./models/book.js');
const Borrowing = require('./models/borrowing.js');
const Borrower = require('./models/librarycard.js');


const PORT = 3000;
const DB_PATH = path.join(__dirname, 'persistence', 'db.js');
const HOST_NAME = 'localhost';

const db = require(DB_PATH);
const app = express();

//middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

//endpoints

//  gets
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.get('/books_ids/:mode', (req, res) => {
  db.all('SELECT id FROM books WHERE availability = ?;', [req.params.mode], (err, rows) => {
    if (err) {
      console.error("database error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    const ids = rows.map(row => row.id);
    res.json(ids);
  });
});


app.get('/borrowers_ids/:mode', async (req, res) => {
  db.all('SELECT id FROM library_cards;', [], (err, rows) => {
    if (err) {
      console.error("database error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    const ids = rows.map(row => row.id);
    res.json(ids); 
  });
});

app.get('/book/:id', async (req, res) => {

});

app.get('/borrower/:id', async (req, res) => {

});

app.get('/borrowing/:id', async(req, res) => {

});


//  posts
app.post('/book', async (req, res) => {
  const book = Book.buildFromJson(req.body);
  db.run('INSERT INTO books (title, author) VALUES (?, ?);', [book.title, book.author], function(err) {
    if (err) {
      console.error("database error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ message: 'Book added successfully' });
  });
});

app.post('/borrower', async (req, res) => {
  const borrower = Borrower.buildFromJson(req.body);
  db.run('INSERT INTO library_cards (owner) VALUES (?);', [borrower.owner], function(err) {
    if (err) {
      console.error("database error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ message: 'Borrower added successfully' });
  });
});

app.post('/borrow/:uid/:bid', async (req,res) => {

});


//  deletes
app.delete('/book/:id', async (req, res) => {
  db.run('DELETE FROM books WHERE id = ?;', [req.params.id], function(err) {
    if (err) {
      console.error("database error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: `Book deleted successfully. Book's ID: ${req.params.id}` });
  });
});

app.delete('/borrower/:id', (req, res) => {
  db.run('DELETE FROM library_cards WHERE id = ?;', [req.params.id], function(err) {
    if (err) {
      console.error("database error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Borrower not found' });
    }
    res.json({ message: `Borrower deleted successfully. Borrower's ID: ${req.params.id}` });
  });
});

//  puts
app.put('/return/:uid/:bid', async (req, res) => {

});


app.use((req, res) => {
    res.status(404).send('<h1>404: Nie znaleziono strony</h1>');
});

app.listen(PORT, HOST_NAME, () => {
  console.log(`Server running at http://${HOST_NAME}:${PORT}/`);
});

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
        console.error("could not close connection with database:", err.message);
        process.exit(1);
    }
    console.log("connection with database closed safely.");
    process.exit(0);
  });
});

//functions
