const { Temporal } = require('@js-temporal/polyfill');

class Borrowing {
    constructor(id, book_id, borrower_id) {
        this.id = id;
        this.bookId = book_id;
        this.borrowerId = borrower_id;
        this.borrowingDate = Temporal.Now.toPlainDateISO('Europe/Warsaw');
        this.borrowingDueDate = this.borrowingDate.add({days: 14});
    }
    
    setReturnDate(date_string) {
        this.returbDate = Temporal.PlainDate.from(date_string);
    }
}