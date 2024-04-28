const Model = require('./Model/Model');
const knex = require('../database');

class BlogFollowersModel extends Model {
  static tableName = 'blog_following';
  static selectableProps = ['blog_id', 'user_id'];

  static countFollowers(as_alias) {
    return this.table
      .select('blog_id')
      .count(`user_id as ${as_alias}`)
      .from('blog_following')
      .groupBy('blog_id')
      .as('blog_followers');
  }
}

module.exports = BlogFollowersModel;
