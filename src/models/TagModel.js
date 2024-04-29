const Model = require('./Model/Model');

class TagModel extends Model {
  static tableName = 'tag';
  static resultLimit = 500;
  static resultOrder = [
    {
      column: 'name',
      direction: 'asc',
    },
  ];
  static selectableProps = ['id', 'name'];
}

module.exports = TagModel;
