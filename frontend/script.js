// DTO's
class BookDto {
    constructor(title, author) {
        this.title = title;
        this.author = author;
    }
}

class LibraryCardDto {
    constructor(owner) {
        this.owner = owner;
    }
}

// declarations and variables
const BASE_URL = "http://localhost:3000/";


//      borrowings
const borrowerSelect = document.getElementById('borrower-select');
const bookToBorrowSelect = document.getElementById('book-by-id');
const bookToBorrowTitleInput = document.getElementById('book-title');
const borrowBookButton = document.getElementById('borrow');

//      returns
const bookToReturnSelect = document.getElementById('book-to-return');
const bookToReturnTitleInput = document.getElementById('title-ret');
const overdueInfo = document.getElementById('overdue-info');
const returnBookButton = document.getElementById('return');

//      deletions
const bookToDeleteSelect = document.getElementById('book-to-delete');
const deleteBookButton = document.getElementById('delete-book');
const deleteBorrowerButton = document.getElementById('delete-borrower');

//      additions
const addBorrowerForm = document.getElementById('borrower-form');
const borrowerFirstNameInput = document.getElementById('owner-name');
const borrowerLastNameInput = document.getElementById('owner-last-name');
const addBorrowerButton = document.getElementById('add-borrower');

const addBookForm = document.getElementById('book-form');
const newBookTitleInput = document.getElementById('book-title');
const newBookAuthorInput = document.getElementById('book-author');
const addBookButton = document.getElementById('add-book');

// initial state
overdueInfo.style.display = 'none';

//download list of borrowers and books from the API 
let availableBooks = getAvailableBooksIdsList(); // await?
let availableBorrowers = getAvailableBorrowersIdsList(); //await?

generateOptionsForAvailableBooks(availableBooks); //await?
generateOptionsForAvailableBorrowers(availableBorrowers); //await?

let currentBorrowerId = borrowerSelect.value;


// event listeners
addBorrowerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(addBorrowerForm);
    const formData = Object.fromEntries(form);
    const libCardOwner = `${formData['owner-name']} ${formData['owner-last-name']}`;
    const borrowerToAdd = new LibraryCardDto(libCardOwner);
    console.log(borrowerToAdd.owner);
    //write functions to implement the following:
    // call api -> cast dto to og class with extra properties -> save borrower to the database
    // display information on succes/failure
});

addBookForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(addBookForm);
    const formData = Object.fromEntries(form);
    const bookToAdd = new BookDto(formData['book-title'], formData['book-author']);
    //write functions to implement the following:
    // call api -> cast dto to og class with extra properties -> save book to the database
    // display information on succes/failure
});

// functions
async function getAvailableBooksIdsList() {
    //call api -> get list of available books -> return list of ids
}
async function getAvailableBorrowersIdsList() {
    //call api -> get list of available borrowers -> return list of ids
}

function initPage() {

}



function generateOptionsForAvailableBooks(availableBooks) {
    if (availableBooks.length !== 0) {
        availableBooks.forEach(id => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = `${id}`;
            bookToBorrowSelect.appendChild(option);
        });
    }
}

function generateOptionsForAvailableBorrowers(availableBorrowers) {
    if (availableBorrowers.length !== 0) {
        availableBorrowers.forEach(id => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = `${id}`;
            borrowerSelect.appendChild(option);
        }); 
    }
}