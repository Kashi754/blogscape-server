const { userIds } = require('../seedUtilities/genUUID');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('comment').del();
  await knex('comment').insert([
    // Post 1 comments
    {
      post_id: 1,
      user_id: userIds[0],
      body: 'Wow, this is amazing!',
    },
    {
      post_id: 1,
      comment_id: 1,
      user_id: 'a007ec9f-5f75-419f-8369-5ab37d7e99e6',
      body: 'Thank you for sharing!',
    },
    {
      post_id: 1,
      user_id: userIds[1],
      body: 'I hate it!',
    },
    {
      post_id: 1,
      comment_id: 3,
      user_id: 'a007ec9f-5f75-419f-8369-5ab37d7e99e6',
      body: 'Why do you hate me!',
    },
    {
      post_id: 1,
      comment_id: 4,
      user_id: userIds[1],
      body: "Because it's just lorem ipsum!",
    },
    {
      post_id: 2,
      user_id: 'a007ec9f-5f75-419f-8369-5ab37d7e99e6',
      body: 'Wow, this is amazing!',
    },
  ]);
};
