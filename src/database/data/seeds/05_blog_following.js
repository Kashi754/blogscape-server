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
      user_id: '2eec5b09-0cd6-436a-aeee-7933b0e26da7',
    },
    {
      blog_id: 1,
      user_id: '2eec5b09-0cd6-436a-aeee-7933b0e26da7',
    },
    {
      blog_id: 1,
      user_id: 'df751170-1d53-46ca-89b6-b549fd62e0eb',
    },
  ]);
};
