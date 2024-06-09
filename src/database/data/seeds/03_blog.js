const { userIds } = require('../seedUtilities/genUUID');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  const blogs = userIds.map((id, index) => ({
    user_id: id,
    title: `testUser${index + 1}'s Blog`,
    description: `This is testUser${index + 1}'s personal blog.`,
  }));

  // Deletes ALL existing entries
  await knex('blog').del();
  await knex('blog').insert({
    user_id: 'a007ec9f-5f75-419f-8369-5ab37d7e99e6',
    title: "Kashi754's Blog",
    description: "This is Kashi754's personal blog.",
  });
  for (const blog of blogs) {
    await new Promise((resolve) => setTimeout(resolve, 1));
    await knex('blog').insert(blog);
  }
};
