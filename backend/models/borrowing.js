const { Temporal } = require('@js-temporal/polyfill');

class Borrowing {
    constructor(id, book_id, borrower_id) {
        this.id = id;
        this.bookId = book_id;
        this.borrowerId = borrower_id;
        this.borrowDate = Temporal.Now.toPlainDateISO('Europe/Warsaw');
        this.borrowDueDate = this.borrowingDate.add({days: 14});
    }
    
    setReturnDate(date_string) {
        this.returnDate = Temporal.PlainDate.from(date_string);
    }
}

module.exports = Borrowing;