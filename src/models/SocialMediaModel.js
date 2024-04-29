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
}

module.exports = SocialMediaModel;
