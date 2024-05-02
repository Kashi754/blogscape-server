/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const { convertToCamel } = require('./src/utilities');
const config = require('./src/config/environment');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.name,
    },
    pool: { min: 0, max: 7 },
    migrations: {
      directory: './src/database/data/migrations',
    },
    seeds: {
      directory: './src/database/data/seeds',
    },
    searchPath: ['public'],
    postProcessResponse: (result, queryContext) => {
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
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.name,
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
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.name,
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
