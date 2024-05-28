import mongoose, { Mongoose, MongooseError } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    passowrd: {
        type: String,
        required: true,
    },
},{timestamps: true});

const User = mongoose.model('User, userSchema');

export default User;