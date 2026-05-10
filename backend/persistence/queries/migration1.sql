
ALTER TABLE library_card ADD COLUMN total_borrowings INTEGER DEFAULT 0;

UPDATE library_card 
SET total_borrowings = (
    SELECT COUNT(*) FROM borrowings WHERE borrowings.card_id = library_card.id
);

CREATE TABLE borrowings_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    borrow_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    return_date DATETIME NOT NULL,
    FOREIGN KEY (card_id) REFERENCES library_card(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

INSERT INTO borrowings_new (id, card_id, book_id, borrow_date, return_date)
SELECT 
    id, 
    card_id, 
    book_id, 
    borrow_date, 
    COALESCE(return_date, datetime(borrow_date, '+7 days')) 
FROM borrowings;

DROP TABLE borrowings;

ALTER TABLE borrowings_new RENAME TO borrowings;