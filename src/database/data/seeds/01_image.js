/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('image').del();
  await knex('image').insert([
    {
      file_id: '66507ddb37b244ef54240d46',
      image:
        'https://ik.imagekit.io/blogscape/posts/cGp8OiRznvusZ3ihxM091_QyT0HGx47.jpeg?updatedAt=1716551132084',
      thumbnail:
        'https://ik.imagekit.io/blogscape/posts/cGp8OiRznvusZ3ihxM091_QyT0HGx47.jpeg?updatedAt=1716551132084',
    },
  ]);
};
