/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('tag').del();
  await knex('tag').insert([
    { name: '#javascript' },
    { name: '#coding' },
    { name: '#react' },
    { name: '#expressjs' },
    { name: '#codecademy' },
    { name: '#html' },
  ]);
};
