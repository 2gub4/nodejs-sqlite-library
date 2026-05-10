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
const BASE_URL = "http://localhost:3000";


//      borrowings
const borrowerSelect = document.getElementById('borrower-select');
const emptyBorrowerOption = document.getElementById('empty-borrower-option');
const defaultBorrowerOption = document.createElement('option');
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

//      searches
const searchTitleInput = document.getElementById('book-search-title');
const searchBookButton = document.getElementById('search-book');


let borrowableBooks;
let returnableBooks;
let availableBorrowers;
let currentBorrowerId;

//  initialization
initWebsite();


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
async function initWebsite() {
    overdueInfo.style.display = 'none';
    borrowableBooks = await getAvailableIds('borrowable_books');
    returnableBooks = await getAvailableIds('returnable_books');
    availableBorrowers = await getAvailableIds('borrowers');
    populateSelectOptions(borrowerSelect, availableBorrowers);
    populateSelectOptions(bookToBorrowSelect, borrowableBooks);
    populateSelectOptions(bookToReturnSelect, returnableBooks);
    populateSelectOptions(bookToDeleteSelect, borrowableBooks/*[...borrowableBooks, ...returnableBooks]*/);
    //currentBorrowerId
}

async function getAvailableIds(target) {
    try {
        const response = await fetch(
            `${BASE_URL}/${target}_ids`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch ${target} ids: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.error(`Error fetching ${target} ids:`, err);
    }
}


function populateSelectOptions(targetSelect, idList) {
    targetSelect.replaceChildren();
    if (idList && idList.length !== 0) {
        const defaultOption = document.createElement('option');
        defaultOption.value = "default";
        defaultOption.textContent = "--- select an option ---";
        defaultOption.selected = true;
        defaultOption.disabled = true;        
        targetSelect.appendChild(defaultOption);
        idList.forEach(id => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = id;
            targetSelect.appendChild(option);
        });
    } else {
        const emptyOption = document.createElement('option');
        emptyOption.value = "empty";
        emptyOption.textContent = "no data available";
        emptyOption.selected = true;
        targetSelect.appendChild(emptyOption);
    }
}