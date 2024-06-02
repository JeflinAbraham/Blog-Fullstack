import express from 'express';
import { createComment, getPostComments, likeComment, deleteComment} from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyToken.js'

const router = express.Router();

router.post('/create', createComment);
router.get('/getPostComments/:postId', getPostComments);
router.put('/likeComment/:commentId', verifyToken,likeComment);
router.delete('/deleteComment/:commentId', verifyToken, deleteComment);
export default router;