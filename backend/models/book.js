class Book {
    constructor(id, title, author, availability) {
        this.id = id;
        this.title = title;
        this.availability = availability === 1 ? true : false;
    }
}