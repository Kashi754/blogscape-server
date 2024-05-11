/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const POST_VIEW_CONFIGURATION = `
  CREATE MATERIALIZED VIEW fts_post
  AS
  SELECT
    authors.author as author,
    authors.id as author_id,
    authors.thumbnail as author_thumbnail,
    post.id as id,
    blog.id as blog_id,
    blog.title as blog_title,
    post.title as title,
    post.subtitle as subtitle,
    post.plaintext_body as plaintext_body,
    post.body as body,
    image.image as image,
    image.thumbnail as thumbnail,
    image.file_id as file_id,
    post.created_at as created_at,
    array(
      SELECT tag.name
      FROM tag
      JOIN post_tag ON post_tag.tag_id = tag.id
      WHERE post_tag.post_id = post.id
    ) as tags,
    setweight(to_tsvector('english', post.title), 'B') ||
    setweight(to_tsvector('english', post.plaintext_body), 'C') ||
    setweight(to_tsvector('simple', authors.author), 'A') ||
    setweight(to_tsvector('simple', array_to_string((
      SELECT array(
        SELECT tag.name
        FROM tag
        JOIN post_tag ON post_tag.tag_id = tag.id
        WHERE post_tag.post_id = post.id
      )
    ), ' ')), 'A') AS search
  FROM post
  JOIN blog ON blog.id = post.blog_id
  JOIN 
    (
      SELECT 
        users.id as id,
        users.display_name as author,
        image.thumbnail as thumbnail
      FROM users
      LEFT OUTER JOIN image ON image.file_id = users.image_id
    ) as authors 
  ON authors.id = blog.user_id
  LEFT OUTER JOIN image ON image.file_id = post.image_id;
`;

const POST_WORDS_VIEW_CONFIGURATION = `
  CREATE MATERIALIZED VIEW fts_post_words
  AS
  SELECT word FROM ts_stat(
      'SELECT to_tsvector(''simple'', fp.title) ||
              to_tsvector(''simple'', fp.plaintext_body) ||
              to_tsvector(''simple'', fp.author) ||
              to_tsvector(''simple'', array_to_string(fp.tags, '' '')) as vect
      FROM	fts_post fp'
  );
`;

const REFRESH_POST_VIEW_FUNCTIONS = `
  CREATE OR REPLACE FUNCTION refresh_fts_post()
  RETURNS TRIGGER AS $$
  BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY fts_post;
    RETURN NULL;
  END
  $$ language plpgsql;

  CREATE OR REPLACE FUNCTION refresh_fts_post_words()
  RETURNS TRIGGER AS $$
  BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY fts_post_words;
    RETURN NULL;
  END
  $$ language plpgsql;
`;

const REFRESH_POST_VIEW_TRIGGERS = `
  CREATE OR REPLACE TRIGGER refresh_fts_post_trigger
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON post
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_fts_post();

  CREATE OR REPLACE TRIGGER refresh_fts_post_user_trigger
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON users
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_fts_post();

  CREATE OR REPLACE TRIGGER refresh_fts_post_tag_trigger
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON post_tag
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_fts_post();
  
  CREATE OR REPLACE TRIGGER refresh_fts_tag_trigger
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON tag
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_fts_post();

  CREATE OR REPLACE TRIGGER refresh_fts_post_image_trigger
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON image
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_fts_post();

  CREATE OR REPLACE TRIGGER refresh_fts_post_words_post_trigger
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON post
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_fts_post_words();

  CREATE OR REPLACE TRIGGER refresh_fts_post_words_user_trigger
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON users
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_fts_post_words();

  CREATE OR REPLACE TRIGGER refresh_fts_post_words_post_tag_trigger
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON post_tag
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_fts_post_words();
  
  CREATE OR REPLACE TRIGGER refresh_fts_post_words_tag_trigger
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON tag
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_fts_post_words();
`;

const POST_VIEW_INDEXES = `
  CREATE INDEX idx_post_fts_search ON fts_post USING GIN (search);
  CREATE UNIQUE INDEX idx_post_created_at_id ON fts_post (created_at DESC, id DESC);
  CREATE INDEX idx_post_words ON fts_post_words USING GIN (word gin_trgm_ops);
  CREATE UNIQUE INDEX idx_post_words_word ON fts_post_words (word);
`;

const DROP_POST_VIEW = `
  DROP MATERIALIZED VIEW IF EXISTS fts_post;
  DROP MATERIALIZED VIEW IF EXISTS fts_post_words;
`;

const DROP_REFRESH_POST_VIEW_FUNCTION = `
  DROP FUNCTION IF EXISTS refresh_fts_post();
  DROP FUNCTION IF EXISTS refresh_fts_post_words();
`;

const DROP_POST_VIEW_TRIGGERS = `
  DROP TRIGGER IF EXISTS refresh_fts_post_trigger ON post;
  DROP TRIGGER IF EXISTS refresh_fts_post_user_trigger ON users;
  DROP TRIGGER IF EXISTS refresh_fts_post_tag_trigger ON post_tag;
  DROP TRIGGER IF EXISTS refresh_fts_tag_trigger ON tag;
  DROP TRIGGER IF EXISTS refresh_fts_post_image_trigger ON image;
  DROP TRIGGER IF EXISTS refresh_fts_post_words_post_trigger ON post;
  DROP TRIGGER IF EXISTS refresh_fts_post_words_user_trigger ON users;
  DROP TRIGGER IF EXISTS refresh_fts_post_words_post_tag_trigger ON post_tag;
  DROP TRIGGER IF EXISTS refresh_fts_post_words_tag_trigger ON tag;
`;

const DROP_POST_VIEW_INDEXES = `
  DROP INDEX IF EXISTS idx_post_fts_search;
  DROP INDEX IF EXISTS idx_post_created_at_id;
  DROP INDEX IF EXISTS idx_post_words;
  DROP INDEX IF EXISTS idx_post_words_word;
`;

exports.up = function (knex) {
  return knex.raw(
    POST_VIEW_CONFIGURATION +
      POST_WORDS_VIEW_CONFIGURATION +
      REFRESH_POST_VIEW_FUNCTIONS +
      REFRESH_POST_VIEW_TRIGGERS +
      POST_VIEW_INDEXES
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(
    DROP_POST_VIEW +
      DROP_POST_VIEW_INDEXES +
      DROP_POST_VIEW_TRIGGERS +
      DROP_REFRESH_POST_VIEW_FUNCTION
  );
};
