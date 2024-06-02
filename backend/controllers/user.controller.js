import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const test = (req, res) => {
    res.json({ message: 'API is working!' });
};

export const updateUser = async (req, res, next) => {
    //req.user contains the id of the user.
    console.log(req.user.id);

    //extracting userId from the url, https://localhost//api/user/update/:userId
    console.log(req.params.userId);

    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this user'));
    }

    //update password
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    //update username
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username cannot contain spaces'));
        }

        // ^ means start of string.
        // [a-zA-Z0-9] means any alphanumeric char.
        // + ensures that there is at least one alphanumeric character
        // $ means end of string.

        //^[a-zA-Z0-9]+$ ensures that the string contains only alphanumeric characters.
        // If the string contains any other characters (e.g., symbols, whitespace), .match() will return null (false). !false == true.
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(
                errorHandler(400, 'Username can only contain letters and numbers')
            );
        }
    }

    //update the new password/username in the database.
    try {
        const updatedUser = await User.findByIdAndUpdate(
            //search in the database for a user whose id matches with req.params.userId
            req.params.userId,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture,
                    password: req.body.password,
                },
                //to remove the password field from the document.

            },
            // to return the most updated user.
            { new: true }
        );
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    }
    catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
};

export const signout = (req, res, next) => {
    try {
        res
            .clearCookie('access_token')
            .status(200)
            .json('User has been signed out');
    } catch (error) {
        next(error);
    }
};



export const getUsers = async (req, res, next) => {
    //verifyToken middleware will add the user details such as (id,isAdmin) to the req body.
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to see all users'));
    }
    try {
        // extract data from the query parameters of the url.
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)

            //fetches atmost 9 users.
            .limit(limit);

        // The { password, ...rest } syntax means "take the password property out of user._doc, and put the remaining properties into a new object called rest".
        // After all iterations are complete, map returns a new array containing all the rest objects returned in each iteration.
        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        });

        const totalUsers = await User.countDocuments();
        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
        });
    } catch (error) {
        next(error);
    }
};


export const adminDeleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
};


// getUser controller is invoked when u are at '/:userId' url, req.params can extract the value of userId.
// to identify the users of each comment.
export const getUser = async (req, res, next) => {
    try {
        // all details of the user with the specified id is stored in 'user' variable.
        const user = await User.findById(req.params.userId);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }
        const { password, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};