import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

// note
// When you define routes with parameters, the values of these parameters can be accessed via req.params
// eg. if a route is defined like /users/:userId, value of userId can be accessed using req.params.userId
// req.params (provided by expressJs): to access url parameters in the server side.
// useParams() (provided by react): to access url parameters in the client side.

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

export const getposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            }),
        })
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalPosts = await Post.countDocuments();
        res.status(200).json({
            posts,
            totalPosts,
        });
    } catch (error) {
        next(error);
    }
};

// this controller is invoked when u ar at /getpost/:postSlug url, req.params can extract the value of postSlug from the url.
export const getpost = async (req, res, next) => {
    const postSlug = req.params.postSlug;
    try {
        /*
        const post = await Post.findOne({postSlug});
        When you use findOne({ postSlug }), MongoDB is looking for a document where the field name is postSlug and its value is equal to the value of postSlug variable.  However, if your field in the database is named slug (or something else), you need to query using that field name.
        
        */
        const post = await Post.findOne({ slug: postSlug });
        if (!post) {
            return next(errorHandler(404, "post is not found"));
        }
        res.status(200).json({
            post: post
        })
    }
    catch (error) {
        next(error);
    }
}

export const deletepost = async (req, res, next) => {
    if (!req.user.isAdmin) return next(errorHandler(401, "unauthorized request, you are not an admin"))
    try {
        await Post.findByIdAndDelete(
            //extract postId from url
            req.params.postId
        );
        res.status(200).json("the post has been deleted");
    }
    catch (error) {
        next(error);
    }
};

export const updatepost = async (req, res, next) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.category,
                    image: req.body.image,
                },
            },
            { new: true }
        );
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};


// /getSearchPost/:searchTerm
// export const getSearchPost = async (req, res, next) => {
//     const searchTerm = req.params.searchTerm;
//     try {
//         const posts = await Post.find({category: searchTerm});
//         if(posts.length == 0){
//             return next(errorHandler(401,"search not found"));
//         }
//         res.status(200).json({
//             posts: posts
//         })
//     }
//     catch (error) {
//         return next(error);
//     }
// }

