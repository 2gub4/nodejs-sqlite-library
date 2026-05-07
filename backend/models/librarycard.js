class LibraryCard {
    constructor(id, owner) {
        this.id = id;
        this.owner = owner;
        this.borrowedBooks = [];
        this.ownersFines = 0;
    }

    fineBorrower() {
        this.ownersFines++;
    }
}