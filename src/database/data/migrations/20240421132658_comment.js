/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('comment', (table) => {
    table.increments('id');
    table
      .integer('post_id')
      .notNullable()
      .references('post.id')
      .onUpdate('cascade')
      .onDelete('cascade');
    table
      .integer('comment_id')
      .nullable()
      .references('comment.id')
      .onUpdate('cascade')
      .onDelete('cascade');
    table
      .uuid('user_id', { primaryKey: false })
      .notNullable()
      .references('users.id')
      .onUpdate('cascade')
      .onDelete('cascade');
    table.string('body', 300).notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('comment');
};
