import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
    //after excecuting verifyToken middleware, req.user will contain user info (id, isAdmin)
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a post'));
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, 'Please provide all required fields'));
    }
    const slug = req.body.title
        // Split the title string into an array of words using spaces as the delimiter
        .split(' ')

        // Join the array of words back into a single string with hyphens between them
        .join('-')
        .toLowerCase()

        // ^ when used within [] means negation.
        // This removes any character that is not a letter (a-z, A-Z), a number (0-9), or a hyphen (-)
        // g means the replacement is done globally.
        .replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};