const { userIds } = require('../seedUtilities/genUUID');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  const users = userIds.map((id, index) => ({
    id,
    username: `testUser${index}`,
    email: `user${index}@gmail.com`,
    password_hash:
      '$2b$10$LYFpAAkIYDCY1UYFMSa5hOBge8NvwoDp/rtqGv3seHIe1hbPME6P2',
    display_name: `Test User ${index}`,
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
        '$2b$10$LYFpAAkIYDCY1UYFMSa5hOBge8NvwoDp/rtqGv3seHIe1hbPME6P2',
    },
    ...users,
  ]);
};
