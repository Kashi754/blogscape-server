/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const { onInsertTrigger } = require('../../../../knexfile');

exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.uuid('id', { primaryKey: true }).unique().defaultTo(knex.fn.uuid());
      table.string('username', 30).notNullable().unique();
      table.string('email', 254).notNullable().unique();
      table.string('password_hash', 60).notNullable();
      table.string('oauth_id', 30).nullable().unique();
      table.string('display_name', 30).nullable();
      table.string('website', 254).nullable();
      table
        .string('image_id', 50)
        .nullable()
        .unique()
        .references('image.file_id')
        .onUpdate('cascade')
        .onDelete('set null');
      table.string('location', 56).nullable();
      table.specificType('location_code', 'CHAR(2)').nullable();
    })
    .then(() => knex.raw(onInsertTrigger('users')));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
