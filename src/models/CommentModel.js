const Builder = require('./Model/Builder');
const Model = require('./Model/Model');
const knex = require('../database');
const UsersModel = require('./UsersModel');

class CommentModel extends Model {
  static tableName = 'comment';
  static resultLimit = 20;
  static resultOrder = [
    {
      column: 'created_at',
      direction: 'desc',
    },
    {
      column: 'comment.id',
      direction: 'desc',
    },
  ];

  static selectableProps = [
    'comment.id as id',
    'comment.post_id as post_id',
    'comment.comment_id as comment_id',
    UsersModel.userCommentJSON,
    'comment.body as body',
    'comment.created_at as created_at',
    'replies.reply_count',
  ];

  static relations = [
    {
      modelClass: 'users',
      join: {
        type: 'join',
        from: 'users.id',
        to: 'comment.user_id',
      },
    },
    {
      modelClass: 'image',
      join: {
        type: 'leftOuter',
        from: 'image.file_id',
        to: 'users.image_id',
      },
    },
    {
      modelClass: CommentModel.countReplies('reply_count'),
      join: {
        type: 'leftOuter',
        from: 'comment.id',
        to: 'replies.id',
      },
    },
  ];

  static countReplies(as_alias) {
    return this.table
      .select('id')
      .count(`comment_id as ${as_alias}`)
      .from('comment')
      .groupBy('id')
      .as('replies');
  }

  static async create(data) {
    const results = await knex.transaction(async (trx) => {
      const postId = await super.insert(trx, data, ['id']);

      const newComment = await super.findBy(
        {
          column: 'comment.id',
          operator: '=',
          value: postId[0].id,
        },
        trx
      );

      return newComment[0];
    });
    return results;
  }

  static async list(
    postId,
    commentId,
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
        column: 'comment.id',
        value: beforeId,
      },
    ];

    const list = await knex.transaction(async (trx) => {
      const queryBuilder = this.view
        .transacting(trx)
        .modify(Builder.nextPage, nextPage)
        .modify(Builder.orderBy, this.resultOrder)
        .limit(limit || this.resultLimit)
        .modify(Builder.where, {
          column: 'post_id',
          operator: '=',
          value: postId,
        });

      if (commentId) {
        queryBuilder.modify(Builder.where, {
          column: 'comment_id',
          operator: '=',
          value: commentId,
        });
      } else {
        queryBuilder.whereNull('comment_id');
      }

      for (const relation of this.relations) {
        queryBuilder.modify(Builder.join, relation);
      }

      return await queryBuilder.select(this.selectableProps);
    });

    return list;
  }
}

module.exports = CommentModel;
