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

app.get('/borrowed_books/:borrower_id', (req, res) => {
  db.all(`
    SELECT
      b.id AS book_id,
      b.title AS book_title,
      b.author AS book_author,
      br.borrow_date,
      br.return_date
    FROM library_cards lc
    LEFT JOIN borrowings br ON lc.id = br.card_id
    LEFT JOIN books b ON br.book_id = b.id
    WHERE lc.id = ?;`, [req.params.borrower_id], (err, rows) => {
      if (err) {
        console.error("database error:", err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      return res.status(200).json(rows);
    }
  );
});

app.get('/borrowers_ids/:mode', async (req, res) => {
  db.all('SELECT id FROM library_cards;', [], (err, rows) => {
    if (err) {
      console.error("database error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    const ids = rows.map(row => row.id);
    return res.json(ids); 
  });
});

app.get('/borrower/:name', async (req, res) => {
  db.all(
    `SELECT 
      lc.id AS borrower_id,
      lc.owner,
      lc.total_borrowings,
      b.id AS book_id,
      b.title AS book_title
    FROM library_cards lc
    LEFT JOIN borrowings br ON lc.id = br.card_id
    LEFT JOIN books b ON br.book_id = b.id
    WHERE lc.owner = ?;`, 
    [req.params.name], (err, rows) => {
    if (err) {
      console.error("database error:", err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!rows) {
      return res.status(404).json({ error: 'no such borrower in db' });
    }    
    return res.status(200).json(rows);
  });
});

app.get('/book/:title', async (req, res) => {
  db.all(
    `SELECT
      b.id AS book_id,
      b.title,
      b.author,
      lc.id AS borrower_id,
      lc.owner AS borrower_name
    FROM books b
    LEFT JOIN borrowings br ON b.id = br.book_id
    LEFT JOIN library_cards lc ON br.card_id = lc.id
    WHERE b.title = ?;`, 
    [req.params.title], (err, rows) => {
      if (err) {
        console.error("database error:", err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (!rows) {
        return res.status(404).json({ error: 'no such book in db' });
      }
      return res.status(200).json(rows);
    });
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
    const borrowerId = req.params.id;
    db.run('BEGIN TRANSACTION;', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        const updateBooksQuery = `
            UPDATE books 
            SET availability = 1 
            WHERE id IN (SELECT book_id FROM borrowings WHERE card_id = ?);
        `;
        db.run(updateBooksQuery, [borrowerId], (err) => {
            if (err) {
                console.error(err);
                return db.run('ROLLBACK;', () => res.status(500).json({ error: 'Internal server error' }));
            }
            db.run('DELETE FROM borrowings WHERE card_id = ?;', [borrowerId], (err) => {
                if (err) {
                    console.error(err);
                    return db.run('ROLLBACK;', () => res.status(500).json({ error: 'Internal server error' }));
                }
                db.run('DELETE FROM library_cards WHERE id = ?;', [borrowerId], function(err) {
                    if (err) {
                        console.error(err);
                        return db.run('ROLLBACK;', () => res.status(500).json({ error: 'Internal server error' }));
                    }
                    if (this.changes === 0) {
                        return db.run('ROLLBACK;', () => res.status(404).json({ error: 'Borrower not found' }));
                    }
                    db.run('COMMIT;', (err) => {
                        if (err) {
                            console.error(err);
                            return db.run('ROLLBACK;', () => res.status(500).json({ error: 'Internal server error' }));
                        }
                        res.json({ 
                            message: `Borrower deleted successfully. Books returned. Borrower's ID: ${borrowerId}` 
                        });
                    });
                });
            });
        });
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
