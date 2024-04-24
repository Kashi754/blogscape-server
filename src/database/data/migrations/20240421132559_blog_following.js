/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('blog_following', (table) => {
    table
      .integer('blog_id')
      .notNullable()
      .references('blog.id')
      .onUpdate('cascade')
      .onDelete('cascade');
    table
      .uuid('user_id')
      .notNullable()
      .references('users.id')
      .onUpdate('cascade')
      .onDelete('cascade');
    table.primary(['blog_id', 'user_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('blog_following');
};
