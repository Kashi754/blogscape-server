const Model = require('./Model/Model');

class PostTagModel extends Model {
  static tableName = 'post_tag';
  static resultLimit = 10;
  static resultOrder = [
    {
      column: 'name',
      direction: 'asc',
    },
    {
      column: 'id',
      direction: 'asc',
    },
  ];

  static selectableProps = [
    'post_tag.tag_id as tag_id',
    'post_tag.post_id as post_id',
    'tag.name as name',
  ];

  static relations = [
    {
      modelClass: 'tag',
      join: {
        type: 'join',
        from: 'tag.id',
        to: 'post_tag.tag_id',
      },
    },
  ];

  static async insert(trx, postId, tags) {
    const existingTags = await super.findBy(
      {
        type: 'In',
        column: 'name',
        value: tags,
      },
      trx,
      'tag_id'
    );

    const nonExistentTags = tags.filter(
      (tag) => !existingTags.some((t) => t.name === tag)
    );

    if (nonExistentTags.length > 0) {
      const error = new Error('One or more tags not found');
      error.status = 404;
      throw error;
    }

    await super.insert(
      trx,
      existingTags.map((tag) => ({
        post_id: postId,
        tag_id: tag.tagId,
      }))
    );
  }

  static async update(trx, postId, tags) {
    // Select tag ids for the supplied tag names
    const existingTags = await super.findBy(
      {
        type: 'In',
        column: 'name',
        value: tags,
      },
      trx
    );

    // Verify all supplied tags exist
    const nonExistentTags = tags.filter(
      (tag) => !existingTags.some((t) => t.name === tag)
    );

    // If any tags don't exist, throw an error
    if (nonExistentTags.length > 0) {
      const error = new Error('One or more tags not found');
      error.status = 404;
      throw error;
    }

    const tagIdsToInsert = existingTags.map((tag) => ({
      post_id: postId,
      tag_id: tag.tagId,
    }));

    // Insert new records into post_tag
    await this.table
      .transacting(trx)
      .insert(tagIdsToInsert)
      .onConflict(['post_id', 'tag_id'])
      .ignore();

    // Remove old records from post_tag

    await this.table
      .transacting(trx)
      .whereNotIn(
        'tag_id',
        existingTags.map((tag) => tag.tagId)
      )
      .where('post_id', postId)
      .del();
  }
}

module.exports = PostTagModel;
