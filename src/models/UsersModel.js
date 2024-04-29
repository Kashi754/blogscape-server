const knex = require('../database');
const ImageModel = require('./ImageModel');
const Model = require('./Model/Model');

class UsersModel extends Model {
  static tableName = 'users';
  static resultLimit = 10;
  static resultOrder = [
    {
      column: 'display_name',
      direction: 'asc',
    },
    {
      column: 'users.id',
      direction: 'asc',
    },
  ];

  static selectableProps = [
    'users.id as id',
    'users.display_name as display_name',
    'users.username as user_name',
    'users.email as email',
    'users.website as website',
    'users.location as location',
    'users.location_code as location_code',
    'image.file_id as fileId',
    'image.image as image',
    'image.thumbnail as thumbnail',
    knex.raw(`
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
    `),
  ];

  static relations = [
    {
      modelClass: 'image',
      join: {
        type: 'leftOuter',
        from: 'image.file_id',
        to: 'users.image_id',
      },
    },
    {
      modelClass: 'social_media',
      join: {
        type: 'leftOuter',
        from: 'social_media.user_id',
        to: 'users.id',
      },
    },
  ];

  static async update(userId, data) {
    const results = await knex.transaction(async (trx) => {
      const imageToUpdate = {
        file_id: data.fileId,
        image: data.image,
        thumbnail: data.thumbnail,
      };

      const { imageId: oldImageId } = await this.table
        .first('image_id')
        .where('id', userId)
        .transacting(trx);

      if (oldImageId !== data.fileId) {
        await ImageModel.insert(trx, imageToUpdate);
      }

      await super.update(
        trx,
        userId,
        {
          display_name: data.displayName,
          username: data.username,
          email: data.email,
          website: data.website,
          location: data.location,
          location_code: data.locationCode,
          image_id: data.fileId,
        },
        ['id']
      );

      const updatedUser = await super.findBy(
        {
          column: 'users.id',
          operator: '=',
          value: userId,
        },
        trx
      );

      return updatedUser[0];
    });

    return results;
  }
}

module.exports = UsersModel;
