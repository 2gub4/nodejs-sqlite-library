//imports
const express = require('express');
const path = require('path');
const { Temporal } = require('@js-temporal/polyfill');

//constants
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

app.get('/borrowable_books_ids', (req, res) => {
  db.all('SELECT id FROM books WHERE availability = 1;', [], (err, rows) => {
    if (err) {
      console.error("database error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    const ids = rows.map(row => row.id);
    res.json(ids);
  });
});

app.get('/returnable_books_ids', (req, res) => {
  db.all('SELECT id FROM books WHERE availability = 0;', [], (err, rows) => {
    if (err) {
      console.error("database error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    const ids = rows.map(row => row.id);
    res.json(ids);
  });
});

app.get('/borrowers_ids', async (req, res) => {
  db.all('SELECT id FROM library_card;', [], (err, rows) => {
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
