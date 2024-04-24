/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('blog').del();
  await knex('blog').insert([
    {
      user_id: 'a007ec9f-5f75-419f-8369-5ab37d7e99e6',
      title: "Kashi754's Blog",
      description: "This is Kashi754's personal blog.",
    },
    {
      user_id: '2eec5b09-0cd6-436a-aeee-7933b0e26da7',
      title: "testUser1's Blog",
      description: "This is testUser1's personal blog.",
    },
    {
      user_id: 'df751170-1d53-46ca-89b6-b549fd62e0eb',
      title: "testUser2's Blog",
      description: "This is testUser2's personal blog.",
    },
  ]);
};
