const Model = require('./Model/Model');
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
    'fts_post.id as id',
    'fts_post.title as title',
    'fts_post.subtitle as subtitle',
    'fts_post.plaintext_body as plaintext_body',
    'fts_post.body as body',
    'fts_post.author as author',
    'fts_post.image as image',
    'fts_post.thumbnail as thumbnail',
    'fts_post.file_id as file_id',
    'fts_post.created_at as created_at',
    'fts_post.tags as tags',
  ];
}
