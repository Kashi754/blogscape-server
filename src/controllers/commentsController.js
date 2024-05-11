const asyncHandler = require('express-async-handler');
const CommentModel = require('../models/CommentModel');

exports.commentsList = asyncHandler(async (req, res) => {
  const { commentId, beforeDate, beforeId, limit } = req.query;
  const postId = req.params.id;

  if ((beforeDate && !beforeId) || (!beforeDate && beforeId)) {
    return res.status(400).send('Both beforeDate and beforeId are required');
  }

  const comments = await CommentModel.list(
    postId,
    commentId,
    beforeDate,
    beforeId,
    limit
  );

  if (comments.length === 0) {
    return res.status(404).send('No comments found');
  }

  res.send(comments);
});

exports.createComment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { commentId } = req.query;

  const commentToAdd = {
    body: req.body.comment,
    user_id: userId,
    post_id: req.params.id,
  };

  if (commentId) {
    commentToAdd.comment_id = commentId;
  }

  const comment = await CommentModel.create(commentToAdd);

  res.send(comment);
});
