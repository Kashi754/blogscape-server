const Model = require('./Model/Model');
const ImageModel = require('./ImageModel');
const knex = require('../database');
const { imageKit } = require('../config/imageKit');

const defaultBlogData = {};

class BlogModel extends Model {
  static tableName = 'blog';
  static materializedView = 'fts_blog';
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
    'fts_blog.image as image',
    'fts_blog.thumbnail as thumbnail',
    'fts_blog.file_id as file_id',
    'fts_blog.created_at as created_at',
    'fts_blog.followers as followers',
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
    this._userId = id;
    this.relations[0].join.andTo = id;
  }

  static get userId() {
    return this._userId;
  }

  static async create(data) {
    return await super.insert(null, {
      ...data,
      ...defaultBlogData,
    });
  }

  static ftsBlogJSON = knex.raw(`
    json_build_object(
      'id', fts_blog.id,
      'title', fts_blog.title,
      'description', fts_blog.description,
      'author', fts_blog.author,
      'image', fts_blog.image,
      'created_at', fts_blog.created_at,
      'followers', fts_blog.followers
    ) as blog
  `);

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

  static async findBy(userId, query, trx) {
    BlogModel.userId = userId;

    const result = await super.findBy(query, trx);

    return result;
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

    BlogModel.userId = userId;

    const resultOrder = {
      column: 'rank',
      direction: 'desc',
    };

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

    return await super.list(
      null,
      nextPage,
      limit,
      {
        columns: ['search'],
        query,
        searchProps: super.addSearchColumn(query),
      },
      null,
      resultOrder
    );
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
    return await super.list(null, nextPage, limit);
  }

  static async listPopular(userId, limit) {
    BlogModel.userId = userId;

    const resultOrder = {
      column: 'followers',
      direction: 'desc',
    };

    return await super.list(null, null, limit, null, resultOrder);
  }

  static async update(userId, data) {
    BlogModel.userId = userId;
    console.log(data);
    const results = await knex.transaction(async (trx) => {
      const imageToUpdate = {
        file_id: data.file_id,
        image: data.image,
        thumbnail: data.thumbnail,
      };

      // Get the old image_id from the database
      const { imageId: oldImageId, blogId } = await this.table
        .first('image_id', 'id as blog_id')
        .where('user_id', userId)
        .transacting(trx);

      console.log(oldImageId, data.file_id);

      // if the image_id's do not match then insert the image
      if (oldImageId !== data.file_id) {
        await ImageModel.insert(trx, imageToUpdate);
      }

      // Update the blog
      await super.update(
        trx,
        blogId,
        {
          title: data.title,
          description: data.description,
          image_id: data.file_id,
        },
        ['id']
      );

      if (oldImageId && oldImageId !== data.file_id) {
        // If the image_id's do not match then delete the old image from imagekit and the database
        imageKit.deleteFile(oldImageId, (error) => {
          if (error) {
            console.error('Error deleting image from imagekit', error);
          }
        });

        await ImageModel.delete(trx, oldImageId);
      }

      // return updated blog
      const blog = await this.findBy(
        userId,
        {
          column: 'id',
          operator: '=',
          value: blogId,
        },
        trx
      );
      return blog[0];
    });
    return results;
  }
}

module.exports = BlogModel;
