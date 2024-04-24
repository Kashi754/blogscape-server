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
      user_id: '2eec5b09-0cd6-436a-aeee-7933b0e26da7',
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
      user_id: 'df751170-1d53-46ca-89b6-b549fd62e0eb',
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
      user_id: 'df751170-1d53-46ca-89b6-b549fd62e0eb',
      body: "Because it's just lorem ipsum!",
    },
    {
      post_id: 2,
      user_id: 'a007ec9f-5f75-419f-8369-5ab37d7e99e6',
      body: 'Wow, this is amazing!',
    },
  ]);
};
