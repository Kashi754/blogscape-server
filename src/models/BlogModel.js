const Model = require('./Model/Model');
const FollowersModel = require('./BlogFollowersModel');
const knex = require('../database');

const defaultBlogData = {};

class BlogModel extends Model {
  static tableName = 'fts_blog';
  static resultLimit = 10;
  static resultOrder = [
    {
      column: 'fts_blog.created_at',
      direction: 'desc',
    },
    {
      column: 'fts_blog.id',
      direction: 'desc',
    },
  ];
  static selectableProps = [
    'fts_blog.id as id',
    'fts_blog.title as title',
    'fts_blog.description as description',
    'fts_blog.author as author',
    'fts_blog.image_id as image_id',
    'fts_blog.created_at as created_at',
    'blog_followers.followers',
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
      modelClass: FollowersModel.countFollowers('followers'),
      join: {
        type: 'leftOuter',
        from: 'fts_blog.id',
        to: 'blog_followers.blog_id',
      },
    },
    {
      modelClass: 'blog_following',
      join: {
        type: 'leftOuter',
        from: 'fts_blog.id',
        to: 'blog_following.blog_id',
        andFrom: 'blog_following.user_id',
        andTo: this.userId,
      },
    },
  ];

  static set userId(id) {
    this.relations[1].join.andTo = id;
  }

  static get userId() {
    return this._userId;
  }

  static addSearchColumn(query) {
    return knex.raw(
      `
      ts_rank_cd(search, websearch_to_tsquery(:query)) +
      ts_rank_cd(search, websearch_to_tsquery('simple',:query)) +
      ts_rank_cd(search, websearch_to_tsquery('english',:query))
      AS rank
    `,
      { query: query }
    );
  }

  static async create(data) {
    return await super.insert({
      ...data,
      ...defaultBlogData,
    });
  }

  static async getSuggestions(searchParams) {
    if (!searchParams) {
      throw new Error('Search params not defined!');
    }
    return await knex.transaction(async (trx) => {
      return await knex('fts_blog_words as v')
        .transacting(trx)
        .whereRaw('v.word % :query', { query: searchParams })
        .orderByRaw('v.word <-> :query', { query: searchParams })
        .select([
          'v.word as word',
          knex.raw(`similarity(v.word, :query) AS similarity`, {
            query: searchParams,
          }),
        ]);
    });
  }

  static async search(
    userId,
    query,
    beforeRank = '999999999',
    beforeId = '999999999',
    limit
  ) {
    if (!query) {
      throw new Error('Query not defined!');
    }

    console.log('limit', limit);
    console.log('beforeRank', beforeRank);
    console.log('beforeId', beforeId);

    BlogModel.resultOrder[0].column = 'rank';
    BlogModel.userId = userId;

    const nextPage = [
      {
        column: knex.raw(
          `
          ts_rank_cd(search, websearch_to_tsquery(:query)) +
          ts_rank_cd(search, websearch_to_tsquery('simple',:query)) +
          ts_rank_cd(search, websearch_to_tsquery('english',:query))
        `,
          { query: query }
        ),
        value: beforeRank,
      },
      {
        column: 'fts_blog.id',
        value: beforeId,
      },
    ];

    return await super.list(nextPage, limit, {
      columns: ['search'],
      query,
      searchProps: this.addSearchColumn(query),
    });
  }

  static async list(
    userId,
    beforeDate = 'infinity',
    beforeId = '999999999',
    limit
  ) {
    BlogModel.userId = userId;
    const nextPage = [
      {
        column: 'created_at',
        value: beforeDate,
      },
      {
        column: 'fts_blog.id',
        value: beforeId,
      },
    ];
    return await super.list(nextPage, limit);
  }
}

module.exports = BlogModel;
