/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const ON_INSERT_USERNAME_FUNCTION = `
  CREATE OR REPLACE FUNCTION on_insert_username()
  RETURNS trigger AS $$
  BEGIN
    IF NEW.display_name IS NULL THEN
      NEW.display_name = NEW.username;
    END IF;
    RETURN NEW;
  END
  $$ language plpgsql;
`;

const DROP_ON_INSERT_USERNAME_FUNCTION = `DROP FUNCTION IF EXISTS on_insert_username();`;

exports.up = function (knex) {
  return knex.raw(ON_INSERT_USERNAME_FUNCTION);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(DROP_ON_INSERT_USERNAME_FUNCTION);
};
