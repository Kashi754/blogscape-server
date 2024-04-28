/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('blog', (table) => {
    table.increments('id');
    table
      .uuid('user_id', { primaryKey: false })
      .notNullable()
      .references('users.id')
      .onUpdate('cascade')
      .onDelete('cascade');
    table.string('title', 100).notNullable();
    table.string('description', 300).notNullable();
    table
      .string('image_id', 50)
      .nullable()
      .unique()
      .references('image.id')
      .onUpdate('cascade')
      .onDelete('set null');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('blog');
};
