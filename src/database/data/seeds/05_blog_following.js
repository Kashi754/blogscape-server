const { userIds } = require('../seedUtilities/genUUID');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('blog_following').del();
  await knex('blog_following').insert([
    {
      blog_id: 2,
      user_id: 'a007ec9f-5f75-419f-8369-5ab37d7e99e6',
    },
    {
      blog_id: 3,
      user_id: 'a007ec9f-5f75-419f-8369-5ab37d7e99e6',
    },
    {
      blog_id: 3,
      user_id: userIds[0],
    },
    {
      blog_id: 1,
      user_id: userIds[0],
    },
    {
      blog_id: 1,
      user_id: userIds[1],
    },
  ]);
};
