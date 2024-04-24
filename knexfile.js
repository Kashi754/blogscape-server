/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

require('dotenv').config();
const { convertToCamel } = require('./src/utilities');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    pool: { min: 0, max: 7 },
    migrations: {
      directory: './src/database/data/migrations',
    },
    seeds: {
      directory: './src/database/data/seeds',
    },
    searchPath: ['public'],
    postProcessResponse: (result) => {
      // TODO: add special case for raw results
      if (Array.isArray(result)) {
        return result.map((object) => convertToCamel(object));
      } else {
        return convertToCamel(result);
      }
    },
  },

  testing: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    pool: { min: 0, max: 7 },
    migrations: {
      directory: './src/database/data/migrations',
    },
    seeds: {
      directory: './src/database/data/seeds',
    },
    searchPath: ['public'],
    postProcessResponse: (result) => {
      // TODO: add special case for raw results
      if (Array.isArray(result)) {
        return result.map((object) => convertToCamel(object));
      } else {
        return convertToCamel(result);
      }
    },
  },

  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    pool: { min: 0, max: 7 },
    migrations: {
      directory: './src/database/data/migrations',
    },
    seeds: {
      directory: './src/database/data/seeds',
    },
    searchPath: ['public'],
    postProcessResponse: (result) => {
      // TODO: add special case for raw results
      if (Array.isArray(result)) {
        return result.map((object) => convertToCamel(object));
      } else {
        return convertToCamel(result);
      }
    },
  },

  onInsertTrigger: (table) => `
    CREATE TRIGGER ${table}_on_insert_username
    BEFORE INSERT ON ${table}
    FOR EACH ROW
    WHEN (NEW.username IS NOT NULL)
    EXECUTE PROCEDURE on_insert_username();
  `,
};
