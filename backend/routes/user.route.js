import express from 'express';
import {test, updateUser, deleteUser} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';;

const router = express.Router();

router.get('/test', test);

// to update the profile, we need user_id. we should ensure that the user updating the profile is the same user who owns the profile. Without proper authentication and authorization mechanisms, anyone could potentially modify someone else's profile, leading to unauthorized changes or breaches of privacy.

//verifyToken will attatch the authenticated user details to the req body, this ensures the user updates his details only and not someone else's.
router.put('/update/:userId', verifyToken,updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);

export default router;