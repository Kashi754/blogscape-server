/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('social_media', (table) => {
    table.increments('id');
    table
      .uuid('user_id', { primaryKey: false })
      .notNullable()
      .references('users.id')
      .onUpdate('cascade')
      .onDelete('cascade');
    table.string('facebook', 75).nullable();
    table.string('twitter', 75).nullable();
    table.string('instagram', 75).nullable();
    table.string('tiktok', 75).nullable();
    table.string('youtube', 75).nullable();
    table.string('github', 75).nullable();
    table.string('twitch', 75).nullable();
    table.string('discord', 75).nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('social_media');
};
