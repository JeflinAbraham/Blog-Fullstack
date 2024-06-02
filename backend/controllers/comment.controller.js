import Comment from '../models/comment.model.js';

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};


// this controller ll be invoked when u r at /getPostComments/:postId url.
// req.params ll extract the value of postId (destructuring). 
export const getPostComments = async (req, res, next) => {
    const {postId} = req.params;
    try {
      const comments = await Comment.find({
        postId
    })
    .sort({createdAt: -1});
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  };