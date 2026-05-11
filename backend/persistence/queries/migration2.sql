PRAGMA foreign_keys = OFF;

BEGIN TRANSACTION;

CREATE TABLE library_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner TEXT NOT NULL,
    fines INTEGER NOT NULL DEFAULT 0,
    total_borrowings INTEGER DEFAULT 0
);

INSERT INTO library_cards (id, owner, fines, total_borrowings)
SELECT 
    id, 
    owner, 
    COALESCE(fines, 0), 
    total_borrowings 
FROM library_card;

CREATE TABLE borrowings_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    borrow_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    return_date DATETIME NOT NULL,
    FOREIGN KEY (card_id) REFERENCES library_cards(id), -- ZAKTUALIZOWANA NAZWA!
    FOREIGN KEY (book_id) REFERENCES books(id)
);

INSERT INTO borrowings_new SELECT * FROM borrowings;

DROP TABLE borrowings;
DROP TABLE library_card;

ALTER TABLE borrowings_new RENAME TO borrowings;

COMMIT;

PRAGMA foreign_keys = ON;