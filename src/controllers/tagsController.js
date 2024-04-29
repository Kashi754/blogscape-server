const asyncHandler = require('express-async-handler');
const TagModel = require('../models/TagModel');

exports.tagsList = asyncHandler(async (req, res) => {
  const tags = await TagModel.list();
  res.send(tags);
});

exports.tagsCreateTag = asyncHandler(async (req, res) => {
  const tagBody = { name: req.body.tag };

  if (!tagBody.name.startsWith('#')) {
    tagBody.name = `#${tagBody.name}`;
  }
  try {
    const tag = await TagModel.insert(null, tagBody);
    res.send(tag[0]);
  } catch (error) {
    const tag = await TagModel.findBy({
      column: 'name',
      operator: '=',
      value: tagBody.name,
    });
    res.send(tag[0]);
  }
});
