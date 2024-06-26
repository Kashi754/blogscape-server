const Model = require('./Model/Model');
const knex = require('../database');

class ImageModel extends Model {
  static tableName = 'image';
  static selectableProps = ['file_id', 'image', 'thumbnail'];

  static async insert(trx, image, returning) {
    const imageData = await super.insert(trx, image, returning);

    return imageData;
  }

  static async delete(trx, imageId) {
    await super.delete(trx, { file_id: imageId });
  }
}

module.exports = ImageModel;
