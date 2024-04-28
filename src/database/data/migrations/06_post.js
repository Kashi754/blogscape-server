/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('post', (table) => {
    table.increments('id');
    table
      .integer('blog_id')
      .notNullable()
      .references('blog.id')
      .onUpdate('cascade')
      .onDelete('cascade');
    table.string('title', 100).notNullable();
    table.string('subtitle', 300).nullable();
    table.text('plaintext_body').notNullable();
    table.text('body').notNullable();
    table
      .string('image_id', 50)
      .nullable()
      .unique()
      .references('image.file_id')
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
  return knex.schema.dropTableIfExists('post');
};
