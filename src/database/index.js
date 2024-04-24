const knexFile = require('../../knexfile');

const env = process.env.NODE_ENV || 'development';
const configOptions = knexFile[env];

const knex = require('knex')(configOptions);

module.exports = knex;
