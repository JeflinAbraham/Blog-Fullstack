import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default: 'https://cdn2.iconfinder.com/data/icons/files-flat/64/file-blank-empty-default-1024.png',
    },
    category: {
        type: String,
        default: 'uncategorized',
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true })

const Post = mongoose.model('Post', PostSchema);

export default Post;