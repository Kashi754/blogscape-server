const knex = require('../database');
const Model = require('./Model/Model');

class SocialMediaModel extends Model {
  static tableName = 'social_media';
  static ResultLimit = 1;
  static resultOrder = [
    {
      column: 'id',
      direction: 'asc',
    },
  ];

  static selectableProps = [
    'id',
    'user_id',
    'facebook',
    'twitter',
    'instagram',
    'tiktok',
    'youtube',
    'github',
    'twitch',
    'discord',
  ];

  static socialMediaJSON = knex.raw(`
    json_build_object(
      'facebook', social_media.facebook,
      'twitter', social_media.twitter,
      'instagram', social_media.instagram,
      'tiktok', social_media.tiktok,
      'youtube', social_media.youtube,
      'github', social_media.github,
      'twitch', social_media.twitch,
      'discord', social_media.discord
    ) as social_media
  `);
}

module.exports = SocialMediaModel;
