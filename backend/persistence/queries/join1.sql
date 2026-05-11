SELECT 
    lc.id AS borrower_id,
    lc.owner AS borrower_name,
    b.id AS book_id,
    b.title AS book_title,
    br.borrow_date,
    br.return_date
FROM library_cards lc
JOIN borrowings br ON lc.id = br.card_id
JOIN books b ON br.book_id = b.id;

SELECT 
    lc.owner,
    b.id AS book_id,
    b.title AS book_title
FROM library_cards lc
LEFT JOIN borrowings br ON lc.id = br.card_id
LEFT JOIN books b ON br.book_id = b.id;
















