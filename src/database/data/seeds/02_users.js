const { userIds } = require('../seedUtilities/genUUID');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  const users = userIds.map((id, index) => ({
    id,
    username: `testUser${index + 1}`,
    email: `user${index}@gmail.com`,
    password_hash:
      '$2b$10$1f79CZZn12k1fZ.zdsH01ONQHCLPNleXrizplFmvdPAFDlj8fuPHm',
    display_name: `Test User ${index + 1}`,
    website: 'https://www.kashi754.com',
    location: 'United States',
    location_code: 'US',
  }));

  // Deletes ALL existing entries
  await knex('users').del();
  await knex('users').insert([
    {
      id: 'a007ec9f-5f75-419f-8369-5ab37d7e99e6',
      username: 'kashi754',
      email: 'arigorn15@gmail.com',
      password_hash:
        '$2b$10$1f79CZZn12k1fZ.zdsH01ONQHCLPNleXrizplFmvdPAFDlj8fuPHm',
    },
    ...users,
  ]);
};
