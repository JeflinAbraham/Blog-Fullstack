import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
export const verifyToken = (req, res, next) => {

    // get the accessToken from req.cookies (we ll get the token if the user is authenticated).
    const token = req.cookies.access_token;

    if (!token) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    // If the token is valid, the callback function will receive the decoded user information.
    // the decoded user info will contain ('id','isAdmin') properties of the user, since these properties were used to sign the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(401, 'Unauthorized'));
        }

        // req.user = user: user details of the authenticated user ll be attatched to the req body. This allows the user information to be conveniently accessed in subsequent middleware functions.
        req.user = user;
        next();
    });
};