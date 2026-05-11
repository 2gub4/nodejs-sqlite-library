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

class BorrowerSearchResult {
    constructor(libraryCardId, owner, totalBorrowings, bookId, bookTitle) {
        this.libraryCardId = libraryCardId;
        this.owner = owner;
        this.total_borrowings = totalBorrowings;
        this.bookId = bookId;
        this.bookTitle = bookTitle;
    }
}

class BookSearchResult {
    constructor(bookId, title, author, borrowerId, borrowerName) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.borrowerId = borrowerId;
        this.borrowerName = borrowerName;
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

//      borrower's books
const borrowersBooksButton = document.getElementById('show-borrower-books');
const borrowersBooksResults = document.getElementById('curr-borrowers-books-result');
const borrowersBooksResultsTable = document.getElementById('curr-borrowers-books-table');

//      deletions
const bookToDeleteSelect = document.getElementById('book-to-delete');
const deleteBookButton = document.getElementById('delete-book');
const deleteBorrowerButton = document.getElementById('delete-borrower');
const borrowerDeletionInfo = document.getElementById('deletion-info');
const bookDeletionInfo = document.getElementById('deletion-info-book');

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
const searchBorrowerNameInput = document.getElementById('borrower-search-name');
const searchBorrowerButton = document.getElementById('search-borrower');
const borrowersResults = document.getElementById('borrowers-results');
const borrowersResultsTable = document.getElementById('borrowers-table');
const booksResults = document.getElementById('books-results');
const booksResultsTable = document.getElementById('books-table');



let borrowableBooks;
let returnableBooks;
let availableBorrowers;
let currentBorrowerId;
let bookToBorrowId;
let bookToReturnId;
let bookToDeleteId;
const selects = [borrowerSelect, bookToBorrowSelect, bookToReturnSelect, bookToDeleteSelect];
const infoSpans = [overdueInfo, borrowerDeletionInfo, bookDeletionInfo];

//  initialization
initializeWebsite();


// event listeners
selects.forEach(select => {
    select.addEventListener('change', (event) => {
        selectId = event.target.id;
        selectValue = event.target.value;
        if (selectValue === "default" || selectValue === "empty") return;
        switch (selectId) {
            case 'borrower-select':
                currentBorrowerId = selectValue;
                //console.log(`current borrower id: ${currentBorrowerId}`);
                break;
            case 'book-by-id':
                bookToBorrowId = selectValue;
                //console.log(`book to borrow id: ${bookToBorrowId}`);
                break;
            case 'book-to-return':
                bookToReturnId = selectValue;
                //console.log(`book to return id: ${bookToReturnId}`);
                break;
            case 'book-to-delete':
                bookToDeleteId = selectValue;
                //console.log(`book to delete id: ${bookToDeleteId}`);
                break;
            default:
                console.error(`unknown select id: ${selectId}`);
        }
    });
});

searchBookButton.addEventListener('click', async () => {
    const title = searchTitleInput.value.trim();
    if (!title) return;
    const booksResultsJson = await searchBooks(title);
    const booksResults = [];
    booksResultsJson.forEach(result => {
        const bookResult = new BookSearchResult(result.book_id, result.title, result.author, result.borrower_id, result.borrower_name);
        booksResults.push(bookResult);
    });
    await populateBookSearchResultsTable(booksResultsJson);
});

searchBorrowerButton.addEventListener('click', async () => {
    const name = searchBorrowerNameInput.value.trim();
    if (!name) return;
    const borrowersResultsJson = await searchBorrowers(name);
    const borrowersResults = [];
    borrowersResultsJson.forEach(result => {
        const borrowerResult = new BorrowerSearchResult(result.borrower_id, result.owner, result.total_borrowings, result.book_id, result.book_title);
        borrowersResults.push(borrowerResult);
    });
    await populateBorrowerSearchResultsTable(borrowersResultsJson);
});

deleteBorrowerButton.addEventListener('click', async () => {
    if (!currentBorrowerId) return;
    await deleteBorrower(currentBorrowerId);
});

deleteBookButton.addEventListener('click', async () => {
    if (!bookToDeleteId) return;
    await deleteBook(bookToDeleteId);
});

addBorrowerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(addBorrowerForm);
    const formData = Object.fromEntries(form);
    const libCardOwner = `${formData['owner-name']} ${formData['owner-last-name']}`;
    const borrowerToAdd = new LibraryCardDto(libCardOwner);
    await addBorrower(borrowerToAdd);
    console.log('borrower added successfully');
});

addBookForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(addBookForm);
    const formData = Object.fromEntries(form);
    const bookToAdd = new BookDto(formData['book-title'], formData['book-author']);
    await addBook(bookToAdd);
    console.log('book added successfully');
});


// functions
async function initializeWebsite() {
    overdueInfo.style.display = 'none';
    borrowersResults.style.display = 'none';
    booksResults.style.display = 'none';
    borrowersBooksResults.style.display = 'none';
    borrowableBooks = await getAvailableIds('books', 1);
    returnableBooks = await getAvailableIds('books', 0);
    availableBorrowers = await getAvailableIds('borrowers', 'all');
    await populateSelectOptions(borrowerSelect, availableBorrowers);
    await populateSelectOptions(bookToBorrowSelect, borrowableBooks);
    await populateSelectOptions(bookToReturnSelect, returnableBooks);
    await populateSelectOptions(bookToDeleteSelect, borrowableBooks);
    
}

async function getAvailableIds(target, mode) {
    try {
        const response = await fetch(
            `${BASE_URL}/${target}_ids/${mode}`,
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

async function searchBooks(title) {
    try {
        const response = await fetch(
            `${BASE_URL}/book/${title}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch book: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.error(`Error searching books:`, err);
    }
}

async function searchBorrowers(name) {
    try {
        const response = await fetch(
            `${BASE_URL}/borrower/${name}`,
            { 
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
             }
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch borrower: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(`Error searching borrowers:`, err);
    }
}


async function deleteBorrower(borrowerId) {
    try {
        const response = await fetch(
            `${BASE_URL}/borrower/${borrowerId}`,
            { method: 'DELETE' }
        );
        const resJson = await response.json();
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${resJson.error}`);
        }
        await populateSelectOptions(borrowerSelect, await getAvailableIds('borrowers', 'all'));
        borrowerDeletionInfo.textContent = `   Borrower with id ${borrowerId} has been successfully deleted.`;
    } catch (err) {
        console.log(err);
        borrowerDeletionInfo.textContent = `   Could not delete borrower with id ${borrowerId}. Such id could not be found in the database.`;
    }
}

async function deleteBook(bookId) {
    try {
        const response = await fetch(
            `${BASE_URL}/book/${bookId}`,
            { method: 'DELETE' }
        );
        const resJson = await response.json();
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${resJson.error}`);
        }
        await populateAllBookSelects();
        bookDeletionInfo.textContent = `   Book with id ${bookId} has been successfully deleted.`;
    } catch (err) {
        console.log(err);
        bookDeletionInfo.textContent = `   Could not delete book with id ${bookId}. Such id could not be found in the database.`;
    }
}

async function addBorrower(borrowerDto) {
    try {
        const response = await fetch(
            `${BASE_URL}/borrower`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(borrowerDto) }
        );
        const resJson = await response.json();
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${resJson.error}`);
        }
        await populateSelectOptions(borrowerSelect, await getAvailableIds('borrowers', 'all'));
    } catch (err) {
        console.log(err);
    }
}

async function addBook(bookDto) {
    try {
        const response = await fetch(
            `${BASE_URL}/book`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bookDto) }
        );
        const resJson = await response.json();
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${resJson.error}`);
        }
        await populateAllBookSelects();
    } catch (err) {
        console.log(err);
    }
}


async function populateSelectOptions(targetSelect, idList) {
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

async function populateAllBookSelects() {
    await populateSelectOptions(bookToBorrowSelect, await getAvailableIds('books', 1));
    await populateSelectOptions(bookToReturnSelect, await getAvailableIds('books', 0));
    await populateSelectOptions(bookToDeleteSelect, await getAvailableIds('books', 1));
}

async function populateBorrowerSearchResultsTable(results) {
    borrowersResultsTable.replaceChildren();
    borrowersResults.style.display = 'block';
    results.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.borrower_id}</td>
            <td>${row.owner}</td>
            <td>${row.total_borrowings}</td>
            <td>${row.book_id ?? ""}</td>
            <td>${row.book_title ?? ""}</td>
        `;
        borrowersResultsTable.appendChild(tr);
    });
}

async function populateBookSearchResultsTable(results) {
    booksResultsTable.replaceChildren();
    booksResults.style.display = 'block';
    results.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.book_id}</td>
            <td>${row.title}</td>
            <td>${row.author}</td>
            <td>${row.borrower_id ?? ""}</td>
            <td>${row.borrower_name ?? ""}</td>
        `;
        booksResultsTable.appendChild(tr);
    });
}