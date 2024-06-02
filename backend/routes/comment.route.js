import express from 'express';
import { createComment, getPostComments } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', createComment);
router.get('/getPostComments/:postId', getPostComments);

export default router;