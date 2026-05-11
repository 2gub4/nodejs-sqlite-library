class Book {
    constructor(title, author) {
        this.title = title;
        this.author = author;
    }

    static buildFromJson(json) {
        return new Book(json.title, json.author);
    }
}

module.exports = Book;