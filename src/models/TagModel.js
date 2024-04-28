const Model = require('./Model/Model');
const knex = require('../database');

class TagModel extends Model {
  static getPostTags(postId) {
    return knex.raw(`
      array(
        SELECT
          tag.name
        FROM tag
        INNER JOIN post_tag
        ON post_tag.tag_id = tag.id
        WHERE
          post_tag.post_id = ${postId}
      ) as tags
    `);
  }
}
