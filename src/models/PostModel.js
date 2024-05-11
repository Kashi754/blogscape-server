const Model = require('./Model/Model');
const ImageModel = require('./ImageModel');
const PostTagModel = require('./PostTagModel');
const knex = require('../database');
const { imageKit } = require('../config/imageKit');

const defaultPostData = {};

class PostModel extends Model {
  static tableName = 'post';
  static materializedView = 'fts_post';
  static resultLimit = 10;
  static resultOrder = [
    {
      column: 'fts_post.created_at',
      direction: 'desc',
    },
    {
      column: 'fts_post.id',
      direction: 'desc',
    },
  ];

  static selectableProps = [
    'author',
    'author_id',
    'author_thumbnail',
    'blog_id',
    'blog_title',
    'id',
    'title',
    'subtitle',
    'body',
    'image',
    'thumbnail',
    'file_id',
    'created_at',
    'tags',
    this.countComments('comment_count'),
  ];

  static countComments(as_alias) {
    const query = this.table
      .count('*')
      .from('comment')
      .whereRaw('comment.post_id = fts_post.id')
      .as(as_alias);

    return query;
  }

  static async create(loggedInBlogId, data) {
    const results = await knex.transaction(async (trx) => {
      if (data.file_id) {
        const imageToUpdate = {
          file_id: data.file_id,
          image: data.image,
          thumbnail: data.thumbnail,
        };
        await ImageModel.insert(trx, imageToUpdate);
      }

      const postIdResult = await super.insert(
        trx,
        {
          ...defaultPostData,
          title: data.title,
          subtitle: data.subtitle,
          plaintext_body: data.plaintextBody,
          body: data.body,
          image_id: data.file_id,
          blog_id: loggedInBlogId,
        },
        ['id']
      );

      const postId = postIdResult[0].id;

      await PostTagModel.insert(trx, postId, data.tags);

      const newPost = await super.findBy(
        {
          column: 'id',
          value: postId,
          operator: '=',
        },
        trx
      );

      return newPost[0];
    });

    return results;
  }

  static async getSuggestions(searchParams) {
    if (!searchParams) {
      throw new Error('Search params not defined!');
    }
    return await knex.transaction(async (trx) => {
      return await knex('fts_post_words as v')
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
    query,
    beforeRank = '999999999',
    beforeId = '999999999',
    limit
  ) {
    if (!query) {
      throw new Error('Query not defined!');
    }

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
        column: 'fts_post.id',
        value: beforeId,
      },
    ];

    return await super.list(null, nextPage, limit, {
      columns: ['search'],
      query,
      searchProps: super.addSearchColumn(query),
    });
  }

  static async list(
    blogId,
    beforeDate = 'infinity',
    beforeId = '999999999',
    limit
  ) {
    const nextPage = [
      {
        column: 'created_at',
        value: beforeDate,
      },
      {
        column: 'fts_post.id',
        value: beforeId,
      },
    ];

    return await super.list(
      blogId ? { column: 'blog_id', operator: '=', value: blogId } : null,
      nextPage,
      limit
    );
  }

  static async update(loggedInBlogId, postId, data) {
    const results = await knex.transaction(async (trx) => {
      const imageToUpdate = {
        file_id: data.fileId,
        image: data.image,
        thumbnail: data.thumbnail,
      };

      const { imageId: oldImageId, blogId } = await this.table
        .first('image_id', 'blog_id as blog_id')
        .where('id', postId)
        .transacting(trx);

      if (blogId !== loggedInBlogId) {
        const error = new Error('You are not authorized to update this post');
        error.status = 401;
        throw error;
      }

      if (oldImageId !== data.fileId) {
        await ImageModel.insert(trx, imageToUpdate);
      }

      await PostTagModel.update(trx, postId, data.tags);

      await super.update(
        trx,
        postId,
        {
          title: data.title,
          subtitle: data.subtitle,
          plaintext_body: data.plaintextBody,
          body: data.body,
          image_id: data.fileId,
        },
        ['id']
      );

      if (oldImageId && oldImageId !== data.fileId) {
        // If the image_id's do not match then delete the old image from imagekit and the database
        imageKit.deleteFile(oldImageId, (error) => {
          if (error) {
            console.error('Error deleting image from imagekit', error);
          }
        });

        await ImageModel.delete(trx, oldImageId);
      }

      const updatedPost = await super.findBy(
        {
          column: 'id',
          operator: '=',
          value: postId,
        },
        trx
      );

      return updatedPost[0];
    });

    return results;
  }
}

module.exports = PostModel;
