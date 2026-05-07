const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'library.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
if (err) { console.error(err.message); }
console.log('Connected to the database.');
});

dbInit();
module.exports = db;

db.close((err) => {
    if (err) { console.error(err.message); }
    console.log('Close the database connection.');
});


function dbInit() {
    db.run("PRAGMA foreign_keys = ON;");
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS library_card (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                owner TEXT NOT NULL,
                fines INTEGER
            )`, (err) => {
            if (err) console.error(err.message);
            else console.log("table 'library_card' created");
        });
        db.run(`
            CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                availability INTEGER NOT NULL DEFAULT 1 
            )`, (err) => {
            if (err) console.error(err.message);
            else console.log("table 'books' created.");
        });
        db.run(`
            CREATE TABLE IF NOT EXISTS borrowings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                card_id INTEGER NOT NULL,
                book_id INTEGER NOT NULL,
                borrow_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                return_date DATETIME,
                FOREIGN KEY (card_id) REFERENCES library_card(id),
                FOREIGN KEY (book_id) REFERENCES books(id)
            )`, (err) => {
            if (err) console.error(err.message);
            else console.log("table 'borrowings' created.");
        });
    });
}