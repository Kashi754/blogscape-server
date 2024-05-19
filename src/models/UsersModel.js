const { imageKit } = require('../config/imageKit');
const knex = require('../database');
const BlogModel = require('./BlogModel');
const ImageModel = require('./ImageModel');
const Model = require('./Model/Model');
const SocialMediaModel = require('./SocialMediaModel');

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
    'user_image.file_id as fileId',
    'user_image.image as image',
    'user_image.thumbnail as thumbnail',
    BlogModel.ftsBlogJSON,
    SocialMediaModel.socialMediaJSON,
  ];

  static relations = [
    {
      modelClass: 'image as user_image',
      join: {
        type: 'leftOuter',
        from: 'user_image.file_id',
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
    {
      modelClass: 'fts_blog',
      join: {
        type: 'join',
        from: 'fts_blog.user_id',
        to: 'users.id',
      },
    },
  ];

  static userCommentJSON = knex.raw(`
    json_build_object(
      'id', users.id,
      'display_name', users.display_name,
      'thumbnail', image.thumbnail
    ) as user
  `);

  static async create(data) {
    const results = await knex.transaction(async (trx) => {
      const { blogTitle, ...user } = data;
      try {
        const userResults = await super.insert(trx, user, 'id');
        const userId = userResults[0].id;

        const blogResults = await knex('blog')
          .transacting(trx)
          .insert({
            title: blogTitle,
            user_id: userId,
          })
          .returning('id');

        const blogId = blogResults[0].id;

        return {
          userId,
          blogId,
        };
      } catch (err) {
        console.log('error: ', err);
        return null;
      }
    });
    return results;
  }

  static async updateProfile(userId, data) {
    const results = await knex.transaction(async (trx) => {
      const imageToUpdate = {
        file_id: data.file_id,
        image: data.image,
        thumbnail: data.thumbnail,
      };

      const { imageId: oldImageId } = await this.table
        .first('image_id')
        .where('id', userId)
        .transacting(trx);

      if (oldImageId !== data.file_id) {
        await ImageModel.insert(trx, imageToUpdate);
      }

      await super.update(
        trx,
        userId,
        {
          display_name: data.display_name,
          username: data.username,
          email: data.email,
          website: data.website,
          location: data.location,
          location_code: data.locationCode,
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

  static async getUserLogin(username) {
    const user = knex.transaction(async (trx) => {
      const result = await this.table
        .transacting(trx)
        .join('blog', 'users.id', '=', 'blog.user_id')
        .where('users.username', username)
        .first(
          'users.id as id',
          'users.display_name as display_name',
          'users.password_hash as password_hash',
          'blog.id as blog_id'
        );

      return result;
    });

    return user;
  }

  static async getPasswordHash(userId) {
    const { passwordHash = null } = await knex.transaction(async (trx) => {
      return await this.table
        .where('id', userId)
        .transacting(trx)
        .first('password_hash');
    });

    return passwordHash;
  }
}

module.exports = UsersModel;
