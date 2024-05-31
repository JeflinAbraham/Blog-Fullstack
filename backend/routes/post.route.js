import express from 'express';
import { verifyToken } from '../utils/verifyToken.js';
import {create, getposts, deletepost} from '../controllers/post.controller.js'

const router = express.Router();

// verifyToken will decode the information(id, isAdmin) about the currently authenticated user and attatches it to the req body. 
router.post('/create', verifyToken, create)
router.get('/getposts',getposts);
router.delete('/deletepost/:postId', deletepost);

export default router;