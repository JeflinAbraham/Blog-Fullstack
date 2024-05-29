import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    console.log(req.body);
    console.log(typeof (req.body));
    console.log(req.body.username);
    const { username, email, password } = req.body;
    console.log("username: ", username);
    console.log("email: ", email);
    console.log("password: ", password);
    if (
        !username ||
        !email ||
        !password ||
        username.trim() === '' ||
        email.trim() === '' ||
        password.trim() == ''
    ) {
        // return res.status(400).json({ message: 'All fields are required' });

        //When an error occurs in the signup function (for example, when a required field is missing), it calls next(error).

        //convention: When a function calls next with an argument, Express interprets the argument as an error. If no argument is provided, Express continues to the next middleware function without considering it an error.
        //When next is called with an argument (in this case, an error generated by errorHandler), Express recognizes that an error has occurred within the signup function. It then looks for the next middleware function that takes four parameters (err, req, res, next) to handle errors.
        return next(errorHandler(400, 'All fields are required'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        //username: username
        username,
        email,
        password: hashedPassword,
    });

    //try to create a new user using the credentials passed.
    //in case of any error such as duplicate usernames/email, throw an  error. 
    try {
        await newUser.save();
        res.json("signup successful");
    } catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email.trim() === '') {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        //if the user is registered, findOne will find one document in the users collections where the email id matches.
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User not found'));
        }

        //password: normal password recieved in the req.body.
        //validUser.password: hashed password stored in the database.
        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if (!validPassword) {
            return next(errorHandler(400, 'Invalid password'));
        }

        //if all the credentials are verified, the user should be authenticated (use JWT).
        const token = jwt.sign(
            { id: validUser._id},
            process.env.JWT_SECRET
        );

        const loggedInUser = await User.findById(validUser._id).select("-password");
        res
            .status(200)
            .cookie('access_token', token, {
                httpOnly: true,
            })
            .json(loggedInUser);
    } catch (error) {
        next(error);
    }
};