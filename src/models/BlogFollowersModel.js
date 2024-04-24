const Model = require('./Model');
const knex = require('../database');

class BlogFollowersModel extends Model {
  static tableName = 'blog_following';
  static selectableProps = ['blog_id', 'user_id'];

  static countFollowers() {
    this.select('blog_id')
      .count('user_id as followers')
      .from('blog_following')
      .groupBy('blog_id')
      .as('blog_followers');
  }
}

module.exports = BlogFollowersModel;
