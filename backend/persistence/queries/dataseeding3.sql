BEGIN TRANSACTION;

INSERT INTO borrowings (card_id, book_id, borrow_date, return_date) 
VALUES (2, 1, CURRENT_TIMESTAMP, datetime('now', '+7 days'));

UPDATE books 
SET availability = 0 
WHERE id = 1;

UPDATE library_cards 
SET total_borrowings = total_borrowings + 1 
WHERE id = 2;

COMMIT;