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
  const { postId } = req.params;
  try {
    const comments = await Comment.find({
      postId
    })
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};


// this controller ll be invoked when u r at /likeComment/:commentId url.
// req.params ll extract the value of commentId.
export const likeComment = async (req, res, next) => {
  try {
    //check if the comment exists or not.
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }

    // with verifyToken middleware, we can get the id of currently authenticated user. 
    const userIndex = comment.likes.indexOf(req.user.id);

    //if the user hasn't liked the comment
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } 

    else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

    //after updating the comment, save it
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};