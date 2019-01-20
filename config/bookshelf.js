const knex = require('knex')(require('./dbConfig'));
const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;