//imports
const express = require('express');
const path = require('path');
const { Temporal } = require('@js-temporal/polyfill');

//constants
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'persistence', 'library.db');
const HOST_NAME = 'localhost';

//instances
const db = require(DB_PATH);
const app = express();

app.use(express.json());

//endpoints


app.use((req, res) => {
    res.status(404).send('<h1>404: Nie znaleziono strony</h1>');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${HOST_NAME}:${POTR}/`);
});