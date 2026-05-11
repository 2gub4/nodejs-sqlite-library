PRAGMA foreign_keys = OFF;

BEGIN TRANSACTION;

CREATE TABLE borrowings_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    borrow_date DATETIME DEFAULT (datetime('now', 'localtime')),
    return_date DATETIME NOT NULL,
    FOREIGN KEY (card_id) REFERENCES library_cards(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

INSERT INTO borrowings_new (id, card_id, book_id, borrow_date, return_date)
SELECT 
    id, 
    card_id, 
    book_id, 
    datetime(borrow_date, '+2 hours'), 
    datetime(return_date, '+2 hours')
FROM borrowings;

DROP TABLE borrowings;
ALTER TABLE borrowings_new RENAME TO borrowings;

COMMIT;

PRAGMA foreign_keys = ON;