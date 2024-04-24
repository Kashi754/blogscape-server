/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('users').insert([
    {
      id: 'a007ec9f-5f75-419f-8369-5ab37d7e99e6',
      username: 'kashi754',
      email: 'arigorn15@gmail.com',
      password_hash:
        '$2b$10$JDjrJpbntlkKAdv4Mo4Zu.VwGAxO42VsM4cYy9d/31b0ftothXjFC',
    },
    {
      id: '2eec5b09-0cd6-436a-aeee-7933b0e26da7',
      username: 'testUser1',
      email: 'testUser1@gmail.com',
      password_hash:
        '$2b$10$JDjrJpbntlkKAdv4Mo4Zu.VwGAxO42VsM4cYy9d/31b0ftothXjFC',
      display_name: 'Test User 1',
      website: 'https://www.kashi754.com',
      location: 'United States',
      location_code: 'US',
    },
    {
      id: 'df751170-1d53-46ca-89b6-b549fd62e0eb',
      username: 'testUser2',
      email: 'testUser2@gmail.com',
      password_hash:
        '$2b$10$JDjrJpbntlkKAdv4Mo4Zu.VwGAxO42VsM4cYy9d/31b0ftothXjFC',
      display_name: 'Test User 2',
      website: 'https://petersen-homelab.net',
      location: 'France',
      location_code: 'FR',
    },
  ]);
};
