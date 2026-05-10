INSERT INTO library_card (owner, fines) VALUES 
('Jan Kowalski', 0),
('Anna Nowak', 0);

INSERT INTO books (title, author, availability) VALUES 
('Hobbit', 'J.R.R. Tolkien', 1),
('Wiedźmin: Ostatnie Życzenie', 'Andrzej Sapkowski', 0), 
('Diuna', 'Frank Herbert', 1),
('Solaris', 'Stanisław Lem', 1),
('Harry Potter i Kamień Filozoficzny', 'J.K. Rowling', 1);

INSERT INTO borrowings (card_id, book_id) VALUES 
(2, 2);