const Model = require('./Model');
const FollowersModel = require('./BlogFollowersModel');
const knex = require('../database');

const defaultBlogData = {};

class BlogModel extends Model {
  static tableName = 'blog';
  static resultLimit = 10;
  static resultOrder = [
    {
      column: 'blog.created_at',
      direction: 'desc',
    },
    {
      column: 'blog.id',
      direction: 'desc',
    },
  ];
  static selectableProps = [
    'blog.id as id',
    'blog.title as title',
    'blog.description as description',
    'users.display_name as author',
    'blog.image_id as image_id',
    'blog.created_at as created_at',
    'followers',
    knex.raw(
      `
        CASE
          WHEN blog_following.user_id IS NULL THEN false
          ELSE true
        END as following
      `
    ),
  ];
  static relations = [
    {
      modelClass: 'users',
      join: {
        type: 'join',
        from: 'blog.user_id',
        to: 'users.id',
      },
    },
    {
      modelClass: FollowersModel.countFollowers,
      join: {
        type: 'leftOuter',
        from: 'blog.id',
        to: 'blog_followers.blog_id',
      },
    },
    {
      modelClass: 'blog_following',
      join: {
        type: 'leftOuter',
        from: 'blog.id',
        to: 'blog_following.blog_id',
        andFrom: 'blog_following.user_id',
        andTo: this.userId,
      },
    },
  ];

  static set userId(id) {
    this.relations[2].join.andTo = id;
  }

  static get userId() {
    return this._userId;
  }

  static async create(data) {
    return await super.insert({
      ...data,
      ...defaultBlogData,
    });
  }

  static async search(searchParams, userId) {
    const blogs = await super.transaction(async (trx) => {
      // Initialize the query

      const queryBuilder = super.table
        .limit(10)
        .orderBy('created_at', 'desc')
        .orderBy('id', 'desc');

      // Add the search terms
      if (searchParams) {
        console.log(searchParams);
        const whereBuilder = (builder, param) =>
          builder
            .whereILike('title', `%${param}%`)
            .orWhereILike('description', `%${param}%`);

        for (let i = 0; i < searchParams.length; i++) {
          const param = searchParams[i];
          if (i === 0) {
            queryBuilder.where((builder) => whereBuilder(builder, param));
          } else {
            queryBuilder.orWhere((builder) => whereBuilder(builder, param));
          }
        }
      }

      const blogFollowerCount = knex
        .select('blog_id')
        .count('user_id as followers')
        .from('blog_following')
        .groupBy('blog_id')
        .as('blog_followers');

      // Order the results and select the required fields
      const result = await queryBuilder
        .limit(10)
        .join('users', 'blog.user_id', 'users.id')
        .leftJoin(blogFollowerCount, 'blog_followers.blog_id', 'blog.id')
        .orderBy('created_at', 'desc')
        .orderBy('id', 'desc')
        .select(
          'blog.id as id',
          'blog.title as title',
          'blog.description as description',
          'users.display_name as author',
          'blog.image_id as image_id',
          'blog.created_at as created_at',
          'followers'
        )
        .transacting(trx);

      // Check if the user is following the blog
      for (let blog of result) {
        const following = await knex('blog_following')
          .where('blog_id', blog.id)
          .andWhere('user_id', userId)
          .first()
          .transacting(trx);

        blog.following = following ? true : false;
      }

      return result;
    });

    // Return the results
    return blogs;
  }

  static async list(userId, nextPage = null) {
    BlogModel.userId = userId;
    return await super.list(nextPage);
  }
}

module.exports = BlogModel;
