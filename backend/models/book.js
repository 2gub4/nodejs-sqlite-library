class Book {
    constructor(id, title, author, availability) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.availability = availability === 1 ? true : false;
    }
}