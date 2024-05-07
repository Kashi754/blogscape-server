/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const BLOG_VIEW_CONFIGURATION = `
  CREATE MATERIALIZED VIEW fts_blog
  AS
  SELECT blog.id as id,
    blog.title as title,
    blog.description as description,
    blog.user_id as user_id,
    users.display_name as author,
    users.id as author_id,
    image.image as image,
    image.thumbnail as thumbnail,
    image.file_id as file_id,
    blog.created_at as created_at,
    coalesce(blog_followers.followers, 0) as followers,
    setweight(to_tsvector('english', blog.title), 'A') ||
    setweight(to_tsvector('english', blog.description), 'B') ||
    setweight(to_tsvector('simple', users.display_name), 'A') AS search
  FROM blog
  JOIN users ON users.id = blog.user_id
  LEFT OUTER JOIN image ON image.file_id = blog.image_id
  LEFT OUTER JOIN
    (SELECT blog_id, COUNT(user_id) as followers
    FROM blog_following
    GROUP BY blog_id) AS blog_followers
  ON blog.id = blog_followers.blog_id;
`;

const BLOG_WORDS_VIEW_CONFIGURATION = `
  CREATE MATERIALIZED VIEW fts_blog_words
  AS
  SELECT word FROM ts_stat(
    'SELECT to_tsvector(''simple'', fd.title) ||
			to_tsvector(''simple'', fd.description) ||
			to_tsvector(''simple'', fd.author) as vect
	  FROM	fts_blog fd'
  );
`;

const REFRESH_BLOG_VIEW_FUNCTIONS = `
  CREATE OR REPLACE FUNCTION refresh_fts_blog()
  RETURNS TRIGGER AS $$
  BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY fts_blog;
    RETURN NULL;
  END
  $$ language plpgsql;

  CREATE OR REPLACE FUNCTION refresh_fts_blog_words()
  RETURNS TRIGGER AS $$
  BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY fts_blog_words;
    RETURN NULL;
  END
  $$ language plpgsql;
`;

const REFRESH_BLOG_VIEW_TRIGGERS = `
  CREATE OR REPLACE TRIGGER refresh_fts_blog_trigger
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON blog
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_fts_blog();

  CREATE OR REPLACE TRIGGER refresh_fts_blog_user_trigger
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON users
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_fts_blog();
  
  CREATE OR REPLACE TRIGGER refresh_fts_blog_following_trigger
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON blog_following
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_fts_blog();

  CREATE OR REPLACE TRIGGER refresh_fts_blog_image_trigger
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON image
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_fts_blog();

  CREATE OR REPLACE TRIGGER refresh_fts_blog_words_blog_trigger
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON blog
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_fts_blog_words();

  CREATE OR REPLACE TRIGGER refresh_fts_blog_words_user_trigger
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON users
  FOR EACH STATEMENT
  EXECUTE PROCEDURE refresh_fts_blog_words();
`;

const BLOG_VIEW_INDEXES = `
  CREATE INDEX idx_blog_fts_search ON fts_blog USING GIN (search);
  CREATE UNIQUE INDEX idx_blog_created_at_id ON fts_blog (created_at DESC, id DESC);
  CREATE INDEX idx_blog_words ON fts_blog_words USING GIN (word gin_trgm_ops);
  CREATE UNIQUE INDEX idx_blog_words_word ON fts_blog_words (word);
`;

const DROP_BLOG_VIEW = `
  DROP MATERIALIZED VIEW IF EXISTS fts_blog;
  DROP MATERIALIZED VIEW IF EXISTS fts_blog_words;
`;

const DROP_REFRESH_BLOG_VIEW_FUNCTION = `
  DROP FUNCTION IF EXISTS refresh_fts_blog();
  DROP FUNCTION IF EXISTS refresh_fts_blog_words();
`;

const DROP_BLOG_VIEW_TRIGGERS = `
  DROP TRIGGER IF EXISTS refresh_fts_blog_trigger ON blog;
  DROP TRIGGER IF EXISTS refresh_fts_blog_user_trigger ON users;
  DROP TRIGGER IF EXISTS refresh_fts_blog_following_trigger ON blog_following;
  DROP TRIGGER IF EXISTS refresh_fts_blog_image_trigger ON image;
  DROP TRIGGER IF EXISTS refresh_fts_blog_words_blog_trigger ON blog;
  DROP TRIGGER IF EXISTS refresh_fts_blog_words_user_trigger ON users;
`;

const DROP_BLOG_VIEW_INDEXES = `
  DROP INDEX IF EXISTS idx_blog_fts_search;
  DROP INDEX IF EXISTS idx_blog_created_at_id;
  DROP INDEX IF EXISTS idx_blog_words;
  DROP INDEX IF EXISTS idx_blog_words_word;
`;

exports.up = function (knex) {
  return knex.raw(
    BLOG_VIEW_CONFIGURATION +
      BLOG_WORDS_VIEW_CONFIGURATION +
      REFRESH_BLOG_VIEW_FUNCTIONS +
      REFRESH_BLOG_VIEW_TRIGGERS +
      BLOG_VIEW_INDEXES
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(
    DROP_BLOG_VIEW +
      DROP_BLOG_VIEW_INDEXES +
      DROP_BLOG_VIEW_TRIGGERS +
      DROP_REFRESH_BLOG_VIEW_FUNCTION
  );
};
