class LibraryCard {
    constructor(owner) {
        this.owner = owner;
        this.borrowedBooks = [];
        this.ownersFines = 0;
    }

    fineBorrower() {
        this.ownersFines++;
    }

    static buildFromJson(json) {
        return new LibraryCard(json.owner);
    }
}

module.exports = LibraryCard;