/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('post_tag', (table) => {
    table
      .integer('post_id')
      .notNullable()
      .references('post.id')
      .onUpdate('cascade')
      .onDelete('cascade');
    table
      .integer('tag_id')
      .notNullable()
      .references('tag.id')
      .onUpdate('cascade')
      .onDelete('cascade');
    table.primary(['post_id', 'tag_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('post_tag');
};
