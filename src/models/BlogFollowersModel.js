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

  static async followBlog(userId, blogIds) {
    const response = await knex.transaction(async (trx) => {
      const blogs = await knex('blog')
        .whereIn('id', blogIds)
        .transacting(trx)
        .select('id');

      if (blogs.length !== blogIds.length) {
        const error = new Error('One or more blogs not found');
        error.status = 404;
        throw error;
      }

      return await super.insert(
        trx,
        blogIds.map((id) => ({ blog_id: id, user_id: userId })),
        'blog_id'
      );
    });
    return response;
  }

  static async unFollowBlog(userId, blogIds) {
    return await super.delete(null, [
      {
        column: 'blog_id',
        operator: 'in',
        value: blogIds,
      },
      {
        column: 'user_id',
        operator: '=',
        value: userId,
      },
    ]);
  }
}

module.exports = BlogFollowersModel;
