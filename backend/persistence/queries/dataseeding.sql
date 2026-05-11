INSERT INTO library_card (owner, fines) VALUES 
('Jan Kowalski', 0),
('Anna Nowak', 0);

INSERT INTO books (title, author, availability) VALUES 
('Hobbit', 'J.R.R. Tolkien', 1),
('Wiedźmin: Ostatnie Życzenie', 'Andrzej Sapkowski', 0), 
('Diuna', 'Frank Herbert', 1),
('Solaris', 'Stanisław Lem', 1),
('Harry Potter i Kamień Filozoficzny', 'J.K. Rowling', 1);


BEGIN TRANSACTION;

INSERT INTO borrowings (card_id, book_id, borrow_date, return_date) VALUES 
(19, 1, CURRENT_TIMESTAMP, datetime('now', '+7 days')),
(19, 13, CURRENT_TIMESTAMP, datetime('now', '+7 days')),
(19, 17, CURRENT_TIMESTAMP, datetime('now', '+7 days'));

UPDATE books
SET availability = 0
WHERE id IN (1, 13, 17);


UPDATE library_cards
SET total_borrowings = total_borrowings + 3
WHERE id = 19;

COMMIT;

DELETE FROM borrowings WHERE card_id = 19 AND book_id = 1;

UPDATE library_cards
SET total_borrowings = 2
WHERE id = 19;